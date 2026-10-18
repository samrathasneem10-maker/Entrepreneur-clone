'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { getTopicDataBySlug } from '@/data/newsData';

// 30 unique Industry articles for full 10-per-page pagination without duplicates
const INDUSTRY_ARTICLES = [
  // Page 1: Articles 1 - 10
  {
    id: 'future-of-work-trends-2025-beyond',
    category: 'INDUSTRY',
    title: 'The Future of Work: Trends Shaping 2025 and Beyond',
    excerpt: "From remote work to AI, here's what's changing the way we work and do business.",
    image: '/images/topic-thumb-1.jpg',
  },
  {
    id: 'how-technology-redefining-modern-business',
    category: 'INDUSTRY',
    title: 'How Technology Is Redefining Modern Business',
    excerpt: 'Innovation, automation and digital tools are creating new opportunities across industries.',
    image: '/images/topic-thumb-2.jpg',
  },
  {
    id: 'building-sustainable-tomorrow',
    category: 'INDUSTRY',
    title: 'Building a More Sustainable Tomorrow',
    excerpt: 'Businesses are rethinking their impact — for people, communities and the planet.',
    image: '/images/topic-thumb-3.jpg',
  },
  {
    id: 'mastering-capital-allocation-uncertainty',
    category: 'INDUSTRY',
    title: 'Mastering Capital Allocation in an Era of High Uncertainty',
    excerpt: 'Strategic investments and smart cash-flow management are separating market leaders from followers.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'rise-of-autonomous-ai-agents',
    category: 'INDUSTRY',
    title: 'The Rise of Autonomous AI Agents in Everyday Enterprise',
    excerpt: 'How automated workflows and next-generation intelligence tools are transforming operational velocity.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'scaling-culture-distributed-teams',
    category: 'INDUSTRY',
    title: 'Scaling Culture Across Distributed Global Teams',
    excerpt: 'Retaining core values and employee engagement when teammates are spread across multiple time zones.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'navigating-customer-trust-data-privacy',
    category: 'INDUSTRY',
    title: 'Navigating Customer Trust and Data Privacy in 2026',
    excerpt: 'Why brand transparency and bulletproof cybersecurity are crucial competitive differentiators today.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'resilient-supply-chains-vs-lean',
    category: 'INDUSTRY',
    title: 'Why Resilient Supply Chains Beat Lean Supply Chains',
    excerpt: 'Agility and supplier diversification now outweigh razor-thin cost-efficiency in global logistics.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'new-rules-of-b2b-product-marketing',
    category: 'INDUSTRY',
    title: 'The New Rules of B2B Product Marketing',
    excerpt: 'Direct customer engagement, video-first demonstrations, and community-driven expansion strategies.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'building-high-velocity-leadership',
    category: 'INDUSTRY',
    title: 'Building High-Velocity Leadership In Competitive Markets',
    excerpt: 'How decisive leadership frameworks enable rapid iteration without sacrificing long-term vision.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=300&auto=format&fit=crop',
  },

  // Page 2: Articles 11 - 20
  {
    id: 'ai-driven-decision-making-executives',
    category: 'INDUSTRY',
    title: 'How AI-Driven Decision Making Is Reshaping Executive Strategy',
    excerpt: 'Forward-thinking leaders are embedding generative predictive models into their core quarterly planning.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'bootstrapping-to-eight-figures',
    category: 'INDUSTRY',
    title: 'Bootstrapping to Eight Figures: Proven Tactics from Solo Founders',
    excerpt: 'How hyper-focused niche targeting and disciplined cost containment replace external venture capital.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'retention-over-acquisition-growth',
    category: 'INDUSTRY',
    title: 'Why Retention Beats Customer Acquisition in Turbulent Markets',
    excerpt: 'Deep customer relationships and recurring value delivery outlast volatile digital ad acquisition costs.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'future-of-fintech-cross-border',
    category: 'INDUSTRY',
    title: 'The Next Frontier of FinTech: Seamless Cross-Border Commerce',
    excerpt: 'Instant settlement networks and decentralized protocols are democratizing global trade for small businesses.',
    image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'designing-products-customers-love',
    category: 'INDUSTRY',
    title: 'Designing Products That Solve Real Everyday Problems',
    excerpt: 'User intuition, iterative prototyping, and ruthless feature pruning create enduring brand loyalty.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'hybrid-workplace-productivity-secrets',
    category: 'INDUSTRY',
    title: 'The Operating Rhythm Behind High-Performing Hybrid Teams',
    excerpt: 'Asynchronous communication standards and objective-based milestones eliminate endless calendar fatigue.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'managing-cash-burn-startup-growth',
    category: 'INDUSTRY',
    title: 'Managing Burn Rate and Cash Runway for Early-Stage Startups',
    excerpt: 'Prudent budgeting frameworks that preserve optionality without starving high-growth product initiatives.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'building-a-defensible-moat-ai-era',
    category: 'INDUSTRY',
    title: 'How Modern Companies Build Defensible Moats in the AI Era',
    excerpt: 'Proprietary workflows, specialized domain datasets, and network effects protect margins from commoditization.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'customer-led-growth-playbook',
    category: 'INDUSTRY',
    title: 'The Customer-Led Growth Playbook: Turning Users into Advocates',
    excerpt: 'Organic referral loops and customer advisory boards drive resilient net revenue retention.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'unlocking-operational-efficiency',
    category: 'INDUSTRY',
    title: 'Unlocking Operational Efficiency Through Smart System Automation',
    excerpt: 'Eliminating manual data transfer between disconnected tools multiplies workforce leverage ten-fold.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop',
  },

  // Page 3: Articles 21 - 30
  {
    id: 'navigating-venture-capital-2026',
    category: 'INDUSTRY',
    title: 'What Venture Capitalists Are Actually Funding in 2026',
    excerpt: 'Strong unit economics, rapid payback periods, and capital-efficient business models take center stage.',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'crisis-management-for-modern-ceos',
    category: 'INDUSTRY',
    title: 'Modern Crisis Management: Leading Transparently Under Pressure',
    excerpt: 'Proactive communication protocols and decisive leadership maintain stakeholder confidence during disruption.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'cybersecurity-essentials-small-business',
    category: 'INDUSTRY',
    title: 'Essential Cybersecurity Protocols Every Growing Company Needs',
    excerpt: 'Practical zero-trust architectures and employee training modules that thwart modern cyber vulnerabilities.',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'psychology-of-high-converting-sales',
    category: 'INDUSTRY',
    title: 'The Behavioral Psychology Behind Consistent High-Ticket Sales',
    excerpt: 'Understanding prospect risk aversion and aligning consultative messaging with core business pain points.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'talent-acquisition-competitive-landscapes',
    category: 'INDUSTRY',
    title: 'How Top Startups Attract World-Class Talent Without Big-Tech Budgets',
    excerpt: 'Mission clarity, flexible autonomy, and meaningful equity ownership outcompete corporate perks.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'leveraging-data-analytics-growth',
    category: 'INDUSTRY',
    title: 'Turning Complex Raw Data into Actionable Business Intelligence',
    excerpt: 'Building lean dashboard architectures that surface the three metrics that truly move the needle.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'future-of-green-energy-investing',
    category: 'INDUSTRY',
    title: 'Clean Energy Innovations Creating New Commercial Opportunities',
    excerpt: 'Decentralized microgrids, commercial solar, and next-gen storage technologies open lucrative markets.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'creating-scalable-partner-ecosystems',
    category: 'INDUSTRY',
    title: 'Building High-Yield Strategic Partner Ecosystems from Scratch',
    excerpt: 'Co-marketing arrangements and technology integrations that drive mutual, non-linear pipeline expansion.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'brand-storytelling-crowded-marketplaces',
    category: 'INDUSTRY',
    title: 'The Art of Distinctive Brand Storytelling in Saturated Niches',
    excerpt: 'Why authentic perspective, contrarian positioning, and founder transparency break through the noise.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'next-decade-global-ecommerce',
    category: 'INDUSTRY',
    title: 'Emerging Consumer Habits Shaping the Future of Global E-Commerce',
    excerpt: 'Social commerce, personalized curation, and same-day delivery expectations reshape retail economics.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=300&auto=format&fit=crop',
  },
];

