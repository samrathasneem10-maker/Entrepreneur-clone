'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const FranchisesMainSection: React.FC = () => {
  const pills = [
    { label: 'Franchise 500', active: false },
    { label: 'See Franchise Matches', active: true },
    { label: 'Find Your Franchise', active: false },
    { label: 'Fund Your Franchise', active: false },
    { label: 'Buy Your Franchise', active: false },
  ];

  const leftArticles = [
    {
      id: 'fran-main-1',
      category: 'BUYING A FRANCHISE',
      title: 'Cinnamon Is Suddenly the Hot New Ingredient on Restaurant Menus and Cinnabon Is Cashing In',
    },
    {
      id: 'fran-main-2',
      category: 'BUYING A FRANCHISE',
      title: "She Was Told 'Who's Going to Give You Business?' Now She's a Top Home Inspector in Brooklyn",
    },
    {
      id: 'fran-main-3',
      category: 'BUYING A FRANCHISE',
      title: 'How a Couple Turned Their Passion for Fitness into a Multi-Unit Franchise Network',
    },
  ];

  return (
    <section className="bg-white py-10 md:py-12 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Header Bar matching Screenshot 1 */}
        <div className="mb-6 border-b border-slate-200 pb-3 flex items-center justify-between">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none">
            <Link href="/topic/franchises" className="hover:underline">Franchises</Link>
          </h2>

          <Link
            href="/topic/franchises"
            className="flex items-center gap-1.5 text-xs font-bold text-[#020618] hover:text-[#1642D0] uppercase tracking-wider font-sans group"
          >
            <span>See All</span>
            <span className="w-5 h-5 rounded-full bg-[#1642D0] text-white flex items-center justify-center transition-colors group-hover:bg-blue-800">
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* Sub-Navigation Pills (Matching Screenshot 1) */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-6">
          {pills.map((pill) => (
            <button
              key={pill.label}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm font-sans transition-all whitespace-nowrap cursor-pointer ${
                pill.active
                  ? 'bg-white text-[#020618] border-2 border-[#020618] shadow-xs'
                  : 'bg-[#020618] text-white hover:bg-slate-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* 3-Column Layout: Left Articles + Middle Featured Image + Right Match Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (4 cols): Article titles with blue category badges */}
          <div className="lg:col-span-4 space-y-6">
            {leftArticles.map((art, idx) => (
              <Link
                key={art.id}
                href={`/article/${art.id}`}
                className={`group block space-y-1.5 pb-5 ${
                  idx < leftArticles.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#1642D0] font-sans block">
                  {art.category}
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all leading-snug">
                  {art.title}
                </h3>
              </Link>
            ))}
          </div>

          {/* Middle Column (5 cols): Featured photo */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop"
                alt="Franchise Opportunity"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column (3 cols): Find Your Perfect Franchise Match Widget (Screenshot 1) */}
          <div className="lg:col-span-3 bg-[#FAFAFA] border border-slate-200/90 rounded-2xl p-6 text-center space-y-4 shadow-2xs">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] leading-tight">
              Find Your Perfect Franchise Match
            </h3>

            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              See which franchises fit your budget and have open territories near you.
            </p>

            <div className="pt-2">
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-[#1642D0] h-full w-[35%] rounded-full"></div>
              </div>
              <button
                onClick={() => alert('Franchise Match Quiz launched')}
                className="w-full py-3 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-2xs cursor-pointer"
              >
                Take Franchise Quiz →
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
