'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Mail, LogOut, LayoutDashboard, Settings, PenTool } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { NavDrawer } from '@/components/NavDrawer';
import { NAVIGATION_STRUCTURE } from '@/data/newsData';
import { useAuth } from '@/components/auth/AuthContext';
import ProfileSettingsModal from '@/components/writer/ProfileSettingsModal';

interface HeaderProps {
  showProgressBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showProgressBar = false }) => {
  const pathname = usePathname();
  const { user, openLogin, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showWriterProfileModal, setShowWriterProfileModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Business');
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pathname) return;
    const match = NAVIGATION_STRUCTURE.primary.find((item) => {
      if (pathname === item.href) return true;
      if (item.href !== '/' && pathname.startsWith(item.href)) return true;
      if (item.subcategories?.some((sub) => pathname === sub.href || pathname.startsWith(sub.href))) return true;
      return false;
    });
    if (match) {
      setActiveCategory(match.label);
    }
  }, [pathname]);

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
      {/* Sticky Main Navigation Container matching Reference Image 1 & 2 */}
      <header className={`sticky top-0 z-40 bg-white border-b border-slate-200 transition-shadow relative ${isScrolled ? 'shadow-md' : 'shadow-xs'}`}>

        {/* Upper Header Bar: Logo (Left) and SEARCH, PROFILE/SIGN IN, NEWSLETTERS (Right) */}
        <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-3.5">
          <div className="w-full flex items-center justify-between">
            
            {/* Left: Menu Dots Grid + Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-1 text-[#020618] hover:bg-slate-100/80 rounded-md transition-colors cursor-pointer group flex items-center justify-center mr-0.5"
                aria-label="Open main menu"
              >
                {/* 9-Dots Grid */}
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

              {/* Logo - Authentic Entrepreneur brand vector wordmark */}
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

            {/* Right: SEARCH, SIGN IN / USER PROFILE CARD, NEWSLETTERS matching Reference Images 1 & 2 */}
            <div className="flex items-center gap-4 sm:gap-6 font-sans">
              
              {/* 1. SEARCH Icon & Label */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#1642D0] transition-colors cursor-pointer py-1"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[2.2]" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* 2. USER PROFILE CARD (when signed in) OR SIGN IN (when guest) matching Reference Image 2 */}
              {mounted && user ? (
                /* Authenticated User Profile Card */
                <div className="relative" ref={accountDropdownRef}>
                  <button
                    onClick={() => setShowAccountDropdown((prev) => !prev)}
                    className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300 hover:ring-2 hover:ring-[#1642D0]/40 transition-all cursor-pointer select-none flex items-center justify-center shrink-0"
                    aria-label="User Account Menu"
                    title={user.name || 'User Account'}
                  >
                    {/* Circular Profile Avatar */}
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Professional neutral avatar fallback
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1642D0] text-white text-[11px] sm:text-xs font-bold flex items-center justify-center uppercase">
                        {user.name ? user.name.charAt(0) : 'U'}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showAccountDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email || 'user@entrepreneur.com'}</p>
                        {user.role !== 'writer' && (
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#1642D0] border border-blue-100">
                            Reader Member
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        {user.role === 'writer' ? (
                          <>
                            {/* 1. Write Article */}
                            <Link
                              href="/writer"
                              onClick={() => setShowAccountDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1642D0] transition-colors"
                            >
                              <PenTool className="w-3.5 h-3.5 text-slate-400" />
                              <span>Write Article</span>
                            </Link>

                            {/* 2. Dashboard */}
                            <Link
                              href="/dashboard/writer"
                              onClick={() => setShowAccountDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1642D0] transition-colors"
                            >
                              <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                              <span>Dashboard</span>
                            </Link>

                            {/* 3. Staff Writer */}
                            <Link
                              href={`/author/${encodeURIComponent((user.writerName || user.name || 'fathima').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'))}`}
                              onClick={() => setShowAccountDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1642D0] transition-colors"
                            >
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>Staff Writer</span>
                            </Link>

                            {/* 4. Profile Settings (Opens Writer Profile Settings Modal Directly) */}
                            <button
                              type="button"
                              onClick={() => {
                                setShowAccountDropdown(false);
                                setShowWriterProfileModal(true);
                              }}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1642D0] transition-colors text-left cursor-pointer"
                            >
                              <Settings className="w-3.5 h-3.5 text-slate-400" />
                              <span>Profile Settings</span>
                            </button>
                          </>
                        ) : (
                          <>
                            {/* 1. Reader Dashboard */}
                            <Link
                              href="/dashboard/reader"
                              onClick={() => setShowAccountDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1642D0] transition-colors"
                            >
                              <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                              <span>Reader Dashboard</span>
                            </Link>

                            {/* 2. Profile Settings */}
                            <Link
                              href="/dashboard/reader?tab=profile"
                              onClick={() => setShowAccountDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1642D0] transition-colors"
                            >
                              <Settings className="w-3.5 h-3.5 text-slate-400" />
                              <span>Profile Settings</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={async () => {
                            setShowAccountDropdown(false);
                            await logout();
                            window.location.href = '/';
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <span>Sign Out</span>
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Sign In Button matching Reference Image 1 */
                <button
                  onClick={openLogin}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#1642D0] transition-colors cursor-pointer py-1"
                >
                  <User className="w-4 h-4 stroke-[2.2]" />
                  <span>Sign In</span>
                </button>
              )}

              {/* 3. NEWSLETTERS Link matching Reference Image 1 */}
              <Link
                href="/newsletters"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#1642D0] transition-colors whitespace-nowrap py-1"
              >
                <Mail className="w-4 h-4 stroke-[2.2]" />
                <span className="hidden sm:inline">Newsletters</span>
              </Link>

            </div>

          </div>
        </div>

        {/* Lower Header Bar: Category Navigation matching Reference Image */}
        <div className="border-t border-slate-200 bg-white">
          <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
            <nav className="overflow-x-auto no-scrollbar font-sans py-2 sm:py-2.5">
              <ul className="flex items-center justify-between gap-4 sm:gap-6 whitespace-nowrap min-w-max">
                {NAVIGATION_STRUCTURE.primary.map((item) => {
                  const isActive = activeCategory.toLowerCase() === item.label.toLowerCase();
                  return (
                    <li key={item.label} className="relative shrink-0">
                      <Link
                        href={item.href}
                        onClick={() => setActiveCategory(item.label)}
                        className="relative pb-2 pt-1 text-[11px] sm:text-[11.5px] lg:text-[12px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 whitespace-nowrap text-[#020618] hover:text-[#1642D0]"
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
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



      {/* Slide-out Navigation Drawer */}
      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Search Overlay */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Writer Profile Settings Modal */}
      {showWriterProfileModal && (
        <ProfileSettingsModal
          isOpen={showWriterProfileModal}
          onClose={() => setShowWriterProfileModal(false)}
        />
      )}
    </>
  );
};
