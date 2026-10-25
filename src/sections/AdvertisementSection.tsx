'use client';

import React from 'react';

interface AdvertisementSectionProps {
  className?: string;
}

export const AdvertisementSection: React.FC<AdvertisementSectionProps> = ({
  className = '',
}) => {
  return (
    <section
      aria-label="Advertisement"
      className={`w-full py-6 sm:py-8 flex flex-col items-center justify-center ${className}`}
    >
      {/* Empty Black Box Rectangle with Sharp Corners matching reference image */}
      <div className="w-full max-w-[760px] sm:max-w-[820px] lg:max-w-[880px] mx-auto px-2 sm:px-0">
        <div 
          className="w-full h-32 sm:h-36 md:h-40 bg-black rounded-none border border-neutral-900 shadow-md"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};
