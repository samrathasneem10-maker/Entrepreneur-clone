'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import AdminDashboardSkeleton from '@/components/admin/AdminDashboardSkeleton';

const AdminDashboardContent = dynamic(
  () => import('@/components/admin/AdminDashboardContent'),
  {
    ssr: false,
    loading: () => <AdminDashboardSkeleton />,
  }
);

export default function AdminPortalPage() {
  return <AdminDashboardContent />;
}
