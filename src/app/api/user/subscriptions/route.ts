import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryEmail = searchParams.get('email');
    const cookieStore = await cookies();
    const cookieEmail = cookieStore.get('user_email')?.value;
    const email = (queryEmail || cookieEmail || 'fathisamra66@gmail.com').trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'User email is required.' },
        { status: 400 }
      );
    }

    const settings = await query<any[]>(
      'SELECT plan_name, plan_status, plan_renewal FROM user_settings WHERE LOWER(user_email) = ? LIMIT 1',
      [email]
    );

    const s = settings?.[0] || {
      plan_name: 'Entrepreneur Digital All-Access',
      plan_status: 'active',
      plan_renewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json({
      success: true,
      subscription: {
        planName: s.plan_name || 'Entrepreneur Digital All-Access',
        planStatus: s.plan_status || 'active',
        planRenewal: s.plan_renewal || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        price: s.plan_name?.includes('Annual') ? '$79.99 / year' : '$9.99 / month',
        billingCycle: s.plan_name?.includes('Annual') ? 'Annual' : 'Monthly',
      },
    });
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch subscription.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, planName, planStatus } = body;

    const email = (userEmail || '').trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'User email is required.' },
        { status: 400 }
      );
    }

    // Check if user settings exist, insert or update
    const existing = await query<any[]>(
      'SELECT id FROM user_settings WHERE LOWER(user_email) = ? LIMIT 1',
      [email]
    );

    if (existing && existing.length > 0) {
      await query(
        `UPDATE user_settings 
         SET plan_name = COALESCE(?, plan_name),
             plan_status = COALESCE(?, plan_status)
         WHERE LOWER(user_email) = ?`,
        [planName || null, planStatus || null, email]
      );
    } else {
      await query(
        `INSERT INTO user_settings (user_email, plan_name, plan_status)
         VALUES (?, ?, ?)`,
        [email, planName || 'Entrepreneur Digital All-Access', planStatus || 'active']
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription updated successfully.',
      subscription: {
        planName: planName || 'Entrepreneur Digital All-Access',
        planStatus: planStatus || 'active',
      },
    });
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update subscription.' },
      { status: 500 }
    );
  }
}
