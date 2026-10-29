import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const emailCookie = cookieStore.get('user_email')?.value;
    const isLoggedOut = cookieStore.get('logged_out')?.value === 'true';

    // Prioritize active session email from cookie; fallback to samrathasneem10@gmail.com if not logged out
    const targetEmail = emailCookie || (!isLoggedOut ? 'samrathasneem10@gmail.com' : null);

    if (!targetEmail) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const users = await query<any[]>(
      'SELECT id, name, email, role, avatar FROM users WHERE LOWER(email) = ? LIMIT 1',
      [targetEmail.toLowerCase()]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const u = users[0];
    return NextResponse.json({
      authenticated: true,
      user: {
        id: u.id,
        name: u.name || 'Samra Tasneem',
        email: u.email,
        role: u.role || 'reader',
        avatar: u.avatar || '/images/user-avatar-butterfly.png',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error?.message }, { status: 500 });
  }
}
