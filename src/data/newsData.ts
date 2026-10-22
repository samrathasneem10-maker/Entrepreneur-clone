import { MAIN_CATEGORIES, getCategoryBySlug, getAllFlattenedCategories, type MainCategory, type SubCategory } from './categoriesData';

export { MAIN_CATEGORIES, getCategoryBySlug, getAllFlattenedCategories, type MainCategory, type SubCategory };

export interface Article {
  id: string;
  slug?: string;
  title: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
    title?: string;
    bio?: string;
  };
  date?: string;
  readTime?: string;
  excerpt?: string;
  imageUrl?: string;
  imageAspect?: 'square' | 'video' | 'wide';
  isPopular?: boolean;
  rank?: number;
  editor?: string;
}

export interface CategoryCard {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  iconName: string;
  slug: string;
  gradient: string;
}

export interface MarketTickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export const MARKET_TICKERS: MarketTickerItem[] = [
  { symbol: 'S&P 500', name: 'S&P 500', price: '5,464.61', change: '+21.40', changePercent: '+0.39%', isPositive: true },
  { symbol: 'NASDAQ', name: 'Nasdaq Comp', price: '17,689.36', change: '+126.08', changePercent: '+0.72%', isPositive: true },
  { symbol: 'DOW', name: 'Dow Jones', price: '39,150.33', change: '-45.20', changePercent: '-0.12%', isPositive: false },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: '$64,280.00', change: '+1,420.00', changePercent: '+2.26%', isPositive: true },
  { symbol: 'ETH/USD', name: 'Ethereum', price: '$3,480.50', change: '+84.20', changePercent: '+2.48%', isPositive: true },
  { symbol: 'OIL', name: 'Crude Oil', price: '$80.73', change: '-0.56', changePercent: '-0.69%', isPositive: false },
  { symbol: 'GOLD', name: 'Gold', price: '$2,321.10', change: '+12.40', changePercent: '+0.54%', isPositive: true },
];

export const HERO_ARTICLE: Article = {
  id: 'hero-1',
  title: "I've Mentored People for 20 Years. I Use These 4 Steps to Help Them Advance",
  category: 'Thought Leaders',
  author: {
    name: 'Jissan Cherian',
    title: 'Executive Contributor',
  },
  date: 'October 26, 2026',
  readTime: '6 min read',
  excerpt: '',
  imageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/10/1791223554-business-mentor-help-people-advance-1026-g2290156391.jpg',
  imageAspect: 'square',
};

export const LATEST_ARTICLES: Article[] = [
  {
    id: '53-side-hustle-ideas-to-make-extra-money-in-2026',
    slug: '53-side-hustle-ideas-to-make-extra-money-in-2026',
    title: '53 Side Hustle Ideas to Make Extra Money in 2026',
    category: 'Finance & Economics',
    author: { name: 'Sherin Shibu', avatar: '/images/author-sherin.png', title: 'Entrepreneur Staff' },
    date: '10m ago',
    imageUrl: '/images/side-hustle-53.jpg',
  },
  {
    id: 'youve-been-overlooking-your-best-idea-people-ai-is-about-to-fix-that',
    slug: 'youve-been-overlooking-your-best-idea-people-ai-is-about-to-fix-that',
    title: "You've Been Overlooking Your Best Idea People. AI Is About to Fix That.",
    category: 'Building a Business',
    author: {
      name: 'Sherin Shibu',
      title: 'Entrepreneur Staff',
      avatar: '/images/author-sherin.png',
      bio: 'Sherin Shibu is a business news reporter at Entrepreneur.com. She previously worked for PCMag, Business Insider, and specializes in business trends, consumer technology, and entrepreneurship.',
    },
    date: '25m ago',
    readTime: '4 min read',
    excerpt: 'Frontline employees hold the most actionable operational insights. New enterprise AI tools finally give leaders a way to capture, rank, and execute them.',
    imageUrl: '/images/rushing-ai-cx.jpg',
  },
  {
    id: 'why-leaders-blame-culture-instead-of-their-own-behavior',
    slug: 'why-leaders-blame-culture-instead-of-their-own-behavior',
    title: 'Why Leaders Blame Culture Instead of Their Own Behavior',
    category: 'Thought Leaders',
    author: {
      name: 'Matt Domo',
      title: 'Founder & CEO of FifthVantage',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      bio: 'Matt Domo is the founder and CEO of FifthVantage. He spent decades in leadership at Microsoft and AWS helping executives lead high-performing teams.',
    },
    date: '40m ago',
    readTime: '4 min read',
    excerpt: 'True organizational change starts in the executive suite. How self-awareness prevents cultural dysfunction.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'i-retired-at-36-and-started-over-at-41',
    slug: 'i-retired-at-36-and-started-over-at-41',
    title: 'I Retired at 36 and Started Over at 41. Here Are 5 Lessons I Learned About Time.',
    category: 'Entrepreneurs',
    author: {
      name: 'Reid Zeising',
      title: 'Entrepreneur & Investor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      bio: 'Reid Zeising is a serial entrepreneur, private equity investor, and mentor to early-stage founders.',
    },
    date: '1h ago',
    readTime: '5 min read',
    excerpt: 'Early retirement sounds appealing until you lose your daily sense of purpose. Key lessons on time management and legacy.',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '5-things-to-ask-a-credit-card-processor-before-signing',
    slug: '5-things-to-ask-a-credit-card-processor-before-signing',
    title: '5 Things to Ask a Credit Card Processor Before Signing a Contract',
    category: 'Building a Business',
    author: {
      name: 'Marko Kling',
      title: 'Fintech Specialist & Payments Consultant',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
      bio: 'Marko Kling is a fintech specialist advising high-volume small businesses on merchant processing fees and software integration.',
    },
    date: '2h ago',
    readTime: '4 min read',
    excerpt: 'Hidden processing fees and multi-year termination penalties can bleed merchant margins. What to ask sales reps before signing.',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'she-grew-up-on-food-stamps-now-runs-8-figure-startup',
    slug: 'she-grew-up-on-food-stamps-now-runs-8-figure-startup',
    title: 'She Grew Up on Food Stamps. Now She Runs an 8-Figure Startup.',
    category: 'Building a Business',
    author: {
      name: 'Joe Cecala',
      title: 'Senior Business Columnist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
      bio: 'Joe Cecala covers bootstrapping founder journeys and breakthrough scaling stories across venture and consumer brands.',
    },
    date: '3h ago',
    readTime: '6 min read',
    excerpt: 'Grit, relentless frugality, and learning to sell without shame allowed this founder to bootstrap an eight-figure retail brand.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  },
];

export const SECONDARY_FEATURED: Article[] = [
  {
    id: 'sec-1',
    title: 'Jeff Bezos Has an Optimistic Vision of an AI-Powered Future',
    category: 'Business News',
    author: { name: 'Sherin Shibu' },
    date: '5h ago',
    readTime: '8 min read',
    imageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/10/jeff-bezos-1026_g2297228123-new.jpg',
    imageAspect: 'video',
  },
  {
    id: 'sec-2',
    title: "Dad's Baby-Focused Company Grew to $20 Million in Year 1: Owlet",
    category: 'Building a Business',
    author: { name: 'Amanda Breen' },
    date: '8h ago',
    readTime: '8 min read',
    imageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/10/CEO_Kurt-Workman2-2-2-e1791495082368.jpg',
    imageAspect: 'video',
  },
];

export const TOP_STORIES_GRID: Article[] = [
  {
    id: 'grid-1',
    title: 'The Leadership Skill That Takes Innovation Further',
    category: 'Building a Business',
    author: { name: 'Michal Beressi Golomb' },
    date: 'October 26, 2026',
    excerpt: "Great innovation doesn't happen in isolation. The right partnerships can take breakthrough technology further and help shape what comes next for an entire industry.",
    imageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/10/leadership-technology-breakthroughs-1026_g2165668876.jpg',
    imageAspect: 'video',
  },
  {
    id: 'grid-2',
    title: 'The Simple Test to Use Early in Your Career That Pays Off for Decades',
    category: 'Building a Business',
    author: { name: 'Brendan Keegan' },
    date: 'October 26, 2026',
    excerpt: 'Before any big decision, ask: Will my future self thank me for this, or pay for it?',
    imageUrl: 'https://www.entrepreneur.com/wp-content/uploads/sites/2/2026/10/big-decision-1026-g-1477732795.jpg',
    imageAspect: 'video',
  },
  {
    id: 'grid-3',
    title: 'Apple Is Reportedly Creating New Devices for Your Smart Home',
    category: 'Business News',
    author: { name: 'Sherin Shibu' },
    date: 'October 26, 2026',
    excerpt: "An unusual partnership with LG will help power Apple's push into smart home devices.",
    imageUrl: '/images/apple-smart-home.jpg',
    imageAspect: 'video',
  },
];

export const SIDE_HUSTLE_ARTICLES: Article[] = [
  {
    id: 'sh-1',
    title: 'This Mother-Daughter Duo Started a Sparkling Side Hustle That Made $500,000 in Less Than a Year: \'Born Out of a Simple Frustration\'',
    category: 'Building a Business',
    author: { name: 'Amanda Breen' },
    imageUrl: '/images/sh-mother-daughter.png',
    imageAspect: 'square',
  },
  {
    id: 'sh-2',
    title: 'At Age 15, He Started Selling a Sweet Product for $2. His Business Broke $25,000 Last Summer: \'Smooth Sailing, No Pun Intended.\'',
    category: 'Building a Business',
    author: { name: 'Amanda Breen' },
    imageUrl: '/images/sh-sweet-product.png',
    imageAspect: 'square',
  },
  {
    id: 'sh-3',
    title: 'I Built a 7-Figure Business Teaching People How to Engineer AI Prompts. My Advice Usually Boils Down to 3 Sentences.',
    category: 'Building a Business',
    author: { name: 'Amanda Breen' },
    imageUrl: '/images/sh-ai-prompts.png',
    imageAspect: 'square',
  },
  {
    id: 'sh-4',
    title: 'How Does Your \'Fun\' Spending Compare to Your Generation\'s? Baby Boomers Splurge More on Hobbies Than Gen Z and Young Millennials.',
    category: 'Business News',
    author: { name: 'Amanda Breen' },
    imageUrl: '/images/sh-fun-spending.png',
    imageAspect: 'square',
  },
  {
    id: 'sh-5',
    title: 'Your Investments Should Have a Strategy—the AI Behind ChatGPT Can Take on Your Stock Portfolio',
    category: 'How to Make Money',
    author: { name: 'Entrepreneur Store' },
    imageUrl: '/images/sh-chatgpt-portfolio.png',
    imageAspect: 'square',
  },
  {
    id: 'sh-6',
    title: 'This 28-Year-Old Turned a $200 Side Hustle Into a $1.2 Million Business in 18 Months: \'Consistency Beats Perfection\'',
    category: 'Building a Business',
    author: { name: 'Amanda Breen' },
    imageUrl: '/images/sh-side-hustle-6.jpg',
    imageAspect: 'square',
  },
];

export const TRENDING_STORIES: Article[] = [
  {
    id: 'tr-1',
    rank: 1,
    title: 'Mark Cuban Says This Simple Habit Is the #1 Difference Between Struggling Founders and Billionaires',
    category: 'Leadership',
    author: { name: 'Jason Feifer' },
    date: 'July 25, 2026',
    isPopular: true,
  },
  {
    id: 'tr-2',
    rank: 2,
    title: 'How a 24-Year-Old Turned a $300 Domain Purchase into a $15 Million AI Startup in 9 Months',
    category: 'Tech & AI',
    author: { name: 'Emily Rella' },
    date: 'July 25, 2026',
    isPopular: true,
  },
  {
    id: 'tr-3',
    rank: 3,
    title: 'The Top 10 Low-Cost Franchises You Can Buy for Under $25,000 in 2026',
    category: 'Franchises',
    author: { name: 'Tracy Stapp Herold' },
    date: 'July 24, 2026',
    isPopular: true,
  },
  {
    id: 'tr-4',
    rank: 4,
    title: 'IRS Announces New Tax Deductions for Remote Workers and Small Business Owners',
    category: 'Money & Finance',
    author: { name: 'Matt McCue' },
    date: 'July 24, 2026',
    isPopular: true,
  },
  {
    id: 'tr-5',
    rank: 5,
    title: '7 Passive Income Stream Models That Are Generating Genuine Cash Flow This Year',
    category: 'Side Hustle',
    author: { name: 'Jeff Rose, CFP' },
    date: 'July 24, 2026',
    isPopular: true,
  },
];

export const CATEGORY_CARDS: CategoryCard[] = [
  {
    id: 'cat-1',
    name: 'Start a Business',
    description: 'Step-by-step guides, business planning, market validation, and startup launch checklists.',
    articleCount: 1420,
    iconName: 'Rocket',
    slug: 'start-a-business',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'cat-2',
    name: 'Side Hustles',
    description: 'High-margin extra income ideas, weekend ventures, and turning passion into profit.',
    articleCount: 890,
    iconName: 'Briefcase',
    slug: 'side-hustle',
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'cat-3',
    name: 'Leadership & Culture',
    description: 'Executive decision-making, team alignment, hiring top talent, and company culture.',
    articleCount: 1150,
    iconName: 'Users',
    slug: 'leadership',
    gradient: 'from-purple-600 to-violet-800',
  },
  {
    id: 'cat-4',
    name: 'Growth & Marketing',
    description: 'SEO strategy, viral social media campaigns, sales funnels, and customer acquisition.',
    articleCount: 1680,
    iconName: 'TrendingUp',
    slug: 'growth-marketing',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'cat-5',
    name: 'Money & Finance',
    description: 'Venture capital funding, bootstrapping tactics, business loans, and tax optimization.',
    articleCount: 940,
    iconName: 'DollarSign',
    slug: 'money-finance',
    gradient: 'from-green-600 to-emerald-800',
  },
  {
    id: 'cat-6',
    name: 'Franchises',
    description: 'Franchise 500 rankings, franchisee success stories, and multi-unit investment reviews.',
    articleCount: 760,
    iconName: 'Store',
    slug: 'franchises',
    gradient: 'from-rose-600 to-red-700',
  },
];

export const MARKETS_INVESTING_ARTICLES: Article[] = [
  {
    id: 'mkt-1',
    title: 'Why Institutional Investors Are Pouring Capital Into Early-Stage Climate Tech Startups',
    category: 'Markets',
    author: { name: 'David Miller' },
    date: 'July 25, 2026',
    excerpt: 'Macro economic pressures are forcing funds to look toward resilient, hard-asset technological innovations with sovereign support.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
    imageAspect: 'video',
  },
  {
    id: 'mkt-2',
    title: 'Federal Reserve Policy Shifts: What Every Small Business Owner Needs to Know About Interest Rates',
    category: 'Economy',
    author: { name: 'Sarah Jenkins' },
    date: 'July 25, 2026',
    excerpt: 'Understanding debt servicing costs and refinancing windows before the next Federal Open Market Committee meeting.',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop',
    imageAspect: 'video',
  },
  {
    id: 'mkt-3',
    title: 'Corporate Treasury Strategies: How Tech Giants Are Managing Cash Reserves Against Inflation',
    category: 'Corporate News',
    author: { name: 'Michael Vance' },
    date: 'July 24, 2026',
    excerpt: 'Diversifying cash into short-duration treasuries and yield-generating money market accounts.',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
    imageAspect: 'video',
  },
];

export interface NavItem {
  label: string;
  href: string;
  subcategories?: { label: string; href: string }[];
}

export const NAVIGATION_STRUCTURE: { primary: NavItem[] } = {
  primary: MAIN_CATEGORIES.map((cat) => ({
    label: cat.name,
    href: `/topic/${cat.slug}`,
    subcategories: cat.subcategories.map((sub) => ({
      label: sub.name,
      href: `/topic/${sub.slug}`,
    })),
  })),
};

export interface FranchiseItem {
  id: string;
  name: string;
  rank: number;
  category: string;
  investmentRange: string;
  units: string;
  description: string;
  imageUrl: string;
}

export interface VideoItem {
  id: string;
  title: string;
  showName: string;
  duration: string;
  views: string;
  imageUrl: string;
  date: string;
}

export const AI_TECH_FEATURE_ARTICLES: Article[] = [
  {
    id: 'ai-lead',
    title: 'The Agentic AI Wave: How Autonomous Workflows Are Replacing Traditional SaaS Platforms in 2026',
    category: 'Technology & AI',
    author: { name: 'Alex Rivera', title: 'Tech Editor' },
    date: 'July 25, 2026',
    excerpt: 'Founders are using self-correcting AI workflows to handle customer success, code deployment, and media creation with zero human overhead.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'ai-sub-1',
    title: '5 Open-Source AI Frameworks Outperforming Proprietary Models for Small Businesses',
    category: 'AI Tools',
    author: { name: 'Dr. Elena Rostova' },
    date: 'July 25, 2026',
  },
  {
    id: 'ai-sub-2',
    title: 'How a 24-Year-Old Built an AI Micro-Agency Generating $85k Monthly Recurring Revenue',
    category: 'Case Studies',
    author: { name: 'Jason Sterling' },
    date: 'July 24, 2026',
  },
  {
    id: 'ai-sub-3',
    title: 'Cybersecurity Alert: Protecting Your Proprietary Data When Fine-Tuning LLMs',
    category: 'Security',
    author: { name: 'Samantha Wu' },
    date: 'July 24, 2026',
  },
];

export const FRANCHISE_500_ITEMS: FranchiseItem[] = [
  {
    id: 'fran-1',
    name: 'Taco Bell',
    rank: 1,
    category: 'Quick Service Restaurant',
    investmentRange: '$575K - $3.4M',
    units: '8,200+',
    description: 'Consistently named #1 in the Franchise 500 due to innovative digital ordering tech and unmatched brand loyalty.',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'fran-2',
    name: 'Jersey Mike\'s Subs',
    rank: 2,
    category: 'Fast Casual Sandwich',
    investmentRange: '$237K - $1.2M',
    units: '2,700+',
    description: 'Rapid unit expansion driven by authentic fresh-sliced ingredients and strong franchisee support systems.',
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'fran-3',
    name: '7-Eleven Inc.',
    rank: 3,
    category: 'Convenience Stores',
    investmentRange: '$100K - $1.1M',
    units: '83,000+',
    description: 'The world\'s largest convenience retailer offering turn-key operational training and 24/7 brand power.',
    imageUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'fran-4',
    name: 'Planet Fitness',
    rank: 4,
    category: 'Fitness & Health',
    investmentRange: '$1.5M - $5.1M',
    units: '2,500+',
    description: 'High-margin recurring membership model catering to casual gym-goers with non-intimidating atmospheres.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
  },
];

export const ENTREPRENEUR_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Inside the Mind of a $500M Founder: Scaling From Garage to IPO',
    showName: 'Entrepreneur Elevator Pitch',
    duration: '14:25',
    views: '240K views',
    date: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'vid-2',
    title: 'How to Pitch VCs in 60 Seconds Without a Deck',
    showName: 'Pitch Deck Breakdown',
    duration: '08:10',
    views: '115K views',
    date: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'vid-[#',
    title: '5 Side Hustles You Can Launch This Weekend With AI Tools',
    showName: 'Side Hustle Secrets',
    duration: '11:40',
    views: '380K views',
    date: '5 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'vid-4',
    title: 'Franchise 500 Deep Dive: Where to Invest $50,000 in 2026',
    showName: 'Franchise Insider',
    duration: '09:15',
    views: '92K views',
    date: '1 week ago',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
  },
];

