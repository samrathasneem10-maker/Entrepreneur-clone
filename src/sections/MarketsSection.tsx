import React from 'react';
import Link from 'next/link';
import { MarketTicker } from '@/components/MarketTicker';
import { ArticleCard } from '@/components/ArticleCard';
import { MARKETS_INVESTING_ARTICLES } from '@/data/newsData';

export const MarketsSection: React.FC = () => {
  return (
    <section className="bg-slate-50 py-10 md:py-12 border-b border-slate-200 w-full">
      
      {/* Embedded Markets Ticker Bar */}
      <div className="mb-8 w-full">
        <MarketTicker />
      </div>

      <div className="w-full px-5 lg:px-10">
        
        {/* Category Header */}
        <div className="mb-6 border-t border-slate-200 pt-3 pb-2 relative">
          <div className="flex items-center justify-between">
            <h2 className="my-0 flex text-[#0F172B] font-bold text-2xl font-serif leading-none">
              <Link href="/markets" className="hover:underline">Markets & Economy</Link>
            </h2>

            <Link
              href="/markets"
              aria-label="Read more about Markets"
              className="flex items-center no-underline hover:underline text-xs font-bold text-[#0F172B] uppercase tracking-wider ml-4"
            >
              See All
              <svg aria-hidden="true" fill="currentColor" className="w-5 h-5 fill-current ml-1 text-[#193CB8]" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10m-10 1H8v-2h4V8l4 4-4 4z"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* 3-Column Grid Spanning Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MARKETS_INVESTING_ARTICLES.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="featured"
              showExcerpt={true}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
