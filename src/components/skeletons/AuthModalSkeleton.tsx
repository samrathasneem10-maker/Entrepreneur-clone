'use client';

import React from 'react';
import { SkeletonBase } from './SkeletonBase';
import { useSkeletonMaxDuration } from './useSkeletonMaxDuration';

export const AuthModalSkeleton: React.FC = () => {
  const isVisible = useSkeletonMaxDuration(2000);

  if (!isVisible) return null;

  return (
    <div className="w-full space-y-5 p-2 animate-in fade-in duration-200 skeleton-max-duration">
      {/* Title Skeleton */}
      <div className="text-center space-y-2 mb-6">
        <SkeletonBase className="h-7 w-48 mx-auto" />
        <SkeletonBase className="h-4 w-64 mx-auto" />
      </div>

      {/* Form Fields Skeletons */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <SkeletonBase className="h-3.5 w-24" />
          <SkeletonBase className="h-11 w-full rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <SkeletonBase className="h-3.5 w-24" />
          <SkeletonBase className="h-11 w-full rounded-lg" />
        </div>
      </div>

      {/* Action Button Skeleton */}
      <SkeletonBase className="h-11 w-full rounded-lg mt-6" />

      {/* Bottom Switch Link Skeleton */}
      <div className="pt-4 text-center">
        <SkeletonBase className="h-4 w-52 mx-auto" />
      </div>
    </div>
  );
};
