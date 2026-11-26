/**
 * Curated high-definition 9:16 portrait video thumbnails for Rumble, Instagram, and Facebook
 * Each entry provides an authentic, high-impact video frame matched dynamically by video keywords,
 * creator slug, or hash, ensuring every short story looks like a real video frame just like YouTube Shorts.
 */

export interface FallbackVideoPreset {
  keywords: string[];
  thumbnail: string;
}

export const PLATFORM_VIDEO_PRESETS: Record<string, FallbackVideoPreset[]> = {
  rumble: [
    {
      keywords: ['flight', 'airport', 'plane', 'aviation', 'travel', 'shutdown'],
      thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['nvidia', 'deepseek', 'ai', 'chip', 'tech', 'investigation', 'robot', 'superintelligence'],
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['boxer', 'boxing', 'fight', 'weight', 'george', 'francis', 'match', 'fitness'],
      thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['salah', 'egypt', 'football', 'soccer', 'goal', 'world cup', 'arsenal', 'premier', 'league'],
      thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['referee', 'dean', 'card', 'foul', 'var', 'decision', 'sports'],
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['transfer', 'deadline', 'villa', 'everton', 'balogun', 'money', 'deal', 'million', 'football'],
      thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['court', 'hearing', 'legal', 'supreme', 'law', 'justice', 'judge'],
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['market', 'fed', 'rate', 'interest', 'finance', 'economy', 'stock', 'investing'],
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['news', 'politics', 'stormont', 'budget', 'government', 'report'],
      thumbnail: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&auto=format&fit=crop&q=80',
    },
  ],
  instagram: [
    {
      keywords: ['fashion', 'beauty', 'makeup', 'style', 'model', 'dress', 'cosmetics'],
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['creator', 'lifestyle', 'vlog', 'daily', 'coffee', 'morning', 'routine'],
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['fitness', 'workout', 'gym', 'training', 'healthy', 'diet'],
      thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['business', 'startup', 'entrepreneur', 'office', 'career', 'founder'],
      thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['travel', 'nature', 'explore', 'city', 'vacation', 'destination'],
      thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['tech', 'ai', 'gadget', 'coding', 'software', 'future'],
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    },
  ],
  facebook: [
    {
      keywords: ['community', 'family', 'story', 'local', 'event', 'share', 'people'],
      thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['interview', 'podcast', 'show', 'talk', 'discussion', 'leader'],
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['cooking', 'food', 'recipe', 'kitchen', 'restaurant', 'chef'],
      thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['business', 'finance', 'company', 'economy', 'money', 'growth'],
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    },
    {
      keywords: ['sports', 'match', 'game', 'play', 'team', 'athlete'],
      thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    },
  ],
};

// Stable hash function to deterministically assign a quality portrait frame based on URL/ID
export function getStablePlatformThumbnail(platform: string, seed: string): string {
  const normPlatform = platform.toLowerCase();
  let key = 'rumble';
  if (normPlatform.includes('instagram')) key = 'instagram';
  else if (normPlatform.includes('facebook')) key = 'facebook';

  const list = PLATFORM_VIDEO_PRESETS[key] || PLATFORM_VIDEO_PRESETS.rumble;
  
  // First, check if seed text contains any keyword
  const lowerSeed = seed.toLowerCase();
  for (const item of list) {
    if (item.keywords.some((kw) => lowerSeed.includes(kw))) {
      return item.thumbnail;
    }
  }

  // Otherwise, use hash code
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % list.length;
  return list[index].thumbnail;
}
