import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface ShortReelItem {
  id: number;
  slotNumber: number;
  title: string;
  videoUrl: string;
  platform: string;
  thumbnailUrl: string;
  duration: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function GET() {
  try {
    const rows: any[] = await query(
      'SELECT id, slot_number as slotNumber, title, video_url as videoUrl, platform, thumbnail_url as thumbnailUrl, duration, status FROM shorts_reels ORDER BY slot_number ASC'
    );
    return NextResponse.json({
      success: true,
      data: rows || [],
      total: (rows || []).length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch shorts and reels' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slotNumber = 1,
      title,
      videoUrl,
      platform = 'YouTube Shorts',
      thumbnailUrl = '',
      duration = '0:45',
      status = 'active',
    } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { success: false, error: 'Title and Video URL are required.' },
        { status: 400 }
      );
    }

    const slot = Math.min(Math.max(1, Number(slotNumber) || 1), 12);

    // Insert or update on duplicate slot_number
    await query(
      `INSERT INTO shorts_reels (slot_number, title, video_url, platform, thumbnail_url, duration, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         video_url = VALUES(video_url),
         platform = VALUES(platform),
         thumbnail_url = VALUES(thumbnail_url),
         duration = VALUES(duration),
         status = VALUES(status)`,
      [slot, title.trim(), videoUrl.trim(), platform, thumbnailUrl.trim(), duration.trim(), status]
    );

    return NextResponse.json({
      success: true,
      message: `Short & Reel saved to Slot #${slot}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save short & reel' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slot = searchParams.get('slot');
    const id = searchParams.get('id');

    if (slot) {
      await query('DELETE FROM shorts_reels WHERE slot_number = ?', [Number(slot)]);
    } else if (id) {
      await query('DELETE FROM shorts_reels WHERE id = ?', [Number(id)]);
    } else {
      return NextResponse.json(
        { success: false, error: 'Slot number or ID required to delete.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Short & Reel deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete short & reel' },
      { status: 500 }
    );
  }
}
