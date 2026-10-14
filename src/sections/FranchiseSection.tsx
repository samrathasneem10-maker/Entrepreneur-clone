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
            
            {/* Left Side: Logo, Title, Year double-lines, Description & Explore Button */}
            <div className="lg:col-span-5 flex flex-col items-center text-center justify-center">
              {/* Entrepreneur Italic Serif Logo */}
              <span className="font-serif italic text-3xl sm:text-4xl text-white font-normal block leading-tight">
                Entrepreneur
              </span>

              {/* Bold Uppercase Titles */}
              <div className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight text-white mt-1 leading-none">
                TOP FRANCHISE
              </div>
              <div className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight text-white mt-1 leading-none">
                SUPPLIERS
              </div>

              {/* Double Line ═ 2026 ═ */}
              <div className="flex items-center justify-center gap-2.5 my-3 text-white">
                <div className="flex flex-col gap-0.5 w-7 sm:w-9">
                  <div className="h-[1.5px] bg-white w-full"></div>
                  <div className="h-[1.5px] bg-white w-full"></div>
                </div>
                <span className="font-sans font-bold text-sm sm:text-base tracking-widest leading-none">
                  2026
                </span>
                <div className="flex flex-col gap-0.5 w-7 sm:w-9">
                  <div className="h-[1.5px] bg-white w-full"></div>
                  <div className="h-[1.5px] bg-white w-full"></div>
                </div>
              </div>

              {/* Descriptive text */}
              <p className="text-white text-xs sm:text-[13px] font-serif leading-relaxed text-center max-w-xs mx-auto mb-5 opacity-95">
                Explore the companies helping franchise systems operate, grow, and scale.
              </p>

              {/* Explore the list button: White by default, Black on cursor hover */}
              <Link
                href="/topic/franchises"
                className="px-6 py-2.5 rounded-lg bg-white text-[#020618] hover:bg-[#020618] hover:text-white font-bold text-xs sm:text-sm font-sans transition-all duration-200 inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Explore the list</span>
                <span className="text-base leading-none">→</span>
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
                      <h4 className="font-sans font-bold text-base sm:text-[17px] text-white leading-tight m-0 group-hover:underline">
                        {cat.title}
                      </h4>
                      <p className="font-serif italic text-xs sm:text-[13px] text-blue-100/90 mt-1 mb-0">
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

      </div>
    </section>
  );
};
