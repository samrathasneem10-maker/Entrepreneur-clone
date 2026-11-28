'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  HERO_GROWTH_DECISION_ARTICLE,
  UBER_DRIVER_BONUSES_ARTICLE,
  HOMEPAGE_LATEST_STREAM,
  HOMEPAGE_RIGHT_STREAM,
  BASELINE_LATEST_NEWS_9,
  Article,
} from '@/data/newsData';

const HERO_SLIDES: Article[] = [
  HERO_GROWTH_DECISION_ARTICLE,
  {
    id: 'solopreneur-playbook-from-zero-to-eight-figures',
    slug: 'solopreneur-playbook-from-zero-to-eight-figures',
    title: 'The Solopreneur Playbook: Scaling to Eight Figures Without Burning Out',
    category: 'Startups & Entrepreneurship',
    author: {
      name: 'Scott Smrkovski',
      avatar: '/images/home-hero/author-scott.png',
      title: 'Executive Contributor',
    },
    date: 'Oct 20, 2026',
    readTime: '6 min read',
    excerpt: 'Disciplined capital efficiency, direct customer relationships, and lean systems outlast venture-fueled hyper-growth hype.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'how-decisive-executive-frameworks-enable-rapid-growth',
    slug: 'how-decisive-executive-frameworks-enable-rapid-growth',
    title: 'How Decisive Executive Frameworks Enable Rapid Strategic Transformation',
    category: 'Leadership & Management',
    author: {
      name: 'Scott Smrkovski',
      avatar: '/images/home-hero/author-scott.png',
      title: 'Executive Contributor',
    },
    date: 'Oct 19, 2026',
    readTime: '7 min read',
    excerpt: 'Why top CEOs distinguish reversible two-way doors from company-defining commitments during high-stakes pivots.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'autonomous-ai-agents-transforming-enterprise',
    slug: 'autonomous-ai-agents-transforming-enterprise',
    title: 'Autonomous AI Agents Are Transforming Daily Enterprise Workflows',
    category: 'Technology & Super Intelligence',
    author: {
      name: 'Scott Smrkovski',
      avatar: '/images/home-hero/author-scott.png',
      title: 'Executive Contributor',
    },
    date: 'Oct 18, 2026',
    readTime: '5 min read',
    excerpt: 'How leading technology enterprises multiply team velocity and eliminate operational bottlenecks with custom AI models.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
  },
];

const BASELINE_HERO_8: Article[] = [
  HERO_GROWTH_DECISION_ARTICLE,
  HERO_SLIDES[1],
  HERO_SLIDES[2],
  HERO_SLIDES[3],
  UBER_DRIVER_BONUSES_ARTICLE,
  HOMEPAGE_RIGHT_STREAM[0],
  HOMEPAGE_RIGHT_STREAM[1],
  HOMEPAGE_RIGHT_STREAM[2],
];

export interface HeroNewsSectionProps {
  initialLatest?: Article[];
  initialSlides?: Article[];
  initialRightCard?: Article;
  initialRightStream?: Article[];
}

