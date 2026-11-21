import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function slugify(text: string) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  // 1. Delegate directly to backend service on port 5000
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/authors`, { cache: 'no-store' });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch (backendErr) {
    // Fallback to local query
  }

  // 2. Fallback query to MySQL: only real writer and editorial users from users table
  try {
    const realUsers = await query<any[]>(
      "SELECT id, name, email, role, avatar, writer_name, bio FROM users WHERE role = 'writer' OR role = 'admin' ORDER BY id ASC"
    );
    const articleCounts = await query<any[]>(
      "SELECT author_name, COUNT(*) as count FROM articles WHERE author_name IS NOT NULL AND author_name != '' GROUP BY author_name"
    );

    const countMap = new Map<string, number>();
    articleCounts.forEach((r) => {
      countMap.set(String(r.author_name).toLowerCase().trim(), Number(r.count));
    });

    const authorsList = realUsers.map((u) => {
      const displayName = u.writer_name || u.name;
      const cleanSlug = slugify(displayName);
      const articleCount = countMap.get(displayName.toLowerCase().trim()) || 0;
      return {
        id: u.id,
        name: displayName,
        slug: cleanSlug,
        role: u.role === 'admin' ? 'Editorial Director' : 'Staff Writer',
        badge: u.role === 'admin' ? 'United States Today Editorial' : 'United States Today Staff',
        avatar: u.avatar || '/images/user-avatar-butterfly.png',
        bio: u.bio || `${displayName} is an active contributor at United States Today.`,
        email: u.email,
        articleCount,
      };
    });

    return NextResponse.json({ success: true, count: authorsList.length, data: authorsList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch authors' }, { status: 500 });
  }
}
