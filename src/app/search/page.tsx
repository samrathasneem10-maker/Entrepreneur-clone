'use client';

import React, { useState, useEffect, useTransition, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, SearchX, ChevronLeft, ChevronRight, TrendingUp, ArrowRight } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { Article, getArticleUrl } from '@/data/newsData';
import { SearchSkeleton } from '@/components/skeletons/SearchSkeleton';

// 8 Main Categories captured from the Homepage Top Bar navigation
const TRENDING_TOPICS = [
  'Breaking News',
  'Markets & Investing',
  'Economy & Policy',
  'Corporate News',
  'Startups & Entrepreneurship',
  'Banking & Finance',
  'Technology & AI',
  'Real Estate & Property',
];

interface AuthorProfileItem {
  name: string;
  slug: string;
  role: string;
  badge: string;
  avatar: string;
  bio?: string;
}

const REAL_USERS_REGISTRY: AuthorProfileItem[] = [
  {
    name: 'Samra Thasneem',
    slug: 'samra-thasneem',
    role: 'Staff Writer',
    badge: 'United States Today Staff',
    avatar: '/uploads/upload_1795460148898_modern-muslim-woman-hijab-office-room_285396-11089.webp',
    bio: 'Executive business contributor at United States Today.',
  },
  {
    name: 'mishal',
    slug: 'mishal',
    role: 'Staff Writer',
    badge: 'United States Today Staff',
    avatar: '',
    bio: 'Staff Writer at United States Today.',
  },
  {
    name: 'fathima',
    slug: 'fathima',
    role: 'Staff Writer',
    badge: 'United States Today Staff',
    avatar: '',
    bio: 'Staff Writer at United States Today.',
  },
  {
    name: 'Mohamed Azmy Mohamed Akram',
    slug: 'mohamed-azmy-mohamed-akram',
    role: 'Default Administrator',
    badge: 'United States Today Staff',
    avatar: '',
    bio: 'Default Administrator at United States Today.',
  },
  {
    name: 'samra admin',
    slug: 'samra-admin',
    role: 'Administrator',
    badge: 'United States Today Staff',
    avatar: '/uploads/upload_1795317297120_modern-muslim-woman-hijab-office-room_285396-11089.webp',
    bio: 'Administrator at United States Today.',
  },
  {
    name: 'Samra Admin User',
    slug: 'samra-admin-user',
    role: 'Administrator',
    badge: 'United States Today Staff',
    avatar: '/uploads/upload_1794438116018_images.webp',
    bio: 'Administrator at United States Today.',
  },
  {
    name: 'Samra Thasneem',
    slug: 'samra-thasneem-reader',
    role: 'Reader',
    badge: 'Community Member',
    avatar: '/uploads/avatar_1793493350773_c.jpg',
    bio: 'Reader and active community member at United States Today.',
  },
  {
    name: 'fathi samra',
    slug: 'fathi-samra',
    role: 'Reader',
    badge: 'Community Member',
    avatar: '',
    bio: 'Reader and community member at United States Today.',
  },
  {
    name: 'ABD',
    slug: 'abd',
    role: 'Reader',
    badge: 'Community Member',
    avatar: '',
    bio: 'Reader and community member at United States Today.',
  },
];

function isDemoArticle(art: any): boolean {
  if (!art) return false;
  const title = (art.title || '').trim().toLowerCase();
  const author = (art.author?.name || art.authorName || '').trim().toLowerCase();

  if (
    title.startsWith('test ') ||
    title.startsWith('debug ') ||
    title.startsWith('currently, the pending') ||
    title === 'test' ||
    title === 'debug'
  ) {
    return true;
  }

  const demoAuthors = [
    'writer',
    'writer account',
    'alex writer',
    'kalid writer user',
    'jordan contributor',
  ];

  if (demoAuthors.includes(author)) {
    return true;
  }

  return false;
}