export const DEEP_DIVE_ARTICLES: Article[] = [
  {
    id: 'dd-1',
    title: 'The Anatomy of a Modern Exit: How Bootstrapped Founders Are Selling to Private Equity',
    category: 'Leadership & Strategy',
    author: { name: 'Marcus Sterling', title: 'M&A Advisor' },
    date: 'July 25, 2026',
    excerpt: 'Detailed teardown of EBITDA multiples, earn-out structures, and post-acquisition rollover equity.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'dd-2',
    title: 'Zero to 100,000 Users: The Growth Engine Behind the Top B2B SaaS Startups of 2026',
    category: 'Growth Marketing',
    author: { name: 'Rachel Vance', title: 'Growth Strategist' },
    date: 'July 24, 2026',
    excerpt: 'Product-led growth loops, developer community building, and high-converting lifecycle emails.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'dd-3',
    title: 'Building a Resilient Supply Chain in an Era of Global Trade Shifts',
    category: 'Operations',
    author: { name: 'Kenneth Chen', title: 'Supply Chain Director' },
    date: 'July 23, 2026',
    excerpt: 'Nearshoring, inventory buffer calculation, and supplier diversification best practices.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'dd-4',
    title: 'The Founder\'s Guide to Mental Toughness & Preventing Executive Burnout',
    category: 'Mindset & Health',
    author: { name: 'Dr. Aris Thorne', title: 'Performance Psychologist' },
    date: 'July 22, 2026',
    excerpt: 'Evidence-based cognitive habits, sleep architecture, and sustainable high-performance routines.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
  },
];

export interface TopicPageData {
  title: string;
  slug: string;
  description: string;
  articles: Article[];
  parentTitle?: string;
  parentSlug?: string;
  subcategories?: { name: string; slug: string; description?: string }[];
  isSubcategory?: boolean;
}

