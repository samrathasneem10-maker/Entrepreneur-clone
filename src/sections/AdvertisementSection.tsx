'use client';

import React from 'react';

interface AdvertisementSectionProps {
  label?: string;
  sizeText?: string;
  className?: string;
}

export const AdvertisementSection: React.FC<AdvertisementSectionProps> = ({
  label = 'ADVERTISEMENT',
  sizeText = '300 × 400 Banner',
  className = '',
}) => {
  return (
    <section
      aria-label="Advertisement"
      className={`w-full py-8 sm:py-10 flex flex-col items-center justify-center ${className}`}
    >
      {/* 1. Top ADVERTISEMENT Label matching Image 4 */}
      <div className="w-full text-center mb-2 sm:mb-2.5">
        <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400">
          {label}
        </span>
      </div>

      {/* 2. Banner Box: Light grey/blue style of Image 4 with size and placement of Image 3 */}
      <div className="w-full max-w-[820px] mx-auto px-4 flex justify-center">
        <div 
          className="w-full h-36 sm:h-40 md:h-44 bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-center p-6 text-center shadow-2xs rounded-none"
        >
          <span className="text-xs sm:text-[13px] font-semibold text-slate-600 font-sans tracking-wide">
            {sizeText}
          </span>
          <span className="text-[11px] text-slate-400 font-sans mt-0.5">
            Your Advertisement Here
          </span>
        </div>
      </div>
    </section>
  );
};
