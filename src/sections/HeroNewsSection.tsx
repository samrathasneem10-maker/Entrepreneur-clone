'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  HERO_GROWTH_DECISION_ARTICLE,
  UBER_DRIVER_BONUSES_ARTICLE,
  HOMEPAGE_LATEST_STREAM,
  HOMEPAGE_RIGHT_STREAM,
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

export const HeroNewsSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [latestArticles, setLatestArticles] = useState<Article[]>(HOMEPAGE_LATEST_STREAM);

  useEffect(() => {
    fetch('/api/articles?status=published&limit=10')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          const dbArticles: Article[] = data.data.map((a: any) => ({
            id: a.slug || String(a.dbId),
            slug: a.slug,
            title: a.title,
            category: a.category || 'BUILDING A BUSINESS',
            author: a.author || { name: a.authorName || 'Staff Contributor', avatar: '/images/author-sherin.png' },
            date: a.date || 'Just now',
            readTime: a.readTime || '5 min read',
            excerpt: a.excerpt,
            imageUrl: a.imageUrl || '/images/home-hero/latest-1-cofounder.png',
          }));

          const combined = [...dbArticles];
          HOMEPAGE_LATEST_STREAM.forEach((item) => {
            if (!combined.some((c) => c.slug === item.slug || c.title.toLowerCase() === item.title.toLowerCase())) {
              combined.push(item);
            }
          });
          setLatestArticles(combined.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const currentHero = HERO_SLIDES[activeSlide];

  return (
    <section className="bg-white pt-2.5 sm:pt-3.5 pb-4 sm:pb-5 w-full">
      <div className="w-full">
        {/* Main 3-Column Layout: Perfectly balanced height across Left, Middle, and Right to fit within visible window */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1.65fr_1.25fr] gap-4 sm:gap-5 xl:gap-6 items-stretch lg:h-[495px] xl:h-[515px]">
          
          {/* ========================================================= */}
          {/* 1. LEFT COLUMN: Latest (aligned top and bottom)           */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between h-full">
            {/* Header: Latest + See All [->] */}
            <div className="flex items-center justify-between pb-1.5 mb-1 flex-shrink-0">
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#020618] leading-none my-0">
                <Link href="/latest" className="hover:underline">
                  Latest
                </Link>
              </h2>

              <Link
                href="/latest"
                className="flex items-center gap-1.5 text-xs font-bold text-[#020618] hover:text-[#1642D0] transition-colors group"
                aria-label="See all latest articles"
              >
                <span>See All</span>
                <div className="w-4.5 h-4.5 bg-[#1642D0] group-hover:bg-blue-800 text-white rounded-xs flex items-center justify-center transition-colors">
                  <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>
              </Link>
            </div>

            {/* List of 4 Balanced Articles matching vertical height of center & right */}
            <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between pt-0.5">
              {latestArticles.slice(0, 4).map((art) => (
                <article
                  key={art.id}
                  className="py-2 first:pt-1 last:pb-0 flex items-center justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <span className="text-[9.5px] font-bold text-[#1642D0] uppercase tracking-wider block font-sans mb-0.5">
                      {art.category}
                    </span>
                    <h3 className="font-serif font-bold text-[13px] sm:text-[13.5px] leading-snug text-[#020618] group-hover:underline line-clamp-2 my-0">
                      <Link href={`/article/${art.slug || art.id}`}>
                        {art.title}
                      </Link>
                    </h3>
                    <span className="text-[10.5px] text-slate-400 font-sans block mt-1">
                      {art.date}
                    </span>
                  </div>

                  <Link
                    href={`/article/${art.slug || art.id}`}
                    className="w-[110px] h-[74px] sm:w-[118px] sm:h-[78px] shrink-0 rounded-xs overflow-hidden bg-slate-100 block cursor-pointer"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xs"
                    />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. CENTER COLUMN: Main Featured Hero Card                */}
          {/* ========================================================= */}
          <div className="flex flex-col h-full">
            <div className="relative h-full flex-1 w-full rounded-xs overflow-hidden bg-[#070b19] text-white flex flex-col justify-end min-h-[380px] shadow-sm group">
              {/* Background Image */}
              <img
                src={currentHero.imageUrl || '/images/home-hero/hero-growth-decision.png'}
                alt={currentHero.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent" />

              {/* Hero Content Overlay */}
              <div className="relative z-10 p-4 sm:p-5 lg:p-6 flex flex-col justify-end">
                {/* Category Badge */}
                <Link
                  href="/topic/startups-entrepreneurship"
                  className="inline-block bg-[#1642D0] hover:bg-blue-700 text-white text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs mb-1.5 w-fit font-sans transition-colors"
                >
                  {currentHero.category}
                </Link>

                {/* Title */}
                <h1 className="font-serif font-bold text-xl sm:text-2xl lg:text-[25px] xl:text-[27px] leading-[1.2] tracking-tight text-white my-1">
                  <Link
                    href={`/article/${currentHero.slug || currentHero.id}`}
                    className="hover:underline"
                  >
                    {currentHero.title}
                  </Link>
                </h1>

                {/* Excerpt */}
                {currentHero.excerpt && (
                  <p className="font-sans text-xs text-slate-200 leading-relaxed mt-1 max-w-xl my-0 line-clamp-2">
                    {currentHero.excerpt}
                  </p>
                )}

                {/* Author Info */}
                <div className="flex items-center gap-2 mt-2.5">
                  <img
                    src={currentHero.author?.avatar || '/images/home-hero/author-scott.png'}
                    alt={currentHero.author?.name || 'Author'}
                    className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full object-cover border border-slate-500"
                  />
                  <div className="text-xs font-sans">
                    <span className="font-bold text-white block leading-tight">
                      By {currentHero.author?.name || 'Scott Smrkovski'}
                    </span>
                    <span className="text-slate-300 text-[10.5px]">
                      {currentHero.date} • {currentHero.readTime || '8 min read'}
                    </span>
                  </div>
                </div>

                {/* Carousel Controls Row */}
                <div className="flex items-center justify-between pt-3 mt-2.5 border-t border-white/15">
                  {/* Indicator Bars */}
                  <div className="flex items-center gap-1.5">
                    {HERO_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx
                            ? 'w-7 bg-[#1642D0]'
                            : 'w-6 bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Prev / Next Arrows */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={prevSlide}
                      aria-label="Previous slide"
                      className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-xs border border-white/30 hover:border-white/80 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
                    </button>
                    <button
                      onClick={nextSlide}
                      aria-label="Next slide"
                      className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-xs border border-white/30 hover:border-white/80 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. RIGHT COLUMN: Top Uber Card + 3 Articles               */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between h-full">
            
            {/* Top Featured Card: Uber Driver Bonuses */}
            <article className="rounded-xs overflow-hidden bg-[#070b19] text-white group cursor-pointer flex flex-col shadow-xs flex-shrink-0 mb-2">
              <Link
                href={`/article/${UBER_DRIVER_BONUSES_ARTICLE.slug}`}
                className="w-full aspect-[16/8.5] max-h-[125px] overflow-hidden bg-slate-900 block"
              >
                <img
                  src={UBER_DRIVER_BONUSES_ARTICLE.imageUrl}
                  alt={UBER_DRIVER_BONUSES_ARTICLE.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-xs"
                />
              </Link>
              <div className="p-2.5 sm:p-3">
                <span className="inline-block bg-[#1642D0] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs w-fit font-sans">
                  {UBER_DRIVER_BONUSES_ARTICLE.category}
                </span>
                <h3 className="font-serif font-bold text-[14.5px] sm:text-[15.5px] leading-snug text-white group-hover:underline mt-1 my-0 line-clamp-2">
                  <Link href={`/article/${UBER_DRIVER_BONUSES_ARTICLE.slug}`}>
                    {UBER_DRIVER_BONUSES_ARTICLE.title}
                  </Link>
                </h3>
                <span className="text-[10px] text-slate-400 font-sans block mt-1">
                  {UBER_DRIVER_BONUSES_ARTICLE.date} • {UBER_DRIVER_BONUSES_ARTICLE.readTime}
                </span>
              </div>
            </article>

            {/* Bottom 3 Horizontal Articles */}
            <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between pt-0.5">
              {HOMEPAGE_RIGHT_STREAM.map((art) => (
                <article
                  key={art.id}
                  className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <span className="text-[9.5px] font-bold text-[#1642D0] uppercase tracking-wider block font-sans mb-0.5">
                      {art.category}
                    </span>
                    <h4 className="font-serif font-bold text-[12.5px] sm:text-[13px] leading-snug text-[#020618] group-hover:underline line-clamp-2 my-0">
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
                    className="w-[110px] h-[74px] sm:w-[118px] sm:h-[78px] shrink-0 rounded-xs overflow-hidden bg-slate-100 block cursor-pointer"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xs"
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
