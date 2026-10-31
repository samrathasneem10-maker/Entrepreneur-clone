'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { getArticleUrl } from '@/data/newsData';

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
  'dean-guida': {
    name: 'Dean Guida',
    role: 'Contributor & Tech CEO',
    badge: 'Entrepreneur Leadership Network Contributor',
    avatar: '/images/more-author-1.jpg',
    bio: "Dean Guida is the founder and CEO of Infragistics, a global software company providing tools and solutions to accelerate application design and development. He is the author of 'When Grit Is Not Enough'.",
  },
  'ben-angel': {
    name: 'Ben Angel',
    role: 'Bestselling Author & Contributor',
    badge: 'Entrepreneur Network Contributor',
    avatar: '/images/more-author-2.jpg',
    bio: "Ben Angel is the author of 'Unstoppable: A 90-Day Plan to Biohack Your Mind and Body for Success'. He has helped thousands of entrepreneurs maximize their cognitive performance and productivity.",
  },
  'rob-aquino': {
    name: 'Rob Aquino',
    role: 'CEO & Business Strategist',
    badge: 'Entrepreneur Leadership Network Contributor',
    avatar: '/images/more-author-3.jpg',
    bio: 'Rob Aquino is the CEO of JBS Corp, specializing in corporate strategy, organizational scaling, and executive leadership development across growth-stage enterprises.',
  },
  'molly-cavanah': {
    name: 'Molly Cavanah',
    role: 'Growth Executive & Analyst',
    badge: 'Entrepreneur Leadership Network Contributor',
    avatar: '/images/more-author-4.jpg',
    bio: 'Molly Cavanah is a seasoned growth executive with extensive experience leading revenue operations, user acquisition, and predictive data analytics for venture-backed tech companies.',
  },
  'rl-adams': {
    name: 'R.L. Adams',
    role: 'Contributing Writer',
    badge: 'Entrepreneur Staff',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    bio: 'R.L. Adams is a software engineer, serial entrepreneur, and bestselling author of dozens of books on online business, search engine optimization, and passive income generation.',
  },
};

// PAGE 1: 24 articles in complete 3-column rows, with the final row matching Image 1 exactly
const PAGE_1_ARTICLES = [
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
  // FINAL ROW OF PAGE 1: EXACT MATCH TO IMAGE 1
  {
    id: 'workers-managing-ai-bots-no-manager-pay',
    title: 'Workers Are Managing AI Bots — Without Getting Manager Pay',
    category: 'BUSINESS NEWS',
    excerpt: 'A new report reveals that more workers than ever are managing AI bots without a raise or title change.',
    imageUrl: '/images/final-article-1.jpg',
  },
  {
    id: 'is-chatgpt-dulling-your-brain-studies',
    title: 'Is ChatGPT Dulling Your Brain? New Studies Raise Alarming Questions.',
    category: 'BUSINESS NEWS',
    excerpt: 'Psychologists say generative tools can weaken attention and problem-solving.',
    imageUrl: '/images/final-article-2.jpg',
  },
  {
    id: 'arrogant-leader-bought-6-businesses-lost-them-all',
    title: "This Self-Described 'Arrogant' Leader Bought 6 Businesses for $3 Million and Lost Them All. Here's What She Learned and How She Got Back on Track.",
    category: 'BUYING A FRANCHISE',
    excerpt: 'The experience fundamentally changed the way she thought about business.',
    imageUrl: '/images/final-article-3.jpg',
  },
];

