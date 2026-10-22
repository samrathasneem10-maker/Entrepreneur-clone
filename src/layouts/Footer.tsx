'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MAIN_CATEGORIES } from '@/data/categoriesData';

// Bold circular dashed divider line matching reference screenshot
const CircleDashedDivider: React.FC = () => (
  <div
    className="w-full h-2.5 my-3 sm:my-4"
    style={{
      backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 1.8px, transparent 2px)',
      backgroundSize: '9px 8px',
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'center',
    }}
    aria-hidden="true"
  />
);

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const directoryColumns = [
    // Column 1
    [
      { label: 'Newsletters', href: '/newsletters' },
      { label: 'White Papers', href: '/white-papers' },
      { label: 'Events', href: '/events' },
      { label: 'Videos', href: '/videos' },
      { label: 'Podcasts', href: '/podcasts' },
      { label: 'Magazine', href: '/magazine' },
      { label: 'Spotlight', href: '/spotlight' },
    ],
    // Column 2
    [
      { label: 'Join the Leadership Network', href: '/leadership-network' },
      { label: 'Publish Your Press Release', href: '/press-release' },
      { label: 'Get Unlimited Access on Entrepreneur.com', href: '/subscribe' },
      { label: 'Start Your LLC', href: '/start-llc' },
      { label: 'Purchase Your Magazine Subscription', href: '/magazine-subscription' },
      { label: 'Manage Magazine Subscription', href: '/manage-subscription' },
      { label: 'Advertise with Entrepreneur', href: '/advertise' },
      { label: 'About Us', href: '/about' },
    ],
    // Column 3
    [
      { label: 'Entrepreneur Authorities', href: '/authorities' },
      { label: 'Entrepreneur Books Group', href: '/books' },
      { label: 'Entrepreneur Press', href: '/press' },
      { label: 'Ask an Expert', href: '/ask-an-expert' },
      { label: 'Daily Deals', href: '/deals' },
      { label: "Let's Tell Your Story", href: '/tell-your-story' },
    ],
    // Column 4
    [
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookies Policy', href: '/cookies' },
      { label: 'Accessibility Statement', href: '/accessibility' },
      { label: 'Site Map', href: '/sitemap' },
      { label: 'Contact Support', href: '/contact' },
      { label: 'Cookie Management', href: '/cookie-management' },
      { label: 'Reprints, Plaques & Badge Licensing', href: '/licensing' },
    ],
  ];

  const editions = [
    { label: 'United States', href: '#' },
    { label: 'Spanish', href: '#' },
    { label: 'Georgia', href: '#' },
    { label: 'India', href: '#' },
    { label: 'Asia Pacific', href: '#' },
    { label: 'Middle East', href: '#' },
    { label: 'United Kingdom', href: '#' },
    { label: 'Europe', href: '#' },
  ];

  return (
    <footer className="bg-[#020618] text-white font-sans w-full py-6 sm:py-8 border-t border-slate-900">
      <div className="w-full max-w-[1460px] 2xl:max-w-[1560px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
        
        {/* TOP SECTION: Newsletter Subscription */}
        <div className="py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10">
          <p className="text-white font-serif text-[13px] sm:text-sm md:text-[14px] leading-relaxed max-w-[480px] text-left my-0">
            We&apos;ll be in your inbox every morning Monday-Saturday with all the day&apos;s top business news, inspiring stories, best advice and exclusive reporting from Entrepreneur.
          </p>

          <form onSubmit={handleSubscribe} className="flex items-center gap-3.5 w-full sm:w-auto shrink-0 justify-start sm:justify-end">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="bg-white text-slate-900 placeholder:text-slate-400 px-4 h-10 rounded-[3px] text-xs sm:text-[13px] w-full sm:w-[240px] md:w-[280px] focus:outline-none shadow-xs font-sans"
            />
            <button
              type="submit"
              className="bg-[#1642D0] hover:bg-blue-700 text-white font-bold text-xs sm:text-[13px] px-6 h-10 rounded-[3px] transition-colors cursor-pointer whitespace-nowrap shadow-xs font-sans"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* 1st DASHED LINE (Bold Circle Dots) */}
        <CircleDashedDivider />

        {/* 20 Main Categories Explorer Bar */}
        <div className="py-4 sm:py-5">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Browse All 20 Business Categories
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              153 Subcategories
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {MAIN_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/topic/${cat.slug}`}
                className="text-xs text-slate-300 hover:text-white bg-slate-900/90 hover:bg-[#1642D0] px-3 py-1.5 rounded-sm border border-slate-800 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* DASHED LINE (Bold Circle Dots) */}
        <CircleDashedDivider />

        {/* MIDDLE SECTION: 4 Directory Link Columns */}
        <div className="py-6 sm:py-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 text-left">
          {directoryColumns.map((col, colIdx) => (
            <div key={colIdx} className="space-y-2.5 sm:space-y-3 flex flex-col">
              {col.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className="text-white hover:text-blue-400 font-bold text-xs sm:text-[13px] leading-normal transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* 2nd DASHED LINE (Bold Circle Dots) */}
        <CircleDashedDivider />

        {/* THIRD SECTION: Social Icons, Copyright & USAID Disclaimer */}
        <div className="py-5 sm:py-6 space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            
            {/* 7 Social Media Icons */}
            <div className="flex items-center gap-3.5 sm:gap-4 text-white">
              {/* Facebook */}
              <a href="https://facebook.com/entrepreneur" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.625c-.204.347-.282.808-.282 1.626v1.425h3.692l-.571 3.667h-3.121v7.98H9.101z"/></svg>
              </a>

              {/* X / Twitter */}
              <a href="https://x.com/entrepreneur" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="X (Twitter)">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com/company/entrepreneur-media" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.55a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com/user/entrepreneuronline" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="YouTube">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>

              {/* Instagram */}
              <a href="https://instagram.com/entrepreneur" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>

              {/* TikTok */}
              <a href="https://tiktok.com/@entrepreneur" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="TikTok">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.61.74-5.23 2.74-6.89 1.42-1.18 3.26-1.78 5.1-1.68v4.03c-1.13-.07-2.27.32-3.08 1.09-.94.88-1.33 2.23-1.04 3.49.27 1.18 1.19 2.14 2.37 2.45 1.34.36 2.82.02 3.84-.87 1.02-.88 1.48-2.24 1.44-3.57.02-3.64.01-7.28.01-10.92z"/></svg>
              </a>

              {/* Threads */}
              <a href="https://threads.net/@entrepreneur" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="Threads">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.186 20.592c-4.417 0-7.854-3.149-7.854-7.79 0-4.757 3.593-8.03 8.04-8.03 4.542 0 7.828 3.197 7.828 7.747 0 5.176-4.148 7.915-8.528 7.915-2.029 0-3.903-.559-5.187-1.558l.942-1.393c1.026.8 2.569 1.258 4.245 1.258 3.398 0 6.643-2.086 6.643-6.222 0-3.69-2.57-6.054-5.943-6.054-3.454 0-6.155 2.53-6.155 6.337 0 3.738 2.657 6.103 6.012 6.103 1.417 0 2.593-.418 3.428-1.066l.872 1.34c-1.092.85-2.598 1.388-4.3 1.388z"/></svg>
              </a>
            </div>

            {/* Copyright text */}
            <p className="text-slate-300 text-[11px] sm:text-xs font-serif leading-tight text-left sm:text-right my-0">
              Copyright © 2026 Entrepreneur Media, LLC All rights reserved. Entrepreneur® and its related marks are registered trademarks of Entrepreneur Media, LLC.
            </p>
          </div>

          {/* Centered Independence Statement */}
          <div className="text-center text-slate-300 text-[11px] sm:text-xs font-serif pt-1">
            We are a proud American independent media company that has never taken a dime of USAID taxpayer money us
          </div>
        </div>

        {/* 3rd DASHED LINE (Bold Circle Dots) */}
        <CircleDashedDivider />

        {/* BOTTOM SECTION: International Editions */}
        <div className="py-5 sm:py-6 flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-2 text-xs sm:text-[13px] font-bold font-sans text-white">
          {editions.map((edition, idx) => (
            <React.Fragment key={edition.label}>
              <Link href={edition.href} className="hover:text-blue-400 transition-colors whitespace-nowrap">
                {edition.label}
              </Link>
              {idx < editions.length - 1 && (
                <span className="text-slate-500 font-normal select-none">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </footer>
  );
};
