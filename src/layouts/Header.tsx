'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Mail, LogOut } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { NavDrawer } from '@/components/NavDrawer';
import { NAVIGATION_STRUCTURE } from '@/data/newsData';
import { useAuth } from '@/components/auth/AuthContext';

interface HeaderProps {
  showProgressBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showProgressBar = false }) => {
  const { user, openLogin, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

        
        {/* Upper Header Bar: Menu Dots + Logo (Left) and Controls (Right) */}
        <div className="px-5 lg:px-10 py-3 sm:py-3.5">
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

              {/* Logo - Noe Display serif wordmark with increased height */}
              <Link href="/" className="flex items-baseline group py-0.5 select-none">
                <span className="font-logo font-black text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] tracking-[-0.04em] text-[#000000] leading-none group-hover:text-[#1642D0] transition-colors">
                  Entrepreneur
                </span>
                <span className="text-[#000000] text-xs sm:text-sm font-sans font-bold ml-[2px] leading-none align-baseline">®</span>
              </Link>
            </div>

            {/* Right: Search Icon + Sign In Controls (Shifted to right edge) */}
            <div className="flex items-center gap-4 sm:gap-6 font-sans text-[#020618]">
              
              {/* Search Toggle Link */}
              <Link
                href="/search"
                className="flex items-center gap-2 p-1.5 text-[#020618] hover:text-[#1642D0] transition-colors cursor-pointer"
                aria-label="Search"
                title="Search"
              >
                <Search className="w-5 h-5 stroke-[2.2]" />
                <span className="hidden sm:inline font-bold uppercase tracking-wider text-xs sm:text-[13px]">Search</span>
              </Link>


              {/* Sign In / User Profile */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 p-1.5 text-[#020618] text-xs sm:text-[13px] font-bold">
                    <div className="w-6 h-6 rounded-full bg-[#1642D0] text-white flex items-center justify-center text-[10px] font-extrabold uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline truncate max-w-[100px]">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={openLogin}
                  className="flex items-center gap-2 p-1.5 text-[#020618] hover:text-[#1642D0] transition-colors cursor-pointer"
                  aria-label="Sign In"
                >
                  <User className="w-5 h-5 stroke-[2.2]" />
                  <span className="hidden sm:inline font-bold uppercase tracking-wider text-xs sm:text-[13px]">Sign In</span>
                </button>
              )}

              {/* Newsletters */}
              <Link
                href="/newsletters"
                className="flex items-center gap-2 p-1.5 text-[#020618] hover:text-[#1642D0] transition-colors cursor-pointer"
                aria-label="Newsletters"
                title="Newsletters"
              >
                <Mail className="w-5 h-5 stroke-[2.2]" />
                <span className="hidden sm:inline font-bold uppercase tracking-wider text-xs sm:text-[13px]">Newsletters</span>
              </Link>

            </div>

          </div>
        </div>

        {/* Lower Header Bar: Left-aligned Custom Navigation Topics */}
        <nav className="px-5 lg:px-10 py-2 sm:py-2.5 bg-white hidden lg:block">
          <div className="w-full flex items-center justify-start font-sans">
            
            {/* Custom Primary Navigation Topics grouped closer together */}
            <ul className="flex items-center gap-6 lg:gap-7 xl:gap-8">
              {NAVIGATION_STRUCTURE.primary.map((item) => (
                <li key={item.label} className="relative group py-1">
                  <Link
                    href={item.href}
                    className="text-[13px] xl:text-[14px] font-bold uppercase tracking-wider text-[#020618] hover:text-[#1642D0] transition-colors flex items-center gap-1"
                  >
                    {item.label}
                  </Link>

                  {/* Dropdown Hover Menu */}
                  {item.subcategories && (
                    <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-xl border border-slate-200 py-3 hidden group-hover:block animate-in fade-in duration-150 z-50">
                      {item.subcategories.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#1642D0] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

          </div>
        </nav>

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
