'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { ALL_ARTICLES, LATEST_ARTICLES } from '@/data/newsData';

export default function AuthorProfilePage() {
  const router = Router();
  const [currentPage, setCurrentPage] = useState(1);

  function Router() {
    return useRouter();
  }

  // Articles written by Merilee Kern, MBA (using ALL_ARTICLES as author content)
  const ARTICLES_PER_PAGE = 6;
  const totalPages = Math.ceil(ALL_ARTICLES.length / ARTICLES_PER_PAGE);
  const paginatedArticles = ALL_ARTICLES.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  // Most Read articles for the right sidebar (top 5)
  const mostReadArticles = LATEST_ARTICLES.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Navigation Header */}
      <Header />

      {/* TOP AUTHOR PROFILE SECTION */}
      <section className="bg-slate-50/80 border-b border-slate-200 py-8 md:py-12 px-5 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-600 hover:text-[#1642D0] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Author Details Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-1">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
              alt="Merilee Kern, MBA"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-slate-300 flex-shrink-0 shadow-xs"
            />

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-black text-[#020618] leading-tight my-0">
                  Merilee Kern, MBA
                </h1>
                <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#1642D0]">
                  Writer
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed max-w-2xl">
                Merilee Kern, MBA is a business writer covering entrepreneurship, leadership, technology, startups, innovation, and market trends. She has contributed numerous articles focused on helping entrepreneurs and business professionals stay informed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT & SIDEBAR SECTION */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT/MAIN ARTICLE STREAM (8 columns on desktop) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] uppercase tracking-tight my-0">
                MORE FROM MERILEE KERN, MBA
              </h2>
            </div>

            {/* Author Articles Stream */}
            <div className="space-y-6">
              {paginatedArticles.map((art) => (
                <article
                  key={art.id}
                  className="group flex flex-col sm:flex-row-reverse items-start justify-between gap-5 pb-6 border-b border-slate-200 last:border-b-0 last:pb-0"
                >
                  {art.imageUrl && (
                    <figure className="relative w-full sm:w-[150px] aspect-[16/10] sm:aspect-square overflow-hidden rounded-xl border border-slate-200 flex-shrink-0">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                      />
                    </figure>
                  )}

                  <div className="flex flex-col flex-1 items-start text-left space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#1642D0] font-sans">
                      {art.category}
                    </span>

                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#020618] leading-snug group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all my-0">
                      <Link href={`/article/${art.id}`}>{art.title}</Link>
                    </h3>

                    {art.excerpt && (
                      <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed line-clamp-2">
                        {art.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans font-normal pt-1">
                      <span>By {art.author.name}</span>
                      <span className="text-slate-400">•</span>
                      <span>{art.date || '2h ago'}</span>
                      <span className="text-slate-400">•</span>
                      <span>{art.readTime || '4 min read'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-200 text-xs font-bold font-sans">
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="px-3.5 py-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {[1, 2, 3, 4, 5].map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`w-9.5 h-9.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#1642D0] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => {
                  setCurrentPage((p) => Math.min(5, p + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                disabled={currentPage === 5}
                className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-[#1642D0] hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR (4 columns on desktop, stacked on mobile/tablet) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            {/* 1. Most Read Sidebar Widget */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200">
                <TrendingUp className="w-4 h-4 text-[#1642D0]" />
                <h3 className="text-lg font-bold font-serif text-[#020618] my-0 uppercase tracking-tight">
                  Most Read
                </h3>
              </div>

              <div className="space-y-4">
                {mostReadArticles.map((art, idx) => (
                  <Link
                    key={art.id}
                    href={`/article/${art.id}`}
                    className="group flex items-start gap-3.5 pb-3.5 border-b border-slate-100 last:border-b-0 last:pb-0"
                  >
                    <span className="text-2xl font-serif font-black text-slate-300 group-hover:text-[#1642D0] transition-colors leading-none">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1642D0] block">
                        {art.category}
                      </span>
                      <h4 className="text-xs font-bold font-sans text-slate-900 group-hover:underline decoration-[#020618] decoration-1 underline-offset-[2px] transition-all line-clamp-2 leading-snug my-0">
                        {art.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 2. Bordered 300x250 Medium Rectangle Banner Placeholder */}
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center h-[250px] text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                ADVERTISEMENT
              </span>
              <span className="text-sm font-bold text-slate-700">
                300 × 250
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Medium Rectangle Banner
              </span>
            </div>
          </aside>

        </div>
      </main>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}
