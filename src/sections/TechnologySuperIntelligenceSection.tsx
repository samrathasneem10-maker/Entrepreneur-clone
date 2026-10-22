'use client';

import React from 'react';
import Link from 'next/link';
import { TECH_SUPER_INTELLIGENCE_SECTION, getArticleUrl } from '@/data/newsData';

export const TechnologySuperIntelligenceSection: React.FC = () => {
  const { leftItems, featured, rightCards } = TECH_SUPER_INTELLIGENCE_SECTION;

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 border-b border-slate-200/80 w-full">
      {/* Header with Title, Subtitle and See All */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 sm:pb-4 mb-6 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Technology & Super Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
            Exploring AI breakthroughs, emerging technologies, and the innovations shaping a smarter future.
          </p>
        </div>
        <Link
          href="/category/technology-ai"
          className="inline-flex items-center gap-2 group text-xs sm:text-sm font-sans font-bold tracking-wider uppercase text-slate-800 hover:text-[#1642D0] transition-colors flex-shrink-0 self-start sm:self-auto"
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

      {/* 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
        {/* Left Column: 5 Stacked Tech Feeds (3.5 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col divide-y divide-slate-200 order-2 lg:order-1">
          {leftItems.map((item) => (
            <article key={item.id} className="group py-3 sm:py-3.5 first:pt-0 last:pb-0">
              <Link
                href={getArticleUrl(item)}
                className="flex items-center gap-3.5 no-underline text-inherit cursor-pointer"
                aria-label={item.title}
              >
                <figure className="relative w-[85px] sm:w-[95px] h-[58px] sm:h-[62px] rounded-md overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </figure>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1 block">
                    {item.category}
                  </span>
                  <h4 className="text-[13px] sm:text-[14px] font-serif font-bold text-slate-900 leading-snug tracking-tight line-clamp-2 mb-1 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2">
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

        {/* Center Column: Big AI Robot Lead Story (5 cols) */}
        <div className="lg:col-span-4 xl:col-span-5 flex flex-col order-1 lg:order-2">
          <article className="group flex flex-col w-full h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              <figure className="relative w-full aspect-[16/11] overflow-hidden rounded-xl mb-4 border border-slate-200/90 bg-slate-100 flex-shrink-0">
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
                <p className="text-sm text-slate-600 font-serif leading-relaxed mb-4 line-clamp-3">
                  {featured.excerpt}
                </p>
              )}

              {/* Author byline */}
              <div className="mt-auto pt-1 flex items-center gap-2 text-xs font-sans">
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

        {/* Right Column: 2 Cards (AI Startups & Semiconductors) (3.5 cols) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6 order-3 divide-y lg:divide-y-0 divide-slate-200">
          {rightCards.map((card, idx) => (
            <article
              key={card.id}
              className={`group flex flex-col ${idx !== 0 ? 'pt-6 lg:pt-0' : ''}`}
            >
              <Link
                href={getArticleUrl(card)}
                className="flex flex-col no-underline text-inherit cursor-pointer"
                aria-label={card.title}
              >
                <figure className="relative w-full aspect-[16/9] overflow-hidden rounded-lg mb-3 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                </figure>
                <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                  {card.category}
                </span>
                <h4 className="text-[15px] sm:text-[16px] font-serif font-bold text-slate-900 leading-snug tracking-tight mb-1.5 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2">
                  {card.title}
                </h4>
                <div className="text-[10px] sm:text-[11px] font-sans text-slate-500 mb-2">
                  <span>{card.date}</span>
                  <span className="mx-1 text-slate-300">•</span>
                  <span>{card.readTime}</span>
                </div>
                {card.excerpt && (
                  <p className="text-xs text-slate-600 font-serif leading-relaxed line-clamp-2">
                    {card.excerpt}
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
