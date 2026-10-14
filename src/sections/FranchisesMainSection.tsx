'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const FranchisesMainSection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

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

  // Interactive Quiz Questions
  const quizSteps = [
    {
      step: 1,
      percentage: '17%',
      question: "What's most important for you when starting a business?",
      options: [
        'High earning potential',
        'Be my own boss / Independence',
        'Work-life balance / Flexible hours',
        'Low upfront investment cost',
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
        'Food & Beverage / Quick-Service',
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

  const currentQuiz = quizSteps[currentStep - 1] || quizSteps[0];

  const handleSelectOption = (option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentStep]: option }));
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentStep(1);
  };

  return (
    <section className="bg-white pt-10 md:pt-12 pb-12 md:pb-16 border-b border-slate-200 w-full">
      <div className="w-full">
        
        {/* Header Bar matching Screenshot */}
        <div className="mb-6 flex items-center justify-between">
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
              className="w-5 h-5 fill-current ml-1.5 text-[#1642D0] group-hover:scale-105 transition-transform"
              viewBox="0 0 24 24"
            >
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10m-10 1H8v-2h4V8l4 4-4 4z" />
            </svg>
          </Link>
        </div>

        {/* Sub-Navigation Pills (All Solid Black Rounded Pills matching Screenshot) */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-8">
          {pills.map((pill) => (
            <Link
              key={pill.label}
              href={pill.href}
              className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm font-sans whitespace-nowrap bg-[#020618] text-white hover:bg-slate-800 transition-colors shadow-2xs"
            >
              {pill.label}
            </Link>
          ))}
        </div>

        {/* 3-Column Layout: Left (3 cols), Middle (6 cols), Right (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* 1. Left Column (3 of 12 cols on desktop): 4 stacked articles */}
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

            {/* Featured Franchise Widget (Matching Screenshot) */}
            <div className="pt-5 border-t border-slate-200 space-y-3">
              <h4 className="text-xs font-serif font-bold text-[#020618] uppercase tracking-wider">
                Featured Franchise
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                  <img
                    src="https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/07/1769649182-ProfilePictures1.webp"
                    alt="Heights Wellness Retreat"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="text-xs font-bold text-[#020618] hover:text-[#1642D0] cursor-pointer">
                    Heights Wellness Retreat
                  </div>
                  <div className="text-[11px] text-slate-500 italic">Personal-Care</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Middle Column (6 of 12 cols on desktop): Featured Dave's Hot Chicken photo + Article */}
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

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] leading-snug tracking-tight max-w-xl">
                  <Link
                    href={`/article/${middleArticle.id}`}
                    className="text-[#020618] no-underline hover:underline decoration-[#020618] decoration-1 underline-offset-[3px] transition-all"
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

          {/* 3. Right Column (3 of 12 cols on desktop): Interactive Find Your Perfect Franchise Match Widget */}
          <div className="md:col-span-12 xl:col-span-3 border border-[#020618] rounded-xl p-5 sm:p-6 bg-white shadow-2xs">
            <div className="text-center space-y-2 mb-4">
              <h3 className="text-xl sm:text-[22px] font-serif font-bold text-[#020618] leading-tight my-0">
                Find Your Perfect Franchise Match
              </h3>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                See which franchises fit your budget and have open territories near you.
              </p>
            </div>

            {/* Quiz Progress Header */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-start">
                <span className="px-2 py-0.5 bg-[#1642D0] text-white text-[10px] font-bold rounded-sm">
                  {currentQuiz.percentage}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1642D0] h-full rounded-full transition-all duration-300"
                  style={{ width: currentQuiz.percentage }}
                />
              </div>
            </div>

            {/* Step & Question */}
            <div className="text-center space-y-1 mb-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                STEP {currentQuiz.step}/5
              </div>
              <div className="text-sm font-bold text-[#020618] font-sans leading-snug">
                {currentQuiz.question}
              </div>
              <div className="text-[11px] text-slate-500 font-sans">
                Select one
              </div>
            </div>

            {/* Quiz Options */}
            <div className="space-y-2 mb-4">
              {currentQuiz.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full py-2 px-3 text-left rounded-md text-xs font-sans transition-all border cursor-pointer ${
                    selectedAnswers[currentStep] === opt
                      ? 'border-[#1642D0] bg-blue-50 text-[#1642D0] font-bold shadow-2xs'
                      : 'border-slate-300 text-slate-800 hover:border-[#1642D0] hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Reset / Status */}
            {currentStep > 1 && (
              <div className="text-center pt-1 border-t border-slate-100">
                <button
                  onClick={handleResetQuiz}
                  className="text-[11px] font-bold text-slate-500 hover:text-[#1642D0] transition-colors underline cursor-pointer"
                >
                  Reset Quiz
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
