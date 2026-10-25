'use client';

import React from 'react';
import Link from 'next/link';
import { COMPANY_PROFILES_SECTION, getArticleUrl } from '@/data/newsData';

export const CompanyProfilesSection: React.FC = () => {
  return (
    <section className="my-8 sm:my-10 w-full rounded-2xl bg-[#FDFBF7] border border-[#EBE5DA] p-6 sm:p-8 lg:p-10 shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E26D2B] text-white shadow-xs">
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              The Leaders
            </h2>
            <span className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-widest block">
              Company Profiles &amp; Executive Visions
            </span>
          </div>
        </div>

        <Link
          href="/topic/leadership"
          className="inline-flex items-center gap-2 group text-xs sm:text-sm font-sans font-bold tracking-wider uppercase text-slate-800 hover:text-[#E26D2B] transition-colors"
        >
          <span>SEE ALL</span>
          <span className="w-5 h-5 sm:w-6 sm:h-6 bg-[#E26D2B] group-hover:bg-[#cb5d1f] text-white flex items-center justify-center rounded transition-colors shadow-sm">
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

      {/* 4 Portrait Cards Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {COMPANY_PROFILES_SECTION.map((card) => {
          const cardUrl = getArticleUrl(card);
          return (
            <article key={card.id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[3/4.2] flex flex-col justify-end bg-slate-900">
              <Link
                href={cardUrl}
                className="absolute inset-0 z-0 no-underline text-inherit cursor-pointer"
                aria-label={card.title}
              >
                {/* Full-bleed Portrait Image */}
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badge: Vibrant Green Pill matching reference image */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-sm bg-[#16A34A] text-white text-[10px] font-sans font-black tracking-wider uppercase shadow-xs">
                    {card.editor || 'PROFILE'}
                  </span>
                </div>

                {/* Bottom Dark Gradient Overlay for Contrast */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/85 to-transparent pt-20 pb-5 px-4 sm:px-5 flex flex-col justify-end">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-300 mb-1.5 block">
                    {card.category}
                  </span>
                  <h3 className="text-[15px] sm:text-[16px] lg:text-[17px] font-serif font-bold text-white leading-snug line-clamp-3 mb-2 group-hover:underline underline-offset-2 transition-all">
                    {card.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] font-sans text-slate-300 pt-1 border-t border-white/15">
                    <span>{card.author?.name || 'Staff Contributor'}</span>
                    <span>{card.readTime}</span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
};
