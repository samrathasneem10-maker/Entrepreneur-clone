'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Search, X, TrendingUp, ArrowRight, FileText, User } from 'lucide-react';
import { getArticleUrl, type Article } from '@/data/newsData';

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

// Baseline registered real workspace users (writers, admins, default admin, readers)
const REAL_USERS_REGISTRY: AuthorItem[] = [
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

    // Fetch only published articles directly from database API (no demo articles)
    fetch('/api/articles?status=published&limit=200')
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data?.success && Array.isArray(data.data)) {
          const published = data.data.filter(
            (a: any) => a.status === 'published' && !isDemoArticle(a)
          );
          setDbPublishedArticles(published);

          // Extract any dynamic authors from published articles (excluding demo writers)
          const authorMap = new Map<string, AuthorItem>();
          published.forEach((a: any) => {
            const name = a.author?.name || a.authorName;
            if (name && typeof name === 'string' && name.trim().length > 1) {
              const cleanName = name.trim();
              const slug = cleanName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
              if (!isDemoAuthor({ name: cleanName, slug }) && !authorMap.has(slug)) {
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

    // Fetch real writer users directly from database API (excluding demo writers)
    fetch('/api/authors')
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data?.success && Array.isArray(data.data)) {
          setRealWriters(data.data.filter((auth: any) => !isDemoAuthor(auth)));
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

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
    const map = new Map<string, AuthorItem>();
    // 1. Priority 1: Real users from database API
    realWriters.forEach((auth) => {
      if (auth.slug && !isDemoAuthor(auth)) {
        map.set(auth.slug, auth);
      }
    });
    // 2. Priority 2: Registered real users baseline
    REAL_USERS_REGISTRY.forEach((auth) => {
      if (!isDemoAuthor(auth) && !map.has(auth.slug)) {
        map.set(auth.slug, auth);
      }
    });
    return Array.from(map.values());
  }, [realWriters]);

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
      className="fixed inset-0 z-50 bg-white flex flex-col w-full h-full min-h-screen overflow-hidden animate-in fade-in duration-150"
    >
      <div
        className="relative w-full h-full flex flex-col bg-white overflow-hidden"
      >
        {/* ========================================================= */}
        {/* TOP SEARCH BAR & FILTER TABS (Header - Full Screen)       */}
        {/* ========================================================= */}
        <div className="w-full border-b border-slate-100 shrink-0 bg-white">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 sm:py-6">
            {/* Search Input Row */}
            <div className="relative flex items-center w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, authors, topics..."
                className="w-full pl-12 pr-20 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1642D0] focus:ring-1 focus:ring-[#1642D0] transition-all"
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
            <div className="flex items-center gap-2 mt-4">
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
        </div>

        {/* ========================================================= */}
        {/* SCROLLABLE RESULTS BODY (Full Screen Container)           */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">
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
                            {/* Circular Avatar: Photo if custom avatar exists, otherwise starting letter of name */}
                            {author.avatar &&
                            !author.avatar.includes('user-avatar-butterfly') &&
                            !author.avatar.includes('author-placeholder') ? (
                              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <img
                                  src={author.avatar}
                                  alt={author.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const parent = (e.currentTarget as HTMLElement).parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<span class="w-full h-full bg-[#1642D0] text-white flex items-center justify-center font-bold text-base sm:text-lg select-none">${(author.name || 'A').trim().charAt(0).toUpperCase()}</span>`;
                                    }
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1642D0] text-white flex items-center justify-center font-serif font-black text-base sm:text-lg shrink-0 border border-blue-900/10 select-none shadow-2xs">
                                {(author.name || 'A').trim().charAt(0).toUpperCase()}
                              </div>
                            )}

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
        </div>

        {/* ========================================================= */}
        {/* FOOTER BAR (Enter to search, Esc to close, Branding)       */}
        {/* ========================================================= */}
        <div className="w-full bg-slate-50/90 border-t border-slate-100 shrink-0 select-none">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs text-slate-400">
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
    </div>
  );

  return createPortal(modalContent, document.body);
};
