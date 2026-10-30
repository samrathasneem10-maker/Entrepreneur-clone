'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import WriterHeader from '@/components/writer/WriterHeader';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  X,
  Upload,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';

type WriterTab = 'modified' | 'published' | 'draft' | 'pending_review' | 'rejected' | 'trash';

interface ArticleItem {
  id: string | number;
  dbId?: number;
  slug?: string;
  title: string;
  category: string;
  date: string;
  readTime?: string;
  excerpt?: string;
  content?: string;
  imageUrl: string;
  views?: string;
  status: 'modified' | 'published' | 'draft' | 'pending_review' | 'rejected' | 'trash';
  rejectionReason?: string;
  reviewerNotes?: string;
  cardSummary?: string;
  focusKeyword?: string;
  metaDescription?: string;
  tags?: string[] | string;
  subCategories?: string[] | string;
  createdAt?: string;
  updatedAt?: string;
}

const PRESET_ARTICLE_IMAGES = [
  { name: 'Leadership & Growth', url: '/images/topic-hero-leaders.jpg' },
  { name: 'Business Strategy', url: '/images/topic-sub-1.jpg' },
  { name: 'Innovation & Tech', url: '/images/topic-sub-2.jpg' },
  { name: 'Executive Mentorship', url: '/images/hero-mentor.jpg' },
  { name: 'Artificial Intelligence', url: '/images/coding-agents.jpg' },
  { name: 'Global Markets', url: '/images/innovation-leadership.jpg' },
  { name: 'Startups & Ventures', url: '/images/related-introvert.png' },
  { name: 'Supply Chain & Operations', url: '/images/related-founders-warehouse.png' },
];

