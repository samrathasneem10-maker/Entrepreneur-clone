import React from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { TRENDING_STORIES, getArticleUrl } from '@/data/newsData';

export const TrendingSection: React.FC = () => {
  return (
    <section className="bg-[#020618] text-white py-12 border-b border-slate-800 w-full">
      <div className="w-full px-5 lg:px-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-red-950/60 text-red-500 rounded-md border border-red-800/40">
              <Flame className="w-5 h-5 fill-red-500" />
            </span>
            <div>
              <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
                Trending Stories
              </h2>
              <p className="text-xs text-slate-400 font-sans">Most read articles across Entrepreneur today</p>
            </div>
          </div>
        </div>

        {/* 5-Column Grid Spanning Full Width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {TRENDING_STORIES.map((story) => (
            <article key={story.id} className="group relative flex flex-col justify-between p-5 bg-slate-900/80 hover:bg-slate-900 rounded-xl border border-slate-800 transition-all hover:border-slate-700 w-full">
              
              <div>
                <div className="text-4xl font-black font-serif text-slate-500 group-hover:text-amber-400 transition-colors mb-2">
                  #{story.rank}
                </div>

                <Badge variant="amber" className="mb-1 text-[10px]">
                  {story.category}
                </Badge>

                <h3 className="text-base font-bold font-sans text-slate-100 leading-snug group-hover:text-blue-400 transition-colors">
                  <Link href={getArticleUrl(story)}>{story.title}</Link>
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 uppercase font-semibold">
                By {story.author.name}
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
