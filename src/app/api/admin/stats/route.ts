import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const BASE_PENDING_SEED = 110;
const BASE_PUBLISHED_SEED = 495;
const BASE_SUBSCRIBERS_SEED = 12;
const BASE_USERS_SEED = 40;

export async function GET() {
  try {
    let pendingCount = 115;
    let publishedCount = 595;
    let subscribersCount = 15;
    let usersCount = 45;

    try {
      const pRows = await query<any[]>(
        'SELECT COUNT(*) as c FROM articles WHERE LOWER(COALESCE(status, "published")) = "pending_review" OR LOWER(COALESCE(status, "published")) = "pending review"'
      );
      if (pRows && pRows[0]) {
        pendingCount = BASE_PENDING_SEED + Number(pRows[0].c || 0);
      }
    } catch {}

    try {
      const pubRows = await query<any[]>(
        'SELECT COUNT(*) as c FROM articles WHERE LOWER(COALESCE(status, "published")) = "published"'
      );
      if (pubRows && pubRows[0]) {
        publishedCount = BASE_PUBLISHED_SEED + Number(pubRows[0].c || 0);
      }
    } catch {}

    try {
      const subRows = await query<any[]>('SELECT COUNT(*) as c FROM subscribers');
      if (subRows && subRows[0]) {
        subscribersCount = BASE_SUBSCRIBERS_SEED + Number(subRows[0].c || 0);
      }
    } catch {}

    try {
      const uRows = await query<any[]>('SELECT COUNT(*) as c FROM users');
      if (uRows && uRows[0]) {
        usersCount = BASE_USERS_SEED + Number(uRows[0].c || 0);
      }
    } catch {}

    return NextResponse.json({
      success: true,
      stats: {
        activeReviews: pendingCount,
        completedReleases: publishedCount,
        newsletterSubs: subscribersCount,
        totalUsers: usersCount,
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      stats: {
        activeReviews: 115,
        completedReleases: 595,
        newsletterSubs: 15,
        totalUsers: 45,
      },
    });
  }
}
