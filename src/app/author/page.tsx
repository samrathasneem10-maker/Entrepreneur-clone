'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';

export default function AuthorIndexPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'writer' && user?.name) {
      const slug = user.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      router.replace(`/author/${slug}`);
    } else {
      router.replace('/author/sherin-shibu');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
