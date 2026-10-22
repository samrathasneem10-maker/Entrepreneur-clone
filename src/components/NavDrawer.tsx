'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, Search, User, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { MAIN_CATEGORIES } from '@/data/categoriesData';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen, onClose }) => {
  const { user, openLogin, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter categories and subcategories based on search input
  const filteredCategories = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return MAIN_CATEGORIES;

    return MAIN_CATEGORIES.map((main) => {
      const mainMatches = main.name.toLowerCase().includes(q) || main.description.toLowerCase().includes(q);
      const matchingSubs = main.subcategories.filter((sub) =>
        sub.name.toLowerCase().includes(q) || (sub.description && sub.description.toLowerCase().includes(q))
      );

      if (mainMatches || matchingSubs.length > 0) {
        return {
          ...main,
          subcategories: matchingSubs.length > 0 ? matchingSubs : main.subcategories,
          isMatched: true,
        };
      }
      return null;
    }).filter(Boolean) as typeof MAIN_CATEGORIES;
  }, [filterQuery]);

  if (!isOpen || !mounted) return null;

  const drawerContent = (
    <div className="fixed inset-0 z-50 flex justify-start bg-slate-900/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer Container: pinned to full viewport height, non-scrolling shell */}
      <div className="relative bg-white w-full max-w-sm sm:max-w-md h-full max-h-screen flex flex-col shadow-2xl border-r border-slate-200 z-10 animate-in slide-in-from-left duration-300">
        
        {/* Header inside Drawer: Centered Entrepreneur Logo, User & Close controls (Search icon removed per user marking) */}
        <div className="relative p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white h-16">
          {/* Left placeholder to balance right buttons */}
          <div className="w-16 shrink-0" />

          {/* Centered Entrepreneur Logo (middle of the top) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center select-none pointer-events-none">
            <span className="font-serif font-black text-2xl tracking-tighter text-slate-950 whitespace-nowrap">
              Entrepreneur<span className="text-red-700 font-sans text-xs align-super ml-0.5">®</span>
            </span>
          </div>

          {/* Right: User/Profile + Close Icon */}
          <div className="flex items-center gap-1 sm:gap-2 z-10 shrink-0">
            {/* Login / User Profile Icon */}
            {user ? (
              <div className="flex items-center gap-1">
                <Link
                  href={user.role ? `/dashboard/${user.role}` : '/dashboard'}
                  onClick={onClose}
                  className="flex items-center gap-1.5 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                  title={`Go to ${user.role} dashboard`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#1642D0] text-white flex items-center justify-center text-[11px] font-extrabold uppercase">
                    {user.name.charAt(0)}
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  openLogin();
                }}
                className="p-2 text-slate-700 hover:text-[#1642D0] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Sign In"
                title="Sign In"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Close Icon */}
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer ml-1"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Filter Box (Stats indicator row removed as marked in user image) */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter topics & subcategories..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1642D0]"
            />
          </div>
        </div>

        {/* Drawer Scrollable Content: 20 Categories with Expandable Subcategories */}
        <div className="p-4 sm:p-5 flex-1 min-h-0 overflow-y-auto overscroll-contain divide-y divide-slate-100">
          <nav className="space-y-1">
            {filteredCategories.map((main) => {
              const isExpanded = filterQuery.trim().length > 0 || !!expandedCategories[main.id];
              return (
                <div key={main.slug} className="py-1">
                  <div className="flex items-center justify-between group">
                    <Link
                      href={`/topic/${main.slug}`}
                      onClick={onClose}
                      className="flex-1 text-sm sm:text-[15px] font-bold font-sans text-[#020618] hover:text-[#1642D0] transition-colors py-2 flex items-center gap-2"
                    >
                      <span>{main.name}</span>
                    </Link>

                    {/* Subcategories toggle & counter badge */}
                    {main.subcategories && main.subcategories.length > 0 && (
                      <button
                        onClick={() => toggleCategory(main.id)}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-slate-500 hover:text-[#1642D0] hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                      >
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {main.subcategories.length}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#1642D0]' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Expandable Subcategory List */}
                  {isExpanded && main.subcategories && main.subcategories.length > 0 && (
                    <div className="pl-3.5 pr-1 py-1.5 my-1 bg-slate-50/70 border-l-2 border-[#1642D0] rounded-r-md space-y-1 animate-in fade-in duration-150">
                      {main.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/topic/${sub.slug}`}
                          onClick={onClose}
                          className="flex items-center justify-between py-1.5 px-2 text-xs font-semibold text-slate-600 hover:text-[#1642D0] hover:bg-white rounded transition-colors"
                        >
                          <span>{sub.name}</span>
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
