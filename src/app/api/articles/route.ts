import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ALL_ARTICLES } from '@/data/newsData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const author = searchParams.get('author');
  const status = searchParams.get('status');
  const getCounts = searchParams.get('counts') === 'true';
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);

  try {
    // If counts requested, return status counts for Reader Dashboard tabs
    if (getCounts) {
      const countsRows = await query<any[]>(
        'SELECT COALESCE(status, "published") as status, COUNT(*) as count FROM articles GROUP BY COALESCE(status, "published")'
      );
      const counts: Record<string, number> = {
        published: 0,
        draft: 0,
        pending_review: 0,
        rejected: 0,
        trash: 0,
      };
      if (Array.isArray(countsRows)) {
        countsRows.forEach((r) => {
          const s = String(r.status).toLowerCase();
          counts[s] = Number(r.count) || 0;
        });
      }
      return NextResponse.json({ success: true, counts });
    }

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
        a.content,
        a.image_url as imageUrl,
        a.image_aspect as imageAspect,
        a.views,
        a.is_hero as isHero,
        a.is_featured as isFeatured,
        COALESCE(a.status, 'published') as status,
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
    if (status) {
      sql += ' AND LOWER(COALESCE(a.status, "published")) = ?';
      params.push(status.toLowerCase());
    }

    sql += ' ORDER BY a.id DESC LIMIT ?';
    params.push(limit);

    const rows = await query(sql, params);

    const formatted = (rows as any[]).map((r) => ({
      id: r.slug || String(r.id),
      dbId: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category || 'United States',
      editor: r.editor,
      date: r.date || 'Oct 23, 2026',
      readTime: r.readTime || '5 min read',
      excerpt: r.excerpt || '',
      content: r.content || '',
      imageUrl: r.imageUrl || '/images/default-article.jpg',
      imageAspect: r.imageAspect,
      views: r.views || '0',
      status: (r.status || 'published').toLowerCase(),
      author: {
        name: r.authorName || 'Staff Writer',
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
    const fallbackList = ALL_ARTICLES.map((a, i) => ({
      ...a,
      dbId: i + 1,
      status: i < 3 ? 'draft' : i === 3 ? 'pending_review' : i === 4 ? 'trash' : 'published',
    }));

    let filtered = fallbackList;
    if (status) {
      filtered = fallbackList.filter((a) => a.status === status.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      source: 'fallback',
      count: filtered.length,
      data: filtered.slice(0, limit),
      counts: {
        published: fallbackList.filter((a) => a.status === 'published').length,
        draft: fallbackList.filter((a) => a.status === 'draft').length,
        pending_review: fallbackList.filter((a) => a.status === 'pending_review').length,
        rejected: 0,
        trash: fallbackList.filter((a) => a.status === 'trash').length,
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      category = 'United States',
      excerpt = '',
      content = '',
      imageUrl = '/images/default-article.jpg',
      status = 'published',
      authorName = 'Reader User',
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required.' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const insertResult: any = await query(
      `INSERT INTO articles 
        (slug, title, category_name, author_name, date, read_time, excerpt, content, image_url, status, views)
       VALUES (?, ?, ?, ?, ?, '5 min read', ?, ?, ?, ?, '1')`,
      [slug, title.trim(), category, authorName, formattedDate, excerpt, content, imageUrl, status.toLowerCase()]
    );

    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      article: {
        id: slug,
        dbId: insertResult.insertId,
        slug,
        title: title.trim(),
        category,
        authorName,
        date: formattedDate,
        readTime: '5 min read',
        excerpt,
        content,
        imageUrl,
        status: status.toLowerCase(),
      },
    });
  } catch (error: any) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create article.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, dbId, status, title, category, excerpt, content, imageUrl } = body;

    if (!id && !dbId) {
      return NextResponse.json({ success: false, error: 'Article identifier is required.' }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status.toLowerCase());
    }
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title.trim());
    }
    if (category !== undefined) {
      updates.push('category_name = ?');
      params.push(category);
    }
    if (excerpt !== undefined) {
      updates.push('excerpt = ?');
      params.push(excerpt);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      params.push(content);
    }
    if (imageUrl !== undefined) {
      updates.push('image_url = ?');
      params.push(imageUrl);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update.' }, { status: 400 });
    }

    let whereClause = '';
    if (dbId) {
      whereClause = 'WHERE id = ?';
      params.push(dbId);
    } else {
      whereClause = 'WHERE slug = ? OR id = ?';
      params.push(id, id);
    }

    await query(`UPDATE articles SET ${updates.join(', ')} ${whereClause}`, params);

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update article.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const dbId = searchParams.get('dbId');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id && !dbId) {
      return NextResponse.json({ success: false, error: 'Article identifier is required.' }, { status: 400 });
    }

    if (permanent) {
      if (dbId) {
        await query('DELETE FROM articles WHERE id = ?', [dbId]);
      } else {
        await query('DELETE FROM articles WHERE slug = ? OR id = ?', [id, id]);
      }
      return NextResponse.json({ success: true, message: 'Article permanently deleted.' });
    } else {
      // Soft-delete to trash
      if (dbId) {
        await query('UPDATE articles SET status = "trash" WHERE id = ?', [dbId]);
      } else {
        await query('UPDATE articles SET status = "trash" WHERE slug = ? OR id = ?', [id, id]);
      }
      return NextResponse.json({ success: true, message: 'Article moved to trash.' });
    }
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete article.' },
      { status: 500 }
    );
  }
}
