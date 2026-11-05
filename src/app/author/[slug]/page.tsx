'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { ALL_ARTICLES, getArticleUrl } from '@/data/newsData';
import { useAuth } from '@/components/auth/AuthContext';

interface AuthorProfile {
  name: string;
  role: string;
  badge: string;
  avatar: string;
  bio: string;
}

const AUTHORS_REGISTRY: Record<string, AuthorProfile> = {
  'jason-feifer': {
    name: 'Jason Feifer',
    role: 'Editor in Chief',
    badge: 'Entrepreneur Staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Jason Feifer is the Editor in Chief of Entrepreneur magazine, podcast host, and author of Build for Tomorrow. He helps entrepreneurs and modern professionals adapt to change and build future-proof businesses.',
  },
  'michael-andrews-cooper': {
    name: 'Michael Andrews Cooper',
    role: 'Executive Leadership Strategist',
    badge: 'Entrepreneur Leadership Network Contributor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Michael Andrews Cooper is an executive coach and innovation strategist who advises fast-growing startups and Fortune 500 leadership teams on turning early concepts into scalable enterprises.',
  },
  'michael-andrusko': {
    name: 'Michael Andrews Cooper',
    role: 'Executive Leadership Strategist',
    badge: 'Entrepreneur Leadership Network Contributor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Michael Andrews Cooper is an executive coach and innovation strategist who advises fast-growing startups and Fortune 500 leadership teams on turning early concepts into scalable enterprises.',
  },
  'brandon-morgan': {
    name: 'Brandon Morgan',
    role: 'Career & Growth Advisor',
    badge: 'Entrepreneur Leadership Network Contributor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
    bio: 'Brandon Morgan writes about professional decision-making frameworks, executive habits, and long-term career resilience for entrepreneurs and modern professionals.',
  },
  'benjamin-ahmed': {
    name: 'Benjamin Ahmed',
    role: 'Consumer Tech Reporter',
    badge: 'Entrepreneur Staff',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    bio: 'Benjamin Ahmed is a technology journalist covering consumer hardware, smart home ecosystems, AI assistants, and enterprise product roadmaps at Entrepreneur.',
  },
  'scott-smrkovski': {
    name: 'Scott Smrkovski',
    role: 'Executive Contributor',
    badge: 'Entrepreneur Leadership Network Contributor',
    avatar: '/images/home-hero/author-scott.png',
    bio: 'Scott Smrkovski is a serial founder, angel investor, and executive contributor specializing in capital efficiency, venture scaling, and founder operational frameworks.',
  },
  'sherin-shibu': {
    name: 'Sherin Shibu',
    role: 'News Reporter',
    badge: 'Entrepreneur Staff',
    avatar: '/images/sherin-shibu.jpg',
    bio: 'Sherin Shibu is a business news reporter at Entrepreneur.com. She previously worked for PCMag, Business Insider, The Messenger, and ZDNET as a reporter and copyeditor. Her areas of coverage encompass tech, business, strategy, finance, and even space. She is a Columbia University graduate.',
  },
  'amanda-breen': {
    name: 'Amanda Breen',
    role: 'Senior Features Editor',
    badge: 'Entrepreneur Staff',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    bio: 'Amanda Breen is a senior features editor at Entrepreneur covering wellness, workplace culture, and consumer innovation.',
  },
  'terry-rice': {
    name: 'Terry Rice',
    role: 'Business Consultant & Speaker',
    badge: 'Entrepreneur Network Contributor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Terry Rice is a business development consultant, digital strategist, and podcast host helping solopreneurs build thriving digital enterprises.',
  },
  'aytekin-tank': {
    name: 'Aytekin Tank',
    role: 'Founder & CEO of Jotform',
    badge: 'Entrepreneur Leadership Network Contributor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Aytekin Tank is the founder and CEO of Jotform and author of Automate Your Busywork. He writes about productivity, tech, and entrepreneurship.',
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
  'merilee-kern': {
    name: 'Merilee Kern, MBA',
    role: 'Senior Business Strategist',
    badge: 'Entrepreneur Leadership Network Contributor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    bio: 'Merilee Kern, MBA is an internationally-regarded brand strategist, consumer trends analyst, and senior business journalist covering industry leaders, luxury assets, and venture growth.',
  },
  'rl-adams': {
    name: 'R.L. Adams',
    role: 'Contributing Writer',
    badge: 'Entrepreneur Staff',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    bio: 'R.L. Adams is a software engineer, serial entrepreneur, and bestselling author of dozens of books on online business, search engine optimization, and passive income generation.',
  },
  'fathima': {
    name: 'Fathima',
    role: 'Staff Writer',
    badge: 'Entrepreneur Staff',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop',
    bio: 'Fathima is a staff writer at Entrepreneur covering business, innovation, and leadership.',
  },
  'kalid-mishal': {
    name: 'Kalid Mishal',
    role: 'Staff Writer',
    badge: 'Entrepreneur Staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Kalid Mishal is a staff writer at Entrepreneur covering startup growth, leadership principles, and emerging market dynamics.',
  },
  'writer-account': {
    name: 'Writer Account',
    role: 'Staff Writer',
    badge: 'Entrepreneur Staff',
    avatar: '/uploads/avatar_1793324678418_d.jpg',
    bio: 'Executive business contributor.',
  },
  'writer_account': {
    name: 'Writer Account',
    role: 'Staff Writer',
    badge: 'Entrepreneur Staff',
    avatar: '/uploads/avatar_1793324678418_d.jpg',
    bio: 'Executive business contributor.',
  },
  'writer': {
    name: 'Writer Account',
    role: 'Staff Writer',
    badge: 'Entrepreneur Staff',
    avatar: '/uploads/avatar_1793324678418_d.jpg',
    bio: 'Executive business contributor.',
  },
  'writter': {
    name: 'Writer Account',
    role: 'Staff Writer',
    badge: 'Entrepreneur Staff',
    avatar: '/uploads/avatar_1793324678418_d.jpg',
    bio: 'Executive business contributor.',
  },
  'thasneem-samra': {
    name: 'Writer Account',
    role: 'Staff Writer',
    badge: 'Entrepreneur Staff',
    avatar: '/uploads/avatar_1793324678418_d.jpg',
    bio: 'Executive business contributor.',
  },
};

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
];

