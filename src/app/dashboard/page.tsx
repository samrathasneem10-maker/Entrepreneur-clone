'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, openLogin } = useAuth();

  useEffect(() => {
    if (!user) {
      openLogin();
      router.push('/');
      return;
    }

    const role = (user.role || 'reader').toLowerCase();
    if (role === 'admin') {
      router.replace('/dashboard/admin');
    } else if (role === 'writer' || role === 'writter') {
      router.replace('/dashboard/writer');
    } else {
      router.replace('/dashboard/reader');
    }
  }, [user, router, openLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-sans text-slate-500 font-semibold tracking-wider uppercase">
          Redirecting to your dashboard...
        </span>
      </div>
    </div>
  );
}
