'use client';

import React from 'react';
import Link from 'next/link';

export const TransformAISection: React.FC = () => {
  const cards = [
    {
      id: 'rushing-to-add-ai',
      category: 'BUILDING A BUSINESS',
      title: 'Rushing to Add AI Is Wrecking Your Customer Experience. Here\'s How to Get It Right.',
      excerpt: 'Every new AI tool creates another touchpoint with your customer. If those tools don\'t talk to each other, neither does your business.',
      author: 'DAVID BOICE',
      authorSlug: 'david-boice',
      imageUrl: '/images/rushing-ai-cx.jpg',
      remoteImageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/08/1787243973-rushing-ai-customer-experience-0826-g2290165837.jpg?resize=500,282',
    },
    {
      id: 'why-coding-agents-work',
      category: 'TECH',
      title: 'Why Coding Agents Work and Go-to-Market Agents Don\'t (Yet)',
      excerpt: 'Coding agents are transforming software teams overnight, but GTM agents are stuck. It\'s not an intelligence problem — it\'s a context problem.',
      author: 'HENRY SCHUCK',
      authorSlug: 'henry-schuck',
      imageUrl: '/images/coding-agents.jpg',
      remoteImageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/08/coding-agents-0826-g-1197242234.jpg?resize=500,282',
    },
    {
      id: 'how-ai-agents-scale-marketing',
      category: 'TECH',
      title: 'How AI Agents Are Helping Companies Scale Their Marketing',
      excerpt: 'Here\'s how AI agents can help companies scale marketing by combining skills, tools and context into an agentic marketing operating model.',
      author: 'NURI CANKAYA',
      authorSlug: 'nuri-cankaya',
      imageUrl: '/images/ai-marketing-agents.jpg',
      remoteImageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/10/ai-agent-marketing-engine-1026_g2260005104.jpg?resize=500,282',
    },
  ];

  return (
    <section className="bg-white pt-10 md:pt-12 pb-10 md:pb-12 w-full">
      <div className="w-full">
        
        {/* Section Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-tight tracking-tight">
              <Link
                href="/topic/ai"
                className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[4px] transition-all"
              >
                Transform Your Business with Agentic AI
              </Link>
            </h2>
            <div className="text-xs sm:text-sm text-slate-500 font-sans italic pt-1.5">
              Presented by Sapphire Reserve for Business
            </div>
          </div>

          <Link
            href="/topic/ai"
            aria-label="Read more about Agentic AI"
            className="flex items-center no-underline hover:underline text-xs sm:text-[13px] font-bold text-[#020618] uppercase tracking-wider group flex-shrink-0 pt-1"
          >
            <span>See All</span>
            <svg
              aria-hidden="true"
              fill="currentColor"
              className="w-5 h-5 fill-current ml-1.5 text-[#1642D0] group-hover:scale-105 transition-transform"
              viewBox="0 0 24 24"
            >
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10m-10 1H8v-2h4V8l4 4-4 4z" />
            </svg>
          </Link>
        </div>

        {/* 3-Column Cards Grid matching Reference Image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {cards.map((card) => (
            <div key={card.id} className="group flex flex-col">
              
              {/* Card Image */}
              <Link href={`/article/${card.id}`} className="block">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-slate-200/90 shadow-2xs">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = card.remoteImageUrl;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Card Content */}
              <div className="pt-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1642D0] font-sans block mb-1">
                    {card.category}
                  </span>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#020618] leading-snug tracking-tight mb-2">
                    <Link
                      href={`/article/${card.id}`}
                      className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all"
                    >
                      {card.title}
                    </Link>
                  </h3>

                  {/* Under Paragraph (Normal font weight text) */}
                  <p className="text-xs sm:text-sm font-serif font-normal text-slate-700 leading-relaxed mb-3">
                    {card.excerpt}
                  </p>
                </div>

                {/* Byline */}
                <div className="text-xs font-sans uppercase tracking-wider pt-1 flex items-center gap-1">
                  <span className="text-slate-500 font-semibold">BY</span>
                  <Link
                    href={`/author/${card.authorSlug}`}
                    className="text-[#1642D0] font-bold underline decoration-[#1642D0] underline-offset-2 hover:text-blue-800 transition-colors"
                  >
                    {card.author}
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Advertisement Banner matching Image 2 style with Image 1 dimensions */}
        <div className="mt-8 sm:mt-10 md:mt-12 w-full text-center">
          <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400 block mb-2">
            ADVERTISEMENT
          </span>
          <div
            style={{ aspectRatio: '1346 / 520' }}
            className="w-full bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-center p-6 text-center shadow-2xs"
          >
            <span className="text-sm sm:text-base md:text-lg font-semibold text-slate-600 font-sans">
              1346 × 520 Banner
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5 sm:mt-1">
              Your Advertisement Here
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
