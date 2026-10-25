import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const MagazineSection: React.FC = () => {
  const issues = [
    {
      id: 'issue-sep-oct-2026',
      title: 'Sept/Oct 2026',
      subtitle: 'Entrepreneur Magazine',
      imageUrl: '/images/magazine-cover-sep-oct-2026.png',
      alt: 'Entrepreneur Magazine Sept/Oct 2026 - Codie Sanchez',
    },
    {
      id: 'issue-july-aug-2026',
      title: 'July/August 2026',
      subtitle: 'Entrepreneur Magazine',
      imageUrl: '/images/magazine-cover-jul-aug-2026.png',
      alt: 'Entrepreneur Magazine July/August 2026 - Gary Vaynerchuk',
    },
    {
      id: 'issue-may-june-2026',
      title: 'May/June 2026',
      subtitle: 'Entrepreneur Magazine',
      imageUrl: '/images/magazine-cover-may-jun-2026.png',
      alt: 'Entrepreneur Magazine May/June 2026 - Megan Thee Stallion',
    },
  ];

  return (
    <section className="bg-white py-10 sm:py-12 md:py-14 w-full">
      <div className="w-full">
        {/* Section Header: Title (Left) + See All (Right) */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif tracking-tight">
            Entrepreneur Magazine
          </h2>

          <Link
            href="/magazine"
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#020618] hover:text-[#1642D0] uppercase tracking-wider font-sans group"
          >
            <span>See All</span>
            <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center transition-transform group-hover:scale-105">
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </span>
          </Link>
        </div>

        {/* 3 Magazine Covers Cards Grid matching reference screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start w-full">
          {issues.map((issue) => (
            <div key={issue.id} className="flex flex-col items-center text-center group">
              {/* High-Resolution Magazine Cover Container */}
              <Link
                href={`/magazine/${issue.id}`}
                className="w-full block overflow-hidden rounded-[10px] shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 bg-white cursor-pointer"
              >
                <img
                  src={issue.imageUrl}
                  alt={issue.alt}
                  className="w-full h-auto object-cover block"
                  loading="lazy"
                />
              </Link>

              {/* Month Title (Bold Big Date), Subtitle (Small Italic), and Blue CTA Button */}
              <div className="pt-4 text-center flex flex-col items-center w-full">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] my-0 leading-tight">
                  {issue.title}
                </h3>
                <p className="text-xs sm:text-[13px] font-serif italic text-slate-700 mt-1 mb-3">
                  {issue.subtitle}
                </p>

                {/* Blue Button "Go to Issue" */}
                <Link
                  href={`/magazine/${issue.id}`}
                  className="inline-block px-7 py-2 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs sm:text-[13px] rounded-[4px] transition-colors cursor-pointer shadow-xs"
                >
                  Go to Issue
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
