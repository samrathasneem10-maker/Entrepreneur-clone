import React from 'react';
import { SkeletonBase } from './SkeletonBase';

export const SearchSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white animate-in fade-in duration-200">
      
      {/* Search Hero Skeleton */}
      <section className="bg-slate-50/80 border-b border-slate-200 py-10 md:py-14 px-5 lg:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <SkeletonBase className="h-10 w-44 mx-auto" />
          <SkeletonBase className="h-14 w-full max-w-[900px] mx-auto rounded-2xl" />
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto pt-2">
            {[...Array(8)].map((_, i) => (
              <SkeletonBase key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </section>

      {/* Search Results Grid Skeleton */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 py-10 md:py-12">
        <div className="mb-6 flex justify-between items-center">
          <SkeletonBase className="h-6 w-48" />
          <SkeletonBase className="h-4 w-20" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
              <SkeletonBase className="w-full aspect-[16/10] rounded-xl" />
              <SkeletonBase className="h-3.5 w-24" />
              <SkeletonBase className="h-5 w-full" />
              <SkeletonBase className="h-5 w-4/5" />
              <SkeletonBase className="h-4 w-full" />
              <div className="flex items-center gap-3 pt-2">
                <SkeletonBase className="h-3.5 w-28" />
                <SkeletonBase className="h-3.5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
