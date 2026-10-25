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
import { ShortsReelsSection } from '@/sections/ShortsReelsSection';
import { InterviewsOpinionsSection } from '@/sections/InterviewsOpinionsSection';
import { CompanyProfilesSection } from '@/sections/CompanyProfilesSection';
import { EnergyCommoditiesSection } from '@/sections/EnergyCommoditiesSection';
import { BusinessLegalAffairsSection } from '@/sections/BusinessLegalAffairsSection';
import { RetailEcommerceSection } from '@/sections/RetailEcommerceSection';
import { ResearchInsightsSection } from '@/sections/ResearchInsightsSection';
import { MarketingBrandingSection } from '@/sections/MarketingBrandingSection';

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

      {/* Main Page Body: efficiently utilizing screen width with tight, elegant margins */}
      <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Hero News Section */}
        <HeroNewsSection />

        {/* 2. Top Stories Featured Grid */}
        <FeaturedGridSection />

        {/* 3. Startups & Entrepreneurship Section */}
        <StartupsEntrepreneurshipSection />

        {/* 4. Economy & Public Policy Section */}
        <EconomyPublicPolicySection />

        {/* 5. Centered Advertisement Banner 1 */}
        <AdvertisementSection />

        {/* 6. Global Business Section */}
        <GlobalBusinessSection />

        {/* 7. Technology & Super Intelligence Section */}
        <TechnologySuperIntelligenceSection />

        {/* 8. Centered Advertisement Banner 2 */}
        <AdvertisementSection />

        {/* 9. Global Resilience & Trending News 01-05 */}
        <TrendingResilienceSection />

        {/* 10. Luxury & Lifestyle Section */}
        <LuxuryLifestyleSection />

        {/* 11. Shorts & Reels Section */}
        <ShortsReelsSection />

        {/* 12. Centered Advertisement Banner 3 */}
        <AdvertisementSection />

        {/* 13. Interviews & Opinions Section */}
        <InterviewsOpinionsSection />

        {/* 14. The Leaders | Company Profiles Section */}
        <CompanyProfilesSection />

        {/* 15. Energy & Commodities Section */}
        <EnergyCommoditiesSection />

        {/* 16. Business & Legal Affairs Section */}
        <BusinessLegalAffairsSection />

        {/* 17. Centered Advertisement Banner 4 */}
        <AdvertisementSection />

        {/* 18. Retail & E-commerce Section */}
        <RetailEcommerceSection />

        {/* 19. Research & Insights Section */}
        <ResearchInsightsSection />

        {/* 20. Marketing & Branding Section */}
        <MarketingBrandingSection />
      </main>

      {/* Expanded Multi-Column Footer */}
      <Footer />
    </div>
  );
}
