import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Valid email address is required',
      }, { status: 400 });
    }

    await query(
      `INSERT INTO subscribers (email, status)
       VALUES (?, 'active')
       ON DUPLICATE KEY UPDATE status = 'active'`,
      [email.trim().toLowerCase()]
    );

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully! Saved to MySQL database.',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to save subscription',
    }, { status: 500 });
  }
}
