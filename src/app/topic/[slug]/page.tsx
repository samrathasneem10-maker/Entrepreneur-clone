'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { getTopicDataBySlug } from '@/data/newsData';

export default function DynamicTopicPage() {
  const params = useParams();
  const rawSlug = typeof params?.slug === 'string' ? params.slug : 'thought-leaders';
  const topicData = getTopicDataBySlug(rawSlug);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* 1. Header Navigation */}
      <Header />

      {/* Breadcrumb Bar matching Image 1 */}
      <div className="bg-white border-b border-slate-200/80 py-2.5 px-5 lg:px-10 text-xs text-slate-600 font-sans">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-[#1642D0] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold uppercase tracking-wider">
            {topicData.title || 'ECONOMY'}
          </span>
        </div>
      </div>

      {/* Top Advertisement Banner: Double size solid rectangle matching Image 3 */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pt-6 pb-6">
        <div className="w-full max-w-[728px] sm:max-w-[760px] mx-auto min-h-[96px] sm:min-h-[110px] bg-[#edf2f7] border border-slate-300 flex items-center justify-center text-center shadow-2xs">
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-500">
            ADVERTISEMENT
          </span>
        </div>
      </div>

      {/* Main Hero Story: Full width image + THOUGHT LEADERS + Full length bold heading + 2-line summary */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pb-8">
        {/* Full width hero image matching Image 3 */}
        <div className="w-full overflow-hidden bg-slate-100">
          <img
            src="/images/topic-hero-leaders.jpg"
            alt="How Great Leaders Build Teams That Thrive"
            className="w-full h-auto max-h-[460px] object-cover"
          />
        </div>

        {/* Story details */}
        <div className="pt-4">
          <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans block mb-1">
            THOUGHT LEADERS
          </span>

          {/* Full length bold heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-serif font-black text-[#020618] leading-[1.14] tracking-tight my-2">
            How Great Leaders Build Teams That Thrive
          </h1>

          {/* 2-paragraph / line summary with space from heading but no gap between paragraphs */}
          <div className="font-serif text-slate-600 text-sm sm:text-[15.5px] leading-snug space-y-0.5 max-w-4xl mt-2">
            <p className="my-0">
              Strong leadership isn&apos;t just about making decisions —
            </p>
            <p className="my-0">
              it&apos;s about creating an environment where people can grow, contribute and succeed.
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Sub-Featured Cards matching Image 3 */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <article className="group flex flex-col items-start text-left">
            <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 mb-3.5">
              <img
                src="/images/topic-sub-1.jpg"
                alt="The Power of Effective Communication in Leadership"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans mb-1 block">
              THOUGHT LEADERS
            </span>
            <h2 className="font-serif font-bold text-lg sm:text-[21px] text-[#020618] leading-snug group-hover:underline decoration-1 underline-offset-2 my-1.5">
              <Link href="/article/power-of-effective-communication-leadership">
                The Power of Effective Communication in Leadership
              </Link>
            </h2>
            <div className="font-serif text-slate-600 text-xs sm:text-[13.5px] leading-snug space-y-0.5 mt-1">
              <p className="my-0">Great leaders don&apos;t just give direction —</p>
              <p className="my-0">they listen, inspire and bring people together.</p>
            </div>
          </article>

          {/* Card 2 */}
          <article className="group flex flex-col items-start text-left">
            <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 mb-3.5">
              <img
                src="/images/topic-sub-2.jpg"
                alt="Collaboration Drives Innovation and Growth"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans mb-1 block">
              THOUGHT LEADERS
            </span>
            <h2 className="font-serif font-bold text-lg sm:text-[21px] text-[#020618] leading-snug group-hover:underline decoration-1 underline-offset-2 my-1.5">
              <Link href="/article/collaboration-drives-innovation-growth">
                Collaboration Drives Innovation and Growth
              </Link>
            </h2>
            <div className="font-serif text-slate-600 text-xs sm:text-[13.5px] leading-snug space-y-0.5 mt-1">
              <p className="my-0">When great minds work together,</p>
              <p className="my-0">new ideas turn into real progress.</p>
            </div>
          </article>
        </div>
      </div>

      {/* Bottom Section: Left Stream (3 horizontal articles + << [10] NEXT >>) & Right Sidebar (Ad with X + Laptop image) */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bordered box with 3 horizontal items + pagination */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs">
            <div className="space-y-6 divide-y divide-slate-100">
              {/* Item 1 */}
              <article className="flex gap-4 sm:gap-5 items-start first:pt-0 pt-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden bg-slate-100">
                  <img
                    src="/images/topic-thumb-1.jpg"
                    alt="The Future of Work: Trends Shaping 2025 and Beyond"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-[#1642D0] uppercase tracking-wider font-sans block mb-1">
                    INDUSTRY
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#020618] leading-snug hover:underline my-1">
                    <Link href="/article/future-of-work-trends-2025-beyond">
                      The Future of Work: Trends Shaping 2025 and Beyond
                    </Link>
                  </h3>
                  <p className="font-serif text-slate-600 text-xs sm:text-[12.5px] leading-relaxed line-clamp-2 my-0">
                    From remote work to AI, here&apos;s what&apos;s changing the way we work and do business.
                  </p>
                </div>
              </article>

              {/* Item 2 */}
              <article className="flex gap-4 sm:gap-5 items-start pt-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden bg-slate-100">
                  <img
                    src="/images/topic-thumb-2.jpg"
                    alt="How Technology Is Redefining Modern Business"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-[#1642D0] uppercase tracking-wider font-sans block mb-1">
                    INDUSTRY
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#020618] leading-snug hover:underline my-1">
                    <Link href="/article/how-technology-redefining-modern-business">
                      How Technology Is Redefining Modern Business
                    </Link>
                  </h3>
                  <p className="font-serif text-slate-600 text-xs sm:text-[12.5px] leading-relaxed line-clamp-2 my-0">
                    Innovation, automation and digital tools are creating new opportunities across industries.
                  </p>
                </div>
              </article>

              {/* Item 3 */}
              <article className="flex gap-4 sm:gap-5 items-start pt-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden bg-slate-100">
                  <img
                    src="/images/topic-thumb-3.jpg"
                    alt="Building a More Sustainable Tomorrow"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-[#1642D0] uppercase tracking-wider font-sans block mb-1">
                    INDUSTRY
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#020618] leading-snug hover:underline my-1">
                    <Link href="/article/building-sustainable-tomorrow">
                      Building a More Sustainable Tomorrow
                    </Link>
                  </h3>
                  <p className="font-serif text-slate-600 text-xs sm:text-[12.5px] leading-relaxed line-clamp-2 my-0">
                    Businesses are rethinking their impact — for people, communities and the planet.
                  </p>
                </div>
              </article>
            </div>

            {/* Pagination: << [10] NEXT >> matching Image 3 */}
            <div className="flex items-center justify-center gap-4 pt-8 mt-6 border-t border-slate-100 text-xs font-bold font-sans text-slate-700">
              <button
                type="button"
                className="hover:text-[#1642D0] transition-colors cursor-pointer select-none"
                aria-label="Previous page"
              >
                &laquo;
              </button>
              <div className="w-8 h-8 rounded-full border border-slate-300 text-slate-800 flex items-center justify-center font-bold text-xs bg-slate-50">
                10
              </div>
              <button
                type="button"
                className="hover:text-[#1642D0] transition-colors cursor-pointer uppercase tracking-wider font-bold"
              >
                NEXT
              </button>
              <button
                type="button"
                className="hover:text-[#1642D0] transition-colors cursor-pointer select-none"
                aria-label="Next set"
              >
                &raquo;
              </button>
            </div>
          </div>

          {/* Right Column: Sidebar with Advertisement X box + Laptop Image (TRENDING IN US removed) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Advertisement box with centered X icon matching Image 3 */}
            <div className="w-full min-h-[300px] sm:min-h-[340px] bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-between p-6 text-center">
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-500">
                ADVERTISEMENT
              </span>
              <div className="w-12 h-12 flex items-center justify-center text-slate-400">
                <svg className="w-10 h-10 stroke-slate-300" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div />
            </div>

            {/* Laptop Desk Image matching Image 3 */}
            <div className="w-full overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src="/images/topic-sidebar-laptop.jpg"
                alt="Workspace setup"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}
