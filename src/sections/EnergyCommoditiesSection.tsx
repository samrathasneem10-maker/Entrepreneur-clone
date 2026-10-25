'use client';

import React from 'react';
import Link from 'next/link';
import { ENERGY_COMMODITIES_SECTION, getArticleUrl } from '@/data/newsData';

export const EnergyCommoditiesSection: React.FC = () => {
  const { lead, middle, right } = ENERGY_COMMODITIES_SECTION;
  const leadUrl = getArticleUrl(lead);

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Energy &amp; Commodities
        </h2>
        <Link
          href="/topic/business-news"
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

      {/* 3-Column Composite Grid matching Image 3: Left (38%), Middle (34%), Right (28%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1.2fr_1fr] gap-6 lg:gap-7 xl:gap-8 items-stretch">
        
        {/* Left Column: Big Lead Story with Oil Refinery Image */}
        <div className="flex flex-col justify-between h-full">
          <article className="group flex flex-col justify-between h-full">
            <Link href={leadUrl} className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer">
              <div className="flex flex-col">
                <figure className="relative w-full aspect-[16/9.5] overflow-hidden rounded-xs mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={lead.imageUrl}
                    alt={lead.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 rounded-xs"
                  />
                </figure>

                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                  {lead.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                  {lead.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 font-serif leading-relaxed mb-3 line-clamp-3">
                  {lead.excerpt}
                </p>
              </div>

              <div className="mt-auto pt-1 text-xs font-sans text-slate-500 flex items-center gap-2">
                <span>{lead.date}</span>
                <span className="text-slate-300">•</span>
                <span>{lead.readTime}</span>
              </div>
            </Link>
          </article>
        </div>

        {/* Middle Column: Two Stacked Stories with Large Images on Left matching Image 3 */}
        <div className="flex flex-col justify-between h-full gap-5">
          {middle.map((item) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article key={item.id} className="group flex-1 flex flex-col justify-between">
                <Link href={itemUrl} className="flex flex-row gap-3.5 sm:gap-4 items-start h-full no-underline text-inherit cursor-pointer">
                  {/* Wide Rectangle Image */}
                  <figure className="relative w-40 sm:w-48 md:w-52 aspect-[16/10] rounded-xs overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-xs"
                    />
                  </figure>

                  {/* Details on Right */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1 block">
                        {item.category}
                      </span>

                      <h3 className="text-[14px] sm:text-[15px] font-serif font-bold text-slate-900 leading-snug mb-1 group-hover:underline underline-offset-2 transition-all line-clamp-2">
                        {item.title}
                      </h3>

                      {item.excerpt && (
                        <p className="text-[11px] sm:text-xs text-slate-600 font-serif leading-relaxed line-clamp-2 mb-1">
                          {item.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto text-[10px] sm:text-[11px] font-sans text-slate-500 pt-1">
                      <span>{item.date}</span>
                      <span className="mx-1 text-slate-300">•</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Right Column: 4 Compact News Items with Enlarged Thumbnails matching Image 3 */}
        <div className="flex flex-col justify-between h-full divide-y divide-slate-100">
          {right.map((item) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article key={item.id} className="group flex-1 flex items-center py-2 sm:py-2.5 first:pt-0 last:pb-0">
                <Link href={itemUrl} className="flex items-center gap-3 w-full no-underline text-inherit cursor-pointer">
                  {/* Enlarged Thumbnail */}
                  <figure className="relative w-24 sm:w-28 md:w-30 aspect-[16/10] flex-shrink-0 overflow-hidden rounded-xs bg-slate-100 border border-slate-200/90">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xs"
                    />
                  </figure>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9.5px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-0.5 block">
                      {item.category}
                    </span>
                    <h4 className="text-[12px] sm:text-[13px] font-serif font-bold text-slate-900 leading-snug line-clamp-2 group-hover:underline underline-offset-2 transition-all">
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
            );
          })}
        </div>

      </div>
    </section>
  );
};
