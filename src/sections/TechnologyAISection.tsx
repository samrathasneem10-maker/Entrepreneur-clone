import React from 'react';
import Link from 'next/link';
import { Cpu, ArrowRight } from 'lucide-react';
import { ArticleCard } from '@/components/ArticleCard';
import { AI_TECH_FEATURE_ARTICLES } from '@/data/newsData';

export const TechnologyAISection: React.FC = () => {
  const leadArticle = AI_TECH_FEATURE_ARTICLES[0];
  const subArticles = AI_TECH_FEATURE_ARTICLES.slice(1);

  return (
    <section className="bg-white py-12 border-b border-slate-200 w-full">
      <div className="w-full px-5 lg:px-10">
        
        {/* Section Header */}
        <div className="mb-6 border-t border-slate-200 pt-3 pb-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-1.5 bg-blue-50 text-[#193CB8] rounded-md">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="my-0 flex text-[#020618] font-bold text-2xl font-serif leading-none">
                <Link href="/topic/technology-ai" className="hover:underline">AI & Technology</Link>
              </h2>
            </div>

            <Link
              href="/topic/technology-ai"
              className="flex items-center no-underline hover:underline text-xs font-bold text-[#020618] uppercase tracking-wider ml-4"
            >
              See All
              <ArrowRight className="w-4 h-4 ml-1 text-[#193CB8]" />
            </Link>
          </div>
        </div>

        {/* 2-Column Grid Layout: 60% Left Lead Card + 40% Right Stacked Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Lead Story (7 cols) */}
          <div className="lg:col-span-7">
            <ArticleCard
              article={leadArticle}
              variant="featured"
              showExcerpt={true}
              className="h-full"
            />
          </div>

          {/* Right Stacked Articles (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {subArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="compact"
                className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-colors"
              />
            ))}

            <div className="p-5 bg-gradient-to-br from-blue-900 to-slate-950 text-white rounded-xl shadow-xs">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Special Tech Report</span>
              <h3 className="text-lg font-bold font-serif text-white mt-1 mb-2">
                The 2026 Enterprise AI Readiness Benchmark
              </h3>
              <p className="text-slate-300 text-xs mb-3">
                How Fortune 500 & fast-growing startups measure AI ROI across operational departments.
              </p>
              <Link
                href="/reports/ai-benchmark"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white transition-colors"
              >
                Download Whitepaper →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
