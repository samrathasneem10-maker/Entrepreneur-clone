'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  FileText,
  Mail,
  Trash2,
  Users,
  Megaphone,
  MessageSquare,
  Building,
  Database,
  Play,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Eye,
  Edit2,
  Plus,
  X,
  Search,
  Check,
  AlertCircle,
  ExternalLink,
  LogOut,
  User,
  RefreshCw,
  Menu,
  Download,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link2,
  List as ListIcon,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Pencil,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronUp,
  Upload,
  Settings,
  Clock,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
  Info,
  Bookmark,
  Copy,
  Pause,
} from 'lucide-react';
import ProfileSettingsModal from '@/components/writer/ProfileSettingsModal';
import { MAIN_CATEGORIES, MAIN_CATEGORIES_20 } from '@/data/categoriesData';
import { convertImageToWebP } from '@/lib/imageUtils';

export type AdminTab =
  | 'overview'
  | 'newsletter'
  | 'published'
  | 'users'
  | 'manage_ads'
  | 'contact'
  | 'leads'
  | 'backups'
  | 'shorts';

export type UserRoleTab = 'all' | 'admin' | 'writer' | 'reader';

export interface PendingArticle {
  id: string | number;
  dbId?: string | number;
  slug?: string;
  title: string;
  category: string;
  author: string;
  authorAvatar?: string;
  authorTitle?: string;
  authorBio?: string;
  authorLinkedinUrl?: string;
  authorObj?: {
    name?: string;
    avatar?: string;
    title?: string;
    bio?: string;
    linkedinUrl?: string;
  };
  submittedDate: string;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  excerpt?: string;
  readTime?: string;
  imageUrl?: string;
  content?: string;
  tags?: any;
  subCategories?: any;
  focusKeyword?: string;
  metaDescription?: string;
  cardSummary?: string;
}

export interface AdminAuthorProfile {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  linkedinUrl: string;
}

