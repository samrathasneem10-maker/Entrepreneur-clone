'use client';

import React from 'react';
import Link from 'next/link';
import { TRENDING_RESILIENCE_SECTION, getArticleUrl } from '@/data/newsData';

export const TrendingResilienceSection: React.FC = () => {
  const { featured, items } = TRENDING_RESILIENCE_SECTION;

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 w-full">
      {/* 2-Column Grid matching Image 1: Left Lead Story (approx 52%) + Right Trending News (approx 48%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.14fr_1fr] gap-6 lg:gap-8 xl:gap-10 items-stretch">
        
        {/* Left Column: Big Lead Story with Glass Globe & Skyline Image */}
        <div className="flex flex-col justify-between h-full">
          <article className="group flex flex-col justify-between h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              <div className="flex flex-col">
                {/* Large Featured Image */}
                <figure className="relative w-full aspect-[16/9.2] overflow-hidden rounded-xs mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-xs"
                  />
                </figure>

                {/* Blue Category Badge */}
                <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                  {featured.category}
                </span>

                {/* Lead Headline */}
                <h3 className="text-xl sm:text-2xl lg:text-[25px] xl:text-[27px] font-serif font-bold text-slate-900 leading-[1.22] tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                  {featured.title}
                </h3>

                {/* Excerpt */}
                {featured.excerpt && (
                  <p className="text-xs sm:text-[13px] text-slate-600 font-serif leading-relaxed mb-3 line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
              </div>

              {/* Author Byline matching Image 1 */}
              <div className="mt-auto pt-1 flex items-center text-xs font-sans text-slate-500">
                <span className="text-slate-500 font-medium mr-1.5">BY</span>
                <span className="text-[#1642D0] font-bold uppercase group-hover:underline mr-2">
                  {featured.author?.name}
                </span>
                <span className="text-slate-300 mr-2">•</span>
                <span className="text-slate-500">{featured.date}</span>
                <span className="text-slate-300 mx-2">•</span>
                <span className="text-slate-500">{featured.readTime}</span>
              </div>
            </Link>
          </article>
        </div>

        {/* Right Column: Trending News with heading and numbered list (01 to 05) */}
        <div className="flex flex-col justify-between h-full">
          {/* Trending News Heading aligned with top of left image */}
          <div className="pb-2 mb-1 flex-shrink-0">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight my-0">
              Trending News
            </h3>
          </div>

          {/* List of 5 Articles with large thumbnails and big numbers on left */}
          <div className="flex-1 flex flex-col justify-between divide-y divide-slate-100">
            {items.map((item) => (
              <article key={item.id} className="group flex-1 flex items-center py-2.5 sm:py-3 first:pt-1 last:pb-0">
                <Link
                  href={getArticleUrl(item)}
                  className="flex items-center gap-3 sm:gap-4 w-full no-underline text-inherit cursor-pointer"
                  aria-label={item.title}
                >
                  {/* Big Rank Number on Left (01, 02, ...) */}
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-serif text-slate-300 font-light select-none w-8 sm:w-10 flex-shrink-0">
                    {`0${item.rank}`}
                  </span>

                  {/* Enlarged Thumbnail */}
                  <figure className="relative w-28 sm:w-36 md:w-40 aspect-[16/9] rounded-xs overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xs"
                    />
                  </figure>

                  {/* Title & Details */}
                  <div className="flex-1 min-w-0 pr-1">
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-0.5 block">
                      {item.category}
                    </span>
                    <h4 className="text-[13px] sm:text-[14px] lg:text-[15px] font-serif font-bold text-slate-900 leading-snug tracking-tight line-clamp-2 mb-1 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2">
                      {item.title}
                    </h4>
                    <div className="text-[10px] sm:text-[11px] font-sans text-slate-500">
                      <span>{item.date}</span>
                      <span className="mx-1 text-slate-300">•</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
