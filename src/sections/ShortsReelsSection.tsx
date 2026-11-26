'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { sanitizeVideoUrl } from '@/lib/sanitizeVideoUrl';

interface ReelItem {
  id: string | number;
  title: string;
  duration: string;
  imageUrl: string;
  videoUrl?: string;
  platform?: string;
}

const DEFAULT_REELS: ReelItem[] = [
  {
    id: 'reel-1-us-flight-shutdown',
    title: 'US Nationwide Flight Shutdown Exposes Airport Infrastructure Vulnerabilities',
    duration: '0:45',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop',
    videoUrl: 'https://rumble.com/v2-us-flight-shutdown',
    platform: 'Rumble',
  },
  {
    id: 'reel-2-nvidia-deepseek',
    title: 'Nvidia Scandal Puts Singapore Under Scrutiny as DeepSeek AI Investigation Widens',
    duration: '0:45',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop',
    videoUrl: 'https://rumble.com/v2-nvidia-deepseek',
    platform: 'Rumble',
  },
  {
    id: 'reel-3-boxer-george-francis',
    title: 'England Boxer George Francis Misses World Championship Weight-In by Milligrams',
    duration: '0:45',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop',
    videoUrl: 'https://rumble.com/v2-boxer-george-francis',
    platform: 'Rumble',
  },
  {
    id: 'reel-4-salah-brace-egypt',
    title: 'Mohamed Salah Shines With Brace as Egypt Advances in World Cup African Qualifiers',
    duration: '0:45',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop',
    videoUrl: 'https://rumble.com/v2-salah-brace-egypt',
    platform: 'Rumble',
  },
  {
    id: 'reel-5-mike-dean-analysis',
    title: 'Former Premier League Referee Mike Dean Analyzes Controversial Red Card Decisions',
    duration: '0:37',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop',
    videoUrl: 'https://rumble.com/v2-mike-dean-analysis',
    platform: 'Rumble',
  },
  {
    id: 'reel-6-arsenal-preview',
    title: 'Arsenal Still the Team to Beat | Washington Global Times Exclusive Match Preview',
    duration: '0:15',
    imageUrl: 'https://images.unsplash.com/photo-1489944445391-11dd35574549?w=600&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/arsenal-preview',
    platform: 'YouTube Shorts',
  },
  {
    id: 'reel-7-balogun-deadline',
    title: 'Balogun Walks Away From Everton Move as European Deadline Nears Drama',
    duration: '0:39',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop',
    videoUrl: 'https://rumble.com/v2-balogun-deadline',
    platform: 'Rumble',
  },
  {
    id: 'reel-8-aston-villa-swoop',
    title: "Aston Villa's £76m Deadline-Day Double Swoop Shakes the January Transfer Market",
    duration: '0:36',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop',
    videoUrl: 'https://rumble.com/v2-aston-villa-swoop',
    platform: 'Rumble',
  },
  {
    id: 'reel-9-rayner-visa',
    title: 'Rayner Challenges Labour Visa Plans | United States Today Special Report',
    duration: '0:19',
    imageUrl: '/images/shorts-reels/reel_2.png',
    videoUrl: 'https://www.youtube.com/shorts/rayner-visa',
    platform: 'YouTube Shorts',
  },
  {
    id: 'reel-10-netanyahu-visit',
    title: 'Why Netanyahu Was Not Arrested During His US Visit Despite ICC Warrant',
    duration: '0:38',
    imageUrl: '/images/shorts-reels/reel_3.png',
    videoUrl: 'https://www.youtube.com/shorts/netanyahu-visit',
    platform: 'YouTube Shorts',
  },
  {
    id: 'reel-11-stormont-budget',
    title: 'Stormont Faces £1.5bn Budget Ultimatum | United States Today',
    duration: '0:24',
    imageUrl: '/images/shorts-reels/reel_4.png',
    videoUrl: 'https://rumble.com/v2-stormont-budget',
    platform: 'Rumble Video',
  },
  {
    id: 'reel-12-fed-rate-signals',
    title: 'Federal Reserve Signals Cautious Stance on Future Interest Rate Decisions',
    duration: '0:42',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/shorts/fed-rate-signals',
    platform: 'YouTube Shorts',
  },
];

