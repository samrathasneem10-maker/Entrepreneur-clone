'use client';

import React from 'react';
import Link from 'next/link';
import { TOP_STORIES_GRID, getArticleUrl } from '@/data/newsData';

export const FeaturedGridSection: React.FC = () => {
  return (
    <section className="bg-white pt-8 sm:pt-10 pb-8 sm:pb-10 border-b border-slate-200/80 w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {TOP_STORIES_GRID.map((article) => {
            const articleUrl = getArticleUrl(article);
            return (
              <article key={article.id} className="group flex flex-col w-full h-full">
                <Link
                  href={articleUrl}
                  className="flex flex-col h-full no-underline text-inherit cursor-pointer"
                  aria-label={article.title}
                >
                  {/* Card Image */}
                  {article.imageUrl && (
                    <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-lg sm:rounded-xl mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = 'true';
                            if (article.id === 'grid-1') target.src = '/images/home-hero/grid-card-1.png';
                            else if (article.id === 'grid-2') target.src = '/images/home-hero/grid-card-2.png';
                            else if (article.id === 'grid-3') target.src = '/images/home-hero/grid-card-3.png';
                            else if (article.id === 'grid-4') target.src = '/images/home-hero/grid-card-4.png';
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-lg sm:rounded-xl"
                      />
                    </figure>
                  )}

                  {/* Category Badge */}
                  <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-2 text-left block">
                    {article.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-[17px] sm:text-[18px] lg:text-[19px] font-serif font-bold text-[#020618] leading-[1.3] tracking-tight mb-2 text-left group-hover:underline decoration-[#020618] decoration-1 underline-offset-2 transition-all">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-xs sm:text-[13px] text-slate-600 font-serif font-normal leading-relaxed mb-4 line-clamp-3 text-left flex-1">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Author Line */}
                  {article.author?.name && (
                    <div className="mt-auto pt-1 flex items-center gap-1.5 text-[11px] sm:text-xs font-sans uppercase tracking-wider text-left">
                      <span className="text-slate-500 font-medium">BY</span>
                      <span className="text-[#1642D0] font-bold group-hover:underline underline-offset-2">
                        {article.author.name}
                      </span>
                    </div>
                  )}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
