import { NextResponse } from 'next/server';
import { getStablePlatformThumbnail } from '@/lib/shortsThumbnails';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
  }

  // Delegate directly to backend service on port 5000
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/shorts/metadata?url=${encodeURIComponent(rawUrl)}`, {
      cache: 'no-store',
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data && data.success && data.thumbnail && !data.thumbnail.endsWith('.svg')) {
        return NextResponse.json(data);
      }
    }
  } catch (err) {}

  // Fallback metadata parsing
  let title = '';
  let thumbnail = '';
  let duration = '0:45';
  let platform = 'YouTube Shorts';

  const lower = rawUrl.toLowerCase();
  if (lower.includes('youtube') || lower.includes('youtu.be')) {
    platform = 'YouTube Shorts';
    const ytMatch = rawUrl.match(/(?:shorts\/|v=|youtu\.be\/|\/v\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      const vidId = ytMatch[1];
      thumbnail = `https://img.youtube.com/vi/${vidId}/oar2.jpg`;
      try {
        const testRes = await fetch(`https://img.youtube.com/vi/${vidId}/oar2.jpg`, { method: 'HEAD', signal: AbortSignal.timeout(2000) });
        if (!testRes.ok) {
          thumbnail = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
        }
      } catch {
        thumbnail = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
    } else {
      thumbnail = '/images/shorts-reels/reel_1.png';
    }
  } else if (lower.includes('rumble')) {
    platform = 'Rumble Video';
    thumbnail = getStablePlatformThumbnail('rumble', rawUrl);
  } else if (lower.includes('instagram') || lower.includes('instagr.am')) {
    platform = 'Instagram Reel';
    thumbnail = getStablePlatformThumbnail('instagram', rawUrl);
    duration = '0:30';
    try {
      const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      const parts = parsed.pathname.split('/').filter(Boolean);
      const reelIdx = parts.findIndex(p => p === 'reel' || p === 'reels' || p === 'p');
      if (reelIdx !== -1 && parts[reelIdx + 1]) {
        const code = parts[reelIdx + 1];
        const creator = reelIdx > 0 ? parts[reelIdx - 1] : '';
        if (creator && creator !== 'instagram' && creator.length > 2) {
          title = `${creator.charAt(0).toUpperCase() + creator.slice(1)} • Instagram Reel`;
        } else {
          title = `Instagram Reel (${code.replace(/[-_]+/g, ' ').trim()})`;
        }
      }
    } catch {}
  } else if (lower.includes('facebook') || lower.includes('fb.watch') || lower.includes('fb.com')) {
    platform = 'Facebook Reel';
    thumbnail = getStablePlatformThumbnail('facebook', rawUrl);
    duration = '0:45';
    try {
      const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      const parts = parsed.pathname.split('/').filter(Boolean);
      const reelIdx = parts.findIndex(p => p === 'reel' || p === 'reels');
      if (reelIdx !== -1 && parts[reelIdx + 1]) {
        title = `Facebook Reel • ${parts[reelIdx + 1]}`;
      } else if (parsed.searchParams.get('v')) {
        title = `Facebook Video • ${parsed.searchParams.get('v')}`;
      }
    } catch {}
  }

  // Extract clean title from URL slug if possible
  if (!title) {
    try {
      const parsed = new URL(rawUrl);
      const segments = parsed.pathname.split('/').filter(Boolean);
      const last = segments.pop() || '';
      const cleanSlug = last.replace(/\.html?$/i, '').replace(/^v[0-9a-z]+-/i, '').replace(/[-_]+/g, ' ').trim();
      if (cleanSlug.length > 2 && !cleanSlug.toLowerCase().includes('reel') && !/^\d+$/.test(cleanSlug)) {
        title = cleanSlug.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    } catch {}
  }

  if (!thumbnail || thumbnail.endsWith('.svg')) {
    thumbnail = getStablePlatformThumbnail(platform, title || rawUrl);
  }

  return NextResponse.json({
    success: true,
    title: title || `${platform} Highlight Story`,
    thumbnail: thumbnail || '/images/shorts-reels/reel_1.png',
    duration,
    platform,
  });
}
