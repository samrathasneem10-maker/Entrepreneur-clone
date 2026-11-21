'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Search, X, TrendingUp, ArrowRight, FileText, User } from 'lucide-react';
import { ALL_ARTICLES, getArticleUrl, type Article } from '@/data/newsData';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuthorItem {
  name: string;
  slug: string;
  role: string;
  badge: string;
  avatar: string;
  bio?: string;
}

// 8 Main Categories captured from the Homepage Top Bar navigation
export const TOP_BAR_MAIN_CATEGORIES = [
  'Breaking News',
  'Markets & Investing',
  'Economy & Policy',
  'Corporate News',
  'Startups & Entrepreneurship',
  'Banking & Finance',
  'Technology & AI',
  'Real Estate & Property',
];

// Baseline registered real authors mapping to their exact author pages (/author/[slug])
const AUTHORS_REGISTRY: AuthorItem[] = [
  {
    name: 'Samra',
    slug: 'samra',
    role: 'Staff Writer',
    badge: 'United States Today Staff',
    avatar: '/uploads/upload_1794590868177_images__1_.webp',
    bio: 'Executive business contributor at United States Today.',
  },
  {
    name: 'mishal',
    slug: 'mishal',
    role: 'Staff Writer',
    badge: 'United States Today Staff',
    avatar: '/images/user-avatar-butterfly.png',
    bio: 'Writer User at United States Today.',
  },
  {
    name: 'Writer',
    slug: 'writer',
    role: 'Staff Writer',
    badge: 'United States Today Staff',
    avatar: '/images/user-avatar-butterfly.png',
    bio: 'Staff Writer at United States Today.',
  },
  {
    name: 'Fathima Samra',
    slug: 'fathima-samra',
    role: 'Staff Writer',
    badge: 'United States Today Staff',
    avatar: '/images/user-avatar-butterfly.png',
    bio: 'Staff Writer at United States Today.',
  },
  {
    name: 'fathima',
    slug: 'fathima',
    role: 'Staff Writer',
    badge: 'United States Today Staff',
    avatar: '/images/user-avatar-butterfly.png',
    bio: 'Staff Writer at United States Today.',
  },
  {
    name: 'System Administrator',
    slug: 'system-administrator',
    role: 'Editorial Director',
    badge: 'United States Today Editorial',
    avatar: '/uploads/upload_1794438116018_images.webp',
    bio: 'System Administrator and Editorial Director at United States Today.',
  },
  {
    name: 'Mohamed Azmy Mohamed Akram',
    slug: 'mohamed-azmy-mohamed-akram',
    role: 'Administrator',
    badge: 'United States Today Staff',
    avatar: '/images/user-avatar-butterfly.png',
    bio: 'Administrator at United States Today.',
  },
];

type EntityType = 'All' | 'Articles' | 'Authors';