export const HeroNewsSection: React.FC<HeroNewsSectionProps> = ({
  initialLatest,
  initialSlides,
  initialRightCard,
  initialRightStream,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [latestArticles, setLatestArticles] = useState<Article[]>(() =>
    initialLatest && initialLatest.length > 0 ? initialLatest : BASELINE_LATEST_NEWS_9.slice(0, 5)
  );
  const [heroSlides, setHeroSlides] = useState<Article[]>(() =>
    initialSlides && initialSlides.length > 0 ? initialSlides : HERO_SLIDES
  );
  const [rightCard, setRightCard] = useState<Article>(() =>
    initialRightCard || UBER_DRIVER_BONUSES_ARTICLE
  );
  const [rightStream, setRightStream] = useState<Article[]>(() =>
    initialRightStream && initialRightStream.length > 0 ? initialRightStream : HOMEPAGE_RIGHT_STREAM
  );

  useEffect(() => {
    // 1. Fetch Latest News (Slots 1 to 5 for left column)
    fetch('/api/articles?status=published&placement=latest_news&limit=15')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          const dbArticles: Article[] = data.data.map((a: any) => ({
            id: a.slug || String(a.dbId || a.id),
            slug: a.slug,
            title: a.title,
            category: a.category || 'BUILDING A BUSINESS',
            author: a.author || { name: a.authorName || 'Sherin Shibu', avatar: a.authorAvatar || '/images/author-sherin.png' },
            date: a.date || 'Just now',
            readTime: a.readTime || '5 min read',
            excerpt: a.excerpt,
            imageUrl: a.imageUrl || '',
          }));

          const seenKeys = new Set<string>();
          const combined: Article[] = [];
          [...dbArticles, ...BASELINE_LATEST_NEWS_9].forEach((item) => {
            const idKey = item.id || '';
            const slugKey = item.slug || '';
            const titleKey = (item.title || '').toLowerCase().trim();
            if (
              (!idKey || !seenKeys.has(idKey)) &&
              (!slugKey || !seenKeys.has(slugKey)) &&
              (!titleKey || !seenKeys.has(titleKey))
            ) {
              if (idKey) seenKeys.add(idKey);
              if (slugKey) seenKeys.add(slugKey);
              if (titleKey) seenKeys.add(titleKey);
              combined.push(item);
            }
          });
          setLatestArticles(combined.slice(0, 5));
        }
      })
      .catch(() => {});

    // 2. Fetch Hero Section (Capacity 8: slots 1-4 for carousel, slots 5-8 for right column)
    fetch('/api/articles?status=published&placement=hero_section&limit=15')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const dbHero: Article[] = data.data.map((a: any) => ({
            id: a.slug || String(a.dbId || a.id),
            slug: a.slug,
            title: a.title,
            category: a.category || 'STARTUPS & ENTREPRENEURSHIP',
            author: a.author || { name: a.authorName || 'Scott Smrkovski', avatar: a.authorAvatar || '/images/home-hero/author-scott.png' },
            date: a.date || 'Just now',
            readTime: a.readTime || '5 min read',
            excerpt: a.excerpt,
            imageUrl: a.imageUrl || '/images/home-hero/hero-growth-decision.png',
          }));

          const seenHeroKeys = new Set<string>();
          const combinedHero: Article[] = [];
          [...dbHero, ...BASELINE_HERO_8].forEach((item) => {
            const idKey = item.id || '';
            const slugKey = item.slug || '';
            const titleKey = (item.title || '').toLowerCase().trim();
            if (
              (!idKey || !seenHeroKeys.has(idKey)) &&
              (!slugKey || !seenHeroKeys.has(slugKey)) &&
              (!titleKey || !seenHeroKeys.has(titleKey))
            ) {
              if (idKey) seenHeroKeys.add(idKey);
              if (slugKey) seenHeroKeys.add(slugKey);
              if (titleKey) seenHeroKeys.add(titleKey);
              combinedHero.push(item);
            }
          });

          const slides = combinedHero.slice(0, 4);
          if (slides.length > 0) {
            setHeroSlides(slides);
          }
          const rightItems = combinedHero.slice(4, 8);
          if (rightItems.length > 0) {
            setRightCard(rightItems[0]);
            setRightStream(rightItems.slice(1, 4));
          }
        }
      })
      .catch(() => {});
  }, []);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const currentHero = heroSlides[activeSlide] || heroSlides[0] || HERO_GROWTH_DECISION_ARTICLE;

  return (
    <section className="bg-white pt-5 sm:pt-6 2xl:pt-7 pb-6 sm:pb-8 2xl:pb-10 w-full border-b border-slate-200/80 mb-6 sm:mb-8">
      <div className="w-full">
        {/* Main 3-Column Layout: increased gap between columns for spacious editorial look */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1.65fr_1.25fr] xl:grid-cols-[1.2fr_1.75fr_1.3fr] gap-6 sm:gap-7 xl:gap-8 items-stretch">
          
          {/* ========================================================= */}
          {/* 1. LEFT COLUMN: Latest (Mobile: order-2, Desktop: order-1) */}
          {/* ========================================================= */}
          <div className="order-2 lg:order-1 flex flex-col justify-between h-full">
            {/* Header: Latest + See All [->] */}
            <div className="flex items-center justify-between pb-1.5 mb-1 flex-shrink-0">
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#020618] leading-none my-0 flex items-center">
                <span className="inline-block w-4 h-5 sm:w-4.5 sm:h-5.5 border-2 border-[#c61830] bg-transparent rounded-none mr-2.5 shrink-0 self-center" aria-hidden="true" />
                <Link href="/latest" className="no-underline hover:no-underline active:no-underline focus:no-underline">
                  Latest
                </Link>
              </h2>

              <Link
                href="/latest"
                className="flex items-center gap-1.5 text-xs font-bold text-[#020618] hover:text-[#c61830] transition-colors group"
                aria-label="See all latest articles"
              >
                <span>See All</span>
                <div className="w-4.5 h-4.5 bg-[#c61830] group-hover:bg-[#a51226] text-white rounded-xs flex items-center justify-center transition-colors">
                  <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>
              </Link>
            </div>

            {/* List of 5 Balanced Articles matching vertical height of center & right */}
            <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between pt-0.5">
              {latestArticles.slice(0, 5).map((art, idx) => (
                <article
                  key={`${art.id || art.slug || 'art'}-${idx}`}
                  className="py-1.5 first:pt-0.5 last:pb-0 lg:py-1 xl:py-1.5 2xl:py-2.5 flex items-center justify-between gap-3 xl:gap-4 group"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <span className="text-[9px] sm:text-[9.5px] font-bold text-[#c61830] uppercase tracking-wider block font-sans mb-0.5 no-underline hover:no-underline active:no-underline focus:no-underline">
                      {art.category}
                    </span>
                    <h3
                      className="font-serif font-bold text-[12.5px] sm:text-[13px] 2xl:text-[14px] leading-snug text-[#020618] group-hover:underline line-clamp-3 my-0"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      <Link href={`/article/${art.slug || art.id}`}>
                        {art.title}
                      </Link>
                    </h3>
                    <span className="text-[10px] sm:text-[10.5px] text-slate-400 font-sans block mt-0.5 sm:mt-1">
                      {art.date}
                    </span>
                  </div>

                  <Link
                    href={`/article/${art.slug || art.id}`}
                    className="w-[104px] h-[72px] sm:w-[112px] sm:h-[78px] lg:w-[114px] lg:h-[80px] xl:w-[120px] xl:h-[84px] 2xl:w-[136px] 2xl:h-[96px] shrink-0 rounded-none overflow-hidden bg-slate-100 block cursor-pointer"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-none"
                    />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. CENTER COLUMN: Main Featured Hero Card (Mobile: order-1, Desktop: order-2) */}
          {/* ========================================================= */}
          <div className="order-1 lg:order-2 flex flex-col justify-between h-full bg-[#f8fafc]/50 border border-slate-200/70 p-4 sm:p-5 lg:p-6 shadow-xs">
            <div className="flex flex-col justify-between h-full group">
              {/* Top Text Content: Trimmed margins left and right matching Entrepreneur layout */}
              <div className="text-center px-2 sm:px-4 md:px-6 pt-1 pb-3">
                {/* Category Link */}
                <Link
                  href="/topic/startups-entrepreneurship"
                  className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider text-[#c61830] hover:underline mb-1.5 inline-block text-center"
                >
                  {currentHero.category}
                </Link>

                {/* Main Headline: Bold, prominent, trimmed within comfortable left/right bounds */}
                <h1
                  className="font-serif font-black text-xl sm:text-2xl lg:text-[27px] xl:text-[30px] leading-[1.2] tracking-tight text-[#020618] my-2 group-hover:underline text-center line-clamp-3 max-w-[95%] mx-auto"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  <Link
                    href={`/article/${currentHero.slug || currentHero.id}`}
                    className="hover:underline text-[#020618] no-underline"
                  >
                    {currentHero.title}
                  </Link>
                </h1>

                {/* Author Byline: BY AUTHOR NAME */}
                <div className="text-center mt-2 text-[11px] sm:text-xs font-sans uppercase tracking-wider text-slate-500 font-medium">
                  <span className="text-slate-500">BY </span>
                  <span className="text-[#c61830] font-bold underline underline-offset-2">
                    {currentHero.author?.name || 'Sherin Shibu'}
                  </span>
                </div>
              </div>

              {/* Center Image: Square / Portrait Card with crisp non-rounded borders */}
              <div className="relative w-full aspect-[16/11] sm:aspect-[4/3] lg:aspect-[16/12] max-h-[350px] lg:max-h-[390px] my-2 overflow-hidden rounded-none border border-slate-200/80 bg-slate-100 flex-shrink-0">
                <Link
                  href={`/article/${currentHero.slug || currentHero.id}`}
                  className="block w-full h-full cursor-pointer"
                >
                  <img
                    src={currentHero.imageUrl || '/images/home-hero/hero-growth-decision.png'}
                    alt={currentHero.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 rounded-none"
                  />
                </Link>
              </div>

              {/* Bottom Carousel Controls: 4 Slot Bars Centered in the Middle */}
              <div className="flex items-center justify-center pt-2 px-1 flex-shrink-0">
                {/* 4 Dedicated Slot Indicator Bars centered */}
                <div className="flex items-center justify-center gap-2">
                  {heroSlides.slice(0, 4).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 transition-all cursor-pointer rounded-none ${
                        activeSlide === idx
                          ? 'w-10 sm:w-12 bg-[#c61830]'
                          : 'w-7 sm:w-8 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. RIGHT COLUMN: Top Card (Slot 5) + 3 Articles (Slots 6-8) */}
          {/* ========================================================= */}
          <div className="order-3 lg:order-3 flex flex-col justify-between h-full">
            
            {/* Top Featured Card: Hero Slot 5 */}
            <article className="rounded-none overflow-hidden bg-white text-[#020618] group cursor-pointer flex flex-col shadow-xs flex-shrink-0 mb-3 border border-slate-200/80">
              <Link
                href={`/article/${rightCard.slug || rightCard.id}`}
                className="w-full aspect-[16/9] max-h-[155px] lg:max-h-[170px] xl:max-h-[185px] 2xl:max-h-[225px] overflow-hidden bg-slate-100 block"
              >
                <img
                  src={rightCard.imageUrl}
                  alt={rightCard.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-none"
                />
              </Link>
              <div className="p-3 sm:p-3.5">
                <span className="text-[10px] sm:text-[10.5px] font-bold text-[#c61830] uppercase tracking-wider block font-sans mb-1 no-underline">
                  {rightCard.category}
                </span>
                <h3
                  className="font-serif font-bold text-[15px] sm:text-[16px] 2xl:text-[17.5px] leading-snug text-[#020618] group-hover:underline mt-0.5 my-0 line-clamp-2"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  <Link href={`/article/${rightCard.slug || rightCard.id}`} className="hover:underline text-[#020618] no-underline">
                    {rightCard.title}
                  </Link>
                </h3>
                <span className="text-[10px] text-slate-400 font-sans block mt-1">
                  {rightCard.date} • {rightCard.readTime || '5 min read'}
                </span>
              </div>
            </article>

            {/* Bottom 3 Horizontal Articles: Hero Slots 6, 7, 8 */}
            <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between pt-0.5">
              {rightStream.map((art, idx) => (
                <article
                  key={`${art.id || art.slug || 'right'}-${idx}`}
                  className="py-1.5 first:pt-0 last:pb-0 lg:py-2 xl:py-2.5 2xl:py-3.5 flex items-center justify-between gap-3 xl:gap-4 group"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <span className="text-[9.5px] font-bold text-[#c61830] uppercase tracking-wider block font-sans mb-0.5 no-underline hover:no-underline active:no-underline focus:no-underline">
                      {art.category}
                    </span>
                    <h4
                      className="font-serif font-bold text-[12.5px] sm:text-[13px] 2xl:text-[14px] leading-snug text-[#020618] group-hover:underline line-clamp-3 my-0"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      <Link href={`/article/${art.slug || art.id}`}>
                        {art.title}
                      </Link>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                      {art.date} • {art.readTime}
                    </span>
                  </div>

                  <Link
                    href={`/article/${art.slug || art.id}`}
                    className="w-[110px] h-[74px] sm:w-[118px] sm:h-[78px] lg:w-[120px] lg:h-[82px] xl:w-[124px] xl:h-[86px] 2xl:w-[144px] 2xl:h-[94px] shrink-0 rounded-none overflow-hidden bg-slate-100 block cursor-pointer"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-none"
                    />
                  </Link>
                </article>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
