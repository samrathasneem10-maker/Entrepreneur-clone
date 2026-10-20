import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const emailCookie = cookieStore.get('user_email')?.value;

    if (!emailCookie) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const users = await query<any[]>(
      'SELECT id, name, email, role FROM users WHERE LOWER(email) = ? LIMIT 1',
      [emailCookie.toLowerCase()]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const u = users[0];
    return NextResponse.json({
      authenticated: true,
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error?.message }, { status: 500 });
  }
}
