'use client';

import React from 'react';
import { useSkeletonMaxDuration } from './useSkeletonMaxDuration';

interface SkeletonBaseProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
  style?: React.CSSProperties;
  maxDuration?: number;
}

export const SkeletonBase: React.FC<SkeletonBaseProps> = ({
  className = '',
  width,
  height,
  rounded = 'rounded-md',
  style,
  maxDuration = 2000,
}) => {
  const isVisible = useSkeletonMaxDuration(maxDuration);

  if (!isVisible) return null;

  return (
    <div
      className={`skeleton-shimmer skeleton-max-duration ${rounded} ${className}`}
      style={{
        width: width || undefined,
        height: height || undefined,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};
