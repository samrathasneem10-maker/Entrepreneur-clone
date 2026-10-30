'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { ArrowLeft, ChevronDown, ChevronUp, User, LogOut } from 'lucide-react';
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

  const displayName = user?.name || 'mishal';
  const displayEmail = user?.email || 'mishalzuhrie@gmail.com';
  const displayAvatar = user?.avatar || '/images/user-avatar-butterfly.png';
  const displayRole = user?.role ? user.role.toUpperCase() : 'WRITER';

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

            {/* Authentic Entrepreneur Brand Wordmark Logo */}
            <Link href="/" className="flex items-center group py-0.5 select-none" aria-label="Entrepreneur">
              <svg
                className="h-6 sm:h-7 md:h-7.5 w-auto fill-current text-slate-900 group-hover:text-[#1642D0] transition-colors"
                viewBox="0 0 545.8 107.1"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M0.8,72.7l6.9-1.1V7.9L0,6.9L0.4,0h48.2l-1.2,19.3l-9.6-0.3L37.2,6.9H22.3v28.7h6.5l1.5-6.6l6.7,0.2V49h-6.7 l-1.6-6.8h-6.5v30.4h15l1.4-13.2l10.1,0.3l0.8,20.1H0.5L0.8,72.7z" />
                <path d="M54,79.9l0.3-5.9l5.4-1.1V32.7l-6.3-0.6v-6l15.8-2.3l1.2,3.4v2.3c3.8-4,8.4-6.4,14.3-6.4 c8.6,0,15,5.2,15,15.5v34.2l5.7,1.1l-0.3,5.9H86.3V41.6c0-5.5-2-8.6-7-8.6c-1.7,0-2.9,0.3-4.2,0.8c-0.8,0.7-1.6,1.7-2.3,2.6v36.6 l5.7,1.1l-0.4,5.9H54z" />
                <path d="M356.1,79.9l0.2-5.9l5.4-1.1V32.7l-6.3-0.6v-6l15.8-2.3l1.2,3.4v2.3c3.8-4,8.4-6.4,14.3-6.4 c8.6,0,15,5.2,15,15.5v34.2l5.7,1.1l-0.3,5.9h-18.7V41.6c0-5.5-2-8.6-7-8.6c-1.7,0-2.9,0.3-4.2,0.8c-0.8,0.7-1.6,1.7-2.3,2.6v36.6 l5.7,1.1l-0.4,5.9H356.1z" />
                <path d="M135.2,78.8c-2.2,0.9-6.1,1.9-11.2,1.9c-6.7,0-12.9-3-12.9-12.8V32.7l-6.4-1l0.3-7l7.2-0.3l3.1-10.7l9.2-0.4 v11.5h9.9l-0.7,7l-9.1,1v35.2c0,2.9,1.6,4.8,4.6,4.8h5.4L135.2,78.8z" />
                <path d="M509.5,79.9l0.2-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17.1-5.3l2.4,2.1L544.1,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H509.5z" />
                <path d="M274,79.9l0.3-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17.1-5.3l2.4,2.1L308.5,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H274z" />
                <path d="M139.2,79.9l0.3-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17-5.3l2.4,2.1L173.8,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H139.2z" />
                <path d="M191,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L191,55.4z M190.8,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C191.9,36.8,190.8,45.1,190.8,49z" />
                <path d="M423.4,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L423.4,55.4z M423.2,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C424.3,36.8,423.2,45.1,423.2,49z" />
                <path d="M325.8,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L325.8,55.4z M325.6,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C326.7,36.8,325.5,45.1,325.6,49z" />
                <path d="M490,79.9l-1.4-4.8c-3.7,3.5-7.3,5.6-12.9,5.6c-8.6,0-16.3-4.3-16.3-16.2V31.3l-6.3-0.6v-5.3l18.2-2.1 l1.4,4.8v34.8c0,6.1,2.5,9.3,7.4,9.3c1.4,0,3.2-0.2,4.8-0.8c0.9-0.9,1.8-2,2.5-3.1v-37l-6.5-0.6v-5.3l18.4-2.1l1.4,4.8v44.8 l5.7,1.1l-0.7,5.9H490z" />
                <path d="M247.1,72.7c-2.9,0-5.2-0.5-7-1.5V35.9c0.8-1.2,1.7-2.3,2.6-3.3c1.7-0.6,3.2-0.8,5-0.8c7.5,0,8.8,7.6,8.8,21.2 c0,13.1-2,16.7-2.5,18.2C251.9,72.2,249.7,72.7,247.1,72.7z M269.5,50.6c0-16.9-5-27.5-17.5-27.5c-8.3,0-12.2,4.8-13.8,6.8V28 l-1.4-4.8l-16.3,2.3v5.8l6.3,0.8v68.2l-5.4,1.1l-0.3,5.7h24.1l0.4-5.7l-5.7-1.1V78.7c2.3,1.3,5.5,2.1,9,2.1 C269.3,80.8,269.5,60.1,269.5,50.6z" />
              </svg>
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

                {/* Profile Settings Option */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsSettingsModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 py-2 px-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile Settings</span>
                </button>

                <div className="border-t border-slate-100 my-2" />

                {/* Log Out Option */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 py-2 px-2 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out</span>
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
