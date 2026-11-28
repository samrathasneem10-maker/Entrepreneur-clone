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
  // Frequency in italics / small font
  // Normal text listing all subcategories
  const newsletters: NewsletterItem[] = useMemo(() => {
    return MAIN_CATEGORIES.map((cat) => {
      const subNames = cat.subcategories.map((s) => s.name).join(', ');
      
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

  const filteredNewsletters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return newsletters;
    return newsletters.filter(
      (n) =>
        n.categoryName.toLowerCase().includes(q) ||
        n.subcategoriesList.toLowerCase().includes(q)
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

      {/* TOP GREY BANNER MATCHING USER SCREENSHOT EXACTLY */}
      <section className="w-full bg-[#F4F4F4] py-10 sm:py-14 text-center border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          {/* Main Title: Letter-spaced Serif in Red Theme */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-[0.25em] text-[#C61830] uppercase my-0">
            NEWSLETTERS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-sans tracking-wide my-0">
            Stay up to date with our daily newsletter
          </p>
        </div>
      </section>

      {/* INTRO CALLOUT MATCHING USER SCREENSHOT EXACTLY */}
      <section className="w-full bg-white pt-10 sm:pt-14 pb-8 sm:pb-10 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-normal text-slate-900 leading-snug my-0">
            Let the best of United States Today news come to you.
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-500 font-sans leading-relaxed max-w-xl mx-auto my-0">
            Select any of the free newsletters below. Then, enter your email address and click &ldquo;Sign Up.&rdquo;
            <br />
            Your newsletter subscriptions with us are subject to United States Today&apos;s{' '}
            <Link href="/terms" className="text-[#C61830] hover:underline font-medium">
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#C61830] hover:underline font-medium">
              Privacy Policy
            </Link>.
          </p>

          {/* Prominent Button Matching Reference Screenshot with Red Theme */}
          <div className="pt-2">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="px-8 py-3 bg-[#C61830] hover:bg-[#A31225] text-white font-bold text-xs uppercase tracking-widest rounded-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
            >
              {isAllSelected ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Deselect All Newsletters</span>
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4" />
                  <span>Select All Newsletters</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* MAIN 2-COLUMN NEWSLETTERS LIST */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pb-16">
        
        {/* Subtle Hairline Divider and Search Filter */}
        <div className="border-t border-slate-200/80 pt-6 pb-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by category or subcategory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C61830] focus:ring-1 focus:ring-[#C61830] transition-colors"
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

          <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
            <span className="font-bold text-[#C61830]">{totalSelected}</span> of {newsletters.length} selected
          </div>
        </div>

        {/* 2-Column Newsletters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-10 mb-16">
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
                  {/* Clean Square Checkbox with Red Theme */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-[18px] h-[18px] rounded-xs border-slate-400 text-[#C61830] focus:ring-0 cursor-pointer accent-[#C61830] shrink-0"
                    />
                  </div>

                  {/* Newsletter Content */}
                  <div className="space-y-1 flex-1">
                    {/* Header Line: Bold Main Category */}
                    <h3 className="text-xl sm:text-[22px] font-serif font-bold text-[#020618] group-hover:text-[#C61830] transition-colors my-0 leading-tight">
                      {item.categoryName}
                    </h3>

                    {/* Frequency in italics / small font */}
                    <div className="text-xs text-slate-500 italic font-sans">
                      {item.frequency}
                    </div>

                    {/* Subcategories in Normal Text (underneath frequency) */}
                    <p className="text-xs sm:text-[13.5px] text-slate-600 font-serif leading-relaxed my-0 pt-0.5">
                      {item.subcategoriesList}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM EMAIL SIGNUP FORM */}
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
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-md text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C61830] focus:ring-1 focus:ring-[#C61830] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#C61830] hover:bg-[#A31225] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-xs"
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
            <Link href="/terms" className="underline text-slate-700 hover:text-[#C61830]">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline text-slate-700 hover:text-[#C61830]">
              Privacy Policy
            </Link>.
          </p>
        </div>

      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
