import React from 'react';
import Link from 'next/link';
import { Award, Building2, ChevronRight, DollarSign, TrendingUp, Key, CreditCard } from 'lucide-react';
import { FRANCHISE_500_ITEMS } from '@/data/newsData';

export const FranchiseSection: React.FC = () => {
  const franchiseLists = [
    {
      id: 'fastest-growing',
      title: 'Fastest-Growing Franchises',
      description: 'Meet the companies scaling quickly across the U.S. and Canada in our annual ranking.',
      icon: TrendingUp,
      iconColor: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'top-emerging',
      title: 'Top New & Emerging Franchises',
      description: 'Get in on the ground floor with top companies franchising for five years or less.',
      icon: Key,
      iconColor: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'under-50k',
      title: 'Top Franchises for Less Than $50,000',
      description: 'Looking for a franchise on a budget? Explore top options under $50,000.',
      icon: CreditCard,
      iconColor: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <section className="bg-white py-10 md:py-12 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Header matching Screenshot 5 */}
        <div className="mb-6 border-b border-slate-200 pb-3">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none">
            <Link href="/franchise500" className="hover:underline">Franchise Lists</Link>
          </h2>
        </div>

        {/* 3 Feature Links Blocks (Matching Screenshot 5) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {franchiseLists.map((list) => {
            const IconComp = list.icon;
            return (
              <Link
                key={list.id}
                href={`/franchise/list/${list.id}`}
                className="group p-5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:shadow-sm transition-all duration-200 flex items-start gap-4"
              >
                <div className={`p-2.5 rounded-lg flex-shrink-0 ${list.iconColor}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-serif text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all leading-snug">
                    {list.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {list.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Franchise 500 Banner & Showcase Grid */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 mb-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-md">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-sans">
              Annual 2026 Ranking
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              Entrepreneur FRANCHISE 500<span className="text-amber-400">®</span>
            </h3>
            <p className="text-slate-300 text-sm font-sans leading-relaxed">
              Explore the world’s first, most comprehensive, and most trusted franchise ranking. Filter by startup costs, growth metrics, and brand strength.
            </p>
          </div>

          <Link
            href="/franchise500"
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl transition-colors shadow-md flex-shrink-0 cursor-pointer"
          >
            Explore Franchise 500 Ranking →
          </Link>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FRANCHISE_500_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <figure className="relative h-44 w-full overflow-hidden border-b border-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md shadow-xs font-sans uppercase">
                    Rank #{item.rank}
                  </span>
                </figure>

                <div className="p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans block mb-1">
                    {item.category}
                  </span>
                  
                  <h3 className="text-xl font-bold font-serif text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all mb-3">
                    {item.name}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed mb-4 font-sans line-clamp-3">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-sans">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1 text-slate-500">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        Initial Investment:
                      </span>
                      <span className="font-bold text-[#020618]">{item.investmentRange}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Total Units:
                      </span>
                      <span className="font-bold text-[#020618]">{item.units}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/franchise/${item.id}`}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-[#193CB8] hover:text-white text-slate-900 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  Request Free Franchise Info
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
