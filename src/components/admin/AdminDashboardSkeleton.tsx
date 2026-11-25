'use client';

import React from 'react';
import { useSkeletonMaxDuration } from '@/components/skeletons/useSkeletonMaxDuration';

export default function AdminDashboardSkeleton() {
  const isVisible = useSkeletonMaxDuration(2000);

  if (!isVisible) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800 antialiased animate-pulse skeleton-max-duration">
      {/* 1. LEFT DARK SIDEBAR SKELETON */}
      <aside className="flex w-full md:w-64 lg:w-72 bg-[#0B132B] text-slate-300 flex-shrink-0 flex-col md:self-start md:sticky md:top-0 md:h-screen border-r border-slate-800/80 shadow-md z-30">
        {/* Brand Header */}
        <div className="p-6 pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-slate-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-800 rounded w-24" />
              <div className="h-3 bg-slate-800/60 rounded w-16" />
            </div>
          </div>
          <div className="h-3 bg-slate-800/50 rounded w-24 mt-5" />
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800/50 rounded-lg w-full flex items-center px-4 gap-3">
              <div className="w-4 h-4 rounded bg-slate-700/60 shrink-0" />
              <div className="h-3 bg-slate-700/50 rounded w-24" />
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/60 flex items-center justify-between">
          <div className="h-3 bg-slate-800/50 rounded w-24" />
          <div className="w-2 h-2 rounded-full bg-slate-800" />
        </div>
      </aside>

      {/* 2. MAIN CONTENT SKELETON */}
      <main className="flex-1 flex flex-col min-w-0 p-5 sm:p-7 lg:p-9 max-w-[1600px] w-full mx-auto">
        {/* Top Header */}
        <div className="flex items-start sm:items-center justify-between gap-4 mb-7">
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded-lg w-48" />
            <div className="h-4 bg-slate-200/60 rounded w-36" />
          </div>
          <div className="w-36 h-10 rounded-xl bg-slate-200/80" />
        </div>

        {/* 3 Top Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-2.5">
                <div className="h-3 bg-slate-200 rounded w-28" />
                <div className="h-8 bg-slate-200 rounded w-16" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
            </div>
          ))}
        </div>

        {/* Table Box */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="h-6 bg-slate-200 rounded w-52" />
            <div className="h-6 bg-slate-100 rounded-full w-28" />
          </div>

          <div className="divide-y divide-slate-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="py-4 flex items-start gap-4">
                <div className="w-[70px] h-[70px] rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2 pt-1 min-w-0">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200/70 rounded w-full" />
                  <div className="h-3 bg-slate-200/60 rounded w-2/3" />
                  <div className="h-2.5 bg-slate-200/50 rounded w-20" />
                </div>
                <div className="h-6 bg-slate-100 rounded-md w-24 hidden md:block" />
                <div className="h-4 bg-slate-100 rounded w-20 hidden lg:block" />
                <div className="h-8 bg-slate-100 rounded-lg w-16 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
