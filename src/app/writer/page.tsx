'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  ArrowLeft,
  Eye,
  Save,
  Send,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link2,
  ListOrdered,
  List as ListIcon,
  Quote,
  Code,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Clock,
  Upload,
} from 'lucide-react';

const SUB_CATEGORIES_LIST = [
  'US',
  'World',
  'Politics',
  'Economy & Trade',
  'Crypto',
  'Technology',
  'Travel',
  'Opinion',
  'CEO Spotlight',
  'Sports',
  'AI & Innovation',
  'Real Estate',
];

const PRESET_IMAGES = [
  { name: 'Business Leadership', url: '/images/topic-hero-leaders.jpg' },
  { name: 'Strategy & Growth', url: '/images/topic-sub-1.jpg' },
  { name: 'Innovation & AI', url: '/images/topic-sub-2.jpg' },
  { name: 'Mentorship', url: '/images/hero-mentor.jpg' },
  { name: 'Startups & Ventures', url: '/images/related-introvert.png' },
  { name: 'Operations & Scaling', url: '/images/related-founders-warehouse.png' },
];

export default function WriterEditorPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Core Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/topic-hero-leaders.jpg');
  const [mainCategory, setMainCategory] = useState('Business');
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [readDuration, setReadDuration] = useState('5 min read');

  // SEO Fields
  const [activeSidebarTab, setActiveSidebarTab] = useState<'details' | 'seo'>('details');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto calculate read duration when content changes
  useEffect(() => {
    const wordCount = (title + ' ' + subtitle + ' ' + content).trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    setReadDuration(`${minutes} min read`);
  }, [title, subtitle, content]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Subcategory toggle (max 5)
  const handleToggleSubCategory = (sub: string) => {
    if (selectedSubCategories.includes(sub)) {
      setSelectedSubCategories((prev) => prev.filter((s) => s !== sub));
    } else {
      if (selectedSubCategories.length >= 5) {
        showToast('You can select a maximum of 5 sub-categories.', 'error');
        return;
      }
      setSelectedSubCategories((prev) => [...prev, sub]);
    }
  };

  // Tag management
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        if (tags.length >= 10) {
          showToast('Maximum 10 tags allowed.', 'error');
          return;
        }
        setTags((prev) => [...prev, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
        showToast('Image selected successfully!');
        setShowImagePicker(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Formatting helpers for content textarea
  const applyFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('article-content-area') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = prefix + (selected || 'text') + suffix;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
  };

  // Submit Post (Draft or Published)
  const handleSubmitPost = async (targetStatus: 'draft' | 'published') => {
    if (!title.trim()) {
      showToast('Please enter an article headline/title.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category: mainCategory,
          excerpt: subtitle.trim() || title.trim(),
          content: content.trim() || subtitle.trim() || title.trim(),
          imageUrl: imageUrl || '/images/topic-hero-leaders.jpg',
          status: targetStatus,
          authorName: user?.name || 'Staff Contributor',
          readTime: readDuration,
          tags: tags,
          subCategories: selectedSubCategories,
        }),
      });

      const data = await response.json();
      if (data?.success) {
        if (targetStatus === 'published') {
          showToast('Article submitted and published successfully!');
          setTimeout(() => {
            router.push('/');
          }, 1500);
        } else {
          showToast('Draft saved successfully!');
          setTimeout(() => {
            router.push('/dashboard/writer');
          }, 1500);
        }
      } else {
        showToast(data?.error || 'Failed to submit article.', 'error');
      }
    } catch {
      showToast('Network error while saving article.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-white font-medium text-sm transition-all animate-in slide-in-from-top-3 ${toastMessage.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Sticky Dark Navigation Bar matching Screenshots 4 & 5 */}
      <header className="sticky top-0 z-40 bg-[#0B132B] text-white px-4 sm:px-6 lg:px-8 py-3.5 shadow-md border-b border-slate-800">
        <div className="w-full max-w-[1840px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left: CANCEL button + Dynamic Real-time Headline */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => router.push('/dashboard/writer')}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel</span>
            </button>

            <span className="text-slate-600 select-none hidden sm:inline">|</span>

            {/* Dynamic Headline: updates live in real time as the user types */}
            <div className="truncate text-xs sm:text-[13px] font-semibold tracking-wider text-slate-300 uppercase">
              {title.trim() ? title.toUpperCase() : 'NEW BUSINESS HEADLINE'}
            </div>
          </div>

          {/* Right Action Controls: PREVIEW, SAVE DRAFT, SUBMIT FOR REVIEW */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Preview Button */}
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="px-3 sm:px-3.5 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            {/* Save Draft Button */}
            <button
              type="button"
              onClick={() => handleSubmitPost('draft')}
              disabled={isSubmitting}
              className="px-3 sm:px-3.5 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            {/* Submit for Review (Orange Button matching Screenshot 4 & 5) */}
            <button
              type="button"
              onClick={() => handleSubmitPost('published')}
              disabled={isSubmitting}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main 2-Column Editor Interface */}
      <main className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Column (8 cols): Article Editor Box matching Screenshots 4 & 5 */}
          <div className="lg:col-span-8 xl:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5">
            
            {/* Top Toolbar matching screenshot: Undo, Redo, B, I, U, Link, Lists, Quote, Code, INSERT IMAGE */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-2 bg-slate-50/80 rounded-xl border border-slate-200/80 text-slate-600">
              <button
                type="button"
                onClick={() => applyFormatting('')}
                title="Undo"
                className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('')}
                title="Redo"
                className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors cursor-pointer"
              >
                <Redo2 className="w-4 h-4" />
              </button>

              <span className="w-[1px] h-4 bg-slate-300 mx-1 select-none" />

              <button
                type="button"
                onClick={() => applyFormatting('**', '**')}
                title="Bold"
                className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors font-bold cursor-pointer"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('*', '*')}
                title="Italic"
                className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors italic cursor-pointer"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('<u>', '</u>')}
                title="Underline"
                className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors cursor-pointer"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>

              <span className="w-[1px] h-4 bg-slate-300 mx-1 select-none" />

              <button
                type="button"
                onClick={() => applyFormatting('[', '](https://)')}
                title="Insert Link"
                className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors cursor-pointer"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('\n1. ')}
                title="Numbered List"
                className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors cursor-pointer"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('\n- ')}
                title="Bulleted List"
                className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors cursor-pointer"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('\n> ')}
                title="Blockquote"
                className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors cursor-pointer"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('`', '`')}
                title="Code block"
                className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors cursor-pointer"
              >
                <Code className="w-4 h-4" />
              </button>

              <span className="w-[1px] h-4 bg-slate-300 mx-1 select-none" />

              {/* INSERT IMAGE (Styled with orange accent matching Screenshots 4 & 5) */}
              <button
                type="button"
                onClick={() => setShowImagePicker(true)}
                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#F97316]/50 bg-orange-50/50 hover:bg-orange-100/60 text-[#F97316] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Insert Image</span>
              </button>
            </div>

            {/* Headline Title Field matching "Add Title..." */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add Title..."
                className="w-full text-3xl sm:text-4xl font-serif font-bold text-slate-900 placeholder:text-slate-300 border-none outline-none focus:ring-0 px-0 py-2 bg-transparent"
              />
            </div>

            {/* Subheading / Deck Field matching "Add Subheading / Deck..." */}
            <div>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Add Subheading / Deck..."
                className="w-full text-lg sm:text-xl font-serif italic text-slate-700 placeholder:text-slate-300 border-none outline-none focus:ring-0 px-0 py-1 bg-transparent"
              />
            </div>

            {/* Featured Image Thumbnail Preview */}
            {imageUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 group max-h-[300px]">
                <img
                  src={imageUrl}
                  alt="Featured Article Visual"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(true)}
                    className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded shadow hover:bg-slate-100 cursor-pointer"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded shadow hover:bg-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium rounded">
                  Featured Image Attached
                </div>
              </div>
            )}

            {/* Article Content Textarea matching "Start writing or type / for plugins" */}
            <div className="flex-1 min-h-[420px] flex flex-col">
              <textarea
                id="article-content-area"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing or type / for plugins"
                className="w-full flex-1 min-h-[420px] text-base text-slate-800 placeholder:text-slate-300 border-none outline-none focus:ring-0 px-0 py-2 resize-y leading-relaxed font-sans bg-transparent"
              />
            </div>

          </div>

          {/* Right Column (4 cols): ARTICLE SETTINGS Sidebar matching Screenshots 4 & 5 */}
          <aside className="lg:col-span-4 xl:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col gap-6 sticky top-20">
            
            {/* Sidebar Header */}
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <Settings className="w-4 h-4 text-slate-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Article Settings
              </h2>
            </div>

            {/* DETAILS / SEO Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveSidebarTab('details')}
                className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer uppercase tracking-wider ${activeSidebarTab === 'details' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab('seo')}
                className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer uppercase tracking-wider ${activeSidebarTab === 'seo' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                SEO
              </button>
            </div>

            {/* DETAILS TAB CONTENT */}
            {activeSidebarTab === 'details' && (
              <div className="flex flex-col gap-6">
                
                {/* 1. SELECT CATEGORY (MAIN) */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Select Category (Main)
                  </label>
                  <div className="relative">
                    <select
                      value={mainCategory}
                      onChange={(e) => setMainCategory(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#1642D0] cursor-pointer"
                    >
                      <option value="Business">Business</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Growth">Growth</option>
                      <option value="Startups">Startups</option>
                      <option value="Franchises">Franchises</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 2. SELECT SUB-CATEGORIES (OPTIONAL, MAX 5) */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Select Sub-Categories (Optional, Max 5)
                  </label>
                  
                  {/* 2-Column Checkbox Grid */}
                  <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto no-scrollbar">
                    {SUB_CATEGORIES_LIST.map((sub) => {
                      const isChecked = selectedSubCategories.includes(sub);
                      return (
                        <label
                          key={sub}
                          className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSubCategory(sub)}
                            className="w-4 h-4 rounded border-slate-300 text-[#1642D0] focus:ring-[#1642D0]/30 cursor-pointer"
                          />
                          <span className="truncate">{sub}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Counter: SELECTED: X / 5 */}
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Selected: {selectedSubCategories.length} / 5
                  </div>
                </div>

                {/* 3. TAGS */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="e.g. BreakingNews, Football, WorldCup20"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1642D0]"
                  />

                  {/* Tag chips */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {tags.map((t) => (
                        <span
                          key={t}
                          onClick={() => handleRemoveTag(t)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#1642D0] rounded-md text-xs font-semibold cursor-pointer hover:bg-blue-100 transition-colors"
                          title="Click to remove"
                        >
                          <span>#{t}</span>
                          <X className="w-3 h-3" />
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Helper Text matching screenshot */}
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Press Enter or Comma to Add • Click Tag to Remove • {tags.length} Tags
                  </div>
                </div>

                {/* 4. READ DURATION */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Read Duration
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={readDuration}
                      onChange={(e) => setReadDuration(e.target.value)}
                      placeholder="5 min read"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#1642D0]"
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

              </div>
            )}

            {/* SEO TAB CONTENT */}
            {activeSidebarTab === 'seo' && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle || title}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Article SEO Title"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#1642D0]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription || subtitle}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    placeholder="Short summary for search engines"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#1642D0] resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Focus Keyword
                  </label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="e.g. entrepreneurship, startups"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#1642D0]"
                  />
                </div>
              </div>
            )}

          </aside>

        </div>
      </main>

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Select Featured Image</h3>
              <button
                onClick={() => setShowImagePicker(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload from Computer */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Upload New Image</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-[#1642D0] rounded-xl flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-[#1642D0] transition-colors bg-slate-50/50 cursor-pointer"
              >
                <Upload className="w-6 h-6 stroke-[2]" />
                <span className="text-xs font-semibold">Click to upload image file (JPG, PNG, WebP)</span>
              </button>
            </div>

            {/* Presets Grid */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Or Pick From Editorial Library</span>
              <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto no-scrollbar">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setShowImagePicker(false);
                      showToast('Image selected!');
                    }}
                    className="relative group rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-[#1642D0] transition-all cursor-pointer aspect-video"
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-medium p-1 truncate">
                      {preset.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#1642D0]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Live Post Preview</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Header Preview */}
            <div className="flex flex-col gap-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#1642D0]">
                {mainCategory}
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
                {title || 'Untitled Article Headline'}
              </h1>
              {subtitle && (
                <p className="text-lg text-slate-600 font-serif italic">
                  {subtitle}
                </p>
              )}
              
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-800">{user?.name || 'Staff Contributor'}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span>{readDuration}</span>
              </div>
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <img src={imageUrl} alt={title} className="w-full h-80 object-cover" />
              </div>
            )}

            {/* Body Content Preview */}
            <div className="prose prose-slate max-w-none text-slate-800 text-base leading-relaxed whitespace-pre-wrap">
              {content || 'Article content will appear here...'}
            </div>

            {/* Tags preview */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                {tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  handleSubmitPost('published');
                }}
                className="px-4 py-2 rounded bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold uppercase cursor-pointer"
              >
                Publish Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