export default function DynamicTopicPage() {
  const params = useParams();
  const rawSlug = typeof params?.slug === 'string' ? params.slug : 'thought-leaders';
  const topicData = getTopicDataBySlug(rawSlug);

  // Pagination state: 10 articles per page
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 10;
  const totalPages = Math.ceil(INDUSTRY_ARTICLES.length / ARTICLES_PER_PAGE);

  // Sliced articles for the active page (no duplicate articles between pages)
  const currentArticles = INDUSTRY_ARTICLES.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* 1. Header Navigation */}
      <Header />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80 py-2.5 px-5 lg:px-10 text-xs text-slate-600 font-sans">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-[#1642D0] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold uppercase tracking-wider">
            {topicData.title || 'THOUGHT LEADERS'}
          </span>
        </div>
      </div>

      {/* 1st Top Advertisement Banner: Reduced size */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pt-4 pb-4 sm:pt-5 sm:pb-5 text-center">
        <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400 block mb-1.5">
          ADVERTISEMENT
        </span>
        <div className="w-full max-w-[728px] mx-auto min-h-[90px] bg-[#edf2f7] border border-slate-300 shadow-2xs flex flex-col items-center justify-center py-3.5 px-4 text-center">
          <span className="text-xs font-semibold text-slate-600 font-sans">
            Leaderboard Banner 728 × 90
          </span>
          <span className="text-[11px] text-slate-400 font-sans mt-0.5">
            Your Advertisement Here
          </span>
        </div>
      </div>

      {/* Main Hero Story: Full width image + THOUGHT LEADERS + Full length bold heading + Natural full width summary */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pb-8">
        {/* Full width hero image matching Image 3 */}
        <div className="w-full overflow-hidden bg-slate-100">
          <img
            src="/images/topic-hero-leaders.jpg"
            alt="How Great Leaders Build Teams That Thrive"
            className="w-full h-auto max-h-[460px] object-cover"
          />
        </div>

        {/* Story details */}
        <div className="pt-4">
          <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans block mb-1">
            THOUGHT LEADERS
          </span>

          {/* Full length bold heading matching Image 2 */}
          <h1 className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-serif font-bold text-[#020618] leading-[1.18] tracking-tight my-2">
            How Great Leaders Build Teams That Thrive
          </h1>

          {/* Natural full-width continuous summary matching user requirement */}
          <p className="font-serif text-slate-600 sm:text-slate-700 text-base sm:text-lg lg:text-[18.5px] leading-relaxed mt-2.5 my-0 w-full">
            Strong leadership isn&apos;t just about making decisions — it&apos;s about creating an environment where people can grow, contribute and succeed.
          </p>
        </div>
      </div>

      {/* 2-Column Sub-Featured Cards matching Image 2 */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Card 1 */}
          <article className="group flex flex-col items-start text-left w-full">
            <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 mb-3.5">
              <img
                src="/images/topic-sub-1.jpg"
                alt="The Power of Effective Communication in Leadership"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans mb-1.5 block">
              THOUGHT LEADERS
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg lg:text-[19px] xl:text-[20px] text-[#020618] leading-snug group-hover:underline decoration-1 underline-offset-2 my-1.5 md:min-h-[30px] lg:min-h-[30px] flex items-center">
              <Link href="/article/power-of-effective-communication-leadership">
                The Power of Effective Communication in Leadership
              </Link>
            </h2>
            <p className="font-serif text-slate-600 text-xs sm:text-[13.5px] lg:text-[14px] leading-relaxed mt-2 my-0 w-full">
              Great leaders don&apos;t just give direction — they listen, inspire and bring people together.
            </p>
          </article>

          {/* Card 2 */}
          <article className="group flex flex-col items-start text-left w-full">
            <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 mb-3.5">
              <img
                src="/images/topic-sub-2.jpg"
                alt="Collaboration Drives Innovation and Growth"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
            </div>
            <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans mb-1.5 block">
              THOUGHT LEADERS
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg lg:text-[19px] xl:text-[20px] text-[#020618] leading-snug group-hover:underline decoration-1 underline-offset-2 my-1.5 md:min-h-[30px] lg:min-h-[30px] flex items-center">
              <Link href="/article/collaboration-drives-innovation-growth">
                Collaboration Drives Innovation and Growth
              </Link>
            </h2>
            <p className="font-serif text-slate-600 text-xs sm:text-[13.5px] lg:text-[14px] leading-relaxed mt-2 my-0 w-full">
              When great minds work together, new ideas turn into real progress.
            </p>
          </article>
        </div>
      </div>

      {/* Bottom Section: Left Stream (10 Articles per page + NEXT/PREVIOUS Controls) & Right Sidebar (Large Ad + Laptop Image) */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Bordered box with 10 articles per page */}
          <div id="articles-list-section" className="lg:col-span-7 bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs">
            <div className="space-y-6 divide-y divide-slate-100">
              {currentArticles.map((art, index) => (
                <article
                  key={art.id}
                  className={`flex gap-4 sm:gap-5 items-start ${index === 0 ? 'pt-0' : 'pt-6'}`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden bg-slate-100">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-[#1642D0] uppercase tracking-wider font-sans block mb-1">
                      {art.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#020618] leading-snug hover:underline my-1">
                      <Link href={`/article/${art.id}`}>
                        {art.title}
                      </Link>
                    </h3>
                    <p className="font-serif text-slate-600 text-xs sm:text-[12.5px] leading-relaxed line-clamp-2 my-0">
                      {art.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls matching exact user specification:
                - No numbered buttons, no page number "10"
                - On page 1: show ONLY NEXT →
                - On subsequent pages: show ← PREVIOUS and NEXT → (if more articles exist)
                - On last page: NEXT → is hidden
                - Clean, centered below article list
            */}
            <div className="flex items-center justify-center gap-4 pt-8 mt-6 border-t border-slate-100 font-sans text-xs sm:text-[13px] font-bold">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    const el = document.getElementById('articles-list-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-[#1642D0] hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-bold select-none"
                  aria-label="Previous articles"
                >
                  <span className="text-base leading-none">&larr;</span>
                  <span>PREVIOUS</span>
                </button>
              )}

              {currentPage < totalPages && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    const el = document.getElementById('articles-list-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-[#1642D0] hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-bold select-none"
                  aria-label="Next articles"
                >
                  <span>NEXT</span>
                  <span className="text-base leading-none">&rarr;</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar with 2 Advertisements (Articles 1-5 & Articles 6-9) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1st Sidebar Advertisement: Decreased size from Article 1 to 5, outside top advertisement */}
            <div className="w-full text-center">
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400 block mb-2">
                ADVERTISEMENT
              </span>
              <div className="w-full min-h-[480px] md:min-h-[540px] lg:min-h-[580px] bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-center p-6 text-center shadow-2xs">
                <span className="text-xs font-semibold text-slate-600 font-sans">
                  300 × 600 Half Page Banner
                </span>
                <span className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Your Advertisement Here
                </span>
              </div>
            </div>

            {/* 2nd Sidebar Advertisement: Starts after 1st ad with small gap, spans until 9th article, outside top advertisement */}
            <div className="w-full text-center">
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400 block mb-2">
                ADVERTISEMENT
              </span>
              <div className="w-full min-h-[460px] md:min-h-[500px] lg:min-h-[550px] bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-center p-6 text-center shadow-2xs">
                <span className="text-xs font-semibold text-slate-600 font-sans">
                  300 × 250 Medium Rectangle
                </span>
                <span className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Your Advertisement Here
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Footer Navigation */}
      <Footer />
    </div>
  );
}
