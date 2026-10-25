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
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-6 border-b border-slate-200">
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

      {/* 3-Column Composite Grid matching reference image */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Big Featured Story (col-span-5) */}
        <div className="md:col-span-12 lg:col-span-5">
          <article className="group flex flex-col w-full h-full">
            <Link href={leadUrl} className="flex flex-col h-full no-underline text-inherit cursor-pointer">
              <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-4 border border-slate-200 bg-slate-100 flex-shrink-0">
                <img
                  src={lead.imageUrl}
                  alt={lead.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </figure>

              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-2 block">
                {lead.category}
              </span>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-tight mb-2.5 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                {lead.title}
              </h3>

              <p className="text-sm text-slate-600 font-serif leading-relaxed mb-3.5 line-clamp-3">
                {lead.excerpt}
              </p>

              <div className="mt-auto text-xs font-sans text-slate-500 flex items-center gap-2">
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
        <div className="md:col-span-6 lg:col-span-4 flex flex-col gap-6">
          {middle.map((item) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article key={item.id} className="group flex flex-col w-full">
                <Link href={itemUrl} className="flex flex-col no-underline text-inherit cursor-pointer">
                  <figure className="relative w-full aspect-[16/9] overflow-hidden rounded-xl mb-3 border border-slate-200 bg-slate-100 flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  </figure>

                  <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                    {item.category}
                  </span>

                  <h3 className="text-[15px] sm:text-[16px] font-serif font-bold text-slate-900 leading-snug mb-2 group-hover:underline underline-offset-2 transition-all">
                    {item.title}
                  </h3>

                  <div className="text-[11px] font-sans text-slate-500 flex items-center gap-2">
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
        <div className="md:col-span-6 lg:col-span-3 flex flex-col divide-y divide-slate-100">
          {right.map((item, idx) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article key={item.id} className={`group py-3.5 first:pt-0 last:pb-0`}>
                <Link href={itemUrl} className="flex items-start gap-3 no-underline text-inherit cursor-pointer">
                  <figure className="relative w-20 h-16 sm:w-22 sm:h-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </figure>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1 block">
                      {item.category}
                    </span>
                    <h4 className="text-[13px] font-serif font-bold text-slate-900 leading-snug line-clamp-2 group-hover:underline underline-offset-2 transition-all">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-sans text-slate-400 mt-1 block">
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
