import React from 'react';
import { SkeletonBase } from './SkeletonBase';

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white animate-in fade-in duration-200">
      
      {/* 1. Hero News Section Skeleton */}
      <section className="bg-white py-8 md:py-10 border-b border-slate-200 w-full">
        <div className="w-full px-5 lg:px-10">
          <div className="flex flex-col md:flex-wrap md:flex-row xl:flex-nowrap gap-6 xl:gap-8 items-start">
            
            {/* Left Column (22%) */}
            <div className="w-full md:w-4/12 xl:w-[22%] order-2 xl:order-1 border-t xl:border-t-0 border-slate-200 pt-6 xl:pt-0 xl:pr-6">
              <div className="mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
                <SkeletonBase className="h-7 w-28" />
                <SkeletonBase className="h-4 w-16" />
              </div>
              <div className="space-y-5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="pb-4 border-b border-slate-100 last:border-0 space-y-2">
                    <SkeletonBase className="h-3 w-20" />
                    <SkeletonBase className="h-4 w-full" />
                    <SkeletonBase className="h-4 w-4/5" />
                    <SkeletonBase className="h-3 w-28 mt-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Center Column (55% - Main Featured Hero) */}
            <div className="w-full md:w-8/12 xl:w-[55%] order-1 xl:order-2">
              <SkeletonBase className="w-full aspect-[16/9] rounded-xl mb-4" />
              <div className="space-y-3">
                <SkeletonBase className="h-4 w-28" />
                <SkeletonBase className="h-8 w-11/12" />
                <SkeletonBase className="h-8 w-4/5" />
                <SkeletonBase className="h-4 w-full" />
                <SkeletonBase className="h-4 w-3/4" />
                <div className="flex items-center gap-3 pt-2">
                  <SkeletonBase className="h-4 w-32" />
                  <SkeletonBase className="h-4 w-20" />
                </div>
              </div>
            </div>

            {/* Right Column (23% - Secondary Featured) */}
            <div className="w-full xl:w-[23%] order-3 border-t xl:border-t-0 border-slate-200 pt-6 xl:pt-0 xl:pl-6 space-y-6">
              <div className="mb-4 pb-2 border-b border-slate-200">
                <SkeletonBase className="h-7 w-36" />
              </div>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-3 pb-4 border-b border-slate-100 last:border-0">
                  <SkeletonBase className="w-full aspect-[16/10] rounded-lg" />
                  <SkeletonBase className="h-3 w-24" />
                  <SkeletonBase className="h-5 w-full" />
                  <SkeletonBase className="h-5 w-5/6" />
                  <SkeletonBase className="h-3 w-20" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 2. Top Stories Featured Grid Skeleton */}
      <section className="bg-slate-50 py-10 border-b border-slate-200 w-full">
        <div className="w-full px-5 lg:px-10">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200/80 pb-3">
            <SkeletonBase className="h-8 w-48" />
            <SkeletonBase className="h-4 w-20" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 space-y-3">
                <SkeletonBase className="w-full aspect-[16/10] rounded-lg" />
                <SkeletonBase className="h-3 w-24" />
                <SkeletonBase className="h-5 w-full" />
                <SkeletonBase className="h-5 w-4/5" />
                <SkeletonBase className="h-3 w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Side Hustle & Newsletter Widget Skeleton */}
      <section className="bg-white py-10 border-b border-slate-200 w-full">
        <div className="w-full px-5 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left 65% */}
            <div className="w-full lg:w-[65%] space-y-6">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                <SkeletonBase className="h-8 w-40" />
                <SkeletonBase className="h-4 w-20" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            {/* Right 35% Widget Skeleton */}
            <div className="w-full lg:w-[35%]">
              <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
                <SkeletonBase className="h-6 w-32 bg-slate-700" />
                <SkeletonBase className="h-8 w-full bg-slate-700" />
                <SkeletonBase className="h-4 w-full bg-slate-800" />
                <SkeletonBase className="h-4 w-4/5 bg-slate-800" />
                <SkeletonBase className="h-10 w-full rounded-lg bg-slate-700 mt-4" />
                <SkeletonBase className="h-10 w-full rounded-lg bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
