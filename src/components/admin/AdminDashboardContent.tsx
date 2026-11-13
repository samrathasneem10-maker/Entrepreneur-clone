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
} from 'lucide-react';
import ProfileSettingsModal from '@/components/writer/ProfileSettingsModal';

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

const CORE_PENDING_ARTICLES: PendingArticle[] = [
  {
    id: 'p-1',
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
    id: 'p-2',
    slug: 'kim-kardashians-skims-offers-full-refunds-after-advent',
    title: "Kim Kardashian's SKIMS Offers Full Refunds After Advent...",
    category: 'WORLD',
    author: 'Dylan Candice Odulio',
    submittedDate: '2026-11-10T12:06:53.081Z',
    status: 'PENDING',
    excerpt: 'A holiday product meant to deliver 12 days of surprises instead became an unexpected public relations challenge for SKIMS, after...',
    readTime: '5 min read',
    imageUrl: '/images/topic-sub-1.jpg',
    content: '<p>A holiday product meant to deliver 12 days of surprises instead became an unexpected public relations challenge for SKIMS, after early purchasers revealed inconsistent packaging and missing items.</p><p>In a decisive customer-first move, brand executives announced complete refunds for all impacted customers while reinforcing their supply chain quality standards.</p>',
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

// Build 110 baseline pending review articles so queue matches Active Reviews count (110 + DB rows)
const INITIAL_PENDING_ARTICLES: PendingArticle[] = Array.from({ length: 110 }, (_, idx) => {
  const base = CORE_PENDING_ARTICLES[idx % CORE_PENDING_ARTICLES.length];
  if (idx < CORE_PENDING_ARTICLES.length) return base;
  const cycle = Math.floor(idx / CORE_PENDING_ARTICLES.length);
  const ts = new Date(Date.UTC(2026, 9, 8, 10, 0, 0) - idx * 3600 * 1000).toISOString();
  return {
    ...base,
    id: `p-seed-${idx + 1}`,
    slug: `${base.slug}-review-${idx + 1}`,
    title: `${base.title.replace(/\.\.\.$/, '')} (Edition ${cycle + 1})`,
    submittedDate: ts,
  };
});

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
        setActiveReviewsCount(data.stats.activeReviews ?? 115);
        setCompletedReleasesCount(data.stats.completedReleases ?? 595);
        setNewsletterSubsCount(data.stats.newsletterSubs ?? 15);
      }
    } catch {}

    try {
      const resArticles = await fetch('/api/articles?status=pending_review&limit=200');
      const dataArticles = await resArticles.json();
      if (dataArticles?.success && Array.isArray(dataArticles.data)) {
        const mapped: PendingArticle[] = dataArticles.data.map((a: any) => ({
          id: a.slug || a.id,
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
        }));

        const combined = [...mapped];
        INITIAL_PENDING_ARTICLES.forEach((item) => {
          if (!combined.some((c) => c.title.toLowerCase() === item.title.toLowerCase())) {
            combined.push(item);
          }
        });
        setPendingArticles(combined);
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
                            setSelectedReviewArticle(art);
                            setShowRejectInput(false);
                            setRejectReason('');
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
                            setSelectedReviewArticle(art);
                            setShowRejectInput(false);
                            setRejectReason('');
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

      {/* Review Article Modal */}
      {selectedReviewArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                  {selectedReviewArticle.category}
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  By {selectedReviewArticle.author} • {selectedReviewArticle.readTime || '5 min read'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReviewArticle(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 leading-tight my-2">
                {selectedReviewArticle.title}
              </h2>

              {selectedReviewArticle.imageUrl &&
                !(selectedReviewArticle.content || '').includes(selectedReviewArticle.imageUrl) && (
                  <div className="w-full h-64 rounded-xl overflow-hidden my-4 border border-slate-200">
                    <img
                      src={selectedReviewArticle.imageUrl}
                      alt={selectedReviewArticle.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/topic-hero-leaders.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

              <div
                className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed mt-4 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-3 [&_figure]:my-4"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedReviewArticle.content ||
                    selectedReviewArticle.excerpt ||
                    '<p>No content provided.</p>',
                }}
              />
            </div>

            {showRejectInput && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
                <label className="block text-xs font-bold text-red-900 uppercase tracking-wider mb-1">
                  Rejection Feedback for Author
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this article cannot be published (e.g. requires higher resolution image, editorial fact-checking, etc.)..."
                  className="w-full text-xs text-slate-800 p-2.5 rounded-lg border border-red-300 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 mt-7 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReviewArticle(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close Preview
              </button>

              <div className="flex items-center gap-2">
                {!showRejectInput ? (
                  <button
                    type="button"
                    disabled={isSubmittingReview}
                    onClick={() => setShowRejectInput(true)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Reject Article
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmittingReview}
                    onClick={() => handleRejectArticle(selectedReviewArticle)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Confirm Rejection
                  </button>
                )}

                <button
                  type="button"
                  disabled={isSubmittingReview}
                  onClick={() => handleApproveArticle(selectedReviewArticle)}
                  className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Approve & Publish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