function isDemoAuthor(auth: any): boolean {
  if (!auth) return false;
  const name = (auth.name || '').trim().toLowerCase();
  const slug = (auth.slug || '').trim().toLowerCase();

  const demoIdentifiers = [
    'writer',
    'writer-account',
    'writer account',
    'alex-writer',
    'alex writer',
    'kalid-writer-user',
    'kalid writer user',
    'jordan-contributor',
    'jordan contributor',
  ];

  return demoIdentifiers.includes(name) || demoIdentifiers.includes(slug);
}

type EntityTab = 'All' | 'Articles' | 'Authors';

const ARTICLES_PER_PAGE = 12;

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [entityFilter, setEntityFilter] = useState<EntityTab>('All');
  const [dbPublishedArticles, setDbPublishedArticles] = useState<Article[]>([]);
  const [dbAuthors, setDbAuthors] = useState<AuthorProfileItem[]>([]);
  const [, startTransition] = useTransition();

  // Sync state if URL query changes externally
  useEffect(() => {
    setQuery(initialQuery);
    setCurrentPage(1);
  }, [initialQuery]);

  // Fetch published articles from database API
  useEffect(() => {
    fetch('/api/articles?status=published&limit=200')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setDbPublishedArticles(
            data.data.filter((a: any) => a.status === 'published' && !isDemoArticle(a))
          );
        }
      })
      .catch(() => {});
  }, []);

  // Fetch real writer users directly from database authors API
  useEffect(() => {
    fetch('/api/authors')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setDbAuthors(data.data.filter((auth: any) => !isDemoAuthor(auth)));
        }
      })
      .catch(() => {});
  }, []);

  // Combined published articles (deduplicated by id/slug) - ONLY real DB published articles
  const allPublishedArticles = useMemo(() => {
    const map = new Map<string, Article>();
    dbPublishedArticles.forEach((art) => {
      if (isDemoArticle(art)) return;
      const key = art.slug || art.id;
      if (key) map.set(key, art);
    });
    return Array.from(map.values());
  }, [dbPublishedArticles]);

  // Real workspace users: writers, admins, default admin, readers
  const allAuthors = useMemo(() => {
    const map = new Map<string, AuthorProfileItem>();
    // 1. Priority 1: Users from database API
    dbAuthors.forEach((auth) => {
      if (auth.slug && !isDemoAuthor(auth)) map.set(auth.slug, auth);
    });
    // 2. Priority 2: Registered real users baseline
    REAL_USERS_REGISTRY.forEach((auth) => {
      if (!isDemoAuthor(auth) && !map.has(auth.slug)) {
        map.set(auth.slug, auth);
      }
    });
    return Array.from(map.values());
  }, [dbAuthors]);

  // Filtered articles (All Time, no time filter restrictions)
  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPublishedArticles.filter((art) => {
      if (!q) return true;
      const title = (art.title || '').toLowerCase();
      const excerpt = (art.excerpt || '').toLowerCase();
      const cat = (art.category || '').toLowerCase();
      const auth = (art.author?.name || '').toLowerCase();
      return title.includes(q) || excerpt.includes(q) || cat.includes(q) || auth.includes(q);
    });
  }, [allPublishedArticles, query]);

  // Filtered authors
  const filteredAuthors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allAuthors;
    return allAuthors.filter((auth) => {
      const name = auth.name.toLowerCase();
      const role = auth.role.toLowerCase();
      const badge = auth.badge.toLowerCase();
      const bio = (auth.bio || '').toLowerCase();
      return name.includes(q) || role.includes(q) || badge.includes(q) || bio.includes(q);
    });
  }, [allAuthors, query]);

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

      {/* Main Full-Page Search Container (Matching Image 1) */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10">
        {/* Search Bar Section (Image 1 Layout) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#020618] tracking-tight shrink-0 my-0">
            Search
          </h1>
          <div className="relative flex-1">
            <div className="flex items-center bg-white border border-slate-300 focus-within:border-[#020618] rounded-lg px-4 py-2.5 sm:py-3 transition-colors shadow-2xs">
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full text-sm sm:text-base text-slate-800 placeholder:text-slate-400 font-normal outline-none bg-transparent"
                autoFocus
              />
              {query ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer ml-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1 stroke-[2]" />
              )}
            </div>
          </div>
        </div>

        {/* Filter Navigation Row: All / Articles / Authors | Categories (Image 1 Layout, Without Time Filters) */}
        <div className="flex items-center gap-1.5 sm:gap-2 pb-3.5 border-b border-slate-200 overflow-x-auto no-scrollbar mb-8">
          {(['All', 'Articles', 'Authors'] as const).map((tab) => {
            const isActive = entityFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setEntityFilter(tab);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 select-none ${
                  isActive
                    ? 'bg-[#020618] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab}
              </button>
            );
          })}

          <div className="w-[1px] h-5 bg-slate-300 mx-1.5 shrink-0" />

          {TRENDING_TOPICS.map((cat) => {
            const isSelected = query.trim().toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 select-none ${
                  isSelected
                    ? 'bg-[#1642D0] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Header Count */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
            {entityFilter === 'Authors'
              ? `${filteredAuthors.length} AUTHOR${filteredAuthors.length !== 1 ? 'S' : ''}`
              : `${filteredArticles.length} PUBLISHED ARTICLE${filteredArticles.length !== 1 ? 'S' : ''}`}
          </span>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: AUTHORS TAB                                       */}
        {/* ========================================================= */}
        {entityFilter === 'Authors' ? (
          filteredAuthors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredAuthors.map((author) => (
                <Link
                  key={author.slug}
                  href={`/author/${author.slug}`}
                  className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-200/90 hover:border-[#1642D0] hover:shadow-xs bg-white transition-all group"
                >
                  {author.avatar &&
                  !author.avatar.includes('user-avatar-butterfly') &&
                  !author.avatar.includes('author-placeholder') ? (
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200 bg-slate-100"
                      onError={(e) => {
                        const parent = (e.currentTarget as HTMLElement).parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="w-12 h-12 rounded-full bg-[#1642D0] text-white flex items-center justify-center font-bold text-lg select-none">${(author.name || 'A').trim().charAt(0).toUpperCase()}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#1642D0] text-white flex items-center justify-center font-serif font-black text-lg shrink-0 border border-blue-900/10 select-none shadow-2xs">
                      {(author.name || 'A').trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900 group-hover:text-[#1642D0] truncate my-0">
                      {author.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate my-0 mt-0.5">
                      {author.role}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 block">
                      {author.badge}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1642D0] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 px-6 bg-slate-50 border border-slate-200/80 rounded-2xl text-center space-y-3">
              <h3 className="text-lg font-serif font-bold text-[#020618] my-0">No authors found</h3>
              <p className="text-xs text-slate-600">No author profiles match "{query}".</p>
            </div>
          )
        ) : (
          /* ========================================================= */
          /* VIEW 2: ARTICLES (AND ALL) TAB - FULL-PAGE 3-COL GRID     */
          /* ========================================================= */
          filteredArticles.length > 0 ? (
            <>
              {/* If in All tab and query matches authors, display top author previews */}
              {entityFilter === 'All' && query.trim() && filteredAuthors.length > 0 && (
                <div className="mb-8 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 font-sans">
                      MATCHING AUTHORS ({filteredAuthors.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEntityFilter('Authors');
                        setCurrentPage(1);
                      }}
                      className="text-xs font-semibold text-[#1642D0] hover:underline cursor-pointer"
                    >
                      View all in Authors →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {filteredAuthors.slice(0, 4).map((author) => (
                      <Link
                        key={author.slug}
                        href={`/author/${author.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-[#1642D0] hover:shadow-xs transition-all group"
                      >
                        {author.avatar &&
                        !author.avatar.includes('user-avatar-butterfly') &&
                        !author.avatar.includes('author-placeholder') ? (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 bg-slate-100"
                            onError={(e) => {
                              const parent = (e.currentTarget as HTMLElement).parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="w-10 h-10 rounded-full bg-[#1642D0] text-white flex items-center justify-center font-bold text-sm select-none">${(author.name || 'A').trim().charAt(0).toUpperCase()}</span>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#1642D0] text-white flex items-center justify-center font-serif font-black text-sm shrink-0 border border-blue-900/10 select-none shadow-2xs">
                            {(author.name || 'A').trim().charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-serif font-bold text-slate-900 group-hover:text-[#1642D0] truncate my-0">
                            {author.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate my-0 mt-0.5">
                            {author.role}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1642D0] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Full-Page Responsive 3-Column Articles Grid (Image 1 Layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {paginatedArticles.map((art) => {
                  const articleUrl = getArticleUrl(art);
                  const authorName = art.author?.name || 'UNITED STATES TODAY';
                  return (
                    <Link
                      key={art.id}
                      href={articleUrl}
                      className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-xs bg-white transition-all group"
                    >
                      {/* Left: Article Details */}
                      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between self-stretch">
                        <div>
                          <h3 className="font-serif font-bold text-sm sm:text-base text-[#020618] group-hover:text-[#1642D0] transition-colors leading-snug line-clamp-3 my-0">
                            {art.title}
                          </h3>
                          {art.excerpt && (
                            <p className="text-xs text-slate-500 font-serif leading-relaxed line-clamp-2 mt-2 my-0">
                              {art.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="mt-3">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1642D0] block">
                            {art.category}
                          </span>
                          <div className="text-[11px] text-slate-400 font-sans mt-0.5 flex items-center gap-1.5">
                            <span>{authorName}</span>
                            {art.date && (
                              <>
                                <span>•</span>
                                <span>{art.date}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Article Thumbnail */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200/70 shadow-2xs group-hover:opacity-95 transition-opacity">
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
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Full-Width Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-8 mt-10 border-t border-slate-200 text-xs font-semibold font-sans">
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
            query.trim() && filteredAuthors.length > 0 ? (
              <div className="space-y-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 font-sans block">
                        MATCHING AUTHORS ({filteredAuthors.length})
                      </span>
                      <p className="text-xs text-slate-500 my-0 mt-0.5">
                        No published articles matched "{query}", but we found {filteredAuthors.length} matching author profile{filteredAuthors.length !== 1 ? 's' : ''}:
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEntityFilter('Authors');
                        setCurrentPage(1);
                      }}
                      className="text-xs font-semibold text-[#1642D0] hover:underline cursor-pointer shrink-0 ml-2"
                    >
                      View all in Authors →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {filteredAuthors.map((author) => (
                      <Link
                        key={author.slug}
                        href={`/author/${author.slug}`}
                        className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#1642D0] hover:shadow-xs transition-all group"
                      >
                        {author.avatar &&
                        !author.avatar.includes('user-avatar-butterfly') &&
                        !author.avatar.includes('author-placeholder') ? (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200 bg-slate-100"
                            onError={(e) => {
                              const parent = (e.currentTarget as HTMLElement).parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="w-11 h-11 rounded-full bg-[#1642D0] text-white flex items-center justify-center font-bold text-base select-none">${(author.name || 'A').trim().charAt(0).toUpperCase()}</span>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#1642D0] text-white flex items-center justify-center font-serif font-black text-base shrink-0 border border-blue-900/10 select-none shadow-2xs">
                            {(author.name || 'A').trim().charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-serif font-bold text-slate-900 group-hover:text-[#1642D0] truncate my-0">
                            {author.name}
                          </h4>
                          <p className="text-xs text-slate-500 truncate my-0 mt-0.5">
                            {author.role}
                          </p>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 block">
                            {author.badge}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1642D0] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
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
                  We couldn't find any published articles matching <span className="font-bold text-slate-900">"{query}"</span>. Try another keyword or select a category above.
                </p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-5 py-2.5 bg-[#020618] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  View All Articles
                </button>
              </div>
            )
          )
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
