import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const emailCookie = cookieStore.get('user_email')?.value;
    const isLoggedOut = cookieStore.get('logged_out')?.value === 'true';

    const roleCookie = cookieStore.get('user_role')?.value;

    // Prioritize active session email from cookie; fallback based on role or default user
    let fallbackEmail = 'samrathasneem20@gmail.com';
    if (roleCookie === 'writer' || roleCookie === 'writter') {
      fallbackEmail = 'writter@gmail.com';
    }
    const targetEmail = emailCookie || (!isLoggedOut ? fallbackEmail : null);

    if (!targetEmail) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const users = await query<any[]>(
      'SELECT id, name, email, role, avatar, bio, writer_name, linkedin_url FROM users WHERE LOWER(email) = ? LIMIT 1',
      [targetEmail.toLowerCase()]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const u = users[0];

    // Check user_settings for any additional overrides
    const settings = await query<any[]>(
      'SELECT bio, writer_name, linkedin_url, avatar FROM user_settings WHERE LOWER(user_email) = ? LIMIT 1',
      [targetEmail.toLowerCase()]
    );
    const s = settings?.[0] || {};

    return NextResponse.json({
      authenticated: true,
      user: {
        id: u.id,
        name: u.name || 'mishal',
        email: u.email,
        role: u.role || 'writer',
        avatar: s.avatar || u.avatar || '/images/user-avatar-butterfly.png',
        bio: s.bio || u.bio || '',
        writerName: s.writer_name || u.writer_name || u.name,
        linkedinUrl: s.linkedin_url || u.linkedin_url || '',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error?.message }, { status: 500 });
  }
}