export const ShortsReelsSection: React.FC = () => {
  const [reels, setReels] = useState<ReelItem[]>(DEFAULT_REELS);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(reels.length / itemsPerPage));

  useEffect(() => {
    let isMounted = true;
    async function loadShorts() {
      try {
        const res = await fetch('/api/shorts', { cache: 'no-store' });
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const activeOnly = data.data
            .filter((item: any) => item.status === 'active')
            .map((item: any) => ({
              id: item.id || `slot-${item.slotNumber}`,
              title: item.title,
              duration: item.duration || '0:45',
              imageUrl: item.thumbnailUrl || '/images/shorts-reels/reel_1.png',
              videoUrl: item.videoUrl || '',
              platform: item.platform || 'Rumble',
            }));

          if (activeOnly.length > 0) {
            setReels(activeOnly);
          }
        }
      } catch (err) {
        console.error('Failed to fetch shorts for homepage feed:', err);
      }
    }
    loadShorts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardClick = (reel: ReelItem) => {
    if (reel.videoUrl) {
      const targetUrl = sanitizeVideoUrl(reel.videoUrl);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="w-full my-6 sm:my-8 bg-[#fcf7f1] border border-[#f2eae0] p-4 sm:p-6 lg:p-7 relative">
      {/* Header Tab matching Image 5 */}
      <div className="mb-4 sm:mb-5">
        <span className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-sans font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 shadow-xs">
          <span className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-[#c61830] rounded-2xs -translate-y-0.5 shrink-0" aria-hidden="true" />
          SHORTS &amp; REELS
        </span>
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        {/* Left Arrow Button */}
        {currentPage > 0 && (
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            aria-label="Previous Shorts"
            className="flex absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 w-8 h-12 bg-[#f4efe6] hover:bg-[#ebe2d5] border border-stone-300 text-stone-700 items-center justify-center rounded-xs shadow-md transition-colors cursor-pointer z-20"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Carousel Track with 4 Cards Per Page (Zero Cropping) */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const pageReels = reels.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage);
              return (
                <div
                  key={pageIdx}
                  className="w-full shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 py-1 px-0.5"
                >
                  {pageReels.map((reel) => {
                    const platformLower = (reel.platform || '').toLowerCase();
                    const badgeColor = platformLower.includes('youtube')
                      ? 'bg-[#E50914]'
                      : platformLower.includes('rumble')
                      ? 'bg-[#64a727]'
                      : platformLower.includes('instagram')
                      ? 'bg-[#C13584]'
                      : platformLower.includes('facebook')
                      ? 'bg-[#1877F2]'
                      : 'bg-[#64a727]';

                    const badgeText = reel.platform
                      ? reel.platform
                          .toUpperCase()
                          .replace(' SHORTS', '')
                          .replace(' REELS', '')
                          .replace(' REEL', '')
                          .replace(' VIDEO', '')
                      : 'RUMBLE';

                    return (
                      <article
                        key={reel.id}
                        onClick={() => handleCardClick(reel)}
                        className="group relative aspect-[9/14] w-full rounded-xs overflow-hidden bg-slate-900 shadow-sm cursor-pointer select-none"
                      >
                        {/* Background Video Frame */}
                        <img
                          src={reel.imageUrl}
                          alt={reel.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />

                        {/* Dark Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                        {/* Platform Badge on top-left */}
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span
                            className={`inline-block ${badgeColor} text-white text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs shadow-xs`}
                          >
                            {badgeText}
                          </span>
                        </div>

                        {/* Bottom Details: Title and Duration */}
                        <div className="absolute bottom-0 inset-x-0 p-3 z-10 flex flex-col justify-end">
                          <h4 className="font-sans font-bold text-[11.5px] sm:text-[12.5px] leading-snug text-white line-clamp-3 mb-2 group-hover:text-amber-300 transition-colors my-0">
                            {reel.title}
                          </h4>

                          <div className="flex items-center gap-1.5 text-white/90 text-[10.5px] font-sans font-medium mt-1">
                            <span
                              className={`w-3.5 h-3.5 ${badgeColor} text-white rounded-full flex items-center justify-center`}
                            >
                              <Play className="w-2 h-2 fill-current stroke-none ml-0.5" />
                            </span>
                            <span>{reel.duration}</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Arrow Button */}
        {currentPage < totalPages - 1 && (
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            aria-label="Next Shorts"
            className="flex absolute -right-2 sm:-right-3.5 top-1/2 -translate-y-1/2 w-8 h-12 bg-[#f4efe6] hover:bg-[#ebe2d5] border border-stone-300 text-stone-700 items-center justify-center rounded-xs shadow-md transition-colors cursor-pointer z-20"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </section>
  );
};
