import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ALL_ARTICLES } from '@/data/newsData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const author = searchParams.get('author');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);

  try {
    let sql = `
      SELECT 
        a.id,
        a.slug,
        a.title,
        a.category_name as category,
        a.author_name as authorName,
        a.editor,
        a.date,
        a.read_time as readTime,
        a.excerpt,
        a.image_url as imageUrl,
        a.image_aspect as imageAspect,
        a.views,
        a.is_hero as isHero,
        a.is_featured as isFeatured,
        au.avatar as authorAvatar,
        au.title as authorTitle,
        au.bio as authorBio
      FROM articles a
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category) {
      sql += ' AND a.category_name = ?';
      params.push(category);
    }
    if (author) {
      sql += ' AND a.author_name = ?';
      params.push(author);
    }

    sql += ' ORDER BY a.id DESC LIMIT ?';
    params.push(limit);

    const rows = await query(sql, params);

    const formatted = (rows as any[]).map((r) => ({
      id: r.slug || String(r.id),
      slug: r.slug,
      title: r.title,
      category: r.category,
      editor: r.editor,
      date: r.date,
      readTime: r.readTime,
      excerpt: r.excerpt,
      imageUrl: r.imageUrl,
      imageAspect: r.imageAspect,
      views: r.views,
      author: {
        name: r.authorName,
        avatar: r.authorAvatar || '/images/author-sherin.png',
        title: r.authorTitle || 'Entrepreneur Staff',
        bio: r.authorBio,
      },
    }));

    return NextResponse.json({
      success: true,
      source: 'database',
      count: formatted.length,
      data: formatted,
    });
  } catch (error: any) {
    console.warn('MySQL articles query failed, falling back to static data:', error?.message);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      count: ALL_ARTICLES.length,
      data: ALL_ARTICLES.slice(0, limit),
    });
  }
}
