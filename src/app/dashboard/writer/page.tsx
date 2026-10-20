'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { useAuth } from '@/components/auth/AuthContext';
import { PenTool, FileText, Eye, MessageSquare, PlusCircle, CheckCircle, LogOut, Sparkles } from 'lucide-react';

export default function WriterDashboardPage() {
  const router = useRouter();
  const { user, logout, openLogin } = useAuth();
  const [mounted, setMounted] = useState(false);

  // New Article Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Building a Business');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Writer articles state
  const [articlesList, setArticlesList] = useState([
    {
      id: 1,
      title: 'How Strategic Content Automation Multiplies B2B Pipeline Growth',
      category: 'Thought Leaders',
      date: 'Oct 18, 2026',
      views: '4,280',
      status: 'Published',
    },
    {
      id: 2,
      title: 'The Solopreneur Playbook for Scaling Without Burning Out',
      category: 'Building a Business',
      date: 'Oct 14, 2026',
      views: '8,950',
      status: 'Published',
    },
    {
      id: 3,
      title: 'Neuroscience-Backed Routines for High-Pressure Leadership',
      category: 'Leadership',
      date: 'Oct 09, 2026',
      views: '12,410',
      status: 'Published',
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setPublishSuccess(false);

    const newArt = {
      id: Date.now(),
      title: title.trim(),
      category,
      date: 'Just now',
      views: '0',
      status: 'Published',
    };

    setArticlesList([newArt, ...articlesList]);
    setTitle('');
    setExcerpt('');
    setContent('');
    setIsSubmitting(false);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 5000);
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
            <PenTool className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Writer Studio</h1>
          <p className="text-sm text-slate-600 mb-6">
            Please log in with your writer credentials to access the editorial workspace.
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-700 text-white font-serif font-bold text-2xl flex items-center justify-center shadow-xs">
              <PenTool className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 my-0">
                  Writer Studio: {user.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-blue-100 text-[#1642D0] border border-blue-200">
                  Staff Writer / Contributor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-sans my-0">
                {user.email} • Entrepreneur Editorial Contributor Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Live Site
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

        {/* Writer KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Stories Published</span>
              <FileText className="w-4 h-4 text-[#1642D0]" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{articlesList.length}</span>
            <span className="text-[11px] text-emerald-600 block mt-1">100% editorial score</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
              <Eye className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">38.4K</span>
            <span className="text-[11px] text-emerald-600 block mt-1">↑ 18% month over month</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Reader Engagement</span>
              <MessageSquare className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">42</span>
            <span className="text-[11px] text-slate-500 block mt-1">Total comments received</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Database Status</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-serif text-emerald-600">Connected</span>
            <span className="text-[11px] text-slate-500 block mt-1">MySQL entreprenuer_db</span>
          </div>
        </div>

        {/* 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Draft & Publish Form (7 of 12) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#1642D0]" />
                <h2 className="text-xl font-serif font-bold text-slate-900 my-0">Draft New Story</h2>
              </div>
              <span className="text-xs font-sans text-slate-500">Auto-saves to database</span>
            </div>

            {publishSuccess && (
              <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Story draft successfully submitted to editorial queue!</span>
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 5 Breakthrough Systems Founders Use to Accelerate Growth"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#1642D0]"
                />
              </div>

              <div>
                <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#1642D0] bg-white"
                >
                  <option value="Building a Business">Building a Business</option>
                  <option value="Breaking Business News">Breaking Business News</option>
                  <option value="Markets and Investing">Markets and Investing</option>
                  <option value="Startups and Entrepreneurship">Startups and Entrepreneurship</option>
                  <option value="Technology and AI">Technology and AI</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Thought Leaders">Thought Leaders</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Summary / Excerpt
                </label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Key executive takeaway or 1-sentence hook"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#1642D0]"
                />
              </div>

              <div>
                <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Story Content (Markdown supported)
                </label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article insights, practical frameworks, and quotes..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#1642D0] font-serif leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">Author: {user.name} ({user.email})</span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#1642D0] hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Published Stories & Guidelines (5 of 12) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Published Stories */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-serif font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                Your Published Articles
              </h3>
              <div className="space-y-3">
                {articlesList.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1642D0] block mb-0.5">
                      {item.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug my-0">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                      <span>{item.date}</span>
                      <span className="font-semibold text-slate-700">{item.views} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Standards Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs">
              <h3 className="text-base font-serif font-bold text-white mb-2">Editorial Quality Guidelines</h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed p-0 my-0">
                <li>Provide actionable frameworks rather than generic advice.</li>
                <li>Cite concrete metrics, timeframes, and outcomes.</li>
                <li>Ensure headlines reflect accurate operational insights.</li>
                <li>Respect intellectual property and disclose any relevant affiliations.</li>
              </ul>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
