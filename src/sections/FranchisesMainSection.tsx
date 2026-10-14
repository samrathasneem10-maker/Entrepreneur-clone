'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const FranchisesMainSection: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const pills = [
    { label: 'Franchise 500', href: '/topic/franchises' },
    { label: 'See Franchise Matches', href: '/topic/franchises' },
    { label: 'Find Your Franchise', href: '/topic/franchises' },
    { label: 'Fund Your Franchise', href: '/topic/franchises' },
    { label: 'Buy Your Franchise', href: '/topic/franchises' },
  ];

  const leftArticles = [
    {
      id: 'former-engineer-preschool-teacher',
      category: 'BUYING A FRANCHISE',
      title: "This Former Engineer and Preschool Teacher Teamed Up to Start a Creative Business: 'Haven't Regretted Choosing a Franchise.'",
      titleJsx: (
        <>
          This Former Engineer and Preschool<br className="hidden sm:inline" /> Teacher Teamed Up to Start a Creative<br className="hidden sm:inline" /> Business: &apos;Haven&apos;t Regretted Choosing a<br className="hidden sm:inline" /> Franchise.&apos;
        </>
      ),
    },
    {
      id: 'taco-bell-milk-bar-empanada',
      category: 'BUYING A FRANCHISE',
      title: 'Taco Bell and Milk Bar Are Stuffing a Birthday Cake Into an Empanada',
      titleJsx: (
        <>
          Taco Bell and Milk Bar Are Stuffing a<br className="hidden sm:inline" /> Birthday Cake Into an Empanada
        </>
      ),
    },
    {
      id: 'hiltons-ai-trip-planner',
      category: 'BUSINESS NEWS',
      title: "Hilton's AI Trip Planner Wants To Book Your Travel. Customers Aren't So Sure Yet.",
      titleJsx: (
        <>
          Hilton&apos;s AI Trip Planner Wants To Book<br className="hidden sm:inline" /> Your Travel. Customers Aren&apos;t So Sure<br className="hidden sm:inline" /> Yet.
        </>
      ),
    },
    {
      id: 'chick-fil-a-healthy-dose-fear',
      category: 'BUYING A FRANCHISE',
      title: "As Franchises Go After Chick-fil-A, Its CEO Is Prescribing a 'Healthy Dose of Fear'",
      titleJsx: (
        <>
          As Franchises Go After Chick-fil-A, Its<br className="hidden sm:inline" /> CEO Is Prescribing a &lsquo;Healthy Dose of<br className="hidden sm:inline" /> Fear&rsquo;
        </>
      ),
    },
  ];

  const middleArticle = {
    id: 'daves-hot-chicken',
    category: 'BUYING A FRANCHISE',
    title: "Dave's Hot Chicken Started With $900 in a Parking Lot. It Now Has 500 Restaurants.",
    excerpt: 'The chain has eight openings in one day, deals across Europe and no sign of slowing down.',
    author: 'JONATHAN SMALL',
    authorSlug: 'jonathan-small',
    imageUrl: '/images/daves-hot-chicken.jpg',
    remoteImageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/10/daves-hot-chicken-1026-g-2217834688.jpg?resize=500,500',
  };

  // Step 1 Options matching exact Money / Flexibility / Control / Lifestyle
  const quizSteps = [
    {
      step: 1,
      percentage: '17%',
      question: "What's most important for you when starting a business?",
      options: [
        'Money',
        'Flexibility',
        'Control',
        'Lifestyle',
      ],
    },
    {
      step: 2,
      percentage: '40%',
      question: 'What is your available liquid capital for investment?',
      options: [
        'Under $50,000',
        '$50,000 - $150,000',
        '$150,000 - $300,000',
        '$300,000+',
      ],
    },
    {
      step: 3,
      percentage: '65%',
      question: 'Which franchise industry appeals to you most?',
      options: [
        'Food & Beverage / Fast-Casual',
        'Health, Wellness & Fitness',
        'Home Services & Maintenance',
        'Business Services & Coaching',
      ],
    },
    {
      step: 4,
      percentage: '85%',
      question: 'How involved do you want to be day-to-day?',
      options: [
        'Hands-on Owner / Operator',
        'Semi-absentee (Manage the Manager)',
        'Fully Passive Investor',
      ],
    },
    {
      step: 5,
      percentage: '100%',
      question: 'When are you planning to launch your franchise?',
      options: [
        'Within 1–3 months',
        'In 3–6 months',
        'In 6–12 months',
        'Just researching opportunities',
      ],
    },
  ];

  const currentQuiz = quizSteps[0];

  const handleSelectOption = (option: string) => {
    setSelectedOption((prev) => (prev === option ? null : option));
  };

  return (
    <section className="bg-white pb-12 md:pb-16 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Top line with SMALL GAP above Franchises heading matching screenshot */}
        <div className="border-t border-slate-200 pt-2.5 sm:pt-3 pb-2 mb-5">
          <div className="flex items-center justify-between">
            <h2 className="my-0 text-[#020618] font-bold text-2xl sm:text-3xl font-serif leading-none tracking-tight">
              <Link href="/topic/franchises" className="hover:underline">
                Franchises
              </Link>
            </h2>

            <Link
              href="/topic/franchises"
              className="flex items-center no-underline hover:underline text-xs sm:text-[13px] font-bold text-[#020618] uppercase tracking-wider group"
            >
              <span>See All</span>
              <svg
                aria-hidden="true"
                fill="currentColor"
                className="w-5 h-5 fill-current ml-1.5 text-[#6B21A8] group-hover:scale-105 transition-transform"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10m-10 1H8v-2h4V8l4 4-4 4z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Sub-Navigation Pills (All Solid Black Rounded Pills matching Screenshot gap) */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-6 sm:pb-7">
          {pills.map((pill) => (
            <Link
              key={pill.label}
              href={pill.href}
              className="px-4 sm:px-4.5 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-[13px] font-sans whitespace-nowrap bg-[#020618] text-white hover:bg-slate-800 transition-colors shadow-2xs"
            >
              {pill.label}
            </Link>
          ))}
        </div>

        {/* 3-Column Layout: Left (3 cols), Middle (6 cols), Right (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* 1. Left Column: 4 stacked articles + Featured Franchise Widget */}
          <div className="md:col-span-5 xl:col-span-3 space-y-5">
            {leftArticles.map((art) => (
              <div key={art.id} className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1642D0] font-sans block">
                  {art.category}
                </span>

                <h3 className="text-sm sm:text-[15px] font-serif font-bold text-[#020618] leading-[1.35] tracking-tight">
                  <Link
                    href={`/article/${art.id}`}
                    className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all"
                  >
                    {art.titleJsx}
                  </Link>
                </h3>
              </div>
            ))}

            {/* Featured Franchise Widget (Exact Layout & Logo from Screenshot) */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#020618] tracking-tight mb-4">
                Featured Franchise
              </h3>

              {/* Logo + Details & Learn More Button Row (aligned directly under text) */}
              <div className="flex items-start gap-3.5">
                {/* Authentic Heights Wellness Logo */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 pt-0.5 flex items-center justify-center">
                  <img
                    src="/images/heights-wellness-logo.webp"
                    alt="Heights Wellness Retreat"
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Name, Category & Learn More Button Column */}
                <div className="flex flex-col">
                  <h4 className="font-serif font-bold text-base sm:text-[17px] text-[#020618] leading-tight m-0">
                    Heights Wellness<br />Retreat
                  </h4>
                  <div className="text-xs sm:text-[13px] text-slate-500 font-serif italic pt-1 pb-3">
                    Personal-Care
                  </div>
                  <div>
                    <Link
                      href="/topic/franchises"
                      className="inline-block px-6 sm:px-7 py-2 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs sm:text-[13px] rounded transition-colors shadow-2xs text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Middle Column: Featured Dave's Hot Chicken photo + Underlined Article */}
          <div className="md:col-span-7 xl:col-span-6">
            <div className="group">
              {/* Featured photo */}
              <Link href={`/article/${middleArticle.id}`} className="block">
                <div className="relative w-full aspect-[4/3] sm:aspect-square md:aspect-[16/11] overflow-hidden rounded-xl border border-slate-200/90 shadow-2xs">
                  <img
                    src={middleArticle.imageUrl}
                    alt={middleArticle.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = middleArticle.remoteImageUrl;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Centered Article Details */}
              <div className="pt-4 space-y-2 text-center flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1642D0] font-sans block">
                  {middleArticle.category}
                </span>

                <h3 className="text-2xl sm:text-[26px] lg:text-[28px] font-serif font-bold text-[#020618] leading-[1.25] tracking-tight max-w-xl">
                  <Link
                    href={`/article/${middleArticle.id}`}
                    className="text-[#020618] underline decoration-[#020618] decoration-1 underline-offset-[4px] hover:text-[#1642D0] transition-colors"
                  >
                    {middleArticle.title}
                  </Link>
                </h3>

                {/* Normal weight excerpt */}
                <p className="text-sm sm:text-base font-sans font-normal text-slate-600 leading-relaxed max-w-lg">
                  {middleArticle.excerpt}
                </p>

                {/* Byline */}
                <div className="text-xs font-sans uppercase tracking-wider pt-1 flex items-center justify-center gap-1">
                  <span className="text-slate-500 font-semibold">BY</span>
                  <Link
                    href={`/author/${middleArticle.authorSlug}`}
                    className="text-[#1642D0] font-bold underline decoration-[#1642D0] underline-offset-2 hover:text-blue-800 transition-colors"
                  >
                    {middleArticle.author}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Right Column: Exact 3-line paragraph and Dark Blue on click */}
          <div className="md:col-span-12 xl:col-span-3 border border-[#020618] rounded-xl p-5 sm:p-6 bg-white shadow-2xs">
            <div className="text-center space-y-2 mb-4">
              <h3 className="text-xl sm:text-[22px] font-serif font-bold text-[#020618] leading-tight text-center my-0">
                Find Your Perfect<br />Franchise Match
              </h3>

              {/* Exact 3-line formatted paragraph from screenshot */}
              <p className="text-xs sm:text-[13px] text-slate-600 font-serif leading-relaxed text-center max-w-[240px] mx-auto">
                See which franchises fit your<br />
                budget and have open<br />
                territories near you.
              </p>
            </div>

            {/* Quiz Progress Header with 17% pill inside track */}
            <div className="w-full bg-[#E8EEF5] h-3.5 rounded-full p-0.5 flex items-center mb-4">
              <div className="bg-[#1642D0] text-white text-[9px] font-bold px-2 py-0.5 rounded-full leading-none flex items-center justify-center">
                {currentQuiz.percentage}
              </div>
            </div>

            {/* Step & Question: Exact 3-line question wrap */}
            <div className="text-center space-y-1 mb-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                STEP {currentQuiz.step}/5
              </div>
              <div className="text-sm sm:text-[15px] font-bold text-[#020618] font-sans leading-snug">
                What&apos;s most important for<br />
                you when starting a<br />
                business?
              </div>
              <div className="text-xs text-slate-500 font-sans">
                Select one
              </div>
            </div>

            {/* Quiz Option Buttons: Default Light Blue Fill & Blue Outline, Learn More Blue on Cursor Hover and Click */}
            <div className="space-y-2.5 mb-2">
              {currentQuiz.options.map((opt) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-md text-xs sm:text-sm font-bold font-sans transition-all border cursor-pointer text-center block ${
                      isSelected
                        ? 'bg-[#1642D0] text-white border-[#1642D0] shadow-sm'
                        : 'border-[#2E5CDB] bg-[#F0F6FF] text-[#1642D0] hover:bg-[#1642D0] hover:text-white hover:border-[#1642D0]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
