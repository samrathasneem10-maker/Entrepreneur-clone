'use client';

import React from 'react';
import Link from 'next/link';
import { GLOBAL_BUSINESS_SECTION, getArticleUrl } from '@/data/newsData';

export const GlobalBusinessSection: React.FC = () => {
  const { featured, topCards, numberedItems } = GLOBAL_BUSINESS_SECTION;

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 w-full">
      {/* Section Header (Clean without horizontal divider line) */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Global Business
        </h2>
        <Link
          href="/category/global-business"
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

      {/* Main Grid: Left Featured (6 cols) + Right Complex (6 cols) aligned at top and bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Big Lead Story */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full">
          <article className="group flex flex-col justify-between w-full h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              <div className="flex flex-col">
                <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-xl"
                  />
                </figure>

                <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                  {featured.category}
                </span>

                <h3 className="text-xl sm:text-2xl lg:text-[23px] xl:text-[25px] font-serif font-bold text-slate-900 leading-[1.22] tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                  {featured.title}
                </h3>

                {featured.excerpt && (
                  <p className="text-xs sm:text-[13px] text-slate-600 font-serif font-normal leading-relaxed mb-3 line-clamp-2">
                    {featured.excerpt}
                  </p>
                )}
              </div>

              {/* Author & Read Time */}
              <div className="mt-auto pt-1 flex items-center gap-2 text-xs font-sans text-slate-500">
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

        {/* Right Column: 2 Top Cards + 3 Numbered Rows (01, 02, 03) */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full gap-5">
          {/* Top 2 Cards Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pb-4 border-b border-slate-100">
            {topCards.map((card) => (
              <article key={card.id} className="group flex flex-col justify-between">
                <Link
                  href={getArticleUrl(card)}
                  className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
                  aria-label={card.title}
                >
                  <div>
                    <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-2.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-xl"
                      />
                    </figure>
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1 block">
                      {card.category}
                    </span>
                    <h4 className="text-[14px] sm:text-[15px] font-serif font-bold text-slate-900 leading-snug tracking-tight mb-1.5 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 line-clamp-2">
                      {card.title}
                    </h4>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-sans text-slate-500 mt-auto pt-1">
                    <span>{card.date}</span>
                    <span className="mx-1 text-slate-300">•</span>
                    <span>{card.readTime}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Bottom 3 Numbered Rows (01, 02, 03) */}
          <div className="flex flex-col justify-between flex-1 divide-y divide-slate-100">
            {numberedItems.map((item) => (
              <article key={item.id} className="group flex-1 flex items-center py-2.5 sm:py-3 first:pt-0 last:pb-0">
                <Link
                  href={getArticleUrl(item)}
                  className="flex items-center justify-between gap-4 w-full no-underline text-inherit cursor-pointer"
                  aria-label={item.title}
                >
                  {/* Thumbnail */}
                  <figure className="relative w-[110px] sm:w-[125px] aspect-[16/10] rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                    />
                  </figure>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-0.5 block">
                      {item.category}
                    </span>
                    <h5 className="text-[13px] sm:text-[14px] lg:text-[15px] font-serif font-bold text-slate-900 leading-snug tracking-tight line-clamp-2 mb-1 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2">
                      {item.title}
                    </h5>
                    <div className="text-[10px] sm:text-[11px] font-sans text-slate-500">
                      <span>{item.date}</span>
                      <span className="mx-1 text-slate-300">•</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>

                  {/* Big Number (01, 02, 03) */}
                  <span className="text-3xl sm:text-4xl font-serif text-slate-300 font-light select-none flex-shrink-0">
                    {`0${item.rank}`}
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
