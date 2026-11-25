'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TOP_STORIES_GRID, BASELINE_LATEST_NEWS_9, getArticleUrl, Article } from '@/data/newsData';

export interface FeaturedGridSectionProps {
  initialArticles?: Article[];
}

export const FeaturedGridSection: React.FC<FeaturedGridSectionProps> = ({ initialArticles }) => {
  const [gridArticles, setGridArticles] = useState<Article[]>(() =>
    initialArticles && initialArticles.length > 0 ? initialArticles : BASELINE_LATEST_NEWS_9.slice(5, 9)
  );

  useEffect(() => {
    fetch('/api/articles?status=published&placement=latest_news&limit=15')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          const dbArticles: Article[] = data.data.map((a: any) => ({
            id: a.slug || String(a.dbId || a.id),
            slug: a.slug,
            title: a.title,
            category: a.category || 'BUILDING A BUSINESS',
            author: a.author || {
              name: a.authorName || 'Michael Andrews Cooper',
              avatar: a.authorAvatar || '/images/home-hero/author-scott.png',
              title: a.authorTitle || 'Executive Contributor',
              bio: a.authorBio || '',
            },
            date: a.date || 'Just now',
            readTime: a.readTime || '5 min read',
            excerpt: a.excerpt || a.cardSummary || '',
            imageUrl: a.imageUrl || '',
          }));

          const combined = [...dbArticles];
          BASELINE_LATEST_NEWS_9.forEach((item) => {
            if (!combined.some((c) => c.slug === item.slug || c.title.toLowerCase() === item.title.toLowerCase())) {
              combined.push(item);
            }
          });

          // Latest News Slots 6 to 9 (indices 5 to 9)
          const slice4 = combined.slice(5, 9);
          if (slice4.length === 4) {
            setGridArticles(slice4);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white pt-4 sm:pt-4.5 pb-2 sm:pb-3 w-full">
      <div className="w-full">
        {/* 4 Dedicated Slots Grid matching Image 4 & 5 with text on bottom/top, sharp corners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 lg:gap-4.5 xl:gap-5 items-stretch">
          {gridArticles.slice(0, 4).map((article, idx) => {
            const articleUrl = getArticleUrl(article);
            const authorSlug = (article.author?.name || 'author')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');

            return (
              <article key={article.id || `grid-${idx}`} className="group flex flex-col justify-between w-full h-full">
                <div className="flex flex-col justify-between h-full no-underline text-inherit">
                  {/* Card Image: Sharp non-rounded corners matching user instruction "don't add round corners" */}
                  <figure
                    className="relative w-full aspect-[16/10.5] overflow-hidden rounded-none mb-2.5 border border-slate-200/90 bg-slate-100 flex-shrink-0"
                    style={{ aspectRatio: '16 / 10.5' }}
                  >
                    <Link href={articleUrl} className="block w-full h-full cursor-pointer">
                      <img
                        src={article.imageUrl || '/images/home-hero/grid-card-1.png'}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = 'true';
                            target.src = '/images/home-hero/grid-card-1.png';
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-none"
                      />
                    </Link>
                  </figure>

                  {/* Text Content: Matching Image 5 typography and structure */}
                  <div className="flex flex-col justify-between flex-1 min-w-0 text-center">
                    <div>
                      {/* Category Badge - Centered */}
                      <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#c61830] mb-1.5 text-center block no-underline hover:no-underline active:no-underline focus:no-underline truncate h-4 leading-4">
                        {article.category}
                      </span>

                      {/* Title - Line clamp 3, Centered font-serif matching Image 5 */}
                      <h3
                        className="text-[16px] sm:text-[17px] lg:text-[18px] font-serif font-bold text-[#020618] leading-[1.28] tracking-tight mb-2 text-center group-hover:underline decoration-[#020618] decoration-1 underline-offset-2 transition-all line-clamp-3"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        <Link href={articleUrl} className="hover:text-[#c61830] transition-colors">
                          {article.title}
                        </Link>
                      </h3>

                      {/* Excerpt / Description - Line clamp 3, Centered matching Image 5 */}
                      <p
                        className="text-xs sm:text-[13px] text-slate-600 font-serif font-normal leading-relaxed mb-3 line-clamp-3 text-center"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {article.excerpt || 'Read the full coverage and in-depth reporting on key market developments.'}
                      </p>
                    </div>

                    {/* Author Line: Centered BY AUTHOR NAME matching Image 5 */}
                    <div className="mt-auto pt-2 border-t border-slate-100/70 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-sans uppercase tracking-wider text-center min-h-[28px]">
                      <span className="text-slate-500 font-medium">BY</span>
                      <Link
                        href={`/author/${authorSlug}`}
                        className="text-[#c61830] font-bold hover:underline underline-offset-2 transition-colors truncate"
                      >
                        {article.author?.name || 'United States Today Staff'}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
