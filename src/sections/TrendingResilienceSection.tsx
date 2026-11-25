'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TRENDING_RESILIENCE_SECTION, getArticleUrl, Article } from '@/data/newsData';

const getTrendingTitleLines = (item: Article) => {
  if (item.slug === 'elon-musk-hints-at-next-gen-ai-model-to-power-teslas-future' || item.title?.includes('Elon Musk')) {
    return { line1: 'Elon Musk Hints at Next-Gen AI', line2: "Model to Power Tesla's Future" };
  }
  if (item.slug === 'global-markets-rally-as-rate-cut-hopes-strengthen' || item.title?.includes('Rate Cut')) {
    return { line1: 'Global Markets Rally as Rate', line2: 'Cut Hopes Strengthen' };
  }
  if (item.slug === 'new-trade-agreement-set-to-boost-asia-europe-commerce' || item.title?.includes('Asia—Europe') || item.title?.includes('Asia-Europe')) {
    return { line1: 'New Trade Agreement Set to', line2: 'Boost Asia—Europe Commerce' };
  }
  if (item.slug === 'uae-announces-major-investment-plan-for-2030' || item.title?.includes('UAE Announces')) {
    return { line1: 'UAE Announces Major', line2: 'Investment Plan for 2030' };
  }
  if (item.slug === 'global-ev-sales-hit-record-high-in-2026' || item.title?.includes('Global EV Sales')) {
    return { line1: 'Global EV Sales Hit Record', line2: 'High in 2026' };
  }

  const words = (item.title || '').split(' ');
  if (words.length >= 4) {
    const mid = Math.ceil(words.length / 2);
    return {
      line1: words.slice(0, mid).join(' '),
      line2: words.slice(mid).join(' '),
    };
  }
  return null;
};

export interface TrendingSectionProps {
  initialFeatured?: Article;
  initialItems?: Article[];
}

