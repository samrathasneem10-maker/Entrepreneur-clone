import React from 'react';
import { SkeletonBase } from './SkeletonBase';

export const NewslettersSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white animate-in fade-in duration-200">
      
      {/* Hero Header Section */}
      <section className="bg-slate-900 text-white py-12 px-5 lg:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <SkeletonBase className="h-4 w-32 mx-auto bg-slate-800" />
          <SkeletonBase className="h-10 w-3/4 mx-auto bg-slate-800" />
          <SkeletonBase className="h-5 w-full max-w-2xl mx-auto bg-slate-800" />
        </div>
      </section>

      {/* Grid of Newsletter Cards */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <SkeletonBase className="w-10 h-10 rounded-xl" />
                <SkeletonBase className="h-4 w-16" />
              </div>
              <SkeletonBase className="h-6 w-3/4" />
              <SkeletonBase className="h-4 w-full" />
              <SkeletonBase className="h-4 w-5/6" />
              <div className="pt-2">
                <SkeletonBase className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
