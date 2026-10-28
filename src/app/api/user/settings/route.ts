import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryEmail = searchParams.get('email');
    const cookieStore = await cookies();
    const cookieEmail = cookieStore.get('user_email')?.value;
    const email = (queryEmail || cookieEmail || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'User email is required.' },
        { status: 400 }
      );
    }

    const settings = await query<any[]>(
      'SELECT breaking_news_alerts, daily_digest, marketing_emails, language, timezone FROM user_settings WHERE LOWER(user_email) = ? LIMIT 1',
      [email]
    );

    const s = settings?.[0] || {
      breaking_news_alerts: 1,
      daily_digest: 1,
      marketing_emails: 0,
      language: 'en-US',
      timezone: 'America/New_York',
    };

    return NextResponse.json({
      success: true,
      settings: {
        breakingNewsAlerts: Boolean(s.breaking_news_alerts),
        dailyDigest: Boolean(s.daily_digest),
        marketingEmails: Boolean(s.marketing_emails),
        language: s.language || 'en-US',
        timezone: s.timezone || 'America/New_York',
      },
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch settings.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      userEmail,
      breakingNewsAlerts,
      dailyDigest,
      marketingEmails,
      language,
      timezone,
    } = body;

    const email = (userEmail || '').trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'User email is required.' },
        { status: 400 }
      );
    }

    const existing = await query<any[]>(
      'SELECT id FROM user_settings WHERE LOWER(user_email) = ? LIMIT 1',
      [email]
    );

    if (existing && existing.length > 0) {
      await query(
        `UPDATE user_settings 
         SET breaking_news_alerts = COALESCE(?, breaking_news_alerts),
             daily_digest = COALESCE(?, daily_digest),
             marketing_emails = COALESCE(?, marketing_emails),
             language = COALESCE(?, language),
             timezone = COALESCE(?, timezone)
         WHERE LOWER(user_email) = ?`,
        [
          breakingNewsAlerts !== undefined ? (breakingNewsAlerts ? 1 : 0) : null,
          dailyDigest !== undefined ? (dailyDigest ? 1 : 0) : null,
          marketingEmails !== undefined ? (marketingEmails ? 1 : 0) : null,
          language || null,
          timezone || null,
          email,
        ]
      );
    } else {
      await query(
        `INSERT INTO user_settings (user_email, breaking_news_alerts, daily_digest, marketing_emails, language, timezone)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          email,
          breakingNewsAlerts ? 1 : 0,
          dailyDigest ? 1 : 0,
          marketingEmails ? 1 : 0,
          language || 'en-US',
          timezone || 'America/New_York',
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account settings updated successfully.',
      settings: {
        breakingNewsAlerts,
        dailyDigest,
        marketingEmails,
        language,
        timezone,
      },
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update settings.' },
      { status: 500 }
    );
  }
}