const FALLBACK_WRITER_ARTICLES: ArticleItem[] = [
  {
    id: 10,
    dbId: 10,
    title: 'Autonomous Enterprise AI: How Small Teams Build Billion-Dollar Products',
    category: 'Business',
    date: 'OCT 29, 2026',
    readTime: '5 min read',
    excerpt: 'A comprehensive breakdown of how automated workflows and intelligence multiply revenue per employee in modern startups.',
    imageUrl: '/images/coding-agents.jpg',
    status: 'published',
  },
  {
    id: 1,
    dbId: 1,
    title: 'How Great Leaders Build Teams That Thrive',
    category: 'Thought Leaders',
    date: 'OCT 18, 2026',
    readTime: '6 min read',
    excerpt: "Strong leadership isn't just about making decisions — it's about creating an environment where people can grow, contribute and succeed.",
    imageUrl: '/images/topic-hero-leaders.jpg',
    status: 'draft',
  },
  {
    id: 2,
    dbId: 2,
    title: 'The Power of Effective Communication in Leadership',
    category: 'Thought Leaders',
    date: 'OCT 17, 2026',
    readTime: '5 min read',
    excerpt: "Great leaders don't just give direction — they listen, inspire and bring people together.",
    imageUrl: '/images/topic-sub-1.jpg',
    status: 'draft',
  },
  {
    id: 3,
    dbId: 3,
    title: 'Collaboration Drives Innovation and Growth',
    category: 'Thought Leaders',
    date: 'OCT 16, 2026',
    readTime: '5 min read',
    excerpt: 'When great minds work together, new ideas turn into real progress.',
    imageUrl: '/images/topic-sub-2.jpg',
    status: 'draft',
  },
  {
    id: 5,
    dbId: 5,
    title: 'How Strategic Content Automation Multiplies B2B Pipeline Growth',
    category: 'Thought Leaders',
    date: 'OCT 12, 2026',
    readTime: '7 min read',
    excerpt: 'How modern B2B founders turn targeted content into predictable revenue pipelines.',
    imageUrl: '/images/innovation-leadership.jpg',
    status: 'draft',
  },
  {
    id: 6,
    dbId: 6,
    title: 'Neuroscience-Backed Routines for High-Pressure Leadership',
    category: 'Leadership',
    date: 'OCT 09, 2026',
    readTime: '5 min read',
    excerpt: 'Science-backed daily routines to manage cognitive load and maintain executive clarity.',
    imageUrl: '/images/related-jumping-cliff.png',
    status: 'draft',
  },
  {
    id: 7,
    dbId: 7,
    title: 'An Introvert\'s Case for Skipping Small Talk and Building Real Connections',
    category: 'Building a Business',
    date: 'OCT 05, 2026',
    readTime: '4 min read',
    excerpt: 'Why skipping superficial chatter accelerates authentic founder-to-founder alliances.',
    imageUrl: '/images/related-introvert.png',
    status: 'published',
  },
  {
    id: 8,
    dbId: 8,
    title: 'AI Governance Frameworks for Venture-Backed Startups',
    category: 'Technology and AI',
    date: 'OCT 20, 2026',
    readTime: '5 min read',
    excerpt: 'Risk mitigation, compliance checkpoints, and ethical governance for next-gen AI tech.',
    imageUrl: '/images/coding-agents.jpg',
    status: 'pending_review',
  },
  {
    id: 9,
    dbId: 9,
    title: 'Archived Seed Round Notes and Obsolete Pitch Decks',
    category: 'Markets and Investing',
    date: 'SEP 28, 2026',
    readTime: '3 min read',
    excerpt: 'Legacy funding pitches from early ideation sprints that were moved out of active queue.',
    imageUrl: '/images/related-founders-warehouse.png',
    status: 'trash',
  },
  {
    id: 11,
    dbId: 11,
    slug: 'venture-debt-vs-equity-financing-2026',
    title: 'Venture Debt vs. Equity Financing: Strategic Capital Allocation in 2026',
    category: 'Markets and Investing',
    date: 'OCT 28, 2026',
    readTime: '6 min read',
    excerpt: 'An updated comparison of non-dilutive venture debt instruments versus Series A equity rounds.',
    imageUrl: '/images/innovation-leadership.jpg',
    status: 'modified',
  },
  {
    id: 12,
    dbId: 12,
    slug: 'ai-powered-micro-saas-growth-scale-1m-arr',
    title: 'AI-Powered Micro-SaaS: Growth Strategies That Scaled to $1M ARR in 90 Days',
    category: 'Technology and AI',
    date: 'OCT 27, 2026',
    readTime: '5 min read',
    excerpt: 'A deep dive into hyper-leveraged software startups and how automated distribution unlocked $1M ARR.',
    imageUrl: '/images/coding-agents.jpg',
    status: 'rejected',
    rejectionReason: 'Needs primary sources, revenue verification, and compliance disclosure.',
    reviewerNotes: 'The claims regarding 90-day ARR require auditable third-party screenshots or Stripe verification. Please revise sections 2 and 4 to include verified metrics and cite original founder interviews before resubmitting.',
  },
];

