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
      className={`w-full py-8 sm:py-10 flex flex-col items-center justify-center ${className}`}
    >
      {/* Empty Black Box Rectangle with Sharp Corners matching reference image 3 */}
      <div className="w-full max-w-[820px] mx-auto px-4 flex justify-center">
        <div 
          className="w-full aspect-[3.5/1] max-h-[190px] min-h-[140px] bg-black rounded-none border border-black shadow-none"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};
