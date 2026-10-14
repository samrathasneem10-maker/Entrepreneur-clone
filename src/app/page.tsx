import React from 'react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { HeroNewsSection } from '@/sections/HeroNewsSection';
import { FeaturedGridSection } from '@/sections/FeaturedGridSection';
import { OvercomingImpossibleSection } from '@/sections/OvercomingImpossibleSection';
import { SideHustleSection } from '@/sections/SideHustleSection';
import { EntrepreneursSection } from '@/sections/EntrepreneursSection';
import { TransformAISection } from '@/sections/TransformAISection';
import { FranchisesMainSection } from '@/sections/FranchisesMainSection';
import { FranchiseSection } from '@/sections/FranchiseSection';
import { VideosSection } from '@/sections/VideosSection';
import { BusinessCategoryCards } from '@/sections/BusinessCategoryCards';
import { MagazineSection } from '@/sections/MagazineSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Sticky Top Header Navigation */}
      <Header />

      {/* Top Announcement Bar (matching Image 1 & 2) */}
      <div className="w-full bg-[#1642D0] py-2 px-4 text-center text-white text-xs sm:text-sm font-bold tracking-wide">
        <a href="#" className="hover:underline transition-colors">
          Turn Your Inbox Into a Growth Tool
        </a>
      </div>

      {/* Main Page Body: increased width to match entrepreneur.com reference layout */}
      <main className="flex-1 w-full max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Hero News Section */}
        <HeroNewsSection />

        {/* 2. Top Stories Featured Grid */}
        <FeaturedGridSection />

        {/* 3. Overcoming Impossible Live Section */}
        <OvercomingImpossibleSection />

        {/* 4. Side Hustle Section (with Entrepreneur Newsletters widget) */}
        <SideHustleSection />

        {/* 4. Entrepreneurs Section */}
        <EntrepreneursSection />

        {/* 5. Transform Your Business with Agentic AI Section */}
        <TransformAISection />

        {/* 6. Franchises Main Section (Task 1: Screenshot 1) */}
        <FranchisesMainSection />

        {/* 7. Franchise Lists Section */}
        <FranchiseSection />

        {/* 8. Latest Videos Section (Task 2 & 3: Screenshot 2) */}
        <VideosSection />

        {/* 9. Categories Section (Task 4: Screenshot 3 & 4) */}
        <BusinessCategoryCards />

        {/* 10. Entrepreneur Magazine Showcase (Task 5: Screenshot 5) */}
        <MagazineSection />
      </main>

      {/* Expanded Multi-Column Footer */}
      <Footer />
    </div>
  );
}
