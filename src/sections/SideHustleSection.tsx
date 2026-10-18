'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { SIDE_HUSTLE_ARTICLES, getArticleUrl } from '@/data/newsData';

export const SideHustleSection: React.FC = () => {
  const [selectedCount, setSelectedCount] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleNewsletter = (id: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const count = Object.values(updated).filter(Boolean).length;
      setSelectedCount(count);
      return updated;
    });
  };

  const newsletterOptions = [
    { id: 'breaking-business-news', title: 'Breaking Business News' },
    { id: 'markets-investing', title: 'Markets & Investing' },
    { id: 'economy', title: 'Economy' },
    { id: 'corporate-news', title: 'Corporate News' },
    { id: 'startups-entrepreneurship', title: 'Startups & Entrepreneurship' },
    { id: 'banking-finance', title: 'Banking & Finance' },
    { id: 'technology-ai', title: 'Technology & AI' },
    { id: 'real-estate', title: 'Real Estate' },
    { id: 'international-business', title: 'International Business' },
    { id: 'leadership', title: 'Leadership' },
    { id: 'marketing-branding', title: 'Marketing & Branding' },
    { id: 'sustainability-esg', title: 'Sustainability (ESG)' },
    { id: 'company-profiles', title: 'Company Profiles' },
    { id: 'ceo-interviews', title: 'CEO Interviews' },
    { id: 'research-insights', title: 'Research & Insights' },
  ];

  return (
    <section className="bg-white pt-4 sm:pt-6 pb-8 md:pb-10 w-full">
      <div className="w-full">
        
        {/* Category Heading Bar: No underline under 'Side Hustle', green circle See All */}
        <div className="mb-6 pb-1 flex items-center justify-between">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none">
            <Link
              href="/side-hustle"
              className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[4px] transition-all"
            >
              Side Hustle
            </Link>
          </h2>

          <Link
            href="/side-hustle"
            aria-label="See All Side Hustle"
            className="flex items-center gap-1.5 text-xs font-bold text-[#020618] hover:underline uppercase tracking-wider font-sans group"
          >
            <span>See All</span>
            <span className="w-5 h-5 rounded-full bg-[#0D542B] group-hover:bg-[#1642D0] text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* 2-Column Grid Layout: Articles (Left) + Newsletters Widget (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Main Articles Column (7 of 12) */}
          <div className="lg:col-span-7 space-y-6">
            {SIDE_HUSTLE_ARTICLES.map((article) => (
              <article
                key={article.id}
                className="group flex items-start justify-between gap-5 pb-6 border-b border-slate-200/80 last:border-b-0 last:pb-0 w-full"
              >
                <div className="flex-1 flex flex-col items-start text-left">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#193CB8] font-sans block mb-1.5">
                    {article.category}
                  </span>

                  <h3 className="text-base sm:text-lg lg:text-[18.5px] font-serif font-bold text-[#020618] leading-[1.3] tracking-tight mb-2">
                    <Link
                      href={getArticleUrl(article)}
                      className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  {article.author?.name && (
                    <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-900 mt-auto pt-1">
                      <span className="text-slate-600 font-medium">BY </span>
                      <Link
                        href={`/author/${article.author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="underline decoration-slate-900 underline-offset-2 hover:text-[#193CB8] transition-colors"
                      >
                        {article.author.name}
                      </Link>
                    </div>
                  )}
                </div>

                {article.imageUrl && (
                  <figure className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200/80">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 rounded-xl"
                    />
                  </figure>
                )}
              </article>
            ))}
          </div>

          {/* Sidebar: Entrepreneur Newsletters Widget (5 of 12 - Matching Screenshots 1, 2, 3) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
            {/* Header: 'E' Logo + ENTREPRENEUR NEWSLETTERS + Dark Underline */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 bg-[#020618] text-white flex items-center justify-center font-serif font-black text-xs rounded-xs">
                  E
                </span>
                <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-500">
                  ENTREPRENEUR NEWSLETTERS
                </span>
              </div>
              <div className="h-[1.5px] bg-slate-900 w-full" />
            </div>

            {/* Title & Description */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold font-serif text-[#020618] leading-tight mb-2">
                Newsletters
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
                Pick your must-reads and unlock exclusive insights, fresh strategies and real founder stories — built to help you win.
              </p>
            </div>

            {/* Email Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Subscribed to ${selectedCount} newsletters!`);
              }}
              className="space-y-2 mb-5"
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-3.5 py-2.5 bg-[#FDE8E8] border border-[#F8B4B4] rounded-md text-xs placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1642D0]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1642D0] hover:bg-[#143094] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Submit
                </button>
              </div>

              <div className="text-[11px] text-[#E02424] font-sans font-normal">
                This field is required.
              </div>

              <div className="text-[11px] italic text-slate-500 font-sans">
                {selectedCount} newsletters selected
              </div>
            </form>

            {/* Divider line before newsletter list */}
            <div className="border-t border-slate-200/90 pt-3">
              {newsletterOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-3.5 group cursor-pointer py-2.5 border-b border-slate-200/70 last:border-b-0"
                  onClick={() => toggleNewsletter(option.id)}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                      checkedItems[option.id]
                        ? 'bg-[#1642D0] border-[#1642D0] text-white'
                        : 'bg-white border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {checkedItems[option.id] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <span className="text-[14px] font-serif font-bold text-[#020618] leading-tight group-hover:underline decoration-[#020618] decoration-1 underline-offset-[2px] transition-all select-none">
                    {option.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
