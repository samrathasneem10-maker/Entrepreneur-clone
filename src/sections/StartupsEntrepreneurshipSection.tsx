'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { STARTUPS_ENTREPRENEURSHIP_SECTION, getArticleUrl, Article } from '@/data/newsData';

const BASELINE_STARTUPS_4: Article[] = [
  STARTUPS_ENTREPRENEURSHIP_SECTION.featured,
  STARTUPS_ENTREPRENEURSHIP_SECTION.items[0],
  STARTUPS_ENTREPRENEURSHIP_SECTION.items[1],
  STARTUPS_ENTREPRENEURSHIP_SECTION.items[2],
];

const STARTUPS_TITLE_LINES: Record<string, string[]> = {
  'startups-say-it-sooner': [
    "The 'Say It Sooner' Rule That",
    'Prevents Small Team Problems',
    'From Becoming Big Ones',
  ],
  'the-say-it-sooner-rule-that-prevents-small-team-problems-from-becoming-big-ones': [
    "The 'Say It Sooner' Rule That",
    'Prevents Small Team Problems',
    'From Becoming Big Ones',
  ],
  'startups-introvert-connections': [
    "An Introvert's Case for Skipping",
    'Small Talk and Building Real',
    'Connections',
  ],
  'an-introverts-case-for-skipping-small-talk-and-building-real-connections': [
    "An Introvert's Case for Skipping",
    'Small Talk and Building Real',
    'Connections',
  ],
  'startups-boss-bully': [
    'Not Every Boss Deserves a Thank-You',
    "Card. Here's What to Do When Your",
    'Boss Is a Bully.',
  ],
  'not-every-boss-deserves-a-thank-you-card-heres-what-to-do-when-your-boss-is-a-bully': [
    'Not Every Boss Deserves a Thank-You',
    "Card. Here's What to Do When Your",
    'Boss Is a Bully.',
  ],
  'startups-franchise-creative': [
    'This Former Engineer and Preschool',
    'Teacher Teamed Up to Start a Creative',
    "Business: 'Haven't Regretted Choosing",
    "a Franchise.'",
  ],
  'this-former-engineer-and-preschool-teacher-teamed-up-to-start-a-creative-business': [
    'This Former Engineer and Preschool',
    'Teacher Teamed Up to Start a Creative',
    "Business: 'Haven't Regretted Choosing",
    "a Franchise.'",
  ],
};

export interface StartupsSectionProps {
  initialFeatured?: Article;
  initialItems?: Article[];
}

