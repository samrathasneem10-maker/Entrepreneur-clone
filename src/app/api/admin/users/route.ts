import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  role: 'admin' | 'writer' | 'reader';
  isDefaultAdmin?: boolean;
  avatar?: string;
  bio?: string;
  linkedinUrl?: string;
  createdAt?: string;
}

const DEFAULT_ADMIN_EMAILS = [
  'akramyoonos006@gmail.com',
];

function isDefaultAdminAccount(account?: {
  email?: string;
  name?: string;
  isDefaultAdmin?: boolean;
}): boolean {
  if (!account) return false;
  if (account.isDefaultAdmin) return true;
  const email = String(account.email || '').toLowerCase().trim();
  const name = String(account.name || '').toLowerCase().trim();
  if (DEFAULT_ADMIN_EMAILS.includes(email)) return true;
  if (
    name === 'mohamed azmy mohamed akram' ||
    name === 'mohamedajmi'
  ) {
    return true;
  }
  return false;
}

const INITIAL_REQUIRED_ACCOUNTS: AdminUser[] = [
  {
    id: 'init-1',
    name: 'Mohamed Azmy Mohamed Akram',
    email: 'akramyoonos006@gmail.com',
    role: 'admin',
    isDefaultAdmin: true,
    bio: 'New Washington Times subscriber via Google.',
    createdAt: '2026-10-15',
  },
];

