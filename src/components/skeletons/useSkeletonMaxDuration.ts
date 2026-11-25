'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to enforce maximum display duration on skeleton loading states.
 * - Disappears immediately as soon as real content is ready (unmounted by parent component).
 * - Enforces a strict maximum display duration (default: 2000ms = 2 seconds), after which
 *   the skeleton is guaranteed to disappear even if background loading is delayed.
 */
export function useSkeletonMaxDuration(maxDurationMs = 2000): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!maxDurationMs || maxDurationMs <= 0) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, maxDurationMs);

    return () => clearTimeout(timer);
  }, [maxDurationMs]);

  return isVisible;
}
