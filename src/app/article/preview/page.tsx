'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Copy,
  Check,
  Play,
  Pause,
  Bookmark,
  ArrowLeft,
  Eye,
  Send,
  X,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

const PREVIEW_SIDEBAR_ARTICLES = [
  {
    id: 'preview-side-1',
    title: 'Apple, Amazon and Microsoft Want These New AI Gadgets on Your Holiday Wish List',
    category: 'Breaking Business News',
    time: '3 hours ago',
  },
  {
    id: 'preview-side-2',
    title: 'America Finally Got a New Sunscreen. Europeans Have Been Sporting It Since 1999.',
    category: 'Research and Insights',
    time: '4 hours ago',
  },
  {
    id: 'preview-side-3',
    title: "This Popular Pickleball Franchisor Filed for Bankruptcy. Its Founder Says, 'I Own It'",
    category: 'Startups and Entrepreneurship',
    time: '4 hours ago',
  },
  {
    id: 'preview-side-4',
    title: 'AI Is Changing Your Company Culture Whether You Planned for It or Not.',
    category: 'Leadership',
    time: '5 hours ago',
  },
  {
    id: 'preview-side-5',
    title: "Creators Are Handing Their Video Edits to AI. Here's Where It Starts to Backfire.",
    category: 'Technology and AI',
    time: '6 hours ago',
  },
  {
    id: 'preview-side-6',
    title: "He Leads a $240 Billion Food Giant. Here's the Difficult Management Rule He Follows.",
    category: 'Markets and Investing',
    time: '7 hours ago',
  },
];

const PREVIEW_RELATED_CONTENT = [
  {
    id: 'prev-rel-1',
    category: 'BUILDING A BUSINESS',
    title: "An Introvert's Case for Skipping Small Talk and Building Real Connections",
    author: 'AYTEKIN TANK',
    imageUrl: '/images/related-introvert.png',
  },
  {
    id: 'prev-rel-2',
    category: 'BUILDING A BUSINESS',
    title: 'Autonomous Enterprise AI: How Small Teams Build Billion-Dollar Products',
    author: 'STAFF CONTRIBUTOR',
    imageUrl: '/images/coding-agents.jpg',
  },
  {
    id: 'prev-rel-3',
    category: 'BUSINESS NEWS',
    title: "He Leads a $240 Billion Food Giant. Here’s the Difficult Management Rule He Follows.",
    author: 'SHERIN SHIBU',
    imageUrl: '/images/related-food-giant.png',
  },
  {
    id: 'prev-rel-4',
    category: 'BUILDING A BUSINESS',
    title: 'How This Trio Built a Multi-Million Dollar Supply Chain Powerhouse From a Garage',
    author: 'JASON FEIFER',
    imageUrl: '/images/related-founders-warehouse.png',
  },
  {
    id: 'prev-rel-5',
    category: 'LEADERSHIP',
    title: "Taking the Leap: What Great Leaders Do When the Path Ahead Isn't Clear",
    author: 'TERRY RICE',
    imageUrl: '/images/related-jumping-cliff.png',
  },
  {
    id: 'prev-rel-6',
    category: 'TECHNOLOGY',
    title: 'AI Is Changing Your Company Culture Whether You Planned for It or Not',
    author: 'AMANDA BREEN',
    imageUrl: '/images/related-robot-hands.png',
  },
];

