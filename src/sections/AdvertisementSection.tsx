'use client';

import React from 'react';
import Link from 'next/link';

interface AdvertisementSectionProps {
  label?: string;
  className?: string;
}

export const AdvertisementSection: React.FC<AdvertisementSectionProps> = ({
  label = 'ADVERTISEMENT',
  className = '',
}) => {
  return (
    <section
      aria-label="Advertisement"
      className={`w-full py-8 sm:py-10 flex flex-col items-center justify-center border-b border-slate-200/80 ${className}`}
    >
      {/* 1. Top Type Advertisement Label */}
      <div className="w-full text-center mb-2.5">
        <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-slate-400">
          {label}
        </span>
      </div>

      {/* 2. Inside Box Sized for the Advertisement (matches Image 3) */}
      <div className="w-full max-w-[760px] sm:max-w-[820px] lg:max-w-[880px] mx-auto px-2 sm:px-0">
        <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#0a0f1d] via-[#101935] to-[#0b1329] border border-slate-800 shadow-lg text-white">
          {/* Subtle Decorative Elements */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Ad Content Grid */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-5 sm:p-6 md:p-7 gap-5">
            {/* Left Column: Brand & Copy */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-sans font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  SPECIAL OFFER
                </span>
                <span className="text-slate-400 text-xs font-sans tracking-wide">
                  Entrepreneur+ VIP
                </span>
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold tracking-tight text-white leading-snug mb-1.5">
                Scale Smarter With Proven Playbooks From 500+ Top Founders
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed line-clamp-2 max-w-xl">
                Get unlimited digital magazine editions, exclusive video masterclasses, and actionable growth frameworks.
              </p>
            </div>

            {/* Right Column: CTA & Disclaimer */}
            <div className="flex flex-col items-center md:items-end flex-shrink-0 gap-2">
              <Link
                href="/subscribe"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1642D0] hover:bg-[#1235a8] text-white text-xs sm:text-sm font-sans font-bold tracking-wide uppercase shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 whitespace-nowrap"
              >
                Claim Free Trial
                <svg
                  className="w-4 h-4 ml-2 -mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <span className="text-[10px] text-slate-400 font-sans tracking-wider">
                Cancel anytime • No commitment
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
