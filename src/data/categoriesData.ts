export interface SubCategory {
  name: string;
  slug: string;
  description?: string;
}

export interface MainCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  subcategories: SubCategory[];
  aliases?: string[];
}

export const MAIN_CATEGORIES: MainCategory[] = [
  {
    id: 1,
    name: 'Breaking News',
    slug: 'breaking-news',
    description: 'Real-time breaking business headlines, financial alerts, market disruptions, and urgent corporate announcements.',
    aliases: ['breaking-business-news', 'business'],
    subcategories: [
      { name: 'Breaking Headlines', slug: 'breaking-headlines', description: 'Urgent business alerts and top market breaking stories.' },
      { name: 'Business Alerts', slug: 'business-alerts', description: 'High-priority real-time commercial and market alerts.' },
      { name: 'Major Announcements', slug: 'major-announcements', description: 'Significant press releases, government actions, and corporate moves.' },
      { name: 'Business Crises', slug: 'business-crises', description: 'Emergency responses, risk mitigation, and corporate distress coverage.' },
    ],
  },
  {
    id: 2,
    name: 'Markets & Investing',
    slug: 'markets-investing',
    description: 'Equities, global indices, debt securities, foreign exchange, commodities, crypto, and modern wealth allocation.',
    aliases: ['markets-and-investing'],
    subcategories: [
      { name: 'Stock Market', slug: 'stock-market', description: 'Equities, shares, NYSE, NASDAQ, and corporate valuations.' },
      { name: 'Global Market Indices', slug: 'global-market-indices', description: 'S&P 500, Dow Jones, FTSE, Nikkei, and international benchmarks.' },
      { name: 'Bonds & Fixed Income', slug: 'bonds-fixed-income', description: 'Treasury yields, sovereign debt, corporate bonds, and credit ratings.' },
      { name: 'Forex & Currency', slug: 'forex-currency', description: 'Currency exchange rates, central bank reserves, and currency valuation.' },
      { name: 'Commodities & Gold', slug: 'commodities-gold', description: 'Gold bullion, silver, industrial metals, and agricultural goods.' },
      { name: 'Cryptocurrency', slug: 'cryptocurrency', description: 'Bitcoin, Ethereum, DeFi protocols, blockchain infrastructure, and digital assets.' },
      { name: 'Investment Strategies', slug: 'investment-strategies', description: 'Value investing, growth equities, dividend harvesting, and quantitative strategies.' },
      { name: 'Portfolio Management', slug: 'portfolio-management', description: 'Risk diversification, asset allocation, and wealth preservation frameworks.' },
      { name: 'Market Analysis', slug: 'market-analysis', description: 'Technical indicators, sentiment gauges, macro commentary, and chart setups.' },
    ],
  },
  {
    id: 3,
    name: 'Economy & Policy',
    slug: 'economy-policy',
    description: 'Macroeconomics, fiscal policy, taxation, inflation metrics, central banking, and international trade dynamics.',
    aliases: ['economy'],
    subcategories: [
      { name: 'Global Economy', slug: 'global-economy', description: 'Worldwide GDP growth, cross-border flows, and global economic health.' },
      { name: 'National Economies', slug: 'national-economies', description: 'Domestic output, sovereign budgets, and regional economic stability.' },
      { name: 'Inflation & Cost of Living', slug: 'inflation-cost-of-living', description: 'CPI benchmarks, purchasing power, consumer baskets, and cost pressures.' },
      { name: 'Interest Rates', slug: 'interest-rates', description: 'Borrowing costs, benchmark lending rates, and yield curve movements.' },
      { name: 'Monetary Policy', slug: 'monetary-policy', description: 'Central bank balance sheets, quantitative tightening, and liquidity measures.' },
      { name: 'Fiscal Policy & Taxation', slug: 'fiscal-policy-taxation', description: 'Government expenditure, tax legislation, subsidies, and fiscal deficits.' },
      { name: 'Employment & Labour Markets', slug: 'employment-labour-markets', description: 'Payroll statistics, wage inflation, unemployment rates, and workforce dynamics.' },
      { name: 'International Trade', slug: 'international-trade', description: 'Tariffs, bilateral agreements, import/export quotas, and WTO regulations.' },
      { name: 'Economic Growth', slug: 'economic-growth', description: 'Productivity growth, industrial output, and capital expenditure trends.' },
      { name: 'Economic Forecasts', slug: 'economic-forecasts', description: 'Econometric projections, consensus estimates, and recession probability indicators.' },
    ],
  },
  {
    id: 4,
    name: 'Corporate News',
    slug: 'corporate-news',
    description: 'Quarterly financial earnings, mergers and acquisitions, board governance, and global enterprise strategy.',
    subcategories: [
      { name: 'Corporate Earnings', slug: 'corporate-earnings', description: 'Earnings season reports, revenue guidance, and profit performance.' },
      { name: 'Quarterly Results', slug: 'quarterly-results', description: 'Comprehensive Q1-Q4 operational filings and balance sheet audits.' },
      { name: 'Annual Reports', slug: 'annual-reports', description: 'Audited yearly disclosures, shareholder letters, and executive overviews.' },
      { name: 'Mergers & Acquisitions', slug: 'mergers-acquisitions', description: 'Strategic takeovers, private equity buyouts, and conglomerate consolidation.' },
      { name: 'Business Expansion', slug: 'business-expansion', description: 'New geographic market entry, facility construction, and enterprise scaling.' },
      { name: 'Corporate Restructuring', slug: 'corporate-restructuring', description: 'Spin-offs, divisional reorganization, cost-cutting, and operational pivots.' },
      { name: 'Corporate Governance', slug: 'corporate-governance', description: 'Board oversight, compliance structures, shareholder rights, and audit policies.' },
      { name: 'Company Partnerships', slug: 'company-partnerships', description: 'Joint ventures, strategic alliances, and commercial co-development pacts.' },
      { name: 'Corporate Strategy', slug: 'corporate-strategy', description: 'Long-term competitive positioning, capital discipline, and enterprise vision.' },
    ],
  },
  {
    id: 5,
    name: 'Startups & Entrepreneurship',
    slug: 'startups-entrepreneurship',
    description: 'Seed-stage innovation, venture funding rounds, solopreneur blueprints, and founder scaling playbooks.',
    aliases: ['startups-and-entrepreneurship', 'entrepreneurs', 'building-a-business'],
    subcategories: [
      { name: 'Startup News', slug: 'startup-news', description: 'Breaking ecosystem coverage, launch alerts, and startup milestones.' },
      { name: 'Founder Stories', slug: 'founder-stories', description: 'Inspiring builder journeys, lessons learned, and zero-to-one retrospectives.' },
      { name: 'Startup Funding', slug: 'startup-funding', description: 'Angel investments, pre-seed accelerators, Series A/B/C rounds, and valuations.' },
      { name: 'Venture Capital', slug: 'venture-capital', description: 'VC fund raises, LP allocations, term sheets, and investor sentiment.' },
      { name: 'Startup Strategies', slug: 'startup-strategies', description: 'Product-market fit, unit economics, viral loops, and lean methodologies.' },
    ],
  },
  {
    id: 6,
    name: 'Banking & Finance',
    slug: 'banking-finance',
    description: 'Commercial banking networks, central bank reserves, payment rails, fintech disruption, and asset management.',
    aliases: ['banking-and-finance'],
    subcategories: [
      { name: 'Banking News', slug: 'banking-news', description: 'Major commercial and retail banking institution developments.' },
      { name: 'Central Banks', slug: 'central-banks', description: 'The Federal Reserve, ECB, Bank of England, Bank of Japan, and policy mandates.' },
      { name: 'Digital Banking', slug: 'digital-banking', description: 'Neobanks, branchless banking, AI advisory, and mobile financial services.' },
      { name: 'Fintech', slug: 'fintech', description: 'Disruptive software architectures, blockchain ledger rails, and financial APIs.' },
      { name: 'Digital Payments', slug: 'digital-payments', description: 'Point-of-sale systems, merchant processing, digital wallets, and cross-border settlement.' },
      { name: 'Loans & Credit', slug: 'loans-credit', description: 'Underwriting algorithms, syndicated loans, credit lines, and debt instruments.' },
      { name: 'Insurance', slug: 'insurance', description: 'Insurtech innovation, commercial risk underwriting, and life & property coverage.' },
      { name: 'Wealth Management', slug: 'wealth-management', description: 'Family offices, high-net-worth fiduciary services, and private wealth advisory.' },
      { name: 'Financial Regulation', slug: 'financial-regulation', description: 'SEC, CFTC, Basel accords, compliance directives, and anti-money laundering laws.' },
    ],
  },
  {
    id: 7,
    name: 'Technology & Super Intelligence',
    slug: 'technology-super-intelligence',
    description: 'Artificial intelligence, artificial general intelligence, neural architecture, enterprise SaaS, cloud compute, and semiconductors.',
    aliases: ['technology-ai', 'technology-and-ai'],
    subcategories: [
      { name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Deep learning, foundation models, multimodal LLMs, and synthetic media.' },
      { name: 'Super Intelligence', slug: 'super-intelligence', description: 'AGI frameworks, recursive self-improvement systems, and autonomous cognitive architectures.' },
      { name: 'AI Startups', slug: 'ai-startups', description: 'Cutting-edge machine learning ventures, model fine-tuners, and AI tooling companies.' },
      { name: 'Enterprise Technology', slug: 'enterprise-technology', description: 'Digital transformation, ERP suites, legacy migration, and corporate IT governance.' },
      { name: 'Software & SaaS', slug: 'software-saas', description: 'Subscription software economics, product-led growth, and B2B workflow solutions.' },
      { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Zero-trust architecture, threat intelligence, encryption standards, and cyber defense.' },
      { name: 'Cloud Computing', slug: 'cloud-computing', description: 'Hyperscaler infrastructure, edge deployment, serverless architectures, and Kubernetes.' },
      { name: 'Semiconductors & Chips', slug: 'semiconductors-chips', description: 'Foundries, photolithography, GPU clusters, NPUs, and silicon packaging.' },
      { name: 'Robotics & Automation', slug: 'robotics-automation', description: 'Humanoid robots, robotic process automation, and intelligent industrial manipulators.' },
      { name: 'Consumer Electronics', slug: 'consumer-electronics', description: 'Smartphones, wearables, spatial computing headsets, and connected smart home tech.' },
      { name: 'Tech Policy & Regulation', slug: 'tech-policy-regulation', description: 'AI ethics accords, antitrust actions, intellectual property standards, and data safety.' },
    ],
  },
  {
    id: 8,
    name: 'Real Estate & Property',
    slug: 'real-estate-property',
    description: 'Residential real estate markets, commercial real estate, luxury developments, proptech innovations, and architecture.',
    aliases: ['real-estate'],
    subcategories: [
      { name: 'Residential Real Estate', slug: 'residential-real-estate', description: 'Single-family homes, multifamily complexes, rental yields, and buyer demand.' },
      { name: 'Commercial Property', slug: 'commercial-property', description: 'Office towers, retail malls, logistics hubs, and industrial park leasing.' },
      { name: 'Luxury Real Estate', slug: 'luxury-real-estate', description: 'Ultra-high-net-worth estates, waterfront villas, and bespoke architectural residences.' },
      { name: 'Property Investment', slug: 'property-investment', description: 'REITs, syndications, capital appreciation models, and cash-on-cash returns.' },
      { name: 'Real Estate Finance', slug: 'real-estate-finance', description: 'Commercial mortgages, mezzanine financing, debt restructuring, and interest hedge tactics.' },
      { name: 'Construction & Infrastructure', slug: 'construction-infrastructure', description: 'Civil engineering, building materials, urban planning, and transit projects.' },
      { name: 'Housing Market', slug: 'housing-market', description: 'Inventory volumes, price indices, affordability data, and demographic migration trends.' },
      { name: 'Property Technology', slug: 'property-technology', description: 'Smart building sensors, automated tenant management, and virtual real estate platforms.' },
      { name: 'Architecture & Development', slug: 'architecture-development', description: 'Sustainable design, structural innovation, zoning transformations, and skyline developments.' },
    ],
  },
  {
    id: 9,
    name: 'Global Business',
    slug: 'global-business',
    description: 'Regional economic corridors, geopolitical commerce, foreign direct investment, and resilient cross-border supply chains.',
    aliases: ['international-business'],
    subcategories: [
      { name: 'United States', slug: 'united-states', description: 'US market trends, consumer behavior, interstate commerce, and national business climate.' },
      { name: 'United Kingdom', slug: 'united-kingdom', description: 'City of London financial hub, post-Brexit commerce, and UK innovation hubs.' },
      { name: 'Europe', slug: 'europe', description: 'Eurozone monetary union, continental industrial leaders, and EU corporate directives.' },
      { name: 'Asia-Pacific', slug: 'asia-pacific', description: 'Emerging Asian tigers, Japanese enterprise innovation, and Australasian resource hubs.' },
      { name: 'India & South Asia', slug: 'india-south-asia', description: 'Digital public infrastructure, manufacturing booms, tech talent, and startup scaleups.' },
      { name: 'Middle East', slug: 'middle-east', description: 'Sovereign wealth diversification, Gulf gigaprojects, energy hubs, and tech zones.' },
      { name: 'Africa', slug: 'africa', description: 'Continental free trade, mobile leapfrogging, renewable resources, and youth demographic dividend.' },
      { name: 'Latin America', slug: 'latin-america', description: 'Nearshoring corridors, natural commodity exports, and vibrant regional fintech hubs.' },
      { name: 'International Trade', slug: 'international-trade-global', description: 'Shipping container routes, export financing, customs harmonisation, and multilateral trade.' },
      { name: 'Global Supply Chains', slug: 'global-supply-chains', description: 'Just-in-case inventory, maritime shipping, geopolitical de-risking, and automated logistics.' },
    ],
  },
  {
    id: 10,
    name: 'Leadership & Management',
    slug: 'leadership-management',
    description: 'Executive stewardship, organizational resilience, high-performance culture, talent acquisition, and board governance.',
    aliases: ['leadership'],
    subcategories: [
      { name: 'CEO Leadership', slug: 'ceo-leadership', description: 'Chief executive decision frameworks, crisis communications, and vision casting.' },
      { name: 'Executive Management', slug: 'executive-management', description: 'C-suite alignment, operational execution, and divisional accountability.' },
      { name: 'Leadership Strategies', slug: 'leadership-strategies', description: 'Decisive leadership models, emotional intelligence, and transformational change.' },
      { name: 'Workplace Culture', slug: 'workplace-culture', description: 'Psychological safety, hybrid work dynamics, core company values, and inclusion.' },
      { name: 'Human Resources', slug: 'human-resources', description: 'Compensation structures, benefits design, labor compliance, and HR tech systems.' },
      { name: 'Talent & Recruitment', slug: 'talent-recruitment', description: 'Executive headhunting, skill-based hiring, candidate assessments, and retention.' },
      { name: 'Employee Experience', slug: 'employee-experience', description: 'Internal engagement, wellness initiatives, recognition systems, and career pathways.' },
      { name: 'Business Productivity', slug: 'business-productivity', description: 'Time management, asynchronous collaboration, workflow automation, and output optimization.' },
      { name: 'Corporate Governance', slug: 'corporate-governance-leadership', description: 'Independent board seats, stakeholder capitalism, audit ethics, and committee oversight.' },
      { name: 'Career Development', slug: 'career-development', description: 'Professional upskilling, mentorship networks, executive coaching, and leadership pipelines.' },
      { name: 'Women in Leadership', slug: 'women-in-leadership', description: 'Female founders, boardroom parity, venture advocacy, and executive trailblazers.' },
    ],
  },
  {
    id: 11,
    name: 'Marketing & Branding',
    slug: 'marketing-branding',
    description: 'Brand identity, performance marketing, omnichannel media campaigns, influencer partnerships, and customer lifetime value.',
    subcategories: [
      { name: 'Brand Strategy', slug: 'brand-strategy', description: 'Brand positioning, competitive moats, brand architecture, and storytelling.' },
      { name: 'Digital Marketing', slug: 'digital-marketing', description: 'Programmatic media, paid acquisition, conversion optimization, and marketing funnels.' },
      { name: 'Advertising & Campaigns', slug: 'advertising-campaigns', description: 'Creative commercial concepts, Super Bowl ads, outdoor media, and viral campaigns.' },
      { name: 'Social Media Marketing', slug: 'social-media-marketing', description: 'Algorithm updates, community management, short-form video, and engagement playbooks.' },
      { name: 'Content Marketing', slug: 'content-marketing', description: 'Editorial thought leadership, newsletters, white papers, and educational distribution.' },
      { name: 'SEO & Search Marketing', slug: 'seo-search-marketing', description: 'Organic search ranking, AI search optimization (AEO), and high-intent keyword acquisition.' },
      { name: 'Public Relations', slug: 'public-relations', description: 'Earned media, press outreach, brand reputation defense, and crisis communications.' },
      { name: 'Consumer Behaviour', slug: 'consumer-behaviour', description: 'Behavioral economics, customer sentiment analytics, and generational buying habits.' },
      { name: 'E-commerce Marketing', slug: 'ecommerce-marketing', description: 'DTC customer acquisition, average order value expansion, and retention email flows.' },
      { name: 'Influencer Marketing', slug: 'influencer-marketing', description: 'Sponsored brand ambassadorships, micro-influencer ROI, and performance affiliate pacts.' },
      { name: 'Creator Economy', slug: 'creator-economy', description: 'Independent media studios, monetized communities, and creator-led consumer brands.' },
    ],
  },
  {
    id: 12,
    name: 'Sustainability & ESG',
    slug: 'sustainability-esg',
    description: 'Environmental stewardship, climate adaptation, circular manufacturing, carbon pricing, and renewable clean tech.',
    aliases: ['sustainability'],
    subcategories: [
      { name: 'ESG Reporting', slug: 'esg-reporting', description: 'Scope 1-3 greenhouse gas audits, SEC sustainability disclosures, and CSRD compliance.' },
      { name: 'Climate & Business', slug: 'climate-business', description: 'Climate resilience planning, physical risk adaptation, and transition risk modeling.' },
      { name: 'Renewable Energy', slug: 'renewable-energy-esg', description: 'Corporate power purchase agreements, solar arrays, offshore wind, and battery storage.' },
      { name: 'Clean Technology', slug: 'clean-technology', description: 'Carbon capture and storage, green hydrogen, fusion energy, and clean industrial chemistry.' },
      { name: 'Sustainable Investing', slug: 'sustainable-investing', description: 'Green bonds, impact investment funds, SRI indices, and divestment mandates.' },
      { name: 'Carbon Markets', slug: 'carbon-markets', description: 'Voluntary carbon credits, compliance emissions trading schemes, and carbon removal certs.' },
      { name: 'Circular Economy', slug: 'circular-economy', description: 'Zero-waste production, modular product design, recycled polymers, and reverse logistics.' },
      { name: 'Corporate Social Responsibility', slug: 'corporate-social-responsibility', description: 'Community philanthropic investment, ethical sourcing, and supplier fair labor standards.' },
      { name: 'Green Infrastructure', slug: 'green-infrastructure', description: 'LEED-certified green real estate, EV charging grids, and smart eco-cities.' },
      { name: 'Environmental Regulations', slug: 'environmental-regulations', description: 'EPA rules, cross-border carbon border adjustment mechanisms, and water rights law.' },
    ],
  },
  {
    id: 13,
    name: 'Company Profiles',
    slug: 'company-profiles',
    description: 'In-depth investigative dissections of the world’s most dominant conglomerates, private unicorns, and emerging category leaders.',
    subcategories: [
      { name: 'Company Spotlights', slug: 'company-spotlights', description: 'Deep-dive analytical retrospectives on breakthrough companies and fast risers.' },
      { name: "World's Leading Companies", slug: 'worlds-leading-companies', description: 'Fortune 500 titans, Trillion-dollar market cap giants, and sovereign institutions.' },
      { name: 'Brand Profiles', slug: 'brand-profiles', description: 'The heritage, design philosophy, and consumer connection of enduring iconic brands.' },
      { name: 'Industry Leaders', slug: 'industry-leaders', description: 'Market-share dominant operators across aerospace, tech, retail, and manufacturing.' },
      { name: 'Corporate Case Studies', slug: 'corporate-case-studies', description: 'Masterclass business school dissections of triumphs, pivots, and operational turnaround turnarounds.' },
    ],
  },
  {
    id: 14,
    name: 'Interviews & Opinions',
    slug: 'interviews-opinions',
    description: 'Exclusive sit-downs with visionary leaders, billionaire investors, distinguished academics, and provocative op-eds.',
    aliases: ['ceo-interviews', 'interviews'],
    subcategories: [
      { name: 'CEO Interviews', slug: 'ceo-interviews-sub', description: 'Frank, unvarnished conversations with top executives steering global enterprises.' },
      { name: 'Founder Interviews', slug: 'founder-interviews', description: 'Candid reflections from startup creators on sacrifice, product vision, and tenacity.' },
      { name: 'Investor Interviews', slug: 'investor-interviews', description: 'Hedge fund managers, venture capitalists, and private equity leaders on macro themes.' },
      { name: 'Industry Expert Interviews', slug: 'industry-expert-interviews', description: 'Domain scientists, chief economists, and specialized consultants sharing deep insights.' },
      { name: 'Opinions', slug: 'opinions', description: 'Contrarian viewpoints, editorial critiques, and visionary business philosophy essays.' },
    ],
  },
  {
    id: 15,
    name: 'Research & Insights',
    slug: 'research-insights',
    description: 'Authoritative data white papers, empirical market research, consumer trend forecasting, and macroeconomic modeling.',
    subcategories: [
      { name: 'Industry Reports', slug: 'industry-reports', description: 'Sector-by-sector market size forecasts, TAM estimates, and competitive benchmark reports.' },
      { name: 'Market Research', slug: 'market-research', description: 'Empirical consumer sentiment studies, focus group surveys, and pricing elasticity data.' },
      { name: 'Economic Research', slug: 'economic-research', description: 'Academic working papers, econometric regressions, and central bank study summaries.' },
    ],
  },
  {
    id: 16,
    name: 'Industry & Manufacturing',
    slug: 'industry-manufacturing',
    description: 'Heavy engineering, automated factories, aerospace advancements, pharma breakthroughs, and global logistics chains.',
    subcategories: [
      { name: 'Automotive & Mobility', slug: 'automotive-mobility', description: 'Electric vehicles, autonomous driving systems, battery gigafactories, and fleet electrification.' },
      { name: 'Aerospace & Aviation', slug: 'aerospace-aviation', description: 'Commercial aircraft manufacturing, space exploration tech, defense contracts, and drone logistics.' },
      { name: 'Manufacturing', slug: 'manufacturing', description: 'Precision machining, industrial robotics, smart factory IoT, and lean continuous improvement.' },
      { name: 'Industrial Technology', slug: 'industrial-technology', description: 'Heavy automation, predictive maintenance sensors, and next-generation power tools.' },
      { name: 'Healthcare & Pharmaceuticals', slug: 'healthcare-pharmaceuticals', description: 'Biotechnology innovations, FDA approvals, drug discovery pipelines, and hospital operations.' },
      { name: 'Food & Agriculture', slug: 'food-agriculture', description: 'Agtech, precision farming, cellular agriculture, food supply safety, and consumer CPG.' },
      { name: 'Logistics & Transportation', slug: 'logistics-transportation', description: 'Freight rail, commercial trucking, intermodal container ports, and air cargo routes.' },
      { name: 'Chemicals & Materials', slug: 'chemicals-materials', description: 'Advanced polymers, graphene, carbon fiber, industrial gases, and green catalysts.' },
    ],
  },
  {
    id: 17,
    name: 'Luxury & Lifestyle',
    slug: 'luxury-lifestyle',
    description: 'Haute horlogerie, premium hospitality, supercar engineering, bespoke fashion houses, and alternative luxury assets.',
    subcategories: [
      { name: 'Luxury Brands', slug: 'luxury-brands', description: 'Heritage European fashion conglomerates, artisanal ateliers, and luxury market dynamics.' },
      { name: 'Luxury Travel & Hospitality', slug: 'luxury-travel-hospitality', description: 'Five-star luxury resorts, private aviation charters, superyachts, and curated expeditions.' },
      { name: 'Watches & Jewellery', slug: 'watches-jewellery', description: 'Swiss mechanical timepieces, high jewellery auctions, diamonds, and collector markets.' },
      { name: 'Premium Automotive', slug: 'premium-automotive', description: 'Hypercars, bespoke coachbuilders, vintage collector auctions, and grand tourers.' },
      { name: 'Fashion & Retail', slug: 'fashion-retail', description: 'Haute couture runway trends, luxury retail flagships, and personal shopping services.' },
      { name: 'Luxury Investments', slug: 'luxury-investments', description: 'Rare wines, fine art auctions, vintage watches, and passion asset portfolios.' },
    ],
  },
  {
    id: 18,
    name: 'Energy & Commodities',
    slug: 'energy-commodities',
    description: 'Crude oil benchmarks, natural gas liquefaction, uranium, critical transition minerals, and national electrical grids.',
    subcategories: [
      { name: 'Oil & Gas', slug: 'oil-gas', description: 'Upstream exploration, shale drilling, OPEC+ production quotas, and refining margins.' },
      { name: 'Renewable Energy', slug: 'renewable-energy', description: 'Utility-scale solar farms, wind turbines, hydro plants, and geothermal generation.' },
      { name: 'Electricity & Utilities', slug: 'electricity-utilities', description: 'Transmission infrastructure, smart grid modernization, peak load management, and tariffs.' },
      { name: 'Natural Gas', slug: 'natural-gas', description: 'LNG export terminals, pipeline flows, Henry Hub spot prices, and seasonal storage.' },
      { name: 'Gold & Precious Metals', slug: 'gold-precious-metals', description: 'Gold reserves, platinum group metals, silver industrial demand, and bullion trading.' },
      { name: 'Industrial Metals', slug: 'industrial-metals', description: 'Copper wiring, aluminum smelting, iron ore benchmarks, nickel, and zinc contracts.' },
      { name: 'Critical Minerals', slug: 'critical-minerals', description: 'Lithium, cobalt, rare earth elements, nickel, and battery supply security.' },
      { name: 'Energy Markets', slug: 'energy-markets', description: 'Commodity futures, crack spreads, wholesale electricity trading, and hedging desk strategies.' },
      { name: 'Energy Transition', slug: 'energy-transition', description: 'Decarbonization roadmaps, coal retirement, nuclear power, and green fuel swaps.' },
      { name: 'Energy Policy', slug: 'energy-policy', description: 'Strategic petroleum reserve releases, pipeline permits, subsidies, and national security mandates.' },
    ],
  },
  {
    id: 19,
    name: 'Retail & E-commerce',
    slug: 'retail-ecommerce',
    description: 'Omnichannel consumer retail, merchant marketplaces, inventory management, logistics fulfillment, and shopping innovations.',
    subcategories: [
      { name: 'Retail Industry', slug: 'retail-industry', description: 'Big-box department stores, brick-and-mortar footfall trends, and inventory turns.' },
      { name: 'Online Shopping', slug: 'online-shopping', description: 'Direct-to-consumer digital carts, buy-now-pay-later, and automated returns.' },
      { name: 'E-commerce Platforms', slug: 'ecommerce-platforms', description: 'Shopify, Amazon marketplace sellers, headless commerce architectures, and fulfillment networks.' },
    ],
  },
  {
    id: 20,
    name: 'Business & Legal Affairs',
    slug: 'business-legal-affairs',
    description: 'Corporate litigation, antitrust jurisprudence, patent enforcement, labor relations law, and international treaties.',
    subcategories: [
      { name: 'Business Law', slug: 'business-law', description: 'Corporate entity formation, contract disputes, fiduciary liability, and commercial arbitration.' },
      { name: 'Intellectual Property', slug: 'intellectual-property', description: 'Patent infringement, trademark protection, trade secret preservation, and IP licensing.' },
      { name: 'Employment Law', slug: 'employment-law', description: 'Non-compete clauses, workplace discrimination, wage regulations, and whistleblower protections.' },
      { name: 'Data Privacy', slug: 'data-privacy', description: 'GDPR compliance, CCPA enforcement, cross-border data transfer pacts, and biometrics law.' },
      { name: 'International Business Law', slug: 'international-business-law', description: 'Sovereign sanctions, cross-border jurisdiction, international commercial arbitration, and FCPA.' },
    ],
  },
  {
    id: 21,
    name: 'Politics',
    slug: 'politics',
    description: 'Federal policy, congressional legislation, government regulations, campaigns, and political economy analysis.',
    aliases: ['politics-policy', 'policy', 'government'],
    subcategories: [
      { name: 'US Politics', slug: 'us-politics', description: 'White House, Congress, and domestic political shifts.' },
      { name: 'Policy & Legislation', slug: 'policy-legislation', description: 'Federal laws, regulatory bills, and executive orders.' },
      { name: 'Elections & Campaigns', slug: 'elections-campaigns', description: 'National and state election trends, polls, and candidates.' },
      { name: 'Foreign Policy', slug: 'foreign-policy', description: 'Diplomacy, international relations, and global defense alliances.' },
      { name: 'National Security', slug: 'national-security', description: 'Defense, intelligence, cyber warfare, and border policy.' },
    ],
  },
  {
    id: 22,
    name: 'Sports',
    slug: 'sports',
    description: 'Major league athletics, franchise valuations, collegiate sports, sports media deals, and athletic leadership.',
    aliases: ['sports-business', 'athletics'],
    subcategories: [
      { name: 'NFL & Football', slug: 'nfl-football', description: 'Professional football news, franchise operations, and scores.' },
      { name: 'NBA & Basketball', slug: 'nba-basketball', description: 'Professional basketball updates, player contracts, and analysis.' },
      { name: 'MLB & Baseball', slug: 'mlb-baseball', description: 'Baseball leagues, analytics, and season coverage.' },
      { name: 'Sports Business', slug: 'sports-business-deals', description: 'Sponsorships, broadcasting rights, stadium financing, and team sales.' },
      { name: 'Global Sports', slug: 'global-sports', description: 'Soccer, Formula 1, tennis, Olympics, and international competitions.' },
    ],
  },
];

// Helper to look up any category by slug (handles aliases too)
export function getCategoryBySlug(rawSlug: string): { main: MainCategory; sub?: SubCategory } | null {
  if (!rawSlug) return null;
  const slug = rawSlug.trim().toLowerCase();

  // 1. Direct main category match
  for (const main of MAIN_CATEGORIES) {
    if (main.slug === slug || (main.aliases && main.aliases.includes(slug))) {
      return { main };
    }
  }

  // 2. Direct subcategory match
  for (const main of MAIN_CATEGORIES) {
    for (const sub of main.subcategories) {
      if (sub.slug === slug) {
        return { main, sub };
      }
    }
  }

  // 3. Normalized slug comparison (stripping hyphens and symbols)
  const norm = slug.replace(/[^a-z0-9]/g, '');
  for (const main of MAIN_CATEGORIES) {
    if (main.slug.replace(/[^a-z0-9]/g, '') === norm) {
      return { main };
    }
    for (const sub of main.subcategories) {
      if (sub.slug.replace(/[^a-z0-9]/g, '') === norm) {
        return { main, sub };
      }
    }
  }

  return null;
}

// Flat list of all 173 categories (20 main + 153 subcategories)
export interface FlatCategoryEntry {
  id: number;
  name: string;
  slug: string;
  description: string;
  isMain: boolean;
  parentId: number | null;
  parentName?: string;
  parentSlug?: string;
}

export function getAllFlattenedCategories(): FlatCategoryEntry[] {
  const result: FlatCategoryEntry[] = [];
  let currentId = 1;

  for (const main of MAIN_CATEGORIES) {
    const mainId = currentId++;
    result.push({
      id: mainId,
      name: main.name,
      slug: main.slug,
      description: main.description,
      isMain: true,
      parentId: null,
    });

    for (const sub of main.subcategories) {
      result.push({
        id: currentId++,
        name: sub.name,
        slug: sub.slug,
        description: sub.description || `${sub.name} news and in-depth business coverage.`,
        isMain: false,
        parentId: mainId,
        parentName: main.name,
        parentSlug: main.slug,
      });
    }
  }

  return result;
}
