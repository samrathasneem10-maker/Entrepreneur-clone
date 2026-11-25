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
    <section className="bg-white pb-10 md:pb-12 w-full">
      <div className="w-full">
        {/* Top line with SMALL DECREASED GAP above section heading matching Image 2 */}
        <div className="border-t border-slate-200 pt-2.5 sm:pt-3 pb-2 mb-5">
          <div className="flex items-center justify-between">
            <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none tracking-tight flex items-center">
              <span className="inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#c61830] rounded-2xs mr-2 -translate-y-0.5 shrink-0" aria-hidden="true" />
              <Link
                href="/topic/startups-entrepreneurship"
                className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[4px] transition-all"
              >
                Startups &amp; Entrepreneurship
              </Link>
            </h2>

            <Link
              href="/topic/startups-entrepreneurship"
              aria-label="Read more about Startups & Entrepreneurship"
              className="flex items-center no-underline hover:underline text-xs sm:text-[13px] font-bold text-[#020618] uppercase tracking-wider group"
            >
              <span>See All</span>
              <svg
                aria-hidden="true"
                fill="currentColor"
                className="w-5 h-5 fill-current ml-1 text-[#c61830] group-hover:scale-105 transition-transform"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10m-10 1H8v-2h4V8l4 4-4 4z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 2-Column Layout matching Image 2: Left and Right sides stretch to the exact same baseline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Lead Story ending on the same baseline */}
          <div className="group flex flex-col justify-between h-full">
            <div>
              {/* Lead Image: matching aspect-[16/10] rounded-xl from Image 2 */}
              <Link href={getArticleUrl(featured)} className="block">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-slate-200/90 shadow-2xs">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = '/images/home-hero/hero-growth-decision.png';
                      }
                    }}
                  />
                </div>
              </Link>

              {/* Lead Story Details: identical typography & spacing */}
              <div className="pt-3.5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c61830] font-sans block">
                  {featured.category}
                </span>

                <h3 className="text-lg sm:text-[21px] lg:text-[22px] font-serif font-bold text-[#020618] leading-[1.3] tracking-tight">
                  <Link
                    href={getArticleUrl(featured)}
                    className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all"
                  >
                    {featured.title}
                  </Link>
                </h3>

                {/* Normal font weight excerpt */}
                <p className="text-sm sm:text-[15px] font-serif font-normal text-slate-700 leading-relaxed pt-0.5">
                  {featured.excerpt || 'The strongest workplace cultures are built by leaders who normalize honest conversations before misunderstandings turn into resentment.'}
                </p>
              </div>
            </div>

            {/* Byline ending at the exact same horizontal line as the right column */}
            <div className="text-xs font-sans uppercase tracking-wider pt-4 pb-1 flex items-center gap-1">
              <span className="text-slate-500 font-semibold">BY</span>
              <span className="text-[#c61830] font-bold underline decoration-[#c61830] underline-offset-2 hover:text-red-800 transition-colors">
                {featured.author?.name || (typeof featured.author === 'string' ? featured.author : 'Ruthann Peace Brown')}
              </span>
            </div>
          </div>

          {/* Right Column: 3 Stacked Stories with matching 150x150 rounded-xl thumbnails from Image 2 */}
          <div className="flex flex-col justify-between h-full space-y-4 sm:space-y-5">
            {items.slice(0, 3).map((item) => {
              const itemUrl = getArticleUrl(item);

              return (
                <div
                  key={item.id}
                  className="group flex items-start justify-between gap-4 sm:gap-6 pb-4 sm:pb-5 border-b border-slate-200"
                >
                  {/* Left Text Block */}
                  <div className="flex-1 space-y-1.5 pr-1 sm:pr-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#c61830] font-sans block">
                      {item.category}
                    </span>

                    <h3 className="text-lg sm:text-[19px] lg:text-[20px] font-serif font-bold text-[#020618] leading-[1.3] sm:leading-[1.35] tracking-tight">
                      <Link
                        href={itemUrl}
                        className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    {/* Byline */}
                    <div className="text-xs font-sans uppercase tracking-wider pt-1 flex items-center gap-1">
                      <span className="text-slate-500 font-semibold">BY</span>
                      <span className="text-[#c61830] font-bold underline decoration-[#c61830] underline-offset-2 hover:text-red-800 transition-colors">
                        {item.author?.name || (typeof item.author === 'string' ? item.author : 'Staff Contributor')}
                      </span>
                    </div>
                  </div>

                  {/* Right Square Thumbnail: 125x125 to 150x150 rounded-xl matching Image 2 */}
                  {item.imageUrl && (
                    <Link
                      href={itemUrl}
                      className="w-[125px] h-[125px] sm:w-[140px] sm:h-[140px] lg:w-[150px] lg:h-[150px] flex-shrink-0 overflow-hidden rounded-xl border border-slate-200/90 shadow-2xs block"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = 'true';
                            target.src = '/images/home-hero/grid-card-1.png';
                          }
                        }}
                      />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
