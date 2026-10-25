'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Play } from 'lucide-react';

interface ReelItem {
  id: string;
  title: string;
  duration: string;
  imageUrl: string;
  source?: string;
}

const REELS: ReelItem[] = [
  {
    id: 'reel-1-england-goalkeeping',
    title: 'England Goalkeeping Battle Intensifies: Pickford and Trafford Vie for Number One Spot',
    duration: '0:44',
    imageUrl: '/images/shorts-reels/reel_1.png',
  },
  {
    id: 'reel-2-rayner-labour-visa',
    title: 'Rayner Challenges Labour Visa Plans | Washington Global Times',
    duration: '0:19',
    imageUrl: '/images/shorts-reels/reel_2.png',
  },
  {
    id: 'reel-3-netanyahu-us-visit',
    title: 'Why Netanyahu Was Not Arrested During His US Visit Despite ICC Warrant',
    duration: '0:38',
    imageUrl: '/images/shorts-reels/reel_3.png',
  },
  {
    id: 'reel-4-stormont-budget-ultimatum',
    title: 'Stormont Faces £1.5bn Budget Ultimatum | Washington Global Times',
    duration: '0:24',
    imageUrl: '/images/shorts-reels/reel_4.png',
  },
];

export const ShortsReelsSection: React.FC = () => {
  return (
    <section className="w-full my-6 sm:my-8 bg-[#fcf7f1] border border-[#f2eae0] p-4 sm:p-6 lg:p-7 relative">
      {/* Header Tab matching Image 2 */}
      <div className="mb-4 sm:mb-5">
        <span className="inline-block px-3 py-1.5 text-xs sm:text-sm font-sans font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900">
          SHORTS &amp; REELS
        </span>
      </div>

      {/* 4 Vertical Video Cards */}
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 items-stretch">
          {REELS.map((reel) => (
            <article
              key={reel.id}
              className="group relative aspect-[9/14] rounded-xs overflow-hidden bg-slate-900 shadow-sm cursor-pointer"
            >
              {/* Background Video Frame */}
              <img
                src={reel.imageUrl}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />

              {/* Dark Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

              {/* Green RUMBLE Badge on top-left matching Image 2 */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="inline-block bg-[#64a727] text-white text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs shadow-xs">
                  RUMBLE
                </span>
              </div>

              {/* Bottom Details: Title and Duration */}
              <div className="absolute bottom-0 inset-x-0 p-3 z-10 flex flex-col justify-end">
                <h4 className="font-sans font-bold text-[11.5px] sm:text-[12.5px] leading-snug text-white line-clamp-3 mb-2 group-hover:text-green-300 transition-colors">
                  {reel.title}
                </h4>

                <div className="flex items-center gap-1.5 text-white/90 text-[10.5px] font-sans font-medium">
                  <span className="w-3.5 h-3.5 bg-[#64a727] text-white rounded-full flex items-center justify-center">
                    <Play className="w-2 h-2 fill-current stroke-none ml-0.5" />
                  </span>
                  <span>{reel.duration}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Carousel Arrow Button on Right */}
        <button
          aria-label="Next Shorts"
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-[#f4efe6] hover:bg-[#ebe2d5] border border-stone-300 text-stone-700 items-center justify-center rounded-xs shadow-xs transition-colors cursor-pointer z-20"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </section>
  );
};
