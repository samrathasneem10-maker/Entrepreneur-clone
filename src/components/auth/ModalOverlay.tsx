'use client';

import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-[440px] max-h-[92vh] flex flex-col rounded-lg sm:rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar with Entrepreneur Logo and Close button matching reference screenshot */}
        <div className="flex items-center justify-between h-14 border-b border-slate-200 bg-white flex-shrink-0">
          {/* Logo on Left */}
          <div className="flex items-baseline pl-5 select-none">
            <span className="font-logo font-black text-2xl sm:text-[26px] tracking-[-0.04em] text-[#000000] leading-none">
              Entrepreneur
            </span>
            <span className="text-[#000000] text-[9px] font-sans font-bold ml-[1px] leading-none align-baseline">
              ®
            </span>
          </div>

          {/* Close Button on Right with vertical divider */}
          <button
            onClick={onClose}
            className="w-14 h-14 border-l border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Close modal"
            title="Close modal"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto px-6 py-6 sm:px-7 sm:py-7 no-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
