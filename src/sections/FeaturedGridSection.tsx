'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TOP_STORIES_GRID, HOMEPAGE_LATEST_STREAM, getArticleUrl, Article } from '@/data/newsData';

export const FeaturedGridSection: React.FC = () => {
  const [gridArticles, setGridArticles] = useState<Article[]>(TOP_STORIES_GRID);

  useEffect(() => {
    fetch('/api/articles?status=published&placement=latest_news&limit=15')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
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
            imageUrl: a.imageUrl || '/images/home-hero/grid-card-1.png',
          }));

          const combined = [...dbArticles];
          HOMEPAGE_LATEST_STREAM.forEach((item) => {
            if (!combined.some((c) => c.slug === item.slug || c.title.toLowerCase() === item.title.toLowerCase())) {
              combined.push(item);
            }
          });
          TOP_STORIES_GRID.forEach((item) => {
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
    <section className="bg-white pt-4 sm:pt-4.5 pb-1 sm:pb-2 w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-3.5 lg:gap-3.5 xl:gap-4 items-stretch">
          {gridArticles.map((article, idx) => {
            const articleUrl = getArticleUrl(article);
            const authorSlug = (article.author?.name || 'author')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');

            return (
              <article key={article.id || `grid-${idx}`} className="group flex flex-col justify-between w-full h-full">
                <div className="flex flex-col justify-between h-full no-underline text-inherit">
                  {/* Card Image - Sharp Rectangular Corners with slightly increased height for laptop & desktop */}
                  {article.imageUrl && (
                    <figure className="relative w-full aspect-[16/10.5] sm:aspect-[16/11.8] lg:aspect-[16/12] overflow-hidden rounded-none mb-2 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                      <Link href={articleUrl} className="block w-full h-full cursor-pointer">
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
                              else target.src = '/images/home-hero/grid-card-4.png';
                            }
                          }}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-none"
                        />
                      </Link>
                    </figure>
                  )}

                  {/* Text Content: Displayed with descriptions and author details matching Image 1 */}
                  <div className="flex flex-col justify-between flex-1">
                    {/* Category Badge */}
                    <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 text-left block no-underline hover:no-underline active:no-underline focus:no-underline">
                      {article.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-[17px] sm:text-[18px] lg:text-[19px] font-serif font-bold text-[#020618] leading-[1.3] tracking-tight mb-1.5 text-left group-hover:underline decoration-[#020618] decoration-1 underline-offset-2 transition-all">
                      <Link href={articleUrl} className="hover:text-[#1642D0] transition-colors">
                        {article.title}
                      </Link>
                    </h3>

                    {/* Excerpt / Description */}
                    {article.excerpt && (
                      <p className="text-xs sm:text-[13px] text-slate-600 font-serif font-normal leading-relaxed mb-3 sm:mb-2.5 line-clamp-3 text-left flex-1">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Author Line */}
                    {article.author?.name && (
                      <div className="mt-auto pt-1 flex items-center gap-1.5 text-[11px] sm:text-xs font-sans uppercase tracking-wider text-left">
                        <span className="text-slate-500 font-medium">BY</span>
                        <Link
                          href={`/author/${authorSlug}`}
                          className="text-[#1642D0] font-bold hover:underline underline-offset-2 transition-colors"
                        >
                          {article.author.name}
                        </Link>
                      </div>
                    )}
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
