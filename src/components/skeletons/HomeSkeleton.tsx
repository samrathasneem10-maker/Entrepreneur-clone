import React from 'react';
import { SkeletonBase } from './SkeletonBase';

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white animate-in fade-in duration-200">
      
      {/* Announcement Bar Skeleton */}
      <div className="w-full bg-[#1642D0]/30 py-2.5 px-4 flex justify-center">
        <SkeletonBase className="h-4 w-64 bg-blue-300/40" />
      </div>

      {/* 1. Hero News Section Skeleton (matching exact 3-column reference layout) */}
      <section className="bg-white pt-4 pb-8 border-b border-slate-200 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch">
            
            {/* Left Column (26% - Latest 5 items) */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
              <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
                <SkeletonBase className="h-7 w-28" />
                <SkeletonBase className="h-4 w-16" />
              </div>
              <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="py-2.5 flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1.5">
                      <SkeletonBase className="h-2.5 w-20" />
                      <SkeletonBase className="h-3.5 w-full" />
                      <SkeletonBase className="h-3.5 w-4/5" />
                      <SkeletonBase className="h-2.5 w-16" />
                    </div>
                    <SkeletonBase className="w-[84px] h-[64px] shrink-0 rounded-xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* Center Column (46% - Main Featured Hero) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="relative rounded-xs overflow-hidden bg-slate-900 min-h-[500px] flex flex-col justify-end p-6 space-y-3">
                <SkeletonBase className="h-4 w-28 bg-blue-600/60" />
                <SkeletonBase className="h-8 w-11/12 bg-white/20" />
                <SkeletonBase className="h-8 w-4/5 bg-white/20" />
                <SkeletonBase className="h-4 w-full bg-white/10" />
                <div className="flex items-center gap-3 pt-2">
                  <SkeletonBase className="w-8 h-8 rounded-full bg-white/20" />
                  <SkeletonBase className="h-3 w-36 bg-white/20" />
                </div>
              </div>
            </div>

            {/* Right Column (28% - Top Featured + 3 Stream Stories) */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-4">
              <div className="bg-slate-900 rounded-xs overflow-hidden p-3.5 space-y-2">
                <SkeletonBase className="w-full aspect-[16/9] rounded-xs bg-white/10" />
                <SkeletonBase className="h-3 w-20 bg-blue-600/60" />
                <SkeletonBase className="h-5 w-full bg-white/20" />
                <SkeletonBase className="h-3 w-24 bg-white/10" />
              </div>

              <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="py-2 flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1.5">
                      <SkeletonBase className="h-2.5 w-20" />
                      <SkeletonBase className="h-3.5 w-full" />
                      <SkeletonBase className="h-2.5 w-16" />
                    </div>
                    <SkeletonBase className="w-[90px] h-[58px] shrink-0 rounded-xs" />
                  </div>
                ))}
              </div>
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
