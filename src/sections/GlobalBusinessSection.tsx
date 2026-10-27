'use client';

import React from 'react';
import Link from 'next/link';
import { GLOBAL_BUSINESS_SECTION, getArticleUrl } from '@/data/newsData';

export const GlobalBusinessSection: React.FC = () => {
  const { featured, topCards, numberedItems } = GLOBAL_BUSINESS_SECTION;

  return (
    <section className="bg-white pt-5 sm:pt-6 pb-5 sm:pb-6 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5 sm:mb-4.5">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Left Column: Big Lead Story with Pure Photograph Background & HTML Text Overlay matching Image 4 */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full">
          <article className="group flex flex-col justify-between w-full h-full">
            <div className="relative h-full flex-1 w-full rounded-xs overflow-hidden bg-[#070b19] text-white flex flex-col justify-end min-h-[460px] sm:min-h-[500px] shadow-sm">
              {/* Clean Photo Background - strictly no embedded text */}
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
              />

              {/* Gradient Dark Overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent" />

              {/* Text Overlay: 100% Real Selectable Vector Typography */}
              <div className="relative z-10 p-5 sm:p-7 flex flex-col justify-end">
                {/* Category Badge */}
                <span className="inline-block bg-[#1642D0] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs mb-2.5 w-fit font-sans">
                  {featured.category}
                </span>

                {/* Lead Headline as Real HTML Text */}
                <h3 className="font-serif font-bold text-2xl sm:text-3xl lg:text-[28px] xl:text-[32px] leading-[1.2] tracking-tight text-white my-1.5">
                  <Link
                    href={getArticleUrl(featured)}
                    className="hover:underline text-white no-underline"
                  >
                    {featured.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                {featured.excerpt && (
                  <p className="font-sans text-xs sm:text-[14px] text-slate-200 leading-relaxed mt-1.5 max-w-xl my-0 line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}

                {/* Author Info */}
                <div className="flex items-center gap-2.5 mt-3.5 pt-1">
                  {featured.author?.avatar && (
                    <img
                      src={featured.author.avatar}
                      alt={featured.author.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-500 flex-shrink-0"
                    />
                  )}
                  <div className="text-xs font-sans">
                    <span className="font-bold text-white uppercase tracking-wider block">
                      BY {featured.author?.name}
                    </span>
                    <span className="text-slate-300 text-[11px]">
                      {featured.date} • {featured.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Right Column: 2 Top Cards + 3 Numbered Rows (01, 02, 03) */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full gap-4 sm:gap-5">
          {/* Top 2 Cards Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pb-3 border-b border-slate-100">
            {topCards.map((card) => (
              <article key={card.id} className="group flex flex-col justify-between">
                <Link
                  href={getArticleUrl(card)}
                  className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
                  aria-label={card.title}
                >
                  <div>
                    <figure className="relative w-full aspect-[16/9.5] overflow-hidden rounded-xs mb-2.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-xs"
                      />
                    </figure>
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1 block">
                      {card.category}
                    </span>
                    <h4 className="text-[15px] sm:text-[16px] xl:text-[17px] font-serif font-bold text-slate-900 leading-snug tracking-tight mb-1.5 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 line-clamp-2">
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

          {/* Bottom 3 Numbered Rows (01, 02, 03) with enlarged Europe flag image */}
          <div className="flex flex-col justify-between flex-1 divide-y divide-slate-100">
            {numberedItems.map((item) => (
              <article key={item.id} className="group flex-1 flex items-center py-2.5 sm:py-3 first:pt-0 last:pb-0">
                <Link
                  href={getArticleUrl(item)}
                  className="flex items-center justify-between gap-3 sm:gap-4 w-full no-underline text-inherit cursor-pointer"
                  aria-label={item.title}
                >
                  {/* Thumbnail (Enlarged and crisp) */}
                  <figure className="relative w-40 sm:w-48 md:w-52 lg:w-48 xl:w-56 aspect-[16/9.5] rounded-xs overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xs"
                    />
                  </figure>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-0.5 block">
                      {item.category}
                    </span>
                    <h5 className="text-[14.5px] sm:text-[15.5px] lg:text-[16px] font-serif font-bold text-slate-900 leading-snug tracking-tight line-clamp-2 mb-1 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2">
                      {item.title}
                    </h5>
                    <div className="text-[10px] sm:text-[11px] font-sans text-slate-500">
                      <span>{item.date}</span>
                      <span className="mx-1 text-slate-300">•</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>

                  {/* Big Number (01, 02, 03) on the Far Right */}
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
