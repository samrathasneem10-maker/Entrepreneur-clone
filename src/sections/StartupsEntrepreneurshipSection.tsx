'use client';

import React from 'react';
import Link from 'next/link';
import { STARTUPS_ENTREPRENEURSHIP_SECTION, getArticleUrl } from '@/data/newsData';

export const StartupsEntrepreneurshipSection: React.FC = () => {
  const { featured, items } = STARTUPS_ENTREPRENEURSHIP_SECTION;

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 w-full">
      {/* Section Header with consistent border-b matching reference */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Startups &amp; Entrepreneurship
        </h2>
        <Link
          href="/category/startups-entrepreneurship"
          className="inline-flex items-center gap-2 group text-xs sm:text-sm font-sans font-bold tracking-wider uppercase text-slate-800 hover:text-[#1642D0] transition-colors"
        >
          <span>See All</span>
          <span className="w-5 h-5 sm:w-6 sm:h-6 bg-[#1642D0] group-hover:bg-[#1235a8] text-white flex items-center justify-center rounded transition-colors shadow-sm">
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>

      {/* 2-Column Balanced Grid: Left Featured (6 cols) + Right Stacked (6 cols) perfectly aligned at top and bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Big Lead Story (col-span-6) */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full">
          <article className="group flex flex-col justify-between h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              <div className="flex flex-col">
                {/* Featured Image */}
                <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-xl"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = '/images/home-hero/hero-growth-decision.png';
                      }
                    }}
                  />
                </figure>

                {/* Category Badge */}
                <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 text-left block">
                  {featured.category}
                </span>

                {/* Lead Story Title */}
                <h3 className="text-xl sm:text-2xl lg:text-[23px] xl:text-[25px] font-serif font-bold text-slate-900 leading-[1.22] tracking-tight mb-2 text-left group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                  {featured.title}
                </h3>

                {/* Lead Story Excerpt */}
                {featured.excerpt && (
                  <p className="text-xs sm:text-[13px] text-slate-600 font-serif font-normal leading-relaxed mb-3 text-left line-clamp-2">
                    {featured.excerpt}
                  </p>
                )}
              </div>

              {/* Author Byline matching Image 2 */}
              <div className="mt-auto pt-1 flex items-center text-xs font-sans">
                <span className="text-slate-500 font-medium mr-1.5">BY</span>
                <span className="text-[#1642D0] font-bold uppercase group-hover:underline">
                  {featured.author?.name}
                </span>
              </div>
            </Link>
          </article>
        </div>

        {/* Right Column: Stacked 3 Articles matching Image 2 with equal vertical spacing & no excerpts */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full divide-y divide-slate-200">
          {items.slice(0, 3).map((item) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article
                key={item.id}
                className="group flex-1 flex flex-col justify-center py-4 first:pt-0 last:pb-0"
              >
                <Link
                  href={itemUrl}
                  className="flex items-center justify-between gap-4 sm:gap-5 w-full no-underline text-inherit cursor-pointer"
                  aria-label={item.title}
                >
                  {/* Left Text Block: Category, Title, Author */}
                  <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between self-stretch py-0.5">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1 block">
                        {item.category}
                      </span>

                      <h4 className="text-[14px] sm:text-[15px] lg:text-[16px] font-serif font-bold text-slate-900 leading-snug tracking-tight mb-1.5 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all line-clamp-2">
                        {item.title}
                      </h4>
                    </div>

                    {/* Author Byline matching Image 2 */}
                    <div className="mt-auto flex items-center text-[11px] font-sans">
                      <span className="text-slate-500 font-medium mr-1.5">BY</span>
                      <span className="text-[#1642D0] font-bold uppercase group-hover:underline">
                        {item.author?.name}
                      </span>
                    </div>
                  </div>

                  {/* Right Thumbnail */}
                  {item.imageUrl && (
                    <figure className="relative w-32 sm:w-36 md:w-40 aspect-[16/10] flex-shrink-0 overflow-hidden rounded-xl border border-slate-200/90 bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = 'true';
                            target.src = '/images/home-hero/grid-card-1.png';
                          }
                        }}
                      />
                    </figure>
                  )}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
