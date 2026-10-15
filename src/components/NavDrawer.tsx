'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, Search, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

const SIDEBAR_TOPICS = [
  { label: 'Breaking Business News', href: '/topic/breaking-business-news' },
  { label: 'Markets & Investing', href: '/topic/markets-investing' },
  { label: 'Economy', href: '/topic/economy' },
  { label: 'Corporate News', href: '/topic/corporate-news' },
  { label: 'Startups & Entrepreneurship', href: '/topic/startups-entrepreneurship' },
  { label: 'Banking & Finance', href: '/topic/banking-finance' },
  { label: 'Technology & AI', href: '/topic/technology-ai' },
  { label: 'Real Estate', href: '/topic/real-estate' },
  { label: 'International Business', href: '/topic/international-business' },
  { label: 'Leadership', href: '/topic/leadership' },
  { label: 'Marketing & Branding', href: '/topic/marketing-branding' },
  { label: 'Sustainability (ESG)', href: '/topic/sustainability-esg' },
  { label: 'Company Profiles', href: '/topic/company-profiles' },
  { label: 'CEO Interviews', href: '/topic/ceo-interviews' },
  { label: 'Research & Insights', href: '/topic/research-insights' },
];

export const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen, onClose, onOpenSearch }) => {
  const { openLogin } = useAuth();
  const [mounted, setMounted] = useState(false);

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

  if (!isOpen || !mounted) return null;

  const drawerContent = (
    <div className="fixed inset-0 z-50 flex justify-start bg-slate-900/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer Container: pinned to full viewport height, non-scrolling shell */}
      <div className="relative bg-white w-full max-w-sm sm:max-w-md h-full max-h-screen flex flex-col shadow-2xl border-r border-slate-200 z-10 animate-in slide-in-from-left duration-300">
        
        {/* Header inside Drawer: Logo, Search Icon, Login Icon, Close Icon (Pinned shrink-0) */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-2xl tracking-tighter text-slate-950">
              Entrepreneur<span className="text-red-700 font-sans text-xs align-super ml-0.5">®</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <button
              onClick={() => {
                onClose();
                if (onOpenSearch) onOpenSearch();
              }}
              className="p-2 text-slate-700 hover:text-[#1642D0] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Login Icon */}
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

        {/* Drawer Scrollable Content: 15 Exact Topics with NO > arrow mark */}
        <div className="p-5 sm:p-6 flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <nav className="space-y-1">
            {SIDEBAR_TOPICS.map((topic) => (
              <div key={topic.label} className="border-b border-slate-100 last:border-b-0">
                <Link
                  href={topic.href}
                  onClick={onClose}
                  className="block text-base font-bold font-sans text-[#020618] hover:text-[#1642D0] transition-colors py-3"
                >
                  {topic.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>

      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
