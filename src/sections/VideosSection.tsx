'use client';

import React from 'react';
import Link from 'next/link';

export const VideosSection: React.FC = () => {
  const videos = [
    {
      id: 'two-friends-quit-blue-collar-jobs-bbq',
      imageUrl: '/images/latest-video-1.png',
      alt: 'These 2 Friends Quit Their Blue-Collar Jobs to Sell BBQ',
      titleJsx: (
        <>
          These 2 Friends Quit Their Blue-Collar<br className="hidden sm:inline" /> Jobs to Sell BBQ. They Weren&apos;t Making<br className="hidden sm:inline" /> Money Until They Broke Every Rule<br className="hidden sm:inline" /> About How BBQ Should Taste.
        </>
      ),
      descriptionJsx: (
        <>
          They spent years selling food on weekends while<br className="hidden sm:inline" /> working day jobs. When they finally quit everything,<br className="hidden sm:inline" /> they made a bet most people told them was wrong.
        </>
      ),
    },
    {
      id: 'cash-only-no-reservations-robkes',
      imageUrl: '/images/latest-video-2.png',
      alt: 'Cash Only. No Reservations. No Problem: Why This Long Island Restaurant Thrives by Saying No',
      titleJsx: (
        <>
          Cash Only. No Reservations. No<br className="hidden sm:inline" /> Problem: Why This Long Island<br className="hidden sm:inline" /> Restaurant Thrives by Saying No
        </>
      ),
      descriptionJsx: (
        <>
          Step inside Robke&apos;s to learn how a beloved business<br className="hidden sm:inline" /> earned the kind of loyalty that lets it make its own<br className="hidden sm:inline" /> rules.
        </>
      ),
    },
    {
      id: 'pizza-king-66-restaurants-challenge',
      imageUrl: '/images/latest-video-3.png',
      alt: 'He Runs 66 Pizza Restaurants. This Is His Biggest Challenge — And How He Handles It.',
      titleJsx: (
        <>
          He Runs 66 Pizza Restaurants. This Is<br className="hidden sm:inline" /> His Biggest Challenge &mdash; And How He<br className="hidden sm:inline" /> Handles It.
        </>
      ),
      descriptionJsx: (
        <>
          Pizza King co-owner Ed Bogan shares how he<br className="hidden sm:inline" /> maintains consistency across 66 locations.
        </>
      ),
    },
    {
      id: 'google-employee-easy-ways-traffic-free',
      imageUrl: '/images/latest-video-4.png',
      alt: 'A Google Employee Shares 2 Easy Ways Business Owners Can Get More Traffic For Free',
      titleJsx: (
        <>
          A Google Employee Shares 2 Easy Ways<br className="hidden sm:inline" /> Business Owners Can Get More Traffic<br className="hidden sm:inline" /> For Free
        </>
      ),
      descriptionJsx: (
        <>
          A simple, zero-dollar strategy you can implement<br className="hidden sm:inline" /> today to expand your company&apos;s digital visibility.
        </>
      ),
    },
    {
      id: 'irelands-most-ambitious-restaurants',
      imageUrl: '/images/latest-video-5.png',
      alt: "He Built One of Ireland's Most Ambitious Restaurants. His Best Customer Satisfaction Tip Starts With a...",
      titleJsx: (
        <>
          He Built One of Ireland&apos;s Most<br className="hidden sm:inline" /> Ambitious Restaurants. His Best<br className="hidden sm:inline" /> Customer Satisfaction Tip Starts With a...
        </>
      ),
      descriptionJsx: (
        <>
          Inside the intense, perfectionist culture driving one of<br className="hidden sm:inline" /> Dublin&apos;s top culinary success stories.
        </>
      ),
    },
    {
      id: 'insane-business-rule-stops-growth',
      imageUrl: '/images/latest-video-6.png',
      alt: "You Probably Follow This Typical But 'Insane' Business Rule That Stops Growth, Says CEO Who's Building for...",
      titleJsx: (
        <>
          You Probably Follow This Typical But<br className="hidden sm:inline" /> &lsquo;Insane&rsquo; Business Rule That Stops<br className="hidden sm:inline" /> Growth, Says CEO Who&apos;s Building for...
        </>
      ),
      descriptionJsx: (
        <>
          How conventional wisdom often leads companies into<br className="hidden sm:inline" /> stagnation instead of sustainable scalability.
        </>
      ),
    },
  ];

  return (
    <section className="bg-white py-10 md:py-12 w-full">
      <div className="w-full">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            <Link href="/videos" className="hover:text-[#1642D0] transition-colors">
              Latest Videos
            </Link>
          </h2>

          <Link
            href="/videos"
            className="inline-flex items-center gap-2 group text-xs sm:text-sm font-sans font-bold tracking-wider uppercase text-slate-800 hover:text-[#1642D0] transition-colors"
          >
            <span>SEE ALL</span>
            <span className="w-5 h-5 sm:w-6 sm:h-6 bg-[#1642D0] group-hover:bg-[#1235a8] text-white flex items-center justify-center rounded transition-colors shadow-sm">
              <svg
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>

        {/* 6 Video Cards Grid (3 columns x 2 rows) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 gap-y-8 sm:gap-y-10 items-start">
          {videos.map((vid) => (
            <article key={vid.id} className="group space-y-3">
              {/* Radius Rectangle Thumbnail */}
              <Link href={`/article/${vid.id}`} className="block overflow-hidden rounded-xl">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-slate-200/80 shadow-2xs">
                  <img
                    src={vid.imageUrl}
                    alt={vid.alt}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 rounded-xl"
                  />
                </div>
              </Link>

              {/* Bold Title Lines & Thin Paragraph Lines */}
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-base sm:text-[17px] text-[#020618] leading-[1.3] m-0">
                  <Link
                    href={`/article/${vid.id}`}
                    className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors block"
                  >
                    {vid.titleJsx}
                  </Link>
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 font-serif leading-relaxed m-0">
                  {vid.descriptionJsx}
                </p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
