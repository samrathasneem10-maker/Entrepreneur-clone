'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, ChevronLeft, TrendingUp } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { getTopicDataBySlug } from '@/data/newsData';

const TRENDING_NEWS_ITEMS = [
  {
    id: 'trend-1',
    rank: '01',
    title: 'New Exclusive Decoration Design & Fit Out LLC – Structural Acrylic Pioneers in the UAE',
    views: '66 views since publication',
    link: '/article/hero-1',
  },
  {
    id: 'trend-2',
    rank: '02',
    title: 'Trump Declares Iran Ceasefire \'Over,\' Raising Questions About the Next Phase of the Conflict',
    views: '41 views since publication',
    link: '/article/feat-1',
  },
  {
    id: 'trend-3',
    rank: '03',
    title: 'Trump\'s Hormuz Retreat Highlights Struggles to End Iran Conflict',
    views: '14 views since publication',
    link: '/article/feat-2',
  },
  {
    id: 'trend-4',
    rank: '04',
    title: 'Senegal Sack Coach Pape Thiaw After Disappointing 2026 FIFA World Cup Campaign',
    views: '14 views since publication',
    link: '/article/feat-3',
  },
  {
    id: 'trend-5',
    rank: '05',
    title: 'Philip Johnston: The Entrepreneur Building the Future of AI in Space',
    views: '9 views since publication',
    link: '/article/feat-4',
  },
];

export default function DynamicTopicPage() {
  const params = useParams();
  const rawSlug = typeof params?.slug === 'string' ? params.slug : 'breaking-business-news';
  const topicData = getTopicDataBySlug(rawSlug);

  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when switching topics
  React.useEffect(() => {
    setCurrentPage(1);
  }, [rawSlug]);

  const ARTICLES_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(topicData.articles.length / ARTICLES_PER_PAGE));
  const currentArticles = topicData.articles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* 1. Sticky Header Navigation */}
      <Header />

      {/* Breadcrumb Bar */}
      <div className="bg-slate-50/80 border-b border-slate-200 py-2.5 px-5 lg:px-10 text-xs text-slate-600 font-sans">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-[#1642D0] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-900 font-bold uppercase tracking-wider">
            {topicData.title}
          </span>
        </div>
      </div>

      {/* Top Advertisement Banner Placeholder (728 × 90) */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pt-6 pb-2">
        <div className="w-full bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center min-h-[90px] max-w-[728px] mx-auto shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ADVERTISEMENT</span>
          <span className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">Leaderboard Banner 728 × 90</span>
          <span className="text-[11px] text-slate-400">Your Advertisement Here</span>
        </div>
      </div>

      {/* Main Body Grid Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT MAIN COLUMN (~70% / 8 cols on lg): Topic Headline + Article Stream + Pagination (Order 1) */}
          <div className="w-full lg:col-span-8 order-1 space-y-8">
            
            {/* Topic Main Title */}
            <div className="border-b border-slate-200 pb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-bold text-[#020618] leading-tight tracking-tight my-0">
                {topicData.title}
              </h1>
              {topicData.description && (
                <p className="text-slate-600 text-sm font-sans mt-2">
                  {topicData.description}
                </p>
              )}
            </div>

            {/* Article Stream */}
            <div className="space-y-6">
              {currentArticles.map((art) => (
                <article
                  key={art.id}
                  className="group flex items-start justify-between gap-6 pb-6 border-b border-slate-200/80 last:border-b-0"
                >
                  {/* Article Text Content */}
                  <div className="flex-1 space-y-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#1642D0] font-sans block">
                      {art.category}
                    </span>

                    <h2 className="text-lg sm:text-xl font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all leading-snug my-0">
                      <Link href={`/article/${art.id}`}>
                        {art.title}
                      </Link>
                    </h2>

                    {art.excerpt && (
                      <p className="text-xs sm:text-sm text-slate-700 font-serif font-normal leading-relaxed line-clamp-2">
                        {art.excerpt}
                      </p>
                    )}

                    <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 pt-1">
                      BY {art.author.name}
                    </div>
                  </div>

                  {/* Thumbnail Image */}
                  {art.imageUrl && (
                    <Link
                      href={`/article/${art.id}`}
                      className="w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xs block"
                    >
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  )}
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200 font-sans text-xs font-bold">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-lg font-bold transition-colors cursor-pointer ${
                    currentPage === pageNum ? 'bg-[#1642D0] text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-[#1642D0] hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>

          </div>

          {/* RIGHT SIDEBAR (~30% / 4 cols on lg): Sticky Trending News + 2 Ad Banners (Order 2) */}
          <aside className="w-full lg:col-span-4 order-2 lg:sticky lg:top-24 space-y-6">
            
            {/* 1. Trending News Card (Matching Reference Screenshots 2 & 3) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3.5 border-b border-slate-200">
                <TrendingUp className="w-5 h-5 text-[#1642D0]" />
                <h2 className="text-sm font-serif font-extrabold text-[#020618] uppercase tracking-wider my-0">
                  TRENDING IN US
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {TRENDING_NEWS_ITEMS.map((item, idx) => (
                  <div key={item.id} className="flex gap-4 items-start py-3.5 first:pt-0 last:pb-0">
                    <span className={`font-serif font-bold text-xl sm:text-2xl leading-none pt-0.5 ${idx === 0 ? 'text-[#8B0000]' : 'text-slate-300'}`}>
                      {item.rank}
                    </span>
                    <div className="space-y-1">
                      <Link
                        href={item.link}
                        className="font-sans font-bold text-xs sm:text-[13px] text-[#020618] hover:underline decoration-[#020618] decoration-1 underline-offset-[2px] transition-all leading-snug block"
                      >
                        {item.title}
                      </Link>
                      <span className="text-[11px] font-sans text-slate-400 block font-medium">
                        {item.views}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Advertisement Placeholder 1 (300 × 250 Banner) */}
            <div className="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[250px] w-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ADVERTISEMENT</span>
              <span className="text-sm font-semibold text-slate-700 mt-1">300 × 250 Banner</span>
              <span className="text-xs text-slate-400 mt-1">Your Advertisement Here</span>
            </div>

            {/* 3. Advertisement Placeholder 2 (300 × 600 Banner) */}
            <div className="bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[500px] lg:min-h-[600px] w-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ADVERTISEMENT</span>
              <span className="text-sm font-semibold text-slate-700 mt-1">300 × 600 Banner</span>
              <span className="text-xs text-slate-400 mt-1">Your Advertisement Here</span>
            </div>

          </aside>

        </div>
      </main>


      {/* 2. Footer Navigation */}
      <Footer />
    </div>
  );
}

