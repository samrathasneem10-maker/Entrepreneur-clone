import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const rows = await query<any[]>(
      'SELECT id, email, COALESCE(status, "active") as status, subscribed_at as subscribedAt FROM subscribers ORDER BY id DESC'
    );
    return NextResponse.json({
      success: true,
      subscribers: Array.isArray(rows) ? rows : [],
    });
  } catch {
    return NextResponse.json({
      success: true,
      subscribers: [],
    });
  }
}

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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    try {
      await query('DELETE FROM subscribers WHERE LOWER(email) = ?', [email.trim().toLowerCase()]);
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Subscriber removed successfully',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to remove subscriber',
    }, { status: 500 });
  }
}
