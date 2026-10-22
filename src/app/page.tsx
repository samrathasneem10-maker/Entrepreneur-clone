import React from 'react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { HeroNewsSection } from '@/sections/HeroNewsSection';
import { FeaturedGridSection } from '@/sections/FeaturedGridSection';
import { StartupsEntrepreneurshipSection } from '@/sections/StartupsEntrepreneurshipSection';
import { EconomyPublicPolicySection } from '@/sections/EconomyPublicPolicySection';
import { AdvertisementSection } from '@/sections/AdvertisementSection';
import { GlobalBusinessSection } from '@/sections/GlobalBusinessSection';
import { TechnologySuperIntelligenceSection } from '@/sections/TechnologySuperIntelligenceSection';
import { TrendingResilienceSection } from '@/sections/TrendingResilienceSection';
import { LuxuryLifestyleSection } from '@/sections/LuxuryLifestyleSection';
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

      {/* Top Announcement Bar */}
      <div className="w-full bg-[#1642D0] py-2 px-4 text-center text-white text-xs sm:text-sm font-bold tracking-wide">
        <a href="#" className="hover:underline transition-colors">
          Turn Your Inbox Into a Growth Tool
        </a>
      </div>

      {/* Main Page Body: Decreased left/right empty space by using wider max-w and tighter padding */}
      <main className="flex-1 w-full max-w-[1460px] 2xl:max-w-[1560px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
        {/* 1. Hero News Section */}
        <HeroNewsSection />

        {/* 2. Top Stories Featured Grid */}
        <FeaturedGridSection />

        {/* 3. Startups & Entrepreneurship Section */}
        <StartupsEntrepreneurshipSection />

        {/* 4. Economy & Public Policy Section */}
        <EconomyPublicPolicySection />

        {/* 5. Centered Advertisement Banner Section */}
        <AdvertisementSection />

        {/* 6. Global Business Section (Uploaded Image 1) */}
        <GlobalBusinessSection />

        {/* 7. Technology & Super Intelligence Section (Uploaded Image 2) */}
        <TechnologySuperIntelligenceSection />

        {/* 8. Centered Advertisement Section (Uploaded Image 3) */}
        <AdvertisementSection />

        {/* 9. Global Resilience & Trending News 01-05 (Uploaded Image 4) */}
        <TrendingResilienceSection />

        {/* 10. Luxury & Lifestyle Section (Uploaded Image 5) */}
        <LuxuryLifestyleSection />

        {/* 11. Bottom Advertisement Banner (Uploaded Image 5 Bottom Ad Slot) */}
        <AdvertisementSection />

        {/* 12. Overcoming Impossible Live Section */}
        <OvercomingImpossibleSection />

        {/* 13. Side Hustle Section */}
        <SideHustleSection />

        {/* 14. Entrepreneurs Section */}
        <EntrepreneursSection />

        {/* 15. Transform Your Business with Agentic AI Section */}
        <TransformAISection />

        {/* 16. Franchises Main Section */}
        <FranchisesMainSection />

        {/* 17. Franchise Lists Section */}
        <FranchiseSection />

        {/* 18. Latest Videos Section */}
        <VideosSection />

        {/* 19. Categories Section */}
        <BusinessCategoryCards />

        {/* 20. Entrepreneur Magazine Showcase */}
        <MagazineSection />
      </main>

      {/* Expanded Multi-Column Footer */}
      <Footer />
    </div>
  );
}
