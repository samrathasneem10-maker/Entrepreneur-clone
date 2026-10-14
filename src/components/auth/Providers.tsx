'use client';

import React, { ReactNode, Suspense } from 'react';
import { AuthProvider } from './AuthContext';
import { AuthModal } from './AuthModal';
import { LoadingProvider } from '@/components/LoadingProvider';
import { HomeSkeleton } from '@/components/skeletons/HomeSkeleton';

export const ClientProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <Suspense fallback={<HomeSkeleton />}>
        <LoadingProvider>{children}</LoadingProvider>
      </Suspense>
      <AuthModal />
    </AuthProvider>
  );
};

