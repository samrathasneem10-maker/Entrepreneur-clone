'use client';

import React from 'react';
import Link from 'next/link';

export const BusinessCategoryCards: React.FC = () => {
  return (
    <section className="bg-white py-10 md:py-14 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Section Heading: Categories */}
        <div className="border-t border-slate-200 pt-3 pb-2 mb-6 sm:mb-8">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none tracking-tight">
            <Link
              href="/topic/categories"
              className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[4px] transition-all"
            >
              Categories
            </Link>
          </h2>
        </div>

        {/* 3 Main Columns: Leadership, Business Ideas, Technology */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start">
          
          {/* COLUMN 1: Leadership */}
          <div className="flex flex-col">
            <h3 className="text-xl sm:text-2xl lg:text-[26px] font-serif font-bold text-[#020618] mb-3 leading-snug">
              <Link href="/topic/leadership" className="hover:underline">
                Leadership
              </Link>
            </h3>

            {/* Row 1: Featured Article with Image & Bold Big Title */}
            <article className="group">
              <Link href="/topic/leadership" className="block overflow-hidden rounded-xl">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-slate-200/80 shadow-2xs">
                  <img
                    src="/images/category-leadership.png"
                    alt="An Introvert's Case for Skipping Small Talk and Building Real Connections"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 rounded-xl"
                  />
                </div>
              </Link>

              <div className="mt-3">
                <Link
                  href="/article/not-every-boss-deserves-a-thank-you-card"
                  className="text-xs font-bold font-sans text-[#1642D0] uppercase tracking-wider block mb-1 hover:underline"
                >
                  BUILDING A BUSINESS
                </Link>
                <h4 className="text-base sm:text-[17px] font-serif font-bold text-[#020618] leading-[1.3] m-0">
                  <Link href="/topic/leadership" className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors">
                    An Introvert&apos;s Case for Skipping Small Talk and Building Real Connections
                  </Link>
                </h4>
              </div>
            </article>

            {/* Divider Line 1 */}
            <div className="border-t border-slate-200 my-4" />

            {/* Row 2: Medium Title Article */}
            <article className="group">
              <Link
                href="/article/not-every-boss-deserves-a-thank-you-card"
                className="text-xs font-bold font-sans text-[#1642D0] uppercase tracking-wider block mb-1 hover:underline"
              >
                BUILDING A BUSINESS
              </Link>
              <h4 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.3] m-0">
                <Link
                  href="/article/not-every-boss-deserves-a-thank-you-card"
                  className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors"
                >
                  Not Every Boss Deserves a Thank-You Card. Here&apos;s What to Do When Your Boss Is a Bully.
                </Link>
              </h4>
            </article>

            {/* Divider Line 2 */}
            <div className="border-t border-slate-200 my-4" />

            {/* Row 3: Final Row Article */}
            <article className="group">
              <span className="text-xs font-bold font-sans text-[#1642D0] uppercase tracking-wider block mb-1">
                BUSINESS NEWS
              </span>
              <h4 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.3] m-0">
                <Link href="/topic/leadership" className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors">
                  He Leads a $240 Billion Food Giant. Here&apos;s the Difficult Management Rule He Follows.
                </Link>
              </h4>
            </article>

            {/* Divider Line After Final Row */}
            <div className="border-t border-slate-200 my-4" />
          </div>

          {/* COLUMN 2: Business Ideas */}
          <div className="flex flex-col">
            <h3 className="text-xl sm:text-2xl lg:text-[26px] font-serif font-bold text-[#020618] mb-3 leading-snug">
              <Link href="/topic/business-ideas" className="hover:underline">
                Business Ideas
              </Link>
            </h3>

            {/* Row 1: Featured Article with Image, Bold Big Title & Register Now Button */}
            <article className="group">
              <Link href="/topic/business-ideas" className="block overflow-hidden rounded-xl">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-slate-200/80 shadow-2xs">
                  <img
                    src="/images/category-business-ideas.png"
                    alt="How to Know If Your Business Idea Will Actually Work"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 rounded-xl"
                  />
                </div>
              </Link>

              <div className="mt-3">
                <span className="text-xs font-bold font-sans text-[#1642D0] uppercase tracking-wider block mb-1">
                  BUILDING A BUSINESS | THURSDAY, OCTOBER 15 AT 2PM EDT
                </span>
                <h4 className="text-base sm:text-[17px] font-serif font-bold text-[#020618] leading-[1.3] m-0">
                  <Link href="/topic/business-ideas" className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors">
                    How to Know If Your Business Idea Will Actually Work
                  </Link>
                </h4>

                {/* Middle Blue Register Now Button */}
                <div className="mt-3">
                  <Link
                    href="/topic/business-ideas"
                    className="px-5 py-2 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs sm:text-[13px] font-sans rounded-[4px] transition-colors inline-block shadow-xs cursor-pointer"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </article>

            {/* Divider Line 1 */}
            <div className="border-t border-slate-200 my-4" />

            {/* Row 2: Medium Title Article */}
            <article className="group">
              <span className="text-xs font-bold font-sans text-[#1642D0] uppercase tracking-wider block mb-1">
                BUILDING A BUSINESS
              </span>
              <h4 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.3] m-0">
                <Link href="/topic/business-ideas" className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors">
                  That Business Idea You Couldn&apos;t Justify Years Ago Is Worth Revisiting, Thanks to AI
                </Link>
              </h4>
            </article>

            {/* Divider Line 2 */}
            <div className="border-t border-slate-200 my-4" />

            {/* Row 3: Final Row Article */}
            <article className="group">
              <span className="text-xs font-bold font-sans text-[#1642D0] uppercase tracking-wider block mb-1">
                TECH
              </span>
              <h4 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.3] m-0">
                <Link href="/topic/business-ideas" className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors">
                  Replace Hours of Typing and Capture Ideas Faster with a $60 Lifetime Dictation Tool
                </Link>
              </h4>
            </article>

            {/* Divider Line After Final Row */}
            <div className="border-t border-slate-200 my-4" />
          </div>

          {/* COLUMN 3: Technology */}
          <div className="flex flex-col">
            <h3 className="text-xl sm:text-2xl lg:text-[26px] font-serif font-bold text-[#020618] mb-3 leading-snug">
              <Link href="/topic/technology" className="hover:underline">
                Technology
              </Link>
            </h3>

            {/* Row 1: Featured Article with Image & Bold Big Title */}
            <article className="group">
              <Link href="/topic/technology" className="block overflow-hidden rounded-xl">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-slate-200/80 shadow-2xs">
                  <img
                    src="/images/category-technology.png"
                    alt="How AI Is Helping Companies Catch Performance Issues Before They Turn Into Major Incidents"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 rounded-xl"
                  />
                </div>
              </Link>

              <div className="mt-3">
                <span className="text-xs font-bold font-sans text-[#1642D0] uppercase tracking-wider block mb-1">
                  TECH
                </span>
                <h4 className="text-base sm:text-[17px] font-serif font-bold text-[#020618] leading-[1.3] m-0">
                  <Link href="/topic/technology" className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors">
                    How AI Is Helping Companies Catch Performance Issues Before They Turn Into Major Incidents
                  </Link>
                </h4>
              </div>
            </article>

            {/* Divider Line 1 */}
            <div className="border-t border-slate-200 my-4" />

            {/* Row 2: Medium Title Article */}
            <article className="group">
              <span className="text-xs font-bold font-sans text-[#1642D0] uppercase tracking-wider block mb-1">
                TECH
              </span>
              <h4 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.3] m-0">
                <Link href="/topic/technology" className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors">
                  Meta&apos;s Muse Wants to Own the Moment Before the Purchase
                </Link>
              </h4>
            </article>

            {/* Divider Line 2 */}
            <div className="border-t border-slate-200 my-4" />

            {/* Row 3: Final Row Article */}
            <article className="group">
              <span className="text-xs font-bold font-sans text-[#1642D0] uppercase tracking-wider block mb-1">
                BUILDING A BUSINESS
              </span>
              <h4 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.3] m-0">
                <Link href="/topic/technology" className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors">
                  AI Has Turned Software Security Into a Race You Can&apos;t Afford to Lose
                </Link>
              </h4>
            </article>

            {/* Divider Line After Final Row */}
            <div className="border-t border-slate-200 my-4" />
          </div>

        </div>

      </div>
    </section>
  );
};