function normalizeRole(roleStr: any): 'admin' | 'writer' | 'reader' {
  const r = String(roleStr || '').toLowerCase().trim();
  if (r === 'admin' || r === 'administrator') return 'admin';
  if (r === 'writer' || r === 'writter' || r === 'author' || r === 'editor') return 'writer';
  return 'reader';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let dbUsers: any[] = [];
    try {
      dbUsers = await query<any[]>(
        'SELECT id, name, email, role, avatar, bio, linkedin_url as linkedinUrl, created_at as createdAt FROM users ORDER BY id ASC'
      );
    } catch (err) {
      console.warn('GET /api/admin/users DB query warning:', err);
    }

    const userMap = new Map<string, AdminUser>();

    // 1. Baseline initial Default Admin account
    INITIAL_REQUIRED_ACCOUNTS.forEach((acc) => {
      userMap.set(acc.email.toLowerCase(), { ...acc });
    });

    // 2. Overlay / add real users from the database
    if (Array.isArray(dbUsers) && dbUsers.length > 0) {
      dbUsers.forEach((du) => {
        const cleanEmail = String(du.email || '').trim().toLowerCase();
        if (!cleanEmail) return;

        const normalizedRole = normalizeRole(du.role);
        const isDefAdmin = isDefaultAdminAccount({
          email: cleanEmail,
          name: du.name,
        });

        // If avatar is placeholder butterfly, treat as unuploaded (null) so initials avatar is shown
        const rawAvatar = du.avatar ? String(du.avatar) : '';
        const cleanAvatar = rawAvatar && !rawAvatar.includes('butterfly') ? rawAvatar : undefined;

        userMap.set(cleanEmail, {
          id: `db-${du.id}`,
          name: du.name || (isDefAdmin ? 'Mohamed Azmy Mohamed Akram' : 'User'),
          email: du.email,
          role: normalizedRole,
          avatar: cleanAvatar,
          bio: du.bio || undefined,
          linkedinUrl: normalizedRole === 'writer' ? (du.linkedinUrl || 'https://www.linkedin.com/in/fathima-samra-8823b634a') : undefined,
          createdAt: du.createdAt
            ? new Date(du.createdAt).toISOString().split('T')[0]
            : '2026-10-01',
          isDefaultAdmin: isDefAdmin,
        });
      });
    }

    const allUsersList = Array.from(userMap.values());

    // Sort: Default Admin (Mohamed Azmy Mohamed Akram) at the very top, others below
    allUsersList.sort((a, b) => {
      const aEmail = a.email.toLowerCase();
      const bEmail = b.email.toLowerCase();
      if (aEmail === 'akramyoonos006@gmail.com') return -1;
      if (bEmail === 'akramyoonos006@gmail.com') return 1;
      return 0;
    });

    let filtered = allUsersList;
    if (role && role !== 'all') {
      filtered = allUsersList.filter((u) => u.role === normalizeRole(role));
    }

    const counts = {
      all: allUsersList.length,
      admins: allUsersList.filter((u) => u.role === 'admin').length,
      writers: allUsersList.filter((u) => u.role === 'writer').length,
      readers: allUsersList.filter((u) => u.role === 'reader').length,
    };

    return NextResponse.json({
      success: true,
      users: filtered,
      counts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role = 'reader', password = 'Password123!' } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanRole = normalizeRole(role);
    const passwordHash = await bcrypt.hash(String(password || 'Password123!'), 10);

    let dbId: string | number = `u-${Date.now()}`;
    try {
      const insertRes: any = await query(
        `INSERT INTO users (name, email, role, password_hash, writer_name)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           role = VALUES(role),
           writer_name = VALUES(writer_name),
           password_hash = COALESCE(password_hash, VALUES(password_hash))`,
        [cleanName, cleanEmail, cleanRole, passwordHash, cleanName]
      );
      if (insertRes?.insertId) {
        dbId = `db-${insertRes.insertId}`;
      }
    } catch (err) {
      console.warn('POST /api/admin/users MySQL insert fallback:', (err as any)?.message);
    }

    const isDefAdmin = isDefaultAdminAccount({ email: cleanEmail, name: cleanName });

    const newUser: AdminUser = {
      id: dbId,
      name: cleanName,
      email: cleanEmail,
      role: cleanRole,
      isDefaultAdmin: isDefAdmin,
      createdAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, originalEmail, role, password, requesterEmail } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const lookupEmail = String(originalEmail || email).trim().toLowerCase();
    const cleanRole = normalizeRole(role);
    const cleanRequesterEmail = String(requesterEmail || '').trim().toLowerCase();

    const isRequesterDefaultAdmin = isDefaultAdminAccount({ email: cleanRequesterEmail });
    const isTargetDefaultAdmin =
      isDefaultAdminAccount({ email: lookupEmail }) || isDefaultAdminAccount({ email: cleanEmail });

    // Permissions logic:
    // Only Default Admin can edit any user.
    // A regular Admin can View and Edit their own account, View other Admin and Default Admin accounts only,
    // and View, Edit, and Delete Writer and Reader accounts.
    if (!isRequesterDefaultAdmin) {
      const isSelf = Boolean(cleanRequesterEmail && lookupEmail === cleanRequesterEmail);

      // Cannot edit Default Admin accounts
      if (isTargetDefaultAdmin) {
        return NextResponse.json(
          { success: false, error: 'Regular administrators cannot edit Default Administrator accounts.' },
          { status: 403 }
        );
      }

      // Check target's current role in DB
      let targetCurrentRole = cleanRole;
      try {
        const rows: any[] = await query('SELECT role FROM users WHERE LOWER(email) = ?', [lookupEmail]);
        if (rows && rows.length > 0) {
          targetCurrentRole = normalizeRole(rows[0].role);
        }
      } catch {
        // fallback
      }

      // If target is another admin and not self -> forbidden
      if (targetCurrentRole === 'admin' && !isSelf) {
        return NextResponse.json(
          { success: false, error: 'Regular administrators can only view other admin accounts.' },
          { status: 403 }
        );
      }
    }

    try {
      if (password && String(password).trim().length > 0) {
        const passwordHash = await bcrypt.hash(String(password).trim(), 10);
        await query(
          'UPDATE users SET name = ?, email = ?, role = ?, writer_name = ?, password_hash = ? WHERE LOWER(email) = ?',
          [cleanName, cleanEmail, cleanRole, cleanName, passwordHash, lookupEmail]
        );
      } else {
        await query(
          'UPDATE users SET name = ?, email = ?, role = ?, writer_name = ? WHERE LOWER(email) = ?',
          [cleanName, cleanEmail, cleanRole, cleanName, lookupEmail]
        );
      }
    } catch (err) {
      console.warn('PUT /api/admin/users MySQL update fallback:', (err as any)?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: { id, name: cleanName, email: cleanEmail, role: cleanRole },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const requesterEmail = searchParams.get('requesterEmail');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required to delete user.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRequesterEmail = String(requesterEmail || '').trim().toLowerCase();

    // Cannot delete own logged-in account
    if (cleanRequesterEmail && cleanEmail === cleanRequesterEmail) {
      return NextResponse.json(
        { success: false, error: 'You cannot delete your own account.' },
        { status: 400 }
      );
    }

    const isRequesterDefaultAdmin = isDefaultAdminAccount({ email: cleanRequesterEmail });
    const isTargetDefaultAdmin = isDefaultAdminAccount({ email: cleanEmail });

    // Default admin accounts can never be deleted by regular admins
    if (isTargetDefaultAdmin && !isRequesterDefaultAdmin) {
      return NextResponse.json(
        { success: false, error: 'Default administrator account cannot be deleted.' },
        { status: 403 }
      );
    }

    // Regular admin permissions check:
    // "A regular Admin can View and Edit their own account, View other Admin and Default Admin accounts only, and View, Edit, and Delete Writer and Reader accounts."
    if (!isRequesterDefaultAdmin) {
      let targetRole = '';
      try {
        const rows: any[] = await query('SELECT role FROM users WHERE LOWER(email) = ?', [cleanEmail]);
        if (rows && rows.length > 0) {
          targetRole = normalizeRole(rows[0].role);
        }
      } catch {
        // fallback
      }

      if (targetRole === 'admin') {
        return NextResponse.json(
          { success: false, error: 'Regular administrators cannot delete other admin accounts.' },
          { status: 403 }
        );
      }
    }

    try {
      await query('DELETE FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    } catch (err) {
      console.warn('DELETE /api/admin/users MySQL delete fallback:', (err as any)?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
