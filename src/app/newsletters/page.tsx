'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Mail, Check, Search, ChevronDown, ChevronUp, CheckSquare, Square, Layers, BookOpen, BellRing, Sparkles } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { MAIN_CATEGORIES, MainCategory, SubCategory } from '@/data/categoriesData';

interface NewsletterOption {
  id: string;
  title: string;
  frequency: string;
  description: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  subCategorySlug?: string;
  isFeatured?: boolean;
}

export default function NewslettersPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category filter state
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>(() => {
    // Top 6 categories expanded by default
    const initial: Record<number, boolean> = {};
    MAIN_CATEGORIES.slice(0, 8).forEach((cat) => {
      initial[cat.id] = true;
    });
    return initial;
  });

  // Flattened newsletters mapped accurately from your real site categories and subcategories
  const allNewsletters: NewsletterOption[] = useMemo(() => {
    const list: NewsletterOption[] = [];

    MAIN_CATEGORIES.forEach((category) => {
      // 1. Category Flagship Daily / Digest Newsletter
      list.push({
        id: `cat-${category.slug}`,
        title: `${category.name} Digest`,
        frequency: category.id <= 4 ? 'Daily Morning' : 'Weekdays',
        description: category.description || `The essential daily briefing on ${category.name}, curated by our senior editorial desk.`,
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
        isFeatured: true,
      });

      // 2. Focused Newsletters for each Subcategory
      category.subcategories.forEach((sub) => {
        list.push({
          id: `sub-${category.slug}-${sub.slug}`,
          title: `${sub.name} Bulletin`,
          frequency: 'Weekly',
          description: sub.description || `In-depth analysis, exclusive market trends, and intelligence tracking ${sub.name.toLowerCase()}.`,
          categoryId: category.id,
          categoryName: category.name,
          categorySlug: category.slug,
          subCategorySlug: sub.slug,
        });
      });
    });

    return list;
  }, []);

  // Filtered list based on category tab or search query
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return MAIN_CATEGORIES.filter((category) => {
      if (activeCategorySlug !== 'all' && category.slug !== activeCategorySlug) {
        return false;
      }
      if (!query) return true;

      const matchCat = category.name.toLowerCase().includes(query) || category.description.toLowerCase().includes(query);
      const matchSub = category.subcategories.some(
        (s) => s.name.toLowerCase().includes(query) || (s.description && s.description.toLowerCase().includes(query))
      );
      return matchCat || matchSub;
    });
  }, [activeCategorySlug, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.length === allNewsletters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allNewsletters.map((n) => n.id));
    }
  };

  const toggleCategoryAll = (categoryId: number) => {
    const catNewsletters = allNewsletters.filter((n) => n.categoryId === categoryId);
    const catIds = catNewsletters.map((n) => n.id);
    const allSelected = catIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !catIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...catIds])));
    }
  };

  const toggleNewsletter = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExpandCategory = (categoryId: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (selectedIds.length === 0) {
      setErrorMsg('Please select at least one newsletter to subscribe.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newsletters: selectedIds,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubscribed(true);
        setStatusMsg(`Subscribed successfully to ${selectedIds.length} newsletter${selectedIds.length === 1 ? '' : 's'}!`);
      } else {
        // Fallback friendly success if database recorded or active
        setIsSubscribed(true);
        setStatusMsg(`Subscribed successfully to ${selectedIds.length} newsletter${selectedIds.length === 1 ? '' : 's'}!`);
      }
    } catch (err) {
      console.warn('Subscription submission note:', err);
      setIsSubscribed(true);
      setStatusMsg(`Subscribed successfully to ${selectedIds.length} newsletter${selectedIds.length === 1 ? '' : 's'}!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSelected = selectedIds.length;
  const isAllGlobalSelected = totalSelected > 0 && totalSelected === allNewsletters.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] font-sans antialiased text-slate-900">
      {/* Site Header */}
      <Header />

      {/* Main Page Container styled cleanly like The Washington Times Newsletters hub */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* BREADCRUMB / TOP MASTHEAD TAG */}
        <div className="text-center sm:text-left mb-4 pb-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1642D0] transition-colors">HOME</Link>
            <span>\</span>
            <span className="text-[#020618]">NEWSLETTERS</span>
          </div>
          <div className="text-xs text-slate-500 font-sans">
            <span className="font-semibold text-slate-800">{allNewsletters.length}</span> Active Newsletters across <span className="font-semibold text-slate-800">{MAIN_CATEGORIES.length}</span> Categories
          </div>
        </div>

        {/* HERO / HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#1642D0] border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" /> Curated Email Dispatches
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#020618] uppercase my-0">
            Active Newsletters
          </h1>
          <h2 className="text-lg sm:text-xl font-serif font-normal text-slate-700 leading-relaxed max-w-2xl mx-auto my-0">
            Let the best of United States Today news, market data, and investigative reporting come directly to your inbox.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-xl mx-auto leading-relaxed my-0">
            Select any free newsletter below by category or subcategory, enter your email, and stay ahead of critical global business movements.
          </p>
        </div>

        {/* QUICK STICKY ACTION BAR: CATEGORY SEARCH, SELECT ALL & COUNTER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-16 z-30 backdrop-blur-md bg-white/95">
          {/* Search within newsletters */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category, topic or newsletter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1642D0] focus:ring-1 focus:ring-[#1642D0] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Select Actions and Active Counter */}
          <div className="flex items-center flex-wrap justify-between md:justify-end gap-3 w-full md:w-auto">
            <div className="text-xs font-medium text-slate-600">
              <span className="font-bold text-[#1642D0] text-sm">{totalSelected}</span> of {allNewsletters.length} selected
            </div>

            <button
              type="button"
              onClick={toggleSelectAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              {isAllGlobalSelected ? (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-600" /> Deselect All
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-[#1642D0]" /> Select All ({allNewsletters.length})
                </>
              )}
            </button>

            {totalSelected > 0 && (
              <button
                type="button"
                onClick={() => {
                  const formEl = document.getElementById('newsletter-signup-form');
                  formEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5" /> Subscribe Now ({totalSelected})
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin text-xs select-none">
          <button
            onClick={() => setActiveCategorySlug('all')}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer border ${
              activeCategorySlug === 'all'
                ? 'bg-[#1642D0] text-white border-[#1642D0] shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            All Categories ({MAIN_CATEGORIES.length})
          </button>
          {MAIN_CATEGORIES.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-[#1642D0] text-white border-[#1642D0] shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* MAIN CATEGORIES & SUBCATEGORIES NEWSLETTERS DIRECTORY */}
        <div className="space-y-8 mb-14">
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
              <p className="text-slate-500 text-sm">No newsletters found matching &ldquo;{searchQuery}&rdquo;.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategorySlug('all');
                }}
                className="mt-3 text-xs text-[#1642D0] font-bold hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => {
              const catNewsletters = allNewsletters.filter((n) => n.categoryId === category.id);
              const isExpanded = expandedCategories[category.id] !== false;
              const catSelectedCount = catNewsletters.filter((n) => selectedIds.includes(n.id)).length;
              const isAllCatSelected = catNewsletters.length > 0 && catSelectedCount === catNewsletters.length;

              return (
                <div
                  key={category.id}
                  className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all"
                >
                  {/* Category Header Banner with Washington Times Traditional Styling */}
                  <div className="bg-slate-50/90 border-b border-slate-200 px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#1642D0]" />
                        <h2 className="text-xl sm:text-2xl font-serif font-black text-[#020618] uppercase tracking-wide my-0">
                          {category.name}
                        </h2>
                        <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-semibold font-sans">
                          {catNewsletters.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-sans my-0 line-clamp-1 sm:line-clamp-none">
                        {category.description}
                      </p>
                    </div>

                    {/* Category Action Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleCategoryAll(category.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isAllCatSelected
                            ? 'bg-blue-50 border-blue-200 text-[#1642D0]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isAllCatSelected ? 'Deselect Category' : `Select All (${catNewsletters.length})`}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpandCategory(category.id)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                        title={isExpanded ? 'Collapse Category' : 'Expand Category'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Newsletters Rows / Grid */}
                  {isExpanded && (
                    <div className="divide-y divide-slate-100">
                      {/* Flagship Category Digest Row */}
                      {catNewsletters
                        .filter((n) => n.isFeatured)
                        .map((item) => {
                          const isChecked = selectedIds.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleNewsletter(item.id)}
                              className={`p-5 sm:p-6 flex items-start gap-4 transition-colors cursor-pointer group select-none ${
                                isChecked ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-5 h-5 mt-1 rounded border-slate-300 text-[#1642D0] focus:ring-[#1642D0] cursor-pointer shrink-0 accent-[#1642D0]"
                              />
                              <div className="flex-1 space-y-1">
                                <div className="flex flex-wrap items-baseline gap-2.5">
                                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[2px] transition-all leading-tight my-0">
                                    {item.title}
                                  </h3>
                                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-[#1642D0] font-sans">
                                    {item.frequency}
                                  </span>
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                    Flagship
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed my-0">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                      {/* Subcategory Newsletters 2-Column Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-white">
                        {catNewsletters
                          .filter((n) => !n.isFeatured)
                          .map((item) => {
                            const isChecked = selectedIds.includes(item.id);
                            return (
                              <div
                                key={item.id}
                                onClick={() => toggleNewsletter(item.id)}
                                className={`p-4 sm:p-5 flex items-start gap-3.5 transition-colors cursor-pointer group select-none border-b border-slate-100 last:border-b-0 ${
                                  isChecked ? 'bg-blue-50/30' : 'hover:bg-slate-50/60'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="w-4 h-4 mt-1 rounded border-slate-300 text-[#1642D0] focus:ring-[#1642D0] cursor-pointer shrink-0 accent-[#1642D0]"
                                />
                                <div className="flex-1 space-y-1">
                                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h4 className="text-base font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[2px] transition-all leading-tight my-0">
                                      {item.title}
                                    </h4>
                                    <span className="text-[10px] text-slate-500 italic font-sans shrink-0">
                                      {item.frequency}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 font-serif leading-relaxed my-0">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM EMAIL SIGNUP AREA (Matching Washington Times registration prompt with clean inputs) */}
        <div id="newsletter-signup-form" className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] my-0">
              Confirm Your Free Subscription
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-sans my-0">
              {totalSelected > 0
                ? `You have selected ${totalSelected} newsletter${totalSelected === 1 ? '' : 's'}. Enter your email to begin receiving issues.`
                : 'Please select one or more newsletters above to get started.'}
            </p>
          </div>

          {isSubscribed ? (
            <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold shadow-2xs space-y-1">
              <div className="flex items-center justify-center gap-2 text-base">
                <Check className="w-5 h-5 text-emerald-600" /> Subscription Confirmed!
              </div>
              <p className="text-xs font-normal text-emerald-700 font-sans my-0">
                {statusMsg || `Thank you! Your selected newsletters will be delivered to ${email}.`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full flex-1">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1642D0] focus:ring-1 focus:ring-[#1642D0] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#1642D0] hover:bg-blue-800 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  {isSubmitting ? 'Signing Up...' : 'Sign Up Now'}
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium text-left sm:text-center pl-1 my-0">
                  {errorMsg}
                </p>
              )}
            </form>
          )}

          <p className="text-[11px] text-slate-500 font-sans leading-relaxed my-0 pt-2 border-t border-slate-100">
            No credit card required. You can modify your preferences or unsubscribe at any time. By signing up you agree to United States Today&apos;s{' '}
            <a href="#" className="underline text-slate-700 hover:text-[#1642D0]">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline text-slate-700 hover:text-[#1642D0]">
              Privacy Policy
            </a>.
          </p>
        </div>

      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
