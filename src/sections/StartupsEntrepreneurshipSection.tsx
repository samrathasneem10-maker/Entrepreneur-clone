'use client';

import React from 'react';
import Link from 'next/link';
import { STARTUPS_ENTREPRENEURSHIP_SECTION, getArticleUrl } from '@/data/newsData';

export const StartupsEntrepreneurshipSection: React.FC = () => {
  const { featured, items } = STARTUPS_ENTREPRENEURSHIP_SECTION;

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 w-full">
      {/* Section Header with consistent border-b matching reference */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-6 border-b border-slate-200">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Startups &amp; Entrepreneurship
        </h2>
        <Link
          href="/category/startups-entrepreneurship"
          className="inline-flex items-center gap-2 group text-xs sm:text-sm font-sans font-bold tracking-wider uppercase text-slate-800 hover:text-[#1642D0] transition-colors"
        >
          <span>SEE ALL</span>
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

      {/* 2-Column Balanced Grid: Left Featured (6 cols) + Right Stacked (6 cols) matching Global Business layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Big Lead Story (col-span-6) */}
        <div className="lg:col-span-6 flex flex-col">
          <article className="group flex flex-col w-full h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              {/* Featured Image */}
              <figure className="relative w-full aspect-[16/11] overflow-hidden rounded-xl mb-4 border border-slate-200/90 bg-slate-100 flex-shrink-0">
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
              <h3 className="text-xl sm:text-2xl lg:text-[25px] font-serif font-bold text-slate-900 leading-[1.25] tracking-tight mb-2.5 text-left group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                {featured.title}
              </h3>

              {/* Excerpt */}
              {featured.excerpt && (
                <p className="text-sm sm:text-[14px] text-slate-600 font-serif font-normal leading-relaxed mb-4 text-left line-clamp-3">
                  {featured.excerpt}
                </p>
              )}

              {/* Author */}
              <div className="mt-auto pt-1 flex items-center gap-2 text-xs font-sans">
                {featured.author?.avatar && (
                  <img
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  />
                )}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500 font-medium">BY</span>
                  <span className="text-[#1642D0] font-bold uppercase group-hover:underline">
                    {featured.author?.name}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-sans">{featured.date}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-sans">{featured.readTime}</span>
                </div>
              </div>
            </Link>
          </article>
        </div>

        {/* Right Column: Stacked Articles with matching alignment (col-span-6) */}
        <div className="lg:col-span-6 flex flex-col divide-y divide-slate-100">
          {items.map((item, idx) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article
                key={item.id}
                className="group py-4 first:pt-0 last:pb-0"
              >
                <Link
                  href={itemUrl}
                  className="flex items-start justify-between gap-4 no-underline text-inherit cursor-pointer"
                  aria-label={item.title}
                >
                  {/* Left Text Block */}
                  <div className="flex-1 min-w-0 pr-1">
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                      {item.category}
                    </span>

                    <h4 className="text-[15px] sm:text-[16px] font-serif font-bold text-slate-900 leading-snug tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all line-clamp-2">
                      {item.title}
                    </h4>

                    {item.excerpt && (
                      <p className="text-xs sm:text-[13px] text-slate-600 font-serif line-clamp-2 mb-2.5 leading-relaxed">
                        {item.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-[11px] font-sans text-slate-500">
                      <span className="text-slate-500 font-medium">BY</span>
                      <span className="text-[#1642D0] font-bold uppercase group-hover:underline">
                        {item.author?.name}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Right Thumbnail */}
                  {item.imageUrl && (
                    <figure className="relative w-28 sm:w-36 aspect-[16/10] flex-shrink-0 overflow-hidden rounded-xl border border-slate-200/90 bg-slate-100">
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
