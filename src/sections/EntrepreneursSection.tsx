'use client';

import React from 'react';
import Link from 'next/link';

export const EntrepreneursSection: React.FC = () => {
  const leadArticle = {
    id: 'universities-face-budget-squeeze',
    category: 'ENTREPRENEURS',
    title: 'Universities Face a Budget Squeeze. Cutting Spending Is Only Part of the Answer.',
    excerpt: "Budget cuts aren't new to higher education, but today's financial pressures are reshaping academic programs, staffing and student services, raising questions about long-term sustainability.",
    author: 'ASHISH FERNANDO',
    authorSlug: 'ashish-fernando',
    imageUrl: '/images/university-budget-cuts.jpg',
    remoteImageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/10/university-budget-cuts-1026_g2252192638.jpg?resize=500,282',
  };

  const rightArticles = [
    {
      id: '5-magic-phrases-to-be-more-likable',
      category: 'ENTREPRENEURS',
      title: 'Want to Be More Likable? Just Say These 5 Magic Phrases.',
      author: 'VANESSA VAN EDWARDS',
      authorSlug: 'vanessa-van-edwards',
      imageUrl: '/images/vanessa-van-edwards.jpg',
      remoteImageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/10/Vanessa-Van-Edwards_Maggie-Kirkland-.jpg?resize=150,150',
    },
    {
      id: 'why-high-performers-leave',
      category: 'THOUGHT LEADERS',
      title: "Why High Performers Leave Before You Know They're Gone",
      author: 'GLORIA ST. MARTIN-LOWRY',
      authorSlug: 'gloria-st-martin-lowry',
      imageUrl: '/images/top-performers-leave.jpg',
      remoteImageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/09/1790782535-top-performers-leave-before-theyre-gone-0926-g2222113062.jpg?resize=150,150',
    },
    {
      id: 'college-admissions-red-flag-word',
      category: 'ENTREPRENEURS',
      title: 'After 35 Years in the College Admissions Business, 1 Red-Flag Word Is Popping Up More Than Ever',
      author: 'BRIAN TAYLOR',
      authorSlug: 'brian-taylor',
      imageUrl: '/images/college-admissions.jpg',
      remoteImageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/10/college-admissions-0926-g1060184852.jpg?resize=150,150',
    },
  ];

  return (
    <section className="bg-white pt-10 md:pt-12 pb-10 md:pb-12 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none tracking-tight">
            <Link
              href="/topic/entrepreneurs"
              className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[4px] transition-all"
            >
              Entrepreneurs
            </Link>
          </h2>

          <Link
            href="/topic/entrepreneurs"
            aria-label="Read more about Entrepreneurs"
            className="flex items-center no-underline hover:underline text-xs sm:text-[13px] font-bold text-[#020618] uppercase tracking-wider group"
          >
            <span>See All</span>
            <svg
              aria-hidden="true"
              fill="currentColor"
              className="w-5 h-5 fill-current ml-1 text-[#1642D0] group-hover:scale-105 transition-transform"
              viewBox="0 0 24 24"
            >
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10m-10 1H8v-2h4V8l4 4-4 4z" />
            </svg>
          </Link>
        </div>

        {/* 2-Column Layout: Left and Right sides stretch to the exact same baseline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Lead Story ending on the same baseline */}
          <div className="group flex flex-col justify-between h-full">
            <div>
              {/* Lead Image */}
              <Link href={`/article/${leadArticle.id}`} className="block">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-slate-200/90 shadow-2xs">
                  <img
                    src={leadArticle.imageUrl}
                    alt={leadArticle.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = leadArticle.remoteImageUrl;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Lead Story Details */}
              <div className="pt-3.5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1642D0] font-sans block">
                  {leadArticle.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] leading-snug tracking-tight">
                  <Link
                    href={`/article/${leadArticle.id}`}
                    className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all"
                  >
                    {leadArticle.title}
                  </Link>
                </h3>

                {/* Normal font weight excerpt */}
                <p className="text-sm sm:text-[15px] font-sans font-normal text-slate-600 leading-relaxed pt-0.5">
                  {leadArticle.excerpt}
                </p>
              </div>
            </div>

            {/* Byline ending at the exact same horizontal line as the right column */}
            <div className="text-xs font-sans uppercase tracking-wider pt-4 pb-1 flex items-center gap-1">
              <span className="text-slate-500 font-semibold">BY</span>
              <Link
                href={`/author/${leadArticle.authorSlug}`}
                className="text-[#1642D0] font-bold underline decoration-[#1642D0] underline-offset-2 hover:text-blue-800 transition-colors"
              >
                {leadArticle.author}
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Stacked Stories - Every story including 3rd has border-b */}
          <div className="flex flex-col justify-between h-full space-y-4 sm:space-y-5">
            {rightArticles.map((art) => (
              <div
                key={art.id}
                className="group flex items-start justify-between gap-4 sm:gap-6 pb-4 sm:pb-5 border-b border-slate-200"
              >
                {/* Left Text Block */}
                <div className="flex-1 space-y-1.5 pr-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1642D0] font-sans block">
                    {art.category}
                  </span>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#020618] leading-snug tracking-tight">
                    <Link
                      href={`/article/${art.id}`}
                      className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all"
                    >
                      {art.title}
                    </Link>
                  </h3>

                  {/* Byline */}
                  <div className="text-xs font-sans uppercase tracking-wider pt-1 flex items-center gap-1">
                    <span className="text-slate-500 font-semibold">BY</span>
                    <Link
                      href={`/author/${art.authorSlug}`}
                      className="text-[#1642D0] font-bold underline decoration-[#1642D0] underline-offset-2 hover:text-blue-800 transition-colors"
                    >
                      {art.author}
                    </Link>
                  </div>
                </div>

                {/* Right Thumbnail */}
                <Link
                  href={`/article/${art.id}`}
                  className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200/90 shadow-2xs block"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = art.remoteImageUrl;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
