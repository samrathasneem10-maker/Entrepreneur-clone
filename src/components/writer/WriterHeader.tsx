'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { ArrowLeft, ChevronDown, ChevronUp, User, LogOut, PenTool, LayoutDashboard, Settings } from 'lucide-react';
import ProfileSettingsModal from './ProfileSettingsModal';

function HeaderQuerySync({
  setIsDropdownOpen,
  setIsSettingsModalOpen,
}: {
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get('dropdown') === 'profile') {
      setIsDropdownOpen(true);
    }
    if (searchParams.get('modal') === 'settings' || searchParams.get('settings') === 'true') {
      setIsSettingsModalOpen(true);
    }
  }, [searchParams, setIsDropdownOpen, setIsSettingsModalOpen]);
  return null;
}

interface WriterHeaderProps {
  backHref?: string;
}

export default function WriterHeader({ backHref = '/' }: WriterHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    router.push('/');
  };

  const displayName = user?.name || user?.writerName || 'Writer';
  const displayEmail = user?.email || 'writter@gmail.com';
  const displayAvatar = user?.avatar || '/images/user-avatar-butterfly.png';
  const displayRole = user?.role ? user.role.toUpperCase() : 'WRITER';
  const authorSlug = encodeURIComponent((user?.name || user?.writerName || 'writer').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));

  return (
    <>
      <Suspense fallback={null}>
        <HeaderQuerySync
          setIsDropdownOpen={setIsDropdownOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
        />
      </Suspense>

      <header className="w-full bg-white border-b border-slate-200/90 sticky top-0 z-40">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Back button + Washington Global Times Brand Logo + WRITER PORTAL Pill */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={handleBack}
              className="p-1.5 -ml-1.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Go Back"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Logo - Logo @3x */}
            <Link href="/" className="flex items-center group py-0.5 select-none" aria-label="Entrepreneur">
              <img
                src="/Logo @3x.png"
                alt="Entrepreneur"
                className="h-6 sm:h-7 md:h-7.5 w-auto object-contain"
              />
            </Link>

            {/* WRITER PORTAL Badge */}
            <div className="ml-1 sm:ml-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#2563EB] text-[11px] font-bold tracking-wider uppercase border border-blue-200/50">
                WRITER PORTAL
              </span>
            </div>
          </div>

          {/* Right: User Pill Button & Dropdown matching Reference Image 1 */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-2xs group"
            >
              {/* Square avatar with rounded corners */}
              <img
                src={displayAvatar}
                alt={displayName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/user-avatar-butterfly.png';
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-slate-200 shrink-0"
              />

              <span className="font-bold text-xs sm:text-sm text-slate-800">
                {displayName}
              </span>

              {isDropdownOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              )}
            </button>

            {/* Profile Dropdown Menu Card matching Reference Image 1 */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                
                {/* User Info Header in Dropdown */}
                <div className="mb-3">
                  <div className="font-bold text-slate-900 text-sm leading-snug">
                    {displayName}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                    {displayEmail}
                  </div>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold tracking-wider uppercase rounded border border-blue-200/50">
                      {displayRole}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 my-2.5" />

                <div className="space-y-0.5">
                  {/* 1. Writer Dashboard */}
                  <Link
                    href="/dashboard/writer"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 py-2 px-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    <span>Writer Dashboard</span>
                  </Link>

                  {/* 2. Writer Page */}
                  <Link
                    href={`/author/${authorSlug}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 py-2 px-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Writer Page</span>
                  </Link>

                  {/* 3. Profile Settings */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsSettingsModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 py-2 px-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Profile Settings</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 my-2" />

                {/* 5. Sign Out */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 py-2 px-2 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
}