function getAuthorProfile(rawSlug: string): AuthorProfile {
  const cleanSlug = decodeURIComponent(rawSlug || '').toLowerCase().trim().replace(/[\s_]+/g, '-');
  if (AUTHORS_REGISTRY[cleanSlug]) {
    return AUTHORS_REGISTRY[cleanSlug];
  }
  // Try partial match in registry
  for (const [key, profile] of Object.entries(AUTHORS_REGISTRY)) {
    if (cleanSlug.includes(key) || key.includes(cleanSlug)) {
      return profile;
    }
  }
  const name = cleanSlug
    .split(/[-_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  let hash = 0;
  for (let i = 0; i < cleanSlug.length; i++) hash = (hash * 31 + cleanSlug.charCodeAt(i)) >>> 0;
  const avatar = DEFAULT_AVATARS[hash % DEFAULT_AVATARS.length];

  return {
    name,
    role: 'Staff Writer',
    badge: 'Entrepreneur Staff',
    avatar,
    bio: `${name} is a contributing writer at Entrepreneur covering business strategy, technology, and entrepreneurship.`,
  };
}

// Generates dedicated, relevant articles for authors who do not have a huge static array (60 unique articles = 3 full pages of 20)
function generateAuthorBeatArticles(authorName: string, slug: string) {
  const cleanSlug = decodeURIComponent(slug || '').toLowerCase().trim().replace(/[\s_]+/g, '-');
  
  const CURATED_IMAGES = [
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop"
  ];

  if (cleanSlug.includes('jason-feifer') || cleanSlug.includes('feifer')) {
    const titles = [
      "How Top Founders Reinvent Themselves When Market Conditions Change",
      "The One Question Every Leader Should Ask Before Launching a Pivot",
      "Why Future-Proof Businesses Focus on Resilience Over Rapid Hypergrowth",
      "The Secret Behind Fast-Growing Solopreneur Media Brands",
      "Build for Tomorrow: Tactical Lessons from 100+ Breakthrough CEOs",
      "What the World's Most Innovative Leaders Do When Conventional Playbooks Fail",
      "Adapting to the Unplanned: How to Turn Disruption into Enterprise Momentum",
      "Why the Best Entrepreneurs Are Obsessed with Problem Solving, Not Products",
      "How to Lead Teams Through Relentless Industry Change Without Burning Out",
      "The Shift from Scarcity to Opportunity: Reframing Business Setbacks",
      "How Modern Media Founders Build High-Trust Communities that Scale",
      "The Discipline of Doing Less: Why Prioritization Beats Endless Execution",
      "Lessons from the Trenches: How Early Failures Catalyzed Massive Outcomes",
      "What High-Performing Founders Do Differently in Their First 1,000 Days",
      "The Art of Strategic Simplicity in an Overcomplicated Market",
      "Building Resilience Before You Need It: An Executive Roadmap",
      "Why Customer Obsession Is the Only Moat that Withstands Disruption",
      "How Decisive Communicators Cut Through Noise in Turbulent Quarters",
      "Rethinking Ambition: Scaling Sustainable Ventures with High Margin Focus",
      "The Leadership Principles Behind Enduring Consumer Product Brands",
      "How to Navigate High-Stakes Partnerships with Mutual Alignment",
      "Why Transparent Executive Culture Attracts Elite Tier-One Talent",
      "The Power of Curiosity: Asking Questions that Unlock Uncharted Markets",
      "From Concept to Scaled Phenomenon: The True Journey of Modern Innovators",
      "When to Abandon Conventional Wisdom and Trust Unfiltered Market Signals",
      "The Founder's Guide to Mastering Public Speaking and Media Narratives",
      "Why Agile Experimentation Outperforms Multi-Year Predictive Strategic Plans",
      "Building a Personal Brand that Amplifies Company Enterprise Valuation",
      "The Unseen Habits of Leaders Who Consistently Thrive Under Pressure",
      "How to Create Products Customers Enthusiastically Advocate for Online",
      "The Art of Saying No: Protecting Deep Focus Amid Incessant Growth Demands",
      "Navigating Boardrooms, Mentors, and Advisors: Extracting Maximum Value",
      "Why Mission-Driven Startups Retain Talent Twice as Long as Competitors",
      "Overcoming Creative and Commercial Stagnation with Radical Constraints",
      "The Formula for Turning Industry Crisis into Unprecedented Breakthroughs",
      "How Modern Editors and Creators Build Self-Sustaining Media Flywheels",
      "The Science of Storytelling: Pitching Ideas That Command Undivided Attention",
      "Why Emotional Agility Is the Decisive Skill for Modern Chief Executives",
      "Cultivating Intuition: Balancing Hard Data Analytics with Gut Founder Instincts",
      "The Sustainable Growth Playbook: Scaling Revenue Without Diluting Soul",
      "How Modern Entrepreneurs Master Time Leverage in Asynchronous Organizations",
      "The Anatomy of a Flawless Brand Rebrand in Rapidly Shifting Markets",
      "Turning Constructive Customer Criticism into Breakthrough Product Features",
      "The Power of Micro-Innovations: Small Iterations That Compound Exponentially",
      "Why Intellectual Humility Is the Greatest Competitive Advantage in Tech",
      "How to Build High-Performance Executive Teams with Complementary Strengths",
      "The Psychological Blueprint for Navigating Early-Stage Uncertainty",
      "From Solopreneur to Enterprise Leader: Managing the Cognitive Identity Shift",
      "Building Moats Around Trust: Why Authenticity Outlasts Growth Hacks",
      "The Art of Constructive Candor: Fostering Radically Honest Team Communication",
      "Navigating Economic Recessions: Defensive and Offensive Playbooks for Startups",
      "Why Modern Businesses Must Treat Internal Culture as a Scalable Product",
      "The Strategic Architecture of Viral Business Books and Thought Leadership",
      "How Breakthrough Founders Maintain Relentless Curiosity Decade After Decade",
      "The Blueprint for Building Multi-Channel Audience Loyalty from Scratch",
      "Why Speed of Decision-Making Beats Exhaustive Deliberation in Volatile Markets",
      "Mastering the Executive Calendar: Eliminating Low-Leverage Obligations",
      "The Future of Work: Why Decentralized Talent Networks Are Winning the Market",
      "How Resilient Entrepreneurs Turn Regret into Fuel for Future Ventures",
      "Building an Enduring Legacy: Why Long-Term Thinking Trumps Quarterly Vanity"
    ];
    return titles.map((t, idx) => ({
      id: `jason-feifer-article-${idx + 1}`,
      title: t,
      category: ['LEADERSHIP', 'INNOVATION', 'STRATEGY', 'BUSINESS', 'ENTREPRENEURSHIP'][idx % 5],
      excerpt: `In-depth strategic analysis and executive insights from Jason Feifer on adaptive leadership, future-proofing, and scaling modern ventures.`,
      imageUrl: CURATED_IMAGES[idx % CURATED_IMAGES.length],
      author: { name: 'Jason Feifer' }
    }));
  }

  if (cleanSlug.includes('michael-andrews') || cleanSlug.includes('andrusko') || cleanSlug.includes('michael')) {
    const titles = [
      "The Leadership Skill That Takes Innovation Further",
      "Executive Trust: The Foundation of Fast Execution in Uncertain Times",
      "How Visionary Founders Turn Early Chaos into Scalable Systems",
      "The Strategic Playbook for Board Alignment and High-Impact Governance",
      "Decisive Executive Frameworks: Navigating Two-Way vs One-Way Doors",
      "Why Team Autonomy Doubles Product Velocity in High-Growth Startups",
      "Turning Early Concepts into Market-Leading Commercial Enterprises",
      "The Psychology of High-Conviction Leadership Under Extreme Pressure",
      "How Top CEOs Eliminate Operational Bottlenecks Across Distributed Teams",
      "Strategic Capital Allocation: When to Double Down and When to Conserve",
      "Building Cross-Functional Alignment Around Core Company Missions",
      "The Executive Decision Matrix for Scaling from Series A to Growth Stage",
      "Culture as an Asset: Developing High-Performance Leadership Pipelines",
      "Managing Hyper-Growth Without Sacrificing Product Excellence",
      "How Resilient Founders Overcome High-Stakes Market Contractions",
      "The Power of Clarity: How Transparent Goals Galvanize Engineering Teams",
      "Why Organizational Agility Outlasts Rigid Five-Year Corporate Plans",
      "Frameworks for Fostering Grassroots Innovation in Enterprise Teams",
      "The Art of High-Leverage Delegation for Scaling Founders",
      "How Elite Leadership Teams Execute Pivots Without Losing Momentum",
      "Building Sustainable Competitive Moats in Fast-Moving Industries",
      "The Nuance of Executive Influence: Aligning Investors, Boards, and Teams",
      "Leading with Conviction: Why Clear Direction Outweighs Consensus",
      "Scaling Executive Velocity: Principles from Silicon Valley's Top Operators",
      "The Governance Roadmap: Preparing High-Growth Companies for Public Markets",
      "Managing Investor Relations with Complete Strategic Candor",
      "How High-Performing Organizations Eliminate Bureaucratic Red Tape",
      "The Architecture of Accountability: Setting Clear Measurable OKRs",
      "Why Emotional Intelligence Dictates Executive Longevity and Respect",
      "Navigating Boardroom Conflict: Resolving Strategic Deadlocks Amicably",
      "The Playbook for Integrating Mergers and Acquisitions Without Friction",
      "How Visionary Leaders Establish Enduring Organizational Values",
      "Strategic Risk Assessment: Balancing Bold Innovation with Downside Protection",
      "Building a World-Class C-Suite: Sourcing and Interviewing Key Executives",
      "The Role of Asynchronous Communication in Global Enterprise Velocity",
      "How Experienced Operators Restructure Underperforming Business Units",
      "The Modern CFO Partnership: Aligning Financial Controls with Product Ambition",
      "Why Transparent Metrics Dashboards Empower Middle Management to Lead",
      "The Science of Executive Energy Management: Avoiding Founder Burnout",
      "Fostering an Experimental Culture: Rewarding Calculated Strategic Risks",
      "The Art of the Strategic Memo: Writing with Precision and Impact",
      "Navigating Public Scrutiny: Crisis Management Frameworks for CEOs",
      "How Fast-Growing Startups Transition from Founder-Led Sales to Enterprise AE Teams",
      "The High-Performance 1-on-1 Framework: Unlocking Employee Potential",
      "Strategic Alliances: Crafting Win-Win Joint Ventures that Compound Value",
      "Why Company Values Must Inform Daily Hiring, Firing, and Promotion Decisions",
      "The Executive Guide to Optimizing Organizational Charts as Teams Scale",
      "How Decisive Leaders Manage Ambiguity During Macroeconomic Downturns",
      "Building an Internal Advisory Council of Respected Industry Specialists",
      "The Psychology of Executive Compensation: Aligning Incentives for Long-Term Growth",
      "Managing Upwards: How Senior Executives Collaborate Effectively with Strong Boards",
      "The Product-Led Enterprise: Infusing Engineering Rigor Across Every Department",
      "How Visionary Founders Cultivate Psychological Safety on Technical Teams",
      "The Discipline of Operational Auditing: Finding Hidden Leaks in Enterprise Systems",
      "Why Continuous Feedback Loops Replace Outdated Annual Performance Reviews",
      "The Roadmap to Sustainable Enterprise Profitability in Volatile Capital Markets",
      "How Respected Leaders Deliver Difficult News with Empathy and Total Clarity",
      "Mastering Cross-Cultural Management Across Multinational Distributed Hubs",
      "The Legacy Leader: How Great Operators Build Institutions that Outlast Them",
      "Executive Resilience: Thriving Amid High-Stakes Regulatory and Market Shifts"
    ];
    return titles.map((t, idx) => ({
      id: `michael-andrews-article-${idx + 1}`,
      title: t,
      category: ['BUILDING A BUSINESS', 'LEADERSHIP', 'STRATEGY', 'MANAGEMENT'][idx % 4],
      excerpt: `Strategic frameworks and operational principles from Michael Andrews Cooper on executive governance, scalable systems, and team leadership.`,
      imageUrl: CURATED_IMAGES[idx % CURATED_IMAGES.length],
      author: { name: 'Michael Andrews Cooper' }
    }));
  }

  if (cleanSlug.includes('brandon-morgan') || cleanSlug.includes('morgan')) {
    const titles = [
      "The Simple Test to Use Early in Your Career That Pays Off for Decades",
      "Career Compounding: Why Asymmetric Bets Outperform Safe Corporate Climbing",
      "The Executive Blueprint for Making Reversible vs Irreversible Decisions",
      "How to Build a High-Leverage Professional Network Without Cold Pitching",
      "Why Developing Deep Generalist Skills Accelerates Founder Trajectory",
      "The Science of High-Impact Career Pivots at Any Professional Stage",
      "Mastering Negotiation: How to Command Market Value in Early Ventures",
      "How to Identify High-Growth Career Vehicles Before the Crowd Catches On",
      "The Daily Habits of Ultra-Effective Strategy Advisors and Consultants",
      "Navigating Early Career Ambiguity: Finding Signal Amid Industrial Noise",
      "Why Execution Reputation Is the Most Valuable Asset in Tech Ecosystems",
      "How to Transition from Individual Contributor to Trusted Executive Leader",
      "Strategic Risk Taking: Why Playing It Safe Is the Riskiest Strategy Today",
      "Building Personal Leverage: Combining Unique Knowledge, Code, and Media",
      "The Framework for Evaluating Angel Investments and Startup Equity Offers",
      "How to Cultivate Lifelong Executive Sponsorship and Advisory Boards",
      "Continuous Learning Playbook: Staying Ahead of AI Disruption in Business",
      "The Power of Writing: How Clear Written Memos Advance Executive Careers",
      "Overcoming Imposter Syndrome in High-Stakes Boardroom Environments",
      "The Art of Strategic Patience: Playing Long-Term Games with Long-Term People",
      "Time Auditing: How Top Performers Protect Their Highest-Value Hours",
      "Why Emotional Resilience Matters More Than Pure IQ in Rapid Scaling",
      "The Playbook for Launching a Profitable Advisory Practice on the Side",
      "Designing Your Next Decade: Principles for Purposeful Professional Growth",
      "How to Position Yourself as an Irreplaceable Strategic Asset to Founders",
      "The Skill Stacking Formula: Multiplying Your Earning Power with Niche Synergies",
      "Why You Should Never Depend on a Single Income Stream or Employer",
      "The Architecture of Effective Mentorship: Finding and Nurturing Mentors",
      "How High-Leverage Professionals Master Public Speaking and Panel Moderation",
      "Building Wealth Quietly: Lessons from Discreet Modern Operators",
      "The Art of Working Backwards: Setting Career Objectives That Actually Excite You",
      "Navigating Office Politics Without Compromising Your Core Integrity",
      "Why Curiosity-Driven Projects Often Yield the Biggest Career Breakthroughs",
      "The High-Income Skill Blueprint: Identifying What the Market Urgently Demands",
      "How to Build a World-Class Portfolio of Work that Speaks for Itself",
      "The Psychology of High Performance: Managing Dopamine, Focus, and Rest",
      "Strategic Career Sabbaticals: Recharging Without Sacrificing Professional Trajectory",
      "Why Writing in Public Attracts High-Value Business Inquiries Inbound",
      "The Executive Career Ladder: Knowing Exactly When to Stay and When to Jump",
      "Navigating Compensation Packages: Balancing Cash, Stock Options, and Restricted Units",
      "How to Win Over Demanding Leaders by Solving Unspoken Organizational Headaches",
      "The Daily Knowledge Diet: Filtering High-Signal Research from Low-Value Noise",
      "Developing Executive Presence: Body Language, Vocal Cadence, and Poise",
      "The Power of Intellectual Generosity: Connecting People Without Expecting Return",
      "Why High Agency Is the Most Under-Appreciated Trait in High-Growth Companies",
      "The Fractional Executive Model: Serving Multiple Fast-Scaling Startups at Once",
      "How to Build an Indispensable Personal CRM and Stay in Touch with Key Contacts",
      "The Non-Linear Career Path: Embracing Unconventional Trajectories to the Top",
      "Why Specialists Peak Early but Generalist Synthesizers Rule the Boardroom",
      "The Decision-Making Journal: Documenting Hypotheses to Sharpen Business Instincts",
      "How to Negotiate Remote Flexibility While Increasing Executive Visibility",
      "The Art of High-Impact Introductions: Unlocking Value Across Your Rolodex",
      "Overcoming Career Plateaus: How to Reinvent Your Professional Narrative",
      "The Wealth-Building Engine: Converting Salary into Long-Term Equity and Assets",
      "Why Speed and Reliability Trump Perfection in Early Professional Milestones",
      "The Executive Reading List: Timeless Business Classics that Withstand Hype",
      "How to Lead High-Stakes Client Engagements with Poise and Conviction",
      "The Architecture of Focus: Eliminating Digital Distractions to Do Deep Work",
      "Navigating Industry Downswings: Positioning Yourself for Inevitable Rebounds",
      "The Master Strategist: Playing 20-Year Horizon Career Moves with Calm Confidence"
    ];
    return titles.map((t, idx) => ({
      id: `brandon-morgan-article-${idx + 1}`,
      title: t,
      category: ['BUILDING A BUSINESS', 'CAREER', 'LEADERSHIP', 'GROWTH'][idx % 4],
      excerpt: `Actionable insights and decision-making methodologies from Brandon Morgan on career compounding, executive habits, and long-term professional leverage.`,
      imageUrl: CURATED_IMAGES[idx % CURATED_IMAGES.length],
      author: { name: 'Brandon Morgan' }
    }));
  }

  if (cleanSlug.includes('benjamin-ahmed') || cleanSlug.includes('benjamin')) {
    const titles = [
      "Apple Is Reportedly Creating New Devices for Your Smart Home",
      "Smart Home Ecosystems: How AI Hubs Are Replacing Legacy Interfaces",
      "Next-Gen Consumer Wearables: Spatial Compute, Health Sensors and Battery Breakthroughs",
      "Inside Apple's Silicon Roadmap: Why M-Series Architecture Continues to Lead",
      "The Battle for the Living Room: How Big Tech Is Reimagining Connected Devices",
      "Autonomous Home Robotics: What the Next Five Years of Automation Look Like",
      "Edge AI on Consumer Hardware: Running LLMs Locally Without Cloud Latency",
      "The Evolution of Smart Displays: Conversational Interfaces and Ambient Computing",
      "Why Matter Standard Adoption Is Finally Unifying Fragmented Smart Homes",
      "Consumer Privacy in Connected Hardware: How On-Device Enclaves Protect Data",
      "The Future of Personal Audio: Spatial Sound, Neural Feedback, and Hearing Health",
      "Smart Home Security Innovations: Computer Vision Without Compromising Privacy",
      "How Generative AI Is Transforming Consumer Electronics Product Design",
      "The Wearables Revolution: Tracking Biomarkers to Predict Health Trends Early",
      "Smart Energy Management: How Connected Homes Slash Utility Grid Demand",
      "Next-Gen Display Technologies: MicroLED, OLED, and Foldable Device Futures",
      "Voice Assistant Overhauls: Integrating Large Multimodal Models into Hardware",
      "The Rise of Ambient Computing: Technology that Disappears into the Background",
      "Inside the Hardware Supply Chain: Geopolitical Shifts in Silicon Packaging",
      "Smart Kitchen Tech: How Automation and Precision Sensors Reshape Cooking",
      "The Race for Spatial Computing Dominance: Hardware Tradeoffs and Optics",
      "Wireless Charging Ecosystems: The Push for Universal Magnetic Power Standards",
      "Smart Glass and AR Eyewear: What Consumer Hardware Giants Are Developing Next",
      "The Next Ten Years of Consumer Hardware: Ubiquitous Intelligence and Seamless UX",
      "Why Neural Interface Headbands Are the Next Frontier in Wearable Tech",
      "Solid-State Battery Tech: The Promise of Doubling Smartphone Battery Life",
      "The Internet of Everyday Things: Micro-Sensors Embedded in Everyday Materials",
      "Home Automation Protocols: Thread, Zigbee, and the Race for Ultra-Low Power",
      "How Consumer Electronics Manufacturers Are Slashing E-Waste with Modular Designs",
      "The Silicon Wars: Custom ASICs Powering On-Device Computer Vision and Voice",
      "Smart Lighting Systems: Circadian Rhythm Tuning and Human-Centric Illumination",
      "The Future of Foldables: Creaseless Displays and Durable Multi-Axis Hinges",
      "Biometric Security Beyond Fingerprints: Iris, Vein, and Acoustic Authentication",
      "The Rise of Smart Rings: Discreet Health Monitoring Without Screen Distraction",
      "How Automotive OS Integrations Turn Connected Vehicles into Mobile Smart Homes",
      "Haptic Feedback Innovations: Bringing Physical Touch into Digital Environments",
      "The Privacy Paradox in Smart Home Tech: Local Processing vs Cloud Capabilities",
      "High-Res Audio Breakthroughs: Lossless Wireless Codecs and Planar Magnetic Drivers",
      "Smart Pet Hardware: GPS Trackers, Automated Health Dispensers, and Cameras",
      "The Green Hardware Movement: Recycled Rare Earths and Biodegradable Enclosures",
      "Ultra-Wideband (UWB) Spatial Tracking: How Phones Navigate Physical Spaces",
      "The Future of Desktop Computing: Modular Mini PCs with Unified Memory Architectures",
      "Smart Air and Water Purification: Sensor-Driven Climate Control in Modern Homes",
      "Next-Gen VR Headsets: Micro-OLED Displays and Pancake Lens Optical Innovations",
      "The Drone Delivery Infrastructure: How Consumer UAVs Are Reshaping Last-Mile Shipping",
      "Smart Sleep Technology: Radar Sleep Tracking, Thermal Mattresses, and White Noise",
      "Satellite Connectivity in Everyday Smartphones: Emergency SOS and Global Messaging",
      "Why Open-Source Firmware Is Gaining Traction Among Smart Home Enthusiasts",
      "The Ergonomics of Spatial Computing: Weight Distribution and Eye-Tracking Accuracy",
      "Thermal Management Innovations: Vapor Chambers and Graphene in Thin Laptops",
      "Smart Locks and Facial Recognition: The Evolution of Keyless Home Entry",
      "Quantum Dots and Mini-LED: The New Standard for High-End Home Entertainment",
      "The Connected Bathroom: Smart Mirrors, Health Scanners, and Precision Water Savers",
      "The Evolution of Smart Garden Technology: Automated Drip Systems and Soil Sensors",
      "AI Cameras for Creators: Auto-Framing, Gimbal Tracking, and Real-Time Color Grading",
      "The Future of USB-C: 240W Power Delivery and 80Gbps Thunderbolt Protocols",
      "Next-Gen Smart Speakers: Beamforming Microphones and Room-Calibrated Audio",
      "Wearable Exoskeletons: How Consumer Ergonomic Suits Aid Physical Work and Fitness",
      "Micro-Inverters and Residential Solar: Integrating Battery Storage into Smart Grids",
      "The Philosophy of Invisible Tech: Designing Devices That Enhance Without Distracting"
    ];
    return titles.map((t, idx) => ({
      id: `benjamin-ahmed-article-${idx + 1}`,
      title: t,
      category: ['BUSINESS NEWS', 'TECHNOLOGY', 'HARDWARE', 'SMART HOME'][idx % 4],
      excerpt: `Consumer hardware breakdowns and product roadmap analysis from Benjamin Ahmed on smart home technology, Apple ecosystems, and emerging connected devices.`,
      imageUrl: CURATED_IMAGES[idx % CURATED_IMAGES.length],
      author: { name: 'Benjamin Ahmed' }
    }));
  }

  // Generic clean articles authored by this specific author
  const titles = [
      "How Top Founders Run High-Stakes Board Meetings with Complete Clarity",
      "Zero-Burn Operations: Frameworks for Doubling Profit Margins Without Layoffs",
      "Global Trade Realignment: How Supply Chains Are Adapting in 2026",
      "The Modern Brand Playbook: Building Viral Velocity with Community-Led Growth",
      "Navigating Capital Markets: Debt Financing Strategies for Growth-Stage Startups",
      "The Solopreneur Blueprints: Scaling to Eight Figures Without Burning Out",
      "Enterprise AI Deployments: Eliminating Operational Bottlenecks at Scale",
      "Customer Lifetime Value: Why Retention Is the Ultimate Growth Driver Today",
      "Building Future-Proof Business Models in Fast-Changing Economic Climates",
      "The Art of High-Leverage Strategic Partnerships in B2B Ecosystems",
      "Managing High-Velocity Teams: Best Practices for Asynchronous Leadership",
      "Decisive Executive Frameworks: Reversible vs Irreversible Decision Making",
      "Capital Efficiency Over Hypergrowth: The New Status Symbol for Tech Founders",
      "How Leading Direct-to-Consumer Brands Achieve 85% Annual Renewal Rates",
      "The Psychology of High-Performance Leadership Under Market Uncertainty",
      "Strategic Positioning: Building Defensible Moats Against Big Tech Conglomerates",
      "Why Disciplined Unit Economics Trump Vanity Valuation Metrics Every Time",
      "The Playbook for Expanding Into High-Margin International Corridors",
      "Cultivating Company Culture that Naturally Attracts Top-Tier Talent",
      "From Seed to Scale: Tactical Lessons from Breakout Category Creators",
      "Data-Driven Decision Making: Cutting Through Noise to Find Core Signals",
      "The Future of Commerce: Omnichannel Experiences and Automated Logistics",
      "Building High-Trust Relationships with Investors and Key Stakeholders",
      "The Resilience Equation: How Enduring Enterprises Weather Industrial Downturns",
      "Why Operational Redundancy Is the Secret to Zero-Downtime Global Scaling",
      "The Modern Product Manager: Bridging Engineering, Design, and Revenue Goals",
      "How Visionary CEOs Balance Short-Term Deliverables with Decade-Long Horizons",
      "The Science of Pricing: How Small Pricing Model Adjustments Double Gross Margins",
      "Fostering Innovation Inside Legacy Corporations: The Skunkworks Playbook",
      "Why Transparent Compensation Packages Attract Mission-Aligned Professionals",
      "The Growth Marketing Playbook: Moving Beyond Saturated Paid Ad Channels",
      "How Modern Companies Win With Dedicated Customer Success Communities",
      "The Strategy of Strategic Scarcity: Creating Exclusive Brand Equity",
      "Navigating Commercial Leases and Hybrid Workspaces in Major Metropolitan Hubs",
      "Why Corporate Speed of Learning Dictates Survival in Rapidly Evolving Sectors",
      "The Art of M&A Integration: Preserving Acquired Talent and Creative Momentum",
      "How to Build an Executive Dashboard that Alerts You to Red Flags Instantly",
      "The Playbook for Transitioning from Service Agency to High-Margin SaaS",
      "Understanding Venture Debt: When and How to Leverage Non-Dilutive Capital",
      "Building a Resilient Brand Reputation That Withstands Public Industry Shocks",
      "How Top Leaders Cultivate Creative Thinking Across Cross-Functional Teams",
      "The Anatomy of a Flawless Pitch Deck in Competitive Capital Raising Markets",
      "Turning Corporate Missteps into Golden PR Opportunities and Customer Loyalty",
      "Why Agile Budgeting Beats Rigid Annual CapEx Planning in Dynamic Tech Sectors",
      "The Power of Thought Leadership: Establishing Authority in Emerging Industries",
      "How Modern CEOs Conduct Effective Quarterly Business Reviews with Minimal Overhead",
      "The Multi-Channel Distribution Matrix: Dominating Retail, Wholesale, and Direct-to-Consumer",
      "Why Sustainable Supply Chain Practices Lower Long-Term Operational Costs",
      "The Architecture of High-Trust Remote Organizations: Metrics that Actually Matter",
      "Building Customer-Centric Feedback Loops that Guide Technical Roadmaps",
      "How Breakout Startups Secure Favorable Contract Terms with Enterprise Giants",
      "The Psychology of Negotiation: Anchoring, Active Listening, and Strategic Silence",
      "Why Founder-Led Sales Create Unshakable Product-Market Fit in Early Days",
      "The Playbook for Scaling Customer Support Without Increasing Headcount Proporationately",
      "How Data Privacy Compliance Can Be Repositioned as a Differentiating Trust Feature",
      "Managing Strategic Debt: Knowing When to Refactor Systems and Processes",
      "The Art of Organizational Simplification: Trimming Bloat to Boost Velocity",
      "How Resilient Entrepreneurs Turn Competitor Advances into Creative Momentum",
      "Building Multi-Generational Businesses: Succession Planning and Governance",
      "The Infinite Game: Why Sustainable Value Creation Beats Quick Arbitrage Exits"
    ];

  return titles.map((t, idx) => ({
    id: `${cleanSlug}-article-${idx + 1}`,
    title: t,
    category: ['LEADERSHIP', 'BUSINESS', 'ECONOMY', 'MARKETING', 'STRATEGY'][idx % 5],
    excerpt: `A rigorous breakdown of strategic principles, actionable methodologies, and case studies for modern entrepreneurs and executive leaders by ${authorName}.`,
    imageUrl: CURATED_IMAGES[idx % CURATED_IMAGES.length],
    author: { name: authorName }
  }));
}

export default function AuthorProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const initialPageParam = parseInt(searchParams?.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(() => !isNaN(initialPageParam) && initialPageParam >= 1 ? initialPageParam : 1);

  const rawSlug = params?.slug as string | undefined;
  const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || 'jason-feifer';

  const [author, setAuthor] = useState<AuthorProfile>(() => {
    const base = getAuthorProfile(slug);
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('entrepreneur_user');
        if (stored) {
          const u = JSON.parse(stored);
          const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
          const userSlugWriter = (u.writerName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const userSlugName = (u.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          if (
            (userSlugWriter && userSlugWriter === cleanSlug) ||
            (userSlugName && userSlugName === cleanSlug) ||
            (u.role === 'writer' && (cleanSlug === 'writer' || cleanSlug === 'writter' || cleanSlug === 'writeraccount'))
          ) {
            return {
              ...base,
              name: u.name || u.writerName || base.name,
              avatar: u.avatar || base.avatar,
              bio: u.bio && u.bio.trim() !== '' ? u.bio : base.bio,
            };
          }
        }
      } catch {
        // ignore
      }
    }
    return base;
  });
  const [dbArticles, setDbArticles] = useState<any[] | null>(null);

  // Synchronize state when slug parameter changes
  // Fetch author details and author-specific published articles from database
  useEffect(() => {
    let isCancelled = false;
    setCurrentPage(1);

    // 1. If currently logged in user matches slug, sync immediately
    if (user) {
      const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      const userSlugWriter = (user.writerName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const userSlugName = (user.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const isCurrentAuthor =
        (userSlugWriter && userSlugWriter === cleanSlug) ||
        (userSlugName && userSlugName === cleanSlug) ||
        (user.role === 'writer' && (cleanSlug === 'writer' || cleanSlug === 'writter' || cleanSlug === 'writeraccount'));

      if (isCurrentAuthor) {
        setAuthor((prev) => ({
          ...prev,
          name: user.name || user.writerName || prev.name,
          role: prev.role || 'Staff Writer',
          badge: prev.badge || 'Entrepreneur Staff',
          avatar: user.avatar || prev.avatar,
          bio: user.bio && user.bio.trim() !== '' ? user.bio : prev.bio,
        }));
      }
    }

    // 2. Fetch author profile from database API
    fetch(`/api/user/profile?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data?.success && data?.profile) {
          const p = data.profile;
          setAuthor((prev) => ({
            ...prev,
            name: p.name || p.fullName || p.writerName || prev.name,
            role: prev.role || 'Staff Writer',
            badge: prev.badge || 'Entrepreneur Staff',
            avatar: p.avatar && p.avatar.trim() !== '' ? p.avatar : prev.avatar,
            bio: p.bio && p.bio.trim() !== '' ? p.bio : prev.bio,
          }));
        }
      })
      .catch(() => {});

    // 3. Fetch published articles written specifically by this author from the database
    fetch('/api/articles?status=published&limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data?.success && Array.isArray(data.data) && data.data.length > 0) {
          const authorSlugClean = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
          const matching = data.data.filter((a: any) => {
            const artAuthor = (a.author?.name || a.authorName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            return (
              artAuthor === authorSlugClean ||
              (artAuthor.length > 3 && authorSlugClean.includes(artAuthor))
            );
          });
          if (matching.length > 0) {
            setDbArticles(matching);
          } else {
            setDbArticles(null);
          }
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [slug, user]);

  // Synchronize state when searchParams page parameter changes
  useEffect(() => {
    const p = parseInt(searchParams?.get('page') || '1', 10);
    if (!isNaN(p) && p >= 1) {
      setCurrentPage(p);
    }
  }, [searchParams]);

  // Base articles belonging only to the selected author
  const authorBaseArticles = React.useMemo(() => {
    // 1. Look up any matches from newsData ALL_ARTICLES
    const cleanSlug = slug.toLowerCase();
    const cleanName = author.name.toLowerCase();
    const staticMatches = ALL_ARTICLES.filter((a) => {
      const aName = (a.author?.name || '').toLowerCase().trim();
      const aSlug = aName.replace(/[^a-z0-9]+/g, '-');
      return (
        aName === cleanName ||
        aSlug === cleanSlug ||
        (cleanSlug.length > 4 && aSlug.includes(cleanSlug)) ||
        (cleanName.length > 4 && aName.includes(cleanName))
      );
    });

    const beatArticles = generateAuthorBeatArticles(author.name, slug);
    // Combine unique articles
    const combined = [...staticMatches];
    beatArticles.forEach((b) => {
      if (!combined.some((c) => c.id === b.id || c.title.toLowerCase() === b.title.toLowerCase())) {
        combined.push(b);
      }
    });

    return combined;
  }, [slug, author.name]);

  // Full pool includes DB articles if authored by this author, followed by author base articles
  const fullPool = React.useMemo(() => {
    if (dbArticles && dbArticles.length > 0) {
      return [...dbArticles, ...authorBaseArticles.filter((a) => !dbArticles.some((d: any) => d.id === a.id))];
    }
    return authorBaseArticles;
  }, [dbArticles, authorBaseArticles]);

  // Clean 24 articles per page: Divisible by 4 (6 complete rows on PC Desktop) and divisible by 3 (8 complete rows on Laptop)
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(fullPool.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentArticles = fullPool.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
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

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      {/* Navigation Header */}
      <Header />

      {/* TOP AUTHOR PROFILE SECTION */}
      <section className="bg-white pt-10 pb-4 md:pt-14 md:pb-6 px-5 lg:px-10">
        <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 md:gap-12">
            {/* Author Avatar: Clean circle with sharp high-res portrait image */}
            <div className="shrink-0">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover shadow-2xs border border-slate-200"
              />
            </div>

            {/* Author Details */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              {/* Author Name */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-black text-[#020618] leading-[1.1] tracking-tight my-0">
                {author.name}
              </h1>

              {/* Author Role */}
              <p className="text-sm sm:text-[15px] font-sans text-slate-500 font-normal mt-1.5 mb-2">
                {author.role}
              </p>

              {/* Staff / Contributor Badge */}
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

              {/* Author Bio */}
              <p className="font-serif text-slate-700 text-sm sm:text-[15px] leading-relaxed max-w-2xl my-0">
                {author.bio}
              </p>
            </div>
          </div>

          {/* Clean Horizontal Divider Line separating profile from stream */}
          <div className="border-b border-slate-200 mt-8 md:mt-10" />
        </div>
      </section>

      {/* ARTICLES STREAM */}
      <main id="author-articles-stream" className="flex-1 w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-10">
        {/* Section Headline: More From [Author Name] */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-black text-[#020618] tracking-tight my-0">
            More From {author.name}
          </h2>
        </div>

        {/* Responsive Grid: 4 columns on PC Desktop (xl:grid-cols-4), 3 columns on Laptop (lg:grid-cols-3), 2 on Tablet, 1 on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
          {currentArticles.map((art) => (
            <article key={art.id} className="relative group flex flex-col items-start text-left cursor-pointer">
              {/* Stretched link so the entire card is clickable */}
              <Link
                href={getArticleUrl(art)}
                className="absolute inset-0 z-0"
                aria-label={art.title}
              />

              {/* Card Image: Sharp square rectangular corners matching square design requirement */}
              <div className="w-full aspect-[16/9.5] overflow-hidden rounded-none bg-slate-100 mb-3.5 border border-slate-200/60 pointer-events-none">
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

        {/* FUNCTIONAL PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-12 pb-8 font-sans">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-[3px] border transition-colors ${
                currentPage === 1
                  ? 'border-slate-200 text-slate-400 bg-white cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 bg-white hover:border-[#1642D0] hover:text-[#1642D0] cursor-pointer'
              }`}
              aria-label="Previous Page"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePageChange(p)}
                className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 text-xs sm:text-sm font-semibold rounded-[3px] border transition-colors ${
                  currentPage === p
                    ? 'bg-[#1642D0] text-white border-[#1642D0]'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#1642D0] hover:text-[#1642D0] cursor-pointer'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-[3px] border transition-colors ${
                currentPage === totalPages
                  ? 'border-slate-200 text-slate-400 bg-white cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 bg-white hover:border-[#1642D0] hover:text-[#1642D0] cursor-pointer'
              }`}
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
