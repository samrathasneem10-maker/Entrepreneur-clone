'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { useAuth } from '@/components/auth/AuthContext';
import { BookOpen, Bookmark, Clock, User, LogOut, CheckCircle, Newspaper, ArrowRight } from 'lucide-react';

export default function ReaderDashboardPage() {
  const router = useRouter();
  const { user, logout, openLogin } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-5 py-20 text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#1642D0] rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Reader Dashboard</h1>
          <p className="text-sm text-slate-600 mb-6">
            Please log in with your reader credentials to access your personalized reading hub.
          </p>
          <button
            onClick={openLogin}
            className="px-6 py-2.5 bg-[#1642D0] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
          >
            Sign In Now
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 py-8">
        
        {/* Welcome Top Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1642D0] text-white font-serif font-bold text-2xl flex items-center justify-center shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 my-0">
                  Welcome back, {user.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Reader Account
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-sans my-0">
                {user.email} • Member since 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Browse Articles
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main 8 Columns */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Reading Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Articles Read</span>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#1642D0]">28</span>
                <span className="text-[11px] text-emerald-600 block mt-1">↑ 4 this week</span>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Saved Stories</span>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">7</span>
                <span className="text-[11px] text-slate-500 block mt-1">In your bookmarks</span>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Weekly Digest</span>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-emerald-600">Active</span>
                <span className="text-[11px] text-slate-500 block mt-1">Delivered every Monday</span>
              </div>
            </div>

            {/* Bookmarked / Saved Articles */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#1642D0]" />
                  <h2 className="text-xl font-serif font-bold text-slate-900 my-0">Saved for Later</h2>
                </div>
                <span className="text-xs text-slate-500 font-sans">3 recent items</span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: '53 Side Hustle Ideas to Make Extra Money in 2026',
                    category: 'Finance & Economics',
                    slug: '53-side-hustle-ideas-to-make-extra-money-in-2026',
                    readTime: '8 min read',
                    author: 'Sherin Shibu',
                  },
                  {
                    title: "You've Been Overlooking Your Best Idea People. AI Is About to Fix That.",
                    category: 'Building a Business',
                    slug: 'youve-been-overlooking-your-best-idea-people-ai-is-about-to-fix-that',
                    readTime: '4 min read',
                    author: 'Sherin Shibu',
                  },
                  {
                    title: 'How to Biohack Your Brain for Peak Focus and Performance',
                    category: 'Thought Leaders',
                    slug: 'how-to-biohack-your-brain-for-peak-performance',
                    readTime: '5 min read',
                    author: 'Ben Angel',
                  },
                ].map((item) => (
                  <div key={item.slug} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/40 transition-colors group">
                    <div className="pr-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1642D0] mb-1 block">
                        {item.category}
                      </span>
                      <Link href={`/article/${item.slug}`} className="font-serif font-bold text-slate-900 group-hover:text-[#1642D0] transition-colors leading-snug block">
                        {item.title}
                      </Link>
                      <span className="text-xs text-slate-500 mt-1 block">
                        By {item.author} • {item.readTime}
                      </span>
                    </div>
                    <Link
                      href={`/article/${item.slug}`}
                      className="shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-[#1642D0] group-hover:text-white transition-all shadow-2xs"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Preferences */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">Favorite Topics</h2>
              <p className="text-xs text-slate-500 mb-4">Tailor your daily feed based on your business interests:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Breaking Business News',
                  'Markets and Investing',
                  'Startups and Entrepreneurship',
                  'Technology and AI',
                  'Leadership',
                  'Building a Business',
                ].map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-[#1642D0] border border-blue-200"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{topic}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Account Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-serif font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                Account Details
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-semibold tracking-wider block">Full Name</span>
                  <span className="font-bold text-slate-800 text-sm">{user.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold tracking-wider block">Login Email</span>
                  <span className="font-bold text-slate-800 text-sm">{user.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold tracking-wider block">Membership Level</span>
                  <span className="font-bold text-emerald-700 text-sm">Active Reader Access</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold tracking-wider block">Database Storage</span>
                  <span className="font-medium text-slate-600">MySQL (entreprenuer_db)</span>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription Status */}
            <div className="bg-[#1642D0] text-white rounded-2xl p-6 shadow-xs">
              <Newspaper className="w-8 h-8 text-blue-200 mb-3" />
              <h3 className="text-lg font-serif font-bold text-white mb-2">Entrepreneur Intelligence</h3>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                You are currently subscribed to receive daily morning market briefings and high-growth founder playbooks.
              </p>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                ✓ Subscription Active
              </span>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
