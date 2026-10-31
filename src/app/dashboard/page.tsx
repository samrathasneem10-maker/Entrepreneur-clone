'use client';

import React, { Suspense } from 'react';
import { ReaderDashboardContent } from '@/components/ReaderDashboardContent';

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ReaderDashboardContent />
    </Suspense>
  );
}
