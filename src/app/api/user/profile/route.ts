import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryEmail = searchParams.get('email');
    const cookieStore = await cookies();
    const cookieEmail = cookieStore.get('user_email')?.value;
    const email = (queryEmail || cookieEmail || 'fathisamra66@gmail.com').trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ success: false, error: 'No user email provided.' }, { status: 400 });
    }

    // Query user in MySQL
    const users = await query<any[]>(
      'SELECT id, name, email, role, avatar, created_at FROM users WHERE LOWER(email) = ? LIMIT 1',
      [email]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: `Account with email "${email}" not found.` },
        { status: 404 }
      );
    }

    const u = users[0];
    const nameParts = (u.name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Fetch user settings/profile extras
    const settings = await query<any[]>(
      'SELECT bio, phone, facebook_connected, google_connected, plan_name, plan_status, plan_renewal FROM user_settings WHERE LOWER(user_email) = ? LIMIT 1',
      [email]
    );

    const s = settings?.[0] || {};

    return NextResponse.json({
      success: true,
      profile: {
        id: u.id,
        firstName,
        lastName,
        fullName: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar || '/images/user-avatar-butterfly.png',
        bio: s.bio || '',
        phone: s.phone || '',
        facebookConnected: Boolean(s.facebook_connected),
        googleConnected: s.google_connected !== undefined ? Boolean(s.google_connected) : true,
        planName: s.plan_name || 'Entrepreneur Digital All-Access',
        planStatus: s.plan_status || 'active',
        planRenewal: s.plan_renewal || null,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch user profile.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      currentEmail,
      firstName,
      lastName,
      avatar,
      newEmail,
      bio,
      phone,
      currentPassword,
      newPassword,
      facebookConnected,
      googleConnected,
    } = body;

    const emailToFind = (currentEmail || '').trim().toLowerCase();
    if (!emailToFind) {
      return NextResponse.json(
        { success: false, error: 'Current user email is required.' },
        { status: 400 }
      );
    }

    // Verify user exists in MySQL
    const users = await query<any[]>(
      'SELECT id, name, email, password_hash, role, avatar FROM users WHERE LOWER(email) = ? LIMIT 1',
      [emailToFind]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User account not found.' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is required to set a new password.' },
          { status: 400 }
        );
      }
      if (user.password_hash) {
        const passwordMatches = await bcrypt.compare(String(currentPassword), user.password_hash);
        if (!passwordMatches) {
          return NextResponse.json(
            { success: false, error: 'Current password does not match.' },
            { status: 400 }
          );
        }
      }
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(String(newPassword), salt);
      await query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user.id]);
    }

    // Handle Name update
    let updatedFullName = user.name;
    if (firstName !== undefined || lastName !== undefined) {
      const fName = firstName !== undefined ? String(firstName).trim() : user.name.split(' ')[0] || '';
      const lName = lastName !== undefined ? String(lastName).trim() : user.name.split(' ').slice(1).join(' ') || '';
      updatedFullName = `${fName} ${lName}`.trim();
      await query('UPDATE users SET name = ? WHERE id = ?', [updatedFullName, user.id]);
    }

    // Handle Avatar update
    let updatedAvatar = user.avatar;
    if (avatar !== undefined) {
      updatedAvatar = String(avatar).trim();
      await query('UPDATE users SET avatar = ? WHERE id = ?', [updatedAvatar, user.id]);
    }

    // Handle Email update
    let targetEmail = user.email;
    if (newEmail && String(newEmail).trim().toLowerCase() !== emailToFind) {
      const cleanNewEmail = String(newEmail).trim().toLowerCase();
      // Check if new email is already in use
      const existing = await query<any[]>(
        'SELECT id FROM users WHERE LOWER(email) = ? AND id != ? LIMIT 1',
        [cleanNewEmail, user.id]
      );
      if (existing && existing.length > 0) {
        return NextResponse.json(
          { success: false, error: 'This email address is already in use by another account.' },
          { status: 409 }
        );
      }
      await query('UPDATE users SET email = ? WHERE id = ?', [cleanNewEmail, user.id]);
      await query('UPDATE user_settings SET user_email = ? WHERE LOWER(user_email) = ?', [cleanNewEmail, emailToFind]);
      await query('UPDATE user_saved_articles SET user_email = ? WHERE LOWER(user_email) = ?', [cleanNewEmail, emailToFind]);
      targetEmail = cleanNewEmail;
    }

    // Handle Bio / Social accounts in user_settings
    const existingSettings = await query<any[]>(
      'SELECT id FROM user_settings WHERE LOWER(user_email) = ? LIMIT 1',
      [targetEmail]
    );

    if (existingSettings && existingSettings.length > 0) {
      await query(
        `UPDATE user_settings 
         SET bio = COALESCE(?, bio),
             phone = COALESCE(?, phone),
             facebook_connected = COALESCE(?, facebook_connected),
             google_connected = COALESCE(?, google_connected)
         WHERE LOWER(user_email) = ?`,
        [
          bio !== undefined ? bio : null,
          phone !== undefined ? phone : null,
          facebookConnected !== undefined ? (facebookConnected ? 1 : 0) : null,
          googleConnected !== undefined ? (googleConnected ? 1 : 0) : null,
          targetEmail,
        ]
      );
    } else {
      await query(
        `INSERT INTO user_settings (user_email, bio, phone, facebook_connected, google_connected, plan_name, plan_status)
         VALUES (?, ?, ?, ?, ?, 'Entrepreneur Digital All-Access', 'active')`,
        [
          targetEmail,
          bio || '',
          phone || null,
          facebookConnected ? 1 : 0,
          googleConnected !== undefined ? (googleConnected ? 1 : 0) : 1,
        ]
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: {
        id: user.id,
        fullName: updatedFullName,
        email: targetEmail,
        avatar: updatedAvatar,
        bio: bio !== undefined ? bio : '',
      },
    });

    // Update cookie if email changed
    if (targetEmail !== emailToFind) {
      response.cookies.set('user_email', targetEmail, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
