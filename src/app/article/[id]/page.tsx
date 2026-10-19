'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Square,
  ArrowRight,
  ExternalLink,
  Bookmark,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { useAuth } from '@/components/auth/AuthContext';
import { getArticleById, getArticleSlug, slugifyTitle, ALL_ARTICLES, LATEST_ARTICLES } from '@/data/newsData';

const LATEST_SIDEBAR_ARTICLES = [
  {
    id: 'latest-side-1',
    title: 'Apple, Amazon and Microsoft Want These New AI Gadgets on Your Holiday Wish List',
    category: 'Breaking Business News',
    categoryHref: '/topic/breaking-business-news',
    time: '3 hours ago',
    link: '/article/apple-amazon-and-microsoft-want-these-new-ai-gadgets',
  },
  {
    id: 'latest-side-2',
    title: 'America Finally Got a New Sunscreen. Europeans Have Been Sporting It Since 1999.',
    category: 'Research and Insights',
    categoryHref: '/topic/research-insights',
    time: '4 hours ago',
    link: '/article/america-finally-got-a-new-sunscreen',
  },
  {
    id: 'latest-side-3',
    title: "This Popular Pickleball Franchisor Filed for Bankruptcy. Its Founder Says, 'I Own It'",
    category: 'Startups and Entrepreneurship',
    categoryHref: '/topic/startups-entrepreneurship',
    time: '4 hours ago',
    link: '/article/this-popular-pickleball-franchisor-filed-for-bankruptcy',
  },
  {
    id: 'latest-side-4',
    title: 'AI Is Changing Your Company Culture Whether You Planned for It or Not.',
    category: 'Leadership',
    categoryHref: '/topic/leadership',
    time: '5 hours ago',
    link: '/article/ai-is-changing-your-company-culture',
  },
  {
    id: 'latest-side-5',
    title: "Creators Are Handing Their Video Edits to AI. Here's Where It Starts to Backfire.",
    category: 'Technology and AI',
    categoryHref: '/topic/technology-ai',
    time: '6 hours ago',
    link: '/article/creators-are-handing-their-video-edits-to-ai',
  },
  {
    id: 'latest-side-6',
    title: "He Leads a $240 Billion Food Giant. Here's the Difficult Management Rule He Follows.",
    category: 'Markets and Investing',
    categoryHref: '/topic/markets-investing',
    time: '7 hours ago',
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

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = typeof params?.id === 'string' ? params.id : '53-side-hustle-ideas-to-make-extra-money-in-2026';
  const rawArticle = getArticleById(articleId);

  const isBossArticle =
    articleId === 'not-every-boss-deserves-a-thank-you-card' ||
    articleId === 'boss-bully' ||
    articleId.includes('not-every-boss-deserves') ||
    (rawArticle?.id || '') === 'not-every-boss-deserves-a-thank-you-card';
  const is53SideHustle =
    articleId === 'latest-1' ||
    articleId === 'side-hustle-53' ||
    articleId === '53-side-hustle-ideas-to-make-extra-money-in-2026' ||
    (rawArticle?.id || '') === '53-side-hustle-ideas-to-make-extra-money-in-2026';

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
        ? 'SHERIN SHIBU'
        : (rawArticle.author?.name || 'SHERIN SHIBU'),
      avatar: isBossArticle
        ? (rawArticle.author?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop')
        : is53SideHustle
        ? '/images/author-sherin.png'
        : (rawArticle.author?.avatar || '/images/author-sherin.png'),
      title: isBossArticle
        ? 'Executive Contributor'
        : is53SideHustle
        ? 'Entrepreneur Staff'
        : (rawArticle.author?.title || 'Entrepreneur Staff'),
      bio: isBossArticle
        ? 'Mita Mallick is a corporate change-maker and author of the Wall Street Journal and USA Today bestseller, Reimagine Inclusion: Debunking 13 Myths to Transform Your Workplace.'
        : is53SideHustle
        ? 'Sherin Shibu is a business news reporter at Entrepreneur.com. She previously worked for PCMag, Business Insider, and specializes in business trends, consumer technology, and entrepreneurship.'
        : (rawArticle.author?.bio || 'Business news reporter and contributor at Entrepreneur.com, covering high-growth ventures, market trends, and modern workplace leadership.'),
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

  // Audio state (Listen to this post)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const commentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auth & Comments state
  const { user, openLogin } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentsList, setCommentsList] = useState([
    {
      id: 'c1',
      author: 'James K.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
      date: '2 hours ago',
      text: 'The breakdown of freelance vs productized side hustles in 2026 is super actionable. Starting on idea #2 this weekend.',
      likes: 14,
    },
    {
      id: 'c2',
      author: 'Sarah Miller',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
      date: '5 hours ago',
      text: 'Consistency is truly key. Having an emergency fund buffer makes taking small business risks much less stressful.',
      likes: 8,
    },
  ]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Audio: Listen to This Post functionality
  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    // If currently playing and not paused, clicking pauses
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // If currently paused, clicking resumes
    if (isPlaying && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setPlaybackTime((t) => t + 1);
      }, 1000);
      return;
    }

    // Start fresh playback
    window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);

    const spokenIntro = `${article.title}. ${article.excerpt || ''}.`;
    const spokenBody = is53SideHustle
      ? 'Today we examine actionable ideas to make extra income in 2026. From freelance remote services to e-commerce and digital products. Key takeaway: Side hustles help accelerate debt payoff and build financial security.'
      : isBossArticle
      ? 'Not every boss deserves a thank you card. When your boss is a bully, do not normalize the behavior, document everything, and know your workplace rights.'
      : `${article.excerpt || article.title}. Reported by ${article.author?.name || 'Entrepreneur Staff'}.`;

    const textToSpeak = `${spokenIntro} ${spokenBody}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('English'))
    );
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setPlaybackTime(0);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    setPlaybackTime(0);

    timerRef.current = setInterval(() => {
      setPlaybackTime((t) => t + 1);
    }, 1000);
  };

  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setPlaybackTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleChangeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackRate(nextSpeed);
    if (isPlaying && utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current.rate = nextSpeed;
      window.speechSynthesis.speak(utteranceRef.current);
    }
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCommentIconClick = () => {
    const el = document.getElementById('comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (commentTextareaRef.current) {
          commentTextareaRef.current.focus();
        }
      }, 450);
    }
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: user ? user.name : 'Community Member',
      avatar: user ? '' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
      date: 'Just now',
      text: commentText.trim(),
      likes: 0,
    };
    setCommentsList([newComment, ...commentsList]);
    setCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);
  };

  // 8 Related articles for the bottom grid
  const relatedArticles = ALL_ARTICLES.filter((a) => a.id !== article.id).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* 1. Header with Sticky Reading Progress Bar */}
      <Header showProgressBar={true} />

      {/* Main Article Container with 2-Column Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 pt-4 pb-10">
        
        {/* Top < BACK TO HOME bar + horizontal line matching reference image 1 */}
        <div className="w-full mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors font-sans"
          >
            <span className="text-sm font-semibold select-none">&lt;</span>
            <span>BACK TO HOME</span>
          </Link>
          {/* Horizontal line under < BACK TO HOME matching Image 1 */}
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

            {/* Main Headline (H1): Bold, Colored Text */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-serif font-bold text-[#1642D0] leading-[1.14] tracking-tight my-0">
              {article.title}
            </h1>

            {/* Subtitle / Excerpt: Bold, Colored Text */}
            {article.excerpt && (
              <p className="text-[#0f2b82] text-base sm:text-lg lg:text-[18.5px] font-serif font-bold leading-relaxed my-0 pt-1">
                {article.excerpt}
              </p>
            )}

            {/* Horizontal Line ABOVE Byline matching Image 1 */}
            <div className="border-t border-slate-200 mt-4 mb-3" />

            {/* Part 1: Author Byline & Bookmark right next to date */}
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-sans font-bold uppercase tracking-wider text-slate-800 py-0.5">
              <span className="text-slate-600 font-bold">BY</span>
              <Link
                href={`/author/${(article.author?.name || 'sherin-shibu').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="text-[#1642D0] hover:underline font-bold"
              >
                {article.author?.name || 'SHERIN SHIBU'}
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
            <div className="pt-3 pb-1 mb-6">
              <div className="flex items-center justify-between">
                {/* Left: Listen to this post & SHARE button */}
                <div className="flex items-center gap-4">
                  {/* Listen to this post Pill Button */}
                  <div className="inline-flex items-center border border-slate-200 rounded-full bg-white px-3.5 py-1.5 shadow-xs hover:border-slate-300 transition-colors">
                    <button
                      onClick={handleTogglePlay}
                      className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-hidden"
                      aria-label={isPlaying && !isPaused ? 'Pause audio' : 'Listen to this post'}
                    >
                      <div className="w-5.5 h-5.5 rounded-full bg-[#10182b] group-hover:bg-[#1642D0] transition-colors flex items-center justify-center shrink-0">
                        {isPlaying && !isPaused ? (
                          <Pause className="w-2.5 h-2.5 fill-white text-white" />
                        ) : (
                          <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                        )}
                      </div>
                      <span className="font-sans font-semibold text-xs sm:text-[13px] text-[#10182b] group-hover:text-[#1642D0] transition-colors">
                        {isPlaying && !isPaused ? 'Pause listening' : isPaused ? 'Resume listening' : 'Listen to this post'}
                      </span>
                    </button>
                  </div>

                  {/* SHARE Button */}
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

                {/* Right: COMMENT (Scrolls to comment section & focuses textarea) */}
                <button
                  type="button"
                  onClick={handleCommentIconClick}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#1642D0] tracking-wider font-sans uppercase transition-colors cursor-pointer"
                  aria-label="Comment"
                >
                  <svg className="w-3.5 h-3.5 fill-slate-600 hover:fill-[#1642D0] shrink-0" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                  <span>COMMENT</span>
                </button>
              </div>

              {/* Active Audio Player Bar when listening */}
              {isPlaying && (
                <div className="w-full bg-[#f0f4f9] border border-[#dbe4ef] rounded-lg p-3 sm:p-3.5 mt-3 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTogglePlay}
                      className="w-8 h-8 rounded-full bg-[#1642D0] hover:bg-blue-800 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      aria-label={isPaused ? 'Resume' : 'Pause'}
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5 fill-white ml-0.5" /> : <Pause className="w-3.5 h-3.5 fill-white" />}
                    </button>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans">
                          {isPaused ? 'Audio Paused' : 'Playing Article Audio'}
                        </span>
                        {!isPaused && (
                          <span className="flex items-center gap-0.5 h-3">
                            <span className="w-0.5 h-2.5 bg-[#1642D0] animate-bounce" />
                            <span className="w-0.5 h-1.5 bg-[#1642D0] animate-pulse" />
                            <span className="w-0.5 h-3 bg-[#1642D0] animate-bounce delay-75" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-sans mt-0.5">
                        {formatTime(playbackTime)} elapsed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleChangeSpeed}
                      className="text-[11px] font-bold font-sans px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-[#1642D0] transition-colors cursor-pointer"
                      title="Playback speed"
                    >
                      {playbackRate}x
                    </button>
                    <button
                      onClick={handleStopAudio}
                      className="text-xs font-semibold font-sans px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                    >
                      Stop
                    </button>
                  </div>
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

            {/* Key Takeaways Section with Bold Colored Subtitle */}
            <div className="pt-2 pb-1">
              <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#1642D0] my-0">
                Key Takeaways
              </h2>
              <ul className="mt-4 space-y-3 text-base sm:text-[16.5px] font-serif text-slate-800 leading-relaxed list-none p-0">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1642D0] mt-2.5 shrink-0 block" />
                  <span>
                    Side hustles can help you pay off debt, save up an emergency fund and create new financial freedom.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1642D0] mt-2.5 shrink-0 block" />
                  <span>
                    The highest-earning side hustles in 2026 combine specialized skills, digital distribution, and recurring client relationships.
                  </span>
                </li>
              </ul>
            </div>

            {/* Underline after Key Takeaways matching screenshot */}
            <div className="border-b border-slate-200 mt-6 mb-7" />

            {/* Rich Editorial Body Content with Bold, Colored Subtitles */}
            <div className="max-w-none space-y-7 text-[#2b3445] font-['Georgia',Cambria,'Times_New_Roman',serif] text-[18px] lg:text-[18.5px] leading-[32px] lg:leading-[33px] pt-2">
              {is53SideHustle ? (
                <>
                  <p className="m-0">
                    Are you looking for ways to make extra money on the side while maintaining your day job? You&apos;re not alone. Whether it&apos;s to pay off debt, save up an emergency fund or simply have a little more money in your pocket, there are plenty of high-income opportunities available to help you supplement your income in 2026.
                  </p>

                  <p className="m-0">
                    From online freelancing jobs to traditional side hustles, this comprehensive breakdown outlines actionable ideas and proven strategies you can start executing today.
                  </p>

                  {/* Subtitle 1: Bold, Colored Text */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1642D0] pt-6 mb-3 tracking-tight">
                    1. High-Demand Freelance &amp; Remote Services
                  </h2>
                  <p className="m-0">
                    Freelancing remains one of the fastest paths to extra income because it monetizes skills you already possess. High-earning remote skills include technical copywriting, full-stack web design, SEO optimization, and financial bookkeeping. With businesses increasingly outsourcing project-based work, independent contractors can charge premium hourly rates or fixed project fees.
                  </p>
                  <p className="m-0">
                    Specialized virtual assistant roles—such as executive schedule management, CRM administration, and bilingual client outreach—are commanding lucrative recurring retainers.
                  </p>

                  {/* Subtitle 2: Bold, Colored Text */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1642D0] pt-6 mb-3 tracking-tight">
                    2. E-Commerce, Digital Assets &amp; Product Flipping
                  </h2>
                  <p className="m-0">
                    Selling digital products has near-zero marginal cost of replication. Creators are generating consistent monthly revenue selling customizable Notion planners, Canva presentation templates, spreadsheet financial models, and specialized 3D printer schematics.
                  </p>
                  <p className="m-0">
                    For those who prefer physical goods, curated vintage apparel and niche electronics flipping on dedicated marketplaces provide rapid cash flow with minimal upfront inventory capital.
                  </p>

                  {/* Subtitle 3: Bold, Colored Text */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1642D0] pt-6 mb-3 tracking-tight">
                    3. Content Creation, Newsletters &amp; Media Production
                  </h2>
                  <p className="m-0">
                    Building a niche newsletter or media platform enables multiple revenue streams, including premium subscriptions, sponsor shoutouts, and high-converting affiliate partnerships. Audio and video editing for popular podcasts and short-form video creators is also in peak demand.
                  </p>

                  {/* Subtitle 4: Bold, Colored Text */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1642D0] pt-6 mb-3 tracking-tight">
                    4. Asset Monetization &amp; High-Yield Local Services
                  </h2>
                  <p className="m-0">
                    Local services such as mobile auto detailing, pet care, mobile notary signing, and home organization require little initial overhead and scale via word-of-mouth. Furthermore, monetizing unused parking spaces, storage garages, or specialized camera gear provides hands-off residual income.
                  </p>
                </>
              ) : isBossArticle ? (
                <>
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

                  {/* Subtitle 1: Bold, Colored Text */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1642D0] pt-6 mb-3 tracking-tight">
                    1. Don&apos;t normalize the behavior just because it&apos;s your boss
                  </h2>
                  <p className="m-0">
                    I remember rationalizing his behavior. &ldquo;Well, that&apos;s just how he is,&rdquo; and &ldquo;Maybe I&apos;m being too sensitive,&rdquo; and &ldquo;This is the price I pay to have this big title and paycheck,&rdquo; or &ldquo;He is just under a lot of stress.&rdquo; Just because they are the boss doesn&apos;t mean they can behave this way. Ask yourself if you would allow a colleague to treat you this way? Chances are you wouldn&apos;t.
                  </p>

                  {/* Subtitle 2: Bold, Colored Text */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1642D0] pt-6 mb-4 tracking-tight leading-tight">
                    2. Document what&apos;s happening
                  </h2>
                  <p className="m-0">
                    Document what&apos;s happening. As I discuss in my book, where there&apos;s smoke, there&apos;s fire. A boss who bullies you once will do it again and again, testing your boundaries. And if they are bullying you, chances are, they have bullied others too. Make sure to keep your documentation off your work laptop and save screenshots of texts, emails and Slack messages.
                  </p>

                  {/* Subtitle 3: Bold, Colored Text */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1642D0] pt-6 mb-4 tracking-tight leading-tight">
                    3. Know your rights
                  </h2>
                  <p className="m-0">
                    When your boss is the bully, speaking up can feel really risky. Understand and validate what you are experiencing. Document what&apos;s happening. Finally, map out your options and protect your mental health and career trajectory.
                  </p>
                </>
              ) : (
                <>
                  <p className="m-0">{article.excerpt}</p>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1642D0] pt-6 mb-3 tracking-tight">
                    Key Strategies and Practical Takeaways
                  </h2>
                  <p className="m-0">
                    Building sustainable success requires clear vision, intentional leadership, and the discipline to execute day in and day out. As markets evolve, leaders must adapt to emerging technologies and consumer behaviors.
                  </p>
                </>
              )}

              {/* Subscription Callout Bar */}
              <div className="border-l-[3.5px] border-[#1642D0] pl-4 py-1 my-8">
                <p className="text-[15px] sm:text-[16px] italic font-['Georgia',serif] text-slate-700 m-0 leading-normal">
                  Get unlimited access to our tools, playbooks and insights built to grow your business.{' '}
                  <a href="#" className="text-[#1642D0] underline underline-offset-[3px] not-italic font-sans font-semibold hover:text-[#0d2d8d]">
                    Subscribe now.
                  </a>
                </p>
              </div>

              {/* Divider line before Author Bio */}
              <div className="border-b border-slate-200 mt-8 mb-8" />

              {/* Author Bio Card */}
              <div className="flex items-start gap-4 sm:gap-5 pb-6 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                  <img
                    src={article.author?.avatar || '/images/author-sherin.png'}
                    alt={article.author?.name || 'Sherin Shibu'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#020618] my-0 leading-tight">
                      <Link
                        href={`/author/${(article.author?.name || 'sherin-shibu').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="hover:text-[#1642D0] hover:underline transition-colors"
                      >
                        {article.author?.name || 'Sherin Shibu'}
                      </Link>
                    </h4>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#0A66C2] rounded-[2px] text-white text-[9px] font-bold ml-0.5 leading-none hover:opacity-90 transition-opacity"
                      aria-label={`${article.author?.name || 'Author'} LinkedIn Profile`}
                    >
                      in
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#15803d] mt-1">
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span>{article.author?.title || 'Entrepreneur Staff'}</span>
                  </div>
                  <p className="text-xs sm:text-[13.5px] font-serif text-slate-600 leading-relaxed my-0 pt-1.5">
                    {article.author?.bio || 'Business news reporter at Entrepreneur.com, covering trends in business, tech, and enterprise.'}{' '}
                    <Link
                      href={`/author/${(article.author?.name || 'sherin-shibu').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="text-[#1642D0] underline underline-offset-2 hover:text-[#0d2d8d]"
                    >
                      Read more
                    </Link>
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
              <section id="comments-section" className="pt-4 mb-10 scroll-mt-24">
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

                {/* Comment Textarea and Login / Post Button */}
                <div className="mt-5">
                  <textarea
                    ref={commentTextareaRef}
                    id="comment-textarea"
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="What do you think?"
                    className="w-full bg-[#f9fafb] border border-slate-200 rounded-md p-3 text-sm font-sans placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] resize-y transition-all"
                  />

                  {commentSuccess && (
                    <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-md flex items-center gap-1.5 animate-in fade-in">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Your comment has been posted successfully!</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-slate-500 font-sans">
                      {user ? (
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Posting as {user.name}
                        </span>
                      ) : (
                        <span>Please login to post a comment.</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!user ? (
                        <button
                          type="button"
                          onClick={openLogin}
                          className="bg-[#1642D0] hover:bg-[#0d2d8d] text-white font-sans text-xs sm:text-[13px] font-bold px-6 py-2.5 rounded-md transition-colors cursor-pointer shadow-xs hover:shadow-sm"
                        >
                          Login
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handlePostComment}
                          disabled={!commentText.trim()}
                          className="bg-[#1642D0] hover:bg-[#0d2d8d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans text-xs sm:text-[13px] font-bold px-6 py-2.5 rounded-md transition-colors cursor-pointer shadow-xs hover:shadow-sm"
                        >
                          Post Comment
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live Community Comments List */}
                <div className="mt-8 space-y-4">
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-600">
                    Comments ({commentsList.length})
                  </h4>
                  <div className="space-y-3.5">
                    {commentsList.map((c) => (
                      <div key={c.id} className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/80">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-[#1642D0] text-white font-bold flex items-center justify-center text-[11px] uppercase">
                              {c.avatar ? (
                                <img src={c.avatar} alt={c.author} className="w-full h-full object-cover" />
                              ) : (
                                c.author.charAt(0)
                              )}
                            </div>
                            <span className="font-sans font-bold text-xs sm:text-[13px] text-[#020618]">
                              {c.author}
                            </span>
                          </div>
                          <span className="text-[11px] font-sans text-slate-400">
                            {c.date}
                          </span>
                        </div>
                        <p className="text-xs sm:text-[13.5px] font-serif text-slate-700 leading-relaxed mt-2 mb-2 pl-9.5">
                          {c.text}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-sans text-slate-500 pl-9.5">
                          <button
                            type="button"
                            onClick={() => {
                              setCommentsList(commentsList.map(item => item.id === c.id ? { ...item, likes: (item.likes || 0) + 1 } : item));
                            }}
                            className="flex items-center gap-1 hover:text-[#1642D0] transition-colors cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{c.likes || 0}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (commentTextareaRef.current) {
                                commentTextareaRef.current.focus();
                                setCommentText(`@${c.author} `);
                              }
                            }}
                            className="hover:text-[#1642D0] transition-colors cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}
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
                  <article key={art.id} className="relative group cursor-pointer">
                    {/* Stretched link for full card clickability */}
                    <Link href={art.link} className="absolute inset-0 z-0" aria-label={art.title} />
                    <h4 className="text-[16px] sm:text-[17px] font-serif font-bold text-[#020618] leading-[1.3] my-0 relative z-10 pointer-events-none">
                      <span className="text-[#020618] group-hover:text-[#1642D0] group-hover:underline transition-colors">
                        {art.title}
                      </span>
                    </h4>
                    <div className="flex items-center justify-between gap-3 text-xs sm:text-[12px] font-sans mt-2.5 relative z-10">
                      <Link
                        href={art.categoryHref || `/topic/${slugifyTitle(art.category)}`}
                        className="font-bold text-[#1642D0] hover:underline transition-colors tracking-wide truncate"
                      >
                        {art.category}
                      </Link>
                      <span className="text-slate-500 font-medium text-[11px] sm:text-[11.5px] whitespace-nowrap shrink-0 pointer-events-none">
                        {art.time}
                      </span>
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
              <article key={item.id} className="relative group flex flex-col cursor-pointer">
                {/* Stretched link so the entire card is clickable */}
                <Link href={item.slug} className="absolute inset-0 z-0" aria-label={item.title} />

                <div className="block overflow-hidden rounded-xl border border-slate-200/60 shadow-2xs aspect-[16/9.5] bg-slate-100 pointer-events-none">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>

                <div className="pt-3.5 flex flex-col flex-1 relative z-10">
                  <Link
                    href={`/topic/${item.category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] hover:underline mb-2 block w-fit"
                  >
                    {item.category}
                  </Link>

                  <h3 className="text-[17.5px] sm:text-[18.5px] font-serif font-bold text-[#020618] leading-[1.3] group-hover:text-[#1642D0] group-hover:underline transition-colors mb-2.5 pointer-events-none">
                    {item.title}
                  </h3>

                  <div className="mt-auto text-xs font-sans uppercase tracking-wider text-slate-500 font-medium">
                    <span className="text-slate-400 font-semibold pointer-events-none">BY </span>
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
