'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Mail, LogOut, LayoutDashboard, Settings } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState<string>('');
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pathname) return;
    if (pathname === '/') {
      try {
        sessionStorage.removeItem('activeNavCategory');
      } catch (_) {}
      setActiveCategory('');
      return;
    }
    const match = NAVIGATION_STRUCTURE.primary.find((item) => {
      if (pathname === item.href) return true;
      if (item.href !== '/' && pathname.startsWith(item.href)) return true;
      if (item.subcategories?.some((sub) => pathname === sub.href || pathname.startsWith(sub.href))) return true;
      return false;
    });
    if (match) {
      setActiveCategory(match.label);
      try {
        sessionStorage.setItem('activeNavCategory', match.label);
      } catch (_) {}
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

              {/* Logo - Logo @3x */}
              <Link href="/" className="flex items-center group py-0.5 select-none" aria-label="United States Today">
                <img
                  src="/Logo @3x.png"
                  alt="United States Today"
                  className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-10.5 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Right: SEARCH, SIGN IN / USER PROFILE CARD, NEWSLETTERS matching Reference Images 1 & 2 */}
            <div className="flex items-center gap-4 sm:gap-6 font-sans">
              
              {/* 1. SEARCH Icon & Label */}
              <Link
                href="/search"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#1642D0] transition-colors cursor-pointer py-1"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[2.2]" />
                <span className="hidden sm:inline">Search</span>
              </Link>

              {/* 2. USER PROFILE CARD (when signed in) OR SIGN IN (when guest) matching Reference Image 2 */}
              {mounted && user ? (
                /* Authenticated User Profile Card */
                <div className="relative" ref={accountDropdownRef}>
                  <button
                    onClick={() => setShowAccountDropdown((prev) => !prev)}
                    className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300 hover:ring-2 hover:ring-[#1642D0]/40 transition-all cursor-pointer select-none flex items-center justify-center shrink-0"
                    aria-label="User Account Menu"
                    title={user.name || user.writerName || 'User Account'}
                  >
                    {/* Circular Profile Avatar */}
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || user.writerName || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Professional neutral avatar fallback
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1642D0] text-white text-[11px] sm:text-xs font-bold flex items-center justify-center uppercase">
                        {(user.name || user.writerName || 'U').charAt(0)}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showAccountDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name || user.writerName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email || 'user@unitedstatestoday.com'}</p>
                        {user.role !== 'writer' && (
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#1642D0] border border-blue-100">
                            {user.role === 'admin' ? 'Administrator' : 'Reader Member'}
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        {user.role === 'writer' ? (
                          <>
                            {/* 1. Writer Dashboard */}
                            <Link
                              href="/dashboard/writer"
                              onClick={() => setShowAccountDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1642D0] transition-colors"
                            >
                              <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                              <span>Writer Dashboard</span>
                            </Link>

                            {/* 2. Writer Page */}
                            <Link
                              href={`/author/${encodeURIComponent((user.writerName || user.name || 'fathima').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'))}`}
                              onClick={() => setShowAccountDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1642D0] transition-colors"
                            >
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>Writer Page</span>
                            </Link>

                            {/* 3. Profile Settings (Opens Writer Profile Settings Modal Directly) */}
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
                        ) : user.role === 'admin' ? (
                          <>
                            {/* 1. Admin Dashboard */}
                            <Link
                              href="/admin"
                              onClick={() => setShowAccountDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#1642D0] transition-colors"
                            >
                              <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                              <span>Admin Dashboard</span>
                            </Link>
                          </>
                        ) : (
                          <>
                            {/* 1. Reader Dashboard */}
                            <Link
                              href="/dashboard/reader?tab=saved"
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
          <div className="w-full max-w-[1840px] mx-auto px-3 sm:px-4 md:px-3 lg:px-4 xl:px-6 2xl:px-8">
            <nav className="overflow-x-auto no-scrollbar font-sans py-2 sm:py-2.5">
              <ul className="flex items-center justify-between gap-2 md:gap-1.5 lg:gap-2 xl:gap-3 2xl:gap-5 whitespace-nowrap min-w-max md:min-w-0 w-full">
                {NAVIGATION_STRUCTURE.primary.map((item) => {
                  const isActive = activeCategory.toLowerCase() === item.label.toLowerCase();
                  return (
                    <li key={item.label} className="relative shrink-0">
                      <Link
                        href={item.href}
                        onClick={() => {
                          setActiveCategory(item.label);
                          try {
                            sessionStorage.setItem('activeNavCategory', item.label);
                          } catch (_) {}
                        }}
                        className={`relative pb-2.5 pt-1 text-[9.5px] sm:text-[10px] md:text-[9.5px] lg:text-[10px] xl:text-[11px] 2xl:text-[12px] font-bold uppercase tracking-tight md:tracking-tighter lg:tracking-tight xl:tracking-normal 2xl:tracking-wider transition-colors flex items-center gap-1 whitespace-nowrap no-underline hover:no-underline active:no-underline focus:no-underline visited:text-[#020618] ${
                          isActive ? 'text-[#020618]' : 'text-[#020618] hover:text-[#1642D0]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="block absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1642D0]" />
                        )}
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