export const TrendingResilienceSection: React.FC<TrendingSectionProps> = ({
  initialFeatured,
  initialItems,
}) => {
  const { featured: defaultFeatured, items } = TRENDING_RESILIENCE_SECTION;
  const [featured, setFeatured] = useState<Article>(() => initialFeatured || defaultFeatured);
  const [trendingItems, setTrendingItems] = useState<Article[]>(() =>
    initialItems && initialItems.length > 0 ? initialItems : items
  );

  useEffect(() => {
    // 1. Fetch Featured Lead (Placement: hero_section_2)
    fetch('/api/articles?status=published&placement=hero_section_2&limit=1')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          const a = data.data[0];
          setFeatured({
            id: a.slug || String(a.dbId || a.id),
            slug: a.slug,
            title: a.title,
            category: a.category || defaultFeatured.category,
            author: a.author || {
              name: a.authorName || 'James Carter',
              avatar: a.authorAvatar || '/images/author-sherin.png',
              title: a.authorTitle || 'Senior Columnist',
            },
            date: a.date || 'Just now',
            readTime: a.readTime || '5 min read',
            excerpt: a.excerpt || a.cardSummary || defaultFeatured.excerpt,
            imageUrl: a.imageUrl || defaultFeatured.imageUrl,
          });
        }
      })
      .catch(() => {});

    // 2. Fetch Trending News articles (Placement: trending_news, capacity: 5)
    fetch('/api/articles?status=published&placement=trending_news&limit=10')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const dbTrending: Article[] = data.data.map((a: any, idx: number) => ({
            rank: idx + 1,
            id: a.slug || String(a.dbId || a.id),
            slug: a.slug,
            title: a.title,
            category: a.category || 'GLOBAL BUSINESS',
            author: a.author || { name: a.authorName || 'Editorial Desk' },
            date: a.date || 'Just now',
            readTime: a.readTime || '4 min read',
            imageUrl: a.imageUrl || items[idx % items.length]?.imageUrl || '/images/trending-news/thumb-elon-musk.png',
          }));

          const combinedTrending = [...dbTrending];
          items.forEach((baseItem) => {
            if (!combinedTrending.some((c) => c.slug === baseItem.slug || c.title.toLowerCase().trim() === baseItem.title.toLowerCase().trim())) {
              combinedTrending.push(baseItem);
            }
          });

          const finalItems = combinedTrending.slice(0, 5).map((item, idx) => ({
            ...item,
            rank: idx + 1,
          }));
          setTrendingItems(finalItems);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white pt-5 sm:pt-6 pb-5 sm:pb-6 w-full">
      {/* 2-Column Grid matching Image 1: Left Lead Story (approx 52%) + Right Trending News (approx 48%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.14fr_1fr] gap-6 lg:gap-8 xl:gap-10 items-stretch">
        
        {/* Left Column: Big Lead Story with Glass Globe & Skyline Image */}
        <div className="flex flex-col justify-between h-full lg:pr-8 xl:pr-10 lg:border-r lg:border-slate-200">
          <article className="group flex flex-col justify-between h-full">
            <Link
              href={getArticleUrl(featured)}
              className="flex flex-col justify-between h-full no-underline text-inherit cursor-pointer"
              aria-label={featured.title}
            >
              <div className="flex flex-col">
                {/* Large Featured Image */}
                <figure className="relative w-full aspect-[16/9.2] overflow-hidden rounded-xs mb-3.5 border border-slate-200/90 bg-slate-100 flex-shrink-0">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-xs"
                  />
                </figure>

                {/* Red Category Badge */}
                <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#c61830] mb-1.5 block">
                  {featured.category}
                </span>

                {/* Lead Headline */}
                <h3 className="text-2xl sm:text-3xl lg:text-[28px] xl:text-[30px] font-serif font-bold text-slate-900 leading-[1.22] tracking-tight mb-2 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2 transition-all">
                  {featured.title}
                </h3>

                {/* Excerpt */}
                {featured.excerpt && (
                  <p className="text-xs sm:text-[14px] text-slate-600 font-serif leading-relaxed mb-3 line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
              </div>

              {/* Author Byline matching Image 1 */}
              <div className="mt-auto pt-1 flex items-center text-xs font-sans text-slate-500">
                <span className="text-slate-500 font-medium mr-1.5">BY</span>
                <span className="text-[#c61830] font-bold uppercase group-hover:underline mr-2">
                  {featured.author?.name}
                </span>
                <span className="text-slate-300 mr-2">•</span>
                <span className="text-slate-500">{featured.date}</span>
                <span className="text-slate-300 mx-2">•</span>
                <span className="text-slate-500">{featured.readTime}</span>
              </div>
            </Link>
          </article>
        </div>

        {/* Right Column: Trending News with heading and numbered list (01 to 05) */}
        <div className="flex flex-col justify-between h-full">
          {/* Trending News Heading aligned with top of left image */}
          <div className="pb-2 mb-1 flex-shrink-0">
            <h3 className="text-2xl sm:text-[26px] font-serif font-bold text-slate-900 tracking-tight my-0 flex items-center">
              <span className="inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#c61830] rounded-2xs mr-2 -translate-y-0.5 shrink-0" aria-hidden="true" />
              Trending News
            </h3>
          </div>

          {/* List of 5 Articles with balanced thumbnails and numbers matching Image 3 */}
          <div className="flex-1 flex flex-col justify-between divide-y divide-slate-100">
            {trendingItems.map((item) => {
              const titleLines = getTrendingTitleLines(item);
              return (
                <article key={item.id || item.slug} className="group flex-1 flex items-center py-2 sm:py-2.5 first:pt-1 last:pb-0">
                  <Link
                    href={getArticleUrl(item)}
                    className="flex items-center gap-2.5 sm:gap-3.5 w-full no-underline text-inherit cursor-pointer"
                    aria-label={item.title}
                  >
                    {/* Rank Number on Left (01, 02, ...) */}
                    <span className="text-xl sm:text-2xl lg:text-3xl font-serif text-slate-300 font-light select-none w-7 sm:w-8 flex-shrink-0">
                      {`0${item.rank}`}
                    </span>

                    {/* Balanced Thumbnail matching Image 3 */}
                    <figure className="relative w-32 sm:w-36 md:w-40 lg:w-40 xl:w-44 aspect-[16/9] rounded-xs overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xs"
                      />
                    </figure>

                    {/* Title & Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <span className="text-[10px] sm:text-[10.5px] font-sans font-bold uppercase tracking-wider text-[#c61830] no-underline hover:no-underline active:no-underline focus:no-underline mb-0.5 block">
                        {item.category}
                      </span>
                      <h4 className="text-[13px] sm:text-[14px] lg:text-[14.5px] xl:text-[15.5px] font-serif font-bold text-slate-900 leading-[1.26] tracking-tight mb-1 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2">
                        {titleLines ? (
                          <>
                            <span className="block">{titleLines.line1}</span>
                            <span className="block">{titleLines.line2}</span>
                          </>
                        ) : (
                          item.title
                        )}
                      </h4>
                      <div className="text-[10px] sm:text-[10.5px] font-sans text-slate-500">
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

      </div>
    </section>
  );
};