// PAGE 2: 24 fresh articles
const PAGE_2_ARTICLES = [
  {
    id: 'anthropic-4b-scale-frontier-ai-models',
    title: 'Anthropic Raises $4 Billion to Scale Frontier AI Reasoning Models',
    category: 'ARTIFICIAL INTELLIGENCE',
    excerpt: 'The Claude creator expands cloud partnerships and enterprise inference infrastructure to meet surging commercial demand.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'dorm-side-hustle-80m-brand',
    title: 'How a 26-Year-Old Turned a College Dorm Side Hustle into an $80M Brand',
    category: 'YOUNG ENTREPRENEURS',
    excerpt: 'Leveraging organic TikTok viral loops and agile supply chain logistics to outpace legacy retail competitors.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'fed-interest-rate-cuts-small-business-loans',
    title: 'The Fed Hints at Rate Cuts: What It Means for Small Business Loans and Credit Lines',
    category: 'MONEY & FINANCE',
    excerpt: 'Lower borrowing benchmarks could unlock deferred expansion capital for manufacturing and franchise operators.',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'ditching-unlimited-pto-mandatory-minimum',
    title: 'Why Top Tech Companies Are Ditching Unlimited PTO for Mandatory Minimum Leave',
    category: 'WORKPLACE CULTURE',
    excerpt: 'Data indicates employees take less time off under open-ended policies, driving burnout and attrition.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'bootstrapping-saas-10m-arr-lessons',
    title: '5 Non-Obvious Lessons from Bootstrapping a B2B SaaS to $10M ARR Without VC Money',
    category: 'GROWTH HACKS',
    excerpt: 'Focusing on negative net churn, high average revenue per user, and founder-led sales built durability.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'quiet-luxury-boutique-hotels-hospitality',
    title: 'The Rise of Quiet Luxury in Hospitality: Boutique Hotels Outperforming Megachains',
    category: 'TRAVEL & LEISURE',
    excerpt: 'Personalized wellness concierge services and localized culinary partnerships command premium room rates.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'valuing-digital-media-businesses-algorithmic-era',
    title: 'How to Value a Digital Media Business in the Era of Algorithmic Turbulence',
    category: 'VALUATIONS',
    excerpt: 'First-party newsletter subscriber retention and owned event revenue now drive higher multiples than pageviews.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'sam-altman-unveils-chatgpt-voice-advances',
    title: 'Sam Altman Unveils Next-Gen ChatGPT Voice Capabilities at Global DevDay',
    category: 'TECH INNOVATION',
    excerpt: 'Sub-300 millisecond conversational latency and emotive tone modulation bridge human-machine interaction.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'former-barista-gourmet-oat-milk-empire',
    title: 'This Former Barista Founded a Gourmet Oat Milk Empire Valued at $120M',
    category: 'FOOD & BEVERAGE',
    excerpt: 'Specialty cafe wholesale distribution created grassroots consumer demand before national supermarket rollouts.',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'real-estate-crowdfunding-vs-reits',
    title: 'Real Estate Crowdfunding vs REITs: Which Yields Better Risk-Adjusted Returns?',
    category: 'INVESTING',
    excerpt: 'Comparing illiquid direct property equity stakes against publicly traded real estate investment trusts.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'b2b-founders-podcast-marketing-budgets',
    title: 'Why B2B Founders Are Spending 50% of Their Marketing Budget on Niche Podcasts',
    category: 'B2B MARKETING',
    excerpt: 'Intimate host endorsements and extended format technical discussions yield superior enterprise sales pipeline.',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'ev-charging-infrastructure-next-unicorns',
    title: 'Electric Vehicle Charging Infrastructure: Where the Next Energy Unicorns Will Be Built',
    category: 'CLEAN ENERGY',
    excerpt: 'Megawatt-level commercial fleet depot chargers outpace consumer curbside installations in profitability.',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'protect-brand-ip-against-ai-scraping',
    title: 'How to Protect Your Brand IP Against AI Scraping and Synthetic Replicas',
    category: 'LEGAL & IP',
    excerpt: 'Legal frameworks, technical watermarking, and active litigation strategies for modern digital creators.',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'high-retention-subscription-box-commerce',
    title: 'The Secrets of High-Retention Subscription Box Commerce in 2026',
    category: 'ECOMMERCE',
    excerpt: 'Predictive restocking customization and exclusive subscriber community perks drive sub-2% monthly churn.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'top-vcs-seed-pitch-decks-today',
    title: 'What Top Venture Capitalists Look for in Seed Pitch Decks Today',
    category: 'STARTUP FUNDING',
    excerpt: 'Clear unit economics, early customer validation signals, and proprietary data moats replace generic TAM claims.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'autonomous-drone-delivery-last-mile-logistics',
    title: 'How Autonomous Drone Delivery is Slashing Last-Mile Logistics Costs in Suburban Corridors',
    category: 'TRANSPORTATION',
    excerpt: 'Regulatory approvals and automated battery-swapping stations make 15-minute package drops economically viable.',
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'price-anchoring-psychology-charge-more',
    title: 'The Psychology of Price Anchoring: How to Charge 3x More with Confidence',
    category: 'SALES STRATEGY',
    excerpt: 'Positioning high-tier enterprise packages re-anchors perceived buyer value and accelerates deal closes.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'fractional-cfo-benefits-solopreneurs',
    title: 'Why Every Solopreneur Needs a Fractional CFO Before Hitting Seven Figures',
    category: 'ACCOUNTING',
    excerpt: 'Tax optimization, cash conversion cycle improvements, and working capital buffers protect growing bottom lines.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'green-hydrogen-startups-energy-grants',
    title: 'Green Hydrogen Startups Secure Major Department of Energy Grants to Scale Electrolysis',
    category: 'CLIMATE TECH',
    excerpt: 'Reducing clean hydrogen production costs below $2 per kilogram unlocks heavy industrial decarbonization.',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'influencer-marketing-vanity-to-attributed-sales',
    title: 'How Influencer Marketing Is Shifting from Vanity Metrics to Attributed Sales Performance',
    category: 'DIGITAL MARKETING',
    excerpt: 'First-party tracking pixels and affiliate revenue share contracts replace upfront sponsorship fees.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'remote-first-vs-rto-500-startups-data',
    title: 'Remote First vs Return to Office: Data from 500 Fast-Growing Startups Reveals the Truth',
    category: 'MANAGEMENT',
    excerpt: 'Hybrid models with quarterly in-person hack weeks show 22% higher engineering throughput than full in-office.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'refurbished-enterprise-tech-circular-market',
    title: 'Inside the Booming $40B Market for Refurbished Enterprise Tech Hardware',
    category: 'CIRCULAR ECONOMY',
    excerpt: 'Certified pre-owned servers and networking switches enable AI startups to stretch seed round runway.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'founder-equity-vesting-nightmare-scenarios',
    title: 'How to Structure Founder Equity Vesting to Avoid Nightmare Co-Founder Disputes',
    category: 'STARTUP LAW',
    excerpt: 'Four-year vesting with a one-year cliff and double-trigger acceleration clauses safeguard corporate control.',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'lucrative-low-overhead-franchise-2026',
    title: 'The 10 Most Lucrative Low-Overhead Franchise Opportunities in 2026',
    category: 'FRANCHISE EXPANSION',
    excerpt: 'Mobile service concepts, home health agencies, and commercial cleaning franchises deliver six-figure returns.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop',
  },
];

