'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MARKETING_BRANDING_SECTION, getArticleUrl, Article } from '@/data/newsData';

const BASELINE_MARKETING_BRANDING_4: Article[] = MARKETING_BRANDING_SECTION.slice(0, 4);

export interface MarketingSectionProps {
  initialArticles?: Article[];
}

export const MarketingBrandingSection: React.FC<MarketingSectionProps> = ({ initialArticles }) => {
  const [articles, setArticles] = useState<Article[]>(() =>
    initialArticles && initialArticles.length > 0 ? initialArticles : BASELINE_MARKETING_BRANDING_4
  );

  useEffect(() => {
    fetch('/api/articles?status=published&limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          // 1. Filter articles where Main category is Marketing & Branding
          // AND placement is none (no homepage placement)
          const dbArticles: Article[] = data.data
            .filter((a: any) => {
              const cat = (a.category || a.category_name || '').toLowerCase().trim();
              const isMarketingCat =
                cat === 'marketing & branding' ||
                cat === 'marketing and branding' ||
                cat === 'marketing & brand' ||
                cat === 'marketing and brand' ||
                cat === 'marketing-branding' ||
                cat === 'marketing_branding';
              if (!isMarketingCat) return false;

              // Rule: If article is assigned to an active homepage placement (e.g. latest_news, hero_section, trending_news),
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
              category: a.category || 'MARKETING & BRANDING',
              excerpt: a.excerpt || a.cardSummary || '',
              author: {
                name: (typeof a.author === 'object' ? a.author?.name : a.author) || a.authorName || 'Chloe Dubois',
                avatar: (typeof a.author === 'object' ? a.author?.avatar : null) || a.authorAvatar || '',
                title: (typeof a.author === 'object' ? a.author?.title : null) || a.authorTitle || 'Brand Strategist',
              },
              date: a.date || 'Oct 23, 2026',
              readTime: a.readTime || '5 min read',
              imageUrl: a.imageUrl || '/images/marketing-branding/marketing_1.png',
            }));

          // 2. Prepend DB articles (newest published first), then fill remaining slots with baseline articles
          const combined: Article[] = [...dbArticles];
          BASELINE_MARKETING_BRANDING_4.forEach((baseItem) => {
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
          <Link href="/topic/marketing-branding" className="hover:text-[#1642D0] transition-colors no-underline hover:no-underline active:no-underline focus:no-underline">
            Marketing &amp; Branding
          </Link>
        </h2>
        <Link
          href="/topic/marketing-branding"
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

      {/* 4-Card Responsive Grid: Images on top, vertical divider between articles starting below images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:-mx-4 xl:-mx-5 items-stretch">
        {articles.map((card, idx) => {
          const cardUrl = getArticleUrl(card);
          return (
            <article key={`${card.id}-${idx}`} className="group flex flex-col justify-between w-full h-full lg:px-4 xl:px-5">
              <Link
                href={cardUrl}
                className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
                aria-label={card.title}
              >
                {/* Image: clean with NO vertical divider between images */}
                <figure
                  className="relative w-full aspect-video overflow-hidden rounded-xs mb-3 border border-slate-200/90 bg-slate-100 flex-shrink-0"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  <img
                    src={card.imageUrl}
                    alt={card.title}
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

                {/* Article Content with Vertical Divider Starting from Text (not image) */}
                <div className="relative flex-1 flex flex-col justify-between min-w-0">
                  {idx > 0 && (
                    <span
                      className="hidden lg:block absolute -left-4 xl:-left-5 top-0 bottom-0 w-px bg-slate-200 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex-1 flex flex-col">
                    {/* Blue Category Badge */}
                    <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] no-underline hover:no-underline active:no-underline focus:no-underline mb-1.5 block truncate h-4 leading-4">
                      {card.category}
                    </span>

                    {/* Title */}
                    <h3
                      className="text-[16px] sm:text-[17px] lg:text-[18px] font-serif font-bold text-slate-900 leading-[1.28] tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all line-clamp-2 h-[44px] sm:h-[46px] lg:h-[48px] flex items-start"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {card.title}
                    </h3>

                    {/* Excerpt */}
                    <p
                      className="text-xs sm:text-[13px] text-slate-600 font-serif leading-relaxed mb-3 line-clamp-3 h-[58px] sm:h-[60px] lg:h-[64px]"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {card.excerpt || 'Read detailed analysis and industry coverage.'}
                    </p>
                  </div>

                  {/* Date & Read Time */}
                  <div className="mt-auto text-[11px] font-sans text-slate-500 pt-2 border-t border-slate-100/70 flex items-center justify-between">
                    <span className="truncate max-w-[120px]">{card.author?.name || 'Chloe Dubois'}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span>{card.date}</span>
                      <span className="text-slate-300">•</span>
                      <span>{card.readTime}</span>
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
