import React from 'react';
import { SkeletonBase } from './SkeletonBase';

export const TopicPageSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white animate-in fade-in duration-200">
      
      {/* Breadcrumb Bar Skeleton */}
      <div className="bg-slate-50/80 border-b border-slate-200 py-3 px-5 lg:px-10">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-3">
          <SkeletonBase className="h-4 w-12" />
          <SkeletonBase className="h-4 w-4" />
          <SkeletonBase className="h-4 w-36" />
        </div>
      </div>

      {/* Top Leaderboard Banner Skeleton (728 × 90) */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pt-6 pb-2 flex justify-center">
        <SkeletonBase className="w-full max-w-[728px] h-[90px] rounded-2xl" />
      </div>

      {/* Main Topic Page Content */}
      <main className="w-full max-w-7xl mx-auto px-5 lg:px-10 py-6 lg:py-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT MAIN COLUMN (~70% / 8 cols on lg): Topic Headline + Article Stream + Pagination */}
          <div className="w-full lg:col-span-8 order-1 space-y-8">
            {/* Title Header */}
            <div className="border-b border-slate-200 pb-4 space-y-2">
              <SkeletonBase className="h-9 w-64" />
              <SkeletonBase className="h-4 w-96" />
            </div>

            {/* Article Cards Stream */}
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-6 pb-6 border-b border-slate-200/80 items-start">
                  <div className="flex-1 space-y-2.5">
                    <SkeletonBase className="h-3.5 w-24" />
                    <SkeletonBase className="h-6 w-full" />
                    <SkeletonBase className="h-6 w-4/5" />
                    <SkeletonBase className="h-4 w-full" />
                    <SkeletonBase className="h-3.5 w-28" />
                  </div>
                  <SkeletonBase className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl flex-shrink-0" />
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center gap-2 pt-4">
              <SkeletonBase className="h-10 w-12 rounded-lg" />
              <SkeletonBase className="h-9 w-9 rounded-lg" />
              <SkeletonBase className="h-9 w-9 rounded-lg" />
              <SkeletonBase className="h-10 w-16 rounded-lg" />
            </div>
          </div>

          {/* RIGHT SIDEBAR (~30% / 4 cols on lg): Trending News + Ads */}
          <aside className="w-full lg:col-span-4 order-2 space-y-6">
            {/* Trending News Skeleton Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3.5 border-b border-slate-200">
                <SkeletonBase className="w-5 h-5 rounded-full" />
                <SkeletonBase className="h-5 w-36" />
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4 items-start pb-3 border-b border-slate-100 last:border-b-0">
                    <SkeletonBase className="h-7 w-6 rounded" />
                    <div className="space-y-2 flex-1">
                      <SkeletonBase className="h-4 w-full" />
                      <SkeletonBase className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad 1 Skeleton (300x250) */}
            <SkeletonBase className="w-full h-[250px] rounded-2xl" />

            {/* Ad 2 Skeleton (300x600) */}
            <SkeletonBase className="w-full h-[500px] lg:h-[600px] rounded-2xl" />
          </aside>

        </div>
      </main>


    </div>
  );
};

