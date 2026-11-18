'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TRENDING_RESILIENCE_SECTION, getArticleUrl, Article } from '@/data/newsData';

export const TrendingResilienceSection: React.FC = () => {
  const { featured: defaultFeatured, items } = TRENDING_RESILIENCE_SECTION;
  const [featured, setFeatured] = useState<Article>(defaultFeatured);

  useEffect(() => {
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

                {/* Blue Category Badge */}
                <span className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-1.5 block">
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
                <span className="text-[#1642D0] font-bold uppercase group-hover:underline mr-2">
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
            <h3 className="text-2xl sm:text-[26px] font-serif font-bold text-slate-900 tracking-tight my-0">
              Trending News
            </h3>
          </div>

          {/* List of 5 Articles with balanced thumbnails and numbers matching Image 4 */}
          <div className="flex-1 flex flex-col justify-between divide-y divide-slate-100">
            {items.map((item) => (
              <article key={item.id} className="group flex-1 flex items-center py-2 sm:py-2.5 first:pt-1 last:pb-0">
                <Link
                  href={getArticleUrl(item)}
                  className="flex items-center gap-2.5 sm:gap-3.5 w-full no-underline text-inherit cursor-pointer"
                  aria-label={item.title}
                >
                  {/* Rank Number on Left (01, 02, ...) */}
                  <span className="text-xl sm:text-2xl lg:text-3xl font-serif text-slate-300 font-light select-none w-7 sm:w-8 flex-shrink-0">
                    {`0${item.rank}`}
                  </span>

                  {/* Balanced Thumbnail matching Image 4 */}
                  <figure className="relative w-28 sm:w-32 lg:w-32 xl:w-36 aspect-[16/9] rounded-xs overflow-hidden flex-shrink-0 border border-slate-200/90 bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xs"
                    />
                  </figure>

                  {/* Title & Details */}
                  <div className="flex-1 min-w-0 pr-1">
                    <span className="text-[10px] sm:text-[10.5px] font-sans font-bold uppercase tracking-wider text-[#1642D0] no-underline hover:no-underline active:no-underline focus:no-underline mb-0.5 block">
                      {item.category}
                    </span>
                    <h4 className="text-[13px] sm:text-[13.5px] lg:text-[14px] xl:text-[14.5px] font-serif font-bold text-slate-900 leading-snug tracking-tight line-clamp-2 mb-1 group-hover:underline decoration-slate-900 decoration-1 underline-offset-2">
                      {item.title}
                    </h4>
                    <div className="text-[10px] sm:text-[10.5px] font-sans text-slate-500">
                      <span>{item.date}</span>
                      <span className="mx-1 text-slate-300">•</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
