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

  // 2. Fallback query to MySQL: real users from users table (writers, admin, default admin, readers)
  try {
    const realUsers = await query<any[]>(`
      SELECT id, name, email, role, avatar, writer_name, bio, linkedin_url 
      FROM users 
      WHERE name NOT IN ('writer', 'writer account') AND email NOT LIKE '%placeholder%'
      ORDER BY 
        CASE 
          WHEN role = 'writer' THEN 1 
          WHEN email = 'akramyoonos006@gmail.com' THEN 2
          WHEN role = 'admin' THEN 3
          ELSE 4 
        END, 
        id ASC
    `);
    const articleCounts = await query<any[]>(
      "SELECT author_name, COUNT(*) as count FROM articles WHERE author_name IS NOT NULL AND author_name != '' GROUP BY author_name"
    );

    const countMap = new Map<string, number>();
    articleCounts.forEach((r) => {
      countMap.set(String(r.author_name).toLowerCase().trim(), Number(r.count));
    });

    const authorsList = realUsers.map((u) => {
      const displayName = u.writer_name || u.name;
      const cleanEmail = (u.email || '').toLowerCase().trim();
      const isDefaultAdmin = cleanEmail === 'akramyoonos006@gmail.com';
      const roleLower = (u.role || 'reader').toLowerCase().trim();

      let cleanSlug = slugify(displayName);
      if (cleanEmail === 'samrathasneem20@gmail.com') {
        cleanSlug = 'samra-thasneem-reader';
      } else if (cleanEmail === 'admin@gmail.com') {
        cleanSlug = 'samra-admin-user';
      } else if (cleanEmail === 'fathimasamra200305@gmail.com') {
        cleanSlug = 'samra-admin';
      }

      let roleDisplay = 'Staff Writer';
      let badgeDisplay = 'United States Today Staff';
      if (isDefaultAdmin) {
        roleDisplay = 'Default Administrator';
        badgeDisplay = 'United States Today Staff';
      } else if (roleLower === 'admin') {
        roleDisplay = 'Administrator';
        badgeDisplay = 'United States Today Staff';
      } else if (roleLower === 'reader') {
        roleDisplay = 'Reader';
        badgeDisplay = 'Community Member';
      }

      const articleCount = countMap.get(displayName.toLowerCase().trim()) || 0;
      const authorLinkedin = u.linkedin_url && !u.linkedin_url.includes('your-profile')
        ? u.linkedin_url
        : 'https://www.linkedin.com/in/fathima-samra-8823b634a';

      return {
        id: u.id,
        name: displayName,
        slug: cleanSlug,
        role: roleDisplay,
        badge: badgeDisplay,
        avatar: u.avatar || '',
        bio: u.bio || `${displayName} is an active member at United States Today.`,
        linkedinUrl: authorLinkedin,
        email: u.email,
        articleCount,
      };
    });

    return NextResponse.json({ success: true, count: authorsList.length, data: authorsList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch authors' }, { status: 500 });
  }
}
