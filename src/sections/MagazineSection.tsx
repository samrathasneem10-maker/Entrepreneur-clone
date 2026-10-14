import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const MagazineSection: React.FC = () => {
  const issues = [
    {
      id: 'issue-july-aug-2026',
      title: 'July/August 2026',
      subtitle: 'Entrepreneur Magazine',
      coverHeadline: 'GARY VAYNERCHUK',
      subHeadline: "'You Can Do More!'",
      tagline: 'THE PERFECT PITCH: The formula that drove $2.5 billion in sales',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      bgGradient: 'from-[#6B1110]/80 via-[#2A0808]/70 to-slate-950',
    },
    {
      id: 'issue-may-june-2026',
      title: 'May/June 2026',
      subtitle: 'Entrepreneur Magazine',
      coverHeadline: 'MEGAN THEE STALLION',
      subHeadline: 'OWN THE ROOM',
      tagline: 'Tells you how to go viral and scale an iconic brand',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
      bgGradient: 'from-slate-800/80 via-slate-900/80 to-slate-950',
    },
    {
      id: 'issue-march-april-2026',
      title: 'March/April 2026',
      subtitle: 'Entrepreneur Magazine',
      coverHeadline: 'DAYMOND JOHN',
      subHeadline: "SHARK TANK'S DAYMOND JOHN",
      tagline: 'Steal his playbook for grabbing attention and growing sales',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop',
      bgGradient: 'from-[#0F2942]/80 via-[#071320]/70 to-slate-950',
    },
  ];

  return (
    <section className="bg-white py-12 md:py-16 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Section Header matching reference screenshot */}
        <div className="mb-8 border-b border-slate-200 pb-3 flex items-center justify-between">
          <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none">
            Entrepreneur Magazine
          </h2>

          <Link
            href="/magazine"
            className="flex items-center gap-1.5 text-xs font-bold text-[#020618] hover:text-[#B91C1C] uppercase tracking-wider font-sans group"
          >
            <span>See All</span>
            <span className="w-5.5 h-5.5 rounded-full bg-[#8B0000] text-white flex items-center justify-center transition-colors group-hover:bg-[#B91C1C]">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        {/* 3 Magazine Covers Cards Grid (Matching Reference Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start w-full">
          {issues.map((issue) => (
            <div key={issue.id} className="flex flex-col items-center text-center group">
              
              {/* High-Resolution Magazine Cover Container */}
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[20px] border border-slate-200/90 shadow-md group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-[1.02] cursor-pointer bg-slate-900">
                {/* Background Image */}
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="w-full h-full object-cover object-top filter brightness-[0.92]"
                />

                {/* Dark Gradient Overlay for text contrast */}
                <div className={`absolute inset-0 bg-gradient-to-t ${issue.bgGradient} opacity-60 mix-blend-multiply`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                {/* Entrepreneur Header Logotype Overlay */}
                <div className="absolute top-4 inset-x-0 px-4 text-center">
                  <span className="font-logo font-black text-3xl sm:text-4xl lg:text-[40px] tracking-[-0.04em] text-white drop-shadow-md block leading-none">
                    Entrepreneur
                  </span>
                  <span className="text-[10px] font-sans font-bold text-slate-200 tracking-widest uppercase block pt-1">
                    {issue.title} • entrepreneur.com
                  </span>
                </div>

                {/* Cover Headline Overlays */}
                <div className="absolute bottom-5 inset-x-0 px-5 text-left text-white space-y-1">
                  <div className="bg-red-600 text-white font-sans font-extrabold text-[10px] uppercase tracking-widest px-2 py-0.5 rounded inline-block">
                    FEATURED STORY
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-tight leading-none drop-shadow-md text-amber-400">
                    {issue.subHeadline}
                  </h4>
                  <p className="text-xs font-sans text-slate-200 leading-snug line-clamp-2 drop-shadow-sm font-medium">
                    {issue.tagline}
                  </p>
                </div>
              </div>

              {/* Month Title, Subtitle, and Blue Button Below Cover */}
              <div className="space-y-1.5 pt-4 text-center flex flex-col items-center">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#020618] my-0">
                  {issue.title}
                </h3>
                <div className="text-xs font-serif italic text-slate-500">
                  {issue.subtitle}
                </div>

                {/* Blue CTA Button */}
                <Link
                  href={`/magazine/${issue.id}`}
                  className="inline-block px-7 py-2.5 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-2xs mt-2"
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
