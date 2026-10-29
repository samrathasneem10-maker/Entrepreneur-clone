'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Footer } from '@/layouts/Footer';
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

type WriterTab = 'published' | 'draft' | 'pending_review' | 'rejected' | 'trash';

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
  status: 'published' | 'draft' | 'pending_review' | 'rejected' | 'trash';
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
    id: 4,
    dbId: 4,
    title: 'The Solopreneur Playbook for Scaling Without Burning Out',
    category: 'Building a Business',
    date: 'OCT 14, 2026',
    readTime: '6 min read',
    excerpt: 'Frameworks and leverage points to double revenue without doubling working hours.',
    imageUrl: '/images/hero-mentor.jpg',
    status: 'published',
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
    status: 'published',
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
    status: 'published',
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
];

export default function WriterDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Active status tab: 'published' | 'draft' | 'pending_review' | 'rejected' | 'trash'
  const [activeTab, setActiveTab] = useState<WriterTab>('published');
  const [searchQuery, setSearchQuery] = useState('');

  // Articles & counts state
  const [articles, setArticles] = useState<ArticleItem[]>(FALLBACK_WRITER_ARTICLES);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [statusCounts, setStatusCounts] = useState<{
    published: number;
    draft: number;
    pending_review: number;
    rejected: number;
    trash: number;
  }>({
    published: 4,
    draft: 3,
    pending_review: 1,
    rejected: 0,
    trash: 1,
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
    fetchArticles('published');
  }, []);

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
        const withImgs: ArticleItem[] = data.data.map((item: any, idx: number) => ({
          ...item,
          imageUrl:
            item.imageUrl && item.imageUrl.trim() !== ''
              ? item.imageUrl
              : PRESET_ARTICLE_IMAGES[idx % PRESET_ARTICLE_IMAGES.length].url,
        }));
        setArticles(withImgs);
      } else {
        setArticles(FALLBACK_WRITER_ARTICLES.filter((a) => a.status === status));
      }
    } catch {
      setArticles(FALLBACK_WRITER_ARTICLES.filter((a) => a.status === status));
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleTabChange = (tab: WriterTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    fetchArticles(tab);
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

  const currentDisplayName = user?.name || 'Samra Tasneem';

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

      {/* TOP HEADER - Clean, with Entrepreneur logo and user profile (Back link removed per requirement) */}
      <header className="w-full bg-white border-b border-slate-200/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Authentic Entrepreneur Wordmark Logo */}
          <Link href="/" className="flex items-center group py-0.5 select-none" aria-label="Entrepreneur">
            <svg
              className="h-7 sm:h-8 md:h-9 w-auto fill-current text-[#000000] group-hover:text-[#1642D0] transition-colors"
              viewBox="0 0 545.8 107.1"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M0.8,72.7l6.9-1.1V7.9L0,6.9L0.4,0h48.2l-1.2,19.3l-9.6-0.3L37.2,6.9H22.3v28.7h6.5l1.5-6.6l6.7,0.2V49h-6.7 l-1.6-6.8h-6.5v30.4h15l1.4-13.2l10.1,0.3l0.8,20.1H0.5L0.8,72.7z" />
              <path d="M54,79.9l0.3-5.9l5.4-1.1V32.7l-6.3-0.6v-6l15.8-2.3l1.2,3.4v2.3c3.8-4,8.4-6.4,14.3-6.4 c8.6,0,15,5.2,15,15.5v34.2l5.7,1.1l-0.3,5.9H86.3V41.6c0-5.5-2-8.6-7-8.6c-1.7,0-2.9,0.3-4.2,0.8c-0.8,0.7-1.6,1.7-2.3,2.6v36.6 l5.7,1.1l-0.4,5.9H54z" />
              <path d="M356.1,79.9l0.2-5.9l5.4-1.1V32.7l-6.3-0.6v-6l15.8-2.3l1.2,3.4v2.3c3.8-4,8.4-6.4,14.3-6.4 c8.6,0,15,5.2,15,15.5v34.2l5.7,1.1l-0.3,5.9h-18.7V41.6c0-5.5-2-8.6-7-8.6c-1.7,0-2.9,0.3-4.2,0.8c-0.8,0.7-1.6,1.7-2.3,2.6v36.6 l5.7,1.1l-0.4,5.9H356.1z" />
              <path d="M135.2,78.8c-2.2,0.9-6.1,1.9-11.2,1.9c-6.7,0-12.9-3-12.9-12.8V32.7l-6.4-1l0.3-7l7.2-0.3l3.1-10.7l9.2-0.4 v11.5h9.9l-0.7,7l-9.1,1v35.2c0,2.9,1.6,4.8,4.6,4.8h5.4L135.2,78.8z" />
              <path d="M509.5,79.9l0.2-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17.1-5.3l2.4,2.1L544.1,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H509.5z" />
              <path d="M274,79.9l0.3-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17.1-5.3l2.4,2.1L308.5,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H274z" />
              <path d="M139.2,79.9l0.3-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17-5.3l2.4,2.1L173.8,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H139.2z" />
              <path d="M191,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L191,55.4z M190.8,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C191.9,36.8,190.8,45.1,190.8,49z" />
              <path d="M423.4,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L423.4,55.4z M423.2,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C424.3,36.8,423.2,45.1,423.2,49z" />
              <path d="M325.8,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L325.8,55.4z M325.6,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C326.7,36.8,325.5,45.1,325.6,49z" />
              <path d="M490,79.9l-1.4-4.8c-3.7,3.5-7.3,5.6-12.9,5.6c-8.6,0-16.3-4.3-16.3-16.2V31.3l-6.3-0.6v-5.3l18.2-2.1 l1.4,4.8v34.8c0,6.1,2.5,9.3,7.4,9.3c1.4,0,3.2-0.2,4.8-0.8c0.9-0.9,1.8-2,2.5-3.1v-37l-6.5-0.6v-5.3l18.4-2.1l1.4,4.8v44.8 l5.7,1.1l-0.7,5.9H490z" />
              <path d="M247.1,72.7c-2.9,0-5.2-0.5-7-1.5V35.9c0.8-1.2,1.7-2.3,2.6-3.3c1.7-0.6,3.2-0.8,5-0.8c7.5,0,8.8,7.6,8.8,21.2 c0,13.1-2,16.7-2.5,18.2C251.9,72.2,249.7,72.7,247.1,72.7z M269.5,50.6c0-16.9-5-27.5-17.5-27.5c-8.3,0-12.2,4.8-13.8,6.8V28 l-1.4-4.8l-16.3,2.3v5.8l6.3,0.8v68.2l-5.4,1.1l-0.3,5.7h24.1l0.4-5.7l-5.7-1.1V78.7c2.3,1.3,5.5,2.1,9,2.1 C269.3,80.8,269.5,60.1,269.5,50.6z" />
            </svg>
            <span className="text-[#000000] text-xs font-sans font-bold ml-1 self-start mt-0.5">®</span>
          </Link>

          {/* Right: User Profile Avatar & Actual Name (Back link removed) */}
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatar || '/images/user-avatar-butterfly.png'}
              alt={currentDisplayName}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
            <span className="font-bold text-xs sm:text-sm text-slate-900">
              {currentDisplayName}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN WRITER WORKSPACE CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* TOP TITLE ROW: WRITER DASHBOARD + CREATE NEW POST BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-[38px] font-serif font-bold text-slate-900 tracking-tight my-0">
              Writer Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1 mb-0">
              Welcome back, <span className="font-semibold text-slate-800">{currentDisplayName}</span>!
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                setFormTitle('');
                setFormExcerpt('');
                setFormContent('');
                setFormCategory('Building a Business');
                setFormImageUrl('/images/topic-hero-leaders.jpg');
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1642D0] hover:bg-blue-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Post</span>
            </button>
          </div>
        </div>

        {/* HORIZONTAL ARTICLE STATUS NAVIGATION (Strictly 5 Options: Published, Drafts, Pending Review, Rejected, Trash) */}
        <div className="w-full bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
          
          <div className="border-b border-slate-200 bg-slate-50/70 overflow-x-auto scrollbar-none">
            <nav className="flex items-stretch divide-x divide-slate-200 min-w-max" aria-label="Article Status Navigation">
              
              {/* 1. Published Tab */}
              <button
                type="button"
                onClick={() => handleTabChange('published')}
                className={`py-3.5 px-6 sm:px-8 inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'published'
                    ? 'bg-white text-slate-950 border-t-2 border-t-slate-950 border-b-2 border-b-[#1642D0] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>Published</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {statusCounts.published}
                </span>
              </button>

              {/* 2. Drafts Tab */}
              <button
                type="button"
                onClick={() => handleTabChange('draft')}
                className={`py-3.5 px-6 sm:px-8 inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'draft'
                    ? 'bg-white text-slate-950 border-t-2 border-t-slate-950 border-b-2 border-b-[#1642D0] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>Drafts</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === 'draft' ? 'bg-blue-100 text-[#1642D0]' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {statusCounts.draft}
                </span>
              </button>

              {/* 3. Pending Review Tab */}
              <button
                type="button"
                onClick={() => handleTabChange('pending_review')}
                className={`py-3.5 px-6 sm:px-8 inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'pending_review'
                    ? 'bg-white text-slate-950 border-t-2 border-t-slate-950 border-b-2 border-b-[#1642D0] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>Pending Review</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === 'pending_review' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {statusCounts.pending_review}
                </span>
              </button>

              {/* 4. Rejected Tab */}
              <button
                type="button"
                onClick={() => handleTabChange('rejected')}
                className={`py-3.5 px-6 sm:px-8 inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'rejected'
                    ? 'bg-white text-slate-950 border-t-2 border-t-slate-950 border-b-2 border-b-[#1642D0] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>Rejected</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {statusCounts.rejected}
                </span>
              </button>

              {/* 5. Trash Tab */}
              <button
                type="button"
                onClick={() => handleTabChange('trash')}
                className={`py-3.5 px-6 sm:px-8 inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'trash'
                    ? 'bg-white text-slate-950 border-t-2 border-t-slate-950 border-b-2 border-b-[#1642D0] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>Trash</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {statusCounts.trash}
                </span>
              </button>
            </nav>
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
                  placeholder={`Search ${activeTab.replace('_', ' ')} articles...`}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] transition-colors"
                />
              </div>

              <div className="text-xs text-slate-500 font-sans self-center sm:self-auto">
                Showing <span className="font-bold text-slate-800">{filteredArticles.length}</span> {activeTab.replace('_', ' ')} articles
              </div>
            </div>

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
                    onClick={() => setShowCreateModal(true)}
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
                    className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 group"
                  >
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

                        <h3 className="text-base sm:text-[17px] font-bold text-slate-900 group-hover:text-[#1642D0] transition-colors my-0 line-clamp-2 leading-snug">
                          {art.title}
                        </h3>

                        {art.excerpt && (
                          <p className="text-xs sm:text-[13px] text-slate-500 font-sans mt-1.5 mb-0 line-clamp-2 leading-relaxed">
                            {art.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Status Pill & Action Buttons */}
                    <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      
                      {/* Status Badge (Matching Reference Images 4 & 5) */}
                      <div>
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
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(art)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#1642D0] hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Post</span>
                            </button>
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
                  </article>
                ))}
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

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
