/**
 * URL sanitizer for video platforms (YouTube, Rumble, Instagram, Facebook)
 * Prevents duplicated URLs caused by double-paste or concatenation (e.g. `https://rumble.com/...https://rumble.com/...`)
 * and formats clean, canonical watchable URLs.
 */
export function sanitizeVideoUrl(rawInput: string): string {
  if (!rawInput) return '';
  let str = String(rawInput).trim();

  // 1. If input contains multiple occurrences of http:// or https://, split and take the cleanest/first valid one
  const httpMatches = str.match(/https?:\/\/[^\s]+/gi);
  if (httpMatches && httpMatches.length > 0) {
    // If concatenated like https://...https://...
    str = httpMatches[0];
    const secondHttpIdx = str.indexOf('http', 4);
    if (secondHttpIdx !== -1) {
      str = str.slice(0, secondHttpIdx);
    }
  }

  // 2. Remove trailing slashes or junk parameters if malformed
  str = str.trim();
  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    str = `https://${str}`;
  }

  try {
    const urlObj = new URL(str);
    const host = urlObj.hostname.toLowerCase();

    // YouTube: clean params
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      const vidMatch = str.match(/(?:shorts\/|v=|youtu\.be\/|\/v\/|embed\/)([a-zA-Z0-9_-]{11})/);
      if (vidMatch && vidMatch[1]) {
        return `https://www.youtube.com/shorts/${vidMatch[1]}`;
      }
    }

    // Instagram: keep only clean /reel/{id}/ or /p/{id}/
    if (host.includes('instagram.com') || host.includes('instagr.am')) {
      const parts = urlObj.pathname.split('/').filter(Boolean);
      const reelIdx = parts.findIndex(p => p === 'reel' || p === 'reels' || p === 'p');
      if (reelIdx !== -1 && parts[reelIdx + 1]) {
        return `https://www.instagram.com/reel/${parts[reelIdx + 1]}/`;
      }
    }

    // Facebook: handle /share/r/{id} or /reel/{id}
    if (host.includes('facebook.com') || host.includes('fb.watch')) {
      if (urlObj.pathname.includes('/share/r/')) {
        return `https://www.facebook.com${urlObj.pathname}`;
      }
      const parts = urlObj.pathname.split('/').filter(Boolean);
      const reelIdx = parts.findIndex(p => p === 'reel' || p === 'reels');
      if (reelIdx !== -1 && parts[reelIdx + 1]) {
        return `https://www.facebook.com/reel/${parts[reelIdx + 1]}/`;
      }
      return urlObj.toString();
    }

    // Rumble: handle /shorts/{id} or /v{id}-slug.html
    if (host.includes('rumble.com')) {
      const parts = urlObj.pathname.split('/').filter(Boolean);
      return `https://rumble.com/${parts.join('/')}`;
    }

    return urlObj.toString();
  } catch {
    return str;
  }
}
