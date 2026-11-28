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
import { InterviewsOpinionsSection } from '@/sections/InterviewsOpinionsSection';
import { ShortsReelsSection } from '@/sections/ShortsReelsSection';
import { EnergyCommoditiesSection } from '@/sections/EnergyCommoditiesSection';
import { BusinessLegalAffairsSection } from '@/sections/BusinessLegalAffairsSection';
import { RetailEcommerceSection } from '@/sections/RetailEcommerceSection';
import { ResearchInsightsSection } from '@/sections/ResearchInsightsSection';
import { MarketingBrandingSection } from '@/sections/MarketingBrandingSection';
import { getHomepageArticlesFromDb } from '@/lib/homepageServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [data] = await Promise.all([
    getHomepageArticlesFromDb(),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Sticky Top Header Navigation */}
      <Header />

      {/* Main Page Body: aligned with navigation bar bounds */}
      <main className="flex-1 w-full max-w-[1400px] 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* 1. Hero News Section */}
        <HeroNewsSection
          initialLatest={data.heroLatest}
          initialSlides={data.heroSlides}
          initialRightCard={data.rightCard}
          initialRightStream={data.rightStream}
        />

        {/* 2. Top Stories Featured Grid */}
        <FeaturedGridSection initialArticles={data.featuredGrid} />

        {/* 3. Startups & Entrepreneurship Section */}
        <StartupsEntrepreneurshipSection
          initialFeatured={data.startupsFeatured}
          initialItems={data.startupsItems}
        />

        {/* 4. Economy & Public Policy Section */}
        <EconomyPublicPolicySection initialArticles={data.economyArticles} />

        {/* 5. Centered Advertisement Banner 1 */}
        <AdvertisementSection />

        {/* 6. Global Business Section */}
        <GlobalBusinessSection
          initialFeatured={data.globalFeatured}
          initialTopCards={data.globalTopCards}
          initialNumberedItems={data.globalNumberedItems}
        />

        {/* 7. Technology & Super Intelligence Section */}
        <TechnologySuperIntelligenceSection
          initialFeatured={data.techFeatured}
          initialLeftItems={data.techLeftItems}
          initialRightCards={data.techRightCards}
        />

        {/* 8. Centered Advertisement Banner 2 */}
        <AdvertisementSection />

        {/* 9. Global Resilience & Trending News 01-05 */}
        <TrendingResilienceSection
          initialFeatured={data.trendingFeatured}
          initialItems={data.trendingItems}
        />

        {/* 10. Luxury & Lifestyle Section */}
        <LuxuryLifestyleSection initialArticles={data.luxuryArticles} />

        {/* 11. Centered Advertisement Banner 3 */}
        <AdvertisementSection />

        {/* 12. Interviews & Opinions Section */}
        <InterviewsOpinionsSection initialArticles={data.interviewsArticles} />

        {/* 13. Shorts & Reels Section */}
        <ShortsReelsSection />

        {/* 14. Energy & Commodities Section */}
        <EnergyCommoditiesSection
          initialLead={data.energyLead}
          initialMiddle={data.energyMiddle}
          initialRight={data.energyRight}
        />

        {/* 15. Business & Legal Affairs Section */}
        <BusinessLegalAffairsSection initialArticles={data.businessLegalArticles} />

        {/* 16. Centered Advertisement Banner 4 */}
        <AdvertisementSection />

        {/* 17. Retail & E-commerce Section */}
        <RetailEcommerceSection initialArticles={data.retailArticles} />

        {/* 18. Research & Insights Section */}
        <ResearchInsightsSection initialArticles={data.researchArticles} />

        {/* 19. Marketing & Branding Section */}
        <MarketingBrandingSection initialArticles={data.marketingArticles} />
      </main>

      {/* Expanded Multi-Column Footer */}
      <Footer />
    </div>
  );
}