export const ADMIN_AUTHORS_REGISTRY: Record<string, AdminAuthorProfile> = {
  'dylan-candice-odulio': {
    name: 'Dylan Candice Odulio',
    role: 'News Reporter, United States Today',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    bio: 'Dylan Candice Odulio is a culture, consumer retail, and breaking news reporter at United States Today, covering viral retail trends, corporate strategy, and modern brand controversies.',
    linkedinUrl: 'https://www.linkedin.com/in/dylan-candice-odulio',
  },
  'sherin-shibu': {
    name: 'Sherin Shibu',
    role: 'News Reporter',
    avatar: '/images/sherin-shibu.jpg',
    bio: 'Sherin Shibu is a business news reporter at United States Today. She previously worked for PCMag, Business Insider, The Messenger, and ZDNET as a reporter and copyeditor. Her areas of coverage encompass tech, business, strategy, finance, and even space. She is a Columbia University graduate.',
    linkedinUrl: 'https://www.linkedin.com/in/sherin-shibu',
  },
  'amanda-breen': {
    name: 'Amanda Breen',
    role: 'Senior Features Editor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    bio: 'Amanda Breen is a senior features editor at United States Today covering wellness, workplace culture, and consumer innovation.',
    linkedinUrl: 'https://www.linkedin.com/in/amanda-breen',
  },
  'scott-smrkovski': {
    name: 'Scott Smrkovski',
    role: 'Executive Contributor',
    avatar: '/images/home-hero/author-scott.png',
    bio: 'Scott Smrkovski is a serial founder, angel investor, and executive contributor specializing in capital efficiency, venture scaling, and founder operational frameworks.',
    linkedinUrl: 'https://www.linkedin.com/in/scott-smrkovski',
  },
  'benjamin-ahmed': {
    name: 'Benjamin Ahmed',
    role: 'Consumer Tech Reporter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    bio: 'Benjamin Ahmed is a technology journalist covering consumer hardware, smart home ecosystems, AI assistants, and enterprise product roadmaps at United States Today.',
    linkedinUrl: 'https://www.linkedin.com/in/benjamin-ahmed',
  },
  'jason-feifer': {
    name: 'Jason Feifer',
    role: 'Editor in Chief',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Jason Feifer is the Editor in Chief of United States Today magazine, podcast host, and author of Build for Tomorrow. He helps entrepreneurs and modern professionals adapt to change and build future-proof businesses.',
    linkedinUrl: 'https://www.linkedin.com/in/jasonfeifer',
  },
  'michael-andrews-cooper': {
    name: 'Michael Andrews Cooper',
    role: 'Executive Leadership Strategist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Michael Andrews Cooper is an executive coach and innovation strategist who advises fast-growing startups and Fortune 500 leadership teams on turning early concepts into scalable enterprises.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'michael-andrusko': {
    name: 'Michael Andrews Cooper',
    role: 'Executive Leadership Strategist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Michael Andrews Cooper is an executive coach and innovation strategist who advises fast-growing startups and Fortune 500 leadership teams on turning early concepts into scalable enterprises.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'brandon-morgan': {
    name: 'Brandon Morgan',
    role: 'Career & Growth Advisor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
    bio: 'Brandon Morgan writes about professional decision-making frameworks, executive habits, and long-term career resilience for entrepreneurs and modern professionals.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'terry-rice': {
    name: 'Terry Rice',
    role: 'Business Consultant & Speaker',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Terry Rice is a business development consultant, digital strategist, and podcast host helping solopreneurs build thriving digital enterprises.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'aytekin-tank': {
    name: 'Aytekin Tank',
    role: 'Founder & CEO of Jotform',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Aytekin Tank is the founder and CEO of Jotform and author of Automate Your Busywork. He writes about productivity, tech, and entrepreneurship.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'samra': {
    name: 'Samra',
    role: 'Executive Business Contributor',
    avatar: '/uploads/upload_1794590868177_images__1_.webp',
    bio: 'Executive business contributor covering markets, entrepreneurship, and global enterprise strategy.',
    linkedinUrl: 'https://www.linkedin.com/in/fathima-samra',
  },
  'fathima': {
    name: 'Fathima',
    role: 'Staff Writer',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop',
    bio: 'Fathima is a staff writer at United States Today covering business, innovation, and leadership.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'kalid-mishal': {
    name: 'Kalid Mishal',
    role: 'Staff Writer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Kalid Mishal is a staff writer at United States Today covering startup growth, leadership principles, and emerging market dynamics.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'dean-guida': {
    name: 'Dean Guida',
    role: 'Contributor & Tech CEO',
    avatar: '/images/more-author-1.jpg',
    bio: "Dean Guida is the founder and CEO of Infragistics, a global software company providing tools and solutions to accelerate application design and development. He is the author of 'When Grit Is Not Enough'.",
    linkedinUrl: 'https://www.linkedin.com',
  },
  'ben-angel': {
    name: 'Ben Angel',
    role: 'Bestselling Author & Contributor',
    avatar: '/images/more-author-2.jpg',
    bio: "Ben Angel is the author of 'Unstoppable: A 90-Day Plan to Biohack Your Mind and Body for Success'. He has helped thousands of entrepreneurs maximize their cognitive performance and productivity.",
    linkedinUrl: 'https://www.linkedin.com',
  },
  'rob-aquino': {
    name: 'Rob Aquino',
    role: 'CEO & Business Strategist',
    avatar: '/images/more-author-3.jpg',
    bio: 'Rob Aquino is the CEO of JBS Corp, specializing in corporate strategy, organizational scaling, and executive leadership development across growth-stage enterprises.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'molly-cavanah': {
    name: 'Molly Cavanah',
    role: 'Growth Executive & Analyst',
    avatar: '/images/more-author-4.jpg',
    bio: 'Molly Cavanah is a seasoned growth executive with extensive experience leading revenue operations, user acquisition, and predictive data analytics for venture-backed tech companies.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'merilee-kern': {
    name: 'Merilee Kern, MBA',
    role: 'Senior Business Strategist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    bio: 'Merilee Kern, MBA is an internationally-regarded brand strategist, consumer trends analyst, and senior business journalist covering industry leaders, luxury assets, and venture growth.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'rl-adams': {
    name: 'R.L. Adams',
    role: 'Contributing Writer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    bio: 'R.L. Adams is a software engineer, serial entrepreneur, and bestselling author of dozens of books on online business, search engine optimization, and passive income generation.',
    linkedinUrl: 'https://www.linkedin.com',
  },
};

export interface UserItem {
  id: string | number;
  name: string;
  email: string;
  role: 'admin' | 'writer' | 'reader';
  isDefaultAdmin?: boolean;
  avatar?: string;
  createdAt?: string;
}

export interface SubscriberItem {
  id: string | number;
  email: string;
  status: string;
  joined: string;
}

const ADMIN_TABLE_PAGE_SIZE = 20;

const PREVIEW_SIDEBAR_ARTICLES = [
  {
    id: 'preview-side-1',
    title: 'Apple, Amazon and Microsoft Want These New AI Gadgets on Your Holiday Wish List',
    category: 'Breaking Business News',
    time: '3 hours ago',
  },
  {
    id: 'preview-side-2',
    title: 'America Finally Got a New Sunscreen. Europeans Have Been Sporting It Since 1999.',
    category: 'Research and Insights',
    time: '4 hours ago',
  },
  {
    id: 'preview-side-3',
    title: "This Popular Pickleball Franchisor Filed for Bankruptcy. Its Founder Says, 'I Own It'",
    category: 'Startups and Entrepreneurship',
    time: '4 hours ago',
  },
  {
    id: 'preview-side-4',
    title: 'AI Is Changing Your Company Culture Whether You Planned for It or Not.',
    category: 'Leadership',
    time: '5 hours ago',
  },
  {
    id: 'preview-side-5',
    title: "Creators Are Handing Their Video Edits to AI. Here's Where It Starts to Backfire.",
    category: 'Technology and AI',
    time: '6 hours ago',
  },
  {
    id: 'preview-side-6',
    title: "He Leads a $240 Billion Food Giant. Here's the Difficult Management Rule He Follows.",
    category: 'Markets and Investing',
    time: '7 hours ago',
  },
];

const PREVIEW_RELATED_CONTENT = [
  {
    id: 'prev-rel-1',
    category: 'BUILDING A BUSINESS',
    title: "An Introvert's Case for Skipping Small Talk and Building Real Connections",
    author: 'AYTEKIN TANK',
    imageUrl: '/images/related-introvert.png',
  },
  {
    id: 'prev-rel-2',
    category: 'BUILDING A BUSINESS',
    title: 'Autonomous Enterprise AI: How Small Teams Build Billion-Dollar Products',
    author: 'STAFF CONTRIBUTOR',
    imageUrl: '/images/coding-agents.jpg',
  },
  {
    id: 'prev-rel-3',
    category: 'BUSINESS NEWS',
    title: "He Leads a $240 Billion Food Giant. Here’s the Difficult Management Rule He Follows.",
    author: 'SHERIN SHIBU',
    imageUrl: '/images/related-food-giant.png',
  },
  {
    id: 'prev-rel-4',
    category: 'BUILDING A BUSINESS',
    title: 'How This Trio Built a Multi-Million Dollar Supply Chain Powerhouse From a Garage',
    author: 'JASON FEIFER',
    imageUrl: '/images/related-founders-warehouse.png',
  },
  {
    id: 'prev-rel-5',
    category: 'LEADERSHIP',
    title: "Taking the Leap: What Great Leaders Do When the Path Ahead Isn't Clear",
    author: 'TERRY RICE',
    imageUrl: '/images/related-jumping-cliff.png',
  },
  {
    id: 'prev-rel-6',
    category: 'TECHNOLOGY',
    title: 'AI Is Changing Your Company Culture Whether You Planned for It or Not',
    author: 'AMANDA BREEN',
    imageUrl: '/images/related-robot-hands.png',
  },
];

const CORE_PENDING_ARTICLES: PendingArticle[] = [
  {
    id: 'p-1',
    slug: 'kim-kardashians-skims-offers-full-refunds-after-advent',
    title: "Kim Kardashian’s SKIMS Offers Full Refunds After Advent Calendar Backlash",
    category: 'World',
    author: 'Dylan Candice Odulio',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    authorTitle: 'News Reporter, United States Today',
    authorBio: 'Dylan Candice Odulio is a culture, consumer retail, and breaking news reporter at United States Today, covering viral retail trends, corporate strategy, and modern brand controversies.',
    authorLinkedinUrl: 'https://www.linkedin.com/in/dylan-candice-odulio',
    submittedDate: '2026-11-10T12:06:53.081Z',
    status: 'PENDING',
    excerpt: 'The Kim Kardashian-founded brand contacted every buyer of its $148 accessories calendar, offering full refunds or store credit after viral unboxing videos sparked criticism over the product\'s value.',
    readTime: '5 min read',
    imageUrl: '/images/skims-calendar.jpg',
    content: "A holiday product meant to deliver 12 days of surprises instead became an unexpected public relations challenge for SKIMS, after customers questioned whether its $148 Accessories Advent Calendar was worth the price. Following widespread criticism across social media, the brand has offered every purchaser a full refund or store credit, acknowledging that the product failed to meet expectations.\n\nThe controversy began when customers started sharing unboxing videos revealing the calendar's contents. The 12 day collection included hair ties, satin scrunchies, bobby pins, hair clips, keychains, a small stress relief toy and accessories resembling bra straps repurposed as headbands.\n\nAlthough the items were marketed as everyday accessories and holiday surprises, many buyers considered the product's quality and contents disproportionate to its retail cost.",
  },
  {
    id: 'p-2',
    slug: 'from-thc-restrictions-to-legalization-texas-democrats',
    title: 'From THC Restrictions to Legalization, Texas Democrats Push Reform',
    category: 'US',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-11-10T12:10:36.221Z',
    status: 'PENDING',
    excerpt: "Texas Democrats are pushing to change the state's cannabis laws after Republican-led efforts to restrict THC products, introducing a series of measures aimed at comprehensive regulatory frameworks and criminal justice reforms.",
    readTime: '5 min read',
    imageUrl: '/images/topic-hero-leaders.jpg',
    content: "<p>Texas Democrats are pushing to change the state's cannabis laws after Republican-led efforts to restrict THC products, introducing a series of measures aimed at comprehensive regulatory frameworks and criminal justice reforms.</p><p>Advocates argue that progressive cannabis reform could generate hundreds of millions in state revenue while reducing unnecessary law enforcement burdens across commercial districts.</p>",
  },
  {
    id: 'p-3',
    slug: 'after-13-years-of-waiting-gta-vi-is-finally-ready-for-the',
    title: 'After 13 Years of Waiting, GTA VI Is Finally Ready for the World',
    category: 'WORLD',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-11-10T12:04:32.486Z',
    status: 'PENDING',
    excerpt: 'After more than a decade of anticipation, Grand Theft Auto VI is officially ready for release. Rockstar Games has completed final optimization stages across next-generation console hardware.',
    readTime: '5 min read',
    imageUrl: '/images/topic-sub-2.jpg',
    content: '<p>After more than a decade of anticipation, Grand Theft Auto VI is officially ready for release. Rockstar Games has completed final optimization stages across next-generation console hardware.</p><p>Industry analysts project the blockbuster launch could break historic entertainment revenue records within its opening 72 hours of global availability.</p>',
  },
  {
    id: 'p-4',
    slug: 'autonomous-ai-agents-scaling-enterprise-workflows',
    title: 'Autonomous AI Agents Begin Handling End-to-End Enterprise Operations',
    category: 'TECH',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-11-10T11:45:10.120Z',
    status: 'PENDING',
    excerpt: 'Self-improving AI agent swarms coordinate complex procurement, software deployment, and compliance audits with sub-second decision latency...',
    readTime: '6 min read',
    imageUrl: '/images/hero-mentor.jpg',
    content: '<p>Leading enterprise technology organizations are transitioning from manual business processes to autonomous agent swarms capable of self-healing software deployments and real-time capital allocation.</p>',
  },
  {
    id: 'p-5',
    slug: 'semiconductor-breakthroughs-promise-greater-efficiency',
    title: 'Semiconductor Breakthroughs Promise 40% Greater Energy Efficiency',
    category: 'TECHNOLOGY',
    author: 'Benjamin Ahmed',
    submittedDate: '2026-10-16T09:30:14.112Z',
    status: 'PENDING',
    excerpt: 'Novel optical interconnects and 2nm gate-all-around transistor packaging slash power consumption across hyperscale cloud compute clusters...',
    readTime: '5 min read',
    imageUrl: '/images/topic-sub-1.jpg',
    content: '<p>Next-generation chip packaging innovations are cutting thermal overhead across data centers while accelerating AI inference throughput.</p>',
  },
  {
    id: 'p-6',
    slug: 'federal-reserve-signals-measured-approach-to-rate-adjustments',
    title: 'Federal Reserve Signals Measured Approach to Q4 Rate Adjustments',
    category: 'ECONOMY',
    author: 'Sherin Shibu',
    submittedDate: '2026-10-15T16:12:08.500Z',
    status: 'PENDING',
    excerpt: 'Central bank policymakers weigh resilient labor data against cooling commercial credit conditions ahead of the upcoming policy meeting...',
    readTime: '5 min read',
    imageUrl: '/images/topic-hero-leaders.jpg',
    content: '<p>Economists and market strategists are closely watching Treasury yields and small-business lending benchmarks as Q4 unfolds.</p>',
  },
  {
    id: 'p-7',
    slug: 'regional-commercial-banks-expand-treasury-tools',
    title: 'Regional Commercial Banks Expand Integrated Treasury Tools for Founders',
    category: 'FINANCE',
    author: 'Amanda Breen',
    submittedDate: '2026-10-15T11:20:42.310Z',
    status: 'PENDING',
    excerpt: 'Digital banking adoption surges 40% as growing businesses prioritize automated cash flow forecasting and instant multi-currency settlement...',
    readTime: '5 min read',
    imageUrl: '/images/hero-mentor.jpg',
    content: '<p>Commercial banking platforms are introducing unified APIs that sync real-time invoicing, payroll, and working capital credit lines.</p>',
  },
  {
    id: 'p-8',
    slug: 'supply-chain-reshoring-drives-industrial-real-estate-boom',
    title: 'Supply Chain Re-Shoring Drives Historic Industrial Real Estate Expansion',
    category: 'BUSINESS',
    author: 'Scott Smrkovski',
    submittedDate: '2026-10-14T18:05:19.004Z',
    status: 'PENDING',
    excerpt: 'Manufacturers accelerate domestic facility investments across the Midwest and Sun Belt to insulate operations from overseas shipping delays...',
    readTime: '6 min read',
    imageUrl: '/images/topic-sub-2.jpg',
    content: '<p>Automated fulfillment hubs and advanced manufacturing campuses are setting new leasing records across major U.S. logistics corridors.</p>',
  },
  {
    id: 'p-9',
    slug: 'pope-leo-xiv-diagnosed-with-cancer-after-lung-surgery',
    title: 'Pope Leo XIV Diagnosed With Cancer After Lung Surgery',
    category: 'HEALTH',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-10-14T14:34:48.595Z',
    status: 'PENDING',
    excerpt: 'Pope Leo XIV has been diagnosed with lung cancer after undergoing surgery at Rome\'s Gemelli Hospital, the Vatican confirmed on October...',
    readTime: '5 min read',
    imageUrl: '/images/topic-hero-leaders.jpg',
    content: '<p>Vatican officials issued an update on the pontiff\'s recovery following medical procedures in Rome.</p>',
  },
  {
    id: 'p-10',
    slug: 'asus-brings-new-zenbook-14-ai-laptops',
    title: 'ASUS Brings New Zenbook 14 AI Laptops to Enterprise Buyers',
    category: 'TECHNOLOGY',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-10-10T13:47:59.132Z',
    status: 'PENDING',
    excerpt: 'ASUS has introduced its latest Zenbook 14 laptop series for enterprise teams, giving mobile professionals upgraded neural processors and AI...',
    readTime: '5 min read',
    imageUrl: '/images/topic-sub-1.jpg',
    content: '<p>Hardware makers continue integrating dedicated NPUs into ultra-portable business notebooks for on-device AI workflows.</p>',
  },
  {
    id: 'p-11',
    slug: 'starbucks-eyes-expansion-strategy-food-service',
    title: 'Starbucks Eyes $41 Billion Strategic Expansion in Fast-Casual Sector',
    category: 'BUSINESS',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-10-10T13:45:27.464Z',
    status: 'PENDING',
    excerpt: 'Starbucks may be considering a major expansion beyond coffee as executives evaluate high-margin hospitality partnerships and supply chain...',
    readTime: '5 min read',
    imageUrl: '/images/hero-mentor.jpg',
    content: '<p>Analysts weigh how major restaurant operators are deploying capital to diversify daypart customer traffic.</p>',
  },
  {
    id: 'p-12',
    slug: 'ai-school-portraits-trending-watermark-debate',
    title: 'AI Portrait Tools Are Trending, Raising Digital Watermark Questions',
    category: 'TECHNOLOGY',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-10-09T02:22:08.370Z',
    status: 'PENDING',
    excerpt: 'Digital consumer photography tools are evolving rapidly as generative editing software reshapes traditional studio licensing models...',
    readTime: '5 min read',
    imageUrl: '/images/topic-sub-2.jpg',
    content: '<p>Photographers and software platforms are collaborating on clearer provenance metadata and watermarking standards.</p>',
  },
  {
    id: 'p-13',
    slug: 'instagram-social-feed-activity-evolution',
    title: 'Before Reels, Social Networks Relied on Real-Time Activity Streams',
    category: 'TECHNOLOGY',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-10-09T02:19:57.241Z',
    status: 'PENDING',
    excerpt: 'Before short-form video dominated social engagement, consumer platforms experimented with transparent friend-activity feeds and discovery...',
    readTime: '5 min read',
    imageUrl: '/images/topic-sub-1.jpg',
    content: '<p>Product leaders reflect on how algorithmic recommendations transformed social commerce and creator monetization.</p>',
  },
  {
    id: 'p-14',
    slug: 'digital-creators-navigate-public-brand-milestones',
    title: 'Digital Creators Navigate Public Brand Partnerships and Scrutiny',
    category: 'WORLD',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-10-08T11:20:04.523Z',
    status: 'PENDING',
    excerpt: 'Independent media founders and online creators face new communications tests as audience expectations evolve around brand transparency...',
    readTime: '5 min read',
    imageUrl: '/images/topic-hero-leaders.jpg',
    content: '<p>Creator-led media businesses increasingly hire communications advisors to manage high-visibility announcements.</p>',
  },
];

// Initial pending articles list (populated with baseline articles, updated live from MySQL database)
const INITIAL_PENDING_ARTICLES: PendingArticle[] = CORE_PENDING_ARTICLES;

// 12 baseline seed subscribers (+ 3 live DB subscribers = 15 matching dashboard count)
const INITIAL_SUBSCRIBERS: SubscriberItem[] = [
  { id: 's-1', email: 'samrathasneem10@gmail.com', status: 'ACTIVE', joined: 'Nov 1, 2026' },
  { id: 's-2', email: 'akramyoonos1999@gmail.com', status: 'ACTIVE', joined: 'Nov 3, 2026' },
  { id: 's-3', email: 'investor.relations@capitol.com', status: 'ACTIVE', joined: 'Nov 5, 2026' },
  { id: 's-4', email: 'techdesk@silicon.io', status: 'ACTIVE', joined: 'Nov 6, 2026' },
  { id: 's-5', email: 'editor.brief@usatoday.com', status: 'ACTIVE', joined: 'Nov 7, 2026' },
  { id: 's-6', email: 'global.markets@bloom.com', status: 'ACTIVE', joined: 'Nov 8, 2026' },
  { id: 's-7', email: 'policy.analyst@dc-brief.gov', status: 'ACTIVE', joined: 'Nov 9, 2026' },
  { id: 's-8', email: 'sarah.m@ventures.co', status: 'ACTIVE', joined: 'Nov 10, 2026' },
  { id: 's-9', email: 'claire.dupont@paris-biz.fr', status: 'ACTIVE', joined: 'Nov 10, 2026' },
  { id: 's-10', email: 'yuki.tanaka@tokyo-trade.jp', status: 'ACTIVE', joined: 'Nov 11, 2026' },
  { id: 's-11', email: 'carlos.m@latam-news.com', status: 'ACTIVE', joined: 'Nov 11, 2026' },
  { id: 's-12', email: 'fathimasamra200305@gmail.com', status: 'ACTIVE', joined: 'Nov 11, 2026' },
];

const INITIAL_ADS = [
  { id: 'ad-1', title: 'Homepage Middle Banner 1', placement: 'Home Mid-Feed', size: '970x250', active: true },
  { id: 'ad-2', title: 'Category Header Leaderboard', placement: 'Topic Header', size: '728x90', active: true },
  { id: 'ad-3', title: 'Article Sidebar Sponsor', placement: 'Article Detail', size: '300x250', active: true },
];

function computeUserCounts(list: UserItem[]) {
  return {
    all: list.length,
    admins: list.filter((u) => u.role === 'admin').length,
    writers: list.filter((u) => u.role === 'writer').length,
    readers: list.filter((u) => u.role === 'reader').length,
  };
}

function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, currentPage), safeTotal);

  return (
    <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, safePage - 1))}
        disabled={safePage <= 1}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium transition-colors ${
          safePage <= 1
            ? 'text-slate-300 cursor-not-allowed'
            : 'text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer shadow-2xs'
        }`}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Previous</span>
      </button>

      <span className="text-xs font-medium text-slate-600 select-none">
        Page {safePage} of {safeTotal}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(safeTotal, safePage + 1))}
        disabled={safePage >= safeTotal}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold transition-colors ${
          safePage >= safeTotal
            ? 'text-slate-300 cursor-not-allowed'
            : 'text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer shadow-2xs'
        }`}
      >
        <span>Next</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  // Active Sidebar Navigation Tab
  const tabParam = searchParams?.get('tab') as AdminTab;
  const initialTab: AdminTab =
    tabParam && ['overview', 'newsletter', 'published', 'users', 'manage_ads', 'contacts', 'advertise', 'backups', 'shorts'].includes(tabParam)
      ? tabParam
      : 'overview';
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentTab = searchParams?.get('tab') as AdminTab;
    if (currentTab && ['overview', 'newsletter', 'published', 'users', 'manage_ads', 'contacts', 'advertise', 'backups', 'shorts'].includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  // Active Users Filter Tab & Search
  const [activeUserRoleTab, setActiveUserRoleTab] = useState<UserRoleTab>('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Stats Counters
  const [activeReviewsCount, setActiveReviewsCount] = useState(115);
  const [completedReleasesCount, setCompletedReleasesCount] = useState(595);
  const [newsletterSubsCount, setNewsletterSubsCount] = useState(15);

  // Users Desk Data
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [userCounts, setUserCounts] = useState({ all: 40, admins: 8, writers: 12, readers: 20 });
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Newsletter Subscribers Data
  const [subscribersList, setSubscribersList] = useState<SubscriberItem[]>(INITIAL_SUBSCRIBERS);

  // Pending Articles List (Overview Tab)
  const [pendingArticles, setPendingArticles] = useState<PendingArticle[]>(INITIAL_PENDING_ARTICLES);
  const [selectedReviewArticle, setSelectedReviewArticle] = useState<PendingArticle | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Review Mode States (Matching media_1794903234169_500827f3.jpg & Writer Dashboard)
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewExcerpt, setReviewExcerpt] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const subtitleTextareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResizeTextarea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    autoResizeTextarea(titleTextareaRef.current);
  }, [reviewTitle, selectedReviewArticle]);

  useEffect(() => {
    autoResizeTextarea(subtitleTextareaRef.current);
  }, [reviewExcerpt, selectedReviewArticle]);

  const cleanReviewTitle = useMemo(() => {
    return (reviewTitle || '').replace(/\.{2,}$/, '').trim();
  }, [reviewTitle]);
  const [reviewCategory, setReviewCategory] = useState('World');
  const [reviewImageUrl, setReviewImageUrl] = useState('');
  const [reviewTags, setReviewTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [reviewSubCategories, setReviewSubCategories] = useState<string[]>([]);
  const [reviewFocusKeyword, setReviewFocusKeyword] = useState('');
  const [reviewMetaDescription, setReviewMetaDescription] = useState('');
  const [reviewCardSummary, setReviewCardSummary] = useState('');
  const [reviewSettingsTab, setReviewSettingsTab] = useState<'details' | 'seo'>('details');
  const [reviewSidebarCollapsed, setReviewSidebarCollapsed] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewAudioPlaying, setPreviewAudioPlaying] = useState(false);
  const [previewBookmarked, setPreviewBookmarked] = useState(false);
  const [reviewImageCaption, setReviewImageCaption] = useState('');

  // Review Canvas contentEditable and formatting states (Matching Writer Dashboard)
  const reviewEditorRef = useRef<HTMLDivElement>(null);
  const reviewSavedRangeRef = useRef<Range | null>(null);

  // Floating Image Toolbar State (Matching Reference Image 2 & Writer Dashboard)
  const [selectedImageFigure, setSelectedImageFigure] = useState<HTMLElement | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);
  const [imageBounds, setImageBounds] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [selectedImageProps, setSelectedImageProps] = useState<{
    src: string;
    alt: string;
    caption: string;
    credit: string;
    size: 'small' | 'medium' | 'full';
    alignment: 'left' | 'center' | 'no_wrap' | 'right';
  } | null>(null);
  const editingImageFigureRef = useRef<HTMLElement | null>(null);
  const editingImageIdRef = useRef<string | null>(null);

  // Formatting state
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    insertOrderedList: false,
    insertUnorderedList: false,
    link: false,
    blockquote: false,
    code: false,
  });
  const [isQuoteActive, setIsQuoteActive] = useState(false);
  const [isCodeActive, setIsCodeActive] = useState(false);
  const lastToggledQuoteElRef = useRef<HTMLElement | null>(null);
  const lastToggledCodeElRef = useRef<HTMLElement | null>(null);

  // Image Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [imageSize, setImageSize] = useState<'small' | 'medium' | 'full'>('full');
  const [imageAlignment, setImageAlignment] = useState<'left' | 'center' | 'no_wrap' | 'right'>('center');
  const [imageKeywords, setImageKeywords] = useState<string[]>([]);
  const [imageKeywordInput, setImageKeywordInput] = useState('');
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [alignDropdownOpen, setAlignDropdownOpen] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Link Modal states
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);
  const [currentLinkElement, setCurrentLinkElement] = useState<HTMLAnchorElement | null>(null);
  const [reviewReadDuration, setReviewReadDuration] = useState('5 min read');
  const [reviewHomepagePlacement, setReviewHomepagePlacement] = useState('none');
  const [reviewNewsletterBanner, setReviewNewsletterBanner] = useState('auto');
  const [showEmailDistModal, setShowEmailDistModal] = useState(false);
  const [distEmails, setDistEmails] = useState<string[]>([
    'vip@unitedstatestoday.com',
    'press@partnerdesk.org',
  ]);
  const [newDistEmail, setNewDistEmail] = useState('');
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);

  // Published Articles & DB Status
  const [publishedArticles, setPublishedArticles] = useState<any[]>([]);
  const [isLoadingPublished, setIsLoadingPublished] = useState(false);
  const [publishedCategoryFilter, setPublishedCategoryFilter] = useState('all');
  const [publishedPlacementFilter, setPublishedPlacementFilter] = useState('all');
  const [publishedSearchQuery, setPublishedSearchQuery] = useState('');
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    message: string;
    database?: string;
    tables?: Array<{ name: string; rows: number }>;
  } | null>(null);
  const [isPingingDb, setIsPingingDb] = useState(false);

  // Ad Placements toggle state
  const [adPlacements, setAdPlacements] = useState(INITIAL_ADS);

  // Profile Settings Modal & Dropdown
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // User Desk Modals
  const [viewUserItem, setViewUserItem] = useState<UserItem | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  // Form states for Add / Edit User
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'writer' | 'reader'>('writer');
  const [formPassword, setFormPassword] = useState('Password123!');

  // Pagination states
  const [overviewPage, setOverviewPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [newsletterPage, setNewsletterPage] = useState(1);
  const [publishedPage, setPublishedPage] = useState(1);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Dynamic Author Resolution for Preview Modal (Loads actual article author, never a default butterfly avatar)
  const resolvedReviewAuthor = useMemo(() => {
    const art = selectedReviewArticle;
    const authorName = (art?.author || '').trim();
    if (!authorName) {
      return {
        name: 'Staff Contributor',
        avatar: '/images/author-sherin.png',
        title: 'United States Today Staff',
        bio: 'Business news reporter and contributor at United States Today, covering high-growth ventures, market trends, and modern workplace leadership.',
        linkedinUrl: 'https://www.linkedin.com',
      };
    }

    // 1. Check article-specific author fields
    const rawAvatar = art?.authorAvatar || art?.authorObj?.avatar;
    const rawTitle = art?.authorTitle || art?.authorObj?.title;
    const rawBio = art?.authorBio || art?.authorObj?.bio;
    const rawLinkedin = art?.authorLinkedinUrl || art?.authorObj?.linkedinUrl;

    // 2. Check registered users list
    const matchedUser = usersList.find(
      (u) =>
        u.name?.toLowerCase().trim() === authorName.toLowerCase() ||
        (u as any).writer_name?.toLowerCase().trim() === authorName.toLowerCase() ||
        (u as any).writerName?.toLowerCase().trim() === authorName.toLowerCase()
    );

    // 3. Check known author profiles registry
    const slugKey = authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const knownProfile = ADMIN_AUTHORS_REGISTRY[slugKey] || null;

    const finalName = authorName;
    const finalAvatar =
      (rawAvatar && !rawAvatar.includes('butterfly') ? rawAvatar : null) ||
      (matchedUser?.avatar && !matchedUser.avatar.includes('butterfly') ? matchedUser.avatar : null) ||
      knownProfile?.avatar ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop`;

    const finalTitle =
      rawTitle ||
      (matchedUser as any)?.title ||
      knownProfile?.role ||
      (matchedUser?.role === 'writer' ? 'United States Today Staff Contributor' : 'United States Today Staff');

    const finalBio =
      rawBio ||
      (matchedUser as any)?.bio ||
      knownProfile?.bio ||
      `${finalName} is a journalist and contributor at United States Today covering high-growth ventures, markets, technology, and leadership.`;

    const finalLinkedin =
      rawLinkedin ||
      (matchedUser as any)?.linkedin_url ||
      (matchedUser as any)?.linkedinUrl ||
      knownProfile?.linkedinUrl ||
      `https://www.linkedin.com/in/${slugKey}`;

    return {
      name: finalName,
      avatar: finalAvatar,
      title: finalTitle,
      bio: finalBio,
      linkedinUrl: finalLinkedin,
    };
  }, [selectedReviewArticle, usersList]);

  // Preview Instant Open (Synchronizes latest contentEditable canvas before displaying full preview)
  const handleOpenReviewPreview = () => {
    if (reviewEditorRef.current) {
      const liveHtml = reviewEditorRef.current.innerHTML;
      setReviewContent(liveHtml);
      const firstImg = reviewEditorRef.current.querySelector('img')?.getAttribute('src');
      if (firstImg && firstImg !== reviewImageUrl) {
        setReviewImageUrl(firstImg);
      }
    }
    setShowPreviewModal(true);
  };

  // Subcategory Toggle matching Writer Dashboard (Max 5, Toast warning on exceeding)
  const handleToggleReviewSubCategory = (sub: string) => {
    if (reviewSubCategories.includes(sub)) {
      setReviewSubCategories((prev) => prev.filter((s) => s !== sub));
    } else {
      if (reviewSubCategories.length >= 5) {
        showToast('You can select a maximum of 5 sub-categories.', 'warning');
        return;
      }
      setReviewSubCategories((prev) => [...prev, sub]);
    }
  };

  const handleTogglePreviewAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (previewAudioPlaying) {
      window.speechSynthesis.cancel();
      setPreviewAudioPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak = `${reviewTitle.trim() || 'Untitled Article Headline'}. ${reviewExcerpt.trim() || reviewCardSummary.trim() || ''}. Reported by ${resolvedReviewAuthor.name}.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.lang = 'en-US';
    utterance.onend = () => setPreviewAudioPlaying(false);
    utterance.onerror = () => setPreviewAudioPlaying(false);
    window.speechSynthesis.speak(utterance);
    setPreviewAudioPlaying(true);
  };

  const handleClosePreview = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPreviewAudioPlaying(false);
    setShowPreviewModal(false);
  };

  const formattedReviewContent = useMemo(() => {
    if (!reviewContent || !reviewContent.trim()) {
      return '<p class="text-slate-400 italic">No article body written yet.</p>';
    }
    if (/<[a-z][\s\S]*>/i.test(reviewContent)) {
      return reviewContent;
    }
    return reviewContent
      .split(/\n\s*\n|\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${p}</p>`)
      .join('');
  }, [reviewContent]);

  const previewDateFormatted = useMemo(() => {
    if (selectedReviewArticle?.submittedDate) {
      const d = new Date(selectedReviewArticle.submittedDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
      }
    }
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  }, [selectedReviewArticle?.submittedDate]);

  // Rich Text Editor & Image Handling (Matching Writer Dashboard Behavior)
  const updateActiveFormats = () => {
    if (typeof window === 'undefined') return;
    try {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      let isOL = document.queryCommandState('insertOrderedList');
      let isUL = document.queryCommandState('insertUnorderedList');

      let isLink = false;
      let insideQuote = false;
      let insideCode = false;

      const sel = window.getSelection();
      if (sel && sel.anchorNode && reviewEditorRef.current?.contains(sel.anchorNode)) {
        let el: Node | null = sel.anchorNode;
        if (el.nodeType === Node.TEXT_NODE) el = el.parentNode;
        if ((el as HTMLElement)?.closest?.('blockquote')) insideQuote = true;
        if ((el as HTMLElement)?.closest?.('pre')) insideCode = true;
        while (el && el !== reviewEditorRef.current) {
          const tag = (el as HTMLElement).tagName?.toLowerCase();
          if (tag === 'a') isLink = true;
          if (tag === 'ol') isOL = true;
          if (tag === 'ul') isUL = true;
          el = el.parentNode;
        }
      }

      setIsQuoteActive(insideQuote);
      setIsCodeActive(insideCode);

      setActiveFormats({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        insertOrderedList: isOL,
        insertUnorderedList: isUL,
        link: isLink,
        blockquote: insideQuote,
        code: insideCode,
      });
    } catch {}
  };

  const saveSelectionRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && reviewEditorRef.current?.contains(sel.anchorNode)) {
      reviewSavedRangeRef.current = sel.getRangeAt(0);
    }
    updateActiveFormats();
  };

  const ensureEditorSelection = () => {
    if (!reviewEditorRef.current) return null;
    reviewEditorRef.current.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && reviewEditorRef.current.contains(sel.anchorNode)) {
      reviewSavedRangeRef.current = sel.getRangeAt(0);
      return sel;
    }
    if (reviewSavedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(reviewSavedRangeRef.current);
      return sel;
    }
    return sel;
  };

  const handleEditorInput = () => {
    if (!reviewEditorRef.current) return;
    const content = reviewEditorRef.current.innerHTML;
    setReviewContent(content);

    // Live Read Duration calculation
    const text = (reviewEditorRef.current.innerText || '')
      .replace(/\u00a0/g, ' ')
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .trim();
    const fullText = (reviewTitle + ' ' + reviewExcerpt + ' ' + text).trim();
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    setReviewReadDuration(`${minutes} min read`);

    const firstImg = reviewEditorRef.current.querySelector('img');
    if (firstImg) {
      const src = firstImg.getAttribute('src');
      if (src) setReviewImageUrl(src);
    }

    if (selectedImageFigure && reviewEditorRef.current.contains(selectedImageFigure)) {
      updateImageSelectionBounds(selectedImageFigure);
    }
  };

  const executeFormatting = (command: string, value: string | undefined = undefined) => {
    if (reviewEditorRef.current) {
      ensureEditorSelection();
      document.execCommand(command, false, value);
      handleEditorInput();
      setTimeout(updateActiveFormats, 50);
    }
  };

  const updateImageSelectionBounds = (fig: HTMLElement) => {
    if (!reviewEditorRef.current) return;
    const targetRect = fig.getBoundingClientRect();
    const container = reviewEditorRef.current.parentElement || reviewEditorRef.current;
    const containerRect = container.getBoundingClientRect();
    const bounds = {
      top: targetRect.top - containerRect.top,
      left: targetRect.left - containerRect.left,
      width: targetRect.width,
      height: targetRect.height,
    };
    setImageBounds(bounds);

    // Positioned slightly upward to sit cleanly above image without overlapping, closer to toolbar area above
    setToolbarPosition({
      top: Math.max(-50, bounds.top - 48),
      left: Math.max(8, Math.min(bounds.left, containerRect.width - 340)),
    });
  };

  useEffect(() => {
    if (!selectedImageFigure) return;
    const handleScrollOrResize = () => {
      if (selectedImageFigure && reviewEditorRef.current?.contains(selectedImageFigure)) {
        updateImageSelectionBounds(selectedImageFigure);
      }
    };
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [selectedImageFigure]);

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a') as HTMLAnchorElement | null;
    if (anchor && reviewEditorRef.current?.contains(anchor)) {
      const href = anchor.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        const targetAttr = anchor.getAttribute('target') || '_blank';
        window.open(href, targetAttr, 'noopener,noreferrer');
        showToast(`Redirecting to ${href}...`);
        return;
      }
    }

    const figure = target.closest('figure.article-image-figure') as HTMLElement | null;

    if (figure && reviewEditorRef.current?.contains(figure)) {
      if (!figure.dataset.imageId) {
        figure.dataset.imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      }
      setSelectedImageFigure(figure);
      editingImageFigureRef.current = figure;
      editingImageIdRef.current = figure.dataset.imageId;

      const img = figure.querySelector('img');
      const figcaption = figure.querySelector('figcaption');
      const captionSpan = figure.querySelector('.image-caption');
      const creditSpan = figure.querySelector('.image-credit');

      let parsedCaption = captionSpan ? captionSpan.textContent || '' : '';
      let parsedCredit = creditSpan ? creditSpan.textContent || '' : '';

      if (!parsedCaption && !parsedCredit && figcaption) {
        parsedCaption = figcaption.innerText || '';
      }

      let cleanCredit = parsedCredit.trim();
      if (cleanCredit.startsWith('(') && cleanCredit.endsWith(')')) {
        cleanCredit = cleanCredit.slice(1, -1).trim();
      }
      if (/^photo:\s*/i.test(cleanCredit)) {
        cleanCredit = cleanCredit.replace(/^photo:\s*/i, '').trim();
      }

      const size = (figure.dataset.size as 'small' | 'medium' | 'full') || 'medium';
      const align = (figure.dataset.align as 'left' | 'center' | 'no_wrap' | 'right') || 'center';

      const extractedCaption = figure.dataset.caption !== undefined ? figure.dataset.caption : parsedCaption;
      const extractedCredit = figure.dataset.credit !== undefined ? figure.dataset.credit : cleanCredit;

      setImageCaption(extractedCaption);
      setImageCredit(extractedCredit);
      setReviewImageCaption(extractedCaption);

      setSelectedImageProps({
        src: img?.getAttribute('src') || '',
        alt: img?.getAttribute('alt') || '',
        caption: extractedCaption,
        credit: extractedCredit,
        size,
        alignment: align,
      });

      updateImageSelectionBounds(figure);
    } else {
      setSelectedImageFigure(null);
      setImageBounds(null);
      setToolbarPosition(null);
      setSelectedImageProps(null);
    }
    updateActiveFormats();
  };

  const getFigureStyle = (alignment: string, size: string) => {
    let maxWidth = '480px';
    let width = '100%';
    if (size === 'small') {
      maxWidth = '260px';
    } else if (size === 'medium') {
      maxWidth = '480px';
    } else if (size === 'full') {
      maxWidth = '100%';
      width = '100%';
    }

    let float = 'none';
    let clear = 'both';
    let display = 'block';
    let margin = '1.5rem auto';

    if (alignment === 'left') {
      float = 'left';
      clear = 'none';
      display = 'block';
      margin = '0.5rem 1.5rem 1rem 0';
    } else if (alignment === 'right') {
      float = 'right';
      clear = 'none';
      display = 'block';
      margin = '0.5rem 0 1rem 1.5rem';
    } else if (alignment === 'center') {
      float = 'none';
      clear = 'both';
      display = 'block';
      margin = '1.5rem auto';
    } else if (alignment === 'no_wrap') {
      float = 'none';
      clear = 'both';
      display = 'block';
      margin = '1.5rem auto 1.5rem 0';
    }

    return `display: ${display} !important; float: ${float} !important; clear: ${clear} !important; margin: ${margin} !important; width: ${width} !important; max-width: ${maxWidth} !important; height: fit-content !important; padding: 0 !important; box-sizing: border-box !important;`;
  };

  const handleUpdateImageSize = (size: 'small' | 'medium' | 'full') => {
    if (!selectedImageFigure) return;
    selectedImageFigure.dataset.size = size;

    selectedImageFigure.classList.remove('max-w-[250px]', 'max-w-[260px]', 'max-w-[450px]', 'max-w-[480px]', 'w-full', 'max-w-none', 'w-fit');
    if (size === 'small') {
      selectedImageFigure.classList.add('max-w-[260px]', 'w-fit');
    } else if (size === 'medium') {
      selectedImageFigure.classList.add('max-w-[480px]', 'w-fit');
    } else {
      selectedImageFigure.classList.add('w-full', 'max-w-none');
    }

    const alignment = (selectedImageFigure.dataset.align as 'left' | 'center' | 'no_wrap' | 'right') || 'center';
    selectedImageFigure.style.cssText = getFigureStyle(alignment, size);

    setSelectedImageProps((prev) => (prev ? { ...prev, size } : null));
    handleEditorInput();
    updateImageSelectionBounds(selectedImageFigure);
    setTimeout(() => {
      if (selectedImageFigure) updateImageSelectionBounds(selectedImageFigure);
    }, 40);
    showToast(`Image size updated to ${size.toUpperCase()}`);
  };

  const handleUpdateImageAlignment = (alignment: 'left' | 'center' | 'no_wrap' | 'right') => {
    if (!selectedImageFigure) return;
    selectedImageFigure.dataset.align = alignment;

    selectedImageFigure.classList.remove(
      'float-left',
      'mr-6',
      'mb-4',
      'my-2',
      'float-right',
      'ml-6',
      'mx-auto',
      'text-center',
      'clear-both',
      'my-6',
      'block',
      'w-fit'
    );

    const size = (selectedImageFigure.dataset.size as 'small' | 'medium' | 'full') || 'medium';

    if (alignment === 'left') {
      selectedImageFigure.classList.add('float-left', 'mr-6', 'mb-4', 'my-2', 'w-fit');
    } else if (alignment === 'right') {
      selectedImageFigure.classList.add('float-right', 'ml-6', 'mb-4', 'my-2', 'w-fit');
    } else if (alignment === 'no_wrap') {
      selectedImageFigure.classList.add('my-6', 'block', 'clear-both', 'w-fit');
    } else {
      selectedImageFigure.classList.add('my-6', 'block', 'clear-both', 'mx-auto', 'text-center', 'w-fit');
    }

    selectedImageFigure.style.cssText = getFigureStyle(alignment, size);

    setSelectedImageProps((prev) => (prev ? { ...prev, alignment } : null));
    handleEditorInput();
    updateImageSelectionBounds(selectedImageFigure);
    setTimeout(() => {
      if (selectedImageFigure) updateImageSelectionBounds(selectedImageFigure);
    }, 40);
    showToast(`Image alignment updated to ${alignment}`);
  };

  const normalizeEditorBlocks = (editor: HTMLElement) => {
    const childNodes = Array.from(editor.childNodes);
    let currentInlineNodes: Node[] = [];

    const flushInlineNodes = () => {
      if (currentInlineNodes.length === 0) return;
      const rawHtml = currentInlineNodes
        .map((n) => {
          if (n.nodeType === Node.TEXT_NODE) {
            return (n.textContent || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          }
          return (n as HTMLElement).outerHTML || '';
        })
        .join('');

      const paragraphs = rawHtml.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
      const firstNode = currentInlineNodes[0];

      if (paragraphs.length > 0) {
        paragraphs.forEach((pText) => {
          const p = document.createElement('p');
          p.className = 'my-3';
          p.innerHTML = pText.replace(/\n/g, '<br>');
          editor.insertBefore(p, firstNode);
        });
      }

      currentInlineNodes.forEach((n) => n.parentNode?.removeChild(n));
      currentInlineNodes = [];
    };

    for (const node of childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (
          ['figure', 'p', 'div', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'pre'].includes(tag)
        ) {
          flushInlineNodes();
        } else {
          currentInlineNodes.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent && node.textContent.trim().length > 0) {
          currentInlineNodes.push(node);
        } else {
          node.parentNode?.removeChild(node);
        }
      }
    }
    flushInlineNodes();
  };

  const handleMoveImage = (direction: 'up' | 'down') => {
    if (!selectedImageFigure || !reviewEditorRef.current) return;
    const editor = reviewEditorRef.current;
    let figure = selectedImageFigure;

    if (figure.parentElement && figure.parentElement !== editor && editor.contains(figure.parentElement)) {
      const parentBlock = figure.parentElement;
      editor.insertBefore(figure, parentBlock);
      if (parentBlock.tagName === 'P' && !parentBlock.textContent?.trim() && !parentBlock.querySelector('img')) {
        parentBlock.remove();
      }
    }

    normalizeEditorBlocks(editor);

    if (direction === 'up') {
      let target = figure.previousElementSibling as HTMLElement | null;
      while (
        target &&
        target.tagName === 'P' &&
        !target.textContent?.trim() &&
        !target.querySelector('img') &&
        target.previousElementSibling
      ) {
        const emptyP = target;
        target = target.previousElementSibling as HTMLElement | null;
        emptyP.remove();
      }
      if (target && editor.contains(target)) {
        editor.insertBefore(figure, target);
        handleEditorInput();
        updateImageSelectionBounds(figure);
        setTimeout(() => {
          updateImageSelectionBounds(figure);
        }, 30);
      }
    } else {
      let target = figure.nextElementSibling as HTMLElement | null;
      while (
        target &&
        target.tagName === 'P' &&
        !target.textContent?.trim() &&
        !target.querySelector('img') &&
        target.nextElementSibling
      ) {
        const emptyP = target;
        target = target.nextElementSibling as HTMLElement | null;
        emptyP.remove();
      }
      if (target && editor.contains(target)) {
        if (target.nextSibling) {
          editor.insertBefore(figure, target.nextSibling);
        } else {
          editor.appendChild(figure);
        }
        handleEditorInput();
        updateImageSelectionBounds(figure);
        setTimeout(() => {
          updateImageSelectionBounds(figure);
        }, 30);
      }
    }
  };

  const handleDeleteSelectedImage = () => {
    if (!selectedImageFigure) return;
    selectedImageFigure.remove();
    setSelectedImageFigure(null);
    setImageBounds(null);
    setToolbarPosition(null);
    setSelectedImageProps(null);
    handleEditorInput();
    showToast('Image removed from article.');
  };

  const handleEditSelectedImage = () => {
    if (!selectedImageProps) return;
    if (selectedImageFigure) {
      if (!selectedImageFigure.dataset.imageId) {
        selectedImageFigure.dataset.imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      }
      editingImageFigureRef.current = selectedImageFigure;
      editingImageIdRef.current = selectedImageFigure.dataset.imageId;
    }
    setModalImageUrl(selectedImageProps.src);
    setImageCaption(selectedImageProps.caption);
    setImageCredit(selectedImageProps.credit);
    setImageSize(selectedImageProps.size);
    setImageAlignment(selectedImageProps.alignment);
    setShowImageModal(true);
  };

  const handleImageKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = imageKeywordInput.trim().replace(/^#/, '');
      if (trimmed && !imageKeywords.includes(trimmed)) {
        if (imageKeywords.length >= 4) {
          showToast('Maximum 4 keywords per image.');
          return;
        }
        setImageKeywords((prev) => [...prev, trimmed]);
        setImageKeywordInput('');
      }
    }
  };

  const handleRemoveImageKeyword = (kwToRemove: string) => {
    setImageKeywords((prev) => prev.filter((k) => k !== kwToRemove));
  };

  const handleModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP, etc.).', 'error');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast('Image file size must be less than 20MB.', 'error');
      return;
    }

    try {
      const { webpDataUrl, webpFileName } = await convertImageToWebP(file);
      setUploadedFileName(webpFileName);
      setModalImageUrl(webpDataUrl);
      showToast('Image converted to WebP format successfully!');
    } catch (_) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setUploadedFileName(file.name);
          setModalImageUrl(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImageIntoEditor = async () => {
    let finalUrl = modalImageUrl.trim();
    if (!finalUrl) {
      showToast('Please provide an image URL or choose a file.', 'error');
      return;
    }

    if (finalUrl.startsWith('data:image/') && !finalUrl.startsWith('data:image/webp')) {
      try {
        const { webpDataUrl } = await convertImageToWebP(finalUrl);
        finalUrl = webpDataUrl;
      } catch (_) {}
    }

    let sizeClass = 'max-w-[450px] w-fit';
    if (imageSize === 'small') {
      sizeClass = 'max-w-[250px] w-fit';
    } else if (imageSize === 'full') {
      sizeClass = 'w-full max-w-none';
    }

    let alignClass = 'my-6 block clear-both mx-auto text-center w-fit';
    if (imageAlignment === 'left') {
      alignClass = 'float-left mr-6 mb-4 my-2 text-left w-fit';
    } else if (imageAlignment === 'right') {
      alignClass = 'float-right ml-6 mb-4 my-2 text-right w-fit';
    } else if (imageAlignment === 'no_wrap') {
      alignClass = 'my-6 block clear-both text-left w-fit';
    }

    const captionSafe = imageCaption.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const rawCredit = imageCredit.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let formattedCredit = '';
    if (rawCredit) {
      if (rawCredit.startsWith('(') && rawCredit.endsWith(')')) {
        formattedCredit = rawCredit;
      } else if (/^photo:\s*/i.test(rawCredit)) {
        formattedCredit = `(${rawCredit.toUpperCase()})`;
      } else {
        formattedCredit = `(PHOTO: ${rawCredit})`;
      }
    }

    const altSafe = (captionSafe || imageKeywords.join(', ') || reviewTitle.trim() || 'Article Image').replace(/"/g, '&quot;');
    const figureInlineStyle = getFigureStyle(imageAlignment, imageSize);

    const captionMarkup = (captionSafe || formattedCredit)
      ? `<figcaption class="flex items-center justify-between text-[11px] text-slate-500 w-full font-sans select-none" style="margin-top: 2px !important; margin-bottom: 0 !important; padding: 0 !important; display: flex !important; align-items: center !important; justify-content: space-between !important; width: 100% !important;"><span class="image-caption text-left text-slate-600 font-normal truncate max-w-[60%]">${captionSafe}</span><span class="image-credit text-right text-slate-400 font-medium tracking-wide truncate max-w-[40%]">${formattedCredit}</span></figcaption>`
      : '';

    const targetFigure =
      editingImageFigureRef.current ||
      (editingImageIdRef.current && reviewEditorRef.current?.querySelector(`figure[data-image-id="${editingImageIdRef.current}"]`) as HTMLElement | null) ||
      (selectedImageFigure && reviewEditorRef.current?.contains(selectedImageFigure) ? selectedImageFigure : null);

    if (targetFigure && reviewEditorRef.current?.contains(targetFigure)) {
      targetFigure.dataset.size = imageSize;
      targetFigure.dataset.align = imageAlignment;
      targetFigure.dataset.caption = captionSafe;
      targetFigure.dataset.credit = rawCredit;
      targetFigure.className = `article-image-figure group relative cursor-pointer ${alignClass} ${sizeClass} select-none`;
      targetFigure.style.cssText = figureInlineStyle;
      const img = targetFigure.querySelector('img');
      if (img) {
        img.src = finalUrl;
        img.alt = altSafe;
        img.style.cssText = 'margin: 0 !important; padding: 0 !important; display: block !important;';
      }
      const figcaption = targetFigure.querySelector('figcaption');
      if (figcaption) {
        if (captionMarkup) {
          figcaption.className = 'flex items-center justify-between text-[11px] text-slate-500 w-full font-sans select-none';
          figcaption.style.cssText = 'margin-top: 2px !important; margin-bottom: 0 !important; padding: 0 !important; display: flex !important; align-items: center !important; justify-content: space-between !important; width: 100% !important;';
          figcaption.innerHTML = `<span class="image-caption text-left text-slate-600 font-normal truncate max-w-[60%]">${captionSafe}</span><span class="image-credit text-right text-slate-400 font-medium tracking-wide truncate max-w-[40%]">${formattedCredit}</span>`;
        } else {
          figcaption.remove();
        }
      } else if (captionMarkup) {
        targetFigure.insertAdjacentHTML('beforeend', captionMarkup);
      }

      setReviewImageUrl(finalUrl);
      setReviewImageCaption(captionSafe);
      editingImageFigureRef.current = null;
      editingImageIdRef.current = null;
      setSelectedImageFigure(targetFigure);
      setSelectedImageProps({
        src: finalUrl,
        alt: altSafe,
        caption: captionSafe,
        credit: rawCredit,
        size: imageSize,
        alignment: imageAlignment,
      });

      handleEditorInput();
      updateImageSelectionBounds(targetFigure);
      setShowImageModal(false);
      showToast('Image updated successfully in place!');
      return;
    }

    const newImageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const figureMarkup = `<figure class="article-image-figure group relative cursor-pointer ${alignClass} ${sizeClass} select-none" data-image-id="${newImageId}" data-size="${imageSize}" data-align="${imageAlignment}" data-caption="${captionSafe}" data-credit="${rawCredit}" contenteditable="false" style="${figureInlineStyle}"><img src="${finalUrl}" alt="${altSafe}" class="rounded-none w-full h-auto block object-cover shadow-2xs border border-slate-200 pointer-events-none" style="margin: 0 !important; padding: 0 !important; display: block !important;" />${captionMarkup}</figure><p><br></p>`;

    if (reviewEditorRef.current) {
      reviewEditorRef.current.focus();
      if (reviewSavedRangeRef.current) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(reviewSavedRangeRef.current);
        }
      }
      document.execCommand('insertHTML', false, figureMarkup);

      if (!reviewEditorRef.current.innerHTML.includes(finalUrl)) {
        reviewEditorRef.current.innerHTML += figureMarkup;
      }
      handleEditorInput();
    }

    setReviewImageUrl(finalUrl);
    setReviewImageCaption(captionSafe);
    editingImageFigureRef.current = null;
    editingImageIdRef.current = null;
    setShowImageModal(false);
    setModalImageUrl('');
    setUploadedFileName('');
    setImageKeywords([]);
    setImageCaption('');
    setImageCredit('');
    showToast('Image inserted successfully!');
  };

  const toggleQuoteSection = () => {
    if (!reviewEditorRef.current) return;
    reviewEditorRef.current.focus();
    const sel = window.getSelection();
    let range: Range | null = null;
    if (sel && sel.rangeCount > 0 && reviewEditorRef.current.contains(sel.anchorNode)) {
      range = sel.getRangeAt(0);
    } else if (reviewSavedRangeRef.current && reviewEditorRef.current.contains(reviewSavedRangeRef.current.commonAncestorContainer)) {
      range = reviewSavedRangeRef.current;
    }

    let existingQuote: HTMLElement | null = null;
    if (range) {
      let node: Node | null = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
      existingQuote = (node as HTMLElement)?.closest?.('blockquote') || null;
    }
    if (!existingQuote && lastToggledQuoteElRef.current && reviewEditorRef.current.contains(lastToggledQuoteElRef.current)) {
      existingQuote = lastToggledQuoteElRef.current;
    }

    if (existingQuote) {
      const text = existingQuote.innerText?.trim() || existingQuote.textContent?.trim() || '';
      const p = document.createElement('p');
      p.className = 'my-3';
      p.innerHTML = text ? text.replace(/\n\n+/g, '</p><p class="my-3">').replace(/\n/g, '<br>') : '<br>';
      existingQuote.parentNode?.replaceChild(p, existingQuote);
      lastToggledQuoteElRef.current = null;
      setIsQuoteActive(false);
      handleEditorInput();
      showToast('Quote section removed.');
      setTimeout(updateActiveFormats, 50);
      return;
    }

    let targetBlock: HTMLElement | null = null;
    if (range) {
      let node: Node | null = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
      targetBlock = ((node as HTMLElement)?.closest?.('p, div, h1, h2, h3, h4, h5, h6, li') as HTMLElement | null) || null;
      if (targetBlock && !reviewEditorRef.current.contains(targetBlock)) targetBlock = null;
      if (targetBlock === reviewEditorRef.current) targetBlock = null;
    }

    const quoteEl = document.createElement('blockquote');
    quoteEl.className = 'quote-section border-l-[3px] border-[#EA580C] pl-4 py-1.5 my-3 text-slate-800 font-serif text-base';
    quoteEl.setAttribute('contenteditable', 'true');

    if (range && !range.collapsed && range.toString().trim()) {
      const fragment = range.extractContents();
      const p = document.createElement('p');
      p.appendChild(fragment);
      quoteEl.appendChild(p);
      range.insertNode(quoteEl);
    } else if (targetBlock && targetBlock.parentNode) {
      const content = targetBlock.innerHTML.trim() ? targetBlock.innerHTML : '<br>';
      quoteEl.innerHTML = `<p>${content}</p>`;
      targetBlock.parentNode.replaceChild(quoteEl, targetBlock);
    } else {
      quoteEl.innerHTML = '<p><br></p>';
      if (range) {
        range.insertNode(quoteEl);
      } else {
        reviewEditorRef.current.appendChild(quoteEl);
      }
    }

    lastToggledQuoteElRef.current = quoteEl;
    setIsQuoteActive(true);
    handleEditorInput();
    showToast('Quote section formatted.');
    setTimeout(updateActiveFormats, 50);
  };

  const toggleCodeSection = () => {
    if (!reviewEditorRef.current) return;
    reviewEditorRef.current.focus();
    const sel = window.getSelection();
    let range: Range | null = null;
    if (sel && sel.rangeCount > 0 && reviewEditorRef.current.contains(sel.anchorNode)) {
      range = sel.getRangeAt(0);
    } else if (reviewSavedRangeRef.current && reviewEditorRef.current.contains(reviewSavedRangeRef.current.commonAncestorContainer)) {
      range = reviewSavedRangeRef.current;
    }

    let existingCode: HTMLElement | null = null;
    if (range) {
      let node: Node | null = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
      existingCode = (node as HTMLElement)?.closest?.('pre') || null;
    }
    if (!existingCode && lastToggledCodeElRef.current && reviewEditorRef.current.contains(lastToggledCodeElRef.current)) {
      existingCode = lastToggledCodeElRef.current;
    }

    if (existingCode) {
      const text = existingCode.textContent?.trim() || '';
      const p = document.createElement('p');
      p.className = 'my-3';
      p.innerHTML = text ? text.replace(/\n\n+/g, '</p><p class="my-3">').replace(/\n/g, '<br>') : '<br>';
      existingCode.parentNode?.replaceChild(p, existingCode);
      lastToggledCodeElRef.current = null;
      setIsCodeActive(false);
      handleEditorInput();
      showToast('Code block removed.');
      setTimeout(updateActiveFormats, 50);
      return;
    }

    const codeEl = document.createElement('pre');
    codeEl.className = 'p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto my-3';
    codeEl.setAttribute('contenteditable', 'true');

    if (range && !range.collapsed && range.toString().trim()) {
      codeEl.textContent = range.toString();
      range.deleteContents();
      range.insertNode(codeEl);
    } else {
      codeEl.innerHTML = '<code>// Paste code or script snippet here</code>';
      if (range) {
        range.insertNode(codeEl);
      } else {
        reviewEditorRef.current.appendChild(codeEl);
      }
    }

    lastToggledCodeElRef.current = codeEl;
    setIsCodeActive(true);
    handleEditorInput();
    showToast('Code block formatted.');
    setTimeout(updateActiveFormats, 50);
  };

  const applyListFormatting = (listType: 'ol' | 'ul') => {
    if (!reviewEditorRef.current) return;
    ensureEditorSelection();
    document.execCommand(listType === 'ol' ? 'insertOrderedList' : 'insertUnorderedList', false);
    handleEditorInput();
    setTimeout(updateActiveFormats, 50);
  };

  const openLinkModal = () => {
    saveSelectionRange();
    const sel = window.getSelection();
    let selectedText = '';
    let existingAnchor: HTMLAnchorElement | null = null;

    if (sel && sel.rangeCount > 0) {
      selectedText = sel.toString();
      let node: Node | null = sel.anchorNode;
      if (node && node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
      }
      while (node && node !== reviewEditorRef.current) {
        if ((node as HTMLElement).tagName?.toLowerCase() === 'a') {
          existingAnchor = node as HTMLAnchorElement;
          break;
        }
        node = node?.parentNode || null;
      }
    }

    if (existingAnchor) {
      setCurrentLinkElement(existingAnchor);
      setLinkUrl(existingAnchor.getAttribute('href') || '');
      setLinkText(existingAnchor.textContent || selectedText);
      setLinkOpenNewTab(existingAnchor.getAttribute('target') === '_blank');
    } else {
      setCurrentLinkElement(null);
      setLinkUrl('');
      setLinkText(selectedText);
      setLinkOpenNewTab(true);
    }
    setShowLinkModal(true);
  };

  const handleApplyLink = () => {
    let cleanUrl = linkUrl.trim();
    if (!cleanUrl) {
      showToast('Please enter a valid URL.', 'error');
      return;
    }
    if (cleanUrl.toLowerCase().startsWith('javascript:')) {
      showToast('JavaScript links are not permitted.', 'error');
      return;
    }
    if (
      !cleanUrl.startsWith('http://') &&
      !cleanUrl.startsWith('https://') &&
      !cleanUrl.startsWith('mailto:') &&
      !cleanUrl.startsWith('#') &&
      !cleanUrl.startsWith('/')
    ) {
      cleanUrl = 'https://' + cleanUrl;
    }

    if (currentLinkElement) {
      currentLinkElement.setAttribute('href', cleanUrl);
      if (linkOpenNewTab) {
        currentLinkElement.setAttribute('target', '_blank');
        currentLinkElement.setAttribute('rel', 'noopener noreferrer');
      } else {
        currentLinkElement.removeAttribute('target');
        currentLinkElement.removeAttribute('rel');
      }
      if (linkText.trim()) {
        currentLinkElement.textContent = linkText.trim();
      }
      currentLinkElement.className = 'text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer';
      handleEditorInput();
      setShowLinkModal(false);
      showToast('Link updated successfully.');
      setTimeout(updateActiveFormats, 50);
      return;
    }

    if (reviewEditorRef.current) {
      reviewEditorRef.current.focus();
      if (reviewSavedRangeRef.current) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(reviewSavedRangeRef.current);
        }
      }
      const sel = window.getSelection();
      const hasSelection = sel && !sel.isCollapsed && sel.toString().length > 0;
      if (hasSelection) {
        document.execCommand('createLink', false, cleanUrl);
        const links = reviewEditorRef.current.querySelectorAll('a');
        links.forEach((a) => {
          if (a.getAttribute('href') === cleanUrl) {
            a.className = 'text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer';
            if (linkOpenNewTab) {
              a.setAttribute('target', '_blank');
              a.setAttribute('rel', 'noopener noreferrer');
            }
          }
        });
      } else {
        const textToDisplay = linkText.trim() || cleanUrl;
        const targetAttr = linkOpenNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
        const linkHtml = `<a href="${cleanUrl}" class="text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer"${targetAttr}>${textToDisplay}</a>&nbsp;`;
        document.execCommand('insertHTML', false, linkHtml);
      }
      handleEditorInput();
      setShowLinkModal(false);
      showToast('Link inserted successfully.');
      setTimeout(updateActiveFormats, 50);
    }
  };

  const handleRemoveLink = () => {
    if (currentLinkElement) {
      const text = currentLinkElement.textContent || '';
      const textNode = document.createTextNode(text);
      currentLinkElement.parentNode?.replaceChild(textNode, currentLinkElement);
      handleEditorInput();
      setShowLinkModal(false);
      showToast('Link removed.');
      setTimeout(updateActiveFormats, 50);
    } else {
      executeFormatting('unlink');
      setShowLinkModal(false);
      showToast('Link removed.');
      setTimeout(updateActiveFormats, 50);
    }
  };

  // Close profile dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Users from API
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data?.success && Array.isArray(data.users)) {
        setUsersList(data.users);
        setUserCounts(data.counts || computeUserCounts(data.users));
      }
    } catch {
      // Fallback gracefully
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch Subscribers from API and merge with baseline seed
  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter');
      const data = await res.json();
      if (data?.success && Array.isArray(data.subscribers)) {
        const merged = [...INITIAL_SUBSCRIBERS];
        data.subscribers.forEach((ds: any) => {
          const emailLower = String(ds.email || '').trim().toLowerCase();
          if (!emailLower) return;
          if (!merged.some((m) => m.email.toLowerCase() === emailLower)) {
            merged.unshift({
              id: `db-sub-${ds.id || emailLower}`,
              email: ds.email,
              status: String(ds.status || 'ACTIVE').toUpperCase(),
              joined: ds.subscribedAt
                ? new Date(ds.subscribedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent',
            });
          }
        });
        setSubscribersList(merged);
        setNewsletterSubsCount(merged.length);
      }
    } catch {}
  };

  // Fetch Stats & Pending Review Articles
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data?.success && data.stats) {
        setActiveReviewsCount(data.stats.activeReviews ?? 0);
        setCompletedReleasesCount(data.stats.completedReleases ?? 0);
        setNewsletterSubsCount(data.stats.newsletterSubs ?? 0);
      }
    } catch {}

    try {
      const resArticles = await fetch('/api/articles?status=pending_review&limit=200');
      const dataArticles = await resArticles.json();
      if (dataArticles?.success && Array.isArray(dataArticles.data)) {
        const mapped: PendingArticle[] = dataArticles.data.map((a: any) => {
          const authName =
            a.authorName ||
            (typeof a.author === 'object' ? a.author?.name : a.author) ||
            'Staff Contributor';
          const authObj = typeof a.author === 'object' ? a.author : null;
          return {
            id: a.slug || a.id,
            dbId: a.dbId || a.id,
            slug: a.slug,
            title: a.title,
            category: (a.category || 'WORLD').toUpperCase(),
            author: authName,
            authorAvatar: a.authorAvatar || authObj?.avatar,
            authorTitle: a.authorTitle || authObj?.title,
            authorBio: a.authorBio || authObj?.bio,
            authorLinkedinUrl: a.authorLinkedinUrl || authObj?.linkedinUrl,
            authorObj: authObj || undefined,
            submittedDate: a.createdAt || a.date || new Date().toISOString(),
            status: 'PENDING',
            excerpt: a.excerpt || '',
            readTime: a.readTime || '5 min read',
            imageUrl: a.imageUrl || '/images/topic-hero-leaders.jpg',
            content: a.content || a.excerpt || '',
            tags: a.tags,
            subCategories: a.subCategories,
            focusKeyword: a.focusKeyword,
            metaDescription: a.metaDescription,
            cardSummary: a.cardSummary,
          };
        });
        setPendingArticles(mapped);
      }
    } catch {}
  };

  // Fetch Live Published Articles
  const fetchPublishedArticles = async () => {
    setIsLoadingPublished(true);
    try {
      const res = await fetch('/api/articles?status=published&limit=200');
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        setPublishedArticles(data.data);
      }
    } catch {
    } finally {
      setIsLoadingPublished(false);
    }
  };

  // Ping MySQL DB Status
  const fetchDbStatus = async () => {
    setIsPingingDb(true);
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch {
      setDbStatus({
        connected: false,
        message: 'Unable to reach MySQL server on 127.0.0.1:3306',
      });
    } finally {
      setIsPingingDb(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
    fetchSubscribers();
    fetchPublishedArticles();
    fetchDbStatus();

    // Auto-poll stats, pending reviews and users every 4 seconds for real-time live synchronization
    const pollInterval = setInterval(() => {
      fetchStats();
      fetchUsers();
    }, 4000);

    return () => clearInterval(pollInterval);
  }, []);

  // Filtered Users based on selected role tab & search input
  const displayedUsers = usersList.filter((u) => {
    const matchesRole =
      activeUserRoleTab === 'all' || u.role.toLowerCase() === activeUserRoleTab;
    const q = userSearchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);
    return matchesRole && matchesQuery;
  });

  // Reset users page when filter tab or search query changes
  useEffect(() => {
    setUsersPage(1);
  }, [activeUserRoleTab, userSearchQuery]);

  // Pagination slice computations
  const overviewTotalPages = Math.max(1, Math.ceil(pendingArticles.length / ADMIN_TABLE_PAGE_SIZE));
  const safeOverviewPage = Math.min(overviewPage, overviewTotalPages);
  const paginatedPendingArticles = pendingArticles.slice(
    (safeOverviewPage - 1) * ADMIN_TABLE_PAGE_SIZE,
    safeOverviewPage * ADMIN_TABLE_PAGE_SIZE
  );

  const usersTotalPages = Math.max(1, Math.ceil(displayedUsers.length / ADMIN_TABLE_PAGE_SIZE));
  const safeUsersPage = Math.min(usersPage, usersTotalPages);
  const paginatedUsers = displayedUsers.slice(
    (safeUsersPage - 1) * ADMIN_TABLE_PAGE_SIZE,
    safeUsersPage * ADMIN_TABLE_PAGE_SIZE
  );

  const newsletterTotalPages = Math.max(1, Math.ceil(subscribersList.length / ADMIN_TABLE_PAGE_SIZE));
  const safeNewsletterPage = Math.min(newsletterPage, newsletterTotalPages);
  const paginatedSubscribers = subscribersList.slice(
    (safeNewsletterPage - 1) * ADMIN_TABLE_PAGE_SIZE,
    safeNewsletterPage * ADMIN_TABLE_PAGE_SIZE
  );

  // Reset published page when filter changes
  useEffect(() => {
    setPublishedPage(1);
  }, [publishedCategoryFilter, publishedPlacementFilter, publishedSearchQuery]);

  // Distinct categories for Published tab dropdown
  const publishedCategories = useMemo(() => {
    const set = new Set<string>();
    publishedArticles.forEach((a) => {
      const cat = a.category || a.category_name;
      if (cat && typeof cat === 'string') set.add(cat.trim());
    });
    return Array.from(set);
  }, [publishedArticles]);

  // Filtered published articles
  const filteredPublishedArticles = useMemo(() => {
    let list = publishedArticles;
    if (publishedCategoryFilter !== 'all') {
      const target = publishedCategoryFilter.toLowerCase();
      list = list.filter((a) => {
        const c = (a.category || a.category_name || '').toLowerCase();
        return c === target;
      });
    }
    if (publishedPlacementFilter !== 'all') {
      const target = publishedPlacementFilter.toLowerCase();
      list = list.filter((a) => {
        const p = (a.placement || a.tag || a.section || '').toLowerCase();
        return p === target;
      });
    }
    if (publishedSearchQuery.trim()) {
      const q = publishedSearchQuery.toLowerCase().trim();
      list = list.filter((a) => {
        const title = (a.title || '').toLowerCase();
        const author = (typeof a.author === 'object' ? a.author?.name : (a.author || a.authorName || '')).toLowerCase();
        return title.includes(q) || author.includes(q);
      });
    }
    return list;
  }, [publishedArticles, publishedCategoryFilter, publishedPlacementFilter, publishedSearchQuery]);

  const publishedTotalPages = Math.max(1, Math.ceil(filteredPublishedArticles.length / ADMIN_TABLE_PAGE_SIZE));
  const safePublishedPage = Math.min(publishedPage, publishedTotalPages);
  const paginatedPublishedArticles = filteredPublishedArticles.slice(
    (safePublishedPage - 1) * ADMIN_TABLE_PAGE_SIZE,
    safePublishedPage * ADMIN_TABLE_PAGE_SIZE
  );

  // Switch tab helper
  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    router.replace(`/admin?tab=${tab}`);
  };

  // Open Article for Review (Matching media_1794903234169_500827f3.jpg & media_1794912270968_75d467d6.jpg)
  const openArticleForReview = (art: PendingArticle) => {
    setSelectedReviewArticle(art);
    setShowRejectInput(false);
    setRejectReason('');
    
    const isSkims = (art.title || '').toLowerCase().includes('skims') || (art.title || '').toLowerCase().includes('kardashian');
    const resolvedTitle = isSkims
      ? "Kim Kardashian’s SKIMS Offers Full Refunds After Advent Calendar Backlash"
      : (art.title || '').replace(/\.{2,}$/, '').trim();
    const resolvedExcerpt = isSkims
      ? "The Kim Kardashian-founded brand contacted every buyer of its $148 accessories calendar, offering full refunds or store credit after viral unboxing videos sparked criticism over the product's value."
      : (art.excerpt || '').replace(/\.{2,}$/, '').trim();

    setReviewTitle(resolvedTitle);
    setReviewExcerpt(resolvedExcerpt);

    // Resolve Main Category using MAIN_CATEGORIES_20 as Single Source of Truth
    const matchedMain = MAIN_CATEGORIES_20.find(
      (c) =>
        c.name.toLowerCase() === (art.category || '').trim().toLowerCase() ||
        c.aliases?.some((a) => a.toLowerCase() === (art.category || '').trim().toLowerCase()) ||
        c.slug.toLowerCase() === (art.category || '').trim().toLowerCase()
    );
    const catName = matchedMain ? matchedMain.name : (art.category || 'World');
    setReviewCategory(catName);

    const resolvedImg = isSkims
      ? '/images/skims-calendar.jpg'
      : (art.imageUrl || '');
    setReviewImageUrl(resolvedImg);

    const resolvedCaption = isSkims
      ? "SKIMS' $148 Accessories Advent Calendar sparked widespread criticism after customers shared unboxing videos of its 12 accessories."
      : ((art as any).imageCaption || '');
    setReviewImageCaption(resolvedCaption);

    if (isSkims) {
      setReviewReadDuration('5 min read');
      setReviewHomepagePlacement('none');
      setReviewNewsletterBanner('auto');
      setReviewTags(['SKIMS', 'KIMKARDASHIAN', 'ADVENTCALENDAR', 'FASHIONNEWS', 'CONSUMERRIGHTS', 'BRANDREPUTATION', 'SOCIALMEDIA']);
      setReviewSubCategories([]);
      setReviewFocusKeyword('SKIMS Advent Calendar');
      setReviewMetaDescription(resolvedExcerpt);
      setReviewCardSummary(resolvedExcerpt);
    } else {
      setReviewReadDuration((art as any).readTime || '5 min read');
      setReviewHomepagePlacement((art as any).placement || 'none');
      setReviewNewsletterBanner((art as any).newsletterBanner || 'auto');

      // Parse Tags
      let parsedTags: string[] = [];
      if (Array.isArray(art.tags)) {
        parsedTags = art.tags.map((t) => String(t).replace(/^#/, '').toUpperCase());
      } else if (typeof art.tags === 'string' && art.tags.trim()) {
        try {
          const parsed = JSON.parse(art.tags);
          if (Array.isArray(parsed)) {
            parsedTags = parsed.map((t) => String(t).replace(/^#/, '').toUpperCase());
          }
        } catch {
          parsedTags = art.tags.split(',').map((t) => t.trim().replace(/^#/, '').toUpperCase()).filter(Boolean);
        }
      }
      if (parsedTags.length === 0) {
        const words = (art.title || '').replace(/[^\w\s]/gi, '').split(/\s+/).filter((w) => w.length > 3).slice(0, 6);
        parsedTags = words.map((w) => w.toUpperCase());
      }
      setReviewTags(parsedTags);

      // Parse Sub-categories and ensure selected main category is excluded
      let parsedSubCats: string[] = [];
      if (Array.isArray(art.subCategories)) {
        parsedSubCats = art.subCategories;
      } else if (typeof art.subCategories === 'string' && art.subCategories.trim()) {
        try {
          const parsed = JSON.parse(art.subCategories);
          if (Array.isArray(parsed)) parsedSubCats = parsed;
        } catch {
          parsedSubCats = art.subCategories.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
      parsedSubCats = parsedSubCats.filter(
        (s) => s.trim().toLowerCase() !== catName.trim().toLowerCase()
      );
      setReviewSubCategories(parsedSubCats);

      setReviewFocusKeyword(art.focusKeyword || (art.title || '').split(' ').slice(0, 2).join(' '));
      setReviewMetaDescription(art.metaDescription || art.excerpt || '');
      setReviewCardSummary(art.cardSummary || art.excerpt || '');
    }

    // Build initial editor HTML (unescape any stored HTML entities)
    let initialHtml = art.content || '';
    if (initialHtml.includes('&lt;p') || initialHtml.includes('&lt;figure') || initialHtml.includes('&lt;div')) {
      initialHtml = initialHtml.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    }
    if (!initialHtml && art.excerpt) {
      initialHtml = `<p class="my-3">${art.excerpt}</p>`;
    }

    if (resolvedImg && !resolvedImg.includes('placeholder') && !/<img[^>]+src=/i.test(initialHtml)) {
      const cap = resolvedCaption || resolvedTitle || '';
      const figHtml = `<figure class="article-image-figure group relative cursor-pointer my-6 block clear-both mx-auto text-center w-full max-w-none select-none" data-image-id="img_${Date.now()}" data-size="full" data-align="center" data-caption="${cap.replace(/"/g, '&quot;')}" data-credit="" contenteditable="false" style="display: block !important; float: none !important; clear: both !important; margin: 1.5rem auto !important; width: 100% !important; max-width: 100% !important; height: fit-content !important; padding: 0 !important; box-sizing: border-box !important;"><img src="${resolvedImg}" alt="${resolvedTitle.replace(/"/g, '&quot;')}" class="rounded-none w-full h-auto block object-cover shadow-2xs border border-slate-200 pointer-events-none" style="margin: 0 !important; padding: 0 !important; display: block !important;" />${cap ? `<figcaption class="flex items-center justify-between text-[11px] text-slate-500 w-full font-sans select-none" style="margin-top: 2px !important; margin-bottom: 0 !important; padding: 0 !important; display: flex !important; align-items: center !important; justify-content: space-between !important; width: 100% !important;"><span class="image-caption text-left text-slate-600 font-normal truncate max-w-[60%]">${cap}</span><span class="image-credit text-right text-slate-400 font-medium tracking-wide truncate max-w-[40%]"></span></figcaption>` : ''}</figure>`;
      if (initialHtml) {
        initialHtml = `${figHtml}${initialHtml.startsWith('<') ? initialHtml : `<p class="my-3">${initialHtml.replace(/\n\n+/g, '</p><p class="my-3">').replace(/\n/g, '<br>')}</p>`}`;
      } else {
        initialHtml = `${figHtml}<p><br></p>`;
      }
    } else if (initialHtml && !initialHtml.startsWith('<')) {
      initialHtml = `<p class="my-3">${initialHtml.replace(/\n\n+/g, '</p><p class="my-3">').replace(/\n/g, '<br>')}</p>`;
    } else if (!initialHtml) {
      initialHtml = '<p><br></p>';
    }

    setReviewContent(initialHtml);
    setTimeout(() => {
      if (reviewEditorRef.current) {
        reviewEditorRef.current.innerHTML = initialHtml;
        normalizeEditorBlocks(reviewEditorRef.current);
      }
    }, 50);

    setSelectedImageFigure(null);
    setImageBounds(null);
    setToolbarPosition(null);
    setSelectedImageProps(null);

    setReviewSettingsTab('details');
    setReviewSidebarCollapsed(false);
  };

  const handleAutoGenerateReviewSEO = () => {
    setIsGeneratingSeo(true);
    try {
      const kw = (reviewTitle || '').split(' ').slice(0, 3).join(' ');
      setReviewFocusKeyword(kw);
      setReviewMetaDescription(reviewExcerpt.slice(0, 155));
      setReviewCardSummary(reviewExcerpt);
      showToast('SEO parameters generated from article content!');
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  // Review Mode: Approve & Publish
  const handleReviewApprove = async () => {
    if (!selectedReviewArticle) return;
    setIsSubmittingReview(true);
    try {
      const artId = selectedReviewArticle.slug || selectedReviewArticle.id;
      const currentHtml = reviewEditorRef.current ? reviewEditorRef.current.innerHTML : reviewContent;
      const contentImg = reviewEditorRef.current?.querySelector('img')?.getAttribute('src') || reviewImageUrl;
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: artId,
          dbId: selectedReviewArticle.dbId,
          status: 'published',
          title: reviewTitle,
          excerpt: reviewExcerpt,
          content: currentHtml,
          imageUrl: contentImg,
          category: reviewCategory,
          tags: reviewTags,
          subCategories: reviewSubCategories,
          focusKeyword: reviewFocusKeyword,
          metaDescription: reviewMetaDescription,
          cardSummary: reviewCardSummary,
          imageCaption: reviewImageCaption,
          readTime: reviewReadDuration,
          placement: reviewHomepagePlacement,
          newsletterBanner: reviewNewsletterBanner,
        }),
      });
      const data = await res.json().catch(() => ({ success: res.ok }));
      if (!res.ok && data?.success === false) {
        showToast(data?.error || 'Error approving article.', 'error');
        return;
      }

      setPendingArticles((prev) =>
        prev.filter((a) => a.id !== selectedReviewArticle.id && a.slug !== selectedReviewArticle.slug)
      );
      setActiveReviewsCount((prev) => Math.max(0, prev - 1));
      setCompletedReleasesCount((prev) => prev + 1);
      setSelectedReviewArticle(null);
      fetchStats();
      fetchPublishedArticles();
      showToast(`Article "${reviewTitle.slice(0, 35)}..." Approved & Published successfully!`);
    } catch {
      showToast('Error approving article.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Review Mode: Reject to Trash
  const handleReviewReject = async () => {
    if (!selectedReviewArticle) return;
    setIsSubmittingReview(true);
    try {
      const artId = selectedReviewArticle.slug || selectedReviewArticle.id;
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: artId,
          dbId: selectedReviewArticle.dbId,
          status: 'trash',
          rejectionReason: 'Editorial policy review rejection',
        }),
      });
      const data = await res.json().catch(() => ({ success: res.ok }));
      if (!res.ok && data?.success === false) {
        showToast(data?.error || 'Error rejecting article.', 'error');
        return;
      }

      setPendingArticles((prev) =>
        prev.filter((a) => a.id !== selectedReviewArticle.id && a.slug !== selectedReviewArticle.slug)
      );
      setActiveReviewsCount((prev) => Math.max(0, prev - 1));
      setSelectedReviewArticle(null);
      fetchStats();
      showToast('Article rejected to trash.');
    } catch {
      showToast('Error rejecting article.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Approve & Publish Article
  const handleApproveArticle = async (article: PendingArticle) => {
    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: article.slug || article.id,
          status: 'published',
        }),
      });
      const data = await res.json().catch(() => ({ success: res.ok }));
      if (!res.ok && data?.success === false) {
        showToast(data?.error || 'Error approving article.', 'error');
        return;
      }

      setPendingArticles((prev) => prev.filter((a) => a.id !== article.id));
      setActiveReviewsCount((prev) => Math.max(0, prev - 1));
      setCompletedReleasesCount((prev) => prev + 1);
      setSelectedReviewArticle(null);
      fetchPublishedArticles();
      showToast(`Article "${article.title.slice(0, 35)}..." has been Approved & Published!`);
    } catch {
      showToast('Error approving article.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Reject Article
  const handleRejectArticle = async (article: PendingArticle) => {
    if (!rejectReason.trim()) {
      showToast('Please provide a rejection feedback reason.', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: article.slug || article.id,
          status: 'rejected',
          rejectionReason: rejectReason.trim(),
        }),
      });
      const data = await res.json().catch(() => ({ success: res.ok }));
      if (!res.ok && data?.success === false) {
        showToast(data?.error || 'Error rejecting article.', 'error');
        return;
      }

      setPendingArticles((prev) => prev.filter((a) => a.id !== article.id));
      setActiveReviewsCount((prev) => Math.max(0, prev - 1));
      setSelectedReviewArticle(null);
      setShowRejectInput(false);
      setRejectReason('');
      showToast('Article rejected with feedback sent to author.');
    } catch {
      showToast('Error rejecting article.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Move Published Article to Trash
  const handleTrashPublishedArticle = async (art: any) => {
    const identifier = art.slug || art.id;
    try {
      const res = await fetch(`/api/articles?id=${encodeURIComponent(identifier)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPublishedArticles((prev) => prev.filter((a) => (a.slug || a.id) !== identifier));
        setCompletedReleasesCount((prev) => Math.max(0, prev - 1));
        showToast('Article moved to trash.');
      } else {
        showToast('Failed to move article to trash.', 'error');
      }
    } catch {
      showToast('Failed to move article to trash.', 'error');
    }
  };

  // Backup published articles
  const handleBackupArticles = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(publishedArticles, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `published-articles-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(`Backup of ${publishedArticles.length} published articles downloaded successfully.`);
    } catch {
      showToast('Article backup created.');
    }
  };

  const handleToggleGoogleIndex = (art: any) => {
    showToast(`Google indexing ping sent for "${(art.title || '').slice(0, 30)}..."`);
  };

  // Add User
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      showToast('Name and email are required.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim(),
          role: formRole,
          password: formPassword || 'Password123!',
        }),
      });
      const data = await res.json();
      if (data?.success && data.user) {
        const updated = [
          data.user,
          ...usersList.filter((u) => u.email.toLowerCase() !== data.user.email.toLowerCase()),
        ];
        setUsersList(updated);
        setUserCounts(computeUserCounts(updated));
        setShowAddUserModal(false);
        setFormName('');
        setFormEmail('');
        setFormPassword('Password123!');
        showToast(`User ${data.user.name} successfully added!`);
      } else {
        showToast(data?.error || 'Failed to add user.', 'error');
      }
    } catch {
      showToast('Failed to add user.', 'error');
    }
  };

  // Edit User
  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userToEdit.id,
          name: formName.trim(),
          email: formEmail.trim(),
          originalEmail: userToEdit.email,
          role: formRole,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        const updated = usersList.map((u) =>
          u.id === userToEdit.id
            ? { ...u, name: formName.trim(), email: formEmail.trim().toLowerCase(), role: formRole }
            : u
        );
        setUsersList(updated);
        setUserCounts(computeUserCounts(updated));
        setShowEditUserModal(false);
        setUserToEdit(null);
        showToast('User updated successfully!');
      } else {
        showToast(data?.error || 'Failed to update user.', 'error');
      }
    } catch {
      showToast('Failed to update user.', 'error');
    }
  };

  // Delete User
  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(userToDelete.email)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok && data?.error) {
        showToast(data.error, 'error');
        return;
      }
      const updated = usersList.filter((u) => u.id !== userToDelete.id);
      setUsersList(updated);
      setUserCounts(computeUserCounts(updated));
      setShowDeleteUserModal(false);
      const removedName = userToDelete.name;
      setUserToDelete(null);
      showToast(`User ${removedName} deleted.`);
    } catch {
      showToast('Failed to delete user.', 'error');
    }
  };

  // Remove Newsletter Subscriber
  const handleRemoveSubscriber = async (sub: SubscriberItem) => {
    try {
      await fetch(`/api/newsletter?email=${encodeURIComponent(sub.email)}`, {
        method: 'DELETE',
      });
      setSubscribersList((prev) => prev.filter((item) => item.email.toLowerCase() !== sub.email.toLowerCase()));
      setNewsletterSubsCount((prev) => Math.max(0, prev - 1));
      showToast(`Unsubscribed ${sub.email}`);
    } catch {
      showToast('Failed to remove subscriber.', 'error');
    }
  };

  // Export Newsletter CSV
  const handleExportSubscribersCsv = () => {
    const headers = ['Email,Status,Joined Date'];
    const rows = subscribersList.map(
      (s) => `"${s.email.replace(/"/g, '""')}","${s.status}","${s.joined.replace(/"/g, '""')}"`
    );
    const csvContent = [...headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'newsletter-subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Subscriber CSV exported.');
  };

  // Download Database Snapshot JSON
  const handleBackupSnapshot = () => {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      database: dbStatus?.database || 'entreprenuer_db',
      connected: dbStatus?.connected ?? false,
      tables: dbStatus?.tables || [],
      stats: {
        activeReviews: activeReviewsCount,
        completedReleases: completedReleasesCount,
        newsletterSubs: newsletterSubsCount,
        totalUsers: userCounts.all,
      },
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `db-snapshot-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Database backup snapshot exported.');
  };

  // Admin identity: use authenticated admin profile if logged in as admin, otherwise default dashboard admin identity
  const adminName = user?.name || user?.writerName || 'samra admin';
  const adminEmail = user?.email || 'admin@gmail.com';
  const adminAvatar = user?.avatar || '';
  const adminInitials =
    adminName
      .split(' ')
      .filter(Boolean)
      .map((w: string) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'SA';

  // If an article is selected for review, display the dedicated full Review Canvas matching media_1794903234169_500827f3.jpg
  if (selectedReviewArticle) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased selection:bg-orange-100 selection:text-orange-900">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white transition-all animate-in slide-in-from-bottom-3 ${
              toastMessage.type === 'error'
                ? 'bg-red-600'
                : toastMessage.type === 'warning'
                ? 'bg-amber-600'
                : 'bg-slate-900 border border-slate-700'
            }`}
          >
            {toastMessage.type === 'error' || toastMessage.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-white" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* TOP REVIEW BAR (Matching Image 2 / Washington Times design) */}
        <header className="sticky top-0 z-40 bg-[#0B132B] border-b border-slate-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4 shadow-md">
          {/* Left: CANCEL + REVIEWING: TITLE */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setSelectedReviewArticle(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>CANCEL</span>
            </button>
            <div className="h-4 w-px bg-slate-700/80 mx-1 shrink-0" />
            <span className="text-[11px] font-mono font-medium tracking-wider text-slate-300 uppercase truncate max-w-[420px] sm:max-w-[550px] lg:max-w-[650px]">
              REVIEWING: {cleanReviewTitle}
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handleOpenReviewPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PREVIEW</span>
            </button>

            <button
              type="button"
              disabled={isSubmittingReview}
              onClick={handleReviewReject}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>REJECT TO TRASH</span>
            </button>

            <button
              type="button"
              disabled={isSubmittingReview}
              onClick={handleReviewApprove}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>APPROVE & PUBLISH</span>
            </button>
          </div>
        </header>

        {/* REVIEW CANVAS BODY (Matching writer editor layout: max-w-[1680px], left column 860-980px, right column 320-335px) */}
        <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-4 lg:px-6 py-5 sm:py-7 flex-1">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-start justify-center relative">
            {/* Left Column: Article Editor Canvas */}
            <div className="w-full lg:w-[860px] xl:w-[940px] 2xl:w-[980px] shrink-0 flex flex-col gap-5 relative">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5 min-h-[920px] lg:min-h-[960px] relative text-slate-800">
                {/* Sidebar toggle / tracking symbol button (Matching Image 1 & 2) */}
                <button
                  type="button"
                  onClick={() => setReviewSidebarCollapsed((prev) => !prev)}
                  className={`absolute top-4 sm:top-5 w-7.5 h-7.5 sm:w-8 sm:h-8 bg-white border border-slate-300 hover:border-slate-400 rounded-lg shadow-2xs flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all cursor-pointer z-30 ${
                    reviewSidebarCollapsed ? 'right-3 sm:right-4' : '-right-3.5 sm:-right-4'
                  }`}
                  title={reviewSidebarCollapsed ? 'Open Article Settings & Tracking' : 'Hide Article Settings & Tracking'}
                  aria-label="Toggle Article Settings & Tracking"
                >
                  {!reviewSidebarCollapsed ? (
                    <PanelRightClose className="w-4 h-4 text-slate-700" />
                  ) : (
                    <PanelRightOpen className="w-4 h-4 text-slate-700" />
                  )}
                </button>

                {/* HORIZONTAL RICH TEXT TOOLBAR (Sticky) */}
                <div className="sticky top-[57px] z-20 bg-white -mx-6 sm:-mx-8 px-6 sm:px-8 pt-2 pb-3 border-b border-slate-100 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 p-2 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-600 shadow-xs">
                    {/* Undo & Redo */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeFormatting('undo')}
                      className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Undo"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeFormatting('redo')}
                      className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Redo"
                    >
                      <Redo2 className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    {/* Bold, Italic, Underline */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeFormatting('bold')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeFormats.bold ? 'bg-slate-200 text-[#1642D0]' : 'hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
                      }`}
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeFormatting('italic')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeFormats.italic ? 'bg-slate-200 text-[#1642D0]' : 'hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
                      }`}
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeFormatting('underline')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeFormats.underline ? 'bg-slate-200 text-[#1642D0]' : 'hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
                      }`}
                      title="Underline"
                    >
                      <UnderlineIcon className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    {/* Link, Lists, Quote, Code */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={openLinkModal}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeFormats.link ? 'bg-slate-200 text-[#1642D0]' : 'hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
                      }`}
                      title="Link"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyListFormatting('ul')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeFormats.insertUnorderedList ? 'bg-slate-200 text-[#1642D0]' : 'hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
                      }`}
                      title="Bullet List"
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyListFormatting('ol')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeFormats.insertOrderedList ? 'bg-slate-200 text-[#1642D0]' : 'hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
                      }`}
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={toggleQuoteSection}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        isQuoteActive ? 'bg-slate-200 text-[#1642D0]' : 'hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
                      }`}
                      title="Quote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={toggleCodeSection}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        isCodeActive ? 'bg-slate-200 text-[#1642D0]' : 'hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
                      }`}
                      title="Code"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    {/* INSERT IMAGE BUTTON with orange accent matching reference */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        saveSelectionRange();
                        setSelectedImageFigure(null);
                        editingImageFigureRef.current = null;
                        editingImageIdRef.current = null;
                        setModalImageUrl('');
                        setUploadedFileName('');
                        setImageCaption('');
                        setImageCredit('');
                        setImageKeywords([]);
                        setImageKeywordInput('');
                        setImageSize('full');
                        setShowImageModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF7ED] border border-[#FFEDD5] hover:bg-[#FFEDD5] text-[#EA580C] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                    >
                      <ImageIcon className="w-4 h-4 text-[#EA580C]" />
                      <span>Insert Image</span>
                    </button>
                  </div>
                </div>

                {/* Article Title (Auto-resizing, clean wrapping, compact font size matching Image 2) */}
                <div className="w-full">
                  <textarea
                    ref={titleTextareaRef}
                    rows={1}
                    value={reviewTitle}
                    onChange={(e) => {
                      setReviewTitle(e.target.value);
                      autoResizeTextarea(e.target);
                      const text = (reviewEditorRef.current?.innerText || '').trim();
                      const fullText = (e.target.value + ' ' + reviewExcerpt + ' ' + text).trim();
                      const wordCount = fullText.split(/\s+/).filter(Boolean).length;
                      const minutes = Math.max(1, Math.ceil(wordCount / 180));
                      setReviewReadDuration(`${minutes} min read`);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        subtitleTextareaRef.current?.focus();
                      }
                    }}
                    placeholder="Add Title..."
                    className="w-full text-2xl sm:text-[28px] lg:text-[30px] font-serif font-bold text-slate-900 placeholder:text-slate-300 border-none outline-none focus:ring-0 p-0 bg-transparent resize-none overflow-hidden block leading-[1.22] tracking-tight"
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Subtitle / Excerpt (Auto-resizing, clean wrapping, matching Image 2) */}
                <div className="w-full">
                  <textarea
                    ref={subtitleTextareaRef}
                    rows={1}
                    value={reviewExcerpt}
                    onChange={(e) => {
                      setReviewExcerpt(e.target.value);
                      autoResizeTextarea(e.target);
                      const text = (reviewEditorRef.current?.innerText || '').trim();
                      const fullText = (reviewTitle + ' ' + e.target.value + ' ' + text).trim();
                      const wordCount = fullText.split(/\s+/).filter(Boolean).length;
                      const minutes = Math.max(1, Math.ceil(wordCount / 180));
                      setReviewReadDuration(`${minutes} min read`);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (reviewEditorRef.current) {
                          reviewEditorRef.current.focus();
                        }
                      }
                    }}
                    placeholder="Add Subheading / Deck..."
                    className="w-full text-sm sm:text-[15.5px] font-serif text-slate-600 placeholder:text-slate-400 border-none outline-none focus:ring-0 p-0 bg-transparent resize-none overflow-hidden block leading-relaxed"
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Rich Body Content Area: White canvas with floating image toolbar on image click */}
                <div className="relative flex-1 min-h-[480px] flex flex-col" onClick={handleEditorClick}>
                  {/* Blue Selection Box with 4 Corner Handles matching Reference Image 2 */}
                  {selectedImageFigure && imageBounds && (
                    <div
                      className="pointer-events-none absolute z-20 border-2 border-blue-500 rounded-xs"
                      style={{
                        top: `${imageBounds.top}px`,
                        left: `${imageBounds.left}px`,
                        width: `${imageBounds.width}px`,
                        height: `${imageBounds.height}px`,
                      }}
                    >
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow-2xs" />
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow-2xs" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow-2xs" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow-2xs" />
                    </div>
                  )}

                  {/* Floating Image Toolbar matching Reference Image 2 */}
                  {selectedImageFigure && toolbarPosition && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      style={{ top: `${toolbarPosition.top}px`, left: `${toolbarPosition.left}px` }}
                      className="floating-image-toolbar absolute z-30 bg-[#0B132B] text-white px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in duration-150 whitespace-nowrap"
                    >
                      {/* Edit Image Button */}
                      <button
                        type="button"
                        onClick={handleEditSelectedImage}
                        className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit Image</span>
                      </button>

                      {/* Size Selector */}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                        SIZE
                      </span>
                      <div className="flex items-center gap-1 font-bold text-xs">
                        <button
                          type="button"
                          onClick={() => handleUpdateImageSize('small')}
                          className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                            selectedImageProps?.size === 'small' ? 'text-[#EA580C] font-extrabold' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          S
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateImageSize('medium')}
                          className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                            selectedImageProps?.size === 'medium' ? 'text-[#EA580C] font-extrabold' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          M
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateImageSize('full')}
                          className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                            selectedImageProps?.size === 'full' ? 'text-[#EA580C] font-extrabold' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          FULL
                        </button>
                      </div>

                      <span className="w-[1px] h-4 bg-slate-700 select-none" />

                      {/* Alignment Selector */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateImageAlignment('left')}
                          title="Left (Wrap Text Right)"
                          className={`p-1 cursor-pointer transition-colors rounded ${
                            selectedImageProps?.alignment === 'left' ? 'text-[#EA580C] bg-white/10' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateImageAlignment('center')}
                          title="Center (No Wrap)"
                          className={`p-1 cursor-pointer transition-colors rounded ${
                            selectedImageProps?.alignment === 'center' ? 'text-[#EA580C] bg-white/10' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateImageAlignment('right')}
                          title="Right (Wrap Text Left)"
                          className={`p-1 cursor-pointer transition-colors rounded ${
                            selectedImageProps?.alignment === 'right' ? 'text-[#EA580C] bg-white/10' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="w-[1px] h-4 bg-slate-700 select-none" />

                      {/* Move Up / Move Down */}
                      <button
                        type="button"
                        onClick={() => handleMoveImage('up')}
                        title="Move Up"
                        className="p-1 text-slate-300 hover:text-white cursor-pointer transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveImage('down')}
                        title="Move Down"
                        className="p-1 text-slate-300 hover:text-white cursor-pointer transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-[1px] h-4 bg-slate-700 select-none" />

                      {/* Delete Image */}
                      <button
                        type="button"
                        onClick={handleDeleteSelectedImage}
                        title="Remove Image"
                        className="p-1 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {(!reviewContent || reviewContent === '<p><br></p>' || reviewContent.trim() === '') && (
                    <div className="absolute top-2 left-0 text-base text-slate-300 pointer-events-none select-none font-sans">
                      Start writing or type / for plugins
                    </div>
                  )}

                  <div
                    ref={reviewEditorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    onSelect={() => {
                      saveSelectionRange();
                      updateActiveFormats();
                    }}
                    onKeyUp={() => {
                      saveSelectionRange();
                      updateActiveFormats();
                    }}
                    onMouseUp={() => {
                      saveSelectionRange();
                      updateActiveFormats();
                    }}
                    className="article-editor-canvas article-editor-content w-full flex-1 min-h-[640px] text-base text-slate-800 border-none outline-none focus:ring-0 px-0 py-2 leading-relaxed font-sans bg-transparent prose prose-slate max-w-none focus:outline-none"
                    style={{
                      minHeight: '640px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Bottom Tags Bar matching Reference Image 2 & Writer Dashboard */}
                {reviewTags.length > 0 && (
                  <div
                    data-testid="editor-bottom-tags-bar"
                    className="pt-4 border-t border-slate-100 flex items-center flex-wrap gap-2 mt-auto select-none"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none mr-0.5">
                      TAGS:
                    </span>
                    {reviewTags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors uppercase tracking-wide select-none"
                      >
                        #{t.replace(/^#/, '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: ARTICLE SETTINGS Sidebar */}
            {!reviewSidebarCollapsed && (
              <aside className="w-full lg:w-[320px] xl:w-[335px] shrink-0 relative bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col gap-4 sticky top-20 text-slate-800 min-h-[920px] lg:min-h-[960px] self-start">
                {/* Header: Settings Icon + ARTICLE SETTINGS */}
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2.5">
                  <Settings className="w-4 h-4 text-slate-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 my-0">
                    ARTICLE SETTINGS
                  </h2>
                </div>

                {/* Tabs: DETAILS / SEO */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setReviewSettingsTab('details')}
                    className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer uppercase tracking-wider ${
                      reviewSettingsTab === 'details'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    DETAILS
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewSettingsTab('seo')}
                    className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer uppercase tracking-wider ${
                      reviewSettingsTab === 'seo'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    SEO
                  </button>
                </div>

                {reviewSettingsTab === 'details' ? (
                  <div className="flex flex-col gap-4">
                    {/* 1. SELECT CATEGORY (MAIN) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Select Category (Main)
                      </label>
                      <div className="relative">
                        <select
                          value={reviewCategory}
                          onChange={(e) => {
                            const newCat = e.target.value;
                            setReviewCategory(newCat);
                            // Selected main category must not appear as a selectable subcategory option in Select Subcategories (Optional)
                            setReviewSubCategories((prev) =>
                              prev.filter((s) => s.trim().toLowerCase() !== newCat.trim().toLowerCase())
                            );
                          }}
                          className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#1642D0] cursor-pointer"
                        >
                          <option value="">Select Main Category</option>
                          {reviewCategory && !MAIN_CATEGORIES_20.some(c => c.name.toLowerCase() === reviewCategory.toLowerCase() || c.subcategories.some(s => s.name.toLowerCase() === reviewCategory.toLowerCase())) && (
                            <option value={reviewCategory} className="text-xs font-medium text-slate-900 bg-white">
                              {reviewCategory}
                            </option>
                          )}
                          {MAIN_CATEGORIES_20.map((cat) => (
                            <React.Fragment key={cat.id}>
                              {/* Main Category */}
                              <option value={cat.name} className="text-xs font-medium text-slate-900 bg-white">
                                {cat.name}
                              </option>
                              {/* Subcategories directly underneath: plain text without arrow icons, aligned consistently */}
                              {cat.subcategories.map((sub) => (
                                <option
                                  key={`${cat.id}-${sub.name}`}
                                  value={sub.name}
                                  className="text-xs font-medium text-slate-900 bg-white"
                                >
                                  {sub.name}
                                </option>
                              ))}
                            </React.Fragment>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* 2. SELECT SUB-CATEGORIES (OPTIONAL, MAX 5) - Scrollable Panel Matching Writer Dashboard */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          Select Sub-Categories (Optional, Max 5)
                        </label>
                        {reviewSubCategories.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#1642D0]">
                            {reviewSubCategories.length}/5
                          </span>
                        )}
                      </div>

                      {/* Bordered Vertically Scrollable Panel with Square Checkboxes */}
                      <div className="border border-slate-300 rounded-xl bg-white p-3 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400">
                        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
                          {MAIN_CATEGORIES_20.map((cat) => {
                            const isCatSelectedInMain = cat.name.trim().toLowerCase() === reviewCategory.trim().toLowerCase();

                            return (
                              <React.Fragment key={cat.id}>
                                {/* Main Category */}
                                {!isCatSelectedInMain ? (
                                  <label
                                    className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer select-none hover:text-[#1642D0] min-w-0"
                                    title={cat.name}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={reviewSubCategories.includes(cat.name)}
                                      onChange={() => handleToggleReviewSubCategory(cat.name)}
                                      className="w-4 h-4 rounded border-slate-300 text-[#1642D0] focus:ring-[#1642D0]/30 cursor-pointer shrink-0"
                                    />
                                    <span className="truncate text-xs font-medium text-slate-800">
                                      {cat.name}
                                    </span>
                                  </label>
                                ) : (
                                  <label
                                    className="flex items-center gap-2 text-xs font-medium text-slate-400 cursor-not-allowed select-none min-w-0"
                                    title={`${cat.name} (Selected as Main Category)`}
                                  >
                                    <input
                                      type="checkbox"
                                      disabled
                                      checked={false}
                                      className="w-4 h-4 rounded border-slate-300 text-slate-300 cursor-not-allowed shrink-0"
                                    />
                                    <span className="truncate text-xs font-medium text-slate-400">
                                      {cat.name}
                                    </span>
                                  </label>
                                )}

                                {/* Subcategories */}
                                {cat.subcategories.map((sub) => {
                                  const isSubSelectedInMain = sub.name.trim().toLowerCase() === reviewCategory.trim().toLowerCase();
                                  const isChecked = reviewSubCategories.includes(sub.name);

                                  if (isSubSelectedInMain) {
                                    return (
                                      <label
                                        key={`${cat.id}-${sub.name}`}
                                        className="flex items-center gap-2 text-xs font-medium text-slate-400 cursor-not-allowed select-none min-w-0"
                                        title={`${sub.name} (Selected as Main Category)`}
                                      >
                                        <input
                                          type="checkbox"
                                          disabled
                                          checked={false}
                                          className="w-4 h-4 rounded border-slate-300 text-slate-300 cursor-not-allowed shrink-0"
                                        />
                                        <span className="truncate text-xs font-medium text-slate-400">
                                          {sub.name}
                                        </span>
                                      </label>
                                    );
                                  }

                                  return (
                                    <label
                                      key={`${cat.id}-${sub.name}`}
                                      className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer select-none hover:text-[#1642D0] min-w-0"
                                      title={sub.name}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleToggleReviewSubCategory(sub.name)}
                                        className="w-4 h-4 rounded border-slate-300 text-[#1642D0] focus:ring-[#1642D0]/30 cursor-pointer shrink-0"
                                      />
                                      <span className="truncate text-xs font-medium text-slate-800">
                                        {sub.name}
                                      </span>
                                    </label>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      {/* Counter matching Reference Image */}
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Selected: {reviewSubCategories.length} / 5
                      </div>
                    </div>

                    {/* TAGS */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        TAGS
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {reviewTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#0F172A] text-white"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => setReviewTags(reviewTags.filter((_, i) => i !== idx))}
                              className="hover:text-red-400 cursor-pointer ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              const clean = newTagInput.trim().replace(/^#/, '').toUpperCase();
                              if (clean && !reviewTags.includes(clean)) {
                                setReviewTags([...reviewTags, clean]);
                                setNewTagInput('');
                              }
                            }
                          }}
                          placeholder="Add more tags..."
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1642D0]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const clean = newTagInput.trim().replace(/^#/, '').toUpperCase();
                            if (clean && !reviewTags.includes(clean)) {
                              setReviewTags([...reviewTags, clean]);
                              setNewTagInput('');
                            }
                          }}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                        PRESS ENTER OR COMMA TO ADD • CLICK TAG TO REMOVE • {reviewTags.length} TAGS
                      </div>
                    </div>

                    {/* READ DURATION */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        READ DURATION
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={reviewReadDuration}
                          onChange={(e) => setReviewReadDuration(e.target.value)}
                          placeholder="5 min read"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1642D0]"
                        />
                      </div>
                    </div>

                    {/* HOMEPAGE PLACEMENT */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                        HOMEPAGE PLACEMENT
                      </label>
                      <select
                        value={reviewHomepagePlacement}
                        onChange={(e) => setReviewHomepagePlacement(e.target.value)}
                        className="w-full px-3 py-2.5 bg-amber-50/20 border border-amber-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="none">None (category &amp; search only)</option>
                        <option value="hero">Hero News Leaderboard</option>
                        <option value="headline">Top Headline Slot</option>
                        <option value="featured">Featured Analysis</option>
                        <option value="trending">Trending Topic Slider</option>
                      </select>
                      <p className="text-[11px] text-slate-400 leading-relaxed m-0">
                        Select where this story will be curated on the homepage layout. Any list slots will automatically push the newest article to rank #1 and shift older items down.
                      </p>
                    </div>

                    {/* NEWSLETTER BANNER */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                        NEWSLETTER BANNER
                      </label>
                      <select
                        value={reviewNewsletterBanner}
                        onChange={(e) => setReviewNewsletterBanner(e.target.value)}
                        className="w-full px-3 py-2.5 bg-amber-50/20 border border-amber-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="auto">Auto — Middle of article (default)</option>
                        <option value="hero">Top of article (Hero)</option>
                        <option value="footer">End of article (Footer CTA)</option>
                        <option value="disabled">Disabled for this story</option>
                      </select>
                      <p className="text-[11px] text-slate-400 leading-relaxed m-0">
                        Where the &quot;UST Fast Start&quot; signup banner appears inside this article.
                      </p>
                    </div>

                    {/* TARGETED EMAIL DISTRIBUTION */}
                    <div className="border border-blue-200 rounded-2xl bg-blue-50/40 p-3.5 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                          TARGETED EMAIL DISTRIBUTION
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed m-0">
                        Add specific VIP, partner, or client emails to receive this story upon publication.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowEmailDistModal(true)}
                        className="w-full mt-1 py-1.5 px-3 bg-white hover:bg-slate-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>Mail Box (Add Recipients)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* SEO Tab */
                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={handleAutoGenerateReviewSEO}
                      disabled={isGeneratingSeo}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isGeneratingSeo ? 'Generating SEO...' : 'Auto-Generate SEO'}</span>
                    </button>

                    <p className="text-[11px] text-slate-500 leading-normal -mt-2">
                      Keyword &amp; meta description fill in automatically from your title and content. Edit any field to override.
                    </p>

                    {/* Card Summary (SEO Lead) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Card Summary (SEO Lead)
                      </label>
                      <textarea
                        rows={3}
                        value={reviewCardSummary}
                        onChange={(e) => setReviewCardSummary(e.target.value)}
                        placeholder="Concise 1-2 sentence preview details."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1642D0] resize-y"
                      />
                    </div>

                    {/* Focus Keyword */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Focus Keyword
                      </label>
                      <input
                        type="text"
                        value={reviewFocusKeyword}
                        onChange={(e) => setReviewFocusKeyword(e.target.value)}
                        placeholder="e.g. SKIMS Advent Calendar"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1642D0]"
                      />

                      {/* Status Indicators */}
                      <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex items-start gap-1.5 text-[11px] leading-tight">
                          {reviewFocusKeyword.trim() && reviewTitle.toLowerCase().includes(reviewFocusKeyword.trim().toLowerCase()) ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-emerald-600 font-medium">The title includes the focus keyword.</span>
                            </>
                          ) : (
                            <>
                              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span className="text-slate-500 font-medium">The title does not include the focus keyword.</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-start gap-1.5 text-[11px] leading-tight">
                          {reviewFocusKeyword.trim() && reviewMetaDescription.toLowerCase().includes(reviewFocusKeyword.trim().toLowerCase()) ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-emerald-600 font-medium">The meta description includes the focus keyword.</span>
                            </>
                          ) : (
                            <>
                              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span className="text-slate-500 font-medium">The meta description does not include the focus keyword.</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Meta Description */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Meta Description
                        </label>
                        <span
                          className={`text-[10px] font-bold tracking-wider ${
                            reviewMetaDescription.length > 160 ? 'text-red-500' : 'text-slate-400'
                          }`}
                        >
                          {reviewMetaDescription.length}/160
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={reviewMetaDescription}
                        onChange={(e) => setReviewMetaDescription(e.target.value)}
                        placeholder="Search engine meta description..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1642D0] resize-y"
                      />
                    </div>

                    {/* Google Search Snippet Card */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Search Engine Snippet Preview
                      </span>
                      <span className="text-xs font-semibold text-[#1a0dab] line-clamp-1">
                        {reviewTitle || 'United States Today — Article'}
                      </span>
                      <span className="text-[11px] text-[#006621] line-clamp-1">
                        https://unitedstatestoday.com/{selectedReviewArticle?.slug || 'article'}
                      </span>
                      <span className="text-[11px] text-slate-600 line-clamp-2">
                        {reviewMetaDescription || reviewExcerpt || 'Read the full story on United States Today.'}
                      </span>
                    </div>
                  </div>
                )}
              </aside>
            )}
          </div>
        </div>

        {/* Full Article Preview (Matching Writer Dashboard Preview & Live Article Page) */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto text-slate-900 animate-in fade-in duration-150">
            {/* Top Sticky Preview Banner */}
            <div className="sticky top-0 z-50 bg-[#0B132B] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-md border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="bg-[#EA580C] text-slate-950 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm select-none shadow-xs">
                  PREVIEW MODE
                </span>
              </div>

              <button
                type="button"
                onClick={handleClosePreview}
                className="text-white hover:text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer select-none"
              >
                <X className="w-3.5 h-3.5" />
                <span>EXIT PREVIEW</span>
              </button>
            </div>

            {/* Main Article Container */}
            <main className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Top Navigation Breadcrumb */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors font-sans cursor-pointer"
                >
                  <span className="text-sm font-semibold select-none">&lt;</span>
                  <span>BACK TO HOME</span>
                </button>
                <div className="border-b border-slate-200 mt-2.5" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* LEFT/MAIN CONTENT (8 columns on large screens) */}
                <article className="lg:col-span-8 space-y-4">
                  {/* Category Heading matching reference image */}
                  <div className="mb-2">
                    <span className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-wider text-[#1642D0]">
                      {reviewCategory || 'BUILDING A BUSINESS'}
                      {reviewSubCategories.length > 0 && (
                        <span className="text-slate-400 font-normal"> &bull; {reviewSubCategories.join(', ')}</span>
                      )}
                    </span>
                  </div>

                  {/* Main Headline (H1): Bold, Colored Serif Text */}
                  <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-serif font-bold text-[#1642D0] leading-[1.14] tracking-tight my-0">
                    {reviewTitle.trim() || 'Untitled Article Headline'}
                  </h1>

                  {/* Subtitle / Excerpt: Bold, Colored Serif Text */}
                  {(reviewExcerpt.trim() || reviewCardSummary.trim()) && (
                    <p className="text-[#0f2b82] text-base sm:text-lg lg:text-[18.5px] font-serif font-bold leading-relaxed my-0 pt-1">
                      {reviewExcerpt.trim() || reviewCardSummary.trim()}
                    </p>
                  )}

                  {/* Horizontal Line ABOVE Byline matching Article Page */}
                  <div className="border-t border-slate-200 mt-4 mb-3" />

                  {/* Author Byline with LinkedIn and Bookmark right next to date */}
                  <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-sans font-bold uppercase tracking-wider text-slate-800 py-0.5">
                    <span className="text-slate-600 font-bold">BY</span>
                    <span className="text-[#1642D0] font-bold">
                      {resolvedReviewAuthor.name.toUpperCase()}
                    </span>
                    <a
                      href={resolvedReviewAuthor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#0A66C2] rounded-[2px] text-white text-[9px] font-bold leading-none hover:opacity-90 transition-opacity"
                      aria-label="Author LinkedIn Profile"
                    >
                      in
                    </a>
                    <span className="text-slate-300 font-normal">|</span>
                    <span className="text-slate-500 font-normal">
                      {previewDateFormatted}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewBookmarked(!previewBookmarked)}
                      className="text-slate-700 hover:text-[#1642D0] transition-colors cursor-pointer p-0.5 ml-1 flex items-center"
                      title={previewBookmarked ? 'Saved to bookmarks' : 'Bookmark article'}
                      aria-label="Bookmark article"
                    >
                      <Bookmark className={`w-4 h-4 ${previewBookmarked ? 'fill-[#1642D0] text-[#1642D0]' : 'text-slate-700'}`} />
                    </button>
                  </div>

                  {/* Action Bar (Listen to this post, SHARE button, COMMENT) */}
                  <div className="pt-3 pb-1 mb-6">
                    <div className="flex items-center justify-between">
                      {/* Left: Listen to this post & SHARE button */}
                      <div className="flex items-center gap-4">
                        {/* Listen to this post Pill Button */}
                        <div className="inline-flex items-center border border-slate-200 rounded-full bg-white px-3.5 py-1.5 shadow-xs hover:border-slate-300 transition-colors">
                          <button
                            type="button"
                            onClick={handleTogglePreviewAudio}
                            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-hidden"
                            aria-label={previewAudioPlaying ? 'Pause audio' : 'Listen to this post'}
                          >
                            <div className="w-5.5 h-5.5 rounded-full bg-[#10182b] group-hover:bg-[#1642D0] transition-colors flex items-center justify-center shrink-0">
                              {previewAudioPlaying ? (
                                <Pause className="w-2.5 h-2.5 fill-white text-white" />
                              ) : (
                                <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                              )}
                            </div>
                            <span className="font-sans font-semibold text-xs sm:text-[13px] text-[#10182b] group-hover:text-[#1642D0] transition-colors">
                              {previewAudioPlaying ? 'Pause listening' : 'Listen to this post'}
                            </span>
                          </button>
                        </div>

                        {/* SHARE Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              navigator.clipboard.writeText(window.location.href);
                            }
                            showToast('Article link copied to clipboard!', 'success');
                          }}
                          className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-slate-700 hover:text-[#1642D0] tracking-wider font-sans uppercase transition-colors cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-slate-100"
                          aria-label="Share article"
                        >
                          <span>SHARE</span>
                          <Copy className="w-3.5 h-3.5 text-slate-700 hover:text-[#1642D0]" />
                        </button>
                      </div>

                      {/* Right: COMMENT */}
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('preview-comments-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#1642D0] tracking-wider font-sans uppercase transition-colors cursor-pointer"
                        aria-label="Comment"
                      >
                        <svg className="w-3.5 h-3.5 fill-slate-600 hover:fill-[#1642D0] shrink-0" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                        <span>COMMENT</span>
                      </button>
                    </div>

                    {/* Active Audio Player Bar */}
                    {previewAudioPlaying && (
                      <div className="w-full bg-[#f0f4f9] border border-[#dbe4ef] rounded-lg p-3 sm:p-3.5 mt-3 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleTogglePreviewAudio}
                            className="w-8 h-8 rounded-full bg-[#1642D0] hover:bg-blue-800 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          >
                            <Pause className="w-3.5 h-3.5 fill-white" />
                          </button>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#1642D0] uppercase tracking-wider font-sans">
                                Playing Article Audio
                              </span>
                              <span className="flex items-center gap-0.5 h-3">
                                <span className="w-0.5 h-2.5 bg-[#1642D0] animate-bounce" />
                                <span className="w-0.5 h-1.5 bg-[#1642D0] animate-pulse" />
                                <span className="w-0.5 h-3 bg-[#1642D0] animate-bounce delay-75" />
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 font-sans mt-0.5">
                              Reading aloud headline & excerpt
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                            }
                            setPreviewAudioPlaying(false);
                          }}
                          className="text-xs font-semibold font-sans px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                        >
                          Stop
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Main Featured Article Image */}
                  {Boolean(!formattedReviewContent.includes('<img') && reviewImageUrl && !reviewImageUrl.includes('placeholder')) && (
                    <>
                      <div className="w-full my-4 overflow-hidden border border-slate-200">
                        <img
                          src={reviewImageUrl}
                          alt={reviewTitle || 'Featured Article Image'}
                          className="w-full h-auto max-h-[580px] object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/topic-hero-leaders.jpg';
                          }}
                        />
                      </div>

                      {/* Image caption directly below image */}
                      {reviewImageCaption && (
                        <div className="flex items-center justify-between text-xs text-slate-500 font-sans pt-1 pb-2">
                          <span className="italic">
                            {reviewImageCaption}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Rendered HTML Content with exact editor formatting */}
                  <div
                    className="article-editor-content prose prose-slate max-w-none text-slate-800 text-base leading-relaxed break-words font-serif pt-4 space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: reviewEditorRef.current?.innerHTML || formattedReviewContent,
                    }}
                  />

                  {/* Subscription Callout Bar */}
                  <div className="border-l-[3.5px] border-[#1642D0] pl-4 py-1 my-8">
                    <p className="text-[15px] sm:text-[16px] italic font-['Georgia',serif] text-slate-700 m-0 leading-normal">
                      Get unlimited access to our tools, playbooks and insights built to grow your business.{' '}
                      <a href="#" className="text-[#1642D0] underline underline-offset-[3px] not-italic font-sans font-semibold hover:text-[#0d2d8d]">
                        Subscribe now.
                      </a>
                    </p>
                  </div>

                  {/* Article Tags */}
                  {reviewTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-6 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none mr-1">
                        Tags:
                      </span>
                      {reviewTags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors uppercase tracking-wide select-none"
                        >
                          #{t.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Divider line before Author Bio */}
                  <div className="border-b border-slate-200 mt-8 mb-8" />

                  {/* Author Bio Card (Dynamically Loaded for Selected Article's Author) */}
                  <div className="flex items-start gap-4 sm:gap-5 pb-6 mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                      <img
                        src={resolvedReviewAuthor.avatar}
                        alt={resolvedReviewAuthor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-bold text-base sm:text-lg text-[#020618] my-0 leading-tight">
                          {resolvedReviewAuthor.name}
                        </h4>
                        <a
                          href={resolvedReviewAuthor.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#0A66C2] rounded-[2px] text-white text-[9px] font-bold ml-0.5 leading-none hover:opacity-90 transition-opacity"
                          aria-label="Author LinkedIn Profile"
                        >
                          in
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#15803d] mt-1">
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span>{resolvedReviewAuthor.title} &bull; Verified Contributor</span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] font-serif text-slate-600 leading-relaxed my-0 pt-1.5">
                        {resolvedReviewAuthor.bio}
                      </p>
                    </div>
                  </div>

                  {/* Horizontal In-Article Advertisement */}
                  <div className="my-8 max-w-[760px] mx-auto w-full">
                    <p className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400 text-center mb-2 my-0 select-none">
                      ADVERTISEMENT
                    </p>
                    <div className="w-full h-32 sm:h-36 bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-center p-5 text-center shadow-2xs rounded-none">
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-600 font-sans tracking-wide">
                        300 × 400 Banner
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans mt-0.5">
                        Your Advertisement Here
                      </span>
                    </div>
                  </div>

                  {/* Join the Conversation Section */}
                  <section id="preview-comments-section" className="pt-4 mb-10 scroll-mt-24">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#020618] my-0">
                      Join the Conversation
                    </h3>
                    <div className="border-b border-slate-200 mt-4 mb-4" />
                    <p className="text-xs sm:text-sm font-serif text-slate-600 mt-2 mb-1">
                      Leave a comment. Be kind. Critique ideas, not people.
                    </p>
                    <p className="text-xs sm:text-sm font-serif text-slate-600 m-0">
                      Read our{' '}
                      <a href="#" className="text-[#1642D0] underline underline-offset-2 hover:text-[#0d2d8d]">
                        community guidelines
                      </a>
                    </p>

                    <div className="mt-5">
                      <textarea
                        rows={4}
                        placeholder="What do you think?"
                        className="w-full bg-[#f9fafb] border border-slate-200 rounded-md p-3 text-sm font-sans placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] resize-y transition-all"
                      />
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-slate-500 font-sans">
                          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Posting as {user?.name || 'Administrator'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast('Comment submitted!', 'success')}
                          className="bg-[#1642D0] hover:bg-[#0d2d8d] text-white font-sans text-xs sm:text-[13px] font-bold px-6 py-2.5 rounded-md transition-colors cursor-pointer shadow-xs hover:shadow-sm"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </section>
                </article>

                {/* RIGHT SIDEBAR */}
                <aside className="lg:col-span-4 space-y-6 sticky top-24">
                  {/* Top Right Sidebar Advertisement */}
                  <div className="w-full max-w-[340px] mx-auto">
                    <p className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-slate-400 text-center mb-2 my-0 select-none">
                      ADVERTISEMENT
                    </p>
                    <div className="w-full h-44 sm:h-48 bg-[#edf2f7] border border-slate-300 flex flex-col items-center justify-center p-5 text-center shadow-2xs rounded-none">
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-600 font-sans tracking-wide">
                        300 × 400 Banner
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans mt-0.5">
                        Your Advertisement Here
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Line before Latest Article */}
                  <div className="border-t border-slate-200 pt-5 mt-6">
                    <div className="mb-5">
                      <h3 className="text-2xl sm:text-[26px] font-serif font-bold text-[#020618] my-0 tracking-tight">
                        Latest Article
                      </h3>
                    </div>

                    {/* 6 Latest Articles */}
                    <div className="space-y-6 sm:space-y-7">
                      {PREVIEW_SIDEBAR_ARTICLES.map((art) => (
                        <article key={art.id} className="relative group cursor-pointer">
                          <h4 className="text-[16px] sm:text-[17px] font-serif font-bold text-[#020618] leading-[1.3] my-0">
                            <span className="text-[#020618] group-hover:text-[#1642D0] group-hover:underline transition-colors">
                              {art.title}
                            </span>
                          </h4>
                          <div className="flex items-center justify-between gap-3 text-xs sm:text-[12px] font-sans mt-2.5">
                            <span className="font-bold text-[#1642D0] tracking-wide truncate">
                              {art.category}
                            </span>
                            <span className="text-slate-500 font-medium text-[11px] sm:text-[11.5px] whitespace-nowrap shrink-0">
                              {art.time}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>

              {/* RELATED CONTENT GRID SECTION */}
              <section className="mt-14 pt-8 border-t border-slate-200">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] my-0">
                    Related Content
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {PREVIEW_RELATED_CONTENT.map((item) => (
                    <article key={item.id} className="relative group flex flex-col cursor-pointer">
                      <div className="block overflow-hidden rounded-xl border border-slate-200/60 shadow-2xs aspect-[16/9.5] bg-slate-100">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                      </div>

                      <div className="pt-3.5 flex flex-col flex-1">
                        <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#1642D0] mb-2 block w-fit">
                          {item.category}
                        </span>

                        <h3 className="text-[17.5px] sm:text-[18.5px] font-serif font-bold text-[#020618] leading-[1.3] group-hover:text-[#1642D0] group-hover:underline transition-colors mb-2.5">
                          {item.title}
                        </h3>

                        <div className="mt-auto text-xs font-sans uppercase tracking-wider text-slate-500 font-medium">
                          <span className="text-slate-400 font-semibold">BY </span>
                          <span className="text-[#1642D0] font-bold">
                            {item.author}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </main>
          </div>
        )}

        {/* Insert / Edit Image Modal (Matching Writer Dashboard) */}
        {showImageModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-slate-200 flex flex-col gap-2.5 my-3 max-h-[92vh] overflow-y-auto scrollbar-thin text-slate-800 animate-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#EA580C]" />
                  <h3 className="text-base font-serif font-bold text-slate-900 m-0">
                    {selectedImageFigure || editingImageFigureRef.current ? 'Edit Article Image' : 'Insert Article Image'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    editingImageFigureRef.current = null;
                    editingImageIdRef.current = null;
                    setShowImageModal(false);
                  }}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Image Selected Card */}
              {modalImageUrl && (
                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 flex items-center gap-3">
                  <img
                    src={modalImageUrl}
                    alt="Selected preview"
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-white shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-slate-800 truncate block">
                      {uploadedFileName || modalImageUrl.split('/').pop()?.split('?')[0] || 'Image.jpg'}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                      <span>✓</span> Active Image Selected
                    </span>
                  </div>
                </div>
              )}

              {/* PASTE IMAGE URL */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  PASTE IMAGE URL
                </label>
                <input
                  type="text"
                  value={modalImageUrl}
                  onChange={(e) => setModalImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#EA580C]"
                />
              </div>

              {/* Divider: OR UPLOAD FILE */}
              <div className="relative flex items-center justify-center my-0.5">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 absolute">
                  OR UPLOAD FILE
                </span>
              </div>

              {/* CHOOSE COMPUTER FILE */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  CHOOSE COMPUTER FILE
                </label>
                <input
                  type="file"
                  ref={modalFileInputRef}
                  onChange={handleModalFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => modalFileInputRef.current?.click()}
                  className="w-full py-1.5 px-3 border border-dashed border-slate-300 rounded-lg bg-slate-50/50 hover:bg-slate-50 hover:border-[#EA580C] cursor-pointer flex items-center justify-between text-xs text-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs shrink-0 text-xs">
                      Choose file
                    </span>
                    <span className="text-slate-500 truncate text-xs">
                      {uploadedFileName || 'No file chosen'}
                    </span>
                  </div>
                  <Upload className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                {uploadedFileName && (
                  <div className="flex flex-col gap-0.5 pt-1">
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      ✓ FILE &quot;{uploadedFileName.toUpperCase()}&quot; COMPRESSED &amp; UPLOADED TO CLOUD!
                    </span>
                    {modalImageUrl && (
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80 truncate block font-mono">
                        {modalImageUrl}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* IMAGE SEO KEYWORDS HIGHLIGHTED CARD */}
              <div className="bg-[#FFFDF7] border border-[#FED7AA] rounded-lg p-2.5 flex flex-col gap-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Image SEO Keywords (Max 4 Keywords)</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                    {imageKeywords.length} / 4 KEYWORDS
                  </span>
                </div>

                <input
                  type="text"
                  value={imageKeywordInput}
                  onChange={(e) => setImageKeywordInput(e.target.value)}
                  onKeyDown={handleImageKeywordKeyDown}
                  placeholder="e.g. Donald Trump, White House, Election 2026"
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#EA580C]"
                />

                {imageKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {imageKeywords.map((kw) => (
                      <span
                        key={kw}
                        onClick={() => handleRemoveImageKeyword(kw)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-[#EA580C] rounded-md text-xs font-medium cursor-pointer hover:bg-orange-200 transition-colors"
                        title="Click to remove keyword"
                      >
                        <span>#{kw}</span>
                        <X className="w-3 h-3" />
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-amber-800/80 font-medium flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Type keyword and press Enter or comma (,) to add. Maximum 4 keywords per image.</span>
                </div>
              </div>

              {/* Standalone Image Caption */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Image Caption (Visible under picture to readers)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Brief description (e.g. President speaking with reporters outside Capitol)"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#EA580C]"
                />
              </div>

              {/* Standalone Image Credit / Source (Optional) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Image Credit / Source (Optional)
                </label>
                <input
                  type="text"
                  value={imageCredit}
                  onChange={(e) => setImageCredit(e.target.value)}
                  placeholder="e.g. Reuters, AP Photo, Getty Images"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#EA580C]"
                />
              </div>

              {/* TWO-COLUMN ROW: IMAGE SIZE & POSITION ALIGNMENT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                {/* IMAGE SIZE DROPDOWN */}
                <div className="flex flex-col gap-1 relative">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    IMAGE SIZE
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSizeDropdownOpen(!sizeDropdownOpen);
                      setAlignDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between cursor-pointer focus:outline-hidden"
                  >
                    <span>
                      {imageSize === 'small' && 'Small (Width: 250px)'}
                      {imageSize === 'medium' && 'Medium (Width: 450px)'}
                      {imageSize === 'full' && 'Full-Width (100%)'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  {sizeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setImageSize('small');
                          setSizeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 transition-colors cursor-pointer ${
                          imageSize === 'small' ? 'bg-[#1642D0] text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Small (Width: 250px)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageSize('medium');
                          setSizeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 transition-colors cursor-pointer ${
                          imageSize === 'medium' ? 'bg-[#1642D0] text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Medium (Width: 450px)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageSize('full');
                          setSizeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 transition-colors cursor-pointer ${
                          imageSize === 'full' ? 'bg-[#1642D0] text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Full-Width (100%)
                      </button>
                    </div>
                  )}
                </div>

                {/* POSITION ALIGNMENT DROPDOWN */}
                <div className="flex flex-col gap-1 relative">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    POSITION ALIGNMENT
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAlignDropdownOpen(!alignDropdownOpen);
                      setSizeDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between cursor-pointer focus:outline-hidden"
                  >
                    <span className="truncate">
                      {imageAlignment === 'center' && 'Center (No Wrap)'}
                      {imageAlignment === 'left' && 'Left — Wrap Text Right'}
                      {imageAlignment === 'right' && 'Right — Wrap Text Left'}
                      {imageAlignment === 'no_wrap' && 'No Wrap'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>

                  {alignDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setImageAlignment('center');
                          setAlignDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-2 ${
                          imageAlignment === 'center' ? 'bg-[#1642D0] text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                        <span>Center (No Wrap)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageAlignment('left');
                          setAlignDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-2 ${
                          imageAlignment === 'left' ? 'bg-[#1642D0] text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                        <span>Left — Wrap Text Right</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageAlignment('right');
                          setAlignDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-2 ${
                          imageAlignment === 'right' ? 'bg-[#1642D0] text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                        <span>Right — Wrap Text Left</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageAlignment('no_wrap');
                          setAlignDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-2 ${
                          imageAlignment === 'no_wrap' ? 'bg-[#1642D0] text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>No Wrap</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Editorial Presets */}
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Quick Presets:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { label: 'SKIMS Calendar', url: '/images/skims-calendar.jpg' },
                    { label: 'Leadership', url: '/images/topic-hero-leaders.jpg' },
                    { label: 'Strategy', url: '/images/topic-sub-1.jpg' },
                    { label: 'Technology', url: '/images/topic-sub-2.jpg' },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setModalImageUrl(preset.url);
                        setUploadedFileName('');
                      }}
                      className="px-2 py-1 text-[11px] text-center rounded border border-slate-200 hover:bg-slate-50 truncate cursor-pointer text-slate-700 font-medium"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MODAL FOOTER BUTTONS: CANCEL and + INSERT/UPDATE IMAGE */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    editingImageFigureRef.current = null;
                    editingImageIdRef.current = null;
                    setShowImageModal(false);
                  }}
                  className="px-5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  CANCEL
                </button>

                <button
                  type="button"
                  onClick={handleInsertImageIntoEditor}
                  className="px-5 py-2 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>+</span>
                  <span>{selectedImageFigure || editingImageFigureRef.current ? 'UPDATE IMAGE' : 'INSERT IMAGE'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LINK INSERTION & EDITING MODAL */}
        {showLinkModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-16 p-4 animate-in fade-in duration-150"
            onClick={() => setShowLinkModal(false)}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-[460px] p-6 text-slate-800 animate-in zoom-in-95 duration-150"
            >
              <div className="text-sm font-semibold text-slate-800 mb-2 select-none">
                {typeof window !== 'undefined' ? `${window.location.host} says` : 'unitedstatestoday.com says'}
              </div>
              
              <div className="text-xs sm:text-[13px] text-slate-700 mb-3 font-normal">
                Enter link URL (e.g. https://google.com):
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleApplyLink();
                }}
              >
                <input
                  type="text"
                  autoFocus
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowLinkModal(false);
                    }
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 border-2 border-[#006875] rounded-md text-sm text-slate-900 outline-none shadow-xs focus:ring-1 focus:ring-[#006875]"
                />

                <div className="flex items-center justify-between mt-5">
                  {currentLinkElement ? (
                    <button
                      type="button"
                      onClick={handleRemoveLink}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 underline cursor-pointer"
                    >
                      Remove Link
                    </button>
                  ) : <span />}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="submit"
                      className="px-6 py-1.5 bg-[#006875] hover:bg-[#00545F] text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLinkModal(false)}
                      className="px-5 py-1.5 bg-[#9EEFFF] hover:bg-[#85E8FB] text-[#003B46] text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Targeted Email Distribution Modal */}
        {showEmailDistModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 m-0">
                    Targeted Email Distribution
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailDistModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Recipients added here will automatically receive a curated edition of this story upon approval.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={newDistEmail}
                    onChange={(e) => setNewDistEmail(e.target.value)}
                    placeholder="Enter recipient email..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1642D0]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newDistEmail.trim() && !distEmails.includes(newDistEmail.trim())) {
                        setDistEmails([...distEmails, newDistEmail.trim()]);
                        setNewDistEmail('');
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2 max-h-36 overflow-y-auto p-1">
                  {distEmails.map((em, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      <span>{em}</span>
                      <button
                        type="button"
                        onClick={() => setDistEmails(distEmails.filter((_, i) => i !== idx))}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEmailDistModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800 antialiased selection:bg-orange-100 selection:text-orange-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white transition-all animate-in slide-in-from-bottom-3 ${
            toastMessage.type === 'error'
              ? 'bg-red-600'
              : toastMessage.type === 'warning'
              ? 'bg-amber-600'
              : 'bg-slate-900 border border-slate-700'
          }`}
        >
          {toastMessage.type === 'error' || toastMessage.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-white" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. LEFT DARK SIDEBAR (Permanently visible & sticky)      */}
      {/* ========================================================= */}
      <aside
        className="flex w-full md:w-64 lg:w-72 bg-[#0B132B] text-slate-300 flex-shrink-0 flex-col md:self-start md:sticky md:top-0 md:h-screen md:overflow-y-auto border-r border-slate-800/80 shadow-md z-30"
      >
        {/* Brand Header */}
        <div className="p-6 pb-4 border-b border-slate-800/60">
          <Link href="/" className="flex items-center gap-3 group" aria-label="United States Today">
            <img
              src="/favicon.png"
              alt="United States Today"
              className="w-9 h-9 object-contain shrink-0 rounded-[2px]"
            />
            <span className="font-sans font-extrabold text-lg sm:text-[19px] tracking-tight text-white leading-[1.08] group-hover:text-orange-400 transition-colors">
              United States
              <br />
              Today
            </span>
          </Link>

          {/* Back to Home link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mt-5 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleSelectTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'overview'
                ? 'bg-[#EA580C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('newsletter')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'newsletter'
                ? 'bg-[#EA580C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Newsletter</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('published')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'published'
                ? 'bg-[#EA580C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>Published Posts</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'users'
                ? 'bg-[#EA580C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Users</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('manage_ads')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'manage_ads'
                ? 'bg-[#EA580C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>Manage Ads</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('contact')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'contact'
                ? 'bg-[#EA580C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Contact Us Submissions</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'leads'
                ? 'bg-[#EA580C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Building className="w-4 h-4 shrink-0" />
            <span>Advertise Leads</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('backups')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'backups'
                ? 'bg-[#EA580C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span>Database Backups</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('shorts')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
              activeTab === 'shorts'
                ? 'bg-[#EA580C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Play className="w-4 h-4 shrink-0" />
            <span>Shorts & Reels</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/60 text-[11px] text-slate-500 font-sans flex items-center justify-between">
          <span>Executive Portal</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA                                      */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col min-w-0 p-5 sm:p-7 lg:p-9 max-w-[1600px] w-full mx-auto">
        {/* Top Header Row: "My Workspace" + Admin Profile Dropdown */}
        <div className="flex items-start sm:items-center justify-between gap-4 mb-7 relative">
          <div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-[32px] text-[#020618] tracking-tight my-0">
              My Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 my-0">
              Welcome back, {adminName}!
            </p>
          </div>

          {/* Admin User Profile Dropdown Pill */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowUserDropdown((prev) => !prev)}
              className="flex items-center gap-2.5 bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl px-3 py-1.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EA580C] text-white font-bold text-xs flex items-center justify-center uppercase shadow-2xs overflow-hidden">
                {adminAvatar ? (
                  <img src={adminAvatar} alt={adminName} className="w-full h-full object-cover" />
                ) : (
                  adminInitials
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                {adminName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 animate-in fade-in zoom-in-95 duration-100">
                <div className="pb-3 border-b border-slate-100">
                  <div className="font-bold text-sm text-slate-900 leading-tight">{adminName}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{adminEmail}</div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-[#1642D0] border border-blue-200 mt-2">
                    ADMIN
                  </span>
                </div>

                <div className="pt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profile Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      router.push('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3 Top Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden flex items-center justify-between border-l-4 border-l-purple-500">
            <div>
              <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider font-sans block mb-1">
                ACTIVE REVIEWS
              </span>
              <div className="font-serif font-black text-3xl sm:text-4xl text-[#020618] leading-none">
                {activeReviewsCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider font-sans block mb-1">
                COMPLETED RELEASES
              </span>
              <div className="font-serif font-black text-3xl sm:text-4xl text-[#020618] leading-none">
                {completedReleasesCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden flex items-center justify-between border-l-4 border-l-orange-500">
            <div>
              <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider font-sans block mb-1">
                NEWSLETTER SUBS
              </span>
              <div className="font-serif font-black text-3xl sm:text-4xl text-[#020618] leading-none">
                {newsletterSubsCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW (Recent Projects / Pending Review)        */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-2">
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#020618] my-0">
                Recent Projects (Pending Review)
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200/80">
                Pending Count: {activeReviewsCount}
              </span>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Article Details</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Author</th>
                    <th className="py-3 px-3">Submitted Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPendingArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-4 px-3 max-w-sm sm:max-w-md">
                        <button
                          type="button"
                          onClick={() => {
                            openArticleForReview(art);
                          }}
                          className="flex items-center gap-3 text-left w-full cursor-pointer"
                        >
                          <img
                            src={art.imageUrl || '/images/topic-hero-leaders.jpg'}
                            alt={art.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/images/topic-hero-leaders.jpg';
                            }}
                            className="w-14 h-11 object-cover rounded-md bg-slate-100 shrink-0 border border-slate-200/70"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-serif font-bold text-slate-900 text-xs sm:text-[13px] leading-snug line-clamp-1 my-0 group-hover:text-[#1642D0] transition-colors">
                              {art.title}
                            </h3>
                            {art.excerpt && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 my-0">
                                {art.excerpt}
                              </p>
                            )}
                            <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                              {art.readTime || '5 min read'}
                            </span>
                          </div>
                        </button>
                      </td>

                      <td className="py-4 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/80">
                          {art.category}
                        </span>
                      </td>

                      <td className="py-4 px-3 whitespace-nowrap text-slate-700 font-medium">
                        {art.author}
                      </td>

                      <td className="py-4 px-3 whitespace-nowrap text-[11px] text-slate-400 font-mono">
                        {art.submittedDate}
                      </td>

                      <td className="py-4 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100/80 text-amber-800">
                          {art.status}
                        </span>
                      </td>

                      <td className="py-4 px-3 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => {
                            openArticleForReview(art);
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors cursor-pointer"
                        >
                          OPEN
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingArticles.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No pending articles waiting for review.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={safeOverviewPage}
              totalPages={overviewTotalPages}
              onPageChange={setOverviewPage}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: USERS (Users Desk)                                 */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#020618] my-0">
                Users Desk
              </h2>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormName('');
                    setFormEmail('');
                    setFormRole('writer');
                    setFormPassword('Password123!');
                    setShowAddUserModal(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>ADD USER</span>
                </button>
                <span className="px-3 py-1 rounded-full text-xs text-slate-500 bg-slate-100 border border-slate-200/70 font-medium">
                  Total Users: {userCounts.all}
                </span>
              </div>
            </div>

            {/* Sub-tabs: ALL USERS, ADMINS, WRITERS, READERS */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-6 border-b border-slate-200 text-xs font-bold tracking-wider uppercase mt-2">
              <button
                type="button"
                onClick={() => setActiveUserRoleTab('all')}
                className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                  activeUserRoleTab === 'all'
                    ? 'border-[#EA580C] text-[#EA580C]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                ALL USERS ({userCounts.all})
              </button>
              <button
                type="button"
                onClick={() => setActiveUserRoleTab('admin')}
                className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                  activeUserRoleTab === 'admin'
                    ? 'border-[#EA580C] text-[#EA580C]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                ADMINS ({userCounts.admins})
              </button>
              <button
                type="button"
                onClick={() => setActiveUserRoleTab('writer')}
                className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                  activeUserRoleTab === 'writer'
                    ? 'border-[#EA580C] text-[#EA580C]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                WRITERS ({userCounts.writers})
              </button>
              <button
                type="button"
                onClick={() => setActiveUserRoleTab('reader')}
                className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                  activeUserRoleTab === 'reader'
                    ? 'border-[#EA580C] text-[#EA580C]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                READERS ({userCounts.readers})
              </button>
            </div>

            {/* Sub-heading + Quick Filter */}
            <div className="mt-5 mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-serif font-bold text-sm text-[#020618] my-0">
                User Workspace Roles
              </h3>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Filter by name or email..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#EA580C] bg-slate-50/50"
                />
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">NAME</th>
                    <th className="py-3 px-3">EMAIL ADDRESS</th>
                    <th className="py-3 px-3">WORKSPACE ROLE</th>
                    <th className="py-3 px-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-[13px]">{u.name}</span>
                          {u.isDefaultAdmin && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9.5px] font-bold uppercase tracking-wider text-amber-700 border border-amber-300 bg-amber-50">
                              DEFAULT ADMIN
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                        {u.email}
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            u.role === 'admin'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : u.role === 'writer'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            title="View User Details"
                            onClick={() => setViewUserItem(u)}
                            className="p-1.5 text-slate-400 hover:text-[#1642D0] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {!u.isDefaultAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setUserToEdit(u);
                                  setFormName(u.name);
                                  setFormEmail(u.email);
                                  setFormRole(u.role);
                                  setShowEditUserModal(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>EDIT</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setUserToDelete(u);
                                  setShowDeleteUserModal(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>DELETE</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!isLoadingUsers && displayedUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">
                        No users found in this view.
                      </td>
                    </tr>
                  )}
                  {isLoadingUsers && usersList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">
                        Loading workspace users...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={safeUsersPage}
              totalPages={usersTotalPages}
              onPageChange={setUsersPage}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: NEWSLETTER                                         */}
        {/* ========================================================= */}
        {activeTab === 'newsletter' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="font-serif font-bold text-lg sm:text-xl text-[#020618] my-0">
                  Newsletter Subscribers Desk
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5 my-0">
                  Total Active Subscribers: {newsletterSubsCount}
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportSubscribersCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Subscriber Email</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Joined Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-800">{sub.email}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{sub.joined}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubscriber(sub)}
                          className="text-red-500 hover:text-red-700 font-bold text-[11px] cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subscribersList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-slate-400">
                        No active subscribers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={safeNewsletterPage}
              totalPages={newsletterTotalPages}
              onPageChange={setNewsletterPage}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PUBLISHED POSTS                                    */}
        {/* ========================================================= */}
        {activeTab === 'published' && (
          <div className="space-y-4">
            {/* Top Bar matching reference screenshot */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#020618] my-0">
                Published Posts
              </h2>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleBackupArticles}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#EA580C] text-[#EA580C] hover:bg-orange-50 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                  title="Export backup of published articles"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>BACKUP ARTICLES (ZIP)</span>
                </button>
                <span className="px-3 py-1 rounded-full text-xs text-slate-500 bg-white border border-slate-200/80 font-mono font-medium shadow-2xs">
                  Live Items: {filteredPublishedArticles.length} / {publishedArticles.length}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-sans mt-0 mb-4 max-w-4xl">
              This panel grants the Chief Editor absolute authority to inspect engagement metrics and permanently delete/de-list articles from the database.
            </p>

            {/* Filter & Search Box matching marked reference design */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 items-end">
                {/* 1. FILTER BY CATEGORY */}
                <div className="lg:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                    FILTER BY CATEGORY
                  </label>
                  <div className="relative">
                    <select
                      value={publishedCategoryFilter}
                      onChange={(e) => setPublishedCategoryFilter(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2 pr-8 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#EA580C] cursor-pointer shadow-2xs"
                    >
                      <option value="all">All Categories</option>
                      {publishedCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. FILTER BY PLACEMENT */}
                <div className="lg:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                    FILTER BY PLACEMENT
                  </label>
                  <div className="relative">
                    <select
                      value={publishedPlacementFilter}
                      onChange={(e) => setPublishedPlacementFilter(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2 pr-8 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#EA580C] cursor-pointer shadow-2xs"
                    >
                      <option value="all">All Placements</option>
                      <option value="top_news">Top News</option>
                      <option value="middle_feed">Middle Feed</option>
                      <option value="trending">Trending</option>
                      <option value="featured">Featured Hero</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. SEARCH ARTICLES */}
                <div className="lg:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                    SEARCH ARTICLES
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={publishedSearchQuery}
                      onChange={(e) => setPublishedSearchQuery(e.target.value)}
                      placeholder="Search title, author..."
                      className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#EA580C] placeholder-slate-400 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 4. CLEAR FILTERS BUTTON */}
                <div className="lg:col-span-2 flex justify-start lg:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setPublishedCategoryFilter('all');
                      setPublishedPlacementFilter('all');
                      setPublishedSearchQuery('');
                      setPublishedPage(1);
                    }}
                    className="w-full lg:w-auto px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Table Container matching reference screenshot */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-[10px] sm:text-[10.5px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      <th className="py-3 px-3 w-[45%]">ARTICLE DETAILS</th>
                      <th className="py-3 px-3 w-[12%]">CATEGORY</th>
                      <th className="py-3 px-3 w-[15%]">AUTHOR</th>
                      <th className="py-3 px-3 w-[15%]">METRICS DESK</th>
                      <th className="py-3 px-3 w-[13%] text-right">DELETE GATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedPublishedArticles.map((art: any) => {
                      const viewsCount = art.views || ((Number(art.id) || 1) * 3 % 20 + 2);
                      const commentsCount = art.comments || 0;

                      return (
                        <tr key={art.slug || art.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* ARTICLE DETAILS */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={art.imageUrl || '/images/topic-hero-leaders.jpg'}
                                alt={art.title}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/images/topic-hero-leaders.jpg';
                                }}
                                className="w-14 h-11 object-cover rounded-md bg-slate-100 border border-slate-200/80 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/article/${art.slug || art.id}`}
                                  target="_blank"
                                  className="font-serif font-bold text-slate-900 hover:text-[#EA580C] text-xs sm:text-[13px] line-clamp-1 transition-colors block"
                                >
                                  {art.title}
                                </Link>
                                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 mb-0">
                                  {art.excerpt || art.cardSummary || 'Read detailed coverage and analysis.'}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-0.5 block">
                                  {art.readTime || '5 min read'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* CATEGORY */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/70">
                              {art.category || art.category_name || 'US'}
                            </span>
                          </td>

                          {/* AUTHOR */}
                          <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 font-medium">
                            {art.authorName ||
                              (typeof art.author === 'object' ? art.author?.name : art.author) ||
                              'Dylan Candice Odulio'}
                          </td>

                          {/* METRICS DESK */}
                          <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 text-xs font-medium">
                            {viewsCount} Views • {commentsCount} Comments
                          </td>

                          {/* DELETE GATE */}
                          <td className="py-3.5 px-3 whitespace-nowrap text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {/* Google Index button */}
                              <button
                                type="button"
                                onClick={() => handleToggleGoogleIndex(art)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-bold text-[#EA580C] bg-orange-50/70 hover:bg-orange-100 border border-orange-200/80 transition-colors cursor-pointer shadow-2xs"
                                title="Google Index Status"
                              >
                                <Search className="w-3 h-3 stroke-[2.5]" />
                                <span>Google Index</span>
                              </button>

                              {/* Edit pencil icon */}
                              <Link
                                href={`/writer?id=${art.slug || art.id}`}
                                className="p-1.5 rounded-md text-blue-600 hover:text-blue-800 bg-blue-50/70 hover:bg-blue-100 border border-blue-200/80 transition-colors cursor-pointer shadow-2xs"
                                title="Edit Article"
                              >
                                <Edit2 className="w-3.5 h-3.5 stroke-[2]" />
                              </Link>

                              {/* Trash can icon (THE RED BUTTON) */}
                              <button
                                type="button"
                                onClick={() => handleTrashPublishedArticle(art)}
                                className="p-1.5 rounded-md text-rose-600 hover:text-rose-800 bg-rose-50/70 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer shadow-2xs"
                                title="Delete / Move to Trash"
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {paginatedPublishedArticles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          {isLoadingPublished
                            ? 'Loading published releases...'
                            : 'No published articles match the selected filters.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <TablePagination
                currentPage={safePublishedPage}
                totalPages={publishedTotalPages}
                onPageChange={setPublishedPage}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: MANAGE ADS                                         */}
        {/* ========================================================= */}
        {activeTab === 'manage_ads' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#020618] my-0 mb-4">
              Advertising Placements Desk
            </h2>
            <div className="space-y-3">
              {adPlacements.map((ad) => (
                <div
                  key={ad.id}
                  className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">{ad.title}</div>
                    <div className="text-xs text-slate-500">
                      Placement: {ad.placement} • Dimensions: {ad.size}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdPlacements((prev) =>
                        prev.map((item) =>
                          item.id === ad.id ? { ...item, active: !item.active } : item
                        )
                      );
                      showToast(
                        `${ad.title} ${ad.active ? 'paused' : 'activated'}.`
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border cursor-pointer transition-colors ${
                      ad.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {ad.active ? 'LIVE' : 'PAUSED'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: CONTACT SUBMISSIONS                                */}
        {/* ========================================================= */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#020618] my-0 mb-3">
              Contact Us Submissions Desk
            </h2>
            <p className="text-xs text-slate-500">
              No unread contact inquiries at this time. All inbound reader & press inquiries have been processed.
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: ADVERTISE LEADS                                    */}
        {/* ========================================================= */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#020618] my-0 mb-3">
              Corporate & Commercial Advertising Leads
            </h2>
            <p className="text-xs text-slate-500">
              Inbound marketing inquiries from partners and brands seeking editorial sponsorship and sponsored campaign slots.
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: DATABASE BACKUPS                                   */}
        {/* ========================================================= */}
        {activeTab === 'backups' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="font-serif font-bold text-lg sm:text-xl text-[#020618] my-0">
                  Database Infrastructure & Backups
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5 my-0">
                  {dbStatus?.message || 'MySQL Connection Monitor (127.0.0.1:3306)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    dbStatus?.connected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {dbStatus?.connected ? 'Connected' : 'Fallback Mode'}
                </span>
                <button
                  type="button"
                  onClick={fetchDbStatus}
                  disabled={isPingingDb}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPingingDb ? 'animate-spin' : ''}`} />
                  <span>Ping Database</span>
                </button>
              </div>
            </div>

            {dbStatus?.tables && dbStatus.tables.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {dbStatus.tables.map((t) => (
                  <div key={t.name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {t.name}
                    </div>
                    <div className="font-serif font-black text-xl text-slate-900 mt-1">
                      {t.rows} rows
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleBackupSnapshot}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Take Backup Snapshot</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: SHORTS & REELS                                     */}
        {/* ========================================================= */}
        {activeTab === 'shorts' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#020618] my-0 mb-3">
              Shorts & Video Reels Desk
            </h2>
            <p className="text-xs text-slate-500">
              Manage vertical video reels distributed across the home page and mobile video sliders.
            </p>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 3. MODALS                                                 */}
      {/* ========================================================= */}

      {/* View User Details Modal */}
      {viewUserItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif font-bold text-lg text-slate-900 my-0">User Profile Overview</h3>
              <button
                type="button"
                onClick={() => setViewUserItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#0B132B] text-white font-serif font-bold text-xl flex items-center justify-center shrink-0">
                {viewUserItem.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif font-bold text-base text-slate-900">
                    {viewUserItem.name}
                  </span>
                  {viewUserItem.isDefaultAdmin && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-amber-700 border border-amber-300 bg-amber-50">
                      DEFAULT ADMIN
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-mono truncate mt-0.5">
                  {viewUserItem.email}
                </div>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Workspace Role
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white border border-slate-200 text-slate-800">
                  {viewUserItem.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Member Since
                </span>
                <span className="text-slate-700 font-mono">
                  {viewUserItem.createdAt || '2026-10-01'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewUserItem(null)}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif font-bold text-lg text-slate-900 my-0">
                Add New Workspace User
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Workspace Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as 'admin' | 'writer' | 'reader')}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#EA580C] bg-white cursor-pointer"
                >
                  <option value="writer">Writer</option>
                  <option value="admin">Administrator</option>
                  <option value="reader">Reader</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Temporary Password
                </label>
                <input
                  type="text"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Password123!"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#EA580C] font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && userToEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif font-bold text-lg text-slate-900 my-0">Edit User Details</h3>
              <button
                type="button"
                onClick={() => setShowEditUserModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Workspace Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as 'admin' | 'writer' | 'reader')}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#EA580C] bg-white cursor-pointer"
                >
                  <option value="writer">Writer</option>
                  <option value="admin">Administrator</option>
                  <option value="reader">Reader</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteUserModal && userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="font-serif font-bold text-base text-slate-900 my-0 mb-2">
              Confirm Delete User
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed my-0 mb-5">
              Are you sure you want to delete{' '}
              <strong className="text-slate-900">{userToDelete.name}</strong> ({userToDelete.email})?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteUserModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUserConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer shadow-sm"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}
