'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ENERGY_COMMODITIES_SECTION, getArticleUrl, Article } from '@/data/newsData';

const BASELINE_ENERGY_COMMODITIES_7: Article[] = [
  ENERGY_COMMODITIES_SECTION.lead,
  ENERGY_COMMODITIES_SECTION.middle[0],
  ENERGY_COMMODITIES_SECTION.middle[1],
  ENERGY_COMMODITIES_SECTION.right[0],
  ENERGY_COMMODITIES_SECTION.right[1],
  ENERGY_COMMODITIES_SECTION.right[2],
  ENERGY_COMMODITIES_SECTION.right[3],
];

const ENERGY_LEAD_LINES = {
  title: [
    'Global Oil Markets Face New Uncertainty',
    'Amid Geopolitical Tensions',
  ],
  excerpt: [
    'Rising geopolitical risks and shifting supply dynamics are adding new',
    'pressure on global oil markets, as investors reassess the outlook for 2026.',
  ],
};

const ENERGY_MIDDLE_LINES: Record<string, { title: string[]; excerpt: string[] }> = {
  'energy-clean-investment-high': {
    title: [
      'Clean Energy Investment',
      'Hits Record High',
      'in 2026',
    ],
    excerpt: [
      'Global investment in renewable',
      'energy reaches a new milestone,',
      'driven by solar, wind and green',
      'hydrogen projects.',
    ],
  },
  'energy-gold-metals-resilient': {
    title: [
      'Gold and Metals Remain',
      'Resilient Amid Market',
      'Volatility',
    ],
    excerpt: [
      'Precious and industrial metals',
      'continue to show strength as global',
      'uncertainty drives demand.',
    ],
  },
};

const ENERGY_RIGHT_LINES: Record<string, string[]> = {
  'energy-lng-supply-expand': [
    'Global LNG Supply Set to',
    'Expand in 2026',
  ],
  'energy-food-commodity-prices': [
    'Food Commodity Prices',
    'Show Signs of Stabilization',
  ],
  'energy-green-hydrogen-momentum': [
    'Green Hydrogen Gains',
    'Momentum Worldwide',
  ],
  'energy-commodity-trade-flows': [
    'Commodity Trade Flows',
    'Shift Amid New Policies',
  ],
};

export interface EnergySectionProps {
  initialLead?: Article;
  initialMiddle?: Article[];
  initialRight?: Article[];
}

