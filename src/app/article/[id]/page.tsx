'use client';

import React, { useState, useEffect } from 'react';
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
  Bookmark,
} from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { getArticleById, getArticleSlug, slugifyTitle, ALL_ARTICLES, LATEST_ARTICLES } from '@/data/newsData';

const LATEST_SIDEBAR_ARTICLES = [
  {
    id: 'latest-side-1',
    title: 'Apple, Amazon and Microsoft Want These New AI Gadgets on Your Holiday Wish List',
    time: '3 HOURS AGO',
    link: '/article/apple-amazon-and-microsoft-want-these-new-ai-gadgets',
  },
  {
    id: 'latest-side-2',
    title: 'America Finally Got a New Sunscreen. Europeans Have Been Sporting It Since 1999.',
    time: '4 HOURS AGO',
    link: '/article/america-finally-got-a-new-sunscreen',
  },
  {
    id: 'latest-side-3',
    title: "This Popular Pickleball Franchisor Filed for Bankruptcy. Its Founder Says, 'I Own It'",
    time: '4 HOURS AGO',
    link: '/article/this-popular-pickleball-franchisor-filed-for-bankruptcy',
  },
  {
    id: 'latest-side-4',
    title: 'AI Is Changing Your Company Culture Whether You Planned for It or Not.',
    time: '5 HOURS AGO',
    link: '/article/ai-is-changing-your-company-culture',
  },
  {
    id: 'latest-side-5',
    title: "Creators Are Handing Their Video Edits to AI. Here's Where It Starts to Backfire.",
    time: '6 HOURS AGO',
    link: '/article/creators-are-handing-their-video-edits-to-ai',
  },
  {
    id: 'latest-side-6',
    title: "He Leads a $240 Billion Food Giant. Here's the Difficult Management Rule He Follows.",
    time: '7 HOURS AGO',
    link: '/article/he-leads-a-240-billion-food-giant',
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
  const articleId = typeof params?.id === 'string' ? params.id : '53-side-hustle-ideas-to-make-extra-money-in-2026';
  const rawArticle = getArticleById(articleId);

  const isBossArticle = articleId.includes('boss') || articleId.includes('bully') || (rawArticle?.id || '').includes('boss');
  const is53SideHustle =
    articleId === 'latest-1' ||
    articleId.includes('53-side-hustle') ||
    articleId.includes('extra-money') ||
    (rawArticle?.id || '').includes('53-side-hustle');

  const article = {
    ...rawArticle,
    category: isBossArticle
      ? 'Building a Business'
      : is53SideHustle
      ? 'Finance & Economics'
      : (rawArticle.category || 'Finance & Economics'),
    title: isBossArticle
      ? 'Not Every Boss Deserves a Thank-You Card. Here’s What to Do When Your Boss Is a Bully.'
      : is53SideHustle
      ? '53 Side Hustle Ideas to Make Extra Money in 2026'
      : rawArticle.title,
    excerpt: isBossArticle
      ? 'As some of us celebrate National Boss’s Day, it’s important to remember that not everyone has a good relationship with their boss.'
      : is53SideHustle
      ? 'From freelancing to selling products, find out how to earn extra income today.'
      : (rawArticle.excerpt || ''),
    author: {
      name: isBossArticle
        ? 'MITA MALLICK'
        : is53SideHustle
        ? 'R.L. ADAMS'
        : (rawArticle.author?.name || 'R.L. ADAMS'),
      avatar: rawArticle.author?.avatar,
      title: rawArticle.author?.title,
    },
    editor: isBossArticle ? 'KARA MCINTYRE' : is53SideHustle ? 'AMANDA BREEN' : (rawArticle.editor || 'AMANDA BREEN'),
    date: isBossArticle ? 'OCT 14, 2026' : is53SideHustle ? 'JAN 26, 2026' : (rawArticle.date || 'JAN 26, 2026'),
    imageUrl: isBossArticle
      ? (rawArticle.imageUrl || '/images/hero-mentor.jpg')
      : is53SideHustle
      ? '/images/side-hustle-53.jpg'
      : (rawArticle.imageUrl || '/images/side-hustle-53.jpg'),
  };

  // Synchronize browser address bar to canonical title slug if accessed via 'latest-1' or older IDs
  useEffect(() => {
    const canonicalSlug = getArticleSlug(article);
    if (articleId && articleId !== canonicalSlug && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/article/${canonicalSlug}`);
    }
  }, [articleId, article]);

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
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
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 pt-4 pb-10">
        
        {/* Top < BACK TO NEWSFEED bar + horizontal line matching reference image 1 */}
        <div className="w-full mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors font-sans"
          >
            <span className="text-sm font-semibold select-none">&lt;</span>
            <span>BACK TO NEWSFEED</span>
          </Link>
          {/* Horizontal line under < BACK TO NEWSFEED matching Image 1 */}
          <div className="border-b border-slate-200 mt-2.5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT/MAIN CONTENT (8 columns on large screens) */}
          <article className="lg:col-span-8 space-y-4">
            
            {/* Category Heading matching reference image */}
            <div className="mb-2">
              <Link
                href={`/topic/${slugifyTitle(article.category || 'finance-economics')}`}
                className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-wider text-[#1642D0] hover:underline"
              >
                {article.category || 'FINANCE & ECONOMICS'}
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

            {/* Horizontal Line ABOVE Byline matching Image 1 */}
            <div className="border-t border-slate-200 mt-4 mb-3" />

            {/* Part 1: Author Byline & Bookmark right next to date */}
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-sans font-bold uppercase tracking-wider text-slate-800 py-0.5">
              <span className="text-slate-600 font-bold">BY</span>
              <Link
                href={`/author/${(article.author?.name || 'rl-adams').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="text-[#1642D0] hover:underline font-bold"
              >
                {article.author?.name || 'R.L. ADAMS'}
              </Link>
              <span className="text-slate-300 font-normal">|</span>
              <span className="text-slate-500 font-normal">
                {article.date || 'JAN 26, 2026'}
              </span>
              <button
                type="button"
                onClick={() => setBookmarked(!bookmarked)}
                className="text-slate-700 hover:text-[#1642D0] transition-colors cursor-pointer p-0.5 ml-1 flex items-center"
                title={bookmarked ? 'Saved to bookmarks' : 'Bookmark article'}
                aria-label="Bookmark article"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#1642D0] text-[#1642D0]' : 'text-slate-700'}`} />
              </button>
            </div>

            {/* Part 2: Action Bar (Listen to this post, SHARE button, COMMENT) */}
            <div className="flex items-center justify-between pt-3 pb-1 mb-8">
              {/* Left: Listen to this post & SHARE button */}
              <div className="flex items-center gap-4">
                {/* Listen to this post Pill Button */}
                <div className="inline-flex items-center border border-slate-200 rounded-full bg-white px-3.5 py-1.5 shadow-xs hover:border-slate-300 transition-colors">
                  <button
                    onClick={handleTogglePlay}
                    className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-hidden"
                    aria-label={isPlaying ? 'Pause audio' : 'Listen to this post'}
                  >
                    <div className="w-5.5 h-5.5 rounded-full bg-[#10182b] group-hover:bg-[#1642D0] transition-colors flex items-center justify-center shrink-0">
                      {isPlaying ? (
                        <Pause className="w-2.5 h-2.5 fill-white text-white" />
                      ) : (
                        <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                      )}
                    </div>
                    <span className="font-sans font-semibold text-xs sm:text-[13px] text-[#10182b] group-hover:text-[#1642D0] transition-colors">
                      {isPlaying ? 'Pause listening' : 'Listen to this post'}
                    </span>
                  </button>

                  {isPlaying && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans ml-3 animate-pulse">
                      <Volume2 className="w-3.5 h-3.5 text-[#1642D0]" />
                      <span>Playing...</span>
                    </div>
                  )}
                </div>

                {/* SHARE Button (No divider line, explicit SHARE label with icon) */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-slate-700 hover:text-[#1642D0] tracking-wider font-sans uppercase transition-colors cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-slate-100"
                  aria-label="Share article"
                >
                  <span>{copied ? 'COPIED!' : 'SHARE'}</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-700 hover:text-[#1642D0]" />
                  )}
                </button>
              </div>

              {/* Right: COMMENT */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('comments-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#1642D0] tracking-wider font-sans uppercase transition-colors cursor-pointer"
                aria-label="Comment"
              >
                <svg className="w-3.5 h-3.5 fill-slate-600 hover:fill-[#1642D0] shrink-0" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                <span>COMMENT</span>
              </button>
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

                  {/* Divider line before Author Bio matching Image 1 */}
                  <div className="border-b border-slate-200 mt-8 mb-8" />

                  {/* 1. Author Bio Card matching Image 1 */}
                  <div className="flex items-start gap-4 sm:gap-5 pb-6 mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                      <img
                        src="/images/author-sherin.png"
                        alt="Sherin Shibu"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-bold text-base sm:text-lg text-[#020618] my-0 leading-tight">
                          Sherin Shibu
                        </h4>
                        <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#0A66C2] rounded-[2px] text-white text-[9px] font-bold ml-0.5 leading-none hover:opacity-90 transition-opacity"
                          aria-label="Sherin Shibu LinkedIn Profile"
                        >
                          in
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#15803d] mt-1">
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span>Entrepreneur Staff</span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] font-serif text-slate-600 leading-relaxed my-0 pt-1.5">
                        Sherin Shibu is a business news reporter at Entrepreneur.com. She previously worked for PCMag, Business...{' '}
                        <a href="#" className="text-[#1642D0] underline underline-offset-2 hover:text-[#0d2d8d]">
                          Read more
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Horizontal In-Article Advertisement matching Image 2 */}
                  <div className="my-8 max-w-[728px] mx-auto">
                    <p className="text-[11px] font-sans font-normal uppercase tracking-wider text-[#777777] text-center mb-2.5 my-0 select-none">
                      ADVERTISEMENT
                    </p>
                    <div className="w-full h-[90px] sm:h-[100px] bg-[#f9f9f9] border border-[#e5e7eb] flex items-center justify-center shadow-2xs">
                      <span className="text-2xl sm:text-3xl font-sans text-[#777777] font-normal select-none">
                        728 x 90
                      </span>
                    </div>
                  </div>

                  {/* 2. Join the Conversation Section matching Image 1 & Image 2 */}
                  <section id="comments-section" className="pt-4 mb-10">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] my-0">
                      Join the Conversation
                    </h3>
                    <div className="border-b border-slate-200 mt-4 mb-4" />
                    <p className="text-xs sm:text-sm font-serif text-slate-600 mt-2 mb-1">
                      Leave a comment. Be kind. Critique ideas, not people.
                    </p>
                    <p className="text-xs sm:text-sm font-serif text-slate-600 m-0">
                      Read our{' '}
                      <a href="#" className="text-[#1642D0] underline underline-offset-2 hover:text-[#0d2d8d]">
                        community guidelines
                      </a>
                    </p>

                    {/* Comment Textarea and Sign in to post Button matching Image 2 */}
                    <div className="mt-5">
                      <textarea
                        rows={4}
                        placeholder="What do you think?"
                        className="w-full bg-[#f9fafb] border border-slate-200 rounded-md p-3 text-sm font-sans placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] resize-y"
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          type="button"
                          className="bg-[#1642D0] hover:bg-[#0d2d8d] text-white font-sans text-xs sm:text-[13px] font-bold px-5 py-2.5 rounded-md transition-colors cursor-pointer"
                        >
                          Sign in to post
                        </button>
                      </div>
                    </div>
                    <div className="border-b border-slate-200 mt-6" />
                  </section>
            </div>

          </article>

          {/* RIGHT SIDEBAR (Matching Images 1, 2, and 3) */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            {/* 1. Top Right Sidebar Advertisement matching Image 3 */}
            <div className="w-full max-w-[300px] sm:max-w-[336px] mx-auto">
              <p className="text-[11px] font-sans font-normal uppercase tracking-wider text-[#777777] text-center mb-2.5 my-0 select-none">
                ADVERTISEMENT
              </p>
              <div className="w-full h-[250px] sm:h-[280px] lg:h-[300px] bg-[#f9f9f9] border border-[#e5e7eb] flex items-center justify-center shadow-2xs">
                <span className="text-2xl sm:text-3xl font-sans text-[#777777] font-normal select-none">
                  300 x 600
                </span>
              </div>
            </div>

            {/* Horizontal Line before Latest Article matching Image 1 */}
            <div className="border-t border-slate-200 pt-5 mt-6">
              <div className="mb-5">
                <h3 className="text-2xl sm:text-[26px] font-serif font-bold text-[#020618] my-0 tracking-tight">
                  Latest Article
                </h3>
              </div>

              {/* 6 Latest Articles matching Image 1 */}
              <div className="space-y-6 sm:space-y-7">
                {LATEST_SIDEBAR_ARTICLES.map((art) => (
                  <article key={art.id} className="group">
                    <h4 className="text-[16px] sm:text-[17px] font-serif font-bold text-[#020618] leading-[1.3] my-0">
                      <Link
                        href={art.link}
                        className="text-[#020618] hover:text-[#1642D0] hover:underline transition-colors"
                      >
                        {art.title}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-wider text-slate-500 mt-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5A6E85] shrink-0" />
                      <span>{art.time}</span>
                    </div>
                  </article>
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
