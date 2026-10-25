'use client';

import React from 'react';
import Link from 'next/link';
import { INTERVIEWS_OPINIONS_SECTION, getArticleUrl } from '@/data/newsData';

export const InterviewsOpinionsSection: React.FC = () => {
  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Interviews &amp; Opinions
        </h2>
        <Link
          href="/topic/leadership"
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

      {/* 4-Card Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 items-stretch">
        {INTERVIEWS_OPINIONS_SECTION.map((card) => {
          const cardUrl = getArticleUrl(card);
          return (
            <article key={card.id} className="group flex flex-col justify-between w-full h-full">
              <Link
                href={cardUrl}
                className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
                aria-label={card.title}
              >
                {/* Image */}
                <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-lg sm:rounded-xl mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                </figure>

                {/* Category */}
                <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                  {card.category}
                </span>

                {/* Title */}
                <h3 className="text-[16px] sm:text-[17px] lg:text-[18px] font-serif font-bold text-slate-900 leading-[1.3] tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                  {card.title}
                </h3>

                {/* Excerpt */}
                {card.excerpt && (
                  <p className="text-xs sm:text-[13px] text-slate-600 font-serif leading-relaxed mb-3 line-clamp-3 flex-1">
                    {card.excerpt}
                  </p>
                )}

                {/* Date / Read Time / Author */}
                <div className="mt-auto text-[11px] font-sans text-slate-500 pt-1 flex items-center justify-between">
                  <span>{card.author?.name || 'Staff Contributor'}</span>
                  <div className="flex items-center gap-1.5">
                    <span>{card.date}</span>
                    <span className="text-slate-300">•</span>
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
