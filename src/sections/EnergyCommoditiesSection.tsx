'use client';

import React from 'react';
import Link from 'next/link';
import { ENERGY_COMMODITIES_SECTION, getArticleUrl } from '@/data/newsData';

export const EnergyCommoditiesSection: React.FC = () => {
  const { lead, middle, right } = ENERGY_COMMODITIES_SECTION;
  const leadUrl = getArticleUrl(lead);

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 w-full">
      {/* Section Header (Clean without horizontal divider line) */}
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

      {/* 3-Column Composite Grid aligned horizontally on the same level */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Big Featured Story (col-span-5) */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col justify-between h-full">
          <article className="group flex flex-col justify-between h-full">
            <Link href={leadUrl} className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer">
              <div className="flex flex-col">
                <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={lead.imageUrl}
                    alt={lead.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 rounded-xl"
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
                <span>{lead.author?.name}</span>
                <span className="text-slate-300">•</span>
                <span>{lead.date}</span>
                <span className="text-slate-300">•</span>
                <span>{lead.readTime}</span>
              </div>
            </Link>
          </article>
        </div>

        {/* Middle Column: Two Stacked Stories (col-span-4) */}
        <div className="md:col-span-6 lg:col-span-4 flex flex-col justify-between h-full gap-5">
          {middle.map((item) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article key={item.id} className="group flex-1 flex flex-col justify-between">
                <Link href={itemUrl} className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer">
                  <div>
                    <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-2.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-xl"
                      />
                    </figure>

                    <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1 block">
                      {item.category}
                    </span>

                    <h3 className="text-[15px] sm:text-[16px] font-serif font-bold text-slate-900 leading-snug mb-1.5 group-hover:underline underline-offset-2 transition-all line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-auto text-[10px] sm:text-[11px] font-sans text-slate-500 flex items-center gap-2 pt-1">
                    <span>{item.date}</span>
                    <span className="text-slate-300">•</span>
                    <span>{item.readTime}</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Right Column: 4 Compact Stacked News Items (col-span-3) */}
        <div className="md:col-span-6 lg:col-span-3 flex flex-col justify-between h-full divide-y divide-slate-100">
          {right.map((item) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article key={item.id} className="group flex-1 flex items-center py-2.5 first:pt-0 last:pb-0">
                <Link href={itemUrl} className="flex items-center gap-3 w-full no-underline text-inherit cursor-pointer">
                  <figure className="relative w-20 h-14 sm:w-22 sm:h-15 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/90">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                    />
                  </figure>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-0.5 block">
                      {item.category}
                    </span>
                    <h4 className="text-[12px] sm:text-[13px] font-serif font-bold text-slate-900 leading-snug line-clamp-2 group-hover:underline underline-offset-2 transition-all">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-sans text-slate-400 mt-0.5 block">
                      {item.date}
                    </span>
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
