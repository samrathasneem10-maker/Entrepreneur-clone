import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const EntrepreneursSection: React.FC = () => {
  const leadArticle = {
    id: 'ent-lead',
    title: 'They Bet Everything to Turn a Simple Snack into a Restaurant Empire',
    category: 'BUYING A FRANCHISE',
    author: 'AMANDA BREEN',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop',
  };

  const rightArticles = [
    {
      id: 'ent-1',
      title: 'Jordan Rothstein Is Building SmackTok for the Next Era of Social Sports Gaming',
      category: 'BUSINESS FUNDING',
      author: 'LOGAN SIMMONS',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'ent-2',
      title: 'What Kind of Business Entity Should You Choose? Getting It Wrong Could Cost You Millions When You Sell.',
      category: 'BUILDING A BUSINESS',
      author: 'ROB PASQUESI',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <section className="bg-white py-10 md:py-12 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Heading Bar matching Screenshot 3 */}
        <div className="mb-6 border-b border-slate-200 pb-3 flex items-center justify-between">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none">
            <Link href="/topic/entrepreneurs" className="hover:underline">Entrepreneurs</Link>
          </h2>

          <Link
            href="/topic/entrepreneurs"
            className="flex items-center gap-1.5 text-xs font-bold text-[#020618] hover:text-[#1642D0] uppercase tracking-wider font-sans group"
          >
            <span>See All</span>
            <span className="w-5 h-5 rounded-full bg-[#1642D0] text-white flex items-center justify-center transition-colors group-hover:bg-blue-800">
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* 2-Column Grid Layout: Large Lead Card (Left 50%) + Stacked Right Cards (Right 50%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Lead Feature Card */}
          <div className="lg:col-span-6 group cursor-pointer">
            <Link href={`/article/${leadArticle.id}`} className="block space-y-3">
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xs">
                <img
                  src={leadArticle.imageUrl}
                  alt={leadArticle.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#1642D0] font-sans">
                  {leadArticle.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all leading-snug">
                  {leadArticle.title}
                </h3>
                <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 pt-1">
                  BY {leadArticle.author}
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column: Stacked Articles with Right Thumbnails (Matching Screenshot 3) */}
          <div className="lg:col-span-6 space-y-6">
            {rightArticles.map((art, idx) => (
              <Link
                key={art.id}
                href={`/article/${art.id}`}
                className={`group flex items-center justify-between gap-5 pb-6 ${
                  idx < rightArticles.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#1642D0] font-sans block">
                    {art.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all leading-snug line-clamp-3">
                    {art.title}
                  </h3>
                  <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 pt-1">
                    BY {art.author}
                  </div>
                </div>

                <div className="w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
