'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, User, Mail, LogOut, ChevronDown } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { NavDrawer } from '@/components/NavDrawer';
import { NAVIGATION_STRUCTURE } from '@/data/newsData';
import { useAuth } from '@/components/auth/AuthContext';

interface HeaderProps {
  showProgressBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showProgressBar = false }) => {
  const { user, openLogin, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reading progress calculation for article pages
  useEffect(() => {
    if (!showProgressBar) return;

    let rAFId: number;

    const updateProgress = () => {
      const articleEl = document.querySelector('article');
      if (!articleEl) return;

      const rect = articleEl.getBoundingClientRect();
      const articleHeight = rect.height;
      const windowHeight = window.innerHeight;
      const headerOffset = 120;

      const startPoint = rect.top - headerOffset;
      const totalScrollable = articleHeight - (windowHeight - headerOffset);

      if (totalScrollable <= 0) {
        setReadingProgress(100);
        return;
      }

      const currentScroll = -startPoint;
      const pct = Math.min(100, Math.max(0, (currentScroll / totalScrollable) * 100));

      setReadingProgress(pct);
    };

    const onScroll = () => {
      cancelAnimationFrame(rAFId);
      rAFId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rAFId);
    };
  }, [showProgressBar]);

  return (
    <>
      {/* Sticky Main Navigation Container */}
      <header className={`sticky top-0 z-40 bg-white border-b border-slate-200 transition-shadow relative ${isScrolled ? 'shadow-md' : 'shadow-xs'}`}>

        {/* Upper Header Bar: Menu Dots + Logo (Left) and Top CTA Buttons (Right) */}
        <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-3.5">
          <div className="w-full flex items-center justify-between">
            
            {/* Left: Menu Dots Grid + Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-1 text-[#020618] hover:bg-slate-100/80 rounded-md transition-colors cursor-pointer group flex items-center justify-center mr-0.5"
                aria-label="Open main menu"
              >
                {/* Enriched Dots Grid matching reference screenshot */}
                <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-[#020618] group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                  <circle cx="4" cy="4" r="2.7" />
                  <circle cx="12" cy="4" r="2.7" />
                  <circle cx="20" cy="4" r="2.7" />
                  <circle cx="4" cy="12" r="2.7" />
                  <circle cx="12" cy="12" r="2.7" />
                  <circle cx="20" cy="12" r="2.7" />
                  <circle cx="4" cy="20" r="2.7" />
                  <circle cx="12" cy="20" r="2.7" />
                  <circle cx="20" cy="20" r="2.7" />
                </svg>
              </button>

              {/* Logo - Exact authentic Entrepreneur brand vector wordmark */}
              <Link href="/" className="flex items-center group py-0.5 select-none" aria-label="Entrepreneur">
                <svg
                  className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-10.5 w-auto fill-current text-[#000000] group-hover:text-[#1642D0] transition-colors"
                  viewBox="0 0 545.8 107.1"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M0.8,72.7l6.9-1.1V7.9L0,6.9L0.4,0h48.2l-1.2,19.3l-9.6-0.3L37.2,6.9H22.3v28.7h6.5l1.5-6.6l6.7,0.2V49h-6.7 l-1.6-6.8h-6.5v30.4h15l1.4-13.2l10.1,0.3l0.8,20.1H0.5L0.8,72.7z" />
                  <path d="M54,79.9l0.3-5.9l5.4-1.1V32.7l-6.3-0.6v-6l15.8-2.3l1.2,3.4v2.3c3.8-4,8.4-6.4,14.3-6.4 c8.6,0,15,5.2,15,15.5v34.2l5.7,1.1l-0.3,5.9H86.3V41.6c0-5.5-2-8.6-7-8.6c-1.7,0-2.9,0.3-4.2,0.8c-0.8,0.7-1.6,1.7-2.3,2.6v36.6 l5.7,1.1l-0.4,5.9H54z" />
                  <path d="M356.1,79.9l0.2-5.9l5.4-1.1V32.7l-6.3-0.6v-6l15.8-2.3l1.2,3.4v2.3c3.8-4,8.4-6.4,14.3-6.4 c8.6,0,15,5.2,15,15.5v34.2l5.7,1.1l-0.3,5.9h-18.7V41.6c0-5.5-2-8.6-7-8.6c-1.7,0-2.9,0.3-4.2,0.8c-0.8,0.7-1.6,1.7-2.3,2.6v36.6 l5.7,1.1l-0.4,5.9H356.1z" />
                  <path d="M135.2,78.8c-2.2,0.9-6.1,1.9-11.2,1.9c-6.7,0-12.9-3-12.9-12.8V32.7l-6.4-1l0.3-7l7.2-0.3l3.1-10.7l9.2-0.4 v11.5h9.9l-0.7,7l-9.1,1v35.2c0,2.9,1.6,4.8,4.6,4.8h5.4L135.2,78.8z" />
                  <path d="M509.5,79.9l0.2-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17.1-5.3l2.4,2.1L544.1,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H509.5z" />
                  <path d="M274,79.9l0.3-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17.1-5.3l2.4,2.1L308.5,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H274z" />
                  <path d="M139.2,79.9l0.3-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17-5.3l2.4,2.1L173.8,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H139.2z" />
                  <path d="M191,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L191,55.4z M190.8,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C191.9,36.8,190.8,45.1,190.8,49z" />
                  <path d="M423.4,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L423.4,55.4z M423.2,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C424.3,36.8,423.2,45.1,423.2,49z" />
                  <path d="M325.8,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L325.8,55.4z M325.6,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C326.7,36.8,325.5,45.1,325.6,49z" />
                  <path d="M490,79.9l-1.4-4.8c-3.7,3.5-7.3,5.6-12.9,5.6c-8.6,0-16.3-4.3-16.3-16.2V31.3l-6.3-0.6v-5.3l18.2-2.1 l1.4,4.8v34.8c0,6.1,2.5,9.3,7.4,9.3c1.4,0,3.2-0.2,4.8-0.8c0.9-0.9,1.8-2,2.5-3.1v-37l-6.5-0.6v-5.3l18.4-2.1l1.4,4.8v44.8 l5.7,1.1l-0.7,5.9H490z" />
                  <path d="M247.1,72.7c-2.9,0-5.2-0.5-7-1.5V35.9c0.8-1.2,1.7-2.3,2.6-3.3c1.7-0.6,3.2-0.8,5-0.8c7.5,0,8.8,7.6,8.8,21.2 c0,13.1-2,16.7-2.5,18.2C251.9,72.2,249.7,72.7,247.1,72.7z M269.5,50.6c0-16.9-5-27.5-17.5-27.5c-8.3,0-12.2,4.8-13.8,6.8V28 l-1.4-4.8l-16.3,2.3v5.8l6.3,0.8v68.2l-5.4,1.1l-0.3,5.7h24.1l0.4-5.7l-5.7-1.1V78.7c2.3,1.3,5.5,2.1,9,2.1 C269.3,80.8,269.5,60.1,269.5,50.6z" />
                </svg>
                <span className="text-[#000000] text-[10px] sm:text-xs font-sans font-bold ml-1 self-start mt-0.5">®</span>
              </Link>
            </div>

            {/* Right: Press Releases and Save 33% on All Access buttons matching Screenshot 3 */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 font-sans">
              <Link
                href="/topic/press-releases"
                className="px-3 sm:px-4 py-1.5 border border-slate-700 hover:border-black text-slate-900 text-xs sm:text-[13px] font-bold rounded-sm transition-colors whitespace-nowrap bg-white hover:bg-slate-50"
              >
                Press Releases
              </Link>
              <Link
                href="/subscribe"
                className="px-3 sm:px-4 py-1.5 bg-[#1642D0] hover:bg-[#0E2C8F] text-white text-xs sm:text-[13px] font-bold rounded-sm transition-colors whitespace-nowrap shadow-xs"
              >
                Save 33% on All Access
              </Link>
            </div>

          </div>
        </div>

        {/* Lower Header Bar: Navigation Categories (Left) and Controls/Dropdown (Right) matching Screenshot 3 */}
        <div className="border-t border-slate-100 bg-white">
          <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="flex items-center justify-between py-2 sm:py-2.5">
              
              {/* Left: Primary Navigation Categories */}
              <nav className="overflow-x-auto no-scrollbar font-sans flex-1 mr-4">
                <ul className="flex items-center gap-4 sm:gap-5 lg:gap-6 whitespace-nowrap min-w-max">
                  {NAVIGATION_STRUCTURE.primary.map((item) => (
                    <li key={item.label} className="relative group py-1 shrink-0">
                      <Link
                        href={item.href}
                        className="text-[11px] sm:text-[11.5px] lg:text-[12px] font-bold uppercase tracking-wider text-[#020618] hover:text-[#1642D0] transition-colors flex items-center gap-1 whitespace-nowrap"
                      >
                        {item.label}
                      </Link>

                      {/* Dropdown Hover Menu */}
                      {item.subcategories && (
                        <div className="absolute top-full left-0 min-w-[270px] max-w-[340px] max-h-[460px] overflow-y-auto bg-white shadow-xl rounded-b-xl border border-slate-200 py-2 hidden group-hover:block animate-in fade-in duration-150 z-50">
                          <div className="px-3.5 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {item.subcategories.length} Subcategories
                            </span>
                            <Link
                              href={item.href}
                              className="text-[10px] font-bold text-[#1642D0] hover:underline"
                            >
                              View All &rarr;
                            </Link>
                          </div>
                          <div className="py-1">
                            {item.subcategories.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="block px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-[#1642D0] transition-colors"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Right: Search + Profile Dropdown + Newsletters matching Screenshot 3 */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-sans border-l border-slate-200 pl-3 sm:pl-4">
                
                {/* Search Toggle Icon */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1 text-slate-800 hover:text-[#1642D0] transition-colors cursor-pointer"
                  aria-label="Search"
                  title="Search"
                >
                  <Search className="w-5 h-5 stroke-[2.2]" />
                </button>

                {/* Profile Icon with Blue Border and Dropdown matching Screenshot 3 */}
                <div className="relative" ref={accountDropdownRef}>
                  <button
                    onClick={() => {
                      if (!mounted) return;
                      setShowAccountDropdown((prev) => !prev);
                    }}
                    className="w-8 h-8 rounded border-2 border-[#1642D0] text-[#1642D0] hover:bg-blue-50 transition-colors flex items-center justify-center cursor-pointer select-none"
                    aria-label="User Account Menu"
                    title={mounted && user ? user.name : "Sign In or Account"}
                  >
                    {mounted && user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xs" />
                    ) : (
                      <User className="w-4 h-4 stroke-[2.4]" />
                    )}
                  </button>

                  {/* Dropdown Menu matching Screenshot 3: My Account, Start Your LLC, Sign Out */}
                  {showAccountDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded shadow-xl border border-slate-200 py-1.5 z-50 text-left animate-in fade-in duration-100">
                      {mounted && user ? (
                        <>
                          <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/60">
                            <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-500 capitalize">{user.role || 'Member'}</p>
                          </div>
                          <Link
                            href={user.role === 'writer' ? '/dashboard/writer' : '/dashboard'}
                            onClick={() => setShowAccountDropdown(false)}
                            className="block px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#1642D0] transition-colors"
                          >
                            My Account
                          </Link>
                          <Link
                            href="/start-llc"
                            onClick={() => setShowAccountDropdown(false)}
                            className="block px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#1642D0] transition-colors"
                          >
                            Start Your LLC
                          </Link>
                          <button
                            onClick={() => {
                              setShowAccountDropdown(false);
                              logout();
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-slate-100 flex items-center justify-between"
                          >
                            <span>Sign Out</span>
                            <LogOut className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setShowAccountDropdown(false);
                              openLogin();
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-[#1642D0] hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            Sign In
                          </button>
                          <Link
                            href="/dashboard"
                            onClick={() => setShowAccountDropdown(false)}
                            className="block px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#1642D0] transition-colors"
                          >
                            My Account
                          </Link>
                          <Link
                            href="/start-llc"
                            onClick={() => setShowAccountDropdown(false)}
                            className="block px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#1642D0] transition-colors"
                          >
                            Start Your LLC
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Newsletters Link */}
                <Link
                  href="/newsletters"
                  className="hidden sm:flex items-center gap-1.5 p-1 text-slate-800 hover:text-[#1642D0] transition-colors text-xs font-bold whitespace-nowrap"
                  aria-label="Newsletters"
                  title="Newsletters"
                >
                  <Mail className="w-4 h-4 stroke-[2.2]" />
                  <span>Newsletters</span>
                </Link>

              </div>

            </div>
          </div>
        </div>

        {/* Reading Progress Bar (Article Detail Pages Only) */}
        {showProgressBar && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-200/50 overflow-hidden pointer-events-none z-50">
            <div
              className="h-full bg-[#1642D0] transition-[width] duration-150 ease-out"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        )}
      </header>

      {/* Promotional Discount Banner matching Screenshot 3 */}
      <div className="w-full bg-[#1642D0] py-2 px-4 text-center select-none shadow-xs">
        <Link
          href="/subscribe"
          className="text-white text-xs sm:text-[13px] md:text-sm font-bold tracking-wide underline hover:text-blue-100 transition-colors inline-block"
        >
          33% Off the Playbooks Trusted by 10,000+ Entrepreneurs
        </Link>
      </div>

      {/* Search Modal Overlay */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Slide-out Navigation Drawer */}
      <NavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
};