export const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<EntityType>('All');
  const [dbPublishedArticles, setDbPublishedArticles] = useState<Article[]>([]);
  const [dbAuthors, setDbAuthors] = useState<AuthorItem[]>([]);
  const [realWriters, setRealWriters] = useState<AuthorItem[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle escape key and body scroll lock
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

  // Fetch only published articles directly from database API
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;

    // Fetch only published articles directly from database API
    fetch('/api/articles?status=published&limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data?.success && Array.isArray(data.data)) {
          const published = data.data.filter((a: any) => a.status === 'published');
          setDbPublishedArticles(published);

          // Extract any dynamic authors from published articles
          const authorMap = new Map<string, AuthorItem>();
          published.forEach((a: any) => {
            const name = a.author?.name || a.authorName;
            if (name && typeof name === 'string' && name.trim().length > 1) {
              const cleanName = name.trim();
              const slug = cleanName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
              if (!authorMap.has(slug)) {
                authorMap.set(slug, {
                  name: cleanName,
                  slug,
                  role: a.author?.title || 'Staff Contributor',
                  badge: 'United States Today Contributor',
                  avatar: a.author?.avatar || '/images/user-avatar-butterfly.png',
                  bio: a.author?.bio,
                });
              }
            }
          });
          setDbAuthors(Array.from(authorMap.values()));
        }
      })
      .catch(() => {});

    // Fetch real writer users directly from database API
    fetch('/api/authors')
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data?.success && Array.isArray(data.data)) {
          setRealWriters(data.data);
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  // Combined published articles (deduplicated by id/slug)
  const allPublishedArticles = useMemo(() => {
    const map = new Map<string, Article>();
    // First add DB published articles (source of truth)
    dbPublishedArticles.forEach((art) => {
      const key = art.slug || art.id;
      if (key) map.set(key, art);
    });
    // Next complement with static published articles if not already present
    ALL_ARTICLES.forEach((art) => {
      const key = art.slug || art.id;
      if (key && !map.has(key)) {
        map.set(key, art);
      }
    });
    return Array.from(map.values());
  }, [dbPublishedArticles]);

  // Combined authors list with Real Writer Users as top priority
  const allAuthors = useMemo(() => {
    const map = new Map<string, AuthorItem>();
    // 1. Priority 1: Real writer users from database API
    realWriters.forEach((auth) => {
      if (auth.slug) {
        map.set(auth.slug, auth);
      }
    });
    // 2. Priority 2: Registered baseline authors (including real writer fallback)
    AUTHORS_REGISTRY.forEach((auth) => {
      if (!map.has(auth.slug)) {
        map.set(auth.slug, auth);
      }
    });
    // 3. Priority 3: Dynamic authors extracted from DB published articles
    dbAuthors.forEach((auth) => {
      if (!map.has(auth.slug)) {
        map.set(auth.slug, auth);
      }
    });
    return Array.from(map.values());
  }, [realWriters, dbAuthors]);

  // Filtered published articles
  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPublishedArticles;
    return allPublishedArticles.filter((art) => {
      const title = (art.title || '').toLowerCase();
      const excerpt = (art.excerpt || '').toLowerCase();
      const cat = (art.category || '').toLowerCase();
      const auth = (art.author?.name || (art as any).authorName || '').toLowerCase();
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

  if (!isOpen || !mounted) return null;

  const handleCategoryClick = (catName: string) => {
    setQuery(catName);
    inputRef.current?.focus();
  };

  const hasQuery = query.trim().length > 0;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-[95vw] max-w-5xl h-[88vh] max-h-[90vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* TOP SEARCH BAR & FILTER TABS (Header)                      */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-6 pb-3.5 border-b border-slate-100 shrink-0 bg-white">
          {/* Search Input Row */}
          <div className="relative flex items-center w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, authors, topics..."
              className="w-full pl-12 pr-20 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1642D0] focus:ring-1 focus:ring-[#1642D0] transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-12 p-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer rounded-lg hover:bg-slate-200/60 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Navigation Tabs: All / Articles / Authors */}
          <div className="flex items-center gap-2 mt-3.5">
            {(['All', 'Articles', 'Authors'] as const).map((tab) => {
              const isActive = entityFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setEntityFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#020618] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SCROLLABLE RESULTS BODY                                   */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 space-y-6">
          {/* STATE 1: Empty Query -> Show 8 Trending Categories */}
          {!hasQuery && (
            <div className="space-y-3.5 pt-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span>Trending Categories</span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {TOP_BAR_MAIN_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-medium text-slate-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STATE 2: Query Present -> Show Articles & Authors based on filter */}
          {hasQuery && (
            <>
              {/* ARTICLES SECTION (Image 3 Washington Times Format) */}
              {(entityFilter === 'All' || entityFilter === 'Articles') && (
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 font-sans">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Articles</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {filteredArticles.length} results
                    </span>
                  </div>

                  {filteredArticles.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {filteredArticles.slice(0, 20).map((art) => {
                        const articleUrl = getArticleUrl(art);
                        const imageSrc =
                          art.imageUrl ||
                          (art as any).image ||
                          '/images/topic-hero-leaders.jpg';
                        const categoryName = art.category || 'General';
                        const authorName =
                          art.author?.name || (art as any).authorName || 'Staff';
                        const dateStr =
                          (art as any).publishedAt || art.date || 'Recent';

                        return (
                          <Link
                            key={art.id}
                            href={articleUrl}
                            onClick={onClose}
                            className="flex items-center gap-3.5 sm:gap-4 py-3 sm:py-3.5 px-2 rounded-xl hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          >
                            {/* Square Thumbnail */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                              <img
                                src={imageSrc}
                                alt={art.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    '/images/topic-hero-leaders.jpg';
                                }}
                              />
                            </div>

                            {/* Article Info */}
                            <div className="flex-1 min-w-0 pr-2">
                              {/* Dark Red Category Pill Badge */}
                              <span className="inline-block bg-[#990000] text-white text-[9.5px] font-bold uppercase px-2 py-0.5 rounded tracking-wide mb-1">
                                {categoryName}
                              </span>

                              {/* Headline */}
                              <h4 className="font-serif font-bold text-sm sm:text-[15px] text-gray-900 group-hover:text-[#1642D0] line-clamp-2 leading-snug transition-colors my-0">
                                {art.title}
                              </h4>

                              {/* Author & Date Meta */}
                              <p className="text-xs text-slate-400 mt-1 truncate my-0">
                                {authorName} · {dateStr}
                              </p>
                            </div>

                            {/* Right Hover Arrow */}
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1642D0] group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block" />
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      No articles found matching &quot;{query}&quot;
                    </div>
                  )}
                </div>
              )}

              {/* AUTHORS SECTION (Image 4 Washington Times Format) */}
              {(entityFilter === 'All' || entityFilter === 'Authors') && (
                <div className={entityFilter === 'All' ? 'pt-4' : ''}>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 font-sans">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Authors</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {filteredAuthors.length} results
                    </span>
                  </div>

                  {filteredAuthors.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {filteredAuthors.map((author) => {
                        return (
                          <Link
                            key={author.slug}
                            href={`/author/${author.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-3.5 sm:gap-4 py-3 sm:py-3.5 px-2 rounded-xl hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          >
                            {/* Circular Avatar */}
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              {author.avatar ? (
                                <img
                                  src={author.avatar}
                                  alt={author.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      '/images/user-avatar-butterfly.png';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-[#1642D0] text-white text-xs font-bold flex items-center justify-center uppercase">
                                  {author.name.charAt(0)}
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-sm sm:text-[15px] text-gray-900 group-hover:text-[#1642D0] transition-colors my-0">
                                  {author.name}
                                </h4>
                                {/* Dark Blue Role Badge */}
                                <span className="inline-block bg-[#1642D0] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
                                  {author.role === 'Administrator' ||
                                  author.role === 'Editorial Director'
                                    ? 'ADMIN'
                                    : 'WRITER'}
                                </span>
                              </div>

                              {/* Bio snippet */}
                              {author.bio && (
                                <p className="text-xs text-slate-500 line-clamp-1 sm:line-clamp-2 mt-1 my-0">
                                  {author.bio}
                                </p>
                              )}
                            </div>

                            {/* Right Hover Arrow */}
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1642D0] group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block" />
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      No authors found matching &quot;{query}&quot;
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ========================================================= */}
        {/* FOOTER BAR (Enter to search, Esc to close, Branding)       */}
        {/* ========================================================= */}
        <div className="px-5 sm:px-8 py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-sans text-slate-600">
                Enter
              </kbd>{' '}
              to search
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-sans text-slate-600">
                Esc
              </kbd>{' '}
              to close
            </span>
          </div>
          <div className="font-semibold text-slate-500 tracking-wide">
            United States Today
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
