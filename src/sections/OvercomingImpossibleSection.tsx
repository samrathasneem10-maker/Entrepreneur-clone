'use client';

import React from 'react';
import Link from 'next/link';

export const OvercomingImpossibleSection: React.FC = () => {
  return (
    <section className="bg-white pt-3 sm:pt-4 md:pt-5 pb-10 md:pb-14 border-b border-slate-200/80 w-full">
      <div className="w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 pb-1">
          <h2 className="my-0 text-[#020618] font-extrabold text-2xl sm:text-3xl lg:text-[32px] font-serif leading-none">
            <Link
              href="/events"
              className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[4px] transition-all"
            >
              Overcoming Impossible Live
            </Link>
          </h2>

          <Link
            href="/events"
            aria-label="Read more about Overcoming Impossible Live"
            className="flex items-center no-underline hover:underline text-xs sm:text-[13px] font-extrabold text-[#020618] uppercase tracking-wider ml-4"
          >
            See All
            <svg aria-hidden="true" fill="currentColor" className="w-5 h-5 fill-current ml-1 text-[#193CB8]" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10m-10 1H8v-2h4V8l4 4-4 4z" />
            </svg>
          </Link>
        </div>

        {/* 2-Column Content Layout: expanded image towards the left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Details, bullets and CTA (6 of 12 columns) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Event Date & Location */}
            <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider font-sans">
              <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
              </svg>
              <span>OCTOBER 23 • BROOKLYN, NY</span>
            </div>

            {/* Title Headline */}
            <h3 className="text-3xl sm:text-4xl lg:text-[36px] xl:text-[38px] font-serif font-bold text-[#020618] leading-[1.24] tracking-tight">
              Ready to Scale? Bring Us Your Biggest Business Problem.
            </h3>

            {/* Description with comfortable line height */}
            <p className="text-slate-700 text-base sm:text-[17px] leading-[1.65] font-serif font-normal">
              This isn't another conference. It's a hands-on workshop. Bring the &ldquo;impossible&rdquo; problem holding your business back — and leave with a clear plan to solve it.
            </p>

            {/* Divider line before features */}
            <div className="pt-4 border-t border-slate-200/80">
              <h4 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-500 font-sans mb-4">
                HERE'S WHAT YOU'LL GET:
              </h4>

              {/* Bullet points list with generous line spacing */}
              <ul className="space-y-3.5 sm:space-y-4 font-serif font-normal text-[15px] sm:text-base text-slate-700 leading-normal">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#193CB8] mt-2 flex-shrink-0" />
                  <span>Hands-on problem-solving with <strong className="text-slate-900 font-bold">Robert Irvine</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#193CB8] mt-2 flex-shrink-0" />
                  <span>A clear, actionable roadmap to scale your business</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#193CB8] mt-2 flex-shrink-0" />
                  <span>Unfiltered insights you can put to work immediately</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#193CB8] mt-2 flex-shrink-0" />
                  <span>Real-time breakthroughs in an intimate, high-impact setting</span>
                </li>
              </ul>
            </div>

            {/* CTA Button: positioned comfortably below the image end line */}
            <div className="pt-6 sm:pt-8">
              <a
                href="#reserve"
                className="inline-block bg-[#1642D0] hover:bg-[#143094] text-white text-sm sm:text-base font-bold px-7 py-3.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Reserve Your Spot
              </a>
            </div>
          </div>

          {/* Right Column: Event Graphic Banner (increased height) */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full aspect-[1.15] sm:aspect-[1.08] xl:aspect-[1.10] max-h-[460px] overflow-hidden rounded-2xl shadow-sm border border-slate-200/80">
              <img
                src="/images/overcoming-impossible-live.png"
                alt="Overcoming Impossible Live - An Entrepreneur Level Up Event"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
