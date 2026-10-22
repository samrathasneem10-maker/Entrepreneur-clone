import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { MAIN_CATEGORIES } from '@/data/categoriesData';

export async function GET() {
  try {
    const dbCategories = await query(`
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.description, 
        c.parent_id,
        p.name AS parent_name,
        p.slug AS parent_slug
      FROM categories c
      LEFT JOIN categories p ON c.parent_id = p.id
      ORDER BY COALESCE(c.parent_id, c.id), c.parent_id IS NOT NULL, c.name ASC
    `);

    return NextResponse.json({
      success: true,
      total: dbCategories.length,
      categories: dbCategories,
      mainCategories: MAIN_CATEGORIES,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      fallback: true,
      total: 173,
      mainCategories: MAIN_CATEGORIES,
      error: error?.message,
    });
  }
}
