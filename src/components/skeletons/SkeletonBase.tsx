import React from 'react';

interface SkeletonBaseProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
  style?: React.CSSProperties;
}

export const SkeletonBase: React.FC<SkeletonBaseProps> = ({
  className = '',
  width,
  height,
  rounded = 'rounded-md',
  style,
}) => {
  return (
    <div
      className={`skeleton-shimmer ${rounded} ${className}`}
      style={{
        width: width || undefined,
        height: height || undefined,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};
