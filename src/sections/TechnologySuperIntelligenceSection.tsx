'use client';

import React from 'react';
import Link from 'next/link';
import { TECH_SUPER_INTELLIGENCE_SECTION, getArticleUrl } from '@/data/newsData';

export const TechnologySuperIntelligenceSection: React.FC = () => {
  const { leftItems, featured, rightCards } = TECH_SUPER_INTELLIGENCE_SECTION;

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 w-full">
      {/* Header with Title, Subtitle and See All */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-6 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Technology &amp; Super Intelligence
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

      {/* 3-Column Responsive Grid: Images first, text separately below each image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Stacked Tech Feeds with all 5 high-clarity items */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between h-full divide-y divide-slate-100 order-2 lg:order-1">
          {leftItems.map((item) => (
            <article key={item.id} className="group flex-1 flex items-center py-2.5 first:pt-0 last:pb-0">
              <Link
                href={getArticleUrl(item)}
                className="flex items-center gap-3.5 w-full no-underline text-inherit cursor-pointer"
                aria-label={item.title}
              >
                {/* High-clarity thumbnail */}
                <figure className="relative w-24 sm:w-28 md:w-32 aspect-[16/10] rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                  />
                </figure>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-0.5 block">
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

        {/* Center Column: Big AI Robot Lead Story - Image on top, text separately below */}
        <div className="lg:col-span-4 xl:col-span-5 flex flex-col justify-between h-full order-1 lg:order-2">
          <article className="group flex flex-col justify-between w-full h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              <div className="flex flex-col">
                {/* Pure Image on Top - No Text Overlay */}
                <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-xl"
                  />
                </figure>

                {/* Content Placed Separately Below the Image */}
                <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                  {featured.category}
                </span>

                <h3 className="text-xl sm:text-2xl lg:text-[23px] xl:text-[25px] font-serif font-bold text-slate-900 leading-[1.22] tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                  {featured.title}
                </h3>

                {featured.excerpt && (
                  <p className="text-xs sm:text-[13px] text-slate-600 font-serif leading-relaxed mb-3 line-clamp-2">
                    {featured.excerpt}
                  </p>
                )}
              </div>

              {/* Author byline */}
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

        {/* Right Column: 2 Cards (AI Startups & Semiconductors) - Images on top, text separately below */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col justify-between h-full gap-5 order-3">
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
                  {/* Pure Image on Top - No Text Overlay */}
                  <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-2.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-xl"
                    />
                  </figure>

                  {/* Content Placed Separately Below the Image */}
                  <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1 block">
                    {card.category}
                  </span>
                  <h4 className="text-[14px] sm:text-[15px] font-serif font-bold text-slate-900 leading-snug tracking-tight mb-1 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 line-clamp-2">
                    {card.title}
                  </h4>
                </div>
                <div className="mt-auto text-[10px] sm:text-[11px] font-sans text-slate-500 pt-1">
                  <span>{card.date}</span>
                  <span className="mx-1 text-slate-300">•</span>
                  <span>{card.readTime}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
