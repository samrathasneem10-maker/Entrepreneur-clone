'use client';

import React from 'react';
import Link from 'next/link';
import { TRENDING_RESILIENCE_SECTION, getArticleUrl } from '@/data/newsData';

export const TrendingResilienceSection: React.FC = () => {
  const { featured, items } = TRENDING_RESILIENCE_SECTION;

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 border-b border-slate-200/80 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Big Resilience Lead Story */}
        <div className="lg:col-span-6 flex flex-col">
          <article className="group flex flex-col w-full h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-4 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </figure>

              <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-2 block">
                {featured.category}
              </span>

              <h3 className="text-xl sm:text-2xl lg:text-[25px] font-serif font-bold text-slate-900 leading-[1.25] tracking-tight mb-2.5 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                {featured.title}
              </h3>

              {featured.excerpt && (
                <p className="text-sm sm:text-[14px] text-slate-600 font-serif leading-relaxed mb-4 line-clamp-3">
                  {featured.excerpt}
                </p>
              )}

              {/* Author & Read Time */}
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
                  <span className="text-slate-500">{featured.date}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{featured.readTime}</span>
                </div>
              </div>
            </Link>
          </article>
        </div>

        {/* Right Column: Trending News (01 to 05) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="pb-3 sm:pb-4 mb-4 border-b border-slate-200">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight">
              Trending News
            </h3>
          </div>

          <div className="flex flex-col divide-y divide-slate-200">
            {items.map((item) => (
              <article key={item.id} className="group py-3 sm:py-3.5 first:pt-0 last:pb-0">
                <Link
                  href={getArticleUrl(item)}
                  className="flex items-center gap-3 sm:gap-4 no-underline text-inherit cursor-pointer"
                  aria-label={item.title}
                >
                  {/* Big Number (01, 02, ...) */}
                  <span className="text-2xl sm:text-3xl font-serif text-slate-300 font-light select-none w-7 flex-shrink-0">
                    {`0${item.rank}`}
                  </span>

                  {/* Thumbnail */}
                  <figure className="relative w-[100px] sm:w-[120px] h-[58px] sm:h-[65px] rounded-lg overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </figure>

                  {/* Title & Meta */}
                  <div className="flex-1 min-w-0 pr-1">
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1 block">
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
