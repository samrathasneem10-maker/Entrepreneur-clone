'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';

interface AuthorProfile {
  name: string;
  role: string;
  badge: string;
  avatar: string;
  bio: string;
}

const AUTHORS_MAP: Record<string, AuthorProfile> = {
  'sherin-shibu': {
    name: 'Sherin Shibu',
    role: 'News Reporter',
    badge: 'Entrepreneur Staff',
    avatar: '/images/sherin-shibu.jpg',
    bio: 'Sherin Shibu is a business news reporter at Entrepreneur.com. She previously worked for PCMag, Business Insider, The Messenger, and ZDNET as a reporter and copyeditor. Her areas of coverage encompass tech, business, strategy, finance, and even space. She is a Columbia University graduate.',
  },
  'merilee-kern': {
    name: 'Sherin Shibu',
    role: 'News Reporter',
    badge: 'Entrepreneur Staff',
    avatar: '/images/sherin-shibu.jpg',
    bio: 'Sherin Shibu is a business news reporter at Entrepreneur.com. She previously worked for PCMag, Business Insider, The Messenger, and ZDNET as a reporter and copyeditor. Her areas of coverage encompass tech, business, strategy, finance, and even space. She is a Columbia University graduate.',
  },
  'rl-adams': {
    name: 'R.L. Adams',
    role: 'Contributing Writer',
    badge: 'Entrepreneur Staff',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    bio: 'R.L. Adams is a software engineer, serial entrepreneur, and bestselling author of dozens of books on online business, search engine optimization, and passive income generation.',
  },
};

