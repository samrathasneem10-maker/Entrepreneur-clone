import React from 'react';
import { SkeletonBase } from './SkeletonBase';

export const SearchBarSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 pt-4 animate-in fade-in duration-200">
      <SkeletonBase className="h-4 w-32" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 p-3 border border-slate-100 rounded-xl items-center">
            <SkeletonBase className="w-16 h-16 rounded-lg flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <SkeletonBase className="h-4 w-full" />
              <SkeletonBase className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
