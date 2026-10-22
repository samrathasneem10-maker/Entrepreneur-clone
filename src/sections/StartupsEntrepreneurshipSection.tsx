'use client';

import React from 'react';
import Link from 'next/link';
import { STARTUPS_ENTREPRENEURSHIP_SECTION, getArticleUrl } from '@/data/newsData';

export const StartupsEntrepreneurshipSection: React.FC = () => {
  const { featured, items } = STARTUPS_ENTREPRENEURSHIP_SECTION;

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 border-b border-slate-200/80 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-6 border-b border-slate-200">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Startups & Entrepreneurship
        </h2>
        <Link
          href="/category/startups-entrepreneurship"
          className="inline-flex items-center gap-2 group text-xs sm:text-sm font-sans font-bold tracking-wide text-slate-800 hover:text-[#1642D0] transition-colors"
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

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Featured Article */}
        <div className="lg:col-span-7 flex flex-col">
          <article className="group flex flex-col w-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col w-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              {/* Featured Image */}
              <figure className="relative w-full aspect-[16/9] sm:aspect-[2.2/1] overflow-hidden rounded-lg mb-4 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/images/home-hero/hero-growth-decision.png';
                    }
                  }}
                />
              </figure>

              {/* Category */}
              <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-2 text-left block">
                {featured.category}
              </span>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl lg:text-[26px] font-serif font-bold text-slate-900 leading-[1.25] tracking-tight mb-2.5 text-left group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                {featured.title}
              </h3>

              {/* Excerpt */}
              {featured.excerpt && (
                <p className="text-sm sm:text-[15px] text-slate-600 font-serif font-normal leading-relaxed mb-3.5 text-left line-clamp-2">
                  {featured.excerpt}
                </p>
              )}

              {/* Author */}
              {featured.author?.name && (
                <div className="pt-0.5 flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-left">
                  <span className="text-slate-500 font-medium">BY</span>
                  <span className="text-[#1642D0] font-bold group-hover:underline underline-offset-2">
                    {featured.author.name}
                  </span>
                </div>
              )}
            </Link>
          </article>
        </div>

        {/* Right Column: 3 Stacked Articles with Thumbnails */}
        <div className="lg:col-span-5 flex flex-col divide-y divide-slate-200">
          {items.map((item, idx) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article
                key={item.id}
                className={`group py-4 sm:py-5 first:pt-0 last:pb-0 ${
                  idx !== 0 ? 'border-t border-slate-200' : ''
                }`}
              >
                <Link
                  href={itemUrl}
                  className="flex items-center justify-between gap-4 no-underline text-inherit cursor-pointer"
                  aria-label={item.title}
                >
                  {/* Left Text Block */}
                  <div className="flex-1 min-w-0 pr-1">
                    {/* Category */}
                    <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                      {item.category}
                    </span>

                    {/* Title */}
                    <h4 className="text-[15px] sm:text-[16px] lg:text-[17px] font-serif font-bold text-slate-900 leading-snug tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all line-clamp-3">
                      {item.title}
                    </h4>

                    {/* Author */}
                    {item.author?.name && (
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-sans uppercase tracking-wider">
                        <span className="text-slate-500 font-medium">BY</span>
                        <span className="text-[#1642D0] font-bold group-hover:underline underline-offset-2">
                          {item.author.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Thumbnail */}
                  {item.imageUrl && (
                    <figure className="relative w-[130px] sm:w-[155px] h-[85px] sm:h-[100px] flex-shrink-0 overflow-hidden rounded-lg border border-slate-200/90 bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
