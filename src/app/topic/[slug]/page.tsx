'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
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

  // Page 4: Articles 31 - 40
  {
    id: 'ai-workflow-automation-scaling-smbs',
    category: 'INDUSTRY',
    title: 'How SMBs Are Deploying Pragmatic AI Workflow Automation',
    excerpt: 'Simple automations for invoicing, lead scoring, and customer inquiry routing deliver immediate ROI.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'cross-functional-leadership-growth',
    category: 'INDUSTRY',
    title: 'Breaking Down Silos: The Cross-Functional Leadership Blueprint',
    excerpt: 'Aligning product, sales, and marketing around shared revenue metrics accelerates velocity.',
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'sustainable-packaging-solutions',
    category: 'INDUSTRY',
    title: 'The Shift Toward Circular Packaging and Supply Economics',
    excerpt: 'How sustainable materials reduce shipping costs and improve brand loyalty among eco-conscious buyers.',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'zero-party-data-revolution',
    category: 'INDUSTRY',
    title: 'The Zero-Party Data Revolution in Customer Acquisition',
    excerpt: 'Collecting direct consumer preferences replaces third-party cookies with hyper-targeted personalization.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'venture-debt-vs-equity-financing',
    category: 'INDUSTRY',
    title: 'Venture Debt vs. Equity: Structuring Non-Dilutive Growth Capital',
    excerpt: 'When founders should utilize debt lines to extend runway into milestones without equity dilution.',
    image: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'decentralized-finance-business-lending',
    category: 'INDUSTRY',
    title: 'Decentralized Capital Networks Transforming Merchant Lending',
    excerpt: 'On-chain credit assessment algorithms provide small business owners working capital in hours.',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'building-remote-first-engineering',
    category: 'INDUSTRY',
    title: 'Operating Principles for 24/7 Global Engineering Hubs',
    excerpt: 'Rigorous documentation and standardized PR reviews keep code quality pristine across continents.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'optimizing-b2b-sales-cycles',
    category: 'INDUSTRY',
    title: 'Shortening 90-Day B2B Sales Cycles Down to 30 Days',
    excerpt: 'Champion enablement collateral and interactive ROI calculators remove committee friction.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'customer-onboarding-churn-reduction',
    category: 'INDUSTRY',
    title: 'Why Day-One Onboarding Determines First-Year Customer Retention',
    excerpt: 'Guided in-app tours and designated customer success check-ins prevent early-stage churn.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'next-gen-workplace-analytics',
    category: 'INDUSTRY',
    title: 'Workplace Analytics: Measuring Real Team Output Over Screen Time',
    excerpt: 'Modern leaders shift away from vanity surveillance toward outcome-driven operational metrics.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop',
  },

  // Page 5: Articles 41 - 50
  {
    id: 'navigating-macro-economic-headwinds',
    category: 'INDUSTRY',
    title: 'Operating Playbooks for Navigating Macroeconomic Headwinds',
    excerpt: 'Stress-testing unit margins and securing flexible supplier agreements before downturns hit.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'product-led-growth-enterprise-software',
    category: 'INDUSTRY',
    title: 'Applying Product-Led Growth Inside Traditional Enterprise Software',
    excerpt: 'Bottom-up freemium adoption combined with top-down executive licensing drives exponential ACV.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'omnichannel-retail-strategies-2026',
    category: 'INDUSTRY',
    title: 'Bridging Physical Storefronts with Digital E-Commerce Channels',
    excerpt: 'Unified POS systems, in-store pickup, and localized inventory dispatch maximize retail margins.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'executive-decision-frameworks-uncertainty',
    category: 'INDUSTRY',
    title: 'Decisive Decision-Making Frameworks Under Incomplete Information',
    excerpt: 'How top CEOs distinguish between reversible one-way doors and critical strategic pivot points.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'ai-powered-supply-chain-forecasting',
    category: 'INDUSTRY',
    title: 'Predictive Demand Forecasting in Volatile Global Supply Chains',
    excerpt: 'Neural networks analyzing live shipping container data prevent stockouts and costly overages.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'brand-equity-in-direct-to-consumer',
    category: 'INDUSTRY',
    title: 'Rebuilding Sustainable Brand Equity in Direct-to-Consumer Brands',
    excerpt: 'Moving past performance marketing addictions by investing in community-led physical experiences.',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'scaling-sales-teams-seed-to-series-b',
    category: 'INDUSTRY',
    title: 'Structuring Sales Compensation from Seed Stage to Series B',
    excerpt: 'Incentive models that align AE quotas with long-term customer health rather than short-term spikes.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'micro-acquisitions-growth-strategy',
    category: 'INDUSTRY',
    title: 'Micro-Acquisitions: Buying Complementary Micro-SaaS for Growth',
    excerpt: 'Acquiring high-retention micro-tools expands total addressable market without greenfield R&D.',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'protecting-intellectual-property-startups',
    category: 'INDUSTRY',
    title: 'Safeguarding Proprietary Intellectual Property in Fast Markets',
    excerpt: 'Defensive patent filings, trade secret protocols, and ironclad employee non-disclosure agreements.',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'high-performing-board-dynamics',
    category: 'INDUSTRY',
    title: 'Cultivating Constructive Governance with Independent Board Directors',
    excerpt: 'Transparent pre-meeting agendas and quarterly governance reviews prevent adversarial boardroom friction.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=300&auto=format&fit=crop',
  },

  // Page 6: Articles 51 - 60
  {
    id: 'hyper-personalized-customer-journeys',
    category: 'INDUSTRY',
    title: 'Designing Hyper-Personalized Post-Purchase Customer Journeys',
    excerpt: 'Tailored onboarding checklists and dynamic email sequences build long-lasting product affinity.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'resilient-pricing-models-inflation',
    category: 'INDUSTRY',
    title: 'Value-Based Pricing Strategies That Absorb Cost Inflation',
    excerpt: 'Communicating transparent service enhancements allows companies to maintain margins without customer backlash.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'talent-retention-competitive-markets',
    category: 'INDUSTRY',
    title: 'Retaining High-Impact Engineers in Hyper-Competitive Markets',
    excerpt: 'Clear technical leadership tracks and generous sabbatical policies protect mission-critical tribal knowledge.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'modern-marketing-mix-modeling',
    category: 'INDUSTRY',
    title: 'Next-Gen Marketing Mix Modeling Without Privacy Compromises',
    excerpt: 'Bayesian statistical attribution provides macro advertising clarity across blended omnichannel spend.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'future-proof-cloud-architecture',
    category: 'INDUSTRY',
    title: 'Architecting Cloud Infrastructure to Withstand Exponential Scale',
    excerpt: 'Multi-region serverless failovers and containerized microservices minimize costly downtime windows.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'corporate-governance-growth-stage',
    category: 'INDUSTRY',
    title: 'Scaling Corporate Governance from Seed Stage to Pre-IPO',
    excerpt: 'Implementing rigorous internal audit controls and compliance committees ahead of institutional scrutiny.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'data-privacy-compliance-global-scale',
    category: 'INDUSTRY',
    title: 'Unified Privacy Compliance Across Global Jurisdictions',
    excerpt: 'Automating GDPR, CCPA, and regional compliance consent flows simplifies international expansion.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'automation-playbooks-lean-operations',
    category: 'INDUSTRY',
    title: 'Lean Operations: Replacing Busywork with Scripted Automations',
    excerpt: 'How five-person operations teams manage millions in gross transaction volume through programmatic webhooks.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'building-strategic-advisory-boards',
    category: 'INDUSTRY',
    title: 'How to Assemble an Influential Industry Advisory Board',
    excerpt: 'Structuring advisor equity agreements and setting clear quarterly deliverables that open enterprise doors.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'sustainable-revenue-growth-models',
    category: 'INDUSTRY',
    title: 'Sustainable Revenue Growth vs. Hyper-Growth Burnout',
    excerpt: 'Why customer profitability and capital discipline outlast unsustainable venture-fueled acquisition sprees.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=300&auto=format&fit=crop',
  },

  // Page 7: Articles 61 - 70
  {
    id: 'optimizing-working-capital-liquidity',
    category: 'INDUSTRY',
    title: 'Optimizing Working Capital and Cash Conversion Cycles',
    excerpt: 'Negotiating favorable accounts payable terms and automating receivables collection secures cash cushions.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'ai-generated-content-brand-strategy',
    category: 'INDUSTRY',
    title: 'Maintaining Editorial Integrity in an AI Content World',
    excerpt: 'Human-in-the-loop editorial guidelines preserve unique brand voice while scaling informational throughput.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'enterprise-security-distributed-workforces',
    category: 'INDUSTRY',
    title: 'Zero-Trust Architecture for Global Remote Workforces',
    excerpt: 'Enforcing hardware token multi-factor authentication and continuous device posture checks.',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'founder-led-sales-to-quota-carrying-teams',
    category: 'INDUSTRY',
    title: 'Codifying Founder-Led Sales into Predictable Playbooks',
    excerpt: 'Extracting founder intuition into repeatable discovery question rubrics and objection handling scripts.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'modern-payment-gateways-conversion-rates',
    category: 'INDUSTRY',
    title: 'Maximizing Checkout Conversion Through Localized Payments',
    excerpt: 'Supporting alternative payment methods and dynamic currency conversion increases international conversions.',
    image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'retaining-high-value-b2b-clients',
    category: 'INDUSTRY',
    title: 'Executive Sponsor Programs for Key Account Retention',
    excerpt: 'Pairing founders with enterprise customer sponsors creates executive alignment that thwarts competitors.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'supply-chain-risk-mitigation',
    category: 'INDUSTRY',
    title: 'Dual-Sourcing Critical Components: A Resilience Guide',
    excerpt: 'Balancing primary low-cost manufacturers with secondary domestic producers prevents factory shutdowns.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'culture-first-company-building',
    category: 'INDUSTRY',
    title: 'Building Authentic Company Values That Guide Hard Decisions',
    excerpt: 'Values that matter are those tested during headcount adjustments and strategy realignments.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'navigating-regulatory-tech-shifts',
    category: 'INDUSTRY',
    title: 'Proactive Policy Engagement for Tech Disruptors',
    excerpt: 'Collaborating with industry trade groups helps startups shape emerging technology regulations positively.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'maximizing-lifetime-customer-value',
    category: 'INDUSTRY',
    title: 'Unlocking Expansion Revenue in Subscription Business Models',
    excerpt: 'Usage-based tiers and add-on module marketplaces turn satisfied customers into expanding revenue sources.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop',
  },

  // Page 8: Articles 71 - 80
  {
    id: 'community-led-brand-momentum',
    category: 'INDUSTRY',
    title: 'Nurturing Enthusiast User Communities into Brand Growth',
    excerpt: 'Empowering passionate power-users with beta previews turns community forums into word-of-mouth engines.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'efficient-capital-allocation-downturns',
    category: 'INDUSTRY',
    title: 'Disciplined Capital Allocation During Market Contractions',
    excerpt: 'Doubling down on core profitable product lines while pausing non-core speculative experiments.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'ai-copilots-operations-efficiency',
    category: 'INDUSTRY',
    title: 'Integrating Custom AI Copilots into Internal Knowledge Bases',
    excerpt: 'Indexing internal documentation allows customer support agents to resolve technical tickets 5x faster.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'streamlining-post-merger-integrations',
    category: 'INDUSTRY',
    title: 'Seamless Operational Integration Post-Acquisition',
    excerpt: 'Prioritizing culture alignment and single-sign-on systems avoids common post-merger productivity dips.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'predictive-analytics-inventory-management',
    category: 'INDUSTRY',
    title: 'Real-Time Inventory Balancing for High-Volume Brands',
    excerpt: 'Dynamic reordering logic accounts for localized transit delays and regional purchasing spikes.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'building-high-trust-executive-teams',
    category: 'INDUSTRY',
    title: 'Fostering Psychological Safety Across Senior Leadership',
    excerpt: 'Encouraging transparent dissent during strategy meetings leads to more resilient execution plans.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'agile-financial-planning-analysis',
    category: 'INDUSTRY',
    title: 'Continuous Rolling Forecasts vs. Rigid Annual Budgets',
    excerpt: 'Monthly scenario modeling empowers management to adapt headcounts and budgets in real time.',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'b2b-account-based-marketing-scale',
    category: 'INDUSTRY',
    title: 'Executing High-Touch Account-Based Marketing at Scale',
    excerpt: 'Personalized bespoke landing pages and executive gift packages convert top target accounts.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'leveraging-open-source-software',
    category: 'INDUSTRY',
    title: 'Strategic Open-Source Adoption for Proprietary SaaS',
    excerpt: 'Contributing to open-source foundations establishes industry authority while speeding product releases.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'modern-franchising-digital-infrastructure',
    category: 'INDUSTRY',
    title: 'Digital Command Centers for Multi-Unit Franchisees',
    excerpt: 'Centralized labor scheduling, inventory monitoring, and digital marketing ensure uniform brand standards.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=300&auto=format&fit=crop',
  },

  // Page 9: Articles 81 - 90
  {
    id: 'strategic-fundraising-playbook-2026',
    category: 'INDUSTRY',
    title: 'The Modern Fundraising Pitch: Traction Over Promises',
    excerpt: 'Investors demand audited cohort retention, net revenue expansion, and clear profitability roadmaps.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'customer-feedback-loops-product-roadmap',
    category: 'INDUSTRY',
    title: 'Synthesizing Customer Support Tickets into Product Features',
    excerpt: 'Automated semantic clustering tags bug reports and feature requests directly into engineering sprints.',
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'brand-differentiation-crowded-categories',
    category: 'INDUSTRY',
    title: 'Carving Out a Defensible Category Point of View',
    excerpt: 'Daring to take an explicit industry stand attracts loyal evangelists while repelling poor-fit prospects.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'scaling-infrastructure-traffic-surges',
    category: 'INDUSTRY',
    title: 'Engineering Resilience for Viral Traffic Spikes',
    excerpt: 'Edge caching, asynchronous queues, and database read replicas handle 100x traffic surges effortlessly.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'executive-compensation-talent-alignment',
    category: 'INDUSTRY',
    title: 'Designing Equity Incentive Plans That Retain Top Performers',
    excerpt: 'Performance-vested options and extended exercise windows align employee upside with enterprise value.',
    image: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'decarbonization-commercial-logistics',
    category: 'INDUSTRY',
    title: 'Fleet Electrification and Green Logistics Optimization',
    excerpt: 'Route optimization software and electric delivery vehicles cut corporate carbon footprints and fuel costs.',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'ai-driven-customer-support-automation',
    category: 'INDUSTRY',
    title: 'Resolving 70% of Tier-1 Support Tickets with GenAI Agents',
    excerpt: 'Trained on company help documentation, intelligent agents answer routine inquiries accurately 24/7.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'navigating-complex-vendor-contracts',
    category: 'INDUSTRY',
    title: 'Enterprise Vendor Contract Negotiation Playbook',
    excerpt: 'Securing price caps on renewals, SLA penalty rebates, and data portability guarantees upfront.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'building-resilient-distribution-networks',
    category: 'INDUSTRY',
    title: 'Diversifying Direct-to-Consumer and Wholesale Distribution',
    excerpt: 'Combining online stores with curated retail placements hedges against advertising algorithm changes.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'optimizing-cac-payback-metrics',
    category: 'INDUSTRY',
    title: 'Engineering Sub-12-Month Customer Acquisition Payback',
    excerpt: 'Rigorous conversion rate optimization and annual upfront billing shorten capital recycling cycles.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop',
  },

  // Page 10: Articles 91 - 100
  {
    id: 'the-evolution-of-remote-workplaces',
    category: 'INDUSTRY',
    title: 'The Evolution of High-Trust Asynchronous Workplaces',
    excerpt: 'Why written proposals and recorded screen walk-throughs outperform synchronized status meetings.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'cash-flow-forecasting-high-growth',
    category: 'INDUSTRY',
    title: '13-Week Cash Flow Models for Scaling Enterprises',
    excerpt: 'Granular weekly receipts and disbursement projections provide actionable clarity before cash crunches.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'ai-powered-product-recommendation-engines',
    category: 'INDUSTRY',
    title: 'Next-Generation Contextual Commerce Recommendation Engines',
    excerpt: 'Machine learning embeddings recommend complementary items based on real-time browsing behavior.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'scaling-customer-success-teams',
    category: 'INDUSTRY',
    title: 'Transitioning from Reactive Support to Proactive Success',
    excerpt: 'Automated telemetry alerts customer success managers when key feature adoption drops.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'strategic-alliances-market-entry',
    category: 'INDUSTRY',
    title: 'Strategic Co-Selling Alliances to Crack New Geographies',
    excerpt: 'Partnering with incumbent regional providers accelerates brand credibility in unfamiliar markets.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'modernizing-legacy-enterprise-systems',
    category: 'INDUSTRY',
    title: 'Incremental Strangulation: Migrating Off Monolithic Codebases',
    excerpt: 'Replacing legacy modules one at a time minimizes business disruption during architectural overhauls.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'leadership-habits-peak-productivity',
    category: 'INDUSTRY',
    title: 'Daily Operating Rituals of High-Output Founders',
    excerpt: 'Protecting morning deep-work blocks and delegating operational fire-fighting maintains strategic focus.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'cross-border-regulatory-navigation',
    category: 'INDUSTRY',
    title: 'Navigating Cross-Border VAT and Tariffs in E-Commerce',
    excerpt: 'Automated tax computation platforms prevent costly customs holds and surprise import duties.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'protecting-enterprise-data-breaches',
    category: 'INDUSTRY',
    title: 'Incident Response Drills for Modern Security Teams',
    excerpt: 'Simulating ransomware and phishing breaches tests readiness before real attacks happen.',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'building-organic-advocacy-engines',
    category: 'INDUSTRY',
    title: 'Turning Power Customers into VIP Brand Advocates',
    excerpt: 'Exclusive advisory groups and early beta access generate unpaid organic industry endorsements.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  },

  // Page 11: Articles 101 - 110
  {
    id: 'the-future-of-commercial-real-estate',
    category: 'INDUSTRY',
    title: 'The Future of Hybrid Office Spaces and Lease Flexibility',
    excerpt: 'Shorter commitments, coworking passes, and collaborative meeting hubs define modern leases.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'ai-driven-contract-analysis-risk',
    category: 'INDUSTRY',
    title: 'AI Contract Review: Catching Unfavorable Terms in Minutes',
    excerpt: 'Machine learning scanners highlight indemnification risks and non-standard termination clauses.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'sustainable-manufacturing-efficiency',
    category: 'INDUSTRY',
    title: 'Zero-Waste Manufacturing Strategies for Modern Factories',
    excerpt: 'Recycling scrap raw materials into secondary product lines boosts gross production margins.',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'b2b-loyalty-programs-expansion',
    category: 'INDUSTRY',
    title: 'Designing Gamified B2B Client Loyalty Programs',
    excerpt: 'Reward tiers offering executive executive training and free compute credits incentivize larger annual commitments.',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'navigating-interest-rate-cycles',
    category: 'INDUSTRY',
    title: 'Hedging Debt Exposure Across Changing Interest Rate Cycles',
    excerpt: 'Fixed-rate swaps and flexible treasury management protect operating budgets from floating-rate debt.',
    image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'deep-learning-applications-healthcare',
    category: 'INDUSTRY',
    title: 'Commercial Opportunities in MedTech Diagnostic AI',
    excerpt: 'FDA-cleared computer vision models assist clinicians in identifying early disease markers reliably.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'building-high-velocity-engineering-teams',
    category: 'INDUSTRY',
    title: 'Engineering Velocity: Deploying Code to Production Daily',
    excerpt: 'Automated CI/CD pipelines and feature flags allow engineering squads to ship features safely and continuously.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'retail-media-networks-advertising-shift',
    category: 'INDUSTRY',
    title: 'The Rapid Rise of First-Party Retail Media Networks',
    excerpt: 'E-commerce marketplaces monetize buyer intent by serving sponsored search ads directly on product pages.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'optimizing-founder-mental-resilience',
    category: 'INDUSTRY',
    title: 'Sustaining Founder Longevity and Emotional Resilience',
    excerpt: 'Structured peer masterminds, mandatory disconnected weekends, and executive coaching combat chronic burnout.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'the-next-decade-of-entrepreneurship',
    category: 'INDUSTRY',
    title: 'The Next Decade of Entrepreneurship: Smaller Teams, Bigger Impact',
    excerpt: 'AI toolchains and global infrastructure enable 10-person startups to generate $100M+ in annual revenue.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=300&auto=format&fit=crop',
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
          <Link href="/" className="hover:text-[#1642D0] transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {topicData.parentTitle && topicData.parentSlug && (
            <>
              <Link href={`/topic/${topicData.parentSlug}`} className="hover:text-[#1642D0] transition-colors whitespace-nowrap shrink-0">
                {topicData.parentTitle}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </>
          )}
          <span className="text-slate-900 font-bold uppercase tracking-wider whitespace-nowrap truncate">
            {topicData.title || 'TOPICS'}
          </span>
        </div>
      </div>

      {/* Category Header & Subcategory Badges Bar */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 pt-5 pb-2">
        <div className="pb-3 border-b border-slate-200">
          <span className="text-[11px] font-bold text-[#1642D0] uppercase tracking-wider font-sans block mb-1">
            {topicData.parentTitle ? `${topicData.parentTitle} • Subcategory` : 'Category'}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-serif font-black text-[#020618] tracking-tight my-1">
            {topicData.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-3xl my-1 leading-relaxed">
            {topicData.description}
          </p>
        </div>

        {/* Subcategories Filter Pills Bar */}
        {topicData.subcategories && topicData.subcategories.length > 0 && (
          <div className="py-3 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-100">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              Subcategories ({topicData.subcategories.length}):
            </span>
            <Link
              href={`/topic/${topicData.parentSlug || topicData.slug}`}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                !topicData.isSubcategory
                  ? 'bg-[#1642D0] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All {topicData.parentTitle || topicData.title}
            </Link>
            {topicData.subcategories.map((sub) => {
              const isActive = topicData.slug === sub.slug;
              return (
                <Link
                  key={sub.slug}
                  href={`/topic/${sub.slug}`}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#1642D0] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-[#1642D0]'
                  }`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        )}
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
        <Link
          href="/article/how-great-leaders-build-teams-that-thrive"
          className="block w-full overflow-hidden bg-slate-100 group cursor-pointer"
        >
          <img
            src="/images/topic-hero-leaders.jpg"
            alt="How Great Leaders Build Teams That Thrive"
            className="w-full h-[calc(100vh-250px)] min-h-[500px] sm:min-h-[580px] lg:min-h-[680px] xl:min-h-[740px] max-h-[850px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
          />
        </Link>

        {/* Story details */}
        <div className="pt-4">
          <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans block mb-1">
            {topicData.title}
          </span>

          {/* Full length bold heading matching Image 2 */}
          <h1 className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-serif font-bold text-[#020618] leading-[1.18] tracking-tight my-2">
            <Link
              href="/article/how-great-leaders-build-teams-that-thrive"
              className="hover:text-[#1642D0] hover:underline transition-colors"
            >
              How Great Leaders Build Teams That Thrive
            </Link>
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
              <Link
                href="/article/power-of-effective-communication-leadership"
                className="block w-full h-full cursor-pointer"
              >
                <img
                  src="/images/topic-sub-1.jpg"
                  alt="The Power of Effective Communication in Leadership"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </Link>
            </div>
            <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans mb-1.5 block">
              {topicData.title}
            </span>
            <h2 className="font-serif font-bold text-[15px] sm:text-[15.5px] md:text-[16px] lg:text-[16px] xl:text-[18.5px] tracking-tight text-[#020618] leading-snug group-hover:underline decoration-1 underline-offset-2 my-1.5 min-h-[24px] sm:min-h-[26px] flex items-center">
              <Link href="/article/power-of-effective-communication-leadership">
                The Power of Effective Communication in Leadership
              </Link>
            </h2>
            <p className="font-serif text-slate-600 text-xs sm:text-[13px] lg:text-[13px] xl:text-[13.5px] leading-relaxed mt-2 my-0 w-full min-h-[20px] sm:min-h-[22px]">
              Great leaders don&apos;t just give direction — they listen, inspire and bring people together.
            </p>
          </article>

          {/* Card 2 */}
          <article className="group flex flex-col items-start text-left w-full">
            <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 mb-3.5">
              <Link
                href="/article/collaboration-drives-innovation-growth"
                className="block w-full h-full cursor-pointer"
              >
                <img
                  src="/images/topic-sub-2.jpg"
                  alt="Collaboration Drives Innovation and Growth"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </Link>
            </div>
            <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans mb-1.5 block">
              {topicData.title}
            </span>
            <h2 className="font-serif font-bold text-[15px] sm:text-[15.5px] md:text-[16px] lg:text-[16px] xl:text-[18.5px] tracking-tight text-[#020618] leading-snug group-hover:underline decoration-1 underline-offset-2 my-1.5 min-h-[24px] sm:min-h-[26px] flex items-center">
              <Link href="/article/collaboration-drives-innovation-growth">
                Collaboration Drives Innovation and Growth
              </Link>
            </h2>
            <p className="font-serif text-slate-600 text-xs sm:text-[13px] lg:text-[13px] xl:text-[13.5px] leading-relaxed mt-2 my-0 w-full min-h-[20px] sm:min-h-[22px]">
              When great minds work together, new ideas turn into real progress.
            </p>
          </article>
        </div>
      </div>

      {/* Bottom Section: Left Stream (10 Articles per page + NEXT/PREVIOUS Controls) & Right Sidebar (Large Ad + Laptop Image) */}
      <div id="articles-list-section" className="w-full max-w-7xl mx-auto px-5 lg:px-10 pb-16 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: MORE NEWS heading + Bordered box with 10 articles per page */}
          <div className="lg:col-span-7 flex flex-col">
            {/* MORE NEWS Heading and Line ONLY above the left articles stream */}
            <div className="mb-4 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] uppercase tracking-wider my-0">
                MORE NEWS
              </h2>
              <div className="border-b border-slate-900 mt-2.5" />
            </div>

            {/* Bordered box with 10 articles per page */}
            <div className="bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs h-fit">
            <div className="space-y-6 divide-y divide-slate-100">
              {currentArticles.map((art, index) => (
                <article
                  key={art.id}
                  className={`flex gap-4 sm:gap-5 items-start ${index === 0 ? 'pt-0' : 'pt-6'}`}
                >
                  <Link
                    href={`/article/${art.id}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden bg-slate-100 block cursor-pointer group/thumb"
                  >
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                    />
                  </Link>
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

            {/* Pagination Controls formatted like Image 2:
                - Horizontal divider line above
                - Left: < PREVIOUS (rectangular button with border, disabled on page 1)
                - Center: PAGE 1 OF 11 (bold uppercase text)
                - Right: NEXT > (rectangular button with border, disabled on last page)
            */}
            <div className="flex items-center justify-between w-full pt-6 mt-6 border-t border-slate-200 font-sans">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage((p) => p - 1);
                    const el = document.getElementById('articles-list-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded border font-sans text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-colors select-none ${
                  currentPage === 1
                    ? 'border-slate-200 text-slate-400 bg-white cursor-not-allowed opacity-80'
                    : 'border-slate-300 text-slate-700 bg-white hover:text-[#1642D0] hover:border-[#1642D0] cursor-pointer'
                }`}
                aria-label="Previous articles"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>PREVIOUS</span>
              </button>

              <span className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-wider text-slate-700 select-none text-center">
                PAGE {currentPage} OF {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage((p) => p + 1);
                    const el = document.getElementById('articles-list-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded border font-sans text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-colors select-none ${
                  currentPage >= totalPages
                    ? 'border-slate-200 text-slate-400 bg-white cursor-not-allowed opacity-80'
                    : 'border-slate-300 text-slate-700 bg-white hover:text-[#1642D0] hover:border-[#1642D0] cursor-pointer'
                }`}
                aria-label="Next articles"
              >
                <span>NEXT</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
          </div>

          {/* Right Column: Sidebar with 2 Advertisements (Articles 1-5 & Articles 6-9) */}
          <div className="lg:col-span-5 space-y-6 relative">
            
            {/* 1st Sidebar Advertisement: 300 × 400 */}
            <div className="w-full text-center">
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400 block mb-2">
                ADVERTISEMENT
              </span>
              <div className="w-full h-[400px] min-h-[400px] bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-center p-6 text-center shadow-2xs">
                <span className="text-xs sm:text-[13px] font-semibold text-slate-600 font-sans">
                  300 × 400 Banner
                </span>
                <span className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Your Advertisement Here
                </span>
              </div>
            </div>

            {/* 2nd Sidebar Advertisement: 300 × 700 (Sticky to move along with the section when scrolling down) */}
            <div className="w-full text-center lg:sticky lg:top-24 z-10 transition-all">
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400 block mb-2">
                ADVERTISEMENT
              </span>
              <div className="w-full h-[700px] min-h-[700px] bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-center p-6 text-center shadow-2xs">
                <span className="text-xs sm:text-[13px] font-semibold text-slate-600 font-sans">
                  300 × 700 Banner
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
