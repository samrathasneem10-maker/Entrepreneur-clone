'use client';

import React from 'react';
import Link from 'next/link';
import { ECONOMY_POLICY_ARTICLES, getArticleUrl } from '@/data/newsData';

export const EconomyPublicPolicySection: React.FC = () => {
  return (
    <section className="bg-white pt-5 sm:pt-6 pb-5 sm:pb-6 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5 sm:mb-4.5">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Economy &amp; Public Policy
        </h2>
        <Link
          href="/category/economy-policy"
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

      {/* 4-Card Responsive Grid: Images first, text below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 items-stretch">
        {ECONOMY_POLICY_ARTICLES.map((article, idx) => {
          const articleUrl = getArticleUrl(article);
          return (
            <article key={`${article.id}-${idx}`} className="group flex flex-col justify-between w-full h-full">
              <Link
                href={articleUrl}
                className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
                aria-label={article.title}
              >
                {/* Card Image */}
                {article.imageUrl && (
                  <figure className="relative w-full aspect-[16/9.5] overflow-hidden rounded-xs mb-3 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-xs"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = 'true';
                          target.src = '/images/home-hero/grid-card-1.png';
                        }
                      }}
                    />
                  </figure>
                )}

                {/* Category Badge */}
                <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-2 text-left block">
                  {article.category}
                </span>

                {/* Title */}
                <h3 className="text-[17px] sm:text-[18px] lg:text-[19px] font-serif font-bold text-slate-900 leading-[1.3] tracking-tight mb-2 text-left group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                  {article.title}
                </h3>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-xs sm:text-[13px] text-slate-600 font-serif font-normal leading-relaxed mb-4 line-clamp-3 text-left flex-1">
                    {article.excerpt}
                  </p>
                )}

                {/* Author with Avatar */}
                {article.author?.name && (
                  <div className="mt-auto pt-1 flex items-center gap-2 text-[11px] sm:text-xs font-sans uppercase tracking-wider text-left">
                    {article.author.avatar && (
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 font-medium">BY</span>
                      <span className="text-[#1642D0] font-bold group-hover:underline underline-offset-2">
                        {article.author.name}
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
};
