'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from './Badge';
import { Article, getArticleUrl } from '@/data/newsData';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'featured' | 'horizontal' | 'compact' | 'sidebar';
  showExcerpt?: boolean;
  showImage?: boolean;
  showMetadata?: boolean;
  showAuthor?: boolean;
  align?: 'left' | 'center';
  className?: string;
}

const getFormattedRelativeMetadata = (article: Article) => {
  const relativeTimes = [
    '5m ago', '15m ago', '42m ago', '1h ago', '2h ago',
    '3h ago', '5h ago', '8h ago', 'Yesterday', '2d ago',
    '3d ago', '5d ago', '1w ago'
  ];
  const readTimes = [
    '2 min read', '3 min read', '4 min read', '5 min read',
    '6 min read', '7 min read', '8 min read', '10 min read'
  ];

  let dateStr = article.date;
  let readStr = article.readTime || '4 min read';

  // If date is missing or in long format (e.g. "July 25, 2026"), compute deterministic relative time
  if (!dateStr || dateStr.includes(',') || dateStr.length > 10) {
    let hash = 0;
    const str = article.id || article.title || 'article';
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);

    dateStr = relativeTimes[positiveHash % relativeTimes.length];
    readStr = readTimes[(positiveHash >> 3) % readTimes.length];
  }

  return { dateStr, readStr };
};

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'featured',
  showExcerpt = true,
  showImage = true,
  showMetadata = true,
  showAuthor = false,
  align = 'left',
  className = '',
}) => {
  const { title, category, excerpt, imageUrl } = article;
  const { dateStr, readStr } = getFormattedRelativeMetadata(article);

  // 1. Central Lead Hero Card (Full Column Width)
  if (variant === 'hero') {
    return (
      <div className={`group bg-white rounded-2xl p-5 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] border border-slate-100/60 hover:shadow-[0_6px_30px_rgba(0,0,0,0.08)] transition-all w-full h-full flex flex-col justify-between ${className}`}>
        <div className="flex flex-col items-center text-center">
          <Badge className="text-sm sm:text-base font-sans font-extrabold uppercase tracking-widest text-[#193CB8] mb-2">{category}</Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-serif font-bold text-[#020618] leading-[1.18] tracking-tight mb-3.5">
            <Link
              href={getArticleUrl(article)}
              className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[5px] transition-all"
            >
              {title}
            </Link>
          </h2>

          {showAuthor && article.author?.name ? (
            <div className="flex items-center justify-center gap-1.5 text-sm sm:text-[15px] text-slate-900 font-sans font-bold uppercase tracking-wider mb-4">
              <span className="text-slate-600 font-medium">BY</span>
              <Link
                href={`/author/${article.author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="text-[#193CB8] underline decoration-[#193CB8] underline-offset-2 hover:text-[#143094] transition-colors font-extrabold"
              >
                {article.author.name}
              </Link>
            </div>
          ) : showMetadata ? (
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-sans font-normal mb-4">
              <span>{dateStr}</span>
              <span className="text-slate-400">•</span>
              <span>{readStr}</span>
            </div>
          ) : null}

          {imageUrl && showImage && (
            <figure className="relative w-full aspect-square overflow-hidden rounded-xl border border-slate-200 mt-1">
              <Link href={getArticleUrl(article)} className="block w-full h-full cursor-pointer">
                <img
                  src={imageUrl}
                  alt={title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/images/hero-mentor.jpg';
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 rounded-xl"
                />
              </Link>
            </figure>
          )}

          {showExcerpt && excerpt && (
            <p className="mt-4 text-slate-700 text-sm sm:text-base leading-relaxed max-w-3xl font-serif font-normal">
              {excerpt}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 2. Horizontal Article Card (Square 1:1 image on right + Category Badge + Title + Date • ReadTime)
  if (variant === 'horizontal') {
    return (
      <article className={`group flex flex-row-reverse items-start justify-between gap-5 pb-5 mb-5 border-b border-slate-200 last:border-b-0 last:mb-0 last:pb-0 w-full ${className}`}>
        {imageUrl && showImage && (
          <figure className="relative flex-shrink-0 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] aspect-square overflow-hidden rounded-lg border border-slate-200">
            <Link href={getArticleUrl(article)} className="block w-full h-full cursor-pointer">
              <img
                src={imageUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-lg"
              />
            </Link>
          </figure>
        )}

        <div className="flex flex-col flex-1 items-start text-left">
          <Badge className="mb-1 text-[#193CB8] font-bold text-xs uppercase tracking-wider">{category}</Badge>
          
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#020618] leading-snug tracking-tight mb-2">
            <Link
              href={getArticleUrl(article)}
              className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all"
            >
              {title}
            </Link>
          </h3>

          {showMetadata && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans font-normal mt-auto">
              <span>{dateStr}</span>
              <span className="text-slate-400">•</span>
              <span>{readStr}</span>
            </div>
          )}
        </div>
      </article>
    );
  }

  // 3. Compact Stream Card (Category badge + bold title + Date • ReadTime)
  if (variant === 'compact') {
    return (
      <article className={`group relative flex-1 flex flex-col justify-center py-3 xl:py-3.5 border-b border-slate-200/80 w-full cursor-pointer ${className}`}>
        <Link
          href={getArticleUrl(article)}
          className="absolute inset-0 z-0"
          aria-label={title}
        />
        
        <div className="relative z-10 pointer-events-none">
          <Badge className="mb-1 text-[#193CB8] font-bold text-xs sm:text-[13px] uppercase tracking-wider">{category}</Badge>
          
          <h3 className="text-base sm:text-[17px] xl:text-[17.5px] font-serif font-bold text-[#020618] leading-[1.32] tracking-tight">
            <span className="text-[#020618] group-hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all">
              {title}
            </span>
          </h3>

          {showMetadata && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans font-normal mt-1.5">
              <span>{dateStr}</span>
              <span className="text-slate-400">•</span>
              <span>{readStr}</span>
            </div>
          )}
        </div>
      </article>
    );
  }

  // 4. Sidebar Card (Small 80x80 thumbnail + badge + title + Date • ReadTime)
  if (variant === 'sidebar') {
    return (
      <article className={`group flex gap-4 items-center py-2.5 border-b border-slate-200/80 last:border-b-0 w-full ${className}`}>
        {imageUrl && (
          <figure className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 aspect-square">
            <Link href={getArticleUrl(article)} className="block w-full h-full cursor-pointer">
              <img src={imageUrl} alt={title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </Link>
          </figure>
        )}
        <div className="flex flex-col">
          <Badge className="text-[11px] text-[#193CB8] mb-1">{category}</Badge>
          <h4 className="text-sm font-bold font-serif text-[#020618] leading-tight mb-1">
            <Link
              href={getArticleUrl(article)}
              className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[2px] transition-all"
            >
              {title}
            </Link>
          </h4>
          {showMetadata && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-sans font-normal">
              <span>{dateStr}</span>
              <span className="text-slate-400">•</span>
              <span>{readStr}</span>
            </div>
          )}
        </div>
      </article>
    );
  }

  // 5. Standard Featured Vertical Card (16:9 image + category badge + title + summary + Date • ReadTime)
  const isCenter = align === 'center';

  return (
    <article className={`group flex flex-col w-full ${className}`}>
      {imageUrl && showImage && (
        <figure className={`relative w-full aspect-video ${isCenter ? 'sm:aspect-[16/10]' : ''} overflow-hidden rounded-xl mb-3.5 border border-slate-200`}>
          <Link href={getArticleUrl(article)} className="block w-full h-full cursor-pointer">
            <img
              src={imageUrl}
              alt={title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallback) {
                  target.dataset.fallback = 'true';
                  if (article.id === 'sec-1') target.src = '/images/jeff-bezos.jpg';
                  else if (article.id === 'sec-2') target.src = '/images/kurt-workman.jpg';
                  else if (article.id === 'grid-1') target.src = '/images/home-hero/grid-card-1.png';
                  else if (article.id === 'grid-2') target.src = '/images/home-hero/grid-card-2.png';
                  else if (article.id === 'grid-3') target.src = '/images/home-hero/grid-card-3.png';
                  else if (article.id === 'grid-4') target.src = '/images/home-hero/grid-card-4.png';
                  else target.src = 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop';
                }
              }}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 rounded-xl"
            />
          </Link>
        </figure>
      )}

      <div className={`flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'} flex-1`}>
        <Badge className={`mb-1.5 text-[#193CB8] font-bold text-xs uppercase tracking-wider ${isCenter ? 'mx-auto' : ''}`}>{category}</Badge>

        <h3 className={`${isCenter ? 'text-xl sm:text-[22px] max-w-sm' : 'text-lg sm:text-[18.5px] xl:text-[19px]'} font-serif font-bold text-[#020618] leading-[1.3] tracking-tight mb-2`}>
          <Link
            href={getArticleUrl(article)}
            className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all"
          >
            {title}
          </Link>
        </h3>

        {showExcerpt && excerpt && (
          <p className={`text-slate-700 text-xs sm:text-sm font-serif font-normal leading-relaxed mb-3.5 line-clamp-3 ${isCenter ? 'max-w-sm' : ''}`}>
            {excerpt}
          </p>
        )}

        {showAuthor && article.author?.name ? (
          <div className={`flex items-center ${isCenter ? 'justify-center' : 'justify-start'} gap-1.5 text-xs text-slate-900 font-sans font-bold uppercase tracking-wider mt-auto pt-1`}>
            <span className="text-slate-600 font-medium">BY</span>
            <Link
              href={`/author/${article.author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="text-[#193CB8] underline decoration-[#193CB8] underline-offset-2 hover:text-[#143094] transition-colors font-extrabold"
            >
              {article.author.name}
            </Link>
          </div>
        ) : showMetadata ? (
          <div className={`flex items-center ${isCenter ? 'justify-center' : 'justify-start'} gap-1.5 text-xs text-slate-500 font-sans font-normal mt-auto pt-1`}>
            <span>{dateStr}</span>
            <span className="text-slate-400">•</span>
            <span>{readStr}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
};
