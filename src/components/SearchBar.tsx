'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { SearchBarSkeleton } from '@/components/skeletons/SearchBarSkeleton';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
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

  if (!isOpen) return null;

  const popularTopics = [
    'Start an LLC',
    'AI Side Hustles',
    'Franchise 500 Rankings',
    'Business Plan Template',
    'Passive Income Ideas',
    'Marketing Growth Hacks',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative border border-slate-200 animate-in fade-in slide-in-from-top-6 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close search"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Search Entrepreneur Library
          </span>
        </div>

        {/* Search Input Box with Gradient Border */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="p-[3px] bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-700 rounded-full shadow-lg">
            <div className="relative flex items-center bg-white rounded-full">
              <Search className="w-6 h-6 text-slate-400 absolute left-5 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="How can we help you today? (e.g. LLC, Side Hustle, AI)"
                className="w-full py-4 pl-14 pr-14 text-lg font-medium text-slate-900 rounded-full focus:outline-none placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full transition-colors flex items-center justify-center shadow-md"
                aria-label="Submit search"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>

        {/* Popular Trending Topics Suggestions or Live Search Shimmer Results */}
        {query.trim() ? (
          <div className="mt-6">
            <SearchBarSkeleton />
          </div>
        ) : (
          <div className="mt-6">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
              Popular Topics Right Now
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    onClose();
                    router.push(`/search?q=${encodeURIComponent(topic)}`);
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-full border border-slate-200 transition-colors cursor-pointer"
                >
                  {topic}
                </button>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

