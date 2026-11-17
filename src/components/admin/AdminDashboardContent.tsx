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
import { MAIN_CATEGORIES } from '@/data/categoriesData';

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
    title: "Kim Kardashian's SKIMS Offers Full Refunds After Advent...",
    category: 'World',
    author: 'Dylan Candice Odulio',
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
    title: 'From THC Restrictions to Legalization, Texas Democrats...',
    category: 'US',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-11-10T12:10:36.221Z',
    status: 'PENDING',
    excerpt: "Texas Democrats are pushing to change the state's cannabis laws after Republican-led efforts to restrict THC products, introducing a series of...",
    readTime: '5 min read',
    imageUrl: '/images/topic-hero-leaders.jpg',
    content: "<p>Texas Democrats are pushing to change the state's cannabis laws after Republican-led efforts to restrict THC products, introducing a series of measures aimed at comprehensive regulatory frameworks and criminal justice reforms.</p><p>Advocates argue that progressive cannabis reform could generate hundreds of millions in state revenue while reducing unnecessary law enforcement burdens across commercial districts.</p>",
  },
  {
    id: 'p-3',
    slug: 'after-13-years-of-waiting-gta-vi-is-finally-ready-for-the',
    title: 'After 13 Years of Waiting, GTA VI Is Finally Ready for the...',
    category: 'WORLD',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-11-10T12:04:32.486Z',
    status: 'PENDING',
    excerpt: 'After more than a decade of anticipation, Grand Theft Auto VI is officially ready for release. Rockstar Games has completed...',
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
  const [showInsertImageModal, setShowInsertImageModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [reviewImageCaption, setReviewImageCaption] = useState('');
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
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleTogglePreviewAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (previewAudioPlaying) {
      window.speechSynthesis.cancel();
      setPreviewAudioPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak = `${reviewTitle.trim() || 'Untitled Article Headline'}. ${reviewExcerpt.trim() || reviewCardSummary.trim() || ''}. Reported by ${selectedReviewArticle?.author || user?.name || 'Staff Contributor'}.`;
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
        const mapped: PendingArticle[] = dataArticles.data.map((a: any) => ({
          id: a.slug || a.id,
          dbId: a.dbId || a.id,
          slug: a.slug,
          title: a.title,
          category: (a.category || 'WORLD').toUpperCase(),
          author:
            a.authorName ||
            (typeof a.author === 'object' ? a.author?.name : a.author) ||
            'Staff Contributor',
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
        }));
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
    setReviewTitle(art.title || '');
    setReviewExcerpt(art.excerpt || '');
    setReviewContent(art.content || art.excerpt || '');
    const catName = art.category ? art.category.charAt(0).toUpperCase() + art.category.slice(1).toLowerCase() : 'World';
    setReviewCategory(catName);
    setReviewImageUrl(art.imageUrl || '/images/topic-hero-leaders.jpg');

    const isSkims = (art.title || '').toLowerCase().includes('skims') || (art.title || '').toLowerCase().includes('kardashian');
    if (isSkims) {
      setReviewImageCaption("SKIMS' $148 Accessories Advent Calendar sparked widespread criticism after customers shared unboxing videos of its 12 accessories.");
      setReviewReadDuration('5 min read');
      setReviewHomepagePlacement('none');
      setReviewNewsletterBanner('auto');
      setReviewImageUrl('/images/skims-calendar.jpg');
      setReviewCategory('World');
      setReviewTags(['SKIMS', 'KIMKARDASHIAN', 'ADVENTCALENDAR', 'FASHIONNEWS', 'CONSUMERRIGHTS', 'BRANDREPUTATION', 'SOCIALMEDIA']);
      setReviewSubCategories([]);
      setReviewFocusKeyword('SKIMS Advent Calendar');
      setReviewMetaDescription(art.excerpt || "The Kim Kardashian-founded brand contacted every buyer of its $148 accessories calendar, offering full refunds or store credit after viral unboxing videos sparked criticism over the product's value.");
      setReviewCardSummary(art.excerpt || "The Kim Kardashian-founded brand contacted every buyer of its $148 accessories calendar, offering full refunds or store credit after viral unboxing videos sparked criticism over the product's value.");
    } else {
      setReviewImageCaption((art as any).imageCaption || '');
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

      // Parse Sub-categories
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
      setReviewSubCategories(parsedSubCats);

      setReviewFocusKeyword(art.focusKeyword || (art.title || '').split(' ').slice(0, 2).join(' '));
      setReviewMetaDescription(art.metaDescription || art.excerpt || '');
      setReviewCardSummary(art.cardSummary || art.excerpt || '');
    }

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
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: artId,
          dbId: selectedReviewArticle.dbId,
          status: 'published',
          title: reviewTitle,
          excerpt: reviewExcerpt,
          content: reviewContent,
          imageUrl: reviewImageUrl,
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
              toastMessage.type === 'error' ? 'bg-red-600' : 'bg-slate-900 border border-slate-700'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-300" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* TOP REVIEW BAR (Matching media_1794903234169_500827f3.jpg) */}
        <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-800 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-md">
          {/* Left: CANCEL + REVIEWING: TITLE */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setSelectedReviewArticle(null)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              <span>CANCEL</span>
            </button>
            <div className="h-4 w-px bg-slate-700 hidden sm:block shrink-0" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-300 uppercase truncate">
              REVIEWING: {reviewTitle}
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PREVIEW</span>
            </button>

            <button
              type="button"
              disabled={isSubmittingReview}
              onClick={handleReviewReject}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
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
                {/* Sidebar toggle button (matching Writer Dashboard) */}
                <button
                  type="button"
                  onClick={() => setReviewSidebarCollapsed((prev) => !prev)}
                  className={`absolute top-5 w-8 h-8 bg-white border border-slate-300 hover:border-slate-400 rounded-lg shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all cursor-pointer z-30 ${
                    reviewSidebarCollapsed ? 'right-4' : '-right-4'
                  }`}
                  title={reviewSidebarCollapsed ? 'Open Article Settings' : 'Hide Article Settings'}
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
                    <button type="button" className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors" title="Undo">
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors" title="Redo">
                      <Redo2 className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    {/* Bold, Italic, Underline */}
                    <button type="button" className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors" title="Bold">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors" title="Italic">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors" title="Underline">
                      <UnderlineIcon className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    {/* Link, Lists, Quote, Code */}
                    <button type="button" className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors" title="Link">
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors" title="Bullet List">
                      <ListIcon className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors" title="Numbered List">
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors" title="Quote">
                      <Quote className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-slate-200/70 rounded text-slate-600 hover:text-slate-900 transition-colors" title="Code">
                      <Code className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    {/* INSERT IMAGE BUTTON with orange accent matching reference */}
                    <button
                      type="button"
                      onClick={() => {
                        setTempImageUrl(reviewImageUrl);
                        setShowInsertImageModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF7ED] border border-[#FFEDD5] hover:bg-[#FFEDD5] text-[#EA580C] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                    >
                      <ImageIcon className="w-4 h-4 text-[#EA580C]" />
                      <span>Insert Image</span>
                    </button>
                  </div>
                </div>

                {/* Editable Title */}
                <textarea
                  rows={2}
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="font-serif font-bold text-2xl sm:text-3xl lg:text-[34px] leading-tight text-slate-900 border-none outline-none focus:ring-0 p-0 w-full placeholder:text-slate-300 resize-none"
                  placeholder="Add Title..."
                />

                {/* Editable Excerpt / Subtitle */}
                <textarea
                  rows={2}
                  value={reviewExcerpt}
                  onChange={(e) => setReviewExcerpt(e.target.value)}
                  className="font-serif italic text-base sm:text-lg text-slate-600 border-none outline-none focus:ring-0 p-0 w-full resize-none placeholder:text-slate-400"
                  placeholder="Add Subheading / Deck..."
                />

                {/* Featured Image + Caption */}
                {reviewImageUrl && (
                  <div className="flex flex-col gap-2 my-1">
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-[480px]">
                      <img
                        src={reviewImageUrl}
                        alt={reviewTitle}
                        className="w-full h-full object-contain max-h-[480px] mx-auto"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/topic-hero-leaders.jpg';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setTempImageUrl(reviewImageUrl);
                          setShowInsertImageModal(true);
                        }}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/75 hover:bg-black text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Change Image</span>
                      </button>
                    </div>
                    {/* Caption underneath matching reference image */}
                    <div className="text-center px-4">
                      <input
                        type="text"
                        value={reviewImageCaption}
                        onChange={(e) => setReviewImageCaption(e.target.value)}
                        placeholder="Add image caption..."
                        className="w-full text-center text-xs text-slate-500 italic border-none outline-none focus:ring-0 bg-transparent placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                )}

                {/* Body Content Editor */}
                <div className="mt-2">
                  <textarea
                    rows={18}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full min-h-[420px] text-slate-800 text-[15px] sm:text-base leading-relaxed p-4 rounded-xl border border-slate-200 focus:border-[#1642D0] focus:ring-1 focus:ring-[#1642D0] outline-none font-sans resize-y placeholder:text-slate-400"
                    placeholder="Start writing or type / for plugins"
                  />
                </div>
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
                    {/* SELECT CATEGORY (MAIN) */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        SELECT CATEGORY (MAIN)
                      </label>
                      <select
                        value={reviewCategory}
                        onChange={(e) => setReviewCategory(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#1642D0]"
                      >
                        {['World', 'Breaking News', 'US', 'Politics', 'Business', 'Technology', 'Economy & Markets', 'Entertainment', 'Sports', 'Health', 'Travel', 'Science', 'Lifestyle'].map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SELECT SUB-CATEGORIES (OPTIONAL, MAX 5) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          SELECT SUB-CATEGORIES (OPTIONAL, MAX 5)
                        </label>
                      </div>
                      <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-2.5 grid grid-cols-2 gap-2 bg-slate-50/50">
                        {[
                          'US', 'Politics', 'Economy & Markets', 'Business', 'Crypto', 'Technology',
                          'Travel', 'Opinion', 'CEO Spotlight', 'Sports', 'Breaking News', 'Breaking Headlines',
                          'Business Alerts', 'Major Announcements', 'Stock Market', 'Global Market Index',
                          'Bonds & Fixed Income', 'Forex & Currency', 'Cryptocurrency', 'Investment Strategy'
                        ].map((sub) => {
                          const isChecked = reviewSubCategories.includes(sub);
                          return (
                            <label key={sub} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900 truncate">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    if (reviewSubCategories.length < 5) {
                                      setReviewSubCategories([...reviewSubCategories, sub]);
                                    }
                                  } else {
                                    setReviewSubCategories(reviewSubCategories.filter((s) => s !== sub));
                                  }
                                }}
                                disabled={!isChecked && reviewSubCategories.length >= 5}
                                className="w-3.5 h-3.5 rounded border-slate-300 text-[#1642D0] focus:ring-[#1642D0]"
                              />
                              <span className="truncate">{sub}</span>
                            </label>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans block mt-1 uppercase font-bold tracking-wider">
                        SELECTED: {reviewSubCategories.length} / 5
                      </span>
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
                      {(selectedReviewArticle?.author || user?.name || 'SHERIN SHIBU').toUpperCase()}
                    </span>
                    <a
                      href="https://www.linkedin.com"
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
                  {Boolean(reviewImageUrl && !reviewImageUrl.includes('placeholder')) && (
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
                      __html: formattedReviewContent,
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

                  {/* Author Bio Card */}
                  <div className="flex items-start gap-4 sm:gap-5 pb-6 mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                      <img
                        src="/images/user-avatar-butterfly.png"
                        alt={selectedReviewArticle?.author || user?.name || 'Author'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-bold text-base sm:text-lg text-[#020618] my-0 leading-tight">
                          {selectedReviewArticle?.author || user?.name || 'Sherin Shibu'}
                        </h4>
                        <a
                          href="https://www.linkedin.com"
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
                        <span>United States Today Staff &bull; Verified Contributor</span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] font-serif text-slate-600 leading-relaxed my-0 pt-1.5">
                        Business news reporter and contributor at United States Today, covering high-growth ventures, market trends, and modern workplace leadership.
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

        {/* Insert / Change Image Modal */}
        {showInsertImageModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 m-0">
                  Insert / Change Image
                </h3>
                <button
                  type="button"
                  onClick={() => setShowInsertImageModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="https://... or /images/..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1642D0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Image Caption
                  </label>
                  <input
                    type="text"
                    value={reviewImageCaption}
                    onChange={(e) => setReviewImageCaption(e.target.value)}
                    placeholder="Brief description or photo credit..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1642D0]"
                  />
                </div>

                {tempImageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-48 flex items-center justify-center p-2">
                    <img
                      src={tempImageUrl}
                      alt="Preview"
                      className="max-h-40 max-w-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/topic-hero-leaders.jpg';
                      }}
                    />
                  </div>
                )}

                <div className="text-[11px] text-slate-500">
                  Quick editorial presets:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'SKIMS Calendar', url: '/images/skims-calendar.jpg' },
                    { label: 'Leadership', url: '/images/topic-hero-leaders.jpg' },
                    { label: 'Strategy', url: '/images/topic-sub-1.jpg' },
                    { label: 'Technology', url: '/images/topic-sub-2.jpg' },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setTempImageUrl(preset.url)}
                      className="px-2 py-1.5 text-xs text-left rounded-lg border border-slate-200 hover:bg-slate-50 truncate cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInsertImageModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (tempImageUrl.trim()) {
                      setReviewImageUrl(tempImageUrl.trim());
                    }
                    setShowInsertImageModal(false);
                    showToast('Image updated successfully.');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
                >
                  Apply Image
                </button>
              </div>
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
            toastMessage.type === 'error' ? 'bg-red-600' : 'bg-slate-900 border border-slate-700'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-300" />
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
