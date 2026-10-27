'use client';

import React from 'react';
import Link from 'next/link';
import { TECH_SUPER_INTELLIGENCE_SECTION, getArticleUrl } from '@/data/newsData';

export const TechnologySuperIntelligenceSection: React.FC = () => {
  const { featured, leftItems, rightCards } = TECH_SUPER_INTELLIGENCE_SECTION;

  return (
    <section className="bg-white pt-5 sm:pt-6 pb-5 sm:pb-6 w-full">
      {/* Header with Title, Subtitle and See All */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3.5 sm:mb-4.5 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Technology &amp; Super Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
            Exploring AI breakthroughs, emerging technologies, and the innovations shaping a smarter future.
          </p>
        </div>

        <Link
          href="/category/tech-superintelligence"
          className="inline-flex items-center gap-2 group text-xs sm:text-sm font-sans font-bold tracking-wider uppercase text-slate-800 hover:text-[#1642D0] transition-colors flex-shrink-0"
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

      {/* 3-Column Responsive Grid: Left, Middle, and Right perfectly aligned at top and bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1.35fr_1.1fr] gap-6 lg:gap-7 items-stretch">
        
        {/* Left Column: 5 Stacked Tech Items with Equal Vertical Rhythm */}
        <div className="flex flex-col justify-between h-full divide-y divide-slate-100 order-2 lg:order-1">
          {leftItems.map((item) => (
            <article key={item.id} className="group flex-1 flex items-center py-2.5 sm:py-3 first:pt-0 last:pb-0">
              <Link
                href={getArticleUrl(item)}
                className="flex items-center gap-3.5 sm:gap-4 w-full no-underline text-inherit cursor-pointer"
                aria-label={item.title}
              >
                {/* Large high-clarity thumbnail matching Reference Image 1 */}
                <figure className="relative w-36 sm:w-42 md:w-46 xl:w-50 aspect-[16/10.5] rounded-xs overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xs"
                  />
                </figure>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-0.5 block">
                    {item.category}
                  </span>
                  <h4 className="text-[14px] sm:text-[14.5px] lg:text-[15px] font-serif font-bold text-slate-900 leading-snug tracking-tight line-clamp-2 mb-1 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2">
                    {item.title}
                  </h4>
                  <div className="text-[10px] font-sans text-slate-500">
                    <span>{item.date}</span>
                    <span className="mx-1 text-slate-300">•</span>
                    <span>{item.readTime}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Center Column: Big AI Robot Lead Story - Image on top, text separately below */}
        <div className="flex flex-col justify-between h-full order-1 lg:order-2">
          <article className="group flex flex-col justify-between h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              <div className="flex flex-col">
                {/* Pure Large Image on Top matching Reference Image 1 */}
                <figure className="relative w-full aspect-[16/10.8] overflow-hidden rounded-xs mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-xs"
                  />
                </figure>

                {/* Content Placed Separately Below the Image */}
                <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                  {featured.category}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-[27px] xl:text-[29px] font-serif font-bold text-slate-900 leading-[1.22] tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all line-clamp-2">
                  {featured.title}
                </h3>

                {featured.excerpt && (
                  <p className="text-xs sm:text-[14px] text-slate-600 font-serif leading-relaxed mb-2.5 line-clamp-2 sm:line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
              </div>

              {/* Author byline aligned at bottom */}
              <div className="mt-auto pt-1 flex items-center gap-2 text-xs font-sans text-slate-500">
                {featured.author?.avatar && (
                  <img
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  />
                )}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500 font-medium">By</span>
                  <span className="text-[#1642D0] font-bold group-hover:underline">
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

        {/* Right Column: 2 Cards (AI Startups & Semiconductors) - Sized to match left and center height */}
        <div className="flex flex-col justify-between h-full gap-5 sm:gap-6 order-3">
          {rightCards.map((card) => (
            <article
              key={card.id}
              className="group flex-1 flex flex-col justify-between"
            >
              <Link
                href={getArticleUrl(card)}
                className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
                aria-label={card.title}
              >
                <div>
                  {/* Large Proportional Image on Top matching Reference Image 1 */}
                  <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xs mb-2.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-xs"
                    />
                  </figure>

                  {/* Content Placed Separately Below the Image */}
                  <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-0.5 block">
                    {card.category}
                  </span>

                  <h4 className="text-[15px] sm:text-[16px] xl:text-[16.5px] font-serif font-bold text-slate-900 leading-snug tracking-tight mb-0.5 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 line-clamp-2">
                    {card.title}
                  </h4>

                  <div className="text-[10px] sm:text-[11px] font-sans text-slate-500 mb-1">
                    <span>{card.date}</span>
                    <span className="mx-1 text-slate-300">•</span>
                    <span>{card.readTime}</span>
                  </div>

                  {card.excerpt && (
                    <p className="text-xs text-slate-600 font-serif leading-relaxed line-clamp-2">
                      {card.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
