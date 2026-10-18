'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { ALL_ARTICLES, LATEST_ARTICLES } from '@/data/newsData';

interface AuthorProfile {
  name: string;
  role: string;
  badge: string;
  avatar: string;
  bio: string;
}

const AUTHORS_MAP: Record<string, AuthorProfile> = {
  'sherin-shibu': {
    name: 'Sherin Shibu',
    role: 'News Reporter',
    badge: 'Entrepreneur Staff',
    avatar: '/images/sherin-shibu.jpg',
    bio: 'Sherin Shibu is a business news reporter at Entrepreneur.com. She previously worked for PCMag, Business Insider, The Messenger, and ZDNET as a reporter and copyeditor. Her areas of coverage encompass tech, business, strategy, finance, and even space. She is a Columbia University graduate.',
  },
  'merilee-kern': {
    name: 'Sherin Shibu',
    role: 'News Reporter',
    badge: 'Entrepreneur Staff',
    avatar: '/images/sherin-shibu.jpg',
    bio: 'Sherin Shibu is a business news reporter at Entrepreneur.com. She previously worked for PCMag, Business Insider, The Messenger, and ZDNET as a reporter and copyeditor. Her areas of coverage encompass tech, business, strategy, finance, and even space. She is a Columbia University graduate.',
  },
  'rl-adams': {
    name: 'R.L. Adams',
    role: 'Contributing Writer',
    badge: 'Entrepreneur Staff',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    bio: 'R.L. Adams is a software engineer, serial entrepreneur, and bestselling author of dozens of books on online business, search engine optimization, and passive income generation.',
  },
};

export default function AuthorProfilePage() {
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const rawSlug = params?.slug as string | undefined;
  const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || 'sherin-shibu';

  const author = AUTHORS_MAP[slug] || AUTHORS_MAP['sherin-shibu'];

  // Articles written by this author (or populated with related articles)
  const authorArticles = ALL_ARTICLES.filter((art) => {
    const authorName = art.author?.name?.toLowerCase() || '';
    const targetName = author.name.toLowerCase();
    return authorName.includes(targetName) || targetName.includes(authorName);
  });

  const allAuthorContent =
    authorArticles.length >= 6
      ? authorArticles
      : [
          ...authorArticles,
          ...ALL_ARTICLES.filter((art) => !authorArticles.some((a) => a.id === art.id)),
        ];

  const ARTICLES_PER_PAGE = 6;
  const totalPages = Math.ceil(allAuthorContent.length / ARTICLES_PER_PAGE);
  const paginatedArticles = allAuthorContent.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  // Most Read articles for the right sidebar (top 5)
  const mostReadArticles = LATEST_ARTICLES.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Navigation Header */}
      <Header />

      {/* TOP AUTHOR PROFILE SECTION - EXACT MATCH TO IMAGE 1 */}
      <section className="bg-white pt-10 pb-4 md:pt-14 md:pb-6 px-5 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 md:gap-12">
            {/* Author Avatar: Clean circle without border matching Image 1 */}
            <div className="shrink-0">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover shadow-2xs"
              />
            </div>

            {/* Author Details matching Image 1 */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              {/* Author Name */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-black text-[#020618] leading-[1.1] tracking-tight my-0">
                {author.name}
              </h1>

              {/* Author Role */}
              <p className="text-sm sm:text-[15px] font-sans text-slate-500 font-normal mt-1.5 mb-2">
                {author.role}
              </p>

              {/* Staff / Contributor Badge matching Image 1 */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 mb-3 text-[#047857]">
                <svg
                  className="w-4 h-4 text-[#047857] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l2.4 2.4 3.4-.4 1.4 3.1 3.1 1.4-.4 3.4 2.4 2.4-2.4 2.4.4 3.4-3.1 1.4-1.4 3.1-3.4-.4-2.4 2.4-2.4-2.4-3.4.4-1.4-3.1-3.1-1.4.4-3.4-2.4-2.4 2.4-2.4-.4-3.4 3.1-1.4 1.4-3.1 3.4.4z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span className="font-serif font-bold text-xs sm:text-[13px] text-[#047857] tracking-tight">
                  {author.badge}
                </span>
              </div>

              {/* Author Bio matching Image 1 */}
              <p className="font-serif text-slate-700 text-sm sm:text-[15px] leading-relaxed max-w-2xl my-0">
                {author.bio}
              </p>

              {/* Callout Box matching Image 1 */}
              <div className="mt-5 inline-block bg-[#f0f5ff] rounded-lg px-4 sm:px-5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-blue-100/60">
                <p className="font-serif text-xs sm:text-[13.5px] text-slate-700 my-0">
                  Want to write for Entrepreneur too?{' '}
                  <Link
                    href="/newsletters"
                    className="font-serif font-bold text-[#1642D0] hover:underline"
                  >
                    Apply to join Entrepreneur Leadership network.
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Clean Horizontal Divider Line matching Image 1 */}
          <div className="border-b border-slate-200 mt-8 md:mt-10" />
        </div>
      </section>

      {/* MAIN CONTENT & SIDEBAR SECTION */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT/MAIN ARTICLE STREAM (8 columns on desktop) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] uppercase tracking-tight my-0">
                MORE FROM {author.name.toUpperCase()}
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
                      <p className="text-xs sm:text-sm text-slate-700 font-serif font-normal leading-relaxed line-clamp-2">
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

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
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
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
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