function WriterDashboardMain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  const tabParam = searchParams.get('tab') as WriterTab;
  const initialTab: WriterTab = tabParam && ['modified', 'published', 'draft', 'pending_review', 'rejected', 'trash'].includes(tabParam)
    ? tabParam
    : 'published';

  // Active status tab: 'modified' | 'published' | 'draft' | 'pending_review' | 'rejected' | 'trash'
  const [activeTab, setActiveTab] = useState<WriterTab>(initialTab);
  const [showRejectedFilter, setShowRejectedFilter] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Articles & counts state
  const [articles, setArticles] = useState<ArticleItem[]>(FALLBACK_WRITER_ARTICLES);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [statusCounts, setStatusCounts] = useState<{
    modified: number;
    published: number;
    draft: number;
    pending_review: number;
    rejected: number;
    trash: number;
  }>({
    modified: 0,
    published: 0,
    draft: 0,
    pending_review: 0,
    rejected: 0,
    trash: 0,
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);

  // Quick image upload file input ref for inline card image changes
  const [inlineUploadArticleId, setInlineUploadArticleId] = useState<string | number | null>(null);
  const inlineFileInputRef = useRef<HTMLInputElement | null>(null);

  // Form states for Create / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Building a Business');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('/images/topic-hero-leaders.jpg');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    setMounted(true);
    fetchCounts();
    const currentTab = (searchParams.get('tab') as WriterTab) || 'published';
    const tabToLoad: WriterTab = ['modified', 'published', 'draft', 'pending_review', 'rejected', 'trash'].includes(currentTab)
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
          modified: data.counts.modified || 0,
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

  // Pagination States supporting 100+ articles
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 15;

  const fetchArticles = async (status: WriterTab, pageNum = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoadingArticles(true);
    }
    try {
      const res = await fetch(`/api/articles?status=${status}&page=${pageNum}&limit=${pageSize}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        const withImgs: ArticleItem[] = data.data.map((item: any, idx: number) => ({
          ...item,
          imageUrl:
            item.imageUrl && item.imageUrl.trim() !== ''
              ? item.imageUrl
              : PRESET_ARTICLE_IMAGES[idx % PRESET_ARTICLE_IMAGES.length].url,
        }));
        if (append) {
          setArticles((prev) => [...prev, ...withImgs]);
        } else {
          setArticles(withImgs);
        }
        setCurrentPage(data.page || pageNum);
        setTotalPages(data.totalPages || 1);
        setTotalArticles(data.total !== undefined ? data.total : withImgs.length);
        setHasMore(Boolean(data.hasMore));
      } else {
        const fallback = FALLBACK_WRITER_ARTICLES.filter((a) => a.status === status);
        setArticles(fallback);
        setTotalArticles(fallback.length);
        setTotalPages(1);
        setHasMore(false);
      }
    } catch {
      const fallback = FALLBACK_WRITER_ARTICLES.filter((a) => a.status === status);
      setArticles(fallback);
      setTotalArticles(fallback.length);
      setTotalPages(1);
      setHasMore(false);
    } finally {
      setLoadingArticles(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchArticles(activeTab, currentPage + 1, true);
  };

  const handlePageChange = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    fetchArticles(activeTab, pageNum, false);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleTabChange = (tab: WriterTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setCurrentPage(1);
    fetchArticles(tab, 1, false);
  };

  // Inline Card Image Upload handler
  const handleTriggerInlineUpload = (articleId: string | number) => {
    setInlineUploadArticleId(articleId);
    if (inlineFileInputRef.current) {
      inlineFileInputRef.current.value = '';
      inlineFileInputRef.current.click();
    }
  };

  const handleInlineFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !inlineUploadArticleId) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      
      // Update UI immediately
      setArticles((prev) =>
        prev.map((a) => (a.id === inlineUploadArticleId ? { ...a, imageUrl: dataUrl } : a))
      );

      const targetArticle = articles.find((a) => a.id === inlineUploadArticleId);
      if (targetArticle) {
        try {
          await fetch('/api/articles', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: targetArticle.slug || targetArticle.id,
              dbId: targetArticle.dbId,
              imageUrl: dataUrl,
            }),
          });
          showToast('Article featured image updated successfully!');
        } catch {
          showToast('Updated local preview image.');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Modal Image Upload handler (for Create/Edit modals)
  const handleModalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormImageUrl(reader.result as string);
      showToast('Image uploaded and selected!');
    };
    reader.readAsDataURL(file);
  };

  // Create article handler
  const handleCreatePost = async (statusToSet: 'published' | 'draft') => {
    if (!formTitle.trim()) {
      showToast('Please provide an article title.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory,
          excerpt: formExcerpt.trim(),
          content: formContent.trim(),
          imageUrl: formImageUrl || '/images/topic-hero-leaders.jpg',
          status: statusToSet,
          authorName: user?.name || 'Samra Tasneem',
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast(
          statusToSet === 'published'
            ? 'Article published successfully!'
            : 'Draft saved successfully!'
        );
        setShowCreateModal(false);
        setFormTitle('');
        setFormExcerpt('');
        setFormContent('');
        setFormImageUrl('/images/topic-hero-leaders.jpg');
        fetchCounts();
        handleTabChange(statusToSet);
      } else {
        showToast(data?.error || 'Failed to create article.', 'error');
      }
    } catch {
      showToast('Network error while creating article.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit article open
  const handleOpenEdit = (art: ArticleItem) => {
    setEditingArticle(art);
    setFormTitle(art.title);
    setFormCategory(art.category || 'Building a Business');
    setFormExcerpt(art.excerpt || '');
    setFormContent(art.content || '');
    setFormImageUrl(art.imageUrl || '/images/topic-hero-leaders.jpg');
    setFormStatus(art.status === 'draft' ? 'draft' : 'published');
    setShowEditModal(true);
  };

  // Save edit handler
  const handleSaveEdit = async () => {
    if (!editingArticle) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingArticle.slug || editingArticle.id,
          dbId: editingArticle.dbId,
          title: formTitle.trim(),
          category: formCategory,
          excerpt: formExcerpt.trim(),
          content: formContent.trim(),
          imageUrl: formImageUrl,
          status: formStatus,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast('Article updated successfully!');
        setShowEditModal(false);
        setEditingArticle(null);
        fetchCounts();
        fetchArticles(activeTab);
      } else {
        showToast(data?.error || 'Failed to update article.', 'error');
      }
    } catch {
      showToast('Error saving changes.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Move to trash handler
  const handleMoveToTrash = async (art: ArticleItem) => {
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
        showToast(data?.error || 'Failed to move article to trash.', 'error');
      }
    } catch {
      showToast('Error moving article to trash.', 'error');
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
        showToast(data?.error || 'Failed to restore article.', 'error');
      }
    } catch {
      showToast('Error restoring article.', 'error');
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
        showToast(data?.error || 'Failed to delete article.', 'error');
      }
    } catch {
      showToast('Error deleting article.', 'error');
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.excerpt && art.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.category && art.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentDisplayName = user?.name || 'Writer Account';

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased selection:bg-[#1642D0] selection:text-white flex flex-col">
      {/* Hidden file input for inline quick card image upload */}
      <input
        ref={inlineFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInlineFileSelected}
      />

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

      {/* 1. TOP HEADER with Washington Global Times branding, WRITER PORTAL, User Pill & Profile Dropdown matching Reference Image 1 */}
      <WriterHeader backHref="/" />

      {/* MAIN WRITER WORKSPACE CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        
        {/* TOP TITLE ROW: POSTS matching Reference Image 1 + CREATE NEW POST BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight my-0">
              Posts
            </h1>
          </div>

          <div>
            <button
              type="button"
              onClick={() => router.push('/writer')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003B64] hover:bg-[#002a48] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Post</span>
            </button>
          </div>
        </div>

        {/* HORIZONTAL ARTICLE STATUS NAVIGATION (5 Tabs: Published, Draft, Pending Review, Rejected, Trash) */}
        <div className="w-full bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
            <div className="overflow-x-auto scrollbar-none flex-1 py-1">
              <nav className="flex items-center gap-6 sm:gap-7 min-w-max" aria-label="Article Status Navigation">
                
                {/* 1. Published Tab */}
                <button
                  type="button"
                  onClick={() => handleTabChange('published')}
                  className={`py-3.5 inline-flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap relative ${
                    activeTab === 'published'
                      ? 'text-[#2563EB] font-bold'
                      : 'text-slate-600 font-medium hover:text-slate-900'
                  }`}
                >
                  <span>Published</span>
                  {statusCounts.published > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {statusCounts.published}
                    </span>
                  )}
                  {activeTab === 'published' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
                  )}
                </button>

                {/* 2. Draft Tab */}
                <button
                  type="button"
                  onClick={() => handleTabChange('draft')}
                  className={`py-3.5 inline-flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap relative ${
                    activeTab === 'draft'
                      ? 'text-[#2563EB] font-bold'
                      : 'text-slate-600 font-medium hover:text-slate-900'
                  }`}
                >
                  <span>Draft</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                    {statusCounts.draft}
                  </span>
                  {activeTab === 'draft' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
                  )}
                </button>

                {/* 3. Pending Review Tab */}
                <button
                  type="button"
                  onClick={() => handleTabChange('pending_review')}
                  className={`py-3.5 inline-flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap relative ${
                    activeTab === 'pending_review'
                      ? 'text-[#2563EB] font-bold'
                      : 'text-slate-600 font-medium hover:text-slate-900'
                  }`}
                >
                  <span>Pending Review</span>
                  {statusCounts.pending_review > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {statusCounts.pending_review}
                    </span>
                  )}
                  {activeTab === 'pending_review' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
                  )}
                </button>

                {/* 4. Rejected Tab */}
                <button
                  type="button"
                  onClick={() => handleTabChange('rejected')}
                  className={`py-3.5 inline-flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap relative ${
                    activeTab === 'rejected'
                      ? 'text-[#2563EB] font-bold'
                      : 'text-slate-600 font-medium hover:text-slate-900'
                  }`}
                >
                  <span>Rejected</span>
                  {statusCounts.rejected > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                      {statusCounts.rejected}
                    </span>
                  )}
                  {activeTab === 'rejected' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
                  )}
                </button>

                {/* 5. Trash Tab */}
                <button
                  type="button"
                  onClick={() => handleTabChange('trash')}
                  className={`py-3.5 inline-flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap relative ${
                    activeTab === 'trash'
                      ? 'text-[#2563EB] font-bold'
                      : 'text-slate-600 font-medium hover:text-slate-900'
                  }`}
                >
                  <span>Trash</span>
                  {statusCounts.trash > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {statusCounts.trash}
                    </span>
                  )}
                  {activeTab === 'trash' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
                  )}
                </button>
              </nav>
            </div>
          </div>

          {/* TAB CONTENT: SEARCH & ARTICLE CARDS / TABLE */}
          <div className="p-5 sm:p-7 lg:p-8">
            
            {/* SEARCH INPUT BAR */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="text-xs text-slate-500 font-sans self-center sm:self-auto">
                Showing <span className="font-bold text-slate-800">{filteredArticles.length}</span> {activeTab.replace('_', ' ')} articles
              </div>
            </div>

            {/* REJECTED QUEUE BANNER */}
            {activeTab === 'rejected' && (
              <div className="mb-6 p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3.5 shadow-2xs">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-rose-900 tracking-tight">
                    Rejected Articles Review Queue
                  </h4>
                  <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                    The articles below require revisions before they can be published. Read the specific reviewer feedback and editorial rationale below each article, then click <strong>Edit and Resubmit</strong> to update your draft and submit it for a fresh review.
                  </p>
                </div>
              </div>
            )}

            {/* ARTICLE CARDS / ROWS */}
            {loadingArticles ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500 font-sans">Loading articles from editorial database...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  No {activeTab.replace('_', ' ')} articles found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                  {searchQuery
                    ? 'Try searching with different keywords.'
                    : `You have no ${activeTab.replace('_', ' ')} articles at the moment.`}
                </p>
                {activeTab !== 'trash' && (
                  <button
                    type="button"
                    onClick={() => router.push('/writer')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1642D0] text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Post</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col gap-4 group"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 w-full">
                      {/* Left: Featured Image + Article Information */}
                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-4.5 flex-1 min-w-0 w-full">
                        
                        {/* Featured Image Thumbnail with Quick Change Overlay */}
                        <div className="relative w-full sm:w-36 md:w-40 h-32 sm:h-24 md:h-26 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group/img">
                          <img
                            src={art.imageUrl || '/images/topic-hero-leaders.jpg'}
                            alt={art.title}
                            onError={(e) => {
                              // Ensure image is never broken; fall back smoothly to dependable topic image
                              (e.target as HTMLImageElement).src = '/images/topic-hero-leaders.jpg';
                            }}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Inline Image Change Trigger */}
                          <button
                            type="button"
                            onClick={() => handleTriggerInlineUpload(art.id)}
                            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 cursor-pointer"
                            title="Change or upload article image"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Change image</span>
                          </button>
                        </div>

                        {/* Article Details */}
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1642D0] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-md">
                              {art.category || 'General'}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {art.date || 'Recent'}
                            </span>
                            {art.readTime && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {art.readTime}
                                </span>
                              </>
                            )}
                          </div>

                          <h3
                            onClick={() => router.push(`/writer?id=${art.dbId || art.slug || art.id}`)}
                            className="text-base sm:text-[17px] font-bold text-slate-900 hover:text-[#1642D0] cursor-pointer transition-colors my-0 line-clamp-2 leading-snug"
                          >
                            {art.title}
                          </h3>

                          {(art.cardSummary || art.excerpt) && (
                            <p className="text-xs sm:text-[13px] text-slate-500 font-sans mt-1.5 mb-0 line-clamp-2 leading-relaxed">
                              {art.cardSummary || art.excerpt}
                            </p>
                          )}

                          {art.tags && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {(Array.isArray(art.tags)
                                ? art.tags
                                : typeof art.tags === 'string'
                                ? (() => {
                                    try {
                                      const p = JSON.parse(art.tags);
                                      return Array.isArray(p) ? p : [art.tags];
                                    } catch {
                                      return art.tags.split(',').map((s) => s.trim());
                                    }
                                  })()
                                : []
                              )
                                .filter(Boolean)
                                .slice(0, 4)
                                .map((t: string) => (
                                  <span
                                    key={t}
                                    className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wide"
                                  >
                                    #{t.replace(/^#/, '')}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Status Pill & Action Buttons */}
                      <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        
                        {/* Status Badge */}
                        <div>
                          {art.status === 'modified' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-sky-50 text-sky-700 border border-sky-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                              MODIFIED
                            </span>
                          )}
                          {art.status === 'published' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              PUBLISHED
                            </span>
                          )}
                          {art.status === 'draft' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-100 text-slate-700 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                              DRAFT
                            </span>
                          )}
                          {art.status === 'pending_review' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              PENDING REVIEW
                            </span>
                          )}
                          {art.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              REJECTED
                            </span>
                          )}
                          {art.status === 'trash' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-zinc-100 text-zinc-600 border border-zinc-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                              TRASH
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {art.status === 'trash' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleRestore(art)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                                title="Restore to Drafts"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restore</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePermanentDelete(art)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                title="Delete Permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </>
                          ) : (
                            <>
                              {art.status === 'rejected' ? (
                                <button
                                  type="button"
                                  onClick={() => router.push(`/writer?id=${art.slug || art.id}&resubmit=true`)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-2xs transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit &amp; Resubmit</span>
                                </button>
                              ) : art.status === 'draft' ? (
                                <button
                                  type="button"
                                  onClick={() => router.push(`/writer?id=${art.dbId || art.slug || art.id}`)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1642D0] hover:bg-blue-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Continue Editing</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => router.push(`/writer?id=${art.dbId || art.slug || art.id}`)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#1642D0] hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit Post</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleMoveToTrash(art)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Move to Trash"
                                aria-label="Move to Trash"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Editorial Rejection Notice with Reviewer Feedback & Resubmit CTA */}
                    {(art.status === 'rejected' || activeTab === 'rejected') && (
                      <div className="w-full mt-1 p-4 bg-rose-50/90 border border-rose-200 rounded-xl text-xs flex flex-col gap-2.5 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-rose-800 font-bold uppercase tracking-wider text-[11px]">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>Editorial Rejection Notice</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                            Action Required
                          </span>
                        </div>
                        <div className="text-slate-800 font-medium">
                          <span className="font-bold text-rose-900">Rejection Reason: </span>
                          {art.rejectionReason || 'Needs primary sources, revenue verification, and compliance disclosure.'}
                        </div>
                        <div className="text-slate-700 bg-white/95 p-3 rounded-lg border border-rose-200/60 shadow-2xs">
                          <span className="font-bold text-slate-900">Reviewer Feedback: </span>
                          {art.reviewerNotes || 'The claims regarding 90-day ARR require auditable third-party screenshots or Stripe verification. Please revise sections 2 and 4 to include verified metrics and cite original founder interviews before resubmitting.'}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-rose-200/80">
                          <span className="text-[11px] text-slate-500 italic">
                            Authorized to edit content and resubmit for editorial approval.
                          </span>
                          <button
                            type="button"
                            onClick={() => router.push(`/writer?id=${art.slug || art.id}&resubmit=true`)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit and Resubmit</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            {/* Pagination & Load More Controls for 100+ Articles */}
            {filteredArticles.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 font-sans">
                  Showing <span className="font-bold text-slate-900">{articles.length}</span> of{' '}
                  <span className="font-bold text-slate-900">{totalArticles}</span> {activeTab.replace('_', ' ')} articles {totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
                </div>

                <div className="flex items-center gap-2">
                  {hasMore && (
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-4 py-2 bg-[#1642D0] hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
                    >
                      {loadingMore && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      <span>{loadingMore ? 'Loading...' : 'Load More Articles'}</span>
                    </button>
                  )}

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-7 h-7 rounded text-xs font-bold cursor-pointer transition-colors ${pageNum === currentPage ? 'bg-[#1642D0] text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        if (pageNum === 2 && currentPage > 3) {
                          return <span key="dots-1" className="text-slate-400 text-xs px-1">...</span>;
                        }
                        if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                          return <span key="dots-2" className="text-slate-400 text-xs px-1">...</span>;
                        }
                        return null;
                      })}

                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CREATE NEW POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1642D0] flex items-center justify-center">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900 my-0">Create New Post</h3>
                  <p className="text-xs text-slate-500 my-0">Draft a new article for the Entrepreneur network</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Post Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 5 Breakthrough Systems Founders Use to Scale"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] bg-white"
                >
                  <option value="Building a Business">Building a Business</option>
                  <option value="Thought Leaders">Thought Leaders</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Technology and AI">Technology and AI</option>
                  <option value="Markets and Investing">Markets and Investing</option>
                  <option value="Startups">Startups</option>
                </select>
              </div>

              {/* ARTICLE FEATURED IMAGE UPLOAD & SELECTION */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Featured Image (Select or Upload)
                </label>
                
                {/* Image Preview & Upload Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-3">
                  <div className="w-28 h-20 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                    <img
                      src={formImageUrl || '/images/topic-hero-leaders.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 font-medium mb-2">
                      Upload a custom photo or choose from Entrepreneur featured presets below:
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-[#1642D0]" />
                      <span>Upload Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleModalFileUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Preset Image Swatches */}
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_ARTICLE_IMAGES.slice(0, 4).map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setFormImageUrl(preset.url)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                        formImageUrl === preset.url
                          ? 'border-[#1642D0] ring-2 ring-blue-200'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-12 object-cover rounded-md"
                      />
                      <span className="block text-[10px] text-slate-600 truncate mt-0.5 font-medium px-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Brief 1-2 sentence preview for article cards..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Content (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Full article content body..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleCreatePost('draft')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleCreatePost('published')}
                  className="px-5 py-2 bg-[#1642D0] hover:bg-blue-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT POST MODAL */}
      {showEditModal && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1642D0] flex items-center justify-center">
                  <Edit3 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900 my-0">Edit Post</h3>
                  <p className="text-xs text-slate-500 my-0">Update story details, featured image and status</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingArticle(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Post Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] bg-white"
                  >
                    <option value="Building a Business">Building a Business</option>
                    <option value="Thought Leaders">Thought Leaders</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Technology and AI">Technology and AI</option>
                    <option value="Markets and Investing">Markets and Investing</option>
                    <option value="Startups">Startups</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'published' | 'draft')}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* EDIT FEATURED IMAGE */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Featured Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-3">
                  <div className="w-28 h-20 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                    <img
                      src={formImageUrl || '/images/topic-hero-leaders.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 font-medium mb-2">
                      Upload replacement image or select from presets:
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-[#1642D0]" />
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleModalFileUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {PRESET_ARTICLE_IMAGES.slice(0, 4).map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setFormImageUrl(preset.url)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                        formImageUrl === preset.url
                          ? 'border-[#1642D0] ring-2 ring-blue-200'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-12 object-cover rounded-md"
                      />
                      <span className="block text-[10px] text-slate-600 truncate mt-0.5 font-medium px-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Content
                </label>
                <textarea
                  rows={3}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingArticle(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSaveEdit}
                  className="px-5 py-2 bg-[#1642D0] hover:bg-blue-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Editorial Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 font-sans mt-auto">
        <span>Entrepreneur Editorial Workstation &bull; All Rights Reserved</span>
      </footer>
    </div>
  );
}

export default function WriterDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WriterDashboardMain />
    </Suspense>
  );
}
