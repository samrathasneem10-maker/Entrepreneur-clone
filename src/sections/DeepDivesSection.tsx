import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ArticleCard } from '@/components/ArticleCard';
import { DEEP_DIVE_ARTICLES } from '@/data/newsData';

export const DeepDivesSection: React.FC = () => {
  return (
    <section className="bg-white py-12 w-full">
      <div className="w-full px-5 lg:px-10">
        
        {/* Header */}
        <div className="mb-8 border-t border-slate-200 pt-3 pb-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-blue-50 text-[#193CB8] rounded-md">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="my-0 flex text-[#020618] font-bold text-2xl font-serif leading-none">
                <Link href="/deep-dives" className="hover:underline">Deep Dives & Strategy</Link>
              </h2>
            </div>

            <Link
              href="/deep-dives"
              className="flex items-center no-underline hover:underline text-xs font-bold text-[#020618] uppercase tracking-wider ml-4"
            >
              See All
              <ArrowRight className="w-4 h-4 ml-1 text-[#193CB8]" />
            </Link>
          </div>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {DEEP_DIVE_ARTICLES.map((article) => (
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
