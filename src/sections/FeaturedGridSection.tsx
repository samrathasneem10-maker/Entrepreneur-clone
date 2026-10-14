import React from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import { TOP_STORIES_GRID } from '@/data/newsData';

export const FeaturedGridSection: React.FC = () => {
  return (
    <section className="bg-white pt-10 md:pt-14 pb-6 md:pb-8 border-b border-slate-200/80 w-full">
      <div className="w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {TOP_STORIES_GRID.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="featured"
              align="center"
              showExcerpt={true}
              showAuthor={true}
              showMetadata={false}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
