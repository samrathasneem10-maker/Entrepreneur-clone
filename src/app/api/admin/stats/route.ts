import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    let pendingCount = 0;
    let publishedCount = 0;
    let subscribersCount = 0;
    let usersCount = 0;

    try {
      const pRows = await query<any[]>(
        'SELECT COUNT(*) as c FROM articles WHERE LOWER(COALESCE(status, "published")) = "pending_review" OR LOWER(COALESCE(status, "published")) = "pending review"'
      );
      if (pRows && pRows[0]) {
        pendingCount = Number(pRows[0].c || 0);
      }
    } catch (err) {
      console.warn('Stats pending count query fallback:', err);
    }

    try {
      const pubRows = await query<any[]>(
        'SELECT COUNT(*) as c FROM articles WHERE LOWER(COALESCE(status, "published")) = "published"'
      );
      if (pubRows && pubRows[0]) {
        publishedCount = Number(pubRows[0].c || 0);
      }
    } catch (err) {
      console.warn('Stats published count query fallback:', err);
    }

    try {
      const subRows = await query<any[]>('SELECT COUNT(*) as c FROM subscribers');
      if (subRows && subRows[0]) {
        subscribersCount = Number(subRows[0].c || 0);
      }
    } catch (err) {
      console.warn('Stats subscribers count query fallback:', err);
    }

    try {
      const uRows = await query<any[]>('SELECT COUNT(*) as c FROM users');
      if (uRows && uRows[0]) {
        usersCount = Number(uRows[0].c || 0);
      }
    } catch (err) {
      console.warn('Stats users count query fallback:', err);
    }

    return NextResponse.json({
      success: true,
      stats: {
        activeReviews: pendingCount,
        completedReleases: publishedCount,
        newsletterSubs: subscribersCount,
        totalUsers: usersCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch admin stats',
        stats: {
          activeReviews: 0,
          completedReleases: 0,
          newsletterSubs: 0,
          totalUsers: 0,
        },
      },
      { status: 500 }
    );
  }
}
