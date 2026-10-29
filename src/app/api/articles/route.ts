import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ALL_ARTICLES } from '@/data/newsData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const author = searchParams.get('author');
  const status = searchParams.get('status');
  const slug = searchParams.get('slug');
  const getCounts = searchParams.get('counts') === 'true';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 200);
  const offset = (page - 1) * limit;

  try {
    // If counts requested, return status counts for Reader / Writer Dashboard tabs
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

    // Base WHERE clause
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (category) {
      whereClause += ' AND a.category_name = ?';
      params.push(category);
    }
    if (author) {
      whereClause += ' AND a.author_name = ?';
      params.push(author);
    }
    if (status) {
      whereClause += ' AND LOWER(COALESCE(a.status, "published")) = ?';
      params.push(status.toLowerCase());
    }
    if (slug) {
      whereClause += ' AND (a.slug = ? OR a.id = ?)';
      params.push(slug, slug);
    }

    // 1. Fetch total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM articles a ${whereClause}`;
    const countRows = await query<any[]>(countSql, params);
    const total = Number(countRows[0]?.total) || 0;

    // 2. Fetch paginated rows (ordered by newest first)
    const sql = `
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
        au.role as authorTitle,
        au.bio as authorBio
      FROM articles a
      LEFT JOIN authors au ON a.author_id = au.id
      ${whereClause}
      ORDER BY a.id DESC
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, limit, offset];
    const rows = await query(sql, queryParams);

    const formatted = (rows as any[]).map((r) => ({
      id: r.slug || String(r.id),
      dbId: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category || 'Business',
      editor: r.editor,
      date: r.date || 'Oct 29, 2026',
      readTime: r.readTime || '5 min read',
      excerpt: r.excerpt || '',
      content: r.content || '',
      imageUrl: r.imageUrl || '/images/coding-agents.jpg',
      imageAspect: r.imageAspect,
      views: r.views || '1',
      status: (r.status || 'published').toLowerCase(),
      author: {
        name: r.authorName || 'Staff Contributor',
        avatar: r.authorAvatar || '/images/author-sherin.png',
        title: r.authorTitle || 'Executive Contributor',
        bio: r.authorBio,
      },
    }));

    return NextResponse.json({
      success: true,
      source: 'database',
      count: formatted.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasMore: offset + formatted.length < total,
      data: formatted,
    });
  } catch (error: any) {
    console.warn('MySQL articles query failed, falling back to static data:', error?.message);

    // Filter out the 4 old articles from fallback
    const excludedSlugs = [
      '53-side-hustle-ideas-to-make-extra-money-in-2026',
      'youve-been-overlooking-your-best-idea-people-ai-is-about-to-fix-that',
      'not-every-boss-deserves-a-thank-you-card',
      'how-to-biohack-your-brain-for-peak-performance',
    ];

    const fallbackList = ALL_ARTICLES.filter((a) => !excludedSlugs.includes(a.slug || a.id)).map((a, i) => ({
      ...a,
      dbId: i + 1,
      status: i < 3 ? 'draft' : i === 3 ? 'pending_review' : i === 4 ? 'trash' : 'published',
    }));

    let filtered = fallbackList;
    if (category) {
      filtered = filtered.filter((a) => a.category?.toLowerCase() === category.toLowerCase());
    }
    if (status) {
      filtered = filtered.filter((a) => a.status === status.toLowerCase());
    }
    if (slug) {
      filtered = filtered.filter((a) => a.slug === slug || a.id === slug);
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      source: 'fallback',
      count: paginated.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasMore: offset + paginated.length < total,
      data: paginated,
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
      category = 'Business',
      excerpt = '',
      content = '',
      imageUrl = '/images/coding-agents.jpg',
      status = 'published',
      authorName = 'Staff Contributor',
      readTime = '5 min read',
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1')`,
      [slug, title.trim(), category, authorName, formattedDate, readTime || '5 min read', excerpt, content, imageUrl, status.toLowerCase()]
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
        readTime: readTime || '5 min read',
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
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const dbId = searchParams.get('dbId');
  const permanent = searchParams.get('permanent') === 'true';

  if (!id && !dbId) {
    return NextResponse.json({ success: false, error: 'Article identifier is required.' }, { status: 400 });
  }

  try {
    if (permanent) {
      // Hard delete
      let whereClause = '';
      const params: any[] = [];
      if (dbId) {
        whereClause = 'WHERE id = ?';
        params.push(dbId);
      } else {
        whereClause = 'WHERE slug = ? OR id = ?';
        params.push(id, id);
      }
      await query(`DELETE FROM articles ${whereClause}`, params);
      return NextResponse.json({ success: true, message: 'Article permanently deleted' });
    } else {
      // Soft delete: move to trash
      let whereClause = '';
      const params: any[] = ['trash'];
      if (dbId) {
        whereClause = 'WHERE id = ?';
        params.push(dbId);
      } else {
        whereClause = 'WHERE slug = ? OR id = ?';
        params.push(id, id);
      }
      await query(`UPDATE articles SET status = ? ${whereClause}`, params);
      return NextResponse.json({ success: true, message: 'Article moved to trash' });
    }
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete article.' },
      { status: 500 }
    );
  }
}
