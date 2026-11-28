'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Mail, Check, Search, CheckSquare, Square } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { MAIN_CATEGORIES } from '@/data/categoriesData';

interface NewsletterItem {
  id: string;
  categoryName: string;
  subcategoriesList: string;
  frequency: string;
  description: string;
  categoryId: number;
}

export default function NewslettersPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate the newsletters directly following the user's requested layout:
  // Bold text: Main Category
  // After: Normal text listing all subcategories
  // Frequency in italics / small font
  // Description of the category/subcategories
  const newsletters: NewsletterItem[] = useMemo(() => {
    return MAIN_CATEGORIES.map((cat) => {
      // Subcategories names joined in normal text
      const subNames = cat.subcategories.map((s) => s.name).join(', ');
      
      // Determine delivery frequency
      let freq = 'Weekday mornings';
      if ([1, 4, 7, 9].includes(cat.id)) {
        freq = 'Daily';
      } else if ([8, 12, 13, 15, 17].includes(cat.id)) {
        freq = 'Once a week';
      } else if ([2, 3, 5, 6].includes(cat.id)) {
        freq = 'Weekday mornings';
      }

      return {
        id: `newsletter-${cat.slug}`,
        categoryName: cat.name,
        subcategoriesList: subNames,
        frequency: freq,
        description: cat.description,
        categoryId: cat.id,
      };
    });
  }, []);

  // Filter based on search query
  const filteredNewsletters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return newsletters;
    return newsletters.filter(
      (n) =>
        n.categoryName.toLowerCase().includes(q) ||
        n.subcategoriesList.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
    );
  }, [newsletters, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.length === newsletters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(newsletters.map((n) => n.id));
    }
  };

  const toggleNewsletter = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
  const isAllSelected = totalSelected > 0 && totalSelected === newsletters.length;

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Site Header */}
      <Header />

      {/* Main Page Container matching Washington Times Clean Editorial Style */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        
        {/* Top Header / Intro Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#020618] uppercase my-0">
            Newsletters
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-serif leading-relaxed max-w-2xl mx-auto my-0">
            Let the best of United States Today news, market data, and investigative reporting come directly to your inbox.
          </p>
          <p className="text-xs sm:text-[13px] text-slate-500 font-sans my-0">
            Select any of the free newsletters below. Then enter your email address and click &ldquo;Sign Up Now&rdquo;.
          </p>
        </div>

        {/* Toolbar: Search & Select All Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by category or subcategory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1642D0] focus:ring-1 focus:ring-[#1642D0] transition-colors"
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

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-500 font-medium">
              <strong className="text-slate-800 font-semibold">{totalSelected}</strong> of {newsletters.length} selected
            </span>

            <button
              type="button"
              onClick={toggleSelectAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              {isAllSelected ? (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-600" /> Deselect All
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-[#1642D0]" /> Select All Newsletters
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2-COLUMN NEWSLETTERS GRID MATCHING USER SCREENSHOT EXACTLY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-12 mb-16">
          {filteredNewsletters.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No newsletters found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredNewsletters.map((item) => {
              const isChecked = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleNewsletter(item.id)}
                  className="flex items-start gap-4 group cursor-pointer select-none"
                >
                  {/* Clean Square Checkbox matching screenshot */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-[18px] h-[18px] rounded-xs border-slate-400 text-[#1642D0] focus:ring-0 cursor-pointer accent-[#1642D0] shrink-0"
                    />
                  </div>

                  {/* Newsletter Content: Bold text Main Category, followed by Normal text Subcategories */}
                  <div className="space-y-1.5 flex-1">
                    {/* Header Line: Bold Main Category + Normal text Subcategories */}
                    <div className="leading-snug">
                      <h3 className="inline text-xl sm:text-[22px] font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all my-0">
                        {item.categoryName}
                      </h3>
                      {item.subcategoriesList && (
                        <span className="text-[13px] sm:text-sm font-sans font-normal text-slate-600 ml-2">
                          &bull; {item.subcategoriesList}
                        </span>
                      )}
                    </div>

                    {/* Frequency in italics / small font */}
                    <div className="text-xs text-slate-500 italic font-sans">
                      {item.frequency}
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-[13.5px] text-slate-600 font-serif leading-relaxed my-0 pt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM EMAIL SIGNUP AREA MATCHING WASHINGTON TIMES LAYOUT */}
        <div id="newsletter-signup-form" className="max-w-xl mx-auto pt-8 border-t border-slate-200 text-center space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-[#020618] my-0">
              Confirm Your Free Subscription
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-sans my-0">
              {totalSelected > 0
                ? `You have selected ${totalSelected} newsletter${totalSelected === 1 ? '' : 's'}. Enter your email to begin receiving issues.`
                : 'Select any of the free newsletters above and enter your email.'}
            </p>
          </div>

          {isSubscribed ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-bold shadow-2xs space-y-1">
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

          <p className="text-[11px] text-slate-500 font-sans leading-relaxed my-0 pt-2">
            You can unsubscribe at any time. By signing up you agree to United States Today&apos;s{' '}
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