const BEN_ANGEL_AUTHOR_ARTICLES = [
  {
    id: 'how-to-biohack-your-brain-for-peak-performance',
    title: 'How to Biohack Your Brain for Peak Focus and Performance',
    category: 'THOUGHT LEADERS',
    excerpt: 'Proven neuroscience frameworks to eliminate brain fog, optimize daily cognitive output, and sustain high energy without burnout.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'collaboration-drives-innovation-growth',
    title: 'Collaboration Drives Innovation and Growth',
    category: 'THOUGHT LEADERS',
    excerpt: 'When great minds work together, new ideas turn into real progress. How cross-functional teams build unstoppable momentum.',
    imageUrl: '/images/topic-sub-2.jpg',
  },
  {
    id: 'unstoppable-90-day-plan-to-biohack-your-mind',
    title: 'The 90-Day Biohack Blueprint: How to Reclaim Energy, Focus and Drive',
    category: 'LEADERSHIP',
    excerpt: 'Eliminate chronic decision fatigue and optimize physical resilience using behavioral biohacking systems.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
  },
];

// Helper to provide articles for each page (1 to 10)
function getArticlesForPage(slug: string, page: number) {
  if (slug === 'ben-angel') {
    if (page === 1) return BEN_ANGEL_AUTHOR_ARTICLES;
    return [
      {
        id: `optimizing-deep-sleep-cycles-p${page}`,
        title: `Optimizing Deep Sleep Cycles: The Founder's Secret Weapon (Vol. ${page})`,
        category: 'HEALTH & WELLNESS',
        excerpt: 'Why 7 hours of restorative sleep beats an extra hour of late-night grinding for long-term cognitive endurance.',
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: `reversing-burnout-before-it-derails-growth-p${page}`,
        title: `Reversing Burnout Before It Derails Your Company's Growth (Part ${page})`,
        category: 'LEADERSHIP',
        excerpt: 'Recognizing early micro-symptoms of neural exhaustion and resetting executive nervous system equilibrium.',
        imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: `neurochemistry-of-high-stakes-negotiations-p${page}`,
        title: `The Neurochemistry of High-Stakes Negotiations (Edition ${page})`,
        category: 'NEGOTIATION',
        excerpt: 'How regulating cortisol and dopamine response allows founders to close complex multi-million dollar deals.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop',
      },
    ];
  }

  if (page === 1) return PAGE_1_ARTICLES;
  if (page === 2) return PAGE_2_ARTICLES;

  // For pages 3 through 10, generate clean variations with distinct titles and categories
  const baseList = page % 2 === 1 ? PAGE_1_ARTICLES : PAGE_2_ARTICLES;
  return baseList.map((art) => ({
    ...art,
    id: `${art.id}-p${page}`,
    title: `${art.title} (Part ${page})`,
  }));
}

