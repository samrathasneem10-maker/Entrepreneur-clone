import React from 'react';
import { SkeletonBase } from './SkeletonBase';

export const AuthorSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white animate-in fade-in duration-200">
      
      {/* Top Profile Header Section */}
      <section className="bg-slate-50/80 border-b border-slate-200 py-8 md:py-12 px-5 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <SkeletonBase className="h-4 w-20" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
            <SkeletonBase className="w-24 h-24 rounded-full flex-shrink-0" />
            <div className="space-y-3 text-center sm:text-left flex-1">
              <SkeletonBase className="h-8 w-64 mx-auto sm:mx-0" />
              <SkeletonBase className="h-4 w-24 mx-auto sm:mx-0" />
              <div className="space-y-2 pt-1">
                <SkeletonBase className="h-4 w-full max-w-2xl" />
                <SkeletonBase className="h-4 w-3/4 max-w-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Container */}
      <main className="max-w-7xl mx-auto px-5 lg:px-10 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Article Stream (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <SkeletonBase className="h-7 w-64" />

            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row-reverse justify-between gap-5 pb-6 border-b border-slate-200">
                  <SkeletonBase className="w-full sm:w-[150px] aspect-square rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <SkeletonBase className="h-3 w-20" />
                    <SkeletonBase className="h-6 w-full" />
                    <SkeletonBase className="h-6 w-4/5" />
                    <SkeletonBase className="h-4 w-full" />
                    <SkeletonBase className="h-3 w-32 pt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <SkeletonBase className="h-6 w-32" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0">
                  <SkeletonBase className="h-7 w-6 text-slate-300" />
                  <div className="flex-1 space-y-1.5">
                    <SkeletonBase className="h-4 w-full" />
                    <SkeletonBase className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>

            <SkeletonBase className="w-full h-[250px] rounded-xl" />
          </aside>

        </div>
      </main>
    </div>
  );
};
