'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TECH_SUPER_INTELLIGENCE_SECTION, getArticleUrl, Article } from '@/data/newsData';

const BASELINE_TECH_SUPER_INTELLIGENCE_8: Article[] = [
  TECH_SUPER_INTELLIGENCE_SECTION.featured,
  TECH_SUPER_INTELLIGENCE_SECTION.leftItems[0],
  TECH_SUPER_INTELLIGENCE_SECTION.leftItems[1],
  TECH_SUPER_INTELLIGENCE_SECTION.leftItems[2],
  TECH_SUPER_INTELLIGENCE_SECTION.leftItems[3],
  TECH_SUPER_INTELLIGENCE_SECTION.leftItems[4],
  TECH_SUPER_INTELLIGENCE_SECTION.rightCards[0],
  TECH_SUPER_INTELLIGENCE_SECTION.rightCards[1],
];

export interface TechSectionProps {
  initialFeatured?: Article;
  initialLeftItems?: Article[];
  initialRightCards?: Article[];
}

export const TechnologySuperIntelligenceSection: React.FC<TechSectionProps> = ({
  initialFeatured,
  initialLeftItems,
  initialRightCards,
}) => {
  const [featured, setFeatured] = useState<Article>(() => initialFeatured || BASELINE_TECH_SUPER_INTELLIGENCE_8[0]);
  const [leftItems, setLeftItems] = useState<Article[]>(() =>
    initialLeftItems && initialLeftItems.length > 0
      ? initialLeftItems
      : BASELINE_TECH_SUPER_INTELLIGENCE_8.slice(1, 6)
  );
  const [rightCards, setRightCards] = useState<Article[]>(() =>
    initialRightCards && initialRightCards.length > 0
      ? initialRightCards
      : BASELINE_TECH_SUPER_INTELLIGENCE_8.slice(6, 8)
  );

  useEffect(() => {
    fetch('/api/articles?status=published&limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          // 1. Filter articles where Main category is Technology & Super Intelligence
          // AND placement is none (no homepage placement)
          const dbArticles: Article[] = data.data
            .filter((a: any) => {
              const cat = (a.category || a.category_name || '').toLowerCase().trim();
              const isTechCat =
                cat === 'technology & super intelligence' ||
                cat === 'technology and super intelligence' ||
                cat === 'technology-super-intelligence' ||
                cat === 'technology_super_intelligence' ||
                cat === 'tech super intelligence';
              if (!isTechCat) return false;

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
              category: a.category || 'ARTIFICIAL INTELLIGENCE',
              excerpt: a.excerpt || a.cardSummary || '',
              author: {
                name: (typeof a.author === 'object' ? a.author?.name : a.author) || a.authorName || 'Staff Contributor',
                avatar: (typeof a.author === 'object' ? a.author?.avatar : null) || a.authorAvatar || '/images/authors/james-carter.png',
                title: (typeof a.author === 'object' ? a.author?.title : null) || a.authorTitle || 'Super Intelligence & AI Lead',
              },
              date: a.date || 'Oct 21, 2026',
              readTime: a.readTime || '5 min read',
              imageUrl: a.imageUrl || '/images/tech-superintelligence/superintelligence-robot.png',
            }));

          // 2. Prepend DB articles (newest published first), then fill remaining slots with baseline articles
          const combined: Article[] = [...dbArticles];
          BASELINE_TECH_SUPER_INTELLIGENCE_8.forEach((baseItem) => {
            const alreadyIn = combined.some(
              (c) => (c.slug && baseItem.slug && c.slug === baseItem.slug) || (c.id && baseItem.id && c.id === baseItem.id)
            );
            if (!alreadyIn) {
              combined.push(baseItem);
            }
          });

          // 3. Exactly 8 slots:
          // 1st slot is center featured lead story, 2nd-6th are leftItems (5 stacked), 7th-8th are rightCards (2 stacked)
          // When a new article comes in, slot 8 drops off from the homepage section and is only visible inside category pages
          const active8 = combined.slice(0, 8);
          if (active8.length >= 1) {
            setFeatured(active8[0]);
            if (active8.length >= 6) {
              setLeftItems(active8.slice(1, 6));
            }
            if (active8.length >= 8) {
              setRightCards(active8.slice(6, 8));
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white pt-5 sm:pt-6 pb-5 sm:pb-6 w-full">
      {/* Header with Title, Subtitle and See All */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3.5 sm:mb-4.5 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight flex items-center">
        <span className="inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#c61830] rounded-2xs mr-2 -translate-y-0.5 shrink-0" aria-hidden="true" />
            <Link href="/topic/technology-super-intelligence" className="hover:text-[#c61830] transition-colors no-underline hover:no-underline active:no-underline focus:no-underline">
              Technology &amp; Super Intelligence
            </Link>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
            Exploring AI breakthroughs, emerging technologies, and the innovations shaping a smarter future.
          </p>
        </div>

        <Link
          href="/topic/technology-super-intelligence"
          className="inline-flex items-center gap-2 group text-xs sm:text-sm font-sans font-bold tracking-wider uppercase text-slate-800 hover:text-[#c61830] transition-colors flex-shrink-0"
        >
          <span>SEE ALL</span>
          <span className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c61830] group-hover:bg-[#a51226] text-white flex items-center justify-center rounded transition-colors shadow-sm">
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

      {/* 3-Column Responsive Grid: Left, Middle, and Right perfectly aligned horizontally with zero unwanted gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_1.6fr_1.08fr] gap-4 sm:gap-5 xl:gap-6 items-stretch">
        
        {/* Left Column: 5 Stacked Tech Items with Equal Vertical Rhythm */}
        <div className="flex flex-col justify-between h-full divide-y divide-slate-100 order-2 lg:order-1">
          {leftItems.map((item) => (
            <article key={item.id} className="group flex-1 flex items-center py-1.5 sm:py-2 first:pt-0 last:pb-0">
              <Link
                href={getArticleUrl(item)}
                className="flex items-center gap-3 sm:gap-3.5 w-full no-underline text-inherit cursor-pointer"
                aria-label={item.title}
              >
                {/* Properly sized thumbnail to keep left height balanced */}
                <figure className="relative w-24 sm:w-26 md:w-28 xl:w-28 aspect-[16/10.5] rounded-xs overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xs"
                  />
                </figure>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c61830] mb-0.5 block">
                    {item.category}
                  </span>
                  <h4
                    className="text-[12.5px] sm:text-[13px] lg:text-[13.5px] font-serif font-bold text-slate-900 leading-snug tracking-tight line-clamp-2 mb-0.5 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.title}
                  </h4>
                  <div className="text-[10px] font-sans text-slate-500">
                    <span>{item.date}</span>
                    <span className="mx-1 text-slate-300">•</span>
                    <span>{item.readTime}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Center Column: Big AI Robot Lead Story - Clean contiguous layout with NO gap */}
        <div className="flex flex-col h-full order-1 lg:order-2">
          <article className="group flex flex-col h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              <div className="flex flex-col">
                {/* Large Featured Robot Image */}
                <figure className="relative w-full aspect-[16/9.5] overflow-hidden rounded-xs mb-2.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-xs"
                  />
                </figure>

                {/* Content Placed Separately Below the Image */}
                <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#c61830] no-underline hover:no-underline active:no-underline focus:no-underline mb-1 block">
                  {featured.category}
                </span>

                <h3
                  className="text-xl sm:text-2xl lg:text-[25px] xl:text-[27px] font-serif font-bold text-slate-900 leading-[1.22] tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all line-clamp-3"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {featured.title}
                </h3>

                <p
                  className="text-xs sm:text-[13.5px] text-slate-600 font-serif leading-relaxed mb-2.5 line-clamp-3"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {featured.excerpt || 'Exploring AI breakthroughs, emerging technologies, and the innovations shaping a smarter future.'}
                </p>
              </div>

              {/* Author byline pinned cleanly to bottom */}
              <div className="mt-auto flex items-center gap-2 text-xs font-sans text-slate-500 pt-2 border-t border-slate-100/70">
                {featured.author?.avatar && (
                  <img
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  />
                )}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500 font-medium">By</span>
                  <span className="text-[#c61830] font-bold group-hover:underline">
                    {featured.author?.name}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{featured.date}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{featured.readTime}</span>
                </div>
              </div>
            </Link>
          </article>
        </div>

        {/* Right Column: 2 Cards (AI Startups & Semiconductors) - Sized to match left and center height */}
        <div className="flex flex-col justify-between h-full gap-3 sm:gap-3.5 order-3">
          {rightCards.map((card) => (
            <article
              key={card.id}
              className="group flex-1 flex flex-col justify-between"
            >
              <Link
                href={getArticleUrl(card)}
                className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
                aria-label={card.title}
              >
                <div>
                  {/* Large Proportional Image on Top */}
                  <figure className="relative w-full aspect-[16/6.2] overflow-hidden rounded-xs mb-1.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-xs"
                    />
                  </figure>

                  {/* Content Placed Separately Below the Image */}
                  <span className="text-[10px] sm:text-[10.5px] font-sans font-bold uppercase tracking-wider text-[#c61830] mb-0.5 block">
                    {card.category}
                  </span>

                  <h4
                    className="text-[13.5px] sm:text-[14px] xl:text-[15px] font-serif font-bold text-slate-900 leading-snug tracking-tight mb-0.5 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 line-clamp-2"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {card.title}
                  </h4>

                  <div className="text-[10px] sm:text-[11px] font-sans text-slate-500 mb-1">
                    <span>{card.date}</span>
                    <span className="mx-1 text-slate-300">•</span>
                    <span>{card.readTime}</span>
                  </div>

                  <p
                    className="text-[11.5px] sm:text-xs text-slate-600 font-serif leading-relaxed line-clamp-3"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {card.excerpt || 'Read the latest updates and strategic analysis.'}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
