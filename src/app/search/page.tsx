'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, SearchX, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { searchArticles, ALL_ARTICLES, Article, getArticleUrl } from '@/data/newsData';
import { SearchSkeleton } from '@/components/skeletons/SearchSkeleton';

// United States Today existing categories for the Trending Topics section
const TRENDING_TOPICS = [
  'Building a Business',
  'Business News',
  'Startups & Entrepreneurship',
  'Technology & AI',
  'Economy & Policy',
  'Markets & Investing',
  'Banking & Finance',
  'Corporate News',
  'Real Estate & Property',
  'Global Business',
];

const ARTICLES_PER_PAGE = 8;

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [, startTransition] = useTransition();

  // Sync state if URL query changes externally
  useEffect(() => {
    setQuery(initialQuery);
    setCurrentPage(1);
  }, [initialQuery]);

  // Handle Search Input Change with URL sync
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setCurrentPage(1);

    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      if (val.trim()) {
        params.set('q', val);
      } else {
        params.delete('q');
      }
      router.replace(`/search?${params.toString()}`, { scroll: false });
    });
  };

  const handleClear = () => {
    handleQueryChange('');
  };

  const handleCategoryClick = (catName: string) => {
    if (query.trim().toLowerCase() === catName.toLowerCase()) {
      handleQueryChange('');
    } else {
      handleQueryChange(catName);
    }
  };

  // Filtered articles
  const filteredArticles = searchArticles(query);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedArticles = filteredArticles.slice(
    (safePage - 1) * ARTICLES_PER_PAGE,
    safePage * ARTICLES_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Main Navigation Header */}
      <Header />

      {/* Main Search Page Container (Matching Reference Image 1) */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Heading, Search Bar & Search Results         */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 xl:col-span-8">
            {/* Top Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-black text-[#020618] tracking-tight mb-5 leading-tight my-0">
              How can we help you today?
            </h1>

            {/* Pill Search Bar with Gradient Border Outline */}
            <div className="relative w-full max-w-2xl mt-4">
              <div className="p-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 rounded-full shadow-xs focus-within:shadow-md transition-shadow">
                <div className="relative flex items-center bg-white rounded-full px-5 py-3.5 sm:py-4">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 shrink-0 mr-3.5 stroke-[2.2]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="How can we help you today?"
                    className="w-full text-base sm:text-lg font-serif italic text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 placeholder:italic placeholder:font-serif"
                    autoFocus
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer ml-2"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results Heading */}
            <div className="mt-10 sm:mt-12 mb-6 flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] tracking-tight my-0">
                Search Results
              </h2>
              {query.trim() && (
                <span className="text-xs text-slate-500 font-sans">
                  {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Search Results Article List (Horizontal Card Layout Matching Image 1) */}
            {filteredArticles.length > 0 ? (
              <>
                <div className="divide-y divide-slate-200/90 border-t border-slate-200/90">
                  {paginatedArticles.map((art) => {
                    const articleUrl = getArticleUrl(art);
                    const authorName = art.author?.name || 'UNITED STATES TODAY';
                    return (
                      <article
                        key={art.id}
                        className="py-6 sm:py-7 flex items-start justify-between gap-5 sm:gap-7 group"
                      >
                        {/* Left: Article Details */}
                        <div className="flex-1 min-w-0 pr-1">
                          <Link href={articleUrl} className="group-hover:text-[#1642D0] transition-colors">
                            <h3 className="font-serif font-bold text-lg sm:text-xl lg:text-[22px] text-[#020618] group-hover:text-[#1642D0] transition-colors leading-snug line-clamp-2 my-0">
                              {art.title}
                            </h3>
                          </Link>

                          {art.excerpt && (
                            <p className="text-xs sm:text-sm text-slate-600 font-serif leading-relaxed line-clamp-2 mt-2.5 my-0">
                              {art.excerpt}
                            </p>
                          )}

                          <div className="mt-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 font-sans flex items-center gap-1.5">
                            <span className="text-slate-400 font-medium">BY</span>
                            <span className="text-slate-800 hover:text-[#1642D0] transition-colors">
                              {authorName.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Right: Article Thumbnail Image */}
                        <Link
                          href={articleUrl}
                          className="w-28 h-20 sm:w-36 sm:h-24 md:w-44 md:h-28 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60 shadow-2xs group-hover:opacity-95 transition-opacity"
                        >
                          <img
                            src={art.imageUrl || '/images/topic-hero-leaders.jpg'}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/images/topic-hero-leaders.jpg';
                            }}
                          />
                        </Link>
                      </article>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-200 text-xs font-semibold font-sans">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={safePage <= 1}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <span className="text-slate-500 font-medium">
                      Page {safePage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={safePage >= totalPages}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* No Results State */
              <div className="py-12 px-6 bg-slate-50 border border-slate-200/80 rounded-2xl text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-slate-200/70 text-slate-500 flex items-center justify-center mx-auto">
                  <SearchX className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#020618] my-0">
                  No articles found
                </h3>
                <p className="text-sm text-slate-600 font-sans max-w-md mx-auto">
                  We couldn't find any articles matching <span className="font-bold text-slate-900">"{query}"</span>. Try another keyword or explore the trending topics on the right.
                </p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-5 py-2.5 bg-[#020618] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  View All Articles
                </button>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Trending Topics                             */}
          {/* ========================================================= */}
          <aside className="lg:col-span-4 xl:col-span-4 w-full lg:pl-6 lg:border-l lg:border-slate-200/80">
            {/* Trending Topics Heading with Upward Trend Icon */}
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-slate-900 stroke-[2.2]" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] tracking-tight my-0">
                Trending Topics:
              </h2>
            </div>

            {/* Vertical Pill / Capsule Buttons Matching Image 1 */}
            <div className="flex flex-col gap-3 max-w-xs">
              {TRENDING_TOPICS.map((topic) => {
                const isActive = query.trim().toLowerCase() === topic.toLowerCase();
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleCategoryClick(topic)}
                    className={`w-full py-2.5 px-6 rounded-full border text-sm font-serif font-semibold text-center transition-all cursor-pointer shadow-2xs ${
                      isActive
                        ? 'bg-[#020618] text-white border-[#020618] shadow-sm'
                        : 'bg-white text-slate-800 border-slate-300 hover:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </aside>

        </div>
      </main>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
