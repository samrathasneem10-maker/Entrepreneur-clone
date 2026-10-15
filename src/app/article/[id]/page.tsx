'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  ArrowRight,
  ExternalLink,
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
  const [isPlaying, setIsPlaying] = useState(false);

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
            <div className="flex items-center gap-5 sm:gap-6 py-1.5 mb-2">
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

            {/* Text after horizontal line matching Image 1: Opinions disclaimer */}
            <p className="text-xs italic text-slate-500 font-sans my-1">
              Opinions expressed by Entrepreneur contributors are their own.
            </p>

            {/* Audio box: Listen to this post matching Image 1 & 2 */}
            <div
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-full border border-slate-200/90 rounded-md bg-white hover:bg-slate-50/80 px-4 py-2.5 flex items-center justify-between transition-colors cursor-pointer my-4 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0b1329] text-white flex items-center justify-center shrink-0">
                  {isPlaying ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  )}
                </span>
                <span className="text-sm font-sans font-medium text-[#0b1329]">
                  {isPlaying ? 'Playing audio narration (0:45 / 4:18)...' : 'Listen to this post'}
                </span>
              </div>
              {isPlaying && (
                <div className="flex items-center gap-1.5 text-xs text-[#1642D0] font-sans font-semibold">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span className="hidden sm:inline">Playing</span>
                </div>
              )}
            </div>

            {/* Key Takeaways Section matching Image 2 */}
            <div className="pt-2 pb-2">
              <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#020618] my-0">
                Key Takeaways
              </h2>
              <ul className="mt-4 space-y-4 text-base sm:text-[16.5px] font-serif text-slate-800 leading-relaxed list-none p-0">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5 shrink-0 block" />
                  <span>
                    When you are working for someone who is a bully, we may use power dynamics as an excuse — but normalizing this behavior is part of the problem. Call out bad behavior when you see or experience it.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5 shrink-0 block" />
                  <span>
                    Keep a record of the facts: when it happened, what happened, if anyone else was present and how it impacted your work. You will want to use this documentation in the future if you decide to contact an employment lawyer.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5 shrink-0 block" />
                  <span>
                    When your boss is the bully, speaking up can feel really risky, but there are protections in place for employees for this reason.
                  </span>
                </li>
              </ul>
            </div>

            {/* Underline after Key Takeaways matching Image 1 */}
            <div className="border-b border-slate-200 mt-6 mb-7" />

            {/* Franchise Assessment Card matching Image 1 & 2 */}
            <div className="bg-[#f8f9fa] border border-slate-200/90 rounded-xl p-5 sm:p-7 mb-7 shadow-2xs">
              {/* Header with Entrepreneur logo icon */}
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 bg-black text-white font-serif font-bold text-xs flex items-center justify-center rounded-[2px] leading-none shrink-0">
                  E
                </span>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-500">
                  FRANCHISE ASSESSMENT
                </span>
              </div>

              {/* Straight line inside card spanning left text column matching Image 1 */}
              <div className="w-full md:w-[58%] border-b border-slate-900/90 mt-2 mb-5" />

              {/* 2-Column content */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Side */}
                <div className="md:col-span-7 space-y-3">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] leading-[1.22] my-0">
                    Your <span className="text-[#990000]">top franchise matches</span> — filtered by budget, open near you, ranked by fit.
                  </h3>
                  <p className="text-sm sm:text-[14.5px] font-sans text-slate-600 leading-relaxed my-0 pt-1">
                    Answer 5 questions. We search 3,000+ franchises from the Franchise 500 and show you only the ones that match. Free.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/topic/franchises"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white text-xs sm:text-[13px] font-sans font-bold rounded-[3px] shadow-2xs transition-colors cursor-pointer"
                    >
                      Find my franchise →
                    </Link>
                  </div>
                </div>

                {/* Right Side Dark Mockup */}
                <div className="md:col-span-5 bg-[#0d0d0d] p-3 rounded-lg border border-neutral-800 space-y-2">
                  {/* Row 1: Jersey Mike's */}
                  <div className="border border-red-900/80 bg-[#170a0a] rounded-md p-2 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white leading-tight font-sans">Jersey Mike&apos;s Subs</div>
                      <div className="text-[10px] text-neutral-400 font-sans mt-0.5">#1 Franchise 500 • $235k - $760k</div>
                    </div>
                    <span className="bg-red-950/90 text-red-400 border border-red-800/60 text-[9.5px] font-medium px-2 py-0.5 rounded-full shrink-0">
                      #1 match for you
                    </span>
                  </div>

                  {/* Row 2: Anytime Fitness */}
                  <div className="border border-neutral-800 bg-[#161616] rounded-md p-2 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white leading-tight font-sans">Anytime Fitness</div>
                      <div className="text-[10px] text-neutral-400 font-sans mt-0.5">#4 Franchise 500 • $280k - $560k</div>
                    </div>
                    <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800/60 text-[9.5px] font-medium px-2 py-0.5 rounded-full shrink-0">
                      3 territories open
                    </span>
                  </div>

                  {/* Row 3: The UPS Store */}
                  <div className="border border-neutral-800 bg-[#161616] rounded-md p-2 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white leading-tight font-sans">The UPS Store</div>
                      <div className="text-[10px] text-neutral-400 font-sans mt-0.5">#7 Franchise 500 • $138k - $471k</div>
                    </div>
                    <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800/60 text-[9.5px] font-medium px-2 py-0.5 rounded-full shrink-0">
                      See units
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rich Editorial Body Content matching Images 1, 2, and 3 */}
            <div className="prose prose-slate max-w-none space-y-6 text-slate-800 text-base sm:text-lg leading-relaxed font-serif pt-2">
              {isBossArticle ? (
                <>
                  <p>
                    I still remember standing in the kitchen area at work, being pressured to sign that thank you card. It was{' '}
                    <a href="#" className="text-[#1642D0] hover:underline font-normal">
                      National Boss’s Day
                    </a>{' '}
                    and my boss’s executive assistant had a card she wanted us to all sign. It was to thank our boss for being a great boss. The front of the card said, “The world needs more bosses like you!” I felt sick to my stomach, barely scrawling my name inside. The irony was that this boss was one of the worst bosses I had ever worked for.
                  </p>

                  <p>
                    My former boss was the{' '}
                    <a href="#" className="text-[#1642D0] hover:underline font-normal">
                      bully boss
                    </a>
                    . He reminded me of the playground bully who teased and taunted and mocked others. This bully boss also publicly and privately humiliated me. He called me a rat. He told me no one wanted me on their team but only he took a chance on me. When he found out another leader at the company wanted me to rotate onto their team, he screamed at me and said I could leave his team only when he said I could.
                  </p>

                  <p>
                    As some of us celebrate and honor National Boss’s Day, it’s an important moment to remember that not everyone has a good relationship with their boss. Some of us are struggling with a boss who undermines us, makes fun of us, and even threatens to fire us. For anyone struggling with a bully boss, here are three important steps I wish I had taken back then.
                  </p>

                  {/* Section 1 Heading matching Images 2 & 3 */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-4 mb-3 tracking-tight">
                    1. Don&apos;t normalize the behavior just because it&apos;s your boss
                  </h2>

                  <p>
                    When you are working for someone who is a bully, we may use{' '}
                    <a href="#" className="text-[#1642D0] hover:underline font-normal">
                      power dynamics
                    </a>{' '}
                    as an excuse. We tolerate things from a boss that we wouldn&apos;t tolerate from a colleague. And of course, we may be scared of losing our jobs, so we normalize this behavior. If a bully boss shuts you down, calls you names and makes inappropriate jokes, and consistently crosses boundaries, this isn&apos;t them just having a bad day. This is a pattern of bad, bullying behavior.
                  </p>

                  <p>
                    I remember rationalizing his behavior. &ldquo;Well, that&apos;s just how he is,&rdquo; and &ldquo;Maybe I&apos;m being too sensitive,&rdquo; and &ldquo;This is the price I pay to have this big title and paycheck,&rdquo; or &ldquo;He is just under a lot of stress.&rdquo; Just because they are the boss doesn&apos;t mean they can behave this way. Ask yourself if you would allow a colleague to treat you this way? Chances are you wouldn&apos;t.
                  </p>

                  {/* Advertisement 1: JustAnswer Expert Chat Card matching Images 2 & 3 */}
                  <div className="max-w-[300px] mx-auto border border-slate-300 bg-white overflow-hidden my-8 font-sans shadow-2xs">
                    <div className="relative w-full">
                      <img
                        src="/images/justanswer-expert.png"
                        alt="Chat with an expert Online Now"
                        className="w-full h-auto object-cover"
                      />
                      {/* Google AdChoices icon in top right */}
                      <div className="absolute top-1 right-1 bg-white/90 px-1 py-0.5 rounded-xs flex items-center gap-0.5 text-[10px] text-slate-500 shadow-2xs">
                        <span className="text-[9px] text-[#00a4e4]">▷</span>
                        <span className="text-[9px]">ⓘ</span>
                      </div>
                    </div>

                    <div className="p-3 text-left">
                      <h4 className="font-sans font-bold text-[14px] text-black my-0 leading-snug">
                        Chat with an expert Online Now
                      </h4>
                      <div className="flex items-center justify-between text-xs pt-3 text-slate-500 font-sans">
                        <span className="text-[12px] text-slate-500">JustAnswer</span>
                        <a href="#" className="text-[#1a73e8] hover:underline flex items-center font-normal text-[12px]">
                          Open <span className="ml-1 text-[10px]">&gt;</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 Heading matching Image 3 */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-6 mb-4 tracking-tight leading-tight">
                    2. Document what&apos;s happening
                  </h2>

                  <p>
                    I wish I had documented what was happening at work during this time. Some days I thought it would get better. Some days I thought I was imagining things. Some days I thought I could push through. Some days, I felt myself disappearing. My confidence was completely shaken.
                  </p>

                  <p>
                    Document what&apos;s happening. As I discuss in my book,{' '}
                    <a href="#" className="text-[#1642D0] hover:underline italic font-serif">
                      The Devil Emails at Midnight: What Good Leaders Can Learn from Bad Bosses
                    </a>
                    , where there&apos;s smoke, there&apos;s fire. A boss who bullies you once will do it again and again, testing your boundaries. And if they are bullying you, chances are, they have bullied others too. Make sure to keep your{' '}
                    <a href="#" className="text-[#1642D0] hover:underline font-normal">
                      documentation
                    </a>{' '}
                    off your work laptop and save screenshots of texts, emails and Slack messages. Keep a record of the facts: when it happened, what happened, if anyone else was present and how it impacted your work. You will want to use this documentation in the future if you decide to contact an employment lawyer. And, for now, you can review what&apos;s happening and remind yourself that you are not the problem. You are, in fact, the target of bullying.
                  </p>

                  {/* Section 3 Heading matching Image 4 */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-6 mb-4 tracking-tight leading-tight">
                    3. Know your rights
                  </h2>

                  <p>
                    When your boss is the bully, speaking up can feel really risky. I wish I had known my rights and I wish I knew back then silence wasn&apos;t my only option. That&apos;s where{' '}
                    <a href="#" className="text-[#1642D0] hover:underline font-normal">
                      Lift Our Voices
                    </a>
                    , founded by Gretchen Carlson and Julie Roginsky, is an invaluable resource.
                  </p>

                  <p>
                    Lift Our Voices is working to challenge workplace silencing mechanisms and help employees better understand their rights. It&apos;s{' '}
                    <a href="#" className="text-[#1642D0] hover:underline font-normal">
                      LOV Where You Work AI Tool
                    </a>{' '}
                    is a game-changing free resource designed to help employees make sense of employment agreements. The tool can help you identify provisions that would affect your ability to speak up. You can upload your employment contract and onboarding documents to this tool. It will help give you a better sense of what you signed and what rights and options are available to you if you are the target of workplace bullying. You may also decide to talk to trusted friends and mentors, and consult an employment attorney.
                  </p>

                  {/* Advertisement 2: MarketViews ETF Card matching Images 4 & 5 */}
                  <div className="max-w-[300px] mx-auto border border-black bg-white overflow-hidden my-8 font-sans">
                    <div className="w-full border-b border-black">
                      <img
                        src="/images/etf-banner-display.png"
                        alt="What is the latest on ETFs?"
                        className="w-full h-auto object-cover"
                      />
                    </div>

                    <div className="p-3 bg-white text-left">
                      <h4 className="font-serif font-bold text-[14px] text-black my-0 leading-tight">
                        What is the latest on ETFs?
                      </h4>
                      <span className="text-[11px] font-sans text-slate-500 block pt-0.5">
                        MarketViews
                      </span>
                      <div className="flex items-center justify-between mt-3 pt-1">
                        <div className="flex items-center text-slate-400 text-[11px]">
                          <span className="border border-slate-400 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-serif">
                            i
                          </span>
                        </div>
                        <a
                          href="#"
                          className="px-3 py-1 border border-black text-black text-xs font-sans hover:bg-black hover:text-white transition-colors"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Conclusion Paragraph matching Image 5 */}
                  <p>
                    For some, National Boss&apos;s Day is a day to thank the boss who makes work better. But if your boss is the reason you dread going to work, you don&apos;t owe them a card or a mug or a thank you. You owe yourself a plan. Understand and validate what you are experiencing. Document what&apos;s happening. Finally, map out your options. Remember that having a boss doesn&apos;t mean giving up{' '}
                    <a href="#" className="text-[#1642D0] hover:underline font-normal">
                      your voice
                    </a>
                    . It means learning when and how to use it.
                  </p>

                  {/* Subscription Callout Bar matching Image 5 */}
                  <div className="border-l-[3.5px] border-[#1642D0] pl-4 py-1 my-8">
                    <p className="text-[15px] sm:text-[16px] italic font-serif text-slate-700 m-0 leading-normal">
                      Get unlimited access to our tools, playbooks and insights built to grow your business.{' '}
                      <a href="#" className="text-[#1642D0] hover:underline not-italic font-sans font-semibold">
                        Subscribe now.
                      </a>
                    </p>
                  </div>

                  {/* Bottom Divider Line matching Image 5 */}
                  <div className="border-b border-slate-200 mt-8 mb-12" />
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

          {/* RIGHT SIDEBAR (Matching Image 1 & Image 2) */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* 1. Intelligence Test Google Ad Card matching Image 1 & 2 */}
            <div className="border border-slate-200 rounded-sm bg-white overflow-hidden shadow-2xs flex flex-col justify-between min-h-[460px]">
              {/* Banner Header Image with AdChoices */}
              <div className="relative w-full">
                <img
                  src="/images/iq-test-banner.png"
                  alt="Intelligence Test scoring scale"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Ad Body Content */}
              <div className="px-4 py-4 text-center flex flex-col items-center flex-1 justify-between">
                <div>
                  <h3 className="text-xl sm:text-[22px] font-sans font-bold text-[#020618] leading-tight my-0">
                    Test Your IQ in 3 Minutes
                  </h3>

                  {/* Brain Icon */}
                  <div className="my-3">
                    <img
                      src="/images/iq-brain-icon.png"
                      alt="Brain Icon"
                      className="w-9 h-10 object-contain mx-auto"
                    />
                  </div>

                  {/* Blue Link */}
                  <a
                    href="#"
                    className="text-sm font-sans font-medium text-[#1642D0] hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>Global IQ Comparison</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Dark Circular Action Button matching Image 2 */}
                <button
                  aria-label="Start IQ Test"
                  className="w-11 h-11 rounded-full bg-[#1e293b] hover:bg-slate-900 text-white flex items-center justify-center mt-4 mb-2 shadow-sm transition-transform hover:scale-105 cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Underline right before Latest heading matching Image 1 & 2 */}
            <div className="border-t border-slate-200 pt-5 mt-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] my-0">
                  Latest
                </h3>
                <Link
                  href="/topic/business-news"
                  className="flex items-center gap-1.5 text-xs font-sans font-semibold text-slate-800 hover:text-[#1642D0] transition-colors"
                >
                  <span>See All</span>
                  <span className="w-4 h-4 rounded-full bg-[#1642D0] text-white flex items-center justify-center text-[9px] font-bold">
                    ➔
                  </span>
                </Link>
              </div>

              <div className="space-y-5">
                {/* Story 1 */}
                <article className="group">
                  <h4 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.3] my-0">
                    <Link
                      href="/topic/business-news"
                      className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors"
                    >
                      He Leads a $240 Billion Food Giant. Here&apos;s the Difficult Management Rule He Follows.
                    </Link>
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider text-slate-500 mt-1.5 font-medium">
                    <span className="text-slate-400">•</span>
                    <span>17 HOURS AGO</span>
                  </div>
                </article>

                {/* Story 2 */}
                <article className="group">
                  <h4 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.3] my-0">
                    <Link
                      href="/topic/business-news"
                      className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors"
                    >
                      Creators Are Handing Their Video Edits to AI. Here’s Where It Starts to Backfire.
                    </Link>
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider text-slate-500 mt-1.5 font-medium">
                    <span className="text-slate-400">•</span>
                    <span>17 HOURS AGO</span>
                  </div>
                </article>

                {/* Story 3 */}
                <article className="group">
                  <h4 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.3] my-0">
                    <Link
                      href="/topic/leadership"
                      className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors"
                    >
                      He Leads a $240 Billion Food Giant. Here&apos;s the Difficult Management Rule He Follows.
                    </Link>
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider text-slate-500 mt-1.5 font-medium">
                    <span className="text-slate-400">•</span>
                    <span>17 HOURS AGO</span>
                  </div>
                </article>
              </div>
            </div>

            {/* 3. Sponsored Financial Content Block */}
            <div className="pt-6 border-t border-slate-200 space-y-3.5">
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
                    <div className="w-[68px] h-[52px] flex-shrink-0 overflow-hidden rounded-[2px] border border-slate-200 shadow-2xs">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
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
