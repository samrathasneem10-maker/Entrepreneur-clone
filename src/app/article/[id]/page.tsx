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

const RELATED_CONTENT_ITEMS = [
  {
    id: 'rel-1',
    category: 'BUILDING A BUSINESS',
    title: "An Introvert's Case for Skipping Small Talk and Building Real Connections",
    author: 'AYTEKIN TANK',
    imageUrl: '/images/related-introvert.png',
    slug: '/article/an-introverts-case-for-skipping-small-talk',
  },
  {
    id: 'rel-2',
    category: 'BUILDING A BUSINESS',
    title: "Not Every Boss Deserves a Thank-You Card. Here’s What to Do When Your Boss Is a Bully.",
    author: 'MITA MALLICK',
    imageUrl: '/images/related-boss-bully.png',
    slug: '/article/not-every-boss-deserves-a-thank-you-card',
  },
  {
    id: 'rel-3',
    category: 'BUSINESS NEWS',
    title: "He Leads a $240 Billion Food Giant. Here’s the Difficult Management Rule He Follows.",
    author: 'SHERIN SHIBU',
    imageUrl: '/images/related-food-giant.png',
    slug: '/article/he-leads-a-240-billion-food-giant',
  },
  {
    id: 'rel-4',
    category: 'BUILDING A BUSINESS',
    title: 'How This Trio Built a Multi-Million Dollar Supply Chain Powerhouse From a Garage',
    author: 'JASON FEIFER',
    imageUrl: '/images/related-founders-warehouse.png',
    slug: '/article/how-this-trio-built-a-supply-chain-powerhouse',
  },
  {
    id: 'rel-5',
    category: 'LEADERSHIP',
    title: "Taking the Leap: What Great Leaders Do When the Path Ahead Isn't Clear",
    author: 'TERRY RICE',
    imageUrl: '/images/related-jumping-cliff.png',
    slug: '/article/taking-the-leap-what-great-leaders-do',
  },
  {
    id: 'rel-6',
    category: 'TECHNOLOGY',
    title: 'AI Is Changing Your Company Culture Whether You Planned for It or Not',
    author: 'AMANDA BREEN',
    imageUrl: '/images/related-robot-hands.png',
    slug: '/article/ai-is-changing-your-company-culture',
  },
];

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = typeof params?.id === 'string' ? params.id : 'not-every-boss-deserves-a-thank-you-card';
  const rawArticle = getArticleById(articleId);

  const isBossArticle = articleId.includes('boss') || articleId.includes('bully');

  // Metadata matching user's reference screenshot (53 Side Hustle Ideas) or authentic Boss article
  const article = {
    ...rawArticle,
    category: isBossArticle ? 'BUILDING A BUSINESS' : 'THOUGHT LEADERS',
    title: isBossArticle
      ? 'Not Every Boss Deserves a Thank-You Card. Here’s What to Do When Your Boss Is a Bully.'
      : '53 Side Hustle Ideas to Make Extra Money in 2026',
    excerpt: isBossArticle
      ? 'As some of us celebrate National Boss’s Day, it’s important to remember that not everyone has a good relationship with their boss.'
      : 'From freelancing to selling products, find out how to earn extra income today.',
    author: {
      name: isBossArticle ? 'MITA MALLICK' : 'R.L. ADAMS',
    },
    editor: isBossArticle ? 'KARA MCINTYRE' : 'AMANDA BREEN',
    date: isBossArticle ? 'OCT 14, 2026' : 'JAN 26, 2026',
    imageUrl: isBossArticle ? (rawArticle?.imageUrl || '/images/hero-mentor.jpg') : '/images/side-hustle-53.jpg',
  };

  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTogglePlay = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const textToSpeak = `${article.title}. ${article.excerpt || ''}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // 8 Related articles for the bottom grid
  const relatedArticles = ALL_ARTICLES.filter((a) => a.id !== article.id).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* 1. Header with Sticky Reading Progress Bar */}
      <Header showProgressBar={true} />

      {/* Main Article Container with 2-Column Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT/MAIN CONTENT (8 columns on large screens) */}
          <article className="lg:col-span-8 space-y-4">
            
            {/* Category above headline */}
            <div className="mb-2">
              <Link
                href={`/topic/${(article.category || 'thought-leaders').toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] hover:underline"
              >
                {article.category || 'THOUGHT LEADERS'}
              </Link>
            </div>

            {/* Main Headline (H1): Exact styling from reference screenshot */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-serif font-bold text-[#020618] leading-[1.14] tracking-tight my-0">
              {article.title}
            </h1>

            {/* Subtitle / Excerpt */}
            {article.excerpt && (
              <p className="text-slate-600 text-base sm:text-lg lg:text-[18.5px] font-serif font-normal leading-relaxed my-0 pt-1">
                {article.excerpt}
              </p>
            )}

            {/* Horizontal Line ABOVE Byline matching reference screenshot */}
            <div className="border-t border-slate-200 mt-4 mb-2.5" />

            {/* Author & Date Row: BY R.L. ADAMS | JAN 26, 2026 */}
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-slate-500 flex flex-wrap items-center gap-1.5 py-0.5">
              <span className="text-slate-500 font-semibold">BY</span>
              <Link
                href={`/author/${(article.author?.name || 'rl-adams').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="text-[#1642D0] font-bold hover:underline decoration-[#1642D0] underline-offset-2"
              >
                {article.author?.name || 'R.L. ADAMS'}
              </Link>
              <span className="text-slate-300 mx-1.5 select-none font-normal">|</span>
              <span className="text-slate-500 font-normal">{article.date || 'JAN 26, 2026'}</span>
            </div>

            {/* Horizontal Line BELOW Byline matching reference screenshot */}
            <div className="border-b border-slate-200 mt-2.5 mb-4" />

            {/* Action Bar: SHARE on left, COMMENT on right matching Images 2 & 3 */}
            <div className="flex items-center justify-between py-1 mb-2.5">
              {/* Left: SHARE */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs font-bold text-[#020618] hover:text-[#1642D0] tracking-wider font-sans uppercase transition-colors cursor-pointer"
                title={copied ? 'Copied link!' : 'Copy Link'}
                aria-label="Copy Link"
              >
                <span>SHARE</span>
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-800" />}
              </button>

              {/* Right: COMMENT */}
              <button
                onClick={() => {
                  const el = document.getElementById('comments-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 text-xs font-bold text-[#314158] hover:text-[#1642D0] tracking-wider font-sans uppercase transition-colors cursor-pointer"
                aria-label="Comment"
              >
                <svg className="w-4 h-4 fill-[#314158] shrink-0" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                <span>COMMENT</span>
              </button>
            </div>

            {/* Listen to this post Bar matching Images 2 & 3 */}
            <div className="w-full border border-slate-200/90 rounded-md bg-white px-3.5 py-2.5 mb-4 flex items-center justify-between shadow-2xs">
              <button
                onClick={handleTogglePlay}
                className="flex items-center gap-3 group cursor-pointer text-left focus:outline-hidden"
                aria-label={isPlaying ? 'Pause audio' : 'Listen to this post'}
              >
                <div className="w-7 h-7 rounded-full bg-[#10182b] group-hover:bg-[#1642D0] transition-colors flex items-center justify-center shrink-0">
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-white text-white" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                  )}
                </div>
                <span className="font-sans font-bold text-sm text-[#10182b] group-hover:text-[#1642D0] transition-colors">
                  {isPlaying ? 'Pause listening' : 'Listen to this post'}
                </span>
              </button>

              {isPlaying && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-sans animate-pulse">
                  <Volume2 className="w-4 h-4 text-[#1642D0]" />
                  <span>Playing audio...</span>
                </div>
              )}
            </div>

            {/* Main Featured Article Image matching reference screenshot */}
            <div className="w-full my-4 overflow-hidden">
              <img
                src={article.imageUrl || '/images/side-hustle-53.jpg'}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Image caption and opinions disclaimer matching screenshot */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-sans pt-1 pb-2">
              <span className="italic">Opinions expressed by Entrepreneur contributors are their own.</span>
              <span className="text-slate-400 font-sans text-[11px]">kundoy | Getty Images</span>
            </div>

            {/* Key Takeaways Section matching reference screenshot */}
            <div className="pt-2 pb-1">
              <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#020618] my-0">
                Key Takeaways
              </h2>
              <ul className="mt-4 space-y-3 text-base sm:text-[16.5px] font-serif text-slate-800 leading-relaxed list-none p-0">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5 shrink-0 block" />
                  <span>
                    Side hustles can help you pay off debt, save up an emergency fund and more.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5 shrink-0 block" />
                  <span>
                    No matter where your interests or skill sets lie, there&apos;s probably a gig for you.
                  </span>
                </li>
              </ul>
            </div>

            {/* Underline after Key Takeaways matching screenshot */}
            <div className="border-b border-slate-200 mt-6 mb-7" />

            {/* Rectangle Box: Entrepreneur Virtual Event Card matching reference screenshot */}
            <div className="bg-[#f8f9fa] border border-slate-200/90 rounded-xl p-5 sm:p-7 mb-7 shadow-2xs">
              {/* Header with Entrepreneur logo icon */}
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 bg-black text-white font-serif font-bold text-xs flex items-center justify-center rounded-[2px] leading-none shrink-0">
                  E
                </span>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-500">
                  ENTREPRENEUR VIRTUAL EVENT
                </span>
              </div>

              {/* Straight line inside card spanning left text column matching reference screenshot */}
              <div className="w-full md:w-[60%] border-b border-slate-200/90 mt-2.5 mb-5" />

              {/* 2-Column content */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Side */}
                <div className="md:col-span-8 space-y-3">
                  <h3 className="text-xl sm:text-[23px] font-sans font-bold text-[#020618] leading-[1.25] my-0">
                    Small Audience, Big Sales: How to Make Money With Social Media
                  </h3>
                  <p className="text-sm sm:text-[14.5px] font-serif text-slate-700 leading-relaxed my-0 pt-1">
                    Join our free event and learn from an expert who&apos;s helped 100+ creators turn social media into real revenue.
                  </p>
                  <div className="pt-3">
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1642D0] hover:bg-[#1236a8] text-white text-xs sm:text-[13px] font-sans font-bold rounded-[3px] shadow-2xs transition-colors cursor-pointer"
                    >
                      Register for Free
                    </a>
                  </div>
                </div>

                {/* Right Side Event Speaker Card */}
                <div className="md:col-span-4 flex justify-center md:justify-end">
                  <img
                    src="/images/event-speaker-card.png"
                    alt="Natalie Ruiz • CEO of AnswerConnect - Event Speaker"
                    className="w-[155px] sm:w-[170px] h-auto object-contain rounded-lg shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Rich Editorial Body Content matching reference screenshot */}
            <div className="max-w-none space-y-7 text-[#2b3445] font-['Georgia',Cambria,'Times_New_Roman',serif] text-[18px] lg:text-[18.5px] leading-[32px] lg:leading-[33px] pt-2">
              <p className="m-0">
                Are you looking for ways to make extra money on the side while maintaining your day job? You&apos;re not alone. Whether it&apos;s to pay off debt, save up an emergency fund or simply have a little more money in your pocket, there are plenty of opportunities available to help you supplement your income.
              </p>

              <p className="m-0">
                From online freelancing jobs to traditional side hustles, this comprehensive list outlines actionable ideas you can start today. Here are the top side hustle opportunities to generate income in 2026.
              </p>

                  {/* Section 1 Heading matching Images 2 & 3 */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-4 mb-3 tracking-tight">
                    1. Don&apos;t normalize the behavior just because it&apos;s your boss
                  </h2>

                  <p className="m-0">
                    When you are working for someone who is a bully, we may use{' '}
                    <a
                      href="#"
                      className="text-[#1642D0] underline underline-offset-[3px] decoration-1 decoration-[#1642D0] hover:text-[#0d2d8d] font-normal"
                    >
                      power dynamics
                    </a>{' '}
                    as an excuse. We tolerate things from a boss that we wouldn&apos;t tolerate from a colleague. And of course, we may be scared of losing our jobs, so we normalize this behavior. If a bully boss shuts you down, calls you names and makes inappropriate jokes, and consistently crosses boundaries, this isn&apos;t them just having a bad day. This is a pattern of bad, bullying behavior.
                  </p>

                  <p className="m-0">
                    I remember rationalizing his behavior. &ldquo;Well, that&apos;s just how he is,&rdquo; and &ldquo;Maybe I&apos;m being too sensitive,&rdquo; and &ldquo;This is the price I pay to have this big title and paycheck,&rdquo; or &ldquo;He is just under a lot of stress.&rdquo; Just because they are the boss doesn&apos;t mean they can behave this way. Ask yourself if you would allow a colleague to treat you this way? Chances are you wouldn&apos;t.
                  </p>

                  {/* Advertisement 1: JustAnswer Expert Chat Card matching Image 2 */}
                  <div className="max-w-[300px] mx-auto border border-slate-300 bg-white rounded-md overflow-hidden my-8 font-sans shadow-2xs">
                    <div className="relative w-full">
                      <img
                        src="/images/justanswer-expert.png"
                        alt="Chat with an expert Online Now"
                        className="w-full h-auto object-cover"
                      />
                      {/* Google AdChoices icon in top right matching Image 2 */}
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

                  <p className="m-0">
                    I wish I had documented what was happening at work during this time. Some days I thought it would get better. Some days I thought I was imagining things. Some days I thought I could push through. Some days, I felt myself disappearing. My confidence was completely shaken.
                  </p>

                  <p className="m-0">
                    Document what&apos;s happening. As I discuss in my book,{' '}
                    <a
                      href="#"
                      className="text-[#1642D0] underline underline-offset-[3px] decoration-1 decoration-[#1642D0] hover:text-[#0d2d8d] italic font-serif"
                    >
                      The Devil Emails at Midnight: What Good Leaders Can Learn from Bad Bosses
                    </a>
                    , where there&apos;s smoke, there&apos;s fire. A boss who bullies you once will do it again and again, testing your boundaries. And if they are bullying you, chances are, they have bullied others too. Make sure to keep your{' '}
                    <a
                      href="#"
                      className="text-[#1642D0] underline underline-offset-[3px] decoration-1 decoration-[#1642D0] hover:text-[#0d2d8d] font-normal"
                    >
                      documentation
                    </a>{' '}
                    off your work laptop and save screenshots of texts, emails and Slack messages. Keep a record of the facts: when it happened, what happened, if anyone else was present and how it impacted your work. You will want to use this documentation in the future if you decide to contact an employment lawyer. And, for now, you can review what&apos;s happening and remind yourself that you are not the problem. You are, in fact, the target of bullying.
                  </p>

                  {/* Section 3 Heading matching Image 4 */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] pt-6 mb-4 tracking-tight leading-tight">
                    3. Know your rights
                  </h2>

                  <p className="m-0">
                    When your boss is the bully, speaking up can feel really risky. I wish I had known my rights and I wish I knew back then silence wasn&apos;t my only option. That&apos;s where{' '}
                    <a
                      href="#"
                      className="text-[#1642D0] underline underline-offset-[3px] decoration-1 decoration-[#1642D0] hover:text-[#0d2d8d] font-normal"
                    >
                      Lift Our Voices
                    </a>
                    , founded by Gretchen Carlson and Julie Roginsky, is an invaluable resource.
                  </p>

                  <p className="m-0">
                    Lift Our Voices is working to challenge workplace silencing mechanisms and help employees better understand their rights. It&apos;s{' '}
                    <a
                      href="#"
                      className="text-[#1642D0] underline underline-offset-[3px] decoration-1 decoration-[#1642D0] hover:text-[#0d2d8d] font-normal"
                    >
                      LOV Where You Work AI Tool
                    </a>{' '}
                    is a game-changing free resource designed to help employees make sense of employment agreements. The tool can help you identify provisions that would affect your ability to speak up. You can upload your employment contract and onboarding documents to this tool. It will help give you a better sense of what you signed and what rights and options are available to you if you are the target of workplace bullying. You may also decide to talk to trusted friends and mentors, and consult an employment attorney.
                  </p>

                  {/* Advertisement 2: JustAnswer Expert Chat Card matching Images 3 & 4 */}
                  <div className="max-w-[300px] mx-auto border border-slate-300/80 rounded-md overflow-hidden my-8 font-sans shadow-xs">
                    {/* Title Header ABOVE the image matching website */}
                    <div className="bg-[#eafbf8] px-3.5 py-2.5 flex items-center justify-between border-b border-[#c8ebe5]">
                      <h4 className="font-sans font-bold text-[13px] sm:text-[14px] text-[#27615b] my-0 leading-tight">
                        Chat with an expert Online<br />Now
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#00a4e4] tracking-tight">justanswer</span>
                        <div className="flex items-center gap-0.5 text-[9px] text-[#00a4e4]">
                          <span>▷</span>
                          <span className="text-slate-400">⋮</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <img
                        src="/images/justanswer-expert.png"
                        alt="Chat with an expert Online Now"
                        className="w-full h-auto object-cover"
                      />
                    </div>

                    {/* Dark green Open button bar matching Image 4 */}
                    <a
                      href="#"
                      className="bg-[#082b25] hover:bg-[#0c3d35] px-4 py-2.5 flex items-center justify-between text-white font-sans text-sm font-semibold transition-colors block no-underline"
                    >
                      <span>Open</span>
                      <span className="text-base font-bold leading-none">&gt;</span>
                    </a>
                  </div>

                  {/* Conclusion Paragraph matching Image 5 */}
                  <p className="m-0">
                    For some, National Boss&apos;s Day is a day to thank the boss who makes work better. But if your boss is the reason you dread going to work, you don&apos;t owe them a card or a mug or a thank you. You owe yourself a plan. Understand and validate what you are experiencing. Document what&apos;s happening. Finally, map out your options. Remember that having a boss doesn&apos;t mean giving up{' '}
                    <a
                      href="#"
                      className="text-[#1642D0] underline underline-offset-[3px] decoration-1 decoration-[#1642D0] hover:text-[#0d2d8d] font-normal"
                    >
                      your voice
                    </a>
                    . It means learning when and how to use it.
                  </p>

                  {/* Subscription Callout Bar matching Image 5 */}
                  <div className="border-l-[3.5px] border-[#1642D0] pl-4 py-1 my-8">
                    <p className="text-[15px] sm:text-[16px] italic font-['Georgia',serif] text-slate-700 m-0 leading-normal">
                      Get unlimited access to our tools, playbooks and insights built to grow your business.{' '}
                      <a href="#" className="text-[#1642D0] underline underline-offset-[3px] not-italic font-sans font-semibold hover:text-[#0d2d8d]">
                        Subscribe now.
                      </a>
                    </p>
                  </div>

                  {/* Bottom Divider Line matching Image 5 */}
                  <div className="border-b border-slate-200 mt-8 mb-10" />

                  {/* Comments Section (linked to COMMENT button) */}
                  <section id="comments-section" className="pt-2 mb-10">
                    <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-200">
                      <svg className="w-5 h-5 fill-[#314158]" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                      </svg>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] my-0">
                        Comments
                      </h3>
                      <span className="text-xs font-sans font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        0
                      </span>
                    </div>

                    {/* Comment Input Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                      <label htmlFor="article-comment" className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-sans mb-2">
                        Join the Discussion
                      </label>
                      <textarea
                        id="article-comment"
                        rows={3}
                        placeholder="What are your thoughts on this story? Leave a comment..."
                        className="w-full bg-white border border-slate-200 rounded-md p-3 text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-[#1642D0] focus:border-transparent resize-y"
                      />
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-slate-400 font-sans">
                          Sign in to submit your comment
                        </span>
                        <button
                          type="button"
                          className="bg-[#1642D0] hover:bg-[#0d2d8d] text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-md transition-colors cursor-pointer"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>

                    <div className="text-center py-6 text-slate-400 font-sans text-sm border border-dashed border-slate-200 rounded-lg">
                      No comments yet. Be the first to share your perspective!
                    </div>
                  </section>
            </div>

          </article>

          {/* RIGHT SIDEBAR (Matching reference screenshot) */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            {/* 1. Top Right Sidebar Advertisement (336 x 770) matching reference image */}
            <div className="w-full max-w-[336px] mx-auto">
              <p className="text-[11px] font-sans font-normal uppercase tracking-wider text-[#777777] text-center mb-2.5 my-0 select-none">
                ADVERTISEMENT
              </p>
              <div className="w-full h-[600px] sm:h-[700px] lg:h-[770px] bg-[#f9f9f9] border border-[#e5e7eb] flex items-center justify-center shadow-2xs">
                <span className="text-2xl sm:text-3xl font-sans text-[#777777] font-normal select-none">
                  336 x 770
                </span>
              </div>
            </div>

            {/* Underline right before Latest heading matching reference screenshot */}
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
                      AI Is Changing Your Company Culture Whether You Planned for It or Not. Here&apos;s How to Shape What Happens Next.
                    </Link>
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider text-slate-500 mt-1.5 font-medium">
                    <span className="text-slate-400">•</span>
                    <span>15 HOURS AGO</span>
                  </div>
                </article>

                {/* Story 2 */}
                <article className="group">
                  <h4 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.3] my-0">
                    <Link
                      href="/topic/business-news"
                      className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors"
                    >
                      Creators Are Handing Their Video Edits to AI. Here&apos;s Where It Starts to Backfire.
                    </Link>
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider text-slate-500 mt-1.5 font-medium">
                    <span className="text-slate-400">•</span>
                    <span>15 HOURS AGO</span>
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
                    <span>15 HOURS AGO</span>
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

        {/* RELATED CONTENT GRID SECTION (Matching Reference Screenshot) */}
        <section className="mt-14 pt-8 border-t border-slate-200">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] my-0">
              Related Content
            </h2>
          </div>

          {/* 3-Column Grid matching reference screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {RELATED_CONTENT_ITEMS.map((item) => (
              <article key={item.id} className="group flex flex-col">
                <Link
                  href={item.slug}
                  className="block overflow-hidden rounded-xl border border-slate-200/60 shadow-2xs aspect-[16/9.5] bg-slate-100"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </Link>

                <div className="pt-3.5 flex flex-col flex-1">
                  <Link
                    href={`/topic/${item.category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] hover:underline mb-2 block"
                  >
                    {item.category}
                  </Link>

                  <h3 className="text-[17.5px] sm:text-[18.5px] font-serif font-bold text-[#020618] leading-[1.3] group-hover:text-[#1642D0] transition-colors mb-2.5">
                    <Link href={item.slug} className="hover:underline">
                      {item.title}
                    </Link>
                  </h3>

                  <div className="mt-auto text-xs font-sans uppercase tracking-wider text-slate-500 font-medium">
                    <span className="text-slate-400 font-semibold">BY </span>
                    <Link
                      href={`/author/${item.author.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[#1642D0] font-bold hover:underline"
                    >
                      {item.author}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      {/* 2. Footer */}
      <Footer />
    </div>
  );
}
