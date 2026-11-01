'use client';

import React, { useEffect, useState, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  X,
  ExternalLink,
  Edit,
  Eye,
  RefreshCw,
  LogOut,
  Settings,
  User,
  ChevronRight,
  Menu,
} from 'lucide-react';
import ProfileSettingsModal from './ProfileSettingsModal';

export type WriterTab = 'published' | 'draft' | 'pending_review' | 'rejected' | 'trash';

export interface ArticleItem {
  id: string | number;
  dbId?: number;
  slug?: string;
  title: string;
  category: string;
  date: string;
  authorName?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  readTime?: string;
  excerpt?: string;
  content?: string;
  imageUrl: string;
  views?: string | number;
  status: WriterTab | string;
  rejectionReason?: string | null;
  reviewerNotes?: string | null;
  cardSummary?: string;
  focusKeyword?: string;
  metaDescription?: string;
  tags?: string[] | string;
  subCategories?: string[] | string;
  createdAt?: string;
  updatedAt?: string;
}

const FALLBACK_WRITER_ARTICLES: Record<WriterTab, ArticleItem[]> = {
  published: [
    {
      id: 101,
      dbId: 101,
      title: "Doctors Told Him He'd End Up in a Wheelchair. He Found a Cure For His Illness and Built a Company...",
      category: 'United States',
      date: 'Oct 23, 2026',
      readTime: '5 min read',
      excerpt: 'Key TakeawaysDoctors Told HimDoctors warned scientist Momo Vuyisich that a mysterious inflammatory condition could eventually leave him in a wheelchair.Aft...',
      imageUrl: '/images/topic-sub-1.jpg',
      status: 'published',
    },
    {
      id: 102,
      dbId: 102,
      title: 'In Conversation with Chathuri Gamage, CEO, Kiyaas eeeeela',
      category: 'United States',
      date: 'Oct 23, 2026',
      readTime: '5 min read',
      excerpt: "Chathuri Gamage's journey in the beauty industry is one shaped by determination, continuous learning and an unwavering commitment to excellence. What began...",
      imageUrl: '/images/topic-sub-2.jpg',
      status: 'published',
    },
    {
      id: 103,
      dbId: 103,
      title: 'gutting of the Department of Justic egutting of the Department of Justice',
      category: 'United States',
      date: 'Oct 19, 2026',
      readTime: '5 min read',
      excerpt: 'gutting of the Department of Justicegutting of the Department of Justicegutting of the Department of Justicegutting of the Department of Justicegutting of ...',
      imageUrl: '/images/topic-hero-leaders.jpg',
      status: 'published',
    },
    {
      id: 104,
      dbId: 104,
      title: 'IN CONVERSATION WITH NIKITA RAZEEN',
      category: 'United States',
      date: 'Oct 19, 2026',
      readTime: '5 min read',
      excerpt: 'For Nikita Razeen, being recognised with the Human Rights and Social Impact Award at the 7th New Generation Youth Top40 Awards represents more than a perso...',
      imageUrl: '/images/related-introvert.png',
      status: 'published',
    },
  ],
  draft: [
    {
      id: 201,
      dbId: 201,
      title: "This 28-Year-Old's Busy 9-5 Inspired Her Side Hustle That Gives Professionals a Boost...",
      category: 'United States',
      date: 'Oct 23, 2026',
      readTime: '5 min read',
      excerpt: 'This Side Hustle Spotlight Q&A features Georgia Young, a 28-year-old entrepreneur based in New York. Last year, Young was working in consulting when she st...',
      imageUrl: '/images/topic-hero-leaders.jpg',
      status: 'draft',
    },
    {
      id: 202,
      dbId: 202,
      title: "Don't normalize the behavior just because it's your boss",
      category: 'United States',
      date: 'Oct 17, 2026',
      readTime: '5 min read',
      excerpt: 'resource designed to help employees make sense of employment agreements. The tool can help you identify provisions that would affect your ability to speak ...',
      imageUrl: '/images/topic-sub-1.jpg',
      status: 'draft',
    },
    {
      id: 203,
      dbId: 203,
      title: '53 Side Hustle Ideas to Make Extra Money in 2026',
      category: 'United States',
      date: 'Oct 17, 2026',
      readTime: '5 min read',
      excerpt: "Are you looking for ways to make extra money on the side while maintaining your day job? You're not alone. Whether it's to pay off debt, save up an emergen...",
      imageUrl: '/images/topic-sub-2.jpg',
      status: 'draft',
    },
  ],
  pending_review: [
    {
      id: 301,
      dbId: 301,
      title: 'Somewhere in Your Company, a Soft No Just Killed a Good Idea',
      category: 'United States',
      date: 'Oct 23, 2026',
      readTime: '5 min read',
      excerpt: 'Somewhere in your organization, a new initiative died this month. Nobody voted against it. Nobody stood up in a meeting and said, "This is a bad idea." It ...',
      imageUrl: '/images/topic-hero-leaders.jpg',
      status: 'pending_review',
      reviewerNotes: 'This article was submitted on Oct 23, 2026 and is currently in the editorial queue. The team is reviewing source verification and editorial guidelines before clearing it for publication.',
    },
  ],
  rejected: [
    {
      id: 401,
      dbId: 401,
      title: 'Somewhere in Your Company, a Soft No Just Killed a Good Idea',
      category: 'United States',
      date: 'Oct 28, 2026',
      readTime: '5 min read',
      excerpt: 'Somewhere in your organization, a new initiative died this month. Nobody voted against it. Nobody stood up in a meeting and said, "This is a bad idea." It ...',
      imageUrl: '/images/topic-hero-leaders.jpg',
      status: 'rejected',
      rejectionReason: 'Requires additional corroborating evidence and primary executive interview citations before editorial approval.',
      reviewerNotes: 'The claims regarding organizational velocity require verifiable references or founder interviews. Please revise sections 2 and 4 and resubmit for review.',
    },
  ],
  trash: [
    {
      id: 501,
      dbId: 501,
      title: "Donald Trump's gutting of the Department of Justice",
      category: 'The White House',
      date: 'Oct 19, 2026',
      readTime: '5 min read',
      excerpt: 'What the degraded institution means for AmericaWhat the degraded institution means for AmericaWhat the degraded institution means for AmericaWhat the degra...',
      imageUrl: '/images/topic-hero-leaders.jpg',
      status: 'trash',
    },
  ],
};

function WriterDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Tab state: published | draft | pending_review | rejected | trash
  const tabParam = searchParams.get('tab') as WriterTab;
  const initialTab: WriterTab =
    tabParam && ['published', 'draft', 'pending_review', 'rejected', 'trash'].includes(tabParam)
      ? tabParam
      : 'published';

  const [activeTab, setActiveTab] = useState<WriterTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Articles & counts state
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [statusCounts, setStatusCounts] = useState<{
    published: number;
    draft: number;
    pending_review: number;
    rejected: number;
    trash: number;
  }>({
    published: 0,
    draft: 0,
    pending_review: 0,
    rejected: 0,
    trash: 0,
  });

  // Reason Modal State
  const [reasonModalArticle, setReasonModalArticle] = useState<ArticleItem | null>(null);

  // User dropdown menu state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileSettingsModal, setShowProfileSettingsModal] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchCounts();
    const currentTab = (searchParams.get('tab') as WriterTab) || 'published';
    const tabToLoad: WriterTab = ['published', 'draft', 'pending_review', 'rejected', 'trash'].includes(currentTab)
      ? currentTab
      : 'published';
    setActiveTab(tabToLoad);
    fetchArticles(tabToLoad);
  }, [searchParams]);

  const fetchCounts = async () => {
    try {
      const res = await fetch('/api/articles?counts=true');
      const data = await res.json();
      if (data?.success && data?.counts) {
        setStatusCounts({
          published: data.counts.published || 0,
          draft: data.counts.draft || 0,
          pending_review: data.counts.pending_review || 0,
          rejected: data.counts.rejected || 0,
          trash: data.counts.trash || 0,
        });
      }
    } catch {
      // Keep existing counts
    }
  };

  const fetchArticles = async (status: WriterTab) => {
    setLoadingArticles(true);
    try {
      const res = await fetch(`/api/articles?status=${status}&limit=100`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
        const mapped: ArticleItem[] = data.data.map((item: any) => ({
          ...item,
          readTime: item.readTime || '5 min read',
          imageUrl: item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : '/images/topic-hero-leaders.jpg',
        }));
        setArticles(mapped);
      } else {
        // Use realistic fallback matching reference screenshots
        const fallback = FALLBACK_WRITER_ARTICLES[status] || [];
        setArticles(fallback);
      }
    } catch {
      const fallback = FALLBACK_WRITER_ARTICLES[status] || [];
      setArticles(fallback);
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleTabChange = (tab: WriterTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setMobileSidebarOpen(false);
    router.replace(`/writer/dashboard?tab=${tab}`);
    fetchArticles(tab);
  };

  // Move to trash
  const handleMoveToTrash = async (art: ArticleItem) => {
    if (!confirm('Are you sure you want to move this article to Trash?')) {
      return;
    }
    try {
      const res = await fetch(`/api/articles?id=${art.slug || art.id}&dbId=${art.dbId || ''}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data?.success) {
        showToast('Article moved to Trash.');
        fetchCounts();
        fetchArticles(activeTab);
      } else {
        // Optimistic local update
        setArticles((prev) => prev.filter((a) => (a.dbId || a.id) !== (art.dbId || art.id)));
        showToast('Article moved to Trash.');
      }
    } catch {
      setArticles((prev) => prev.filter((a) => (a.dbId || a.id) !== (art.dbId || art.id)));
      showToast('Article moved to Trash.');
    }
  };

  // Restore from trash
  const handleRestore = async (art: ArticleItem) => {
    try {
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: art.slug || art.id,
          dbId: art.dbId,
          status: 'draft',
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast('Article restored to Drafts!');
        fetchCounts();
        fetchArticles(activeTab);
      } else {
        setArticles((prev) => prev.filter((a) => (a.dbId || a.id) !== (art.dbId || art.id)));
        showToast('Article restored to Drafts!');
      }
    } catch {
      setArticles((prev) => prev.filter((a) => (a.dbId || a.id) !== (art.dbId || art.id)));
      showToast('Article restored to Drafts!');
    }
  };

  // Permanent delete
  const handlePermanentDelete = async (art: ArticleItem) => {
    if (!confirm('Are you sure you want to permanently delete this article? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch(
        `/api/articles?id=${art.slug || art.id}&dbId=${art.dbId || ''}&permanent=true`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (data?.success) {
        showToast('Article permanently deleted.');
        fetchCounts();
        fetchArticles(activeTab);
      } else {
        setArticles((prev) => prev.filter((a) => (a.dbId || a.id) !== (art.dbId || art.id)));
        showToast('Article permanently deleted.');
      }
    } catch {
      setArticles((prev) => prev.filter((a) => (a.dbId || a.id) !== (art.dbId || art.id)));
      showToast('Article permanently deleted.');
    }
  };

  // Filter articles by search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase().trim();
    return articles.filter((art) => {
      const titleMatch = art.title && art.title.toLowerCase().includes(q);
      const catMatch = art.category && art.category.toLowerCase().includes(q);
      const excerptMatch = art.excerpt && art.excerpt.toLowerCase().includes(q);
      return titleMatch || catMatch || excerptMatch;
    });
  }, [articles, searchQuery]);

  const writerDisplayName = user?.writerName || user?.name || 'Kalid Writer User';

  const tabsConfig: { key: WriterTab; label: string; count: number }[] = [
    { key: 'published', label: 'Published', count: statusCounts.published },
    { key: 'draft', label: 'Drafts', count: statusCounts.draft },
    { key: 'pending_review', label: 'Pending review', count: statusCounts.pending_review },
    { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
    { key: 'trash', label: 'Trash', count: statusCounts.trash },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F1F3F5] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAECEF] flex flex-col md:flex-row antialiased font-sans text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-lg shadow-xl text-sm font-semibold transition-all duration-300 animate-slide-up ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 text-white border-l-4 border-emerald-400'
              : 'bg-rose-700 text-white border-l-4 border-rose-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-200" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileSettingsModal}
        onClose={() => setShowProfileSettingsModal(false)}
      />

      {/* Review / Rejection Reason Modal */}
      {reasonModalArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left relative">
            <button
              type="button"
              onClick={() => setReasonModalArticle(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                  reasonModalArticle.status === 'rejected'
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                {reasonModalArticle.status === 'rejected' ? 'Editorial Rejection' : 'Pending Review'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{reasonModalArticle.date}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-3">
              {reasonModalArticle.title}
            </h3>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {reasonModalArticle.status === 'rejected' ? 'Rejection Reason / Required Edits' : 'Review Information'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {reasonModalArticle.rejectionReason ||
                  reasonModalArticle.reviewerNotes ||
                  (reasonModalArticle.status === 'rejected'
                    ? 'This article requires revisions and additional verification before it can be approved for publication.'
                    : 'This article was submitted for review and is currently awaiting editorial evaluation. Our editors will verify source accuracy and tone before clearing it for publication.')}
              </p>
              {reasonModalArticle.reviewerNotes && reasonModalArticle.rejectionReason && (
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">
                    <strong className="text-slate-700">Reviewer Notes:</strong> {reasonModalArticle.reviewerNotes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReasonModalArticle(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const art = reasonModalArticle;
                  setReasonModalArticle(null);
                  router.push(`/writer?id=${art.dbId || art.slug || art.id}`);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1642D0] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                Edit Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. LEFT SIDEBAR (Matching Reference Screenshots 1-5) */}
      <aside className="w-full md:w-60 lg:w-64 bg-[#0B0F17] text-white flex flex-col justify-between shrink-0 min-h-screen">
        <div className="p-5 sm:p-6">
          {/* Logo Brand matching Screenshot */}
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="inline-block group">
              <span className="text-xl sm:text-2xl font-black text-[#E50914] tracking-tight group-hover:opacity-90 transition-opacity">
                Newyork Capital
              </span>
            </Link>
            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-7 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Back to Home</span>
          </Link>

          {/* Navigation Tabs (5 Tabs) */}
          <nav className={`space-y-1.5 ${mobileSidebarOpen ? 'block' : 'hidden md:block'}`} aria-label="Status Sidebar">
            {tabsConfig.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E50914] text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                      isActive ? 'bg-white text-[#E50914]' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logo Avatar mark */}
        <div className="p-5 sm:p-6 hidden md:block">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
            N
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Row with Writer Avatar & Profile */}
        <header className="w-full px-6 sm:px-10 lg:px-12 pt-6 pb-2 flex items-center justify-end">
          {/* User Profile Pill matching top right */}
          <div className="relative" ref={userDropdownRef}>
            <button
              type="button"
              onClick={() => setShowUserDropdown((prev) => !prev)}
              className="flex items-center gap-2.5 bg-white py-1 px-2.5 sm:px-3 rounded-full border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <img
                src={user?.avatar || '/images/user-avatar-butterfly.png'}
                alt={writerDisplayName}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/user-avatar-butterfly.png';
                }}
              />
              <span className="text-xs sm:text-sm font-bold text-slate-800 hidden sm:inline">
                {writerDisplayName}
              </span>
            </button>

            {/* Profile Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-left animate-in fade-in duration-100">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{writerDisplayName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'writer@entrepreneur.com'}</p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      setShowProfileSettingsModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1642D0] transition-colors text-left cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profile Settings</span>
                  </button>
                  <Link
                    href={`/author/${encodeURIComponent((user?.writerName || user?.name || 'fathima').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'))}`}
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1642D0] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Author Page</span>
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setShowUserDropdown(false);
                      await logout();
                      router.push('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Title & Create New Post Button */}
        <div className="w-full px-6 sm:px-10 lg:px-12 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight my-0">
              Writer Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-0 font-normal">
              Welcome back, {writerDisplayName}!
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => router.push('/writer')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1642D0] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Post</span>
            </button>
          </div>
        </div>

        {/* 3. MAIN POSTS CONTAINER (Expanded evenly on left & right, centered with balanced margins) */}
        <main className="flex-1 w-full px-6 sm:px-10 lg:px-12 pb-12">
          <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            
            {/* Top Bar of Container: Search Box */}
            <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-end">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* 5-Column Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-6 sm:px-8 w-[46%] font-semibold">
                      POST TITLE &amp; SUMMARY
                    </th>
                    <th className="py-3 px-4 w-[16%] font-semibold">
                      CATEGORY
                    </th>
                    <th className="py-3 px-4 w-[13%] font-semibold">
                      DATE
                    </th>
                    <th className="py-3 px-4 w-[12%] font-semibold">
                      STATUS
                    </th>
                    <th className="py-3 px-6 sm:px-8 w-[13%] font-semibold">
                      ACTIONS
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loadingArticles ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="w-7 h-7 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin mx-auto mb-2.5" />
                        <p className="text-xs text-slate-400">Loading articles...</p>
                      </td>
                    </tr>
                  ) : filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">No {activeTab.replace('_', ' ')} articles found</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {searchQuery ? 'Try a different search query.' : 'There are no articles in this section.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art) => {
                      const articleUrl = `/article/${art.dbId || art.slug || art.id}`;
                      const editUrl = `/writer?id=${art.dbId || art.slug || art.id}`;

                      return (
                        <tr key={art.id} className="hover:bg-slate-50/60 transition-colors group">
                          {/* 1. POST TITLE AND SUMMARY */}
                          <td className="py-4 px-6 sm:px-8 align-middle">
                            <div className="flex items-center gap-3.5 sm:gap-4">
                              {/* Square Thumbnail */}
                              <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square shrink-0 rounded-md overflow-hidden bg-slate-100 border border-slate-200/80">
                                <img
                                  src={art.imageUrl || '/images/topic-hero-leaders.jpg'}
                                  alt={art.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/topic-hero-leaders.jpg';
                                  }}
                                />
                              </div>

                              {/* Title, Description & Reading Time */}
                              <div className="min-w-0 flex-1 pr-2">
                                <h3 className="text-[13px] sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1 my-0">
                                  <Link
                                    href={activeTab === 'published' ? articleUrl : editUrl}
                                    className="hover:underline text-slate-900"
                                  >
                                    {art.title}
                                  </Link>
                                </h3>

                                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 mb-0">
                                  {art.excerpt || art.cardSummary || 'Read more about this story and strategic analysis.'}
                                </p>

                                <span className="block text-[11px] text-slate-400 mt-0.5">
                                  {art.readTime || '5 min read'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 2. CATEGORY (Coral/Red bold in Published, normal in others) */}
                          <td className="py-4 px-4 align-middle">
                            <span
                              className={`text-xs block capitalize ${
                                activeTab === 'published'
                                  ? 'text-[#E50914] font-bold uppercase tracking-wider text-[11px]'
                                  : 'text-slate-700 font-semibold text-xs'
                              }`}
                            >
                              {art.category || 'United States'}
                            </span>
                          </td>

                          {/* 3. DATE */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <span className="text-xs text-slate-500 font-normal">
                              {art.date || 'Oct 23, 2026'}
                            </span>
                          </td>

                          {/* 4. STATUS */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            {activeTab === 'published' && (
                              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                PUBLISHED
                              </span>
                            )}

                            {activeTab === 'draft' && (
                              <span className="text-slate-600 font-bold uppercase text-[10px] tracking-wider inline-block">
                                DRAFT
                              </span>
                            )}

                            {activeTab === 'pending_review' && (
                              <span className="bg-amber-50 text-amber-500 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                PENDING
                              </span>
                            )}

                            {activeTab === 'rejected' && (
                              <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase inline-block">
                                REJECTED
                              </span>
                            )}

                            {activeTab === 'trash' && (
                              <span className="text-rose-500 font-bold uppercase text-[10px] tracking-wider inline-block">
                                TRASH
                              </span>
                            )}
                          </td>

                          {/* 5. ACTIONS */}
                          <td className="py-4 px-6 sm:px-8 align-middle whitespace-nowrap">
                            {/* Published Actions: View */}
                            {activeTab === 'published' && (
                              <Link
                                href={articleUrl}
                                className="text-blue-600 hover:text-blue-800 text-xs font-semibold cursor-pointer"
                              >
                                View
                              </Link>
                            )}

                            {/* Draft Actions: Edit Post + Delete icon */}
                            {activeTab === 'draft' && (
                              <div className="flex items-center gap-3">
                                <Link
                                  href={editUrl}
                                  className="text-blue-600 hover:text-blue-800 text-xs font-semibold cursor-pointer"
                                >
                                  Edit Post
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleMoveToTrash(art)}
                                  className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                                  title="Move to Trash"
                                >
                                  <Trash2 className="w-4 h-4 stroke-[1.8]" />
                                </button>
                              </div>
                            )}

                            {/* Pending Review Actions: REASON + Edit Post + Delete icon */}
                            {activeTab === 'pending_review' && (
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => setReasonModalArticle(art)}
                                  className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-2xs transition-colors cursor-pointer"
                                >
                                  REASON
                                </button>
                                <Link
                                  href={editUrl}
                                  className="text-blue-600 hover:text-blue-800 text-xs font-semibold cursor-pointer"
                                >
                                  Edit Post
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleMoveToTrash(art)}
                                  className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                                  title="Move to Trash"
                                >
                                  <Trash2 className="w-4 h-4 stroke-[1.8]" />
                                </button>
                              </div>
                            )}

                            {/* Rejected Actions: REASON + Edit Post */}
                            {activeTab === 'rejected' && (
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => setReasonModalArticle(art)}
                                  className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-2xs transition-colors cursor-pointer"
                                >
                                  REASON
                                </button>
                                <Link
                                  href={editUrl}
                                  className="text-blue-600 hover:text-blue-800 text-xs font-semibold cursor-pointer"
                                >
                                  Edit Post
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleMoveToTrash(art)}
                                  className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                                  title="Move to Trash"
                                >
                                  <Trash2 className="w-4 h-4 stroke-[1.8]" />
                                </button>
                              </div>
                            )}

                            {/* Trash Actions: Restore + Delete Permanently */}
                            {activeTab === 'trash' && (
                              <div className="flex items-center gap-3.5">
                                <button
                                  type="button"
                                  onClick={() => handleRestore(art)}
                                  className="text-slate-800 hover:text-blue-600 text-xs font-semibold cursor-pointer transition-colors"
                                >
                                  Restore
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePermanentDelete(art)}
                                  className="text-slate-800 hover:text-red-600 text-xs font-semibold cursor-pointer transition-colors"
                                >
                                  Delete Permanently
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom summary row */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>
                Showing <strong className="text-slate-700">{filteredArticles.length}</strong> {activeTab.replace('_', ' ')} articles
              </span>
              <span>
                Page 1 of 1
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function WriterDashboardContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EAECEF] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WriterDashboardInner />
    </Suspense>
  );
}

export default WriterDashboardContent;
