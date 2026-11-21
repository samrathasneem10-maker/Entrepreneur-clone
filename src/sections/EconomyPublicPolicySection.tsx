'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ECONOMY_POLICY_ARTICLES, getArticleUrl, Article } from '@/data/newsData';

const BASELINE_ECONOMY_POLICY_4: Article[] = ECONOMY_POLICY_ARTICLES.slice(0, 4);

export interface EconomySectionProps {
  initialArticles?: Article[];
}

export const EconomyPublicPolicySection: React.FC<EconomySectionProps> = ({ initialArticles }) => {
  const [articles, setArticles] = useState<Article[]>(() =>
    initialArticles && initialArticles.length > 0 ? initialArticles : BASELINE_ECONOMY_POLICY_4
  );

  useEffect(() => {
    fetch('/api/articles?status=published&limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          // 1. Filter articles where Main category is Economy & Policy
          // AND placement is none (no homepage placement)
          const dbArticles: Article[] = data.data
            .filter((a: any) => {
              const cat = (a.category || a.category_name || '').toLowerCase().trim();
              const isEconomyCat =
                cat === 'economy & policy' ||
                cat === 'economy & public policy' ||
                cat === 'economy and policy' ||
                cat === 'economy and public policy' ||
                cat === 'economy-policy';
              if (!isEconomyCat) return false;

              // Rule: If article is assigned to an active homepage placement (e.g. latest_news, hero_section, etc.),
              // it cannot be shown in this section on the homepage!
              const placement = (a.placement || 'none').toLowerCase().trim();
              if (placement !== 'none' && placement !== '') {
                return false;
              }

              return true;
            })
            .map((a: any) => ({
              id: a.slug || String(a.dbId || a.id),
              slug: a.slug,
              title: a.title,
              category: a.category || 'ECONOMY & POLICY',
              author: {
                name: (typeof a.author === 'object' ? a.author?.name : a.author) || a.authorName || 'Staff Contributor',
                avatar: (typeof a.author === 'object' ? a.author?.avatar : null) || a.authorAvatar || '/images/authors/james-carter.png',
                title: (typeof a.author === 'object' ? a.author?.title : null) || a.authorTitle || 'Economics Editor',
              },
              date: a.date || 'Oct 22, 2026',
              readTime: a.readTime || '6 min read',
              excerpt: a.excerpt || a.cardSummary || '',
              imageUrl: a.imageUrl || '/images/economy/global-resilience.png',
            }));

          // 2. Prepend DB articles (newest published first), then fill remaining slots with baseline articles
          const combined: Article[] = [...dbArticles];
          BASELINE_ECONOMY_POLICY_4.forEach((baseItem) => {
            const alreadyIn = combined.some(
              (c) => (c.slug && baseItem.slug && c.slug === baseItem.slug) || (c.id && baseItem.id && c.id === baseItem.id)
            );
            if (!alreadyIn) {
              combined.push(baseItem);
            }
          });

          // 3. Exactly 4 slots: 1st through 4th
          // When a new article comes in, slot 4 drops off from the homepage section and is only visible inside category pages
          const active4 = combined.slice(0, 4);
          if (active4.length >= 1) {
            setArticles(active4);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white pt-5 sm:pt-6 pb-5 sm:pb-6 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5 sm:mb-4.5">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          <Link href="/topic/economy-policy" className="hover:text-[#1642D0] transition-colors no-underline hover:no-underline active:no-underline focus:no-underline">
            Economy &amp; Public Policy
          </Link>
        </h2>
        <Link
          href="/topic/economy-policy"
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
        {articles.map((article, idx) => {
          const articleUrl = getArticleUrl(article);
          return (
            <article key={`${article.id}-${idx}`} className="group flex flex-col justify-between w-full h-full">
              <Link
                href={articleUrl}
                className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
                aria-label={article.title}
              >
                {/* Card Image: All 4 images exact same 16:9 size as 1st image */}
                <figure
                  className="relative w-full aspect-video overflow-hidden rounded-xs mb-3 border border-slate-200/90 bg-slate-100 flex-shrink-0"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  <img
                    src={article.imageUrl || '/images/economy/global-resilience.png'}
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

                {/* Respective text placed underneath each image with identical horizontal alignment */}
                <div className="relative flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex-1 flex flex-col">
                    {/* Category Badge */}
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] no-underline hover:no-underline active:no-underline focus:no-underline mb-1.5 block truncate h-4 leading-4 text-left">
                      {article.category}
                    </span>

                    {/* Title - Line clamp 2 with uniform height */}
                    <h3
                      className="text-[16px] sm:text-[17px] lg:text-[18px] font-serif font-bold text-slate-900 leading-[1.28] tracking-tight mb-2 text-left group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all line-clamp-2 h-[44px] sm:h-[46px] lg:h-[48px] flex items-start"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {article.title}
                    </h3>

                    {/* Excerpt - Line clamp 3 with uniform height */}
                    <p
                      className="text-xs sm:text-[13px] text-slate-600 font-serif leading-relaxed mb-3 line-clamp-3 h-[58px] sm:h-[60px] lg:h-[64px] text-left"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {article.excerpt || 'Read comprehensive analysis on economic trends, public policy, and global financial governance.'}
                    </p>
                  </div>

                  {/* Author / Date / ReadTime Footer */}
                  <div className="mt-auto pt-2 border-t border-slate-100/70 flex items-center justify-between text-[11px] font-sans text-slate-500">
                    <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                      {article.author?.avatar && (
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="w-5 h-5 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        />
                      )}
                      <span className="truncate text-slate-700 font-medium">
                        {article.author?.name || 'Staff Contributor'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-[10px] sm:text-[11px]">
                      <span>{article.date}</span>
                      <span className="text-slate-300">•</span>
                      <span>{article.readTime}</span>
                    </div>
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
