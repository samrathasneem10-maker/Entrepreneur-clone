'use client';

import React from 'react';
import Link from 'next/link';

export const FranchiseSection: React.FC = () => {
  const editorialItems = [
    {
      id: 'fastest-growing',
      title: 'Fastest-Growing Franchises',
      underlined: true,
      description: 'Meet the companies scaling quickly across the U.S. and Canada in our annual ranking.',
      icon: (
        <svg
          className="w-4 h-4 inline-block mr-2 -mt-0.5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#94A3B8" strokeWidth="1.5" />
          <polyline points="7 15 12 10 17 14" stroke="#EF4444" strokeWidth="2.2" />
          <polyline points="14 7 17 7 17 10" stroke="#EF4444" strokeWidth="2.2" />
        </svg>
      ),
    },
    {
      id: 'top-emerging',
      title: 'Top New & Emerging Franchises',
      underlined: false,
      description: 'Get in on the ground floor with top companies franchising for five years or less.',
      icon: (
        <svg
          className="w-4 h-4 inline-block mr-2 -mt-0.5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" stroke="#0284C7" strokeWidth="1.8" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" stroke="#10B981" strokeWidth="1.8" />
          <path d="M2 12h20" stroke="#0284C7" strokeWidth="1.8" />
        </svg>
      ),
    },
    {
      id: 'under-50k',
      title: 'Top Franchises for Less Than $50,000',
      underlined: false,
      description: 'Looking for a franchise on a budget? Explore top options under $50,000.',
      icon: (
        <svg
          className="w-4 h-4 inline-block mr-2 -mt-0.5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" fill="#F59E0B" />
          <rect x="2" y="9" width="20" height="3" fill="#0F172A" />
          <rect x="5" y="14" width="3" height="2" rx="0.5" fill="#FEF3C7" />
        </svg>
      ),
    },
  ];

  const supplierCategories = [
    {
      title: 'Accounting',
      ranked: '20 ranked',
      logo: '/images/supplier-accounting.png',
    },
    {
      title: 'Legal',
      ranked: '20 ranked',
      logo: '/images/supplier-legal.png',
    },
    {
      title: 'Banking',
      ranked: '10 ranked',
      logo: '/images/supplier-banking.png',
    },
    {
      title: 'Real Estate',
      ranked: '10 ranked',
      logo: '/images/supplier-realestate.png',
    },
  ];

  const postBoxArticles = [
    {
      id: 'franchise-500-less-than-25k',
      underlined: true,
      titleJsx: (
        <>
          The Top Franchise 500-Ranked<br className="hidden sm:inline" /> Businesses You Can Launch for Less<br className="hidden sm:inline" /> Than $25,000 in 2026
        </>
      ),
      descriptionJsx: (
        <>
          These brands prove you don&apos;t need a lot of capital to<br className="hidden sm:inline" /> become a business owner in 2026.
        </>
      ),
      imageUrl: '/images/franchise-cleaning-worker.png',
      alt: 'The Top Franchise 500-Ranked Businesses You Can Launch for Less Than $25,000 in 2026',
    },
    {
      id: 'who-needs-storefront-mobile-truck',
      underlined: false,
      titleJsx: (
        <>
          Who Needs a Storefront? These 5 Mobile<br className="hidden sm:inline" /> Truck Franchises Don&apos;t.
        </>
      ),
      descriptionJsx: (
        <>
          From tool trucks and shaved ice to moving services,<br className="hidden sm:inline" /> these franchises prove you don&apos;t need a brick-and-<br className="hidden sm:inline" />mortar location to build a scalable business.
        </>
      ),
      imageUrl: '/images/franchise-mobile-truck.png',
      alt: "Who Needs a Storefront? These 5 Mobile Truck Franchises Don't.",
    },
    {
      id: '150-billion-pet-industry-booming',
      underlined: false,
      titleJsx: (
        <>
          The $150 Billion Pet Industry Is Booming<br className="hidden sm:inline" /> &mdash; These 5 Franchises Are Cashing In
        </>
      ),
      descriptionJsx: (
        <>
          Pet care is one of the fastest-growing franchise<br className="hidden sm:inline" /> categories in 2026. See which brands are ranked on<br className="hidden sm:inline" /> this year&apos;s Franchise 500.
        </>
      ),
      imageUrl: '/images/franchise-pet-grooming.png',
      alt: 'The $150 Billion Pet Industry Is Booming — These 5 Franchises Are Cashing In',
    },
  ];

  return (
    <section className="bg-white pt-2 pb-12 md:pb-16 border-b border-slate-200 w-full">
      <div className="w-full">
        {/* Section Heading: NO line above, NO line below, matching reference screenshot */}
        <div className="mb-6">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none tracking-tight">
            <Link href="/topic/franchises" className="hover:underline">
              Franchise Lists
            </Link>
          </h2>
        </div>

        {/* 3 Editorial Items Outside Box (Clean typography, no card boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-10 items-start">
          {editorialItems.map((item) => (
            <div key={item.id} className="space-y-1">
              <h3 className="text-base sm:text-[17px] font-serif font-bold text-[#020618] leading-snug">
                <Link
                  href="/topic/franchises"
                  className={`text-[#020618] hover:text-[#1642D0] transition-colors inline-flex items-center ${
                    item.underlined
                      ? 'underline decoration-[#020618] decoration-1 underline-offset-[3px]'
                      : 'hover:underline'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 font-serif leading-relaxed m-0">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Large Blue Box: Top Franchise Suppliers */}
        <div className="w-full bg-[#193cb8] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-md text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Side: Authentic Logo Lockup, Description & Explore Button */}
            <div className="lg:col-span-5 flex flex-col items-center text-center justify-center">
              {/* Exact High-Resolution Logo Lockup: Entrepreneur + TOP FRANCHISE SUPPLIERS ═ 2026 ═ */}
              <div className="w-full max-w-[270px] sm:max-w-[290px] mx-auto mb-2 flex items-center justify-center">
                <img
                  src="/images/top-franchise-suppliers-logo.png"
                  alt="Entrepreneur Top Franchise Suppliers 2026"
                  className="w-full h-auto object-contain block select-none pointer-events-none"
                />
              </div>

              {/* Exact 3-line formatted serif description */}
              <p className="text-white text-xs sm:text-[13.5px] font-serif leading-relaxed text-center max-w-[270px] mx-auto mb-5 text-white/95">
                Explore the companies helping<br />
                franchise systems operate, grow, and<br />
                scale.
              </p>

              {/* Explore the list button: White by default, Black on cursor hover */}
              <Link
                href="/topic/franchises"
                className="px-6 py-2.5 rounded-md bg-white text-[#020618] hover:bg-[#020618] hover:text-white font-bold text-xs sm:text-[13px] font-sans transition-all duration-200 inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Explore the list</span>
                <span className="text-sm font-bold leading-none">→</span>
              </Link>
            </div>

            {/* Right Side: 2x2 Grid of 4 Darker Blue Supplier Category Cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {supplierCategories.map((cat) => (
                  <Link
                    key={cat.title}
                    href="/topic/franchises"
                    className="bg-[#1c398e] hover:bg-[#152e72] border border-white/10 rounded-xl p-4 sm:p-5 flex items-center justify-between transition-all duration-200 group cursor-pointer shadow-xs"
                  >
                    <div>
                      {/* Bold Sans-serif Title */}
                      <h4 className="font-sans font-bold text-base sm:text-[17px] text-white leading-tight m-0 group-hover:underline">
                        {cat.title}
                      </h4>
                      {/* Sans-serif Italic for ranked count (matching exact reference font family) */}
                      <p className="font-sans italic text-xs sm:text-[13px] text-white/90 mt-1.5 mb-0">
                        {cat.ranked}
                      </p>
                    </div>

                    {/* Circular White Badge with Authentic Supplier Logo */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center p-1.5 shadow-xs flex-shrink-0">
                      <img
                        src={cat.logo}
                        alt={cat.title}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 3 Featured Articles Below Blue Box with Radius Rectangle & Exact Line Breaks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10 sm:mt-12 items-start">
          {postBoxArticles.map((art) => (
            <article key={art.id} className="group space-y-3">
              {/* Radius Rectangle Image Container with rounded-xl */}
              <Link href={`/article/${art.id}`} className="block overflow-hidden rounded-xl">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-slate-200/80 shadow-2xs">
                  <img
                    src={art.imageUrl}
                    alt={art.alt}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 rounded-xl"
                  />
                </div>
              </Link>

              {/* Exact Bold Title Lines and Serif Paragraph Lines */}
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-base sm:text-[17px] text-[#020618] leading-[1.3] m-0">
                  <Link
                    href={`/article/${art.id}`}
                    className={`text-[#020618] hover:text-[#1642D0] transition-colors ${
                      art.underlined
                        ? 'underline decoration-[#020618] decoration-1 underline-offset-[3px]'
                        : 'hover:underline'
                    }`}
                  >
                    {art.titleJsx}
                  </Link>
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 font-serif leading-relaxed m-0">
                  {art.descriptionJsx}
                </p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
