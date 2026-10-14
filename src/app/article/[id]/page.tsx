'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  Clock,
  User,
  Copy,
  Check,
  Bookmark,
} from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { getArticleById, ALL_ARTICLES, LATEST_ARTICLES } from '@/data/newsData';

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = typeof params?.id === 'string' ? params.id : 'hero-1';
  const article = getArticleById(articleId);

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 8 Related articles for the bottom grid
  const relatedArticles = ALL_ARTICLES.filter((a) => a.id !== article.id).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* 1. Header with Sticky Reading Progress Bar */}
      <Header showProgressBar={true} />


      {/* Breadcrumb Navigation Line */}
      <div className="bg-slate-50/80 border-b border-slate-200 py-2.5 px-5 lg:px-10 text-xs text-slate-600 font-sans">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-[#1642D0] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <Link href={`/topic/${article.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#1642D0] transition-colors">
            {article.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-900 font-medium truncate max-w-md">
            {article.title}
          </span>
        </div>
      </div>

      {/* Main Article Container with 2-Column Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT/MAIN CONTENT (8 columns on large screens) */}
          <article className="lg:col-span-8 space-y-6">
            
            {/* Category Tag */}
            <div>
              <span className="inline-block font-sans text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1642D0] mb-2">
                {article.category}
              </span>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#020618] leading-[1.18] tracking-tight mb-4">
                {article.title}
              </h1>

              {/* Subtitle / Excerpt */}
              {article.excerpt && (
                <p className="text-slate-700 text-lg sm:text-xl font-serif font-normal leading-relaxed mb-6">
                  {article.excerpt}
                </p>
              )}

              {/* Author & Publication Metadata Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-slate-200 my-6 text-xs sm:text-sm font-sans">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
                    alt="Merilee Kern, MBA"
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 flex-shrink-0 shadow-xs"
                  />
                  <div>
                    <div className="font-bold text-[#020618]">
                      By{' '}
                      <Link href="/author/merilee-kern" className="underline hover:text-[#1642D0]">
                        Merilee Kern, MBA
                      </Link>

                    </div>
                    <div className="text-slate-500 text-xs font-normal">
                      Writer
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>July 25, 2026</span>
                  </div>
                  <span>•</span>
                  <span>6 min read</span>
                </div>


                {/* Utility Action Buttons: Copy Link & Bookmark */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-700 transition-colors relative cursor-pointer"
                    title="Copy Link"
                    aria-label="Copy Link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      bookmarked
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                    title="Bookmark Article"
                    aria-label="Bookmark Article"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Featured Image */}
            {article.imageUrl && (
              <figure className="my-6">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 shadow-xs">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-xs text-slate-500 font-sans italic mt-2.5">
                  Editorial Photography / Unsplash Collection. Strategic design planning sessions drive measurable enterprise returns.
                </figcaption>
              </figure>
            )}

            {/* Rich Article Body Content */}
            <div className="prose prose-slate max-w-none space-y-6 text-slate-800 text-base sm:text-lg leading-relaxed font-sans pt-2">
              <p>
                In an increasingly crowded marketplace, products and services are rapidly becoming commoditized. When competitors can replicate feature sets within weeks, customer experience (CX) becomes the primary differentiator that protects pricing power and drives long-term customer lifetime value.
              </p>

              <p>
                Leading executives recognize that design is not merely a cosmetic layer applied at the final stage of product development. Instead, design-led companies integrate customer insights directly into business strategy, capital allocation, and executive decision-making.
              </p>

              {/* Section H2 */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-4 mb-3 tracking-tight">
                1. The Strategic Value of User-Centered Architecture
              </h2>

              <p>
                When leadership teams prioritize user-centered design, they systematically eliminate friction points across the entire customer lifecycle. From initial brand discovery to post-purchase support, every touchpoint reinforces brand trust and user satisfaction.
              </p>

              {/* Pull Quote Block */}
              <blockquote className="my-8 border-l-4 border-[#1642D0] pl-6 py-4 bg-blue-50/50 rounded-r-xl text-lg sm:text-xl font-serif italic text-[#020618] leading-relaxed">
                "Design is not just what it looks like and feels like. Design is how it works under real-world operational pressure."
              </blockquote>

              <p>
                Research across Fortune 500 enterprises indicates that organizations with top-quartile design scores generate 32 percentage points higher revenue growth and 56 percentage points higher total returns to shareholders compared to their industry peers.
              </p>

              {/* Section H2 */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-4 mb-3 tracking-tight">
                2. Aligning Cross-Functional Teams Around Customer Metrics
              </h2>

              <p>
                Achieving design excellence requires breaking down traditional departmental silos. When product managers, software engineers, marketers, and customer success specialists share common CX key performance indicators (KPIs), decisions accelerate and strategic clarity improves.
              </p>

              {/* Actionable Checklist */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6">
                <h3 className="text-base font-bold font-sans text-[#020618] uppercase tracking-wider mb-3">
                  Core Implementation Milestones
                </h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-[#1642D0]">01.</span>
                    <span><strong>Establish Continuous Feedback Loops:</strong> Automate weekly customer interview digests and qualitative user recordings across executive slack channels.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-[#1642D0]">02.</span>
                    <span><strong>Standardize Modular Design Systems:</strong> Build reusable component libraries that maintain brand consistency while speeding up release velocity.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-[#1642D0]">03.</span>
                    <span><strong>Tie Executive Compensation to CX:</strong> Link a portion of leadership bonuses to Net Promoter Scores (NPS) and Customer Retention Rates.</span>
                  </li>
                </ul>
              </div>

              {/* Inline Secondary Image */}
              <figure className="my-8">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                    alt="Team Collaboration Session"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-xs text-slate-500 font-sans italic mt-2 text-center">
                  Figure 1: Cross-functional strategy teams analyzing real-time user behavior analytics.
                </figcaption>
              </figure>

              {/* Section H2 */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-4 mb-3 tracking-tight">
                3. Measuring ROI and Sustainable Enterprise Growth
              </h2>

              <p>
                Ultimately, design investments must demonstrate tangible financial returns. By monitoring metrics such as Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV), and churn rates, founders can validate CX expenditures to board members and venture investors alike.
              </p>

              <p>
                Companies that successfully operationalize design-led strategies build resilient, high-margin business models capable of outperforming macroeconomic headwinds.
              </p>
            </div>

          </article>

          {/* RIGHT SIDEBAR (4 columns on large screens) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            
            {/* 1. Medium Rectangle Ad Placeholder (300x250) */}
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center h-[250px] text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Advertisement
              </span>
              <span className="text-xs font-semibold text-slate-600">
                300x250 Medium Rectangle Banner
              </span>
            </div>

            {/* 2. Extended Latest News Stream (Fills Sidebar Vertically) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold font-serif text-[#020618] my-0">
                  Latest News
                </h3>
                <Link href="/topic/business-news" className="text-xs font-bold text-[#1642D0] uppercase tracking-wider hover:underline">
                  See All
                </Link>
              </div>

              <div className="space-y-4">
                {LATEST_ARTICLES.slice(0, 7).map((latest) => (
                  <ArticleCard
                    key={latest.id}
                    article={latest}
                    variant="compact"
                  />
                ))}
              </div>
            </div>

          </aside>

        </div>

        {/* RELATED CONTENT GRID SECTION (Bottom of Page) */}
        <section className="mt-16 pt-10 border-t-2 border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] my-0">
              Related Content
            </h2>
            <Link href="/" className="text-xs font-bold text-[#1642D0] uppercase tracking-wider hover:underline">
              Back to Home →
            </Link>
          </div>

          {/* 8-Card Grid matching Homepage card design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard
                key={rel.id}
                article={rel}
                variant="featured"
                showExcerpt={true}
              />
            ))}
          </div>
        </section>

      </main>

      {/* 2. Footer (Reused with exact styling) */}
      <Footer />
    </div>
  );
}