// Exactly 25 authentic articles matching the 1-row-3-columns reference layout
const AUTHOR_ARTICLES_25 = [
  {
    id: 'childhood-sweethearts-product-new-parents',
    title: "These Childhood Sweethearts Created a Product for New Parents. It Made $500K in Revenue in Under 1 Minute: 'Orders Started to Roll In'",
    category: 'BUILDING A BUSINESS',
    excerpt: "In one of their early preorders, they sold thousands of units in under a minute — here's how they got there.",
    imageUrl: '/images/author-article-1.jpg',
  },
  {
    id: 'amazons-groundbreaking-new-ai-devices',
    title: "Here's What Amazon's Groundbreaking New AI Devices Can Do",
    category: 'BUSINESS NEWS',
    excerpt: 'Amazon is offering two new Bee AI devices: the Frontier and Eclipse.',
    imageUrl: '/images/author-article-2.jpg',
  },
  {
    id: 'anthropic-president-terrible-use-of-ai',
    title: "Anthropic President Says This Is 'a Terrible Use of AI.' Nearly 30% of U.S. Adults Are Doing It Anyway.",
    category: 'BUSINESS NEWS',
    excerpt: 'Anthropic co-founder and president Daniela Amodei is advising users not to use AI for this purpose.',
    imageUrl: '/images/author-article-3.jpg',
  },
  {
    id: 'robinhood-democratizing-finance-retail-traders',
    title: 'Robinhood CEO on Democratizing High Finance for the Next Generation of Retail Traders',
    category: 'FINTECH',
    excerpt: "How zero-commission trading and tokenized real-world assets are reshaping Wall Street's century-old market structure.",
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'corporate-holiday-gifts-employees-actually-want',
    title: 'The Best Corporate Holiday Gifts That Employees and Clients Actually Want in 2026',
    category: 'GROWTH STRATEGIES',
    excerpt: 'Ditch the branded trinkets — curated artisan gift bundles and wellness memberships lead the trend this season.',
    imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'how-venture-studios-are-revolutionizing-seed-funding',
    title: 'How Venture Studios Are Revolutionizing the Seed-Stage Funding Ecosystem',
    category: 'VENTURE CAPITAL',
    excerpt: 'Institutional backing paired with day-zero operational co-founders cuts early startup failure rates in half.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'top-5-etf-strategies-preserving-capital',
    title: 'The Top 5 ETF Strategies for Preserving Capital in a Volatile Yield Environment',
    category: 'ETFS',
    excerpt: 'Financial advisors share portfolio diversification frameworks designed to protect wealth while maintaining liquidity.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'fortune-500-retailer-beats-q2-earnings',
    title: 'Fortune 500 Retailer Beats Q2 Earnings Estimates on Strong Digital Sales',
    category: 'QUARTERLY EARNINGS',
    excerpt: 'Automated fulfillment centers and omnichannel loyalty initiatives drove 18% net profit margin expansion.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'fintech-startup-cross-border-settlement',
    title: 'FinTech Startup Unveils Real-Time B2B Cross-Border Settlement Infrastructure',
    category: 'FINTECH',
    excerpt: 'Eliminating legacy correspondent banking delays cuts international wire settlement times from days to seconds.',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'whos-going-to-give-you-business-home-inspector',
    title: "She Was Told 'Who's Going to Give You Business?' Now She's a Top Home Inspector in Brooklyn",
    category: 'BUYING A FRANCHISE',
    excerpt: 'Overcoming industry skepticism, this founder built a high-margin property inspection franchise.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'deep-water-port-modernization-projects',
    title: 'Deep-Water Port Modernization Projects Clear Bottlenecks for Transpacific Freighters',
    category: 'LOGISTICS',
    excerpt: 'Automated gantry cranes and AI container tracking double container turnaround speeds.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'inclusive-leadership-practices-drive-performance',
    title: 'Inclusive Leadership Practices That Drive High Performance and Employee Engagement',
    category: 'LEADERSHIP',
    excerpt: 'Fostering diverse perspectives across project boards leads to better risk management and product design.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'compostable-packaging-innovations-consumer-goods',
    title: 'Compostable Packaging Innovations Replace Single-Use Plastics in Consumer Goods',
    category: 'SUSTAINABLE PACKAGING',
    excerpt: 'Plant-derived polymers provide durable protective barriers while meeting rigid municipal composting guidelines.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'bootstrapped-unicorn-mailchimp-700m-revenue',
    title: 'The Bootstrapped Unicorn: How Mailchimp Hit $700M Revenue Before Acquisition',
    category: 'COMPANY PROFILES',
    excerpt: 'Freemium email marketing, iconic brand voice, and focus on small business owners created immense equity.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'nvidia-ceo-jensen-huang-ai-hype',
    title: "Nvidia CEO Jensen Huang Says AI Hype Is Fueling Fear: 'We're Scaring People'",
    category: 'LEADERSHIP INSIGHTS',
    excerpt: 'Huang urged caution in how AI leaders speak about the technology as capability curves accelerate across industries.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'commercial-real-estate-suburban-office-demand',
    title: 'Commercial Real Estate Forecast: Suburban Office Demand Outpaces Urban Core Properties',
    category: 'PROPERTY ANALYTICS',
    excerpt: 'Hybrid workforce trends drive leasing growth in suburban office parks offering ample parking and green space.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'former-engineer-preschool-teacher-franchise',
    title: "This Former Engineer and Preschool Teacher Teamed Up to Start a Creative Business: 'Haven't Regretted Choosing a Franchise.'",
    category: 'BUYING A FRANCHISE',
    excerpt: 'How two entrepreneurs turned community passion into a high-growth franchise across three states.',
    imageUrl: '/images/daves-hot-chicken.jpg',
  },
  {
    id: 'side-hustle-ideas-extra-money-2026',
    title: '53 Side Hustle Ideas to Make Extra Money in 2026',
    category: 'THOUGHT LEADERS',
    excerpt: 'From online freelancing to automated digital products, discover proven paths to supplemental income.',
    imageUrl: '/images/side-hustle-53.jpg',
  },
  {
    id: 'generative-ai-in-legal-tech',
    title: 'Generative AI in Legal Tech: Transforming Document Discovery and Compliance Audits',
    category: 'LEGAL TECH',
    excerpt: 'Boutique law firms leverage specialized LLMs to reduce due diligence review hours by over 60%.',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'micro-influencers-3x-higher-conversion',
    title: 'Why Micro-Influencers Deliver 3x Higher Conversion Rates for Direct-to-Consumer Brands',
    category: 'MARKETING STRATEGY',
    excerpt: 'Niche authenticity, tightly engaged communities, and cost-effective affiliate structures drive measurable ROI.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'cybersecurity-insurance-requirements-smbs',
    title: 'How Cybersecurity Insurance Requirements Are Forcing SMBs to Upgrade Defense Posture',
    category: 'CYBERSECURITY',
    excerpt: 'Underwriters now mandate multi-factor authentication, endpoint detection, and regular employee phishing tests.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'creator-economy-evolves-first-party-audience',
    title: 'The Creator Economy Evolves: Subscriptions, Memberships, and Owning Your First-Party Audience',
    category: 'CREATOR BUSINESS',
    excerpt: 'Creators pivot away from erratic platform algorithms to build sustainable direct subscriber revenue streams.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'clean-energy-startups-high-interest-rates',
    title: 'How Clean Energy Startups Are Navigating High Interest Rates and Grid Interconnection Delays',
    category: 'CLEAN ENERGY',
    excerpt: 'Distributed solar-plus-storage models gain traction as utility-scale developers wait years for substation capacity.',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'mastering-the-hybrid-workplace-deep-work',
    title: 'Mastering the Hybrid Workplace: Asynchronous Communication and Deep Work Culture',
    category: 'WORKPLACE PRODUCTIVITY',
    excerpt: 'Leading tech organizations cut recurring status meetings in half to empower engineers with uninterrupted focus.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'global-supply-chain-resilience-nearshoring',
    title: 'Global Supply Chain Resilience: Nearshoring Manufacturing Back to North America',
    category: 'SUPPLY CHAIN',
    excerpt: 'Industrial automation, shortened maritime transit times, and tax incentives make regionalized manufacturing competitive.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
  },
];

