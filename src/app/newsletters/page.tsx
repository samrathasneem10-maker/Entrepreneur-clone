'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';

interface NewsletterItem {
  id: string;
  title: string;
  frequency: string;
  description: string;
}

const NEWSLETTERS: NewsletterItem[] = [
  {
    id: 'breaking-business-news',
    title: 'Breaking Business News',
    frequency: 'Daily',
    description: 'Breaking business stories from around the world.',
  },
  {
    id: 'markets-investing',
    title: 'Markets & Investing',
    frequency: 'Weekdays',
    description: 'Market analysis, stocks, investing strategies and financial updates.',
  },
  {
    id: 'economy',
    title: 'Economy',
    frequency: 'Weekdays',
    description: 'Inflation, GDP, interest rates and economic trends.',
  },
  {
    id: 'corporate-news',
    title: 'Corporate News',
    frequency: 'Daily',
    description: 'Company announcements, mergers and earnings reports.',
  },
  {
    id: 'startups-entrepreneurship',
    title: 'Startups & Entrepreneurship',
    frequency: 'Weekdays',
    description: 'Startup stories, founders and innovation.',
  },
  {
    id: 'banking-finance',
    title: 'Banking & Finance',
    frequency: 'Weekdays',
    description: 'Banking, fintech, payments and financial services.',
  },
  {
    id: 'technology-ai',
    title: 'Technology & AI',
    frequency: 'Daily',
    description: 'Artificial Intelligence, software, cybersecurity and tech.',
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    frequency: 'Weekly',
    description: 'Commercial property, housing and investment insights.',
  },
  {
    id: 'international-business',
    title: 'International Business',
    frequency: 'Daily',
    description: 'Global trade, international companies and world markets.',
  },
  {
    id: 'leadership',
    title: 'Leadership',
    frequency: 'Twice Weekly',
    description: 'Leadership, workplace culture and management.',
  },
  {
    id: 'marketing-branding',
    title: 'Marketing & Branding',
    frequency: 'Weekly',
    description: 'Marketing trends, branding and digital growth.',
  },
  {
    id: 'sustainability-esg',
    title: 'Sustainability (ESG)',
    frequency: 'Weekly',
    description: 'Green business, renewable energy and ESG.',
  },
  {
    id: 'company-profiles',
    title: 'Company Profiles',
    frequency: 'Weekly',
    description: 'Successful companies and their growth stories.',
  },
  {
    id: 'ceo-interviews',
    title: 'CEO Interviews',
    frequency: 'Weekly',
    description: 'Exclusive interviews with business leaders.',
  },
  {
    id: 'research-insights',
    title: 'Research & Insights',
    frequency: 'Weekly',
    description: 'Reports, analytics and industry research.',
  },
];

export default function NewslettersPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const allSelected = selectedIds.length === NEWSLETTERS.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(NEWSLETTERS.map((item) => item.id));
    }
  };

  const toggleNewsletter = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setIsSubscribed(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Reused Site Header */}
      <Header />

      {/* Main Page Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-widest text-[#020618] uppercase my-0">
            NEWSLETTERS
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-sans my-0">
            Stay up to date with our latest business insights.
          </p>
        </div>

        {/* INTRO TEXT BLOCK */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] leading-tight my-0">
            Let the best of Entrepreneur news come to you.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed my-0">
            Select any of the free newsletters below. Then, enter your email address and click &quot;Sign Up Now&quot;.
            Your newsletter subscriptions with us are subject to Entrepreneur&apos;s{' '}
            <a href="#" className="underline text-slate-800 hover:text-[#1642D0]">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="underline text-slate-800 hover:text-[#1642D0]">
              Privacy Policy
            </a>.
          </p>
        </div>

        {/* SELECT ALL BUTTON */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleToggleSelectAll}
            className="px-6 py-3 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            {allSelected ? 'Deselect All Newsletters' : 'Select All Newsletters'}
          </button>
        </div>

        {/* NEWSLETTER GRID (2 Columns Desktop/Tablet, 1 Column Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 border-t border-b border-slate-200 py-12 mb-12">
          {NEWSLETTERS.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleNewsletter(item.id)}
                className="flex items-start gap-4 group cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // State handled by parent container click
                  className="w-5 h-5 mt-1 rounded border-slate-300 text-[#1642D0] focus:ring-[#1642D0] cursor-pointer flex-shrink-0 accent-[#1642D0]"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-baseline gap-2.5">
                    <h3 className="text-lg font-serif font-bold text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[2px] transition-all leading-tight my-0">
                      {item.title}
                    </h3>
                    <span className="text-xs italic text-slate-500 font-sans flex-shrink-0">
                      {item.frequency}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed my-0">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* EMAIL SIGNUP AREA */}
        <div className="max-w-xl mx-auto text-center space-y-4">
          {isSubscribed ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-bold shadow-2xs">
              ✓ Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3">
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
                  className="w-full sm:w-auto px-7 py-3 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  Sign Up Now
                </button>
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium text-left sm:text-center pl-1 my-0">
                  {errorMsg}
                </p>
              )}
            </form>
          )}

          <p className="text-[11px] text-slate-500 font-sans leading-relaxed my-0">
            You can unsubscribe at any time. By signing up you are agreeing to our{' '}
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

      {/* Reused Site Footer */}
      <Footer />
    </div>
  );
}
