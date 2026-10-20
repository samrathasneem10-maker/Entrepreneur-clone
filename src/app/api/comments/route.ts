import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleSlug = searchParams.get('articleSlug');

  try {
    let sql = 'SELECT * FROM comments';
    const params: any[] = [];

    if (articleSlug) {
      sql += ' WHERE article_slug = ?';
      params.push(articleSlug);
    }
    sql += ' ORDER BY id DESC';

    const rows = await query(sql, params);
    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to fetch comments',
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { articleSlug, author, avatar, text } = body;

    if (!articleSlug || !text?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'articleSlug and text are required',
      }, { status: 400 });
    }

    const authorName = author?.trim() || 'Community Member';
    const authorAvatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop';

    const result = await query(
      `INSERT INTO comments (article_slug, author, avatar, text, likes)
       VALUES (?, ?, ?, ?, 0)`,
      [articleSlug, authorName, authorAvatar, text.trim()]
    );

    return NextResponse.json({
      success: true,
      message: 'Comment posted successfully to MySQL database',
      comment: {
        id: (result as any)?.insertId || `c-${Date.now()}`,
        article_slug: articleSlug,
        author: authorName,
        avatar: authorAvatar,
        text: text.trim(),
        likes: 0,
        created_at: new Date().toISOString(),
      },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to save comment',
    }, { status: 500 });
  }
}
