'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { HomeSkeleton } from './skeletons/HomeSkeleton';
import { TopicPageSkeleton } from './skeletons/TopicPageSkeleton';
import { ArticleDetailSkeleton } from './skeletons/ArticleDetailSkeleton';
import { NewslettersSkeleton } from './skeletons/NewslettersSkeleton';
import { SearchSkeleton } from './skeletons/SearchSkeleton';
import { AuthorSkeleton } from './skeletons/AuthorSkeleton';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
});

export const usePageLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Show skeleton on initial mount/refresh and during navigation transitions
  const [isLoading, setIsLoading] = useState(true);
  const [activePath, setActivePath] = useState(pathname);

  // Trigger loading state on route change
  useEffect(() => {
    setIsLoading(true);
    setActivePath(pathname);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1s shimmer wave duration for smooth premium feel

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Global click listener to intercept navigation link clicks for instant skeleton feedback
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href) {
        try {
          const targetUrl = new URL(target.href);
          const currentUrl = new URL(window.location.href);

          // Internal link navigation
          if (
            targetUrl.origin === currentUrl.origin &&
            targetUrl.pathname !== currentUrl.pathname &&
            !target.getAttribute('target')
          ) {
            setIsLoading(true);
          }
        } catch {
          // Ignore invalid URLs
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const renderSkeleton = () => {
    if (activePath === '/search') {
      return <SearchSkeleton />;
    }
    if (activePath?.startsWith('/author')) {
      return <AuthorSkeleton />;
    }
    if (activePath?.startsWith('/topic/')) {
      return <TopicPageSkeleton />;
    }
    if (activePath?.startsWith('/article/')) {
      return <ArticleDetailSkeleton />;
    }
    if (activePath === '/newsletters') {
      return <NewslettersSkeleton />;
    }
    return <HomeSkeleton />;
  };



  return (
    <LoadingContext.Provider value={{ isLoading, startLoading }}>
      {isLoading ? (
        <div className="w-full min-h-screen bg-white">
          {renderSkeleton()}
        </div>
      ) : (
        <div className="fade-in-content w-full min-h-screen">
          {children}
        </div>
      )}
    </LoadingContext.Provider>
  );
};
