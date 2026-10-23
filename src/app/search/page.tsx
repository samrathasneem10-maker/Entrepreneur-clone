'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, SearchX, ChevronLeft, ChevronRight, Sparkles, Clock, User } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { searchArticles, ALL_ARTICLES, Article, getArticleUrl } from '@/data/newsData';
import { SearchSkeleton } from '@/components/skeletons/SearchSkeleton';

const POPULAR_SEARCH_TAGS = [
  'Business News',
  'AI',
  'Technology',
  'Leadership',
  'Startups',
  'Marketing',
  'Finance',
  'Economy',
  'Innovation',
  'Side Hustles',
  'International',
  'Research',
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Sync state if URL search query changes
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

  const handleTagClick = (tag: string) => {
    handleQueryChange(tag);
  };

  // Filtered articles
  const filteredArticles = searchArticles(query);

  // Pagination logic
  const ARTICLES_PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  // Fallback suggested articles if no results match
  const suggestedArticles = ALL_ARTICLES.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Sticky Main Navigation Header */}
      <Header />

      {/* Breadcrumb Navigation Line */}
      <div className="bg-slate-50/80 border-b border-slate-200 py-2.5 px-5 lg:px-10 text-xs text-slate-600 font-sans">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#1642D0] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold uppercase tracking-wider">
            Search
          </span>
        </div>
      </div>

      {/* 1. SEARCH HERO SECTION */}
      <section className="bg-slate-50/90 border-b border-slate-200 py-10 md:py-14 px-5 lg:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#020618] tracking-tight my-0">
            Search
          </h1>

          {/* Large Centered Search Box (Max Width ~900px) */}
          <div className="relative max-w-[900px] mx-auto">
            <div className="p-[3px] bg-gradient-to-r from-[#1642D0] via-blue-600 to-indigo-700 rounded-2xl shadow-lg">
              <div className="relative flex items-center bg-white rounded-[13px]">
                <Search className="w-6 h-6 text-slate-400 absolute left-4 sm:left-5 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search articles, topics, authors..."
                  className="w-full py-4 sm:py-4.5 pl-13 sm:pl-14 pr-12 text-base sm:text-lg font-medium text-slate-900 rounded-[13px] focus:outline-none placeholder:text-slate-400"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={handleClear}
                    className="absolute right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                    aria-label="Clear search query"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Popular / Trending Search Tags Chips */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1642D0]" />
              Popular Searches
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {POPULAR_SEARCH_TAGS.map((tag) => {
                const isActive = query.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1642D0] text-white border-[#1642D0] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-[#1642D0] hover:text-[#1642D0] hover:bg-slate-50'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN RESULTS AREA */}
      <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Results Count Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#020618] my-0">
              {query.trim() ? (
                <>
                  Results for <span className="text-[#1642D0]">"{query}"</span>
                </>
              ) : (
                'Trending & Featured Articles'
              )}
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
            </p>
          </div>

          {query && (
            <button
              onClick={handleClear}
              className="text-xs font-bold text-slate-600 hover:text-[#1642D0] underline transition-colors cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Real-time Results Grid (3 columns on Desktop, 2 on Tablet, 1 on Mobile) */}
        {filteredArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedArticles.map((art) => (
                <Link
                  key={art.id}
                  href={getArticleUrl(art)}
                  className="group bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail Image */}
                    {art.imageUrl && (
                      <div className="w-full aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Category Tag */}
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#1642D0] font-sans block pt-1">
                      {art.category}
                    </span>

                    {/* Article Title */}
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all leading-snug line-clamp-2 my-0">
                      {art.title}
                    </h3>

                    {/* Article Excerpt / Short Description */}
                    {art.excerpt && (
                      <p className="text-xs sm:text-sm text-slate-700 font-serif font-normal leading-relaxed line-clamp-2">
                        {art.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Metadata Footer */}
                  <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500 font-sans font-normal">
                    <span>{art.date || '2h ago'}</span>
                    <span className="text-slate-400">•</span>
                    <span>{art.readTime || '4 min read'}</span>
                  </div>

                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10 mt-6 border-t border-slate-200 text-xs font-bold font-sans">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-9.5 h-9.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#1642D0] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-[#1642D0] hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* 3. NO RESULTS STATE */
          <div className="space-y-12">
            <div className="text-center py-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-200/70 text-slate-500 flex items-center justify-center mx-auto">
                <SearchX className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] my-0">
                  No articles found
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-sans">
                  We couldn't find any articles matching <span className="font-bold text-slate-900">"{query}"</span>. Try another keyword or explore suggested topics below.
                </p>
              </div>
              <button
                onClick={handleClear}
                className="px-5 py-2.5 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                Clear Search
              </button>
            </div>

            {/* Suggested Articles Section */}
            <div className="space-y-6 pt-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-xl font-serif font-bold text-[#020618] my-0">
                  Suggested Articles for You
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/article/${art.id}`}
                    className="group bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {art.imageUrl && (
                        <div className="w-full aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60">
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <span className="text-xs font-extrabold uppercase tracking-widest text-[#1642D0] font-sans block">
                        {art.category}
                      </span>
                      <h4 className="text-base font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[2px] transition-all leading-snug line-clamp-2 my-0">
                        {art.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
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
