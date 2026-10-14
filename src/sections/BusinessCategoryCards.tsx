import React from 'react';
import Link from 'next/link';

export const BusinessCategoryCards: React.FC = () => {
  const categoryColumns = [
    {
      id: 'cat-leadership',
      columnTitle: 'Leadership',
      article: {
        id: 'lead-1',
        categoryTag: 'THOUGHT LEADERS',
        title: "Silence in a Meeting Isn't Alignment. It's Fear. Here's How to Build a Team That Tells You the Truth",
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
    },
    {
      id: 'cat-ideas',
      columnTitle: 'Business Ideas',
      article: {
        id: 'ideas-1',
        categoryTag: 'ENTREPRENEURS',
        title: '8 Unique Side Hustle Ideas for Summer 2026 and Beyond',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
    },
    {
      id: 'cat-tech',
      columnTitle: 'Technology',
      article: {
        id: 'tech-1',
        categoryTag: 'BUILDING A BUSINESS',
        title: 'Your Customers Are Buying in 20 Different Places. Is Your Brand There?',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
    },
  ];

  return (
    <section className="bg-white py-10 md:py-12 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Main Section Header matching Screenshot 3 & 4 */}
        <div className="mb-8 border-b border-slate-200 pb-3">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none">
            Categories
          </h2>
        </div>

        {/* 3-Column Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryColumns.map((col) => (
            <div key={col.id} className="space-y-4">
              {/* Category Column Sub-Heading */}
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] border-b border-slate-100 pb-2">
                {col.columnTitle}
              </h3>

              {/* Column Article Card */}
              <Link
                href={`/article/${col.article.id}`}
                className="group flex flex-col space-y-3 cursor-pointer block"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
                  <img
                    src={col.article.imageUrl}
                    alt={col.article.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#1642D0] font-sans block">
                    {col.article.categoryTag}
                  </span>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all leading-snug">
                    {col.article.title}
                  </h4>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
