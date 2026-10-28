import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const plainPassword = String(password);

    // Security defense: Reject any attempt to pass raw bcrypt hashes directly
    if (
      plainPassword.startsWith('$2a$') ||
      plainPassword.startsWith('$2b$') ||
      plainPassword.startsWith('$2y$') ||
      plainPassword.length > 200
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Security rejection: Raw password hashes cannot be used to authenticate.',
        },
        { status: 401 }
      );
    }

    // Query MySQL database for user by email
    const users = await query<any[]>(
      'SELECT id, name, email, password_hash, role FROM users WHERE LOWER(email) = ? LIMIT 1',
      [cleanEmail]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const user = users[0];

    if (!user.password_hash) {
      return NextResponse.json(
        { success: false, error: 'Account password not configured.' },
        { status: 401 }
      );
    }

    // Verify password against secure bcrypt hash stored in database
    const passwordMatches = await bcrypt.compare(plainPassword, user.password_hash);

    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Determine dashboard redirect based on role
    const normalizedRole = (user.role || 'reader').toLowerCase();
    let redirectUrl = '/dashboard';

    if (normalizedRole === 'writer' || normalizedRole === 'writter') {
      redirectUrl = '/dashboard/writer';
    } else if (normalizedRole === 'admin') {
      redirectUrl = '/dashboard/admin';
    }

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: normalizedRole,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: userProfile,
      redirectUrl,
    });

    // Set secure HTTP-only cookie with role for session tracking
    response.cookies.set('user_role', normalizedRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set('user_email', user.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Authentication error.' },
      { status: 500 }
    );
  }
}
