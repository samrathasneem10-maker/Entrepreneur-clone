import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryEmail = searchParams.get('email');
    const cookieStore = await cookies();
    const cookieEmail = cookieStore.get('user_email')?.value;
    const email = (queryEmail || cookieEmail || 'fathisamra66@gmail.com').trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ success: true, articles: [] });
    }

    const saved = await query<any[]>(
      `SELECT id, article_slug AS article_id, title, category, image_url, excerpt, saved_at 
       FROM user_saved_articles 
       WHERE LOWER(user_email) = ? 
       ORDER BY saved_at DESC`,
      [email]
    );

    return NextResponse.json({
      success: true,
      articles: saved || [],
    });
  } catch (error: any) {
    console.error('Error fetching saved articles:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch saved articles.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, articleId, title, category, imageUrl, excerpt } = body;

    const email = (userEmail || '').trim().toLowerCase();
    if (!email || !articleId) {
      return NextResponse.json(
        { success: false, error: 'User email and articleId are required.' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO user_saved_articles (user_email, article_slug, title, category, image_url, excerpt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        email,
        String(articleId),
        title || 'Untitled Article',
        category || 'Business',
        imageUrl || '/images/default.jpg',
        excerpt || '',
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Article saved successfully.',
    });
  } catch (error: any) {
    console.error('Error saving article:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save article.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');
    const queryArticleId = searchParams.get('articleId');
    const queryEmail = searchParams.get('email');

    const cookieStore = await cookies();
    const cookieEmail = cookieStore.get('user_email')?.value;
    const email = (queryEmail || cookieEmail || 'fathisamra66@gmail.com').trim().toLowerCase();

    if (queryId) {
      await query('DELETE FROM user_saved_articles WHERE id = ?', [Number(queryId)]);
    } else if (queryArticleId && email) {
      await query(
        'DELETE FROM user_saved_articles WHERE LOWER(user_email) = ? AND article_slug = ?',
        [email, String(queryArticleId)]
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Saved article id or (email and articleId) is required.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Article removed from saved items.',
    });
  } catch (error: any) {
    console.error('Error deleting saved article:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to remove saved article.' },
      { status: 500 }
    );
  }
}
