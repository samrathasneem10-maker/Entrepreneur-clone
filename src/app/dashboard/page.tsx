'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/components/auth/AuthContext';
import { ReaderDashboardContent } from '@/components/ReaderDashboardContent';

const AdminDashboardContent = dynamic(
  () => import('@/components/admin/AdminDashboardContent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-3 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

const WriterDashboardContent = dynamic(
  () => import('@/components/writer/WriterDashboardContent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const role = (user?.role || '').toLowerCase();

  if (role === 'admin') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-3 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <AdminDashboardContent />
      </Suspense>
    );
  }

  if (role === 'writer' || role === 'writter') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <WriterDashboardContent />
      </Suspense>
    );
  }

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
