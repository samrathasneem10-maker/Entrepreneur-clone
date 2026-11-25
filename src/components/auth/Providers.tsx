'use client';

import React, { ReactNode, Suspense, useEffect } from 'react';
import { AuthProvider } from './AuthContext';
import { AuthModal } from './AuthModal';
import { LoadingProvider } from '@/components/LoadingProvider';
import { HomeSkeleton } from '@/components/skeletons/HomeSkeleton';

export const ClientProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    const handler = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      const isDomEvent = reason instanceof Event || (reason && typeof reason === 'object' && reason.isTrusted);
      if (isDomEvent) {
        console.error('DEBUG UNHANDLED REJECTION DETAILS:', JSON.stringify({
          eventType: reason.type,
          constructor: reason.constructor?.name,
          targetTag: reason.target?.tagName,
          targetId: reason.target?.id,
          targetClass: reason.target?.className,
          targetSrc: reason.target?.src || reason.target?.href || reason.target?.currentSrc,
          isTrusted: reason.isTrusted,
          message: reason.message,
        }));
        // Suppress the unhandled rejection so it does not trigger [object Event] dev overlay
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    const errorHandler = (e: ErrorEvent) => {
      const err = e.error;
      const isDomEvent = err instanceof Event || (err && typeof err === 'object' && err.isTrusted);
      if (isDomEvent) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('unhandledrejection', handler, true);
    window.addEventListener('error', errorHandler, true);
    return () => {
      window.removeEventListener('unhandledrejection', handler, true);
      window.removeEventListener('error', errorHandler, true);
    };
  }, []);

  return (
    <AuthProvider>
      <Suspense fallback={<HomeSkeleton />}>
        <LoadingProvider>{children}</LoadingProvider>
      </Suspense>
      <AuthModal />
    </AuthProvider>
  );
};

