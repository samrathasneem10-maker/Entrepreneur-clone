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
        modified: 0,
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
      try {
        const modRows = await query<any[]>(
          'SELECT COUNT(*) as c FROM articles WHERE LOWER(status) = "modified" OR (updated_at > created_at AND LOWER(status) != "trash")'
        );
        if (modRows && modRows[0] && Number(modRows[0].c) > 0) {
          counts.modified = Number(modRows[0].c);
        }
      } catch {}
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
      if (status.toLowerCase() === 'modified') {
        whereClause += ' AND (LOWER(COALESCE(a.status, "published")) = "modified" OR (a.updated_at > a.created_at AND LOWER(COALESCE(a.status, "published")) != "trash"))';
      } else {
        whereClause += ' AND LOWER(COALESCE(a.status, "published")) = ?';
        params.push(status.toLowerCase());
      }
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
        a.rejection_reason as rejectionReason,
        a.reviewer_notes as reviewerNotes,
        a.tags,
        a.card_summary as cardSummary,
        a.focus_keyword as focusKeyword,
        a.meta_description as metaDescription,
        a.sub_categories as subCategories,
        a.created_at as createdAt,
        a.updated_at as updatedAt,
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
      rejectionReason: r.rejectionReason || null,
      reviewerNotes: r.reviewerNotes || null,
      tags: r.tags ? (typeof r.tags === 'string' && (r.tags.startsWith('[') || r.tags.startsWith('{')) ? JSON.parse(r.tags) : r.tags.split(',').map((t: string) => t.trim())) : [],
      cardSummary: r.cardSummary || r.excerpt || '',
      focusKeyword: r.focusKeyword || '',
      metaDescription: r.metaDescription || '',
      subCategories: r.subCategories ? (typeof r.subCategories === 'string' && (r.subCategories.startsWith('[') || r.subCategories.startsWith('{')) ? JSON.parse(r.subCategories) : r.subCategories.split(',').map((s: string) => s.trim())) : [],
      createdAt: r.createdAt || null,
      updatedAt: r.updatedAt || null,
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
      tags = [],
      cardSummary = '',
      focusKeyword = '',
      metaDescription = '',
      subCategories = [],
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

    const formattedTags = Array.isArray(tags) ? JSON.stringify(tags) : (tags || '');
    const formattedSubCategories = Array.isArray(subCategories) ? JSON.stringify(subCategories) : (subCategories || '');

    const insertResult: any = await query(
      `INSERT INTO articles 
        (slug, title, category_name, author_name, date, read_time, excerpt, content, image_url, status, views, tags, card_summary, focus_keyword, meta_description, sub_categories)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1', ?, ?, ?, ?, ?)`,
      [
        slug,
        title.trim(),
        category,
        authorName,
        formattedDate,
        readTime || '5 min read',
        excerpt,
        content,
        imageUrl,
        status.toLowerCase(),
        formattedTags,
        cardSummary || excerpt,
        focusKeyword || '',
        metaDescription || '',
        formattedSubCategories,
      ]
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
        tags: Array.isArray(tags) ? tags : [],
        cardSummary: cardSummary || excerpt,
        focusKeyword: focusKeyword || '',
        metaDescription: metaDescription || '',
        subCategories: Array.isArray(subCategories) ? subCategories : [],
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
    const {
      id,
      dbId,
      status,
      title,
      category,
      excerpt,
      content,
      imageUrl,
      rejectionReason,
      reviewerNotes,
      authorName,
      readTime,
      tags,
      cardSummary,
      card_summary,
      focusKeyword,
      focus_keyword,
      metaDescription,
      meta_description,
      subCategories,
      sub_categories,
    } = body;

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
    if (authorName !== undefined) {
      updates.push('author_name = ?');
      params.push(authorName);
    }
    if (readTime !== undefined) {
      updates.push('read_time = ?');
      params.push(readTime);
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
    if (rejectionReason !== undefined) {
      updates.push('rejection_reason = ?');
      params.push(rejectionReason);
    }
    if (reviewerNotes !== undefined) {
      updates.push('reviewer_notes = ?');
      params.push(reviewerNotes);
    }
    if (tags !== undefined) {
      updates.push('tags = ?');
      params.push(Array.isArray(tags) ? JSON.stringify(tags) : tags);
    }
    const finalCardSummary = cardSummary !== undefined ? cardSummary : card_summary;
    if (finalCardSummary !== undefined) {
      updates.push('card_summary = ?');
      params.push(finalCardSummary);
    }
    const finalFocusKeyword = focusKeyword !== undefined ? focusKeyword : focus_keyword;
    if (finalFocusKeyword !== undefined) {
      updates.push('focus_keyword = ?');
      params.push(finalFocusKeyword);
    }
    const finalMetaDescription = metaDescription !== undefined ? metaDescription : meta_description;
    if (finalMetaDescription !== undefined) {
      updates.push('meta_description = ?');
      params.push(finalMetaDescription);
    }
    const finalSubCats = subCategories !== undefined ? subCategories : sub_categories;
    if (finalSubCats !== undefined) {
      updates.push('sub_categories = ?');
      params.push(Array.isArray(finalSubCats) ? JSON.stringify(finalSubCats) : finalSubCats);
    }

    updates.push('updated_at = NOW()');

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