export default function AuthorProfilePage() {
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const rawSlug = params?.slug as string | undefined;
  const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || 'sherin-shibu';

  const [author, setAuthor] = useState<AuthorProfile>(() => {
    if (AUTHORS_MAP[slug]) return AUTHORS_MAP[slug];
    return {
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      role: 'Staff Writer',
      badge: 'Entrepreneur Staff',
      avatar: '/images/user-avatar-butterfly.png',
      bio: 'Staff Writer at Entrepreneur.',
    };
  });
  const [dbArticles, setDbArticles] = useState<any[] | null>(null);

  // Read initial page from URL query string on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const pageQuery = parseInt(searchParams.get('page') || '1', 10);
      if (!isNaN(pageQuery) && pageQuery >= 1 && pageQuery <= 10) {
        setCurrentPage(pageQuery);
      }
    }
  }, []);

  // Handle page change: update state, update URL query string, and scroll to articles stream
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > 10) return;
    setCurrentPage(newPage);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('page', String(newPage));
      window.history.pushState({}, '', url.toString());

      const el = document.getElementById('author-articles-stream');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Fetch author details and published articles
  useEffect(() => {
    fetch(`/api/user/profile?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.profile) {
          const p = data.profile;
          setAuthor({
            name: p.fullName || p.name || 'Staff Writer',
            role: 'Staff Writer',
            badge: 'Entrepreneur Staff',
            avatar: p.avatar || '/images/user-avatar-butterfly.png',
            bio: p.bio || 'Staff Writer at Entrepreneur covering business, technology, and entrepreneurship.',
          });
        }
      })
      .catch(() => {});

    // Fetch published articles only (no drafts, pending_review, rejected, or trashed)
    fetch('/api/articles?status=published&limit=30')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          const authorSlugClean = slug.toLowerCase();
          const matching = data.data.filter((a: any) => {
            const artAuthor = (a.author?.name || a.authorName || '').toLowerCase();
            return artAuthor.includes(authorSlugClean) || authorSlugClean.includes(artAuthor);
          });
          if (matching.length > 0) {
            setDbArticles(matching);
          } else if (!AUTHORS_MAP[slug]) {
            setDbArticles(data.data.slice(0, 24));
          }
        }
      })
      .catch(() => {});
  }, [slug]);

  const currentArticles = dbArticles && dbArticles.length > 0 ? dbArticles : getArticlesForPage(slug, currentPage);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Navigation Header */}
      <Header />

      {/* TOP AUTHOR PROFILE SECTION - EXACT MATCH TO IMAGE 1 */}
      <section className="bg-white pt-10 pb-4 md:pt-14 md:pb-6 px-5 lg:px-10">
        <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 md:gap-12">
            {/* Author Avatar: Clean circle without border */}
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
            </div>
          </div>

          {/* Clean Horizontal Divider Line separating profile from stream */}
          <div className="border-b border-slate-200 mt-8 md:mt-10" />
        </div>
      </section>

      {/* ARTICLES STREAM - 1 ROW 3 COLUMNS GRID */}
      <main id="author-articles-stream" className="flex-1 w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-10">
        {/* Section Headline */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-black text-[#020618] tracking-tight my-0">
            More From {author.name}
          </h2>
        </div>

        {/* 1 Row 3 Columns Grid for Current Page Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {currentArticles.map((art) => (
            <article key={art.id} className="relative group flex flex-col items-start text-left cursor-pointer">
              {/* Stretched link so the entire card is clickable */}
              <Link
                href={getArticleUrl(art)}
                className="absolute inset-0 z-0"
                aria-label={art.title}
              />

              {/* Card Image */}
              <div className="w-full aspect-[16/10] overflow-hidden rounded-none bg-slate-100 mb-3.5 border border-slate-200/60 pointer-events-none">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 rounded-none"
                />
              </div>

              {/* Card Category */}
              <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans mb-1.5 block relative z-10 pointer-events-none">
                {art.category}
              </span>

              {/* Card Title */}
              <h3 className="font-serif font-bold text-base sm:text-[18px] text-[#020618] leading-snug group-hover:underline decoration-1 underline-offset-2 my-0 relative z-10 pointer-events-none">
                {art.title}
              </h3>

              {/* Card Excerpt */}
              {art.excerpt && (
                <p className="font-serif text-slate-600 text-xs sm:text-[13.5px] leading-relaxed line-clamp-3 mt-2 my-0 relative z-10 pointer-events-none">
                  {art.excerpt}
                </p>
              )}
            </article>
          ))}
        </div>

        {/* DYNAMIC FUNCTIONAL PAGINATION MATCHING IMAGE 3 */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-12 pb-8">
          {[1, 2, 3].map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={`min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-3 rounded-[3px] font-sans text-xs sm:text-[13px] flex items-center justify-center cursor-pointer transition-all duration-150 ${
                currentPage === pageNum
                  ? 'bg-[#1642D0] text-white font-bold border border-[#1642D0]'
                  : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold hover:border-slate-400'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ))}

          {/* Ellipsis */}
          <span className="min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-2 rounded-[3px] bg-white border border-slate-300 text-slate-400 font-sans text-xs sm:text-[13px] flex items-center justify-center select-none">
            ...
          </span>

          {/* Page 10 Button */}
          <button
            type="button"
            onClick={() => handlePageChange(10)}
            className={`min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-3 rounded-[3px] font-sans text-xs sm:text-[13px] flex items-center justify-center cursor-pointer transition-all duration-150 ${
              currentPage === 10
                ? 'bg-[#1642D0] text-white font-bold border border-[#1642D0]'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold hover:border-slate-400'
            }`}
            aria-label="Go to page 10"
            aria-current={currentPage === 10 ? 'page' : undefined}
          >
            10
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => handlePageChange(Math.min(10, currentPage + 1))}
            disabled={currentPage === 10}
            className="h-9 sm:h-10 px-4 rounded-[3px] bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 disabled:opacity-40 font-sans font-semibold text-xs sm:text-[13px] flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </main>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}
