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
        
        {/* Header inside Drawer: Centered Entrepreneur Logo, exactly centered, increased size, no 'W' symbol or extra marks */}
        <div className="relative px-4 py-3.5 border-b border-slate-200 flex items-center justify-center shrink-0 bg-white h-16">
          {/* Centered Entrepreneur Logo - perfectly centered */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center justify-center select-none hover:opacity-85 transition-opacity"
            aria-label="Entrepreneur Home"
          >
            <span className="font-serif font-black text-[27px] sm:text-[29px] tracking-tight text-[#000000] whitespace-nowrap">
              Entrepreneur
            </span>
          </Link>

          {/* Close Icon pinned to the far right */}
          <button
            onClick={onClose}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 stroke-[2]" />
          </button>
        </div>

        {/* Quick Filter Box: Increased height and larger search icon matching request 4 */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200/80 bg-slate-50/90 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.2] pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter topics & subcategories..."
              className="w-full pl-11 pr-3.5 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-md text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1642D0] focus:ring-1 focus:ring-[#1642D0] transition-all shadow-2xs"
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

        {/* Drawer Footer: User Profile / Auth Status */}
        {user ? (
          <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <Link
              href={user.role ? `/dashboard/${user.role}` : '/dashboard'}
              onClick={onClose}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-[#1642D0] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#1642D0] text-white flex items-center justify-center text-[11px] font-extrabold uppercase">
                {user.name.charAt(0)}
              </div>
              <span className="truncate max-w-[170px]">{user.name}</span>
            </Link>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-slate-200/50"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                onClose();
                openLogin();
              }}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1642D0] hover:underline cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Sign In to Entrepreneur</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