export default function ArticlePreviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('entrepreneur_article_preview');
      if (stored) {
        setPreviewData(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading preview article data:', e);
    }
  }, []);

  const title = previewData?.title || 'How Top Founders Run High Stakes Board Meetings with Complete Clarity Part 99 043799';
  const subtitle = previewData?.subtitle || 'Exclusive reporting and in-depth business analysis: How Top Founders Run High Stakes Board Meetings with Complete Clarity.';
  const category = previewData?.category || 'BUILDING A BUSINESS';
  const subCategories = previewData?.subCategories || [];
  const authorName = user?.name || previewData?.author?.name || user?.writerName || 'SHERIN SHIBU';
  const authorAvatar = user?.avatar || previewData?.author?.avatar || '/images/user-avatar-butterfly.png';
  const authorBio = previewData?.author?.bio || user?.bio || 'Business news reporter and contributor at Entrepreneur.com, covering high-growth ventures, market trends, and modern workplace leadership.';
  const authorLinkedin = previewData?.author?.linkedinUrl || user?.linkedinUrl || 'https://www.linkedin.com';
  const date = previewData?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  const imageUrl = previewData?.imageUrl || '';
  const imageCaption = previewData?.imageCaption || '';
  const imageCredit = previewData?.imageCredit || '';
  const content = previewData?.content || '';
  const tags: string[] = previewData?.tags || ['BUSINESS', 'STARTUPS', 'LEADERSHIP'];

  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak = `${title}. ${subtitle}. Reported by ${authorName}.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.lang = 'en-US';
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      {/* Top Sticky Preview Banner matching Reference Image 3 */}
      <div className="sticky top-0 z-50 bg-[#0B132B] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="bg-[#EA580C] text-slate-950 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm select-none shadow-xs">
            PREVIEW MODE
          </span>
        </div>

        <button
          type="button"
          onClick={() => router.push('/writer')}
          className="text-white hover:text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer select-none"
        >
          <X className="w-3.5 h-3.5" />
          <span>EXIT PREVIEW</span>
        </button>
      </div>

      {/* Main Container matching src/app/article/[id]/page.tsx (Header removed on Preview Page) */}
      <main className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors font-sans"
          >
            <span className="text-sm font-semibold select-none">&lt;</span>
            <span>BACK TO HOME</span>
          </Link>
          <div className="border-b border-slate-200 mt-2.5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Article Content (8 columns) */}
          <article className="lg:col-span-8 space-y-4">
            
            {/* Category Heading */}
            <div className="mb-2">
              <span className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-wider text-[#1642D0]">
                {category}
                {subCategories.length > 0 && (
                  <span className="text-slate-400 font-normal"> &bull; {subCategories.join(', ')}</span>
                )}
              </span>
            </div>

            {/* Headline H1 */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-serif font-bold text-[#1642D0] leading-[1.14] tracking-tight my-0">
              {title}
            </h1>

            {/* Subtitle / Excerpt */}
            {subtitle && (
              <p className="text-[#0f2b82] text-base sm:text-lg lg:text-[18.5px] font-serif font-bold leading-relaxed my-0 pt-1">
                {subtitle}
              </p>
            )}

            {/* Horizontal Line Above Byline */}
            <div className="border-t border-slate-200 mt-4 mb-3" />

            {/* Byline */}
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-sans font-bold uppercase tracking-wider text-slate-800 py-0.5">
              <span className="text-slate-600 font-bold">BY</span>
              <span className="text-[#1642D0] font-bold">
                {authorName.toUpperCase()}
              </span>
              <a
                href={authorLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#0A66C2] rounded-[2px] text-white text-[9px] font-bold leading-none hover:opacity-90 transition-opacity"
                aria-label="Author LinkedIn Profile"
              >
                in
              </a>
              <span className="text-slate-300 font-normal">|</span>
              <span className="text-slate-500 font-normal">
                {date}
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

            {/* Action Bar (Listen, Share, Comment) */}
            <div className="pt-3 pb-1 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Listen Pill */}
                  <div className="inline-flex items-center border border-slate-200 rounded-full bg-white px-3.5 py-1.5 shadow-xs hover:border-slate-300 transition-colors">
                    <button
                      type="button"
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
                  </div>

                  {/* Share Button */}
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

                {/* Comment Link */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('preview-comments-section');
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

              {/* Active Audio Bar */}
              {isPlaying && (
                <div className="w-full bg-[#f0f4f9] border border-[#dbe4ef] rounded-lg p-3 sm:p-3.5 mt-3 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="w-8 h-8 rounded-full bg-[#1642D0] hover:bg-blue-800 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Pause className="w-3.5 h-3.5 fill-white" />
                    </button>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans">
                          Playing Article Audio
                        </span>
                        <span className="flex items-center gap-0.5 h-3">
                          <span className="w-0.5 h-2.5 bg-[#1642D0] animate-bounce" />
                          <span className="w-0.5 h-1.5 bg-[#1642D0] animate-pulse" />
                          <span className="w-0.5 h-3 bg-[#1642D0] animate-bounce delay-75" />
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-sans mt-0.5">
                        Reading aloud headline & excerpt
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                      setIsPlaying(false);
                    }}
                    className="text-xs font-semibold font-sans px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>

            {/* Featured Image: Only display at the top if the article body does not already contain an image */}
            {Boolean(imageUrl && !imageUrl.includes('placeholder') && !content.includes('<img')) && (
              <>
                <div className="w-full my-4 overflow-hidden border border-slate-200">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-auto max-h-[580px] object-cover"
                  />
                </div>

                {/* Caption & Credit */}
                {(imageCaption || imageCredit) && (
                  <div className="flex items-center justify-between text-xs text-slate-500 font-sans pt-1 pb-2">
                    <span className="italic">{imageCaption}</span>
                    <span className="text-slate-400 font-sans text-[11px]">{imageCredit}</span>
                  </div>
                )}
              </>
            )}

            {/* Key Takeaways */}
            <div className="pt-2 pb-1">
              <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#1642D0] my-0">
                Key Takeaways
              </h2>
              <ul className="mt-4 space-y-3 text-base sm:text-[16.5px] font-serif text-slate-800 leading-relaxed list-none p-0">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1642D0] mt-2.5 shrink-0 block" />
                  <span>
                    Clear strategic focus and disciplined operational execution define market-leading businesses in 2026.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1642D0] mt-2.5 shrink-0 block" />
                  <span>
                    Sustainable growth requires founders to adapt rapidly to evolving customer needs and market dynamics.
                  </span>
                </li>
              </ul>
            </div>

            {/* Rendered HTML Content with exact editor formatting */}
            <div
              className="article-editor-content prose prose-slate max-w-none text-slate-800 text-base leading-relaxed break-words font-serif pt-4 space-y-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Subscription Callout Bar */}
            <div className="border-l-[3.5px] border-[#1642D0] pl-4 py-1 my-8">
              <p className="text-[15px] sm:text-[16px] italic font-['Georgia',serif] text-slate-700 m-0 leading-normal">
                Get unlimited access to our tools, playbooks and insights built to grow your business.{' '}
                <a href="#" className="text-[#1642D0] underline underline-offset-[3px] not-italic font-sans font-semibold hover:text-[#0d2d8d]">
                  Subscribe now.
                </a>
              </p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-6 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none mr-1">
                  Tags:
                </span>
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors uppercase tracking-wide select-none"
                  >
                    #{t.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            )}

            {/* Divider line before Author Bio */}
            <div className="border-b border-slate-200 mt-8 mb-8" />

            {/* Author Bio Card */}
            <div className="flex items-start gap-4 sm:gap-5 pb-6 mb-6">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-base sm:text-lg text-[#020618] my-0 leading-tight">
                    {authorName}
                  </h4>
                  <a
                    href={authorLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#0A66C2] rounded-[2px] text-white text-[9px] font-bold ml-0.5 leading-none hover:opacity-90 transition-opacity"
                    aria-label="Author LinkedIn Profile"
                  >
                    in
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#15803d] mt-1">
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Entrepreneur Staff &bull; Verified Contributor</span>
                </div>
                <p className="text-xs sm:text-[13.5px] font-serif text-slate-600 leading-relaxed my-0 pt-1.5">
                  {authorBio}
                </p>
              </div>
            </div>

            {/* Horizontal In-Article Advertisement */}
            <div className="my-8 max-w-[760px] mx-auto w-full">
              <p className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400 text-center mb-2 my-0 select-none">
                ADVERTISEMENT
              </p>
              <div className="w-full h-32 sm:h-36 bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-center p-5 text-center shadow-2xs rounded-none">
                <span className="text-xs sm:text-[13px] font-semibold text-slate-600 font-sans tracking-wide">
                  300 × 400 Banner
                </span>
                <span className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Your Advertisement Here
                </span>
              </div>
            </div>

            {/* Comments Section */}
            <section id="preview-comments-section" className="pt-4 mb-10 scroll-mt-24">
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

              <div className="mt-5">
                <textarea
                  rows={4}
                  placeholder="What do you think?"
                  className="w-full bg-[#f9fafb] border border-slate-200 rounded-md p-3 text-sm font-sans placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] resize-y transition-all"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-slate-500 font-sans">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Posting as {authorName}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="bg-[#1642D0] hover:bg-[#0d2d8d] text-white font-sans text-xs sm:text-[13px] font-bold px-6 py-2.5 rounded-md transition-colors cursor-pointer shadow-xs hover:shadow-sm"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </section>

          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Top Advertisement */}
            <div className="w-full max-w-[340px] mx-auto">
              <p className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400 text-center mb-2 my-0 select-none">
                ADVERTISEMENT
              </p>
              <div className="w-full h-44 sm:h-48 bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-center p-5 text-center shadow-2xs rounded-none">
                <span className="text-xs sm:text-[13px] font-semibold text-slate-600 font-sans tracking-wide">
                  300 × 400 Banner
                </span>
                <span className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Your Advertisement Here
                </span>
              </div>
            </div>

            {/* Latest Article Section */}
            <div className="border-t border-slate-200 pt-5 mt-6">
              <div className="mb-5">
                <h3 className="text-2xl sm:text-[26px] font-serif font-bold text-[#020618] my-0 tracking-tight">
                  Latest Article
                </h3>
              </div>

              <div className="space-y-6 sm:space-y-7">
                {PREVIEW_SIDEBAR_ARTICLES.map((art) => (
                  <article key={art.id} className="relative group cursor-pointer">
                    <h4 className="text-[16px] sm:text-[17px] font-serif font-bold text-[#020618] leading-[1.3] my-0">
                      <span className="text-[#020618] group-hover:text-[#1642D0] group-hover:underline transition-colors">
                        {art.title}
                      </span>
                    </h4>
                    <div className="flex items-center justify-between gap-3 text-xs sm:text-[12px] font-sans mt-2.5">
                      <span className="font-bold text-[#1642D0] tracking-wide truncate">
                        {art.category}
                      </span>
                      <span className="text-slate-500 font-medium text-[11px] sm:text-[11.5px] whitespace-nowrap shrink-0">
                        {art.time}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>

        </div>

        {/* Related Content Grid */}
        <section className="mt-14 pt-8 border-t border-slate-200">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] my-0">
              Related Content
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {PREVIEW_RELATED_CONTENT.map((item) => (
              <article key={item.id} className="relative group flex flex-col cursor-pointer">
                <div className="block overflow-hidden rounded-xl border border-slate-200/60 shadow-2xs aspect-[16/9.5] bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>

                <div className="pt-3.5 flex flex-col flex-1">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-2 block w-fit">
                    {item.category}
                  </span>

                  <h3 className="text-[17.5px] sm:text-[18.5px] font-serif font-bold text-[#020618] leading-[1.3] group-hover:text-[#1642D0] group-hover:underline transition-colors mb-2.5">
                    {item.title}
                  </h3>

                  <div className="mt-auto text-xs font-sans uppercase tracking-wider text-slate-500 font-medium">
                    <span className="text-slate-400 font-semibold">BY </span>
                    <span className="text-[#1642D0] font-bold">
                      {item.author}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