export const CATEGORY_TOPICS_DATA: Record<string, { title: string; description: string; articles: Article[] }> = {
  'breaking-business-news': {
    title: 'Breaking Business News',
    description: 'Breaking news, market updates, regulatory shifts, and major corporate developments.',
    articles: [
      {
        id: 'bnews-1',
        title: 'For Two Years, I Was Using AI Wrong. Fixing It Is Why My Clients Are Winning While Other Brands Fall Behind.',
        category: 'MARKETING',
        author: { name: 'DEEDRA DETERMAN' },
        date: 'July 28, 2026',
        excerpt: 'Premium personal brands do not need more AI content — they need AI used as a thought partner, as brand infrastructure and as a way to turn real audience data into messaging that actually lands.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bnews-2',
        title: "This Struggling Restaurant Chain Went Back to the Basics. Now Its Stock Is Up 500% in 4 Years: 'Nothing Short of Remarkable'",
        category: 'BUSINESS NEWS',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 28, 2026',
        excerpt: 'Instead of focusing on AI, this chain is fixing its foundation.',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bnews-3',
        title: "Here's What Really Separates Entrepreneurs Who Make It From Entrepreneurs Who Quit",
        category: 'BUSINESS NEWS',
        author: { name: 'JOEY STIVER' },
        date: 'July 27, 2026',
        excerpt: "You don't need to have a huge venture capital safety net, an Ivy League pedigree or a genius-level intellect to succeed. You need to disable your off switch.",
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bnews-4',
        title: "This Breakthrough Technology Is Poised to Accelerate Your Company's Growth",
        category: 'BUILDING A BUSINESS',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 27, 2026',
        excerpt: 'Discover a breakthrough technology stacked on top of generative AI, now poised to revolutionize businesses across nearly every sector.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bnews-5',
        title: 'This $33 Microsoft Office License Helps Entrepreneurs Tackle Any Task',
        category: 'TECH',
        author: { name: 'ENTREPRENEUR STORE' },
        date: 'July 26, 2026',
        excerpt: 'From spreadsheets to presentations, entrepreneurs can do it all with this Office deal.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bnews-6',
        title: "This 83-Year-Old Entrepreneur Is Rejecting a $400 Million Payday: 'I Don't Need a 200-Foot Yacht'",
        category: 'BUSINESS NEWS',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 26, 2026',
        excerpt: "The businessman said he's 'really happy' in eastern North Carolina and didn't need to spend winters in the Mediterranean.",
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bnews-7',
        title: 'The Best Cities For Entrepreneurs to Start a Business, According to This Banking Pro',
        category: 'BUSINESS NEWS',
        author: { name: 'DAN BOVA' },
        date: 'July 25, 2026',
        excerpt: 'The top 20 metro areas were determined by several factors, including income and number of businesses created.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bnews-8',
        title: "Mark Zuckerberg Says Concentrating AI Power in a Few Companies Is 'Dangerous'",
        category: 'BUSINESS NEWS',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 25, 2026',
        excerpt: 'In a new Wall Street Journal op-ed, the Meta CEO argues that concentrating AI power in a few hands is dangerous.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bnews-9',
        title: 'A Cincinnati Father Collapsed Alone At His House. His Apple Watch Saved His Life.',
        category: 'BUSINESS NEWS',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 24, 2026',
        excerpt: "The Apple Watch's fall detection feature dialed 911 for the unresponsive man.",
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bnews-10',
        title: "Church's Texas Chicken Hadn't Grown Its Store Count in 15 Years. Here's Why That Just Changed.",
        category: 'BUSINESS NEWS',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 24, 2026',
        excerpt: "CEO Roland Gonzalez says the chain 'has really been on fire.' Now new investment will help keep the momentum going.",
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'markets-investing': {
    title: 'Markets & Investing',
    description: 'Stock markets, ETF analysis, venture capital rounds, commodities, and wealth management strategies.',
    articles: [
      {
        id: 'mi-1',
        title: 'Why Wall Street Trusts Some CEOs and Doubts Others With the Same Balance Sheet',
        category: 'INVESTING',
        author: { name: 'MERILEE KERN, MBA' },
        date: 'July 28, 2026',
        excerpt: "A company's financial statements tell only half the story. Investors reveal why leadership transparency dictates market valuation.",
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mi-2',
        title: 'S&P 500 Surges as Tech Earnings Outperform Conservative Analyst Models',
        category: 'MARKETS',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 27, 2026',
        excerpt: 'Strong forward guidance across cloud compute and AI infrastructure stocks pushed broad market indices to new highs.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mi-3',
        title: 'The Top 5 ETF Strategies for Preserving Capital in a Volatile Yield Environment',
        category: 'ETFs',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 26, 2026',
        excerpt: 'Financial advisors share portfolio diversification frameworks designed to protect wealth while maintaining liquidity.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mi-4',
        title: 'Venture Capital Funding Rebounds in Q3 Driven by AI and Energy Transition Deals',
        category: 'VENTURE CAPITAL',
        author: { name: 'DAVID MILLER' },
        date: 'July 25, 2026',
        excerpt: 'Late-stage mega-rounds return as institutional investors re-allocate capital toward high-growth technology verticals.',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mi-5',
        title: 'How High-Net-Worth Investors Are Hedging Risk With Private Credit Infrastructure',
        category: 'WEALTH MANAGEMENT',
        author: { name: 'SARAH JENKINS' },
        date: 'July 25, 2026',
        excerpt: 'Direct lending funds are capturing institutional flows offering attractive risk-adjusted yields over public debt.',
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mi-6',
        title: 'Dividend Aristocrats: 7 Blue-Chip Companies Delivering Consistent Cash Income',
        category: 'STOCK MARKET',
        author: { name: 'JEFF ROSE, CFP' },
        date: 'July 24, 2026',
        excerpt: 'Discover stable equities with over 25 consecutive years of dividend payout increases for long-term compound growth.',
        imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mi-7',
        title: 'Bond Market Signals: What Treasury Yield Curves Are Telling Equity Traders Today',
        category: 'BONDS',
        author: { name: 'MICHAEL VANCE' },
        date: 'July 24, 2026',
        excerpt: 'Analyzing term premiums and inflation expectations to forecast sector rotation into defensives.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mi-8',
        title: 'Commodity Surge: Copper and Industrial Metals Gain Ground on Grid Expansion',
        category: 'COMMODITIES',
        author: { name: 'KENNETH CHEN' },
        date: 'July 23, 2026',
        excerpt: 'Global electrification demands push physical commodity prices to multi-month highs.',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mi-9',
        title: 'Direct Indexing Adoption Soars as Investors Seek Customized Tax-Loss Harvesting',
        category: 'INVESTING',
        author: { name: 'RACHEL VANCE' },
        date: 'July 23, 2026',
        excerpt: 'Financial technology platforms democratize custom equity portfolios for retail and family office accounts.',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mi-10',
        title: 'Small-Cap Growth Stocks Demonstrate Surprising Relative Strength',
        category: 'EQUITIES',
        author: { name: 'BEN ANGEL' },
        date: 'July 22, 2026',
        excerpt: 'Russell 2000 constituents rally as domestic credit conditions ease and earnings revisions turn positive.',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'economy': {
    title: 'Economy',
    description: 'Federal Reserve policy, inflation benchmarks, GDP updates, employment data, and consumer trends.',
    articles: [
      {
        id: 'eco-1',
        title: 'Federal Reserve Signals Steady Interest Rates as Consumer Inflation Data Normalizes',
        category: 'MACROECONOMICS',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 28, 2026',
        excerpt: 'Central bank officials emphasize data-driven policy adjustments amidst steady labor market indicators.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'eco-2',
        title: 'US GDP Growth Exceeds Forecasts as Consumer Spending Holds Resilient',
        category: 'ECONOMY',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 27, 2026',
        excerpt: 'Strong domestic demand and business investment in technology equipment provided robust economic momentum.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'eco-3',
        title: 'Labor Market Report Highlights Solid Job Creation in Healthcare and Technology Sectors',
        category: 'EMPLOYMENT',
        author: { name: 'DR. KERRY MITCHELL BROWN' },
        date: 'July 26, 2026',
        excerpt: 'Unemployment stays low while real wage gains support middle-income household balance sheets.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'eco-4',
        title: 'Global Inflation Gauges Soften Across Major G7 Economies',
        category: 'GLOBAL ECONOMY',
        author: { name: 'NATHALIE GOLDSTEIN' },
        date: 'July 25, 2026',
        excerpt: 'Easing energy prices and improved logistics efficiency bring worldwide headline inflation back toward target bands.',
        imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'eco-5',
        title: 'Consumer Confidence Index Climbs to Highest Level in 18 Months',
        category: 'CONSUMER SPENDING',
        author: { name: 'DAN BOVA' },
        date: 'July 25, 2026',
        excerpt: 'Stabilizing price tags and sustained employment boost household purchasing plans for travel and retail.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'eco-6',
        title: 'Shelter Cost Inflation Eases, Removing Primary Driver of Core CPI Surges',
        category: 'INFLATION',
        author: { name: 'MARKO KLING' },
        date: 'July 24, 2026',
        excerpt: 'Increased rental housing completions nationwide curb lease rate increases across major metro areas.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'eco-7',
        title: 'Central Banks Maintain Liquidity Swap Lines to Protect International Trade Flows',
        category: 'MONETARY POLICY',
        author: { name: 'MATT MCCUE' },
        date: 'July 24, 2026',
        excerpt: 'Global central monetary authorities coordinate swap frameworks to prevent currency volatility in export corridors.',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'eco-8',
        title: 'Real Wage Gains Exceed Price Growth for Fifth Consecutive Quarter',
        category: 'LABOR MARKET',
        author: { name: 'BAYO AKINOLA-ODUSOLA' },
        date: 'July 23, 2026',
        excerpt: 'Purchasing power improvements sustain economic expansion without triggering secondary inflationary pressures.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'eco-9',
        title: 'Industrial Production and Factory Orders Turn Positive Across US Heartlands',
        category: 'MANUFACTURING',
        author: { name: 'JOE CECALA' },
        date: 'July 23, 2026',
        excerpt: 'Domestic re-industrialization investments begin delivering output growth in capital machinery and automotive assembly.',
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'eco-10',
        title: 'Small Business Revenue Growth Forecasts Rise as Credit Costs Stabilize',
        category: 'SMALL BUSINESS ECONOMY',
        author: { name: 'GEORGI TODOROV' },
        date: 'July 22, 2026',
        excerpt: 'Independent merchants express growing optimism around capital expansion and seasonal hiring.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'corporate-news': {
    title: 'Corporate News',
    description: 'Company announcements, mergers & acquisitions, quarterly earnings, and executive leadership appointments.',
    articles: [
      {
        id: 'corp-1',
        title: 'Tech Giant Announces $12 Billion M&A Deal to Expand Cloud Compute Infrastructure',
        category: 'MERGERS & ACQUISITIONS',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 28, 2026',
        excerpt: 'The strategic acquisition unites enterprise AI software platforms with global data center capacity to accelerate enterprise adoption.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'corp-2',
        title: 'Fortune 500 Retailer Beats Q2 Earnings Estimates on Strong Digital Sales',
        category: 'QUARTERLY EARNINGS',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 28, 2026',
        excerpt: 'Automated fulfillment centers and omnichannel loyalty initiatives drove 18% net profit margin expansion.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'corp-3',
        title: 'Global Automotive Manufacturer Appoints New CEO to Lead Autonomous Vehicle Transition',
        category: 'EXECUTIVE APPOINTMENTS',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 27, 2026',
        excerpt: 'The veteran industry executive brings two decades of software-defined vehicle engineering expertise to the corner office.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'corp-4',
        title: 'Logistics Titan Commits $3.5B to Fleet Electrification and Warehouse Automation',
        category: 'COMPANY ANNOUNCEMENTS',
        author: { name: 'DAN BOVA' },
        date: 'July 27, 2026',
        excerpt: 'Next-generation robotics and zero-emission delivery vans will streamline last-mile delivery across 50 metro markets.',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'corp-5',
        title: 'Biotech Leader Secures FDA Approval for Breakthrough Precision Oncology Drug',
        category: 'CORPORATE DEVELOPMENTS',
        author: { name: 'MERILEE KERN, MBA' },
        date: 'July 26, 2026',
        excerpt: 'Phase III clinical trials demonstrated unprecedented response rates, sending commercialization partnerships soaring.',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'corp-6',
        title: 'Aerospace Pioneer Forms Strategic Joint Venture for Commercial Space Cargo Logistics',
        category: 'JOINT VENTURES',
        author: { name: 'MATT DOMO' },
        date: 'July 26, 2026',
        excerpt: 'The multi-billion dollar agreement connects satellite internet constellation providers with heavy-lift rocket manufacturers.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'corp-7',
        title: 'Global Media Conglomerate Streamlines Digital Division to Focus on Direct Streaming Profits',
        category: 'CORPORATE RESTRUCTURING',
        author: { name: 'EMILY RELLA' },
        date: 'July 25, 2026',
        excerpt: 'Consolidating operational units into core IP content engines aims to reduce annual overhead by $800 million.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'corp-8',
        title: 'Consumer Brand Expands Global Store Footprint with 150 Flagship Locations in Asia',
        category: 'GLOBAL EXPANSION',
        author: { name: 'TRACY STAPP HEROLD' },
        date: 'July 25, 2026',
        excerpt: 'Direct retail expansion in key metropolitan centers boosts brand visibility and international wholesale revenue.',
        imageUrl: 'https://images.unsplash.com/photo-1542744801-43245f100e04?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'corp-9',
        title: 'Energy Corporation Announces $4B Clean Hydrogen Processing Facility in Texas',
        category: 'COMPANY ANNOUNCEMENTS',
        author: { name: 'DAVID MILLER' },
        date: 'July 24, 2026',
        excerpt: 'The industrial facility will supply green fuel to regional manufacturing plants and heavy transport fleets.',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'corp-10',
        title: 'Semiconductor Giant Begins Construction on Advanced Microchip Fab Unit',
        category: 'CORPORATE INVESTMENT',
        author: { name: 'REID ZEISING' },
        date: 'July 24, 2026',
        excerpt: 'State-of-the-art 2nm fabrication technology will produce high-efficiency processors for AI servers and mobile hardware.',
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'startups-entrepreneurship': {
    title: 'Startups & Entrepreneurship',
    description: 'New startups, founder stories, venture funding rounds, accelerators, and business innovation.',
    articles: [
      {
        id: 'start-1',
        title: 'How Two College Founders Raised a $25 Million Series A to Revolutionize Enterprise Security',
        category: 'FOUNDER STORIES',
        author: { name: 'AMANDA BREEN' },
        date: 'July 28, 2026',
        excerpt: 'Starting from a dorm room experiment, this cybersecurity startup scaled to 500 enterprise customers in 18 months.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'start-2',
        title: 'Top 10 Standout Companies From Y Combinator’s Latest Demo Day Cohort',
        category: 'ACCELERATORS',
        author: { name: 'EMILY RELLA' },
        date: 'July 28, 2026',
        excerpt: 'From autonomous biotech research bots to instant cross-border settlement, meet the newest batch of high-growth startups.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'start-3',
        title: 'The Bootstrapping Blueprint: How This Founder Built a $10M ARR SaaS Without Raising a Dollar of VC',
        category: 'BOOTSTRAPPING',
        author: { name: 'BEN ANGEL' },
        date: 'July 27, 2026',
        excerpt: 'Relentless customer feedback loops, capital discipline, and product-led growth allowed this founder to keep 100% equity.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'start-4',
        title: 'Early-Stage AI Startup Secures $15M Seed Round Led by Tier-1 Silicon Valley VCs',
        category: 'FUNDING ROUNDS',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 27, 2026',
        excerpt: 'The company’s novel agentic workflow engine helps legal and financial teams automate complex compliance audits.',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'start-5',
        title: 'From Garage Project to Global Market Leader: Essential Lessons on Finding Product-Market Fit',
        category: 'INNOVATION',
        author: { name: 'JOEY STIVER' },
        date: 'July 26, 2026',
        excerpt: 'Why early iteration velocity and speaking directly with churned users matter more than expensive launch PR campaigns.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'start-6',
        title: 'Why Solo Founders Are Building High-Margin Micro-SaaS Platforms in 2026',
        category: 'NEW STARTUPS',
        author: { name: 'GEORGI TODOROV' },
        date: 'July 26, 2026',
        excerpt: 'AI development stacks allow single builders to ship, market, and manage software products hitting $30k/month MRR.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'start-7',
        title: 'Pitch Deck Teardown: What 50 Pitch Sessions Taught Me About Raising Angel Capital',
        category: 'FUNDRAISING',
        author: { name: 'JOE CECALA' },
        date: 'July 25, 2026',
        excerpt: 'Investors review hundreds of decks a week. Here is the exact slide sequence that gets follow-up partner meetings.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'start-8',
        title: 'Deep Tech Startup Unveils Modular Robotics System for Warehouse Automation',
        category: 'STARTUP INNOVATION',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 25, 2026',
        excerpt: 'Combining vision AI with soft robotics arms enables sorting fragile e-commerce inventory with 99.9% accuracy.',
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'start-9',
        title: 'Female-Founded Startups Capture Record Share of Early-Stage Venture Allocations',
        category: 'VENTURE REPORT',
        author: { name: 'DR. KERRY MITCHELL BROWN' },
        date: 'July 24, 2026',
        excerpt: 'Data shows higher capital efficiency and stronger long-term unit economics across female-led tech ventures.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'start-10',
        title: 'The Art of the Strategic Startup Pivot: How to Save a Business When Plan A Fails',
        category: 'STARTUP STRATEGY',
        author: { name: 'AYTEKIN TANK' },
        date: 'July 24, 2026',
        excerpt: 'Recognizing market friction early and repositioning your core technology can turn near-failure into explosive growth.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'banking-finance': {
    title: 'Banking & Finance',
    description: 'Commercial banking, loans, digital finance platforms, FinTech startups, and capital markets.',
    articles: [
      {
        id: 'bank-1',
        title: 'Regional Commercial Banks Expand Credit Lines for Growing Small Businesses',
        category: 'COMMERCIAL BANKING',
        author: { name: 'DAN BOVA' },
        date: 'July 28, 2026',
        excerpt: 'Enhanced credit liquidity and streamlined underwriting criteria provide capital support for middle-market expansion.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bank-2',
        title: 'FinTech Startup Unveils Real-Time B2B Cross-Border Settlement Infrastructure',
        category: 'FINTECH',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 28, 2026',
        excerpt: 'Eliminating legacy correspondent banking delays cuts international wire settlement times from days to seconds.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bank-3',
        title: 'Digital Banking Adoption Surges 40% as Small Businesses Demand Integrated Treasury Tools',
        category: 'DIGITAL BANKING',
        author: { name: 'MARKO KLING' },
        date: 'July 27, 2026',
        excerpt: 'Automated cash management, virtual corporate cards, and instant payroll integration lead business banking preference.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bank-4',
        title: 'Credit Unions Deploy AI Risk Models to Accelerate Commercial Loan Processing',
        category: 'FINANCIAL SERVICES',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 27, 2026',
        excerpt: 'Automating financial document verification reduces approval turnaround from weeks to less than 48 hours.',
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bank-5',
        title: 'Central Bank Digital Payments Framework Shows High Efficiency in Merchant Pilot',
        category: 'PAYMENT SYSTEMS',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 26, 2026',
        excerpt: 'Direct digital clearing reduces interchange fees for small retailers while boosting transaction security.',
        imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bank-6',
        title: 'How Next-Gen Business Accounts Are Combining Savings Yields With Smart Accounting software',
        category: 'FINANCIAL TECH',
        author: { name: 'BEN ANGEL' },
        date: 'July 26, 2026',
        excerpt: 'Founders can earn money market interest rates on operational balances while auto-syncing tax ledgers.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bank-7',
        title: 'Commercial Credit Markets Rebound as Yield Spread Compression Encourages Borrowing',
        category: 'CREDIT MARKETS',
        author: { name: 'JEFF ROSE, CFP' },
        date: 'July 25, 2026',
        excerpt: 'Investment-grade corporate debt issuance sets monthly volume record amid strong institutional demand.',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bank-8',
        title: 'Open Banking Protocols Open New Avenues for Embedded Working Capital Loans',
        category: 'FINTECH LOANS',
        author: { name: 'RACHEL VANCE' },
        date: 'July 25, 2026',
        excerpt: 'E-commerce platforms integrate instant merchant financing based on real-time storefront revenue streams.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bank-9',
        title: 'Wealth Advisory Firms Leverage Predictive Analytics for Automated Tax-Loss Harvesting',
        category: 'FINANCIAL ADVISORY',
        author: { name: 'MERILEE KERN, MBA' },
        date: 'July 24, 2026',
        excerpt: 'Algorithmic tax management preserves net capital yields for business owners planning liquidity events.',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bank-10',
        title: 'Managing Business Debt: Expert Guidance on Refinancing High-Interest Commercial Loans',
        category: 'SMALL BUSINESS LOANS',
        author: { name: 'MATT MCCUE' },
        date: 'July 24, 2026',
        excerpt: 'How to structure debt service coverage ratios and negotiate lower margin spreads with commercial lenders.',
        imageUrl: 'https://images.unsplash.com/photo-1542744801-43245f100e04?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'technology-ai': {
    title: 'Technology & AI',
    description: 'Artificial Intelligence, enterprise software, cloud infrastructure, cybersecurity, robotics, and automation.',
    articles: [
      {
        id: 'tech-1',
        title: "This Breakthrough Technology Is Poised to Accelerate Your Company's Growth",
        category: 'BUILDING A BUSINESS',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 28, 2026',
        excerpt: 'Discover a breakthrough technology stacked on top of generative AI, now poised to revolutionize corporate operations.',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'tech-2',
        title: 'The Practical Way Agentic AI is Helping This Growing Beverage Brand Scale Fast',
        category: 'TECH',
        author: { name: 'REID ZEISING' },
        date: 'July 27, 2026',
        excerpt: "BERO's one-person data team used agentic AI to build an automated insights platform that runs logistics.",
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'tech-3',
        title: 'Autonomous AI Agents Are Transforming Enterprise Customer Support Workflows',
        category: 'ARTIFICIAL INTELLIGENCE',
        author: { name: 'BEN ANGEL' },
        date: 'July 26, 2026',
        excerpt: 'Next-generation agents handle multi-step issue resolutions without human intervention, dropping ticket resolution times by 80%.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'tech-4',
        title: 'Cybersecurity Threat Report: Why Zero-Trust Architecture Is Essential for Distributed Teams',
        category: 'CYBERSECURITY',
        author: { name: 'MATT DOMO' },
        date: 'July 26, 2026',
        excerpt: 'Identity verification protocols protect sensitive cloud infrastructure against targeted social engineering attacks.',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'tech-5',
        title: 'Enterprise Cloud Optimization: How CTOs Are Controlling Multi-Cloud Spend',
        category: 'CLOUD COMPUTING',
        author: { name: 'RACHEL VANCE' },
        date: 'July 25, 2026',
        excerpt: 'FinOps frameworks and automated instance right-sizing prevent runaway cloud infrastructure bills.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'tech-6',
        title: 'Next-Gen Robotics in Manufacturing: AI-Powered Inspection Lines Reduce Defect Rates',
        category: 'ROBOTICS',
        author: { name: 'KENNETH CHEN' },
        date: 'July 25, 2026',
        excerpt: 'High-speed computer vision systems audit micro-components in real-time, boosting production throughput.',
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'tech-7',
        title: 'Quantum Computing Milestones: Financial Firms Test Quantum-Resistant Encryption Standards',
        category: 'FUTURE TECH',
        author: { name: 'EMILY RELLA' },
        date: 'July 24, 2026',
        excerpt: 'Post-quantum cryptographic algorithms prepare global banking ledgers for future computing capabilities.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'tech-8',
        title: 'AI Code Generation Tools Double Developer Throughput in Enterprise SaaS Engineering',
        category: 'SOFTWARE DEVELOPMENT',
        author: { name: 'AYTEKIN TANK' },
        date: 'July 24, 2026',
        excerpt: 'Automating repetitive boilerplate code allows senior engineers to focus on architectural design and system safety.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'tech-9',
        title: 'Edge AI Chips Enable Real-Time Analytics Without High-Latency Cloud Roundtrips',
        category: 'HARDWARE',
        author: { name: 'DEEDRA DETERMAN' },
        date: 'July 23, 2026',
        excerpt: 'Processing inference directly on local hardware devices enhances data privacy and response speed.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'tech-10',
        title: 'Corporate AI Governance Frameworks: Setting Ethical Rules for Employee AI Use',
        category: 'AI ETHICS',
        author: { name: 'DR. KERRY MITCHELL BROWN' },
        date: 'July 23, 2026',
        excerpt: 'Clear policy guidelines prevent intellectual property leaks while promoting responsible internal experimentation.',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'real-estate': {
    title: 'Real Estate',
    description: 'Housing market, commercial property, construction, property investment, mortgages, and proptech.',
    articles: [
      {
        id: 're-1',
        title: "She Was Told 'Who's Going to Give You Business?' Now She's a Top Home Inspector in Brooklyn",
        category: 'BUYING A FRANCHISE',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 28, 2026',
        excerpt: 'Overcoming industry skepticism, this founder built a high-margin property inspection franchise.',
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 're-2',
        title: 'Commercial Office Block Conversions: How Investors Are Redeveloping Urban Hubs into Mixed-Use Units',
        category: 'REAL ESTATE',
        author: { name: 'DAN BOVA' },
        date: 'July 27, 2026',
        excerpt: 'Architectural firms and private equity groups collaborate to turn vacant city properties into high-yield residential spaces.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 're-3',
        title: 'Residential Housing Inventory Rises as Mortgage Rate Fluctuations Moderate Buyer Demand',
        category: 'HOUSING MARKET',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 26, 2026',
        excerpt: 'More balanced supply and demand conditions give homebuyers improved negotiating power across key sub-markets.',
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 're-4',
        title: 'Industrial Logistics Real Estate Demand Surges Near Major Cargo Hubs',
        category: 'COMMERCIAL PROPERTY',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 26, 2026',
        excerpt: 'Cold storage facilities and fulfillment warehouses command premium lease rates from e-commerce operators.',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 're-5',
        title: 'PropTech Innovations: AI Valuation Engines Streamline Commercial Property Underwriting',
        category: 'PROPTECH',
        author: { name: 'MERILEE KERN, MBA' },
        date: 'July 25, 2026',
        excerpt: 'Automated geospatial data analysis speeds up property appraisal and loan origination for real estate lenders.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 're-6',
        title: 'Real Estate Investment Trusts (REITs) Post Strong Dividend Yields in Q2',
        category: 'PROPERTY INVESTMENT',
        author: { name: 'JEFF ROSE, CFP' },
        date: 'July 25, 2026',
        excerpt: 'Healthcare and data center REITs outperform traditional retail property trusts in portfolio total returns.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 're-7',
        title: 'Modular Off-Site Construction Reduces Building Costs and Construction Timelines by 30%',
        category: 'CONSTRUCTION',
        author: { name: 'KENNETH CHEN' },
        date: 'July 24, 2026',
        excerpt: 'Factory-built timber and steel structures help developers address affordable housing shortages rapidly.',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 're-8',
        title: 'Suburban Tech Hub Expansion Drives Commercial Real Estate Boom in Secondary Cities',
        category: 'COMMERCIAL REAL ESTATE',
        author: { name: 'TRACY STAPP HEROLD' },
        date: 'July 24, 2026',
        excerpt: 'High quality of life and tax-friendly policies attract mid-sized enterprises relocating corporate headquarters.',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 're-9',
        title: 'Mortgage Rate Outlook: What Financial Analysts Expect for Fall 2026 Buyers',
        category: 'MORTGAGES',
        author: { name: 'MATT MCCUE' },
        date: 'July 23, 2026',
        excerpt: 'Benchmark yield stabilizing forecasts suggest favorable refinancing conditions ahead for commercial and home loans.',
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 're-10',
        title: 'Green Building Retrofits Increase Commercial Building Valuation and Tenant Retention',
        category: 'SUSTAINABLE PROPERTY',
        author: { name: 'DAVID MILLER' },
        date: 'July 23, 2026',
        excerpt: 'Installing solar arrays and smart HVAC control systems lowers operating expenses while achieving ESG targets.',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'international-business': {
    title: 'International Business',
    description: 'Global trade, cross-border commerce, imports & exports, international companies, and supply chains.',
    articles: [
      {
        id: 'intl-1',
        title: 'Global Supply Chains Shift Toward Nearshoring to Safeguard Cross-Border Freight',
        category: 'SUPPLY CHAINS',
        author: { name: 'KENNETH CHEN' },
        date: 'July 28, 2026',
        excerpt: 'Multinational corporations re-route logistics corridors closer to end-consumer markets to mitigate geopolitical risk.',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'intl-2',
        title: 'New Trade Frameworks Streamline Cross-Border Digital Commerce Across LatAm',
        category: 'GLOBAL TRADE',
        author: { name: 'NATHALIE GOLDSTEIN' },
        date: 'July 28, 2026',
        excerpt: 'Harmonized customs duties and digital payment interoperability expand export markets for growing brands.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'intl-3',
        title: 'How European AI Compliance Standards Impact US Tech Enterprises Expanding Abroad',
        category: 'INTERNATIONAL COMPLIANCE',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 27, 2026',
        excerpt: 'Navigating regulatory requirements requires robust data sovereignty and algorithmic transparency audit frameworks.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'intl-4',
        title: 'Asian Manufacturing Hubs Accelerate High-Precision Robotics and Semiconductor Exports',
        category: 'IMPORTS & EXPORTS',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 27, 2026',
        excerpt: 'Heavy capital investments in automated electronics assembly reinforce regional manufacturing dominance.',
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'intl-5',
        title: 'Foreign Exchange Hedging Strategies for Managing Multi-Currency Cash Flows',
        category: 'INTERNATIONAL FINANCE',
        author: { name: 'JEFF ROSE, CFP' },
        date: 'July 26, 2026',
        excerpt: 'How global business leaders mitigate currency fluctuation risks using forward contracts and natural hedging.',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'intl-6',
        title: 'Cross-Border M&A Volume Rises as Global Companies Acquire Local Market Platforms',
        category: 'INTERNATIONAL COMPANIES',
        author: { name: 'MERILEE KERN, MBA' },
        date: 'July 26, 2026',
        excerpt: 'Acquiring established regional distributors accelerates market entry compared to organic expansion.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'intl-7',
        title: 'The Founder’s Playbook for Launching Subsidiaries in Southeast Asian Growth Markets',
        category: 'GLOBAL EXPANSION',
        author: { name: 'REID ZEISING' },
        date: 'July 25, 2026',
        excerpt: 'Key strategies for navigating local talent hiring, entity formation, and regional joint ventures.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'intl-8',
        title: 'Deep-Water Port Modernization Projects Clear Bottlenecks for Transpacific Freighters',
        category: 'LOGISTICS',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 25, 2026',
        excerpt: 'Automated gantry cranes and AI container tracking double container turnaround speeds.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'intl-9',
        title: 'International Tax Treaties 2026: Avoiding Double Taxation on Cross-Border Revenue',
        category: 'GLOBAL TAX',
        author: { name: 'NATHALIE GOLDSTEIN' },
        date: 'July 24, 2026',
        excerpt: 'Proper entity structuring and transfer pricing documentation safeguard corporate profits from dual taxation.',
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'intl-10',
        title: 'Localization vs Standardization: How Top Consumer Brands Win Overseas Consumers',
        category: 'MARKET ENTRY',
        author: { name: 'DEEDRA DETERMAN' },
        date: 'July 24, 2026',
        excerpt: 'Tailoring product packaging, marketing copy, and pricing to regional cultural preferences drives long-term success.',
        imageUrl: 'https://images.unsplash.com/photo-1542744801-43245f100e04?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'leadership': {
    title: 'Leadership',
    description: 'CEOs, executive management, workplace culture, team productivity, and leadership strategies.',
    articles: [
      {
        id: 'lead-1',
        title: 'Leadership Attention Is the Scarce Resource in Every Growing Company. Here Is How AI Actually Multiplies It.',
        category: 'BUILDING A BUSINESS',
        author: { name: 'REID ZEISING' },
        date: 'July 28, 2026',
        excerpt: 'The leaders pulling ahead are not automating tasks — they are using AI to gain continuous visibility across business functions.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'lead-2',
        title: "Silence in a Meeting Isn't Alignment. It's Fear. Here's How to Build a Team That Tells You the Truth",
        category: 'THOUGHT LEADERS',
        author: { name: 'AYTEKIN TANK' },
        date: 'July 27, 2026',
        excerpt: 'Creating psychological safety in leadership meetings accelerates problem solving and prevents costly execution mistakes.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'lead-3',
        title: 'Why High-Performing Executives Are Prioritizing Radical Transparency Over Command-and-Control',
        category: 'CEOS',
        author: { name: 'JOE CECALA' },
        date: 'July 26, 2026',
        excerpt: 'Sharing raw financial metrics and strategic challenges builds deep organizational alignment and trust.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'lead-4',
        title: 'The 4-Day Workweek Experiment: What 50 Companies Learned About Output and Retention',
        category: 'WORKPLACE CULTURE',
        author: { name: 'DR. KERRY MITCHELL BROWN' },
        date: 'July 26, 2026',
        excerpt: 'Streamlining meeting overhead and focusing on clear output metrics produced higher quality work without burnout.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'lead-5',
        title: 'How Great Leaders Manage Conflict and Build Resilient Cross-Functional Teams',
        category: 'TEAM MANAGEMENT',
        author: { name: 'BAYO AKINOLA-ODUSOLA' },
        date: 'July 25, 2026',
        excerpt: 'Turning creative friction into collaborative breakthroughs requires clear role boundaries and shared accountability.',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'lead-6',
        title: 'Emotional Intelligence in C-Suite Coaching: The Key Driver of Executive Retention',
        category: 'LEADERSHIP STRATEGIES',
        author: { name: 'MERILEE KERN, MBA' },
        date: 'July 25, 2026',
        excerpt: 'Developing self-awareness and active listening habits improves decision-making in high-pressure environments.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'lead-7',
        title: 'Decisive Leadership Under Uncertainty: A Framework for Tech Founders Facing Market Volatility',
        category: 'EXECUTIVE DECISIONS',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 24, 2026',
        excerpt: 'How to make two-way door decisions rapidly while protecting core enterprise capital.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'lead-8',
        title: 'Cultivating Internal Innovation: How Forward-Thinking Companies Encourage Intrapreneurship',
        category: 'COMPANY CULTURE',
        author: { name: 'DAN BOVA' },
        date: 'July 24, 2026',
        excerpt: 'Allocating 10% of team time to experimental projects yields breakthrough internal tools and product lines.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'lead-9',
        title: 'Overcoming Founder Fatigue: How to Delegate Core Operations Without Losing Control',
        category: 'PRODUCTIVITY',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 23, 2026',
        excerpt: 'Hiring experienced COOs and setting key performance indicators lets founders focus on long-term strategy.',
        imageUrl: 'https://images.unsplash.com/photo-1542744801-43245f100e04?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'lead-10',
        title: 'Inclusive Leadership Practices That Drive High Performance and Employee Engagement',
        category: 'LEADERSHIP',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 23, 2026',
        excerpt: 'Fostering diverse perspectives across project boards leads to better risk management and product design.',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'marketing-branding': {
    title: 'Marketing & Branding',
    description: 'Advertising campaigns, social media strategies, brand identity, customer acquisition, and digital marketing.',
    articles: [
      {
        id: 'mktg-1',
        title: 'Why Performance Marketing Alone Is Failing Brands — And Why Brand Equity Is Back',
        category: 'BRANDING',
        author: { name: 'DEEDRA DETERMAN' },
        date: 'July 28, 2026',
        excerpt: 'Rising customer acquisition costs make brand storytelling and organic trust building essential for long-term margins.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mktg-2',
        title: 'The Social Search Era: How Next-Gen Audiences Find Products via Short-Form Video',
        category: 'SOCIAL MEDIA',
        author: { name: 'EMILY RELLA' },
        date: 'July 28, 2026',
        excerpt: 'Optimizing video descriptions and user-generated social proof generates higher conversion rates than static ads.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mktg-3',
        title: 'The Modern CAC Playbook: 5 Channels Outperforming Standard Paid Social Ads in 2026',
        category: 'CUSTOMER ACQUISITION',
        author: { name: 'GEORGI TODOROV' },
        date: 'July 27, 2026',
        excerpt: 'Podcast sponsorships, community newsletter features, and partner co-marketing yield superior ROI.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mktg-4',
        title: 'B2B Video Marketing: How Authentic Founder-Led Content Drives Enterprise Pipeline',
        category: 'DIGITAL MARKETING',
        author: { name: 'BEN ANGEL' },
        date: 'July 27, 2026',
        excerpt: 'Unfiltered executive video breakdowns build immediate authority and shorten long enterprise sales cycles.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mktg-5',
        title: 'Rebranding Case Study: How a 30-Year-Old Enterprise Modernized Its Brand Identity',
        category: 'ADVERTISING',
        author: { name: 'MERILEE KERN, MBA' },
        date: 'July 26, 2026',
        excerpt: 'Updating visual guidelines and product positioning re-energized customer perception without alienating legacy users.',
        imageUrl: 'https://images.unsplash.com/photo-1542744801-43245f100e04?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mktg-6',
        title: 'AI-Powered Personalization: Delivering Custom Campaign Copy at Enterprise Scale',
        category: 'MARKETING TECH',
        author: { name: 'RACHEL VANCE' },
        date: 'July 26, 2026',
        excerpt: 'Dynamic content engines tailor email lifecycle messaging to individual user browsing behaviors.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mktg-7',
        title: 'Micro-Influencer Strategy: Why Brands Are Shifting Budget to Niche Subject Creators',
        category: 'INFLUENCER MARKETING',
        author: { name: 'AMANDA BREEN' },
        date: 'July 25, 2026',
        excerpt: 'Creators with 5,000 engaged followers deliver 4x higher engagement rates than celebrity accounts.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mktg-8',
        title: 'SEO in the Age of Generative AI Search: Adapting Organic Strategies for Information Queries',
        category: 'SEO',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 25, 2026',
        excerpt: 'Optimizing for AI summary engines requires authoritative original research and structured schema markup.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mktg-9',
        title: 'Building Brand Loyalty: Community-Centric Marketing Models That Drive 80%+ Retention',
        category: 'BRAND STRATEGY',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 24, 2026',
        excerpt: 'Exclusive user forums, VIP customer events, and co-creation panels transform buyers into brand advocates.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'mktg-10',
        title: 'First-Party Data Frameworks: Preparing Your Marketing Stack for Privacy-First Targeting',
        category: 'ADVERTISING',
        author: { name: 'DAN BOVA' },
        date: 'July 24, 2026',
        excerpt: 'Building owned customer data platforms preserves ad retargeting precision amid privacy changes.',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'sustainability-esg': {
    title: 'Sustainability (ESG)',
    description: 'Renewable energy, ESG standards, clean tech, green business practices, and sustainable companies.',
    articles: [
      {
        id: 'esg-1',
        title: 'Commercial Solar & Storage Costs Drop 35%, Accelerating Enterprise Clean Energy Adoption',
        category: 'RENEWABLE ENERGY',
        author: { name: 'DAVID MILLER' },
        date: 'July 28, 2026',
        excerpt: 'On-site solar arrays and battery storage systems provide facility energy resilience while lowering electricity bills.',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'esg-2',
        title: 'Corporate ESG Compliance Standards 2026: What CFOs Need to Prepare for Audits',
        category: 'ESG REPORTING',
        author: { name: 'MERILEE KERN, MBA' },
        date: 'July 28, 2026',
        excerpt: 'Standardized carbon reporting software simplifies Scope 1 and Scope 2 emission disclosures for institutional investors.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'esg-3',
        title: 'Sustainable Supply Chains: How Global Retailers Are Cutting Scope 3 Carbon Emissions',
        category: 'GREEN BUSINESS',
        author: { name: 'KENNETH CHEN' },
        date: 'July 27, 2026',
        excerpt: 'Partnering with eco-certified logistics providers and adopting bio-based packaging reduces footprint across vendor networks.',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'esg-4',
        title: 'The Circular Economy Advantage: Turning Manufacturing Waste Streams into High-Margin Products',
        category: 'SUSTAINABLE COMPANIES',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 27, 2026',
        excerpt: 'Recycling industrial off-cuts and establishing buy-back programs creates new recurring revenue lines.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'esg-5',
        title: 'Climate Tech Venture Allocations Reach $40 Billion Driven by Grid Modernization Deals',
        category: 'CLIMATE TECH',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 26, 2026',
        excerpt: 'Investors back startups scaling thermal energy storage, carbon capture, and smart grid transmission software.',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'esg-6',
        title: 'Smart HVAC and LED Infrastructure Retrofits Deliver Fast Capital Payback for Commercial Landlords',
        category: 'SUSTAINABILITY',
        author: { name: 'DAN BOVA' },
        date: 'July 26, 2026',
        excerpt: 'Automated building management platforms slash operational energy usage by up to 25% annually.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'esg-7',
        title: 'Compostable Packaging Innovations Replace Single-Use Plastics in Consumer Goods',
        category: 'SUSTAINABLE PACKAGING',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 25, 2026',
        excerpt: 'Plant-derived polymers provide durable protective barriers while meeting rigid municipal composting guidelines.',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'esg-8',
        title: 'Corporate Water Stewardship: Tech Giants Invest in Watershed Restoration Projects',
        category: 'ENVIRONMENTAL POLICY',
        author: { name: 'MATT DOMO' },
        date: 'July 25, 2026',
        excerpt: 'Replenishing local water ecosystems offsets data center cooling consumption in drought-prone regions.',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'esg-9',
        title: 'Verifiable Carbon Offsets: How Satellite Monitoring Restores Trust in Voluntary Credit Markets',
        category: 'CARBON CREDITS',
        author: { name: 'BEN ANGEL' },
        date: 'July 24, 2026',
        excerpt: 'Real-time forest canopy radar tracking ensures carbon sequestration claims are backed by physical data.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'esg-10',
        title: 'Commercial Fleet Electrification: Last-Mile Carriers Scale Zero-Emission Vans',
        category: 'GREEN TRANSPORT',
        author: { name: 'GEORGI TODOROV' },
        date: 'July 24, 2026',
        excerpt: 'Depot fast-charging hubs and route optimization software maximize daily vehicle range and uptime.',
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'company-profiles': {
    title: 'Company Profiles',
    description: 'In-depth profiles of successful companies, business models, historical milestones, and scale-up strategies.',
    articles: [
      {
        id: 'cp-1',
        title: 'Inside the Business Model of OpenAI: From Non-Profit Lab to Enterprise AI Titan',
        category: 'BUSINESS MODELS',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 28, 2026',
        excerpt: 'How capped-profit governance, compute partnerships, and API subscriptions built a generational tech enterprise.',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'cp-2',
        title: 'The Growth Story of Stripe: How Two Brothers Built a $70B Global Payment Engine',
        category: 'COMPANY HISTORY',
        author: { name: 'AMANDA BREEN' },
        date: 'July 28, 2026',
        excerpt: 'Relentless focus on seven lines of developer code launched the infrastructure powering internet commerce.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'cp-3',
        title: 'How Airbnb Redefined Travel and Built a High-Margin Hospitality Platform',
        category: 'SUCCESSFUL COMPANIES',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 27, 2026',
        excerpt: 'Design-led product iteration, host community building, and brand resilience powered their global scale.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'cp-4',
        title: 'Figma’s Scale-Up Story: How Browser-Based Design Software Outmaneuvered Legacy Giants',
        category: 'GROWTH STORIES',
        author: { name: 'BEN ANGEL' },
        date: 'July 27, 2026',
        excerpt: 'Multi-player web technology and community plugin ecosystems created an unbeatable competitive moat.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'cp-5',
        title: 'The Bootstrapped Unicorn: How Mailchimp Hit $700M Revenue Before Acquisition',
        category: 'COMPANY PROFILES',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 26, 2026',
        excerpt: 'Freemium email marketing, iconic brand voice, and focus on small business owners created immense equity.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'cp-6',
        title: 'Chipotle’s Operational Turnaround Blueprint: Restoring Customer Trust and Scaling Digital Sales',
        category: 'CASE STUDY',
        author: { name: 'DAN BOVA' },
        date: 'July 26, 2026',
        excerpt: 'Second-line digital assembly kitchens and supply chain traceability powered historic store margin expansion.',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'cp-7',
        title: 'SpaceX Business Teardown: Commercial Satellite Launches, Starlink, and Mars Visions',
        category: 'AEROSPACE PROFILE',
        author: { name: 'MATT DOMO' },
        date: 'July 25, 2026',
        excerpt: 'Reusable rocket booster technology lowered orbital launch costs by 90%, reshaping global space commerce.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'cp-8',
        title: 'How Patagonia Built a Billion-Dollar Outdoor Brand on Uncompromising Environmental Ethics',
        category: 'BRAND PROFILE',
        author: { name: 'MERILEE KERN, MBA' },
        date: 'July 25, 2026',
        excerpt: 'Proving that radical environmental stewardship and premium product craftsmanship drive customer devotion.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'cp-9',
        title: 'Nvidia’s 30-Year Evolution: From Gaming Graphics Pioneer to AI Compute Engine',
        category: 'TECH HISTORY',
        author: { name: 'REID ZEISING' },
        date: 'July 24, 2026',
        excerpt: 'Early bets on CUDA software libraries laid the groundwork for dominating modern deep learning workloads.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'cp-10',
        title: 'Behind Spotify’s Growth Engine: Playlists, Podcast Exclusive Investments, and Audiobooks',
        category: 'MEDIA PROFILES',
        author: { name: 'EMILY RELLA' },
        date: 'July 24, 2026',
        excerpt: 'Personalized recommendation algorithms turned music streaming into an essential daily audio utility.',
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'ceo-interviews': {
    title: 'CEO Interviews',
    description: 'Exclusive 1-on-1 conversations with top executives, founder discussions, and leadership insights.',
    articles: [
      {
        id: 'ceo-1',
        title: "The Founder of Chipotle Says Customers Have 'Slop Bowl' Fatigue — Here's What He Says Is Next",
        category: 'EXECUTIVE INTERVIEWS',
        author: { name: 'JONATHAN SMALL' },
        date: 'July 28, 2026',
        excerpt: 'Steve Ells invented the Chipotle bowl in 2003. Now he believes the future of fast-casual relies on slow-roasted artisanal concepts.',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ceo-2',
        title: "Nvidia CEO Jensen Huang Says AI Hype Is Fueling Fear: 'We're Scaring People'",
        category: 'LEADERSHIP INSIGHTS',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 27, 2026',
        excerpt: 'Huang urged caution in how AI leaders speak about the technology as capability curves accelerate across industries.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ceo-3',
        title: 'Exclusive Q&A: Microsoft CEO Satya Nadella on Enterprise AI Integration and Future Work',
        category: 'CEO INTERVIEWS',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 26, 2026',
        excerpt: 'Nadella shares insights on how Copilot tools boost organizational velocity and why human judgment remains paramount.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ceo-4',
        title: 'Shopify CEO Tobi Lütke on Why Simplicity Is the Ultimate Strategic Advantage for Merchants',
        category: 'FOUNDER DISCUSSIONS',
        author: { name: 'BEN ANGEL' },
        date: 'July 26, 2026',
        excerpt: 'Lütke explains why stripping away software bloat lets entrepreneurs focus on product quality and customer connection.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ceo-5',
        title: 'General Motors CEO Mary Barra on Leading a Legacy Manufacturer Through Technological Shift',
        category: 'EXECUTIVE LEADERSHIP',
        author: { name: 'MERILEE KERN, MBA' },
        date: 'July 25, 2026',
        excerpt: 'Barra details battery supply chain investments and software-driven vehicle architecture transitions.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ceo-6',
        title: 'AMD CEO Lisa Su on Disruption, Semiconductor Engineering, and Long-Term Market Trust',
        category: 'LEADERSHIP INSIGHTS',
        author: { name: 'REID ZEISING' },
        date: 'July 25, 2026',
        excerpt: 'How execution discipline and chiplet design innovation turned AMD into a high-performance computing powerhouse.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ceo-7',
        title: 'Salesforce CEO Marc Benioff Discusses Autonomous Agent Platforms and Business Ethics',
        category: 'TECH INTERVIEWS',
        author: { name: 'DAN BOVA' },
        date: 'July 24, 2026',
        excerpt: 'Benioff lays out his vision for Agentforce software and why trust must be engineered into every business workflow.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ceo-8',
        title: 'Starbucks CEO on Refocusing Store Culture and Speeding Up Beverage Service',
        category: 'RETAIL INTERVIEWS',
        author: { name: 'EMILY RELLA' },
        date: 'July 24, 2026',
        excerpt: 'Prioritizing barista training and comfortable store seating to bring back the traditional coffeehouse feel.',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ceo-9',
        title: 'Zoom CEO Eric Yuan Reflects on Post-Pandemic Pivots and Next-Gen Collaborative Workspaces',
        category: 'FOUNDER INTERVIEWS',
        author: { name: 'AYTEKIN TANK' },
        date: 'July 23, 2026',
        excerpt: 'Yuan shares how Zoom expanded beyond video meetings into AI-driven team chat, docs, and contact centers.',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ceo-10',
        title: 'Airbnb CEO Brian Chesky on Design Thinking, Entrepreneurship, and Cultivating Iconic Stays',
        category: 'EXECUTIVE DISCUSSIONS',
        author: { name: 'AMANDA BREEN' },
        date: 'July 23, 2026',
        excerpt: 'Chesky explains why founders should oversee product design details personally to craft magical user experiences.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },

  'research-insights': {
    title: 'Research & Insights',
    description: 'Industry reports, surveys, analytics, market research, and business growth forecasts.',
    articles: [
      {
        id: 'ri-1',
        title: 'State of Small Business 2026 Report: 78% of Founders Increasing Investment in AI Tools',
        category: 'INDUSTRY REPORTS',
        author: { name: 'ENTREPRENEUR STORE' },
        date: 'July 28, 2026',
        excerpt: 'Comprehensive survey data reveals small business adoption of automated customer support, AI copywriting, and workflow tools.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ri-2',
        title: 'Consumer Behavior Survey: Price Sensitivity Shifts Toward Durable Quality and Subscription Value',
        category: 'SURVEYS',
        author: { name: 'REID ZEISING' },
        date: 'July 28, 2026',
        excerpt: 'Analysis of 10,000 retail shoppers shows growing preference for durable products and transparent loyalty pricing.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ri-3',
        title: 'Venture Capital Q2 Benchmark Analysis: Valuation Multiples Stabilize Across B2B SaaS',
        category: 'ANALYTICS',
        author: { name: 'ALBERT SANTALO' },
        date: 'July 27, 2026',
        excerpt: 'Revenue multiples settle near historical averages as investors prioritize net dollar retention and profitability.',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ri-4',
        title: 'Global Workforce Study: Remote Work Flexibility Ranks Ahead of Salary for Top Software Talent',
        category: 'WORKFORCE RESEARCH',
        author: { name: 'DR. KERRY MITCHELL BROWN' },
        date: 'July 27, 2026',
        excerpt: 'Empirical hiring data shows companies offering asynchronous work flexibility achieve 40% lower voluntary turnover.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ri-5',
        title: 'E-Commerce Market Forecast 2026-2030: Mobile Commerce to Account for 70% of Digital Sales',
        category: 'BUSINESS FORECASTS',
        author: { name: 'GEORGI TODOROV' },
        date: 'July 26, 2026',
        excerpt: 'One-click digital wallet checkouts and social shopping feeds drive explosive mobile transaction volume growth.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ri-6',
        title: 'Cybersecurity Incident Analytics: Ransomware Threats Target Mid-Market Manufacturing Firms',
        category: 'MARKET RESEARCH',
        author: { name: 'MATT DOMO' },
        date: 'July 26, 2026',
        excerpt: 'Industrial security audit reveals vulnerability patterns and essential steps for securing connected plant machinery.',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ri-7',
        title: 'Enterprise Cloud Spending Report: 62% of IT Budgets Allocated to Generative AI Infrastructure',
        category: 'TECH INSIGHTS',
        author: { name: 'RACHEL VANCE' },
        date: 'July 25, 2026',
        excerpt: 'Quarterly enterprise survey shows rapid shift from experimental AI pilots to production data pipeline scale.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ri-8',
        title: 'Small Business Pricing Power Study: How Top Merchants Adjust Prices Without Losing Customers',
        category: 'ECONOMIC RESEARCH',
        author: { name: 'DAN BOVA' },
        date: 'July 25, 2026',
        excerpt: 'Bundling premium service tiers and emphasizing value transparency protects customer retention during price changes.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ri-9',
        title: 'Commercial Real Estate Forecast: Suburban Office Demand Outpaces Urban Core Properties',
        category: 'PROPERTY ANALYTICS',
        author: { name: 'SHERIN SHIBU' },
        date: 'July 24, 2026',
        excerpt: 'Hybrid workforce trends drive leasing growth in suburban office parks offering ample parking and green space.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ri-10',
        title: 'Creator Economy Financial Benchmarks: Revenue Stream Diversification Among Digital Entrepreneurs',
        category: 'CREATOR INSIGHTS',
        author: { name: 'AMANDA BREEN' },
        date: 'July 24, 2026',
        excerpt: 'Data indicates top content creators generate 60% of revenue from digital products and private communities rather than ads.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
};

// Aggregate all unique topic articles to ensure getArticleById works for any clicked article
const ALL_TOPIC_ARTICLES: Article[] = Object.values(CATEGORY_TOPICS_DATA).flatMap((topic) => topic.articles);

export const ENTREPRENEURS_SECTION_ARTICLES: Article[] = [
  {
    id: 'universities-face-budget-squeeze',
    title: 'Universities Face a Budget Squeeze. Cutting Spending Is Only Part of the Answer.',
    category: 'Entrepreneurs',
    author: { name: 'Ashish Fernando', title: 'Contributor' },
    date: 'October 14, 2026',
    readTime: '5 min read',
    excerpt: "Budget cuts aren't new to higher education, but today's financial pressures are reshaping academic programs, staffing and student services, raising questions about long-term sustainability.",
    imageUrl: '/images/university-budget-cuts.jpg',
    imageAspect: 'video',
  },
  {
    id: '5-magic-phrases-to-be-more-likable',
    title: 'Want to Be More Likable? Just Say These 5 Magic Phrases.',
    category: 'Entrepreneurs',
    author: { name: 'Vanessa Van Edwards', title: 'Contributor' },
    date: 'October 14, 2026',
    readTime: '4 min read',
    excerpt: 'Science-backed phrases and communication tactics to instantly build rapport and connection.',
    imageUrl: '/images/vanessa-van-edwards.jpg',
    imageAspect: 'square',
  },
  {
    id: 'why-high-performers-leave',
    title: "Why High Performers Leave Before You Know They're Gone",
    category: 'Thought Leaders',
    author: { name: 'Gloria St. Martin-Lowry', title: 'Thought Leader' },
    date: 'October 14, 2026',
    readTime: '5 min read',
    excerpt: 'Key retention indicators and workplace dynamics that drive top talent out the door.',
    imageUrl: '/images/top-performers-leave.jpg',
    imageAspect: 'square',
  },
  {
    id: 'college-admissions-red-flag-word',
    title: 'After 35 Years in the College Admissions Business, 1 Red-Flag Word Is Popping Up More Than Ever',
    category: 'Entrepreneurs',
    author: { name: 'Brian Taylor', title: 'Contributor' },
    date: 'October 14, 2026',
    readTime: '6 min read',
    excerpt: 'An insider view on changes in college applications, admissions trends, and what families need to know.',
    imageUrl: '/images/college-admissions.jpg',
    imageAspect: 'square',
  },
];

export const AGENTIC_AI_SECTION_ARTICLES: Article[] = [
  {
    id: 'rushing-to-add-ai',
    title: "Rushing to Add AI Is Wrecking Your Customer Experience. Here's How to Get It Right.",
    category: 'Building a Business',
    author: { name: 'David Boice', title: 'Contributor' },
    date: 'October 14, 2026',
    readTime: '5 min read',
    excerpt: "Every new AI tool creates another touchpoint with your customer. If those tools don't talk to each other, neither does your business.",
    imageUrl: '/images/rushing-ai-cx.jpg',
    imageAspect: 'video',
  },
  {
    id: 'why-coding-agents-work',
    title: "Why Coding Agents Work and Go-to-Market Agents Don't (Yet)",
    category: 'Tech',
    author: { name: 'Henry Schuck', title: 'Contributor' },
    date: 'October 14, 2026',
    readTime: '6 min read',
    excerpt: "Coding agents are transforming software teams overnight, but GTM agents are stuck. It's not an intelligence problem — it's a context problem.",
    imageUrl: '/images/coding-agents.jpg',
    imageAspect: 'video',
  },
  {
    id: 'how-ai-agents-scale-marketing',
    title: 'How AI Agents Are Helping Companies Scale Their Marketing',
    category: 'Tech',
    author: { name: 'Nuri Cankaya', title: 'Contributor' },
    date: 'October 14, 2026',
    readTime: '5 min read',
    excerpt: "Here's how AI agents can help companies scale marketing by combining skills, tools and context into an agentic marketing operating model.",
    imageUrl: '/images/ai-marketing-agents.jpg',
    imageAspect: 'video',
  },
];

export const FRANCHISES_MAIN_SECTION_ARTICLES: Article[] = [
  {
    id: 'daves-hot-chicken',
    title: "Dave's Hot Chicken Started With $900 in a Parking Lot. It Now Has 500 Restaurants.",
    category: 'Buying a Franchise',
    author: { name: 'Jonathan Small', title: 'Editor' },
    date: 'October 14, 2026',
    readTime: '6 min read',
    excerpt: 'The chain has eight openings in one day, deals across Europe and no sign of slowing down.',
    imageUrl: '/images/daves-hot-chicken.jpg',
    imageAspect: 'video',
  },
  {
    id: 'former-engineer-preschool-teacher',
    title: "This Former Engineer and Preschool Teacher Teamed Up to Start a Creative Business: 'Haven't Regretted Choosing a Franchise.'",
    category: 'Buying a Franchise',
    author: { name: 'Sherin Shibu', title: 'Staff Writer' },
    date: 'October 14, 2026',
    readTime: '5 min read',
    excerpt: 'How two entrepreneurs found success investing in a studio franchise.',
    imageUrl: '/images/daves-hot-chicken.jpg',
    imageAspect: 'video',
  },
  {
    id: 'taco-bell-milk-bar-empanada',
    title: 'Taco Bell and Milk Bar Are Stuffing a Birthday Cake Into an Empanada',
    category: 'Buying a Franchise',
    author: { name: 'Jon Small', title: 'Staff Writer' },
    date: 'October 14, 2026',
    readTime: '4 min read',
    excerpt: 'A surprising cross-brand collaboration bringing dessert innovation to national menus.',
    imageUrl: '/images/daves-hot-chicken.jpg',
    imageAspect: 'video',
  },
  {
    id: 'hiltons-ai-trip-planner',
    title: "Hilton's AI Trip Planner Wants To Book Your Travel. Customers Aren't So Sure Yet.",
    category: 'Business News',
    author: { name: 'Jon Small', title: 'Staff Writer' },
    date: 'October 14, 2026',
    readTime: '4 min read',
    excerpt: 'Evaluating hospitality AI tools and whether travellers are ready to let algorithms plan trips.',
    imageUrl: '/images/daves-hot-chicken.jpg',
    imageAspect: 'video',
  },
  {
    id: 'chick-fil-a-healthy-dose-fear',
    title: "As Franchises Go After Chick-fil-A, Its CEO Is Prescribing a 'Healthy Dose of Fear'",
    category: 'Buying a Franchise',
    author: { name: 'Jon Small', title: 'Staff Writer' },
    date: 'October 14, 2026',
    readTime: '5 min read',
    excerpt: 'How industry competitors are challenging drive-thru giants and what leadership advises.',
    imageUrl: '/images/daves-hot-chicken.jpg',
    imageAspect: 'video',
  },
];

export const SIDE_HUSTLE_53_ARTICLE: Article = {
  id: '53-side-hustle-ideas-to-make-extra-money-in-2026',
  slug: '53-side-hustle-ideas-to-make-extra-money-in-2026',
  title: '53 Side Hustle Ideas to Make Extra Money in 2026',
  category: 'Finance & Economics',
  author: {
    name: 'Sherin Shibu',
    title: 'Entrepreneur Staff',
    avatar: '/images/author-sherin.png',
  },
  editor: 'AMANDA BREEN',
  date: 'JAN 26, 2026',
  readTime: '8 min read',
  excerpt: 'From freelancing to selling products, find out how to earn extra income today.',
  imageUrl: '/images/side-hustle-53.jpg',
  imageAspect: 'wide',
};

export const NOT_EVERY_BOSS_ARTICLE: Article = {
  id: 'not-every-boss-deserves-a-thank-you-card',
  slug: 'not-every-boss-deserves-a-thank-you-card',
  title: "Not Every Boss Deserves a Thank-You Card. Here's What to Do When Your Boss Is a Bully.",
  category: 'BUILDING A BUSINESS',
  author: {
    name: 'MITA MALLICK',
    title: 'Contributor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
  },
  editor: 'KARA MCINTYRE',
  date: 'OCT 14, 2026',
  readTime: '4 min read',
  excerpt: "As some of us celebrate National Boss’s Day, it’s important to remember that not everyone has a good relationship with their boss.",
  imageUrl: '/images/category-leadership.png',
  imageAspect: 'wide',
};

export const HOW_GREAT_LEADERS_BUILD_TEAMS_ARTICLE: Article = {
  id: 'how-great-leaders-build-teams-that-thrive',
  slug: 'how-great-leaders-build-teams-that-thrive',
  title: 'How Great Leaders Build Teams That Thrive',
  category: 'Thought Leaders',
  author: {
    name: 'Jissan Cherian',
    title: 'Executive Contributor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  },
  editor: 'AMANDA BREEN',
  date: 'OCT 18, 2026',
  readTime: '6 min read',
  excerpt: "Strong leadership isn't just about making decisions — it's about creating an environment where people can grow, contribute and succeed.",
  imageUrl: '/images/topic-hero-leaders.jpg',
  imageAspect: 'wide',
};

export const POWER_OF_EFFECTIVE_COMMUNICATION_ARTICLE: Article = {
  id: 'power-of-effective-communication-leadership',
  slug: 'power-of-effective-communication-leadership',
  title: 'The Power of Effective Communication in Leadership',
  category: 'Thought Leaders',
  author: {
    name: 'Terry Rice',
    title: 'Contributor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  },
  editor: 'KARA MCINTYRE',
  date: 'OCT 17, 2026',
  readTime: '5 min read',
  excerpt: "Great leaders don't just give direction — they listen, inspire and bring people together.",
  imageUrl: '/images/topic-sub-1.jpg',
  imageAspect: 'wide',
};

export const COLLABORATION_DRIVES_INNOVATION_ARTICLE: Article = {
  id: 'collaboration-drives-innovation-growth',
  slug: 'collaboration-drives-innovation-growth',
  title: 'Collaboration Drives Innovation and Growth',
  category: 'Thought Leaders',
  author: {
    name: 'Ben Angel',
    title: 'Contributor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
  },
  editor: 'AMANDA BREEN',
  date: 'OCT 16, 2026',
  readTime: '5 min read',
  excerpt: "When great minds work together, new ideas turn into real progress.",
  imageUrl: '/images/topic-sub-2.jpg',
  imageAspect: 'wide',
};

export const BEN_ANGEL_ARTICLES: Article[] = [
  {
    id: 'how-to-biohack-your-brain-for-peak-performance',
    slug: 'how-to-biohack-your-brain-for-peak-performance',
    title: 'How to Biohack Your Brain for Peak Focus and Performance',
    category: 'Thought Leaders',
    author: {
      name: 'Ben Angel',
      title: 'Entrepreneur Network Contributor',
      avatar: '/images/more-author-2.jpg',
      bio: "Ben Angel is the author of 'Unstoppable: A 90-Day Plan to Biohack Your Mind and Body for Success'. He has helped thousands of entrepreneurs maximize their cognitive performance and productivity.",
    },
    editor: 'AMANDA BREEN',
    date: '2h ago',
    readTime: '5 min read',
    excerpt: 'Proven neuroscience frameworks to eliminate brain fog, optimize daily cognitive output, and sustain high energy without burnout.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    imageAspect: 'wide',
  },
  {
    id: 'collaboration-drives-innovation-growth',
    slug: 'collaboration-drives-innovation-growth',
    title: 'Collaboration Drives Innovation and Growth',
    category: 'Thought Leaders',
    author: {
      name: 'Ben Angel',
      title: 'Entrepreneur Network Contributor',
      avatar: '/images/more-author-2.jpg',
      bio: "Ben Angel is the author of 'Unstoppable: A 90-Day Plan to Biohack Your Mind and Body for Success'. He has helped thousands of entrepreneurs maximize their cognitive performance and productivity.",
    },
    editor: 'AMANDA BREEN',
    date: '4h ago',
    readTime: '5 min read',
    excerpt: 'When great minds work together, new ideas turn into real progress. How cross-functional teams build unstoppable momentum.',
    imageUrl: '/images/topic-sub-2.jpg',
    imageAspect: 'wide',
  },
  {
    id: 'unstoppable-90-day-plan-to-biohack-your-mind',
    slug: 'unstoppable-90-day-plan-to-biohack-your-mind',
    title: 'The 90-Day Biohack Blueprint: How to Reclaim Energy, Focus and Drive',
    category: 'Leadership',
    author: {
      name: 'Ben Angel',
      title: 'Entrepreneur Network Contributor',
      avatar: '/images/more-author-2.jpg',
      bio: "Ben Angel is the author of 'Unstoppable: A 90-Day Plan to Biohack Your Mind and Body for Success'. He has helped thousands of entrepreneurs maximize their cognitive performance and productivity.",
    },
    editor: 'AMANDA BREEN',
    date: '1d ago',
    readTime: '6 min read',
    excerpt: 'Eliminate chronic decision fatigue and optimize physical resilience using behavioral biohacking systems.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
    imageAspect: 'wide',
  },
];

export const ARTICLE_PAGE_FEATURED_ARTICLES: Article[] = [
  {
    id: 'an-introverts-case-for-skipping-small-talk',
    slug: 'an-introverts-case-for-skipping-small-talk',
    title: "An Introvert's Case for Skipping Small Talk and Building Real Connections",
    category: 'Building a Business',
    author: {
      name: 'Aytekin Tank',
      title: 'Founder & CEO of Jotform',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      bio: 'Aytekin Tank is the founder and CEO of Jotform and author of Automate Your Busywork. He writes about productivity, tech, and entrepreneurship.',
    },
    editor: 'AMANDA BREEN',
    date: '3h ago',
    readTime: '4 min read',
    excerpt: 'Introverts can turn intentional, deep conversations into lasting professional networks without the exhaustion of endless networking events.',
    imageUrl: '/images/related-introvert.png',
  },
  {
    id: 'he-leads-a-240-billion-food-giant',
    slug: 'he-leads-a-240-billion-food-giant',
    title: "He Leads a $240 Billion Food Giant. Here’s the Difficult Management Rule He Follows.",
    category: 'Markets and Investing',
    author: {
      name: 'Sherin Shibu',
      title: 'Entrepreneur Staff',
      avatar: '/images/author-sherin.png',
      bio: 'Sherin Shibu is a business news reporter at Entrepreneur.com covering global markets, corporate governance, and consumer giants.',
    },
    editor: 'AMANDA BREEN',
    date: '7h ago',
    readTime: '5 min read',
    excerpt: 'Decisive operational leadership requires eliminating redundant approvals and empowering unit leaders with true autonomy.',
    imageUrl: '/images/related-food-giant.png',
  },
  {
    id: 'how-this-trio-built-a-supply-chain-powerhouse',
    slug: 'how-this-trio-built-a-supply-chain-powerhouse',
    title: 'How This Trio Built a Multi-Million Dollar Supply Chain Powerhouse From a Garage',
    category: 'Building a Business',
    author: {
      name: 'Jason Feifer',
      title: 'Editor in Chief, Entrepreneur',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      bio: 'Jason Feifer is the editor in chief of Entrepreneur magazine, podcast host, and author of Build for Tomorrow.',
    },
    editor: 'AMANDA BREEN',
    date: '1d ago',
    readTime: '6 min read',
    excerpt: 'Bootstrapping a logistics firm requires obsessive customer obsession, tight cash flow management, and ruthless prioritization.',
    imageUrl: '/images/related-founders-warehouse.png',
  },
  {
    id: 'taking-the-leap-what-great-leaders-do',
    slug: 'taking-the-leap-what-great-leaders-do',
    title: "Taking the Leap: What Great Leaders Do When the Path Ahead Isn't Clear",
    category: 'Leadership',
    author: {
      name: 'Terry Rice',
      title: 'Business Consultant & Speaker',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      bio: 'Terry Rice is a business development consultant and podcast host helping solopreneurs build thriving digital enterprises.',
    },
    editor: 'AMANDA BREEN',
    date: '1d ago',
    readTime: '5 min read',
    excerpt: 'When facing unprecedented market disruptions, leading with curiosity and conviction separates visionary founders from the pack.',
    imageUrl: '/images/related-jumping-cliff.png',
  },
  {
    id: 'ai-is-changing-your-company-culture',
    slug: 'ai-is-changing-your-company-culture',
    title: 'AI Is Changing Your Company Culture Whether You Planned for It or Not',
    category: 'Technology and AI',
    author: {
      name: 'Amanda Breen',
      title: 'Senior Features Editor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
      bio: 'Amanda Breen is a senior features editor at Entrepreneur, reporting on the intersection of generative artificial intelligence and enterprise culture.',
    },
    editor: 'AMANDA BREEN',
    date: '5h ago',
    readTime: '4 min read',
    excerpt: 'Adopting generative AI fundamentally shifts internal team trust, performance reviews, and creative autonomy across knowledge workers.',
    imageUrl: '/images/related-robot-hands.png',
  },
  {
    id: 'apple-amazon-and-microsoft-want-these-new-ai-gadgets',
    slug: 'apple-amazon-and-microsoft-want-these-new-ai-gadgets',
    title: 'Apple, Amazon and Microsoft Want These New AI Gadgets',
    category: 'Breaking Business News',
    author: {
      name: 'Sherin Shibu',
      title: 'Entrepreneur Staff',
      avatar: '/images/author-sherin.png',
      bio: 'Sherin Shibu is a business news reporter at Entrepreneur.com covering emerging consumer technology and tech titan battles.',
    },
    editor: 'AMANDA BREEN',
    date: '3h ago',
    readTime: '4 min read',
    excerpt: 'Big tech is racing to acquire ambient computing startups to win the next hardware form factor beyond smartphones.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'america-finally-got-a-new-sunscreen',
    slug: 'america-finally-got-a-new-sunscreen',
    title: 'America Finally Got a New Sunscreen. Europeans Have Been Sporting It Since 1999.',
    category: 'Research and Insights',
    author: {
      name: 'Amanda Breen',
      title: 'Senior Features Editor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
      bio: 'Amanda Breen is a senior features editor at Entrepreneur covering wellness and consumer innovation.',
    },
    editor: 'AMANDA BREEN',
    date: '4h ago',
    readTime: '5 min read',
    excerpt: 'Regulatory logjams delayed modern UV filters for decades in the United States while European formulas captured global market share.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'this-popular-pickleball-franchisor-filed-for-bankruptcy',
    slug: 'this-popular-pickleball-franchisor-filed-for-bankruptcy',
    title: "This Popular Pickleball Franchisor Filed for Bankruptcy. Its Founder Says, 'I Own It'",
    category: 'Startups and Entrepreneurship',
    author: {
      name: 'Jason Feifer',
      title: 'Editor in Chief, Entrepreneur',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      bio: 'Jason Feifer is the editor in chief of Entrepreneur magazine, podcast host, and author of Build for Tomorrow.',
    },
    editor: 'AMANDA BREEN',
    date: '4h ago',
    readTime: '6 min read',
    excerpt: 'Rapid expansion and skyrocketing commercial leases strained liquidity before court-supervised reorganization took over.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'creators-are-handing-their-video-edits-to-ai',
    slug: 'creators-are-handing-their-video-edits-to-ai',
    title: "Creators Are Handing Their Video Edits to AI. Here's Where It Starts to Backfire.",
    category: 'Technology and AI',
    author: {
      name: 'Terry Rice',
      title: 'Business Consultant & Speaker',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      bio: 'Terry Rice is a business development consultant and podcast host helping solopreneurs build thriving digital enterprises.',
    },
    editor: 'AMANDA BREEN',
    date: '6h ago',
    readTime: '5 min read',
    excerpt: 'Algorithmic pacing and generic synthetic voiceovers are suppressing engagement on YouTube and TikTok as audiences crave authenticity.',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
  },
];

export const ALL_ARTICLES: Article[] = [
  HOW_GREAT_LEADERS_BUILD_TEAMS_ARTICLE,
  POWER_OF_EFFECTIVE_COMMUNICATION_ARTICLE,
  COLLABORATION_DRIVES_INNOVATION_ARTICLE,
  ...BEN_ANGEL_ARTICLES,
  ...ARTICLE_PAGE_FEATURED_ARTICLES,
  SIDE_HUSTLE_53_ARTICLE,
  NOT_EVERY_BOSS_ARTICLE,
  HERO_ARTICLE,
  ...LATEST_ARTICLES,
  ...SECONDARY_FEATURED,
  ...TOP_STORIES_GRID,
  ...SIDE_HUSTLE_ARTICLES,
  ...TRENDING_STORIES,
  ...MARKETS_INVESTING_ARTICLES,
  ...AI_TECH_FEATURE_ARTICLES,
  ...DEEP_DIVE_ARTICLES,
  ...ENTREPRENEURS_SECTION_ARTICLES,
  ...AGENTIC_AI_SECTION_ARTICLES,
  ...FRANCHISES_MAIN_SECTION_ARTICLES,
  ...ALL_TOPIC_ARTICLES,
];

export function slugifyTitle(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getArticleSlug(article: { id?: string; title?: string; slug?: string }): string {
  if (article.slug) return article.slug;
  if (article.id === 'latest-1' || article.id === 'side-hustle-53') {
    return '53-side-hustle-ideas-to-make-extra-money-in-2026';
  }
  if (article.id === 'not-every-boss-deserves-a-thank-you-card') {
    return 'not-every-boss-deserves-a-thank-you-card';
  }
  if (article.id && article.id.includes('-') && !article.id.match(/^(latest|hero|sec|rel|topic|cat|art|vid|sh|grid)-\d+$/)) {
    return article.id;
  }
  if (article.title) {
    const slug = slugifyTitle(article.title);
    if (slug) return slug;
  }
  return article.id || 'article';
}

export function getArticleUrl(article: { id?: string; title?: string; slug?: string }): string {
  return `/article/${getArticleSlug(article)}`;
}

export function getArticleById(rawIdOrSlug: string): Article {
  const param = decodeURIComponent(rawIdOrSlug || '').trim();
  const slugParam = slugifyTitle(param);

  // 1. Direct check for 53 Side Hustles article
  if (
    param === 'latest-1' ||
    param === 'side-hustle-53' ||
    param === '53-side-hustle-ideas-to-make-extra-money-in-2026' ||
    slugParam === '53-side-hustle-ideas-to-make-extra-money-in-2026'
  ) {
    return SIDE_HUSTLE_53_ARTICLE;
  }

  // 2. Direct check for Not Every Boss article
  if (
    param === 'not-every-boss-deserves-a-thank-you-card' ||
    param === 'boss-bully' ||
    slugParam === 'not-every-boss-deserves-a-thank-you-card' ||
    slugParam.includes('not-every-boss-deserves')
  ) {
    return NOT_EVERY_BOSS_ARTICLE;
  }

  // 3. Direct check for How Great Leaders Build Teams article
  if (
    param === 'how-great-leaders-build-teams-that-thrive' ||
    slugParam.includes('great-leaders-build-teams') ||
    slugParam.includes('leaders-build-teams') ||
    slugParam.includes('teams-that-thrive')
  ) {
    return HOW_GREAT_LEADERS_BUILD_TEAMS_ARTICLE;
  }

  // 3b. Direct checks for Thought Leaders sub-cards
  if (
    param === 'power-of-effective-communication-leadership' ||
    slugParam.includes('power-of-effective-communication') ||
    slugParam.includes('communication-in-leadership')
  ) {
    return POWER_OF_EFFECTIVE_COMMUNICATION_ARTICLE;
  }

  if (
    param === 'collaboration-drives-innovation-growth' ||
    slugParam.includes('collaboration-drives-innovation') ||
    slugParam.includes('innovation-and-growth')
  ) {
    return COLLABORATION_DRIVES_INNOVATION_ARTICLE;
  }

  // 4. Direct check for Hero article
  if (param === 'hero-1' || slugParam.includes('mentored-people')) {
    return HERO_ARTICLE;
  }

  // 5. Exact matches in ALL_ARTICLES
  const found = ALL_ARTICLES.find((a) => {
    if (a.id === param || a.id.toLowerCase() === param.toLowerCase()) return true;
    if (a.slug && (a.slug === param || a.slug === slugParam)) return true;
    if (slugifyTitle(a.title) === slugParam) return true;
    if (slugifyTitle(a.id) === slugParam) return true;
    return false;
  });
  if (found) return found;

  // 6. Fuzzy match in ALL_ARTICLES
  if (slugParam.length > 5) {
    const fuzzy = ALL_ARTICLES.find((a) => {
      const aSlug = a.slug || slugifyTitle(a.title);
      return aSlug.includes(slugParam) || slugParam.includes(aSlug);
    });
    if (fuzzy) return fuzzy;
  }

  // 7. Dedicated dynamic article generation so each article opens its own dedicated page
  const words = slugParam.split(/[-_]+/);
  const formattedTitle = words
    .map((word) => {
      const lower = word.toLowerCase();
      if (['as', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'by', 'the', 'with', 'from'].includes(lower)) {
        return lower;
      }
      if (['fda', 'ai', 'ceo', 'owlet', 'esg', 'btc', 'usd', 'smb', 'smbs', 'etf', 'etfs', 'b2b'].includes(lower)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

  const titleCase = formattedTitle ? formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1) : 'Business Insights & Strategic Leadership';

  return {
    id: slugParam || param || 'article',
    slug: slugParam || param || 'article',
    title: titleCase,
    category: 'Building a Business',
    author: {
      name: 'Sherin Shibu',
      title: 'Entrepreneur Staff',
      avatar: '/images/author-sherin.png',
      bio: 'Sherin Shibu is a business news reporter at Entrepreneur.com. She previously worked for PCMag, Business Insider, and specializes in business trends, consumer technology, and entrepreneurship.',
    },
    editor: 'AMANDA BREEN',
    date: 'OCT 19, 2026',
    readTime: '4 min read',
    excerpt: `Exclusive reporting and in-depth business analysis: ${titleCase}.`,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    imageAspect: 'wide',
  };
}

export function getTopicDataBySlug(slugInput: string): TopicPageData {
  let slug = (slugInput || 'breaking-news').toLowerCase().trim();

  const categoryLookup = getCategoryBySlug(slug);

  const aliasMap: Record<string, string> = {
    'breaking-business-news': 'breaking-news',
    'markets-and-investing': 'markets-investing',
    'economy': 'economy-policy',
    'startups-and-entrepreneurship': 'startups-entrepreneurship',
    'entrepreneurs': 'startups-entrepreneurship',
    'building-a-business': 'startups-entrepreneurship',
    'technology-ai': 'technology-super-intelligence',
    'technology-and-ai': 'technology-super-intelligence',
    'real-estate': 'real-estate-property',
    'international-business': 'global-business',
    'leadership': 'leadership-management',
    'sustainability': 'sustainability-esg',
    'ceo-interviews': 'interviews-opinions',
    'interviews': 'interviews-opinions',
    'research-and-insights': 'research-insights',
    'banking-and-finance': 'banking-finance',
  };
  const resolvedSlug = aliasMap[slug] || slug;

  const matchedLegacy = CATEGORY_TOPICS_DATA[slug] || CATEGORY_TOPICS_DATA[resolvedSlug] || CATEGORY_TOPICS_DATA['breaking-business-news'];

  if (categoryLookup) {
    const { main, sub } = categoryLookup;
    if (sub) {
      const topicArticles = (CATEGORY_TOPICS_DATA[sub.slug]?.articles) ||
        (matchedLegacy?.articles && matchedLegacy.articles.length > 0
          ? matchedLegacy.articles
          : (CATEGORY_TOPICS_DATA[main.slug]?.articles || CATEGORY_TOPICS_DATA['breaking-business-news']?.articles || []));

      return {
        title: sub.name,
        slug: sub.slug,
        parentTitle: main.name,
        parentSlug: main.slug,
        description: sub.description || `${sub.name} news, in-depth reports, and business analysis.`,
        articles: topicArticles,
        subcategories: main.subcategories,
        isSubcategory: true,
      };
    } else {
      const topicArticles = CATEGORY_TOPICS_DATA[main.slug]?.articles ||
        (matchedLegacy?.articles && matchedLegacy.articles.length > 0
          ? matchedLegacy.articles
          : CATEGORY_TOPICS_DATA['breaking-business-news']?.articles || []);

      return {
        title: main.name,
        slug: main.slug,
        description: main.description,
        articles: topicArticles,
        subcategories: main.subcategories,
        isSubcategory: false,
      };
    }
  }

  return {
    title: matchedLegacy?.title || 'Business News',
    slug: resolvedSlug,
    description: matchedLegacy?.description || 'Exclusive business coverage, trends, and market analysis.',
    articles: matchedLegacy?.articles || [],
  };
}

export function searchArticles(rawQuery: string): Article[] {
  const query = (rawQuery || '').trim().toLowerCase();
  
  // Deduplicate ALL_ARTICLES by ID
  const uniqueArticlesMap = new Map<string, Article>();
  ALL_ARTICLES.forEach((article) => {
    if (!uniqueArticlesMap.has(article.id)) {
      uniqueArticlesMap.set(article.id, article);
    }
  });
  const allUnique = Array.from(uniqueArticlesMap.values());

  if (!query) {
    return allUnique;
  }

  return allUnique.filter((art) => {
    const titleMatch = art.title?.toLowerCase().includes(query);
    const categoryMatch = art.category?.toLowerCase().includes(query);
    const authorMatch = art.author?.name?.toLowerCase().includes(query);
    const excerptMatch = art.excerpt?.toLowerCase().includes(query);
    return titleMatch || categoryMatch || authorMatch || excerptMatch;
  });
}