export const StartupsEntrepreneurshipSection: React.FC<StartupsSectionProps> = ({
  initialFeatured,
  initialItems,
}) => {
  const [featured, setFeatured] = useState<Article>(() => initialFeatured || BASELINE_STARTUPS_4[0]);
  const [items, setItems] = useState<Article[]>(() =>
    initialItems && initialItems.length > 0 ? initialItems : BASELINE_STARTUPS_4.slice(1, 4)
  );

  useEffect(() => {
    fetch('/api/articles?status=published&limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          // 1. Filter articles where Main category is Startups & Entrepreneurship
          // AND placement is none (no homepage placement)
          const dbArticles: Article[] = data.data
            .filter((a: any) => {
              const cat = (a.category || a.category_name || '').toLowerCase().trim();
              const isStartupCat =
                cat === 'startups & entrepreneurship' ||
                cat === 'startups and entrepreneurship' ||
                cat === 'startups-entrepreneurship';
              if (!isStartupCat) return false;

              // Rule: If article is assigned to an active homepage placement (e.g. latest_news, hero_section, hero_section_2, trending_news),
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
              category: a.category || 'STARTUPS & ENTREPRENEURSHIP',
              author: a.author || {
                name: a.authorName || 'Staff Contributor',
                title: a.authorTitle || 'Executive Contributor',
              },
              date: a.date || 'Oct 22, 2026',
              readTime: a.readTime || '6 min read',
              excerpt: a.excerpt || a.cardSummary || '',
              imageUrl: a.imageUrl || '/images/startups/say-it-sooner.png',
            }));

          // 2. Prepend DB articles (newest published first), then fill remaining slots with baseline articles
          const combined: Article[] = [...dbArticles];
          BASELINE_STARTUPS_4.forEach((baseItem) => {
            const alreadyIn = combined.some(
              (c) => c.slug === baseItem.slug || c.title.toLowerCase().trim() === baseItem.title.toLowerCase().trim()
            );
            if (!alreadyIn) {
              combined.push(baseItem);
            }
          });

          // 3. Exactly 4 slots: 1st is featured on left, 2nd-4th are stacked on right
          // Any article beyond the 4th slot is hidden from the homepage section
          const active4 = combined.slice(0, 4);
          if (active4.length >= 1) {
            setFeatured(active4[0]);
            setItems(active4.slice(1, 4));
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white pt-2 sm:pt-3 pb-5 sm:pb-6 w-full">
      {/* Section Header with consistent border-b matching reference */}
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          <Link href="/topic/startups-entrepreneurship" className="hover:text-[#1642D0] transition-colors no-underline hover:no-underline active:no-underline focus:no-underline">
            Startups &amp; Entrepreneurship
          </Link>
        </h2>
        <Link
          href="/topic/startups-entrepreneurship"
          className="inline-flex items-center gap-2 group text-xs sm:text-sm font-sans font-bold tracking-wider uppercase text-slate-800 hover:text-[#1642D0] transition-colors"
        >
          <span>See All</span>
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

      {/* 2-Column Balanced Grid: Left Featured (6 cols) + Right Stacked (6 cols) perfectly aligned at top and bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_1fr] gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Big Lead Story (col-span-6) */}
        <div className="flex flex-col justify-between h-full">
          <article className="group flex flex-col justify-between h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              <div className="flex flex-col">
                {/* Featured Image */}
                <figure className="relative w-full aspect-[16/9.5] overflow-hidden rounded-none mb-3 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-none"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = '/images/home-hero/hero-growth-decision.png';
                      }
                    }}
                  />
                </figure>

                {/* Category Badge */}
                <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 text-left block no-underline hover:no-underline active:no-underline focus:no-underline">
                  {featured.category}
                </span>

                {/* Lead Story Title - Line clamp 2 */}
                <h3
                  className="text-2xl sm:text-3xl lg:text-[28px] xl:text-[30px] font-serif font-bold text-slate-900 leading-[1.22] tracking-tight mb-2 text-left group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all line-clamp-2"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {featured.title}
                </h3>

                {/* Lead Story Excerpt - Line clamp 2 */}
                <p
                  className="text-sm sm:text-[14.5px] text-slate-600 font-serif font-normal leading-relaxed mb-3 text-left line-clamp-2"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {featured.excerpt || 'The strongest workplace cultures are built by leaders who normalize honest conversations before misunderstandings turn into resentment.'}
                </p>
              </div>

              {/* Author Byline matching Image 2 */}
              <div className="mt-auto pt-1 flex items-center text-xs font-sans">
                <span className="text-slate-500 font-medium mr-1.5">BY</span>
                <span className="text-[#1642D0] font-bold uppercase group-hover:underline">
                  {featured.author?.name || (typeof featured.author === 'string' ? featured.author : 'Ruthann Peace Brown')}
                </span>
              </div>
            </Link>
          </article>
        </div>

        {/* Right Column: Stacked 3 Articles matching Image 1 with equal vertical spacing & no line clamping */}
        <div className="flex flex-col justify-between h-full divide-y divide-slate-200">
          {items.slice(0, 3).map((item) => {
            const itemUrl = getArticleUrl(item);
            const titleLines = STARTUPS_TITLE_LINES[item.id] || (item.slug ? STARTUPS_TITLE_LINES[item.slug] : null);

            return (
              <article
                key={item.id}
                className="group flex-1 flex flex-col justify-center py-3 sm:py-3.5 first:pt-0 last:pb-0"
              >
                <Link
                  href={itemUrl}
                  className="flex items-center justify-between gap-4 sm:gap-5 w-full no-underline text-inherit cursor-pointer"
                  aria-label={item.title}
                >
                  {/* Left Text Block: Category, Title, Author matching Image 1 lines of sentences */}
                  <div className="flex-1 min-w-0 pr-3 sm:pr-4 lg:pr-5 flex flex-col justify-between self-stretch py-0.5">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1 block no-underline hover:no-underline active:no-underline focus:no-underline">
                        {item.category}
                      </span>

                      <h4
                        className="text-[13.5px] sm:text-[14.5px] lg:text-[15px] xl:text-[16px] 2xl:text-[17.5px] font-serif font-bold text-slate-900 leading-[1.28] tracking-tight mb-1.5 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all line-clamp-3"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.title}
                      </h4>
                    </div>

                    {/* Author Byline matching Image 1 */}
                    <div className="mt-auto pt-1 flex items-center text-[11px] sm:text-xs font-sans">
                      <span className="text-slate-500 font-medium mr-1.5">BY</span>
                      <span className="text-[#1642D0] font-bold uppercase group-hover:underline">
                        {item.author?.name || (typeof item.author === 'string' ? item.author : 'Staff Contributor')}
                      </span>
                    </div>
                  </div>

                  {/* Right Thumbnail matching Image 1 dimensions and shape */}
                  {item.imageUrl && (
                    <figure className="relative w-36 sm:w-44 md:w-52 lg:w-[210px] xl:w-[250px] 2xl:w-[295px] aspect-[16/9.6] flex-shrink-0 overflow-hidden rounded-none border border-slate-200/90 bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-none"
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
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
