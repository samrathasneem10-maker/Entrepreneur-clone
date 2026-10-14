import React from 'react';
import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { HERO_ARTICLE, LATEST_ARTICLES, SECONDARY_FEATURED } from '@/data/newsData';

export const HeroNewsSection: React.FC = () => {
  return (
    <section className="bg-white py-6 md:py-8 w-full">
      <div className="w-full">
        
        {/* Main 3-Column Layout: Left (22%), Center (50%), Right (28%) */}
        <div className="flex flex-col md:flex-wrap md:flex-row xl:flex-nowrap gap-6 xl:gap-7 items-stretch">
          
          {/* 1. Left Column: Latest News Stream (xl:w-[22%] order-2 xl:order-1) */}
          <div className="w-full md:w-4/12 xl:w-[22%] order-2 xl:order-1 m-0 xl:pr-5 border-t xl:border-t-0 border-slate-200 pt-6 xl:pt-0 flex flex-col justify-between">
            
            {/* Content Heading */}
            <div className="mb-1 pb-1">
              <div className="flex items-center justify-between">
                <h2 className="my-0 flex text-[#020618] font-extrabold text-2xl lg:text-[28px] font-serif leading-none">
                  <Link href="/latest" className="hover:underline">Latest</Link>
                </h2>

                <Link
                  href="/latest"
                  aria-label="Read more about Latest"
                  className="flex items-center no-underline hover:underline text-xs font-extrabold text-[#020618] uppercase tracking-wider ml-4"
                >
                  See All
                  <svg aria-hidden="true" fill="currentColor" className="w-5 h-5 fill-current ml-1 text-[#193CB8]" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10m-10 1H8v-2h4V8l4 4-4 4z"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Stream List */}
            <div className="flex-1 flex flex-col justify-between">
              {LATEST_ARTICLES.slice(0, 6).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="compact"
                  showMetadata={false}
                />
              ))}
            </div>
          </div>

          {/* 2. Center Column: Main Featured Hero Box (xl:w-[50%] order-1 xl:order-2) */}
          <div className="w-full md:w-8/12 xl:w-[50%] order-1 xl:order-2 m-0 md:pr-3 xl:px-2">
            <ArticleCard
              article={HERO_ARTICLE}
              variant="hero"
              showExcerpt={false}
              showAuthor={true}
              showMetadata={false}
            />
          </div>

          {/* 3. Right Column: Secondary Featured Stories (xl:w-[28%] order-3) */}
          <div className="w-full xl:w-[28%] order-3 m-0 border-t xl:border-t-0 border-slate-200 pt-6 xl:pt-0 xl:pl-5 space-y-6">
            {SECONDARY_FEATURED.map((article) => (
              <div key={article.id} className="border-b border-slate-200/80 pb-5">
                <ArticleCard
                  article={article}
                  variant="featured"
                  showExcerpt={false}
                  showMetadata={false}
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
