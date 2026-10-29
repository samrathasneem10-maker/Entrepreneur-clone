'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { Clock, User, ArrowRight, Sparkles, Filter, ChevronRight } from 'lucide-react';

interface ArticleItem {
  id: string | number;
  dbId?: number;
  slug?: string;
  title: string;
  category: string;
  author?: {
    name: string;
    avatar?: string;
    title?: string;
  };
  date: string;
  readTime?: string;
  excerpt?: string;
  imageUrl: string;
}

const CATEGORIES = [
  'All',
  'Business',
  'Startups',
  'Leadership',
  'Technology',
  'Finance',
  'Economy',
  'Marketing',
];

export default function LatestArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 12;

  const fetchArticles = async (pageNum = 1, cat = selectedCategory, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let url = `/api/articles?status=published&page=${pageNum}&limit=${pageSize}`;
      if (cat !== 'All') {
        url += `&category=${encodeURIComponent(cat)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data?.success && Array.isArray(data.data)) {
        if (append) {
          setArticles((prev) => [...prev, ...data.data]);
        } else {
          setArticles(data.data);
        }
        setPage(data.page || pageNum);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || data.data.length);
        setHasMore(Boolean(data.hasMore));
      }
    } catch {
      // Handle error gracefully
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchArticles(1, selectedCategory, false);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchArticles(page + 1, selectedCategory, true);
  };

  const handlePageChange = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    fetchArticles(pageNum, selectedCategory, false);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <Header />

      <main className="flex-1 w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-12">
        
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1642D0] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Real-Time Editorial Stream</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Latest Business News &amp; Articles
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl font-sans">
              Browse the latest published stories, case studies, and strategic playbooks. Newest articles appear first.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 font-sans self-start md:self-auto">
            Showing <span className="font-bold text-slate-900">{articles.length}</span> of <span className="font-bold text-slate-900">{total}</span> published articles
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#1642D0] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid (Responsive cards) */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600">Loading published articles from database...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white p-8 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-2">No articles found</h3>
            <p className="text-xs text-slate-500 mb-6">
              No published articles match category &ldquo;{selectedCategory}&rdquo; at this moment.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-5 py-2.5 bg-[#1642D0] text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
            >
              View All Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 items-stretch">
            {articles.map((art) => (
              <article
                key={art.slug || art.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Image */}
                  <Link
                    href={`/article/${art.slug || art.id}`}
                    className="block relative aspect-[16/10] overflow-hidden bg-slate-100"
                  >
                    <img
                      src={art.imageUrl || '/images/coding-agents.jpg'}
                      alt={art.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/topic-hero-leaders.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#1642D0] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs font-sans">
                      {art.category}
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col gap-2.5">
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-900 leading-snug group-hover:text-[#1642D0] transition-colors line-clamp-2">
                      <Link href={`/article/${art.slug || art.id}`}>
                        {art.title}
                      </Link>
                    </h2>

                    {art.excerpt && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 font-sans leading-relaxed">
                        {art.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer: Author + Date */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={art.author?.avatar || '/images/author-sherin.png'}
                      alt={art.author?.name || 'Staff Contributor'}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="font-semibold text-slate-800 truncate text-[11px]">
                      {art.author?.name || 'Staff Contributor'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-slate-400">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime || '5 min'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination & Load More Controls */}
        {articles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-sans">
              Showing <span className="font-bold text-slate-900">{articles.length}</span> of{' '}
              <span className="font-bold text-slate-900">{total}</span> published articles {totalPages > 1 && `(Page ${page} of ${totalPages})`}
            </div>

            <div className="flex items-center gap-3">
              {hasMore && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 bg-[#1642D0] hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingMore && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{loadingMore ? 'Loading Articles...' : 'Load More Articles'}</span>
                </button>
              )}

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - page) <= 1) {
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                            pageNum === page
                              ? 'bg-[#1642D0] text-white shadow-2xs'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === 2 && page > 3) {
                      return <span key="dots-1" className="text-slate-400 text-xs px-1">...</span>;
                    }
                    if (pageNum === totalPages - 1 && page < totalPages - 2) {
                      return <span key="dots-2" className="text-slate-400 text-xs px-1">...</span>;
                    }
                    return null;
                  })}

                  <button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