export default function AuthorProfilePage() {
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const rawSlug = params?.slug as string | undefined;
  const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || 'sherin-shibu';

  const author = AUTHORS_MAP[slug] || AUTHORS_MAP['sherin-shibu'];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Navigation Header */}
      <Header />

      {/* TOP AUTHOR PROFILE SECTION - EXACT MATCH TO IMAGE 1 */}
      <section className="bg-white pt-10 pb-4 md:pt-14 md:pb-6 px-5 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 md:gap-12">
            {/* Author Avatar: Clean circle without border matching Image 1 */}
            <div className="shrink-0">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover shadow-2xs"
              />
            </div>

            {/* Author Details matching Image 1 */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              {/* Author Name */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-black text-[#020618] leading-[1.1] tracking-tight my-0">
                {author.name}
              </h1>

              {/* Author Role */}
              <p className="text-sm sm:text-[15px] font-sans text-slate-500 font-normal mt-1.5 mb-2">
                {author.role}
              </p>

              {/* Staff / Contributor Badge matching Image 1 */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 mb-3 text-[#047857]">
                <svg
                  className="w-4 h-4 text-[#047857] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l2.4 2.4 3.4-.4 1.4 3.1 3.1 1.4-.4 3.4 2.4 2.4-2.4 2.4.4 3.4-3.1 1.4-1.4 3.1-3.4-.4-2.4 2.4-2.4-2.4-3.4.4-1.4-3.1-3.1-1.4.4-3.4-2.4-2.4 2.4-2.4-.4-3.4 3.1-1.4 1.4-3.1 3.4.4z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span className="font-serif font-bold text-xs sm:text-[13px] text-[#047857] tracking-tight">
                  {author.badge}
                </span>
              </div>

              {/* Author Bio matching Image 1 */}
              <p className="font-serif text-slate-700 text-sm sm:text-[15px] leading-relaxed max-w-2xl my-0">
                {author.bio}
              </p>

              {/* Callout Box matching Image 1 */}
              <div className="mt-5 inline-block bg-[#f0f5ff] rounded-lg px-4 sm:px-5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-blue-100/60">
                <p className="font-serif text-xs sm:text-[13.5px] text-slate-700 my-0">
                  Want to write for Entrepreneur too?{' '}
                  <Link
                    href="/newsletters"
                    className="font-serif font-bold text-[#1642D0] hover:underline"
                  >
                    Apply to join Entrepreneur Leadership network.
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Clean Horizontal Divider Line separating profile from stream */}
          <div className="border-b border-slate-200 mt-8 md:mt-10" />
        </div>
      </section>

      {/* ARTICLES STREAM - EXACT MATCH TO REFERENCE SCREENSHOT (1 ROW 3 COLUMNS, TOTAL 25) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 py-6 md:py-10">
        {/* Section Headline matching screenshot */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-black text-[#020618] tracking-tight my-0">
            More From {author.name}
          </h2>
        </div>

        {/* 1 Row 3 Columns Grid for 25 Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {AUTHOR_ARTICLES_25.map((art) => (
            <article key={art.id} className="group flex flex-col items-start text-left">
              {/* Card Image */}
              <div className="w-full aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 mb-3.5">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-xl"
                />
              </div>

              {/* Card Category */}
              <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans mb-1.5 block">
                {art.category}
              </span>

              {/* Card Title */}
              <h3 className="font-serif font-bold text-base sm:text-[18px] text-[#020618] leading-snug group-hover:underline decoration-1 underline-offset-2 my-0">
                <Link href={`/article/${art.id}`}>{art.title}</Link>
              </h3>

              {/* Card Excerpt */}
              {art.excerpt && (
                <p className="font-serif text-slate-600 text-xs sm:text-[13.5px] leading-relaxed line-clamp-3 mt-2 my-0">
                  {art.excerpt}
                </p>
              )}
            </article>
          ))}
        </div>

        {/* Clean Website Footer Note */}
        <div className="mt-14 pt-8 border-t border-slate-200 text-center">
          <p className="text-xs font-sans text-slate-400 uppercase tracking-widest my-0">
            Showing all 25 articles by {author.name}
          </p>
        </div>
      </main>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}
