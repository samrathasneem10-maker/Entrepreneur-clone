import React from 'react';
import { SkeletonBase } from './SkeletonBase';

export const ArticleDetailSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white animate-in fade-in duration-200">
      
      {/* Breadcrumb Line */}
      <div className="bg-slate-50/80 border-b border-slate-200 py-3 px-5 lg:px-10">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2">
          <SkeletonBase className="h-4 w-12" />
          <SkeletonBase className="h-4 w-4" />
          <SkeletonBase className="h-4 w-28" />
          <SkeletonBase className="h-4 w-4" />
          <SkeletonBase className="h-4 w-48" />
        </div>
      </div>

      {/* Main Container (2-Column Layout) */}
      <main className="w-full max-w-7xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Article Content (8 cols) */}
          <article className="lg:col-span-8 space-y-6">
            <SkeletonBase className="h-4 w-32" />
            <div className="space-y-3">
              <SkeletonBase className="h-10 w-full" />
              <SkeletonBase className="h-10 w-11/12" />
              <SkeletonBase className="h-10 w-4/5" />
            </div>

            <SkeletonBase className="h-5 w-full" />
            <SkeletonBase className="h-5 w-3/4" />

            {/* Author & Publication Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200">
              <div className="flex items-center gap-3">
                <SkeletonBase className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5">
                  <SkeletonBase className="h-4 w-32" />
                  <SkeletonBase className="h-3 w-16" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SkeletonBase className="w-9 h-9 rounded-full" />
                <SkeletonBase className="w-9 h-9 rounded-full" />
              </div>
            </div>

            {/* Article Main Hero Image */}
            <SkeletonBase className="w-full aspect-[16/10] rounded-xl my-6" />

            {/* Article Content Paragraphs */}
            <div className="space-y-4 pt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2 pb-2">
                  <SkeletonBase className="h-4 w-full" />
                  <SkeletonBase className="h-4 w-full" />
                  <SkeletonBase className="h-4 w-11/12" />
                  <SkeletonBase className="h-4 w-4/5" />
                </div>
              ))}
            </div>
          </article>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            <SkeletonBase className="w-full h-[250px] rounded-xl" />
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <SkeletonBase className="h-6 w-32" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2 pb-3 border-b border-slate-100 last:border-0">
                  <SkeletonBase className="h-3 w-16" />
                  <SkeletonBase className="h-4 w-full" />
                  <SkeletonBase className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </aside>

        </div>

        {/* Related Content Bottom Grid Skeleton */}
        <div className="mt-16 pt-10 border-t border-slate-200 space-y-6">
          <SkeletonBase className="h-7 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <SkeletonBase className="w-full aspect-[16/10] rounded-lg" />
                <SkeletonBase className="h-3 w-20" />
                <SkeletonBase className="h-5 w-full" />
                <SkeletonBase className="h-5 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