export const EnergyCommoditiesSection: React.FC<EnergySectionProps> = ({
  initialLead,
  initialMiddle,
  initialRight,
}) => {
  const [lead, setLead] = useState<Article>(() => initialLead || BASELINE_ENERGY_COMMODITIES_7[0]);
  const [middle, setMiddle] = useState<Article[]>(() =>
    initialMiddle && initialMiddle.length > 0
      ? initialMiddle
      : [BASELINE_ENERGY_COMMODITIES_7[1], BASELINE_ENERGY_COMMODITIES_7[2]]
  );
  const [right, setRight] = useState<Article[]>(() =>
    initialRight && initialRight.length > 0
      ? initialRight
      : [
          BASELINE_ENERGY_COMMODITIES_7[3],
          BASELINE_ENERGY_COMMODITIES_7[4],
          BASELINE_ENERGY_COMMODITIES_7[5],
          BASELINE_ENERGY_COMMODITIES_7[6],
        ]
  );

  useEffect(() => {
    fetch('/api/articles?status=published&limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          // 1. Filter articles where Main category is Energy & Commodities
          // AND placement is none (no homepage placement)
          const dbArticles: Article[] = data.data
            .filter((a: any) => {
              const cat = (a.category || a.category_name || '').toLowerCase().trim();
              const isEnergyCat =
                cat === 'energy & commodities' ||
                cat === 'energy and commodities' ||
                cat === 'energy-commodities' ||
                cat === 'energy_commodities' ||
                cat === 'energy commodities';
              if (!isEnergyCat) return false;

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
              category: a.category || 'ENERGY & COMMODITIES',
              excerpt: a.excerpt || a.cardSummary || '',
              author: {
                name: (typeof a.author === 'object' ? a.author?.name : a.author) || a.authorName || 'Energy Desk',
                avatar: (typeof a.author === 'object' ? a.author?.avatar : null) || a.authorAvatar || '',
                title: (typeof a.author === 'object' ? a.author?.title : null) || a.authorTitle || 'Correspondent',
              },
              date: a.date || 'Oct 21, 2026',
              readTime: a.readTime || '5 min read',
              imageUrl: a.imageUrl || '/images/energy/oil_rig_lead.png',
            }));

          // 2. Prepend DB articles (newest published first), then fill remaining slots with baseline articles
          const combined: Article[] = [...dbArticles];
          BASELINE_ENERGY_COMMODITIES_7.forEach((baseItem) => {
            const alreadyIn = combined.some(
              (c) => (c.slug && baseItem.slug && c.slug === baseItem.slug) || (c.id && baseItem.id && c.id === baseItem.id)
            );
            if (!alreadyIn) {
              combined.push(baseItem);
            }
          });

          // 3. Exactly 7 slots:
          // 1st is lead (left column), 2nd-3rd are middle (middle column), 4th-7th are right (right column)
          // When a new article comes in, slot 7 drops off from the homepage section and is only visible inside category pages
          const active7 = combined.slice(0, 7);
          if (active7.length >= 1) {
            setLead(active7[0]);
            if (active7.length >= 3) {
              setMiddle(active7.slice(1, 3));
            }
            if (active7.length >= 7) {
              setRight(active7.slice(3, 7));
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  const leadUrl = getArticleUrl(lead);

  return (
    <section className="bg-white pt-5 sm:pt-6 pb-5 sm:pb-6 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5 sm:mb-4.5">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          <Link href="/topic/energy-commodities" className="hover:text-[#1642D0] transition-colors no-underline hover:no-underline active:no-underline focus:no-underline">
            Energy &amp; Commodities
          </Link>
        </h2>
        <Link
          href="/topic/energy-commodities"
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

      {/* 3-Column Composite Grid matching Reference Image 3: Left Lead (38%), Middle 2 Cards (35%), Right 4 Stories (27%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.38fr_1.34fr_1.08fr] gap-4 sm:gap-5 xl:gap-6 items-stretch w-full">
        
        {/* Left Column: Big Lead Story with Oil Pumpjack & Refinery Image */}
        <div className="flex flex-col justify-between h-full">
          <article className="group flex flex-col justify-between h-full">
            <Link href={leadUrl} className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer">
              <div className="flex flex-col">
                <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-xs mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={lead.imageUrl}
                    alt={lead.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 rounded-xs"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = '/images/home-hero/grid-card-1.png';
                      }
                    }}
                  />
                </figure>

                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
                  {lead.category}
                </span>

                <h3 className="text-[17px] sm:text-[18px] lg:text-[18.5px] xl:text-[19.5px] 2xl:text-[20.5px] font-serif font-bold text-slate-900 leading-[1.24] tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                  {lead.id === 'energy-oil-markets-geopolitical' ? (
                    ENERGY_LEAD_LINES.title.map((line, idx) => (
                      <span key={idx} className="block whitespace-nowrap">{line}</span>
                    ))
                  ) : (
                    lead.title
                  )}
                </h3>

                <div className="text-[11.5px] sm:text-[12px] lg:text-[12.5px] text-slate-600 font-serif leading-[1.42] mb-3">
                  {lead.id === 'energy-oil-markets-geopolitical' ? (
                    ENERGY_LEAD_LINES.excerpt.map((line, idx) => (
                      <span key={idx} className="block">{line}</span>
                    ))
                  ) : (
                    <p className="line-clamp-3">{lead.excerpt}</p>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-2 text-xs font-sans text-slate-500 flex items-center gap-2">
                <span>{lead.date}</span>
                <span className="text-slate-300">•</span>
                <span>{lead.readTime}</span>
              </div>
            </Link>
          </article>
        </div>

        {/* Middle Column: Two Stacked Stories with Large Images matching Reference Image 3 */}
        <div className="flex flex-col justify-between h-full gap-5 sm:gap-6">
          {middle.map((item) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article key={item.id} className="group flex-1 flex flex-col justify-between">
                <Link href={itemUrl} className="flex flex-row gap-3.5 sm:gap-4 items-stretch h-full no-underline text-inherit cursor-pointer">
                  {/* Large Proportional Image */}
                  <figure className="relative w-[48%] sm:w-[50%] aspect-[16/10.5] rounded-xs overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
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

                  {/* Story Details on Right */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] no-underline hover:no-underline active:no-underline focus:no-underline mb-1 block">
                        {item.category}
                      </span>

                      <h3 className="text-[13.5px] sm:text-[14.5px] xl:text-[15.5px] font-serif font-bold text-slate-900 leading-[1.26] tracking-tight mb-1.5 group-hover:underline underline-offset-2 transition-all">
                        {ENERGY_MIDDLE_LINES[item.id] ? (
                          ENERGY_MIDDLE_LINES[item.id].title.map((line, idx) => (
                            <span key={idx} className="block">{line}</span>
                          ))
                        ) : (
                          item.title
                        )}
                      </h3>

                      {ENERGY_MIDDLE_LINES[item.id] ? (
                        <p className="text-[11px] sm:text-[11.5px] text-slate-600 font-serif leading-[1.4] mb-1.5">
                          {ENERGY_MIDDLE_LINES[item.id].excerpt.map((line, idx) => (
                            <span key={idx} className="block">{line}</span>
                          ))}
                        </p>
                      ) : (
                        item.excerpt && (
                          <p className="text-[11px] sm:text-[11.5px] text-slate-600 font-serif leading-[1.4] mb-1.5 line-clamp-2">
                            {item.excerpt}
                          </p>
                        )
                      )}
                    </div>

                    <div className="mt-auto text-[10.5px] sm:text-[11px] font-sans text-slate-500 pt-1">
                      <span>{item.date}</span>
                      <span className="mx-1 text-slate-300">•</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Right Column: 4 Compact News Items with Full-Width Alignment matching Reference Image 3 */}
        <div className="flex flex-col justify-between h-full gap-3 sm:gap-3.5 xl:gap-4">
          {right.map((item) => {
            const itemUrl = getArticleUrl(item);
            return (
              <article key={item.id} className="group flex-1 flex items-stretch">
                <Link href={itemUrl} className="flex items-center gap-3 sm:gap-3.5 w-full no-underline text-inherit cursor-pointer">
                  {/* Scaled Thumbnail matching Reference Image 3 */}
                  <figure className="relative w-[34%] sm:w-[36%] max-w-[125px] aspect-[16/10] flex-shrink-0 overflow-hidden rounded-xs bg-slate-100 border border-slate-200/90">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xs"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = 'true';
                          target.src = '/images/home-hero/grid-card-1.png';
                        }
                      }}
                    />
                  </figure>

                  {/* Thumbnail Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[10px] sm:text-[10.5px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-0.5 block">
                        {item.category}
                      </span>
                      <h4 className="text-[12px] sm:text-[12.5px] xl:text-[13px] font-serif font-bold text-slate-900 leading-[1.24] group-hover:underline underline-offset-2 transition-all">
                        {ENERGY_RIGHT_LINES[item.id] ? (
                          ENERGY_RIGHT_LINES[item.id].map((line, idx) => (
                            <span key={idx} className="block whitespace-nowrap">{line}</span>
                          ))
                        ) : (
                          item.title
                        )}
                      </h4>
                    </div>
                    <div className="text-[10px] sm:text-[10.5px] font-sans text-slate-500 mt-auto pt-0.5">
                      <span>{item.date}</span>
                      <span className="mx-1 text-slate-300">•</span>
                      <span>{item.readTime}</span>
                    </div>
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
