'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Copy,
  Check,
} from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { getArticleById, ALL_ARTICLES, LATEST_ARTICLES } from '@/data/newsData';

const SPONSORED_ITEMS = [
  {
    id: 'spons-1',
    title: 'Robotics and Artificial Intelligence: Discover the trends.',
    source: 'MarketViews',
    imageUrl: '/images/sponsored-robotics-ai.png',
  },
  {
    id: 'spons-2',
    title: 'Stay updated with the newest gold market developments.',
    source: 'MarketViews',
    imageUrl: '/images/sponsored-gold-market.png',
  },
  {
    id: 'spons-3',
    title: 'Find expert news and trends in the world of commodities.',
    source: 'MarketViews',
    imageUrl: '/images/sponsored-commodities.png',
  },
];

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = typeof params?.id === 'string' ? params.id : 'not-every-boss-deserves-a-thank-you-card';
  const article = getArticleById(articleId);

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 8 Related articles for the bottom grid
  const relatedArticles = ALL_ARTICLES.filter((a) => a.id !== article.id).slice(0, 8);

  const isBossArticle = article.id.includes('boss') || article.id.includes('bully');

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* 1. Header with Sticky Reading Progress Bar */}
      <Header showProgressBar={true} />

      {/* Breadcrumb Navigation matching reference screenshot (Black House Icon + / + BUILDING A BUSINESS) */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pt-3 pb-2.5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
        <Link href="/" aria-label="Home" className="text-slate-950 hover:text-[#1642D0] transition-colors flex items-center">
          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        <span className="text-slate-400 font-normal select-none">/</span>
        <Link
          href={`/topic/${(article.category || 'building-a-business').toLowerCase().replace(/\s+/g, '-')}`}
          className="text-slate-900 hover:text-[#1642D0] transition-colors tracking-wider font-extrabold"
        >
          {article.category || 'BUILDING A BUSINESS'}
        </Link>
      </div>

      {/* Blue Announcement Bar right under breadcrumb matching reference screenshot */}
      <div className="w-full bg-[#1642D0] py-2 px-4 text-center text-white text-xs sm:text-sm font-bold tracking-wide">
        <a href="#" className="hover:underline transition-colors underline decoration-white">
          How to Get Your Press Release in Front of Millions
        </a>
      </div>

      {/* Main Article Container with 2-Column Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT/MAIN CONTENT (8 columns on large screens) */}
          <article className="lg:col-span-8 space-y-4">
            
            {/* Main Headline (H1): Exact styling from reference screenshot */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-serif font-bold text-[#020618] leading-[1.14] tracking-tight my-0">
              {article.title}
            </h1>

            {/* Subtitle / Excerpt */}
            {article.excerpt && (
              <p className="text-slate-700 text-base sm:text-lg lg:text-[18.5px] font-serif font-normal leading-relaxed my-0 pt-1">
                {article.excerpt}
              </p>
            )}

            {/* Author, Editor & Date Row: Exact format BY MITA MALLICK | EDITED BY KARA MCINTYRE | OCT 14, 2026 */}
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-slate-500 flex flex-wrap items-center gap-1.5 pt-2 pb-1">
              <span className="text-slate-500 font-semibold">BY</span>
              <Link
                href={`/author/${(article.author?.name || 'mita-mallick').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="text-[#1642D0] font-bold hover:underline decoration-[#1642D0] underline-offset-2"
              >
                {article.author?.name || 'MITA MALLICK'}
              </Link>
              {article.editor ? (
                <>
                  <span className="text-slate-300 mx-1.5 select-none font-normal">|</span>
                  <span className="text-slate-500 font-semibold">EDITED BY</span>
                  <span className="text-[#1642D0] font-bold">{article.editor}</span>
                </>
              ) : null}
              <span className="text-slate-300 mx-1.5 select-none font-normal">|</span>
              <span className="text-slate-500 font-normal">{article.date || 'OCT 14, 2026'}</span>
            </div>

            {/* Divider Line */}
            <div className="border-b border-slate-200 my-3" />

            {/* Action Bar: Google Add to Preferred Sources pill + SHARE with Copy icon side by side matching screenshot */}
            <div className="flex items-center gap-5 sm:gap-6 py-1.5 mb-6">
              {/* Google Add to Preferred Sources Pill */}
              <a
                href="https://news.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-1.5 inline-flex items-center gap-2 text-xs font-medium text-slate-800 shadow-2xs transition-colors cursor-pointer"
              >
                {/* Authentic 4-color Google G icon */}
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Add to Preferred Sources</span>
              </a>

              {/* Right beside it: SHARE + Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#1642D0] tracking-wider font-sans uppercase transition-colors cursor-pointer"
                title={copied ? 'Copied link!' : 'Copy Link'}
                aria-label="Copy Link"
              >
                <span>SHARE</span>
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-800" />}
              </button>
            </div>

            {/* Rich Editorial Body Content */}
            <div className="prose prose-slate max-w-none space-y-6 text-slate-800 text-base sm:text-lg leading-relaxed font-serif pt-2">
              {isBossArticle ? (
                <>
                  <p>
                    National Boss’s Day rolls around every October, and offices across the country fill with celebratory greeting cards, decorated cupcakes, and polite applause in team Slack channels. But for millions of dedicated professionals, signing a generic card feels less like gratitude and more like forced corporate theater.
                  </p>

                  <p>
                    Workplaces often tolerate abusive or hyper-critical managers because they appear to &ldquo;get results.&rdquo; Yet research consistently shows that bully bosses cost companies billions in attrition, medical leaves, and silenced innovation. When a manager relies on public humiliation, shifted goalposts, or veiled threats, employees don&apos;t work harder &mdash; they work scared.
                  </p>

                  {/* Section H2 */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-4 mb-3 tracking-tight">
                    1. Recognize the Difference Between High Expectations and Bullying
                  </h2>

                  <p>
                    Tough leaders challenge your ideas to sharpen your thinking; bully bosses attack your character to preserve their own status. A demanding manager will debate facts, offer constructive pathways for improvement, and advocate for your promotion behind closed doors. A bully will withhold vital project context, take credit for your late-night breakthroughs, and criticize you in group meetings.
                  </p>

                  {/* Pull Quote Block */}
                  <blockquote className="my-8 border-l-4 border-[#1642D0] pl-6 py-4 bg-blue-50/50 rounded-r-xl text-lg sm:text-xl font-serif italic text-[#020618] leading-relaxed">
                    &ldquo;You cannot fix a toxic boss. You can only protect your reputation, your health, and your strategic career trajectory.&rdquo;
                  </blockquote>

                  {/* Section H2 */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-4 mb-3 tracking-tight">
                    2. Maintain an Objective, Off-System Log
                  </h2>

                  <p>
                    When dealing with a manager who gaslights or denies prior verbal commitments, documentation is your greatest shield. Immediately following contentious discussions, follow up with a calm, professional summary email: <em>&ldquo;To confirm our discussion this morning, the deliverables for Project Apex are due Thursday at 3 PM.&rdquo;</em>
                  </p>

                  {/* Actionable Checklist */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6 font-sans">
                    <h3 className="text-base font-bold font-sans text-[#020618] uppercase tracking-wider mb-3">
                      Essential Self-Protection Strategies
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <span className="font-bold text-[#1642D0]">01.</span>
                        <span><strong>Build Cross-Functional Champions:</strong> Ensure leaders in other divisions see your tangible work so your career is never dependent on one person&apos;s subjective review.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="font-bold text-[#1642D0]">02.</span>
                        <span><strong>Document Factual Timelines:</strong> Keep a personal, timestamped log of project milestones, deliverables, and communication records on non-work personal storage.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="font-bold text-[#1642D0]">03.</span>
                        <span><strong>Execute a Controlled Exit:</strong> Polish your credentials, activate executive recruiters, and negotiate your next chapter from a position of quiet strength.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section H2 */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-4 mb-3 tracking-tight">
                    3. Plan Your Exit From a Position of Power
                  </h2>

                  <p>
                    Never let an abusive manager make you question your worth or competency. The strongest rebuttal to toxic leadership is thriving in an organization that values your talent, respects your boundaries, and rewards your contributions.
                  </p>
                </>
              ) : (
                <>
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

                  <blockquote className="my-8 border-l-4 border-[#1642D0] pl-6 py-4 bg-blue-50/50 rounded-r-xl text-lg sm:text-xl font-serif italic text-[#020618] leading-relaxed">
                    &ldquo;Design is not just what it looks like and feels like. Design is how it works under real-world operational pressure.&rdquo;
                  </blockquote>

                  <p>
                    Research across Fortune 500 enterprises indicates that organizations with top-quartile design scores generate 32 percentage points higher revenue growth and 56 percentage points higher total returns to shareholders compared to their industry peers.
                  </p>
                </>
              )}
            </div>

          </article>

          {/* RIGHT SIDEBAR (Matching reference screenshot: Sponsored Financial Content + Latest News) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            
            {/* Sponsored Financial Content Block matching screenshot */}
            <div className="space-y-3.5">
              <div className="border-b border-slate-200 pb-1.5">
                <h3 className="text-sm font-bold font-sans text-[#111827] my-0">
                  Sponsored Financial Content
                </h3>
              </div>

              <div className="space-y-4 pt-1">
                {SPONSORED_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href="#"
                    className="group flex items-start gap-3.5 no-underline"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-[68px] h-[52px] flex-shrink-0 overflow-hidden rounded-[2px] border border-slate-200 shadow-2xs">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Text Details */}
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-[12.5px] font-sans font-normal text-[#111827] leading-[1.32] group-hover:underline group-hover:text-[#1642D0] transition-colors my-0">
                        {item.title}
                      </h4>
                      <span className="text-[11px] font-sans text-slate-500 block pt-0.5">
                        {item.source}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Additional Latest News Stream */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <h3 className="text-base font-bold font-serif text-[#020618] my-0">
                  Latest News
                </h3>
                <Link href="/topic/business-news" className="text-xs font-bold text-[#1642D0] uppercase tracking-wider hover:underline">
                  See All
                </Link>
              </div>

              <div className="space-y-4">
                {LATEST_ARTICLES.slice(0, 5).map((latest) => (
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

      {/* 2. Footer */}
      <Footer />
    </div>
  );
}
