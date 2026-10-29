'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Strikethrough,
  Subscript,
  Superscript,
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
  Sparkles,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Pencil,
  Trash2,
  ChevronUp,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

const WEBSITE_CATEGORIES = [
  'Breaking Business News',
  'Markets and Investing',
  'Startups and Entrepreneurship',
  'Technology and AI',
  'Leadership',
  'Research and Insights',
  'Economy',
  'Banking and Finance',
  'Building a Business',
];

const CATEGORY_SUBCATEGORIES_MAP: Record<string, string[]> = {
  'Breaking Business News': ['US', 'World', 'Politics', 'Economy & Trade', 'Policy', 'Corporate', 'Mergers', 'Regulations'],
  'Markets and Investing': ['Stocks', 'Crypto', 'Commodities', 'Bonds', 'Real Estate', 'Venture Capital', 'Private Equity', 'ETFs'],
  'Startups and Entrepreneurship': ['Founders', 'Venture Funding', 'Bootstrapping', 'Growth', 'Pivots', 'Pitch Decks', 'Incubators', 'Scaleups'],
  'Technology and AI': ['Artificial Intelligence', 'Software & SaaS', 'Cybersecurity', 'Autonomous Agents', 'Hardware', 'Robotics', 'Quantum', 'Cloud'],
  'Leadership': ['Executive Strategy', 'Management', 'Hiring & Teams', 'Company Culture', 'Crisis Management', 'Mentorship', 'Board Relations'],
  'Research and Insights': ['Industry Reports', 'Consumer Trends', 'Market Data', 'Case Studies', 'Economic Forecasts', 'Surveys'],
  'Economy': ['Global Trade', 'Inflation', 'Federal Reserve', 'Labor Market', 'Supply Chains', 'Fiscal Policy', 'GDP Reports'],
  'Banking and Finance': ['Fintech', 'Commercial Banking', 'Digital Assets', 'Lending', 'Payments', 'Wealth Management', 'Interest Rates'],
  'Building a Business': ['Operations', 'Sales Funnels', 'Legal & Tax', 'Franchises', 'Branding', 'Customer Retention', 'Product Design'],
};

const PRESET_EDITORIAL_IMAGES = [
  { name: 'Business Leadership', url: '/images/topic-hero-leaders.jpg' },
  { name: 'Strategy & Growth', url: '/images/topic-sub-1.jpg' },
  { name: 'Innovation & AI', url: '/images/topic-sub-2.jpg' },
  { name: 'Mentorship', url: '/images/hero-mentor.jpg' },
  { name: 'Startups & Ventures', url: '/images/related-introvert.png' },
  { name: 'Operations & Scaling', url: '/images/related-founders-warehouse.png' },
];

function WriterEditorMain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);

  // Article Core Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [mainCategory, setMainCategory] = useState('Startups and Entrepreneurship');
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [readDuration, setReadDuration] = useState('5 min read');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');

  // Rich Text Editor State & Content
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const savedRangeRef = useRef<Range | null>(null);

  // Floating Image Toolbar State (Reference Image 4)
  const [selectedImageFigure, setSelectedImageFigure] = useState<HTMLElement | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedImageProps, setSelectedImageProps] = useState<{
    src: string;
    alt: string;
    caption: string;
    credit: string;
    size: 'small' | 'medium' | 'full';
    alignment: 'left' | 'center' | 'no_wrap' | 'right';
  } | null>(null);

  // Sidebar Layout & Tabs State (Reference Image 5)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'details' | 'seo'>('details');

  // SEO Fields (Reference Images 4 & 5)
  const [cardSummary, setCardSummary] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);

  // Insert/Edit Image Modal State (Reference Images 2 & 3)
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [imageKeywords, setImageKeywords] = useState<string[]>([]);
  const [imageKeywordInput, setImageKeywordInput] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [imageSize, setImageSize] = useState<'small' | 'medium' | 'full'>('medium');
  const [imageAlignment, setImageAlignment] = useState<'left' | 'center' | 'no_wrap' | 'right'>('center');
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [alignDropdownOpen, setAlignDropdownOpen] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Preview Modal & Submission State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | number | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    setMounted(true);

    const idParam = searchParams.get('id') || searchParams.get('slug');
    if (idParam) {
      loadArticleById(idParam);
    }

    if (searchParams.get('tab') === 'seo') {
      setActiveSidebarTab('seo');
    }
    if (searchParams.get('modal') === 'image') {
      setShowImageModal(true);
      if (searchParams.get('dropdown') === 'size') {
        setSizeDropdownOpen(true);
      }
    }
    if (searchParams.get('preview') === 'true') {
      setShowPreviewModal(true);
    }

    // Hydrate local draft if available
    try {
      const localDraft = localStorage.getItem('entrepreneur_writer_draft');
      if (localDraft && !idParam) {
        const parsed = JSON.parse(localDraft);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.subtitle) setSubtitle(parsed.subtitle);
        if (parsed.mainCategory) setMainCategory(parsed.mainCategory);
        if (parsed.selectedSubCategories) setSelectedSubCategories(parsed.selectedSubCategories);
        if (parsed.tags) setTags(parsed.tags);
        if (parsed.cardSummary) setCardSummary(parsed.cardSummary);
        if (parsed.focusKeyword) setFocusKeyword(parsed.focusKeyword);
        if (parsed.metaDescription) setMetaDescription(parsed.metaDescription);
        if (parsed.featuredImageUrl) setFeaturedImageUrl(parsed.featuredImageUrl);
        if (parsed.htmlContent) {
          setHtmlContent(parsed.htmlContent);
          setIsEditorEmpty(false);
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = parsed.htmlContent;
            }
          }, 100);
        }
      }
    } catch (err) {
      console.error('Error reading local draft:', err);
    }
  }, [searchParams]);

  // Load existing article from database
  const loadArticleById = async (idOrSlug: string) => {
    try {
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(idOrSlug)}`);
      const data = await res.json();
      if (data?.success && data?.data?.length > 0) {
        const art = data.data[0];
        setEditingArticleId(art.dbId || art.id);
        setTitle(art.title || '');
        setSubtitle(art.excerpt || '');
        setMainCategory(art.category || 'Startups and Entrepreneurship');
        setFeaturedImageUrl(art.imageUrl || '');
        if (art.readTime) setReadDuration(art.readTime);
        if (art.content) {
          setHtmlContent(art.content);
          setIsEditorEmpty(false);
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = art.content;
            }
          }, 150);
        }
        showToast('Existing article loaded for editing.');
      }
    } catch (err) {
      console.error('Failed to load article:', err);
    }
  };

  // Sync contentEditable input with state
  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    const text = editorRef.current.innerText.trim();
    setHtmlContent(content);
    setIsEditorEmpty(!text && !content.includes('<img'));

    // Auto-update read duration
    const fullText = (title + ' ' + subtitle + ' ' + text).trim();
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    setReadDuration(`${minutes} min read`);
  };

  // Save selection range for toolbar commands
  const saveSelectionRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0);
    }
  };

  // Execute rich text formatting commands
  const executeFormatting = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRangeRef.current) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
      }
      document.execCommand(command, false, value);
      handleEditorInput();
    }
  };

  // Insert Link helper
  const handleInsertLink = () => {
    const url = window.prompt('Enter link URL:', 'https://');
    if (url && url.trim() && url !== 'https://') {
      executeFormatting('createLink', url.trim());
    }
  };

  // Detect click on image inside editor to show floating toolbar (Reference Image 4)
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const figure = target.closest('figure.article-image-figure') as HTMLElement | null;

    if (figure && editorRef.current?.contains(figure)) {
      // Image was clicked!
      setSelectedImageFigure(figure);
      const img = figure.querySelector('img');
      const figcaption = figure.querySelector('figcaption');

      const size = (figure.dataset.size as 'small' | 'medium' | 'full') || 'medium';
      const align = (figure.dataset.align as 'left' | 'center' | 'no_wrap' | 'right') || 'center';

      setSelectedImageProps({
        src: img?.getAttribute('src') || '',
        alt: img?.getAttribute('alt') || '',
        caption: figcaption?.innerText || '',
        credit: '',
        size,
        alignment: align,
      });

      // Position floating toolbar directly above image
      const figRect = figure.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      setToolbarPosition({
        top: Math.max(10, figRect.top - editorRect.top - 48),
        left: Math.max(10, figRect.left - editorRect.left + figRect.width / 2 - 180),
      });
    } else {
      // Clicked outside image -> hide floating toolbar
      setSelectedImageFigure(null);
      setToolbarPosition(null);
      setSelectedImageProps(null);
    }
  };

  // Update image size from floating toolbar (S, M, FULL)
  const handleUpdateImageSize = (size: 'small' | 'medium' | 'full') => {
    if (!selectedImageFigure) return;
    selectedImageFigure.dataset.size = size;

    selectedImageFigure.classList.remove('max-w-[250px]', 'max-w-[450px]', 'w-full', 'max-w-none');
    if (size === 'small') {
      selectedImageFigure.classList.add('max-w-[250px]', 'w-full');
    } else if (size === 'medium') {
      selectedImageFigure.classList.add('max-w-[450px]', 'w-full');
    } else {
      selectedImageFigure.classList.add('w-full', 'max-w-none');
    }

    handleEditorInput();
    showToast(`Image size updated to ${size.toUpperCase()}`);
  };

  // Update image alignment from floating toolbar (Left, Center, Right)
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
      'block'
    );

    if (alignment === 'left') {
      selectedImageFigure.classList.add('float-left', 'mr-6', 'mb-4', 'my-2');
    } else if (alignment === 'right') {
      selectedImageFigure.classList.add('float-right', 'ml-6', 'mb-4', 'my-2');
    } else if (alignment === 'no_wrap') {
      selectedImageFigure.classList.add('my-6', 'block', 'clear-both');
    } else {
      selectedImageFigure.classList.add('my-6', 'block', 'clear-both', 'mx-auto', 'text-center');
    }

    handleEditorInput();
    showToast(`Image alignment updated to ${alignment}`);
  };

  // Move image up or down relative to sibling elements
  const handleMoveImage = (direction: 'up' | 'down') => {
    if (!selectedImageFigure) return;
    if (direction === 'up') {
      const prev = selectedImageFigure.previousElementSibling;
      if (prev) {
        selectedImageFigure.parentNode?.insertBefore(selectedImageFigure, prev);
        handleEditorInput();
      }
    } else {
      const next = selectedImageFigure.nextElementSibling;
      if (next) {
        selectedImageFigure.parentNode?.insertBefore(next, selectedImageFigure);
        handleEditorInput();
      }
    }
  };

  // Delete selected image
  const handleDeleteSelectedImage = () => {
    if (!selectedImageFigure) return;
    selectedImageFigure.remove();
    setSelectedImageFigure(null);
    setToolbarPosition(null);
    setSelectedImageProps(null);
    handleEditorInput();
    showToast('Image removed from article.');
  };

  // Open modal in edit mode for selected image
  const handleEditSelectedImage = () => {
    if (!selectedImageProps) return;
    setModalImageUrl(selectedImageProps.src);
    setImageCaption(selectedImageProps.caption);
    setImageSize(selectedImageProps.size);
    setImageAlignment(selectedImageProps.alignment);
    setShowImageModal(true);
  };

  // Subcategory toggle (max 5)
  const currentSubcategories = CATEGORY_SUBCATEGORIES_MAP[mainCategory] || CATEGORY_SUBCATEGORIES_MAP['Startups and Entrepreneurship'];

  const handleToggleSubCategory = (sub: string) => {
    if (selectedSubCategories.includes(sub)) {
      setSelectedSubCategories((prev) => prev.filter((s) => s !== sub));
    } else {
      if (selectedSubCategories.length >= 5) {
        showToast('You can select a maximum of 5 sub-categories.', 'warning');
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
          showToast('Maximum 10 tags allowed.', 'warning');
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

  // Image Modal Keyword Tagging
  const handleImageKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = imageKeywordInput.trim().replace(/^#/, '');
      if (trimmed && !imageKeywords.includes(trimmed)) {
        if (imageKeywords.length >= 4) {
          showToast('Maximum 4 keywords per image.', 'warning');
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

  // File upload from computer in Modal
  const handleModalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file size must be less than 8MB.', 'error');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setModalImageUrl(event.target.result as string);
        showToast('Image file loaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Insert or update configured image into editor body
  const handleInsertImageIntoEditor = () => {
    const finalUrl = modalImageUrl.trim();
    if (!finalUrl) {
      showToast('Please provide an image URL or choose a file.', 'error');
      return;
    }

    // Determine sizing container
    let sizeClass = 'max-w-[450px] w-full';
    if (imageSize === 'small') {
      sizeClass = 'max-w-[250px] w-full';
    } else if (imageSize === 'full') {
      sizeClass = 'w-full max-w-none';
    }

    // Determine alignment & text wrapping
    let alignClass = 'my-6 block clear-both mx-auto text-center';
    if (imageAlignment === 'left') {
      alignClass = 'float-left mr-6 mb-4 my-2 text-left';
    } else if (imageAlignment === 'right') {
      alignClass = 'float-right ml-6 mb-4 my-2 text-right';
    } else if (imageAlignment === 'no_wrap') {
      alignClass = 'my-6 block clear-both text-left';
    }

    const captionSafe = imageCaption.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const creditSafe = imageCredit.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const altSafe = (captionSafe || imageKeywords.join(', ') || title.trim() || 'Article Image').replace(/"/g, '&quot;');

    const captionMarkup = (captionSafe || creditSafe)
      ? `<figcaption class="text-xs text-slate-400 mt-2 italic font-sans ${imageAlignment === 'center' ? 'text-center' : ''}">${captionSafe}${creditSafe ? ` <span class="text-slate-500">(${creditSafe})</span>` : ''}</figcaption>`
      : '';

    // If editing currently selected image, update it in place
    if (selectedImageFigure) {
      selectedImageFigure.dataset.size = imageSize;
      selectedImageFigure.dataset.align = imageAlignment;
      selectedImageFigure.className = `article-image-figure group relative cursor-pointer ${alignClass} ${sizeClass} select-none`;
      const img = selectedImageFigure.querySelector('img');
      if (img) {
        img.src = finalUrl;
        img.alt = altSafe;
      }
      const figcaption = selectedImageFigure.querySelector('figcaption');
      if (figcaption) {
        figcaption.innerHTML = `${captionSafe}${creditSafe ? ` <span class="text-slate-500">(${creditSafe})</span>` : ''}`;
      } else if (captionMarkup) {
        selectedImageFigure.insertAdjacentHTML('beforeend', captionMarkup);
      }
      handleEditorInput();
      setShowImageModal(false);
      showToast('Image properties updated!', 'success');
      return;
    }

    // Insert new figure
    const figureMarkup = `
      <figure class="article-image-figure group relative cursor-pointer ${alignClass} ${sizeClass} select-none" data-size="${imageSize}" data-align="${imageAlignment}" contenteditable="false">
        <img src="${finalUrl}" alt="${altSafe}" class="rounded-xl w-full h-auto object-cover shadow-md border border-slate-700/80 pointer-events-none" />
        ${captionMarkup}
      </figure>
      <p><br></p>
    `;

    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRangeRef.current) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
      }
      document.execCommand('insertHTML', false, figureMarkup);

      if (!editorRef.current.innerHTML.includes(finalUrl)) {
        editorRef.current.innerHTML += figureMarkup;
      }
      handleEditorInput();
    }

    if (!featuredImageUrl) {
      setFeaturedImageUrl(finalUrl);
    }

    setShowImageModal(false);
    setModalImageUrl('');
    setUploadedFileName('');
    setImageKeywords([]);
    setImageCaption('');
    setImageCredit('');
    showToast('Image inserted into article body!', 'success');
  };

  // Auto Generate SEO (Reference Images 4 & 5)
  const handleAutoGenerateSEO = () => {
    if (!title.trim()) {
      showToast('Please enter an article title first before generating SEO.', 'error');
      return;
    }

    setIsGeneratingSeo(true);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent || '';
    const plainText = tempDiv.innerText || tempDiv.textContent || subtitle || '';

    // 1. Focus Keyword extraction
    const cleanTitle = title.replace(/[^\w\s]/gi, ' ').trim();
    const titleWords = cleanTitle.split(/\s+/).filter((w) => w.length > 3);
    let bestKeyword = titleWords.length >= 2 ? `${titleWords[0]} ${titleWords[1]}` : (titleWords[0] || 'Business Strategy');
    bestKeyword = bestKeyword
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    setFocusKeyword(bestKeyword);

    // 2. Card Summary (SEO Lead)
    let summary = '';
    if (plainText.trim()) {
      const sentences = plainText.split(/(?<=[.?!])\s+/).filter(Boolean);
      if (sentences.length >= 2) {
        summary = `${sentences[0]} ${sentences[1]}`.trim();
      } else if (sentences.length === 1) {
        summary = sentences[0].trim();
      }
    }
    if (!summary) {
      summary = subtitle.trim() || `Comprehensive reporting and editorial insights on ${title.trim()}.`;
    }
    if (summary.length > 150) {
      summary = summary.substring(0, 147).trim() + '...';
    }
    setCardSummary(summary);

    // 3. Meta Description (Target under 160 chars)
    let metaDesc = `Discover why ${title.trim()} matters. In-depth analysis, expert perspectives, and key developments on ${bestKeyword}.`;
    if (metaDesc.length > 158) {
      metaDesc = metaDesc.substring(0, 155).trim() + '...';
    }
    setMetaDescription(metaDesc);

    // 4. Meta Title
    setMetaTitle(`${title.trim()} | Entrepreneur`);

    setTimeout(() => {
      setIsGeneratingSeo(false);
      showToast('SEO fields auto-generated successfully!', 'success');
    }, 450);
  };

  // Save Draft (Local + Database)
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      showToast('Please enter an article headline/title to save draft.', 'error');
      return;
    }

    setIsSubmitting(true);
    const currentHtml = editorRef.current ? editorRef.current.innerHTML : htmlContent;

    try {
      localStorage.setItem(
        'entrepreneur_writer_draft',
        JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim(),
          mainCategory,
          selectedSubCategories,
          tags,
          readDuration,
          featuredImageUrl,
          htmlContent: currentHtml,
          cardSummary,
          focusKeyword,
          metaDescription,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    try {
      const payload: any = {
        title: title.trim(),
        category: mainCategory,
        excerpt: subtitle.trim() || cardSummary.trim() || title.trim(),
        content: currentHtml || subtitle.trim() || title.trim(),
        imageUrl: featuredImageUrl || '/images/topic-hero-leaders.jpg',
        status: 'draft',
        authorName: user?.name || 'Staff Contributor',
        readTime: readDuration,
        tags,
        subCategories: selectedSubCategories,
      };

      if (editingArticleId) {
        payload.id = editingArticleId;
        payload.dbId = editingArticleId;
      }

      const res = await fetch('/api/articles', {
        method: editingArticleId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        if (!editingArticleId && data.article?.dbId) {
          setEditingArticleId(data.article.dbId);
        }
        showToast('Draft saved successfully!', 'success');
      } else {
        showToast(data?.error || 'Failed to save draft to server.', 'error');
      }
    } catch {
      showToast('Network error while saving draft.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit for Review
  const handleSubmitForReview = async () => {
    if (!title.trim()) {
      showToast('Please enter an article headline/title.', 'error');
      return;
    }

    const currentHtml = editorRef.current ? editorRef.current.innerHTML : htmlContent;
    const plainText = editorRef.current ? editorRef.current.innerText.trim() : '';

    if (!plainText && !currentHtml.includes('<img')) {
      showToast('Please write your article content before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        title: title.trim(),
        category: mainCategory,
        excerpt: subtitle.trim() || cardSummary.trim() || title.trim(),
        content: currentHtml,
        imageUrl: featuredImageUrl || '/images/topic-hero-leaders.jpg',
        status: 'pending_review',
        authorName: user?.name || 'Staff Contributor',
        readTime: readDuration,
        tags,
        subCategories: selectedSubCategories,
      };

      if (editingArticleId) {
        payload.id = editingArticleId;
        payload.dbId = editingArticleId;
      }

      const res = await fetch('/api/articles', {
        method: editingArticleId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        showToast('Article submitted for review successfully!', 'success');
        localStorage.removeItem('entrepreneur_writer_draft');
        setTimeout(() => {
          router.push('/dashboard/writer');
        }, 1500);
      } else {
        showToast(data?.error || 'Failed to submit article.', 'error');
      }
    } catch {
      showToast('Network error while submitting article.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSlug = (title || 'new-business-headline')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return (
    <div className="min-h-screen bg-[#070C1E] flex flex-col font-sans text-slate-100 antialiased selection:bg-[#EA580C] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-16 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-white font-medium text-xs tracking-wide transition-all animate-in slide-in-from-top-3 ${
            toastMessage.type === 'error'
              ? 'bg-red-600'
              : toastMessage.type === 'warning'
              ? 'bg-amber-600'
              : 'bg-emerald-600'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : toastMessage.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <Check className="w-4 h-4 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. TOP STICKY DARK NAV BAR matching Reference Image 1 & 5 */}
      <header className="sticky top-0 z-40 bg-[#0B132B] text-white px-3 sm:px-5 lg:px-6 py-3.5 shadow-md border-b border-slate-800">
        <div className="w-full max-w-[1680px] mx-auto flex items-center justify-between gap-4">
          
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

            {/* Dynamic Headline Preview */}
            <div className="truncate text-xs sm:text-[13px] font-semibold tracking-wider text-slate-300 uppercase">
              {title.trim() ? title.toUpperCase() : 'NEW BUSINESS HEADLINE'}
            </div>
          </div>

          {/* Right Action Controls: PREVIEW, SAVE DRAFT, SUBMIT FOR REVIEW */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* PREVIEW Button */}
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            {/* SAVE DRAFT Button */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700 disabled:opacity-50 shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            {/* SUBMIT FOR REVIEW (Bright Orange Button) */}
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={isSubmitting}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN 2-COLUMN ARTICLE EDITOR AREA (Proportional Width matching Reference Image 5) */}
      <main className="w-full max-w-[1680px] mx-auto px-3 sm:px-4 lg:px-6 py-5 sm:py-7 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start relative">

          {/* Left Column: Black Article Editor Canvas (8 cols or 12 cols when collapsed) */}
          <div
            className={`transition-all duration-300 flex flex-col gap-5 ${
              sidebarCollapsed ? 'lg:col-span-12' : 'lg:col-span-8 xl:col-span-8'
            }`}
          >
            <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl flex flex-col gap-5 min-h-[720px] relative text-slate-100">
              
              {/* Expand Sidebar pill when collapsed */}
              {sidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(false)}
                  className="self-end -mt-2 -mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer transition-colors shadow-2xs"
                  title="Expand Article Settings"
                >
                  <PanelRightOpen className="w-4 h-4 text-[#EA580C]" />
                  <span>Open Article Settings</span>
                </button>
              )}

              {/* HORIZONTAL RICH TEXT TOOLBAR matching Reference Image 1 & 3 */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 p-2 bg-[#1E293B]/90 border border-slate-700/80 rounded-xl text-slate-300 shadow-2xs">
                
                {/* Group 1: Undo & Redo */}
                <button
                  type="button"
                  onClick={() => executeFormatting('undo')}
                  title="Undo"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeFormatting('redo')}
                  title="Redo"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <Redo2 className="w-4 h-4" />
                </button>

                {/* Divider */}
                <span className="w-[1px] h-4 bg-slate-700 mx-1 select-none" />

                {/* Group 2: B, I, U, Strikethrough, Subscript, Superscript */}
                <button
                  type="button"
                  onClick={() => executeFormatting('bold')}
                  title="Bold"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors font-bold cursor-pointer"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeFormatting('italic')}
                  title="Italic"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors italic cursor-pointer"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeFormatting('underline')}
                  title="Underline"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <UnderlineIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeFormatting('strikeThrough')}
                  title="Strikethrough"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeFormatting('subscript')}
                  title="Subscript"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <Subscript className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => executeFormatting('superscript')}
                  title="Superscript"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <Superscript className="w-3.5 h-3.5" />
                </button>

                {/* Divider */}
                <span className="w-[1px] h-4 bg-slate-700 mx-1 select-none" />

                {/* Group 3: Link & Lists */}
                <button
                  type="button"
                  onClick={handleInsertLink}
                  title="Insert Link"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeFormatting('insertUnorderedList')}
                  title="Bulleted List"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeFormatting('insertOrderedList')}
                  title="Numbered List"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                {/* Divider */}
                <span className="w-[1px] h-4 bg-slate-700 mx-1 select-none" />

                {/* Group 4: Blockquote & Code */}
                <button
                  type="button"
                  onClick={() => executeFormatting('formatBlock', 'blockquote')}
                  title="Blockquote"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeFormatting('formatBlock', 'pre')}
                  title="Code Block"
                  className="p-1.5 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <Code className="w-4 h-4" />
                </button>

                {/* Divider */}
                <span className="w-[1px] h-4 bg-slate-700 mx-1 select-none" />

                {/* Group 5: INSERT IMAGE (Cream/Orange Accent Button matching Reference Image 1) */}
                <button
                  type="button"
                  onClick={() => {
                    saveSelectionRange();
                    setSelectedImageFigure(null);
                    setModalImageUrl('');
                    setImageCaption('');
                    setImageCredit('');
                    setShowImageModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EA580C]/20 border border-[#EA580C]/60 hover:bg-[#EA580C]/30 text-[#FB923C] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                >
                  <ImageIcon className="w-4 h-4 text-[#FB923C]" />
                  <span>Insert Image</span>
                </button>

              </div>

              {/* Title Field: "Add Title..." in large bold serif font */}
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add Title..."
                  className="w-full text-3xl sm:text-4xl font-serif font-bold text-white placeholder:text-slate-600 border-none outline-none focus:ring-0 px-0 py-1 bg-transparent"
                />
              </div>

              {/* Subheading Field: "Add Subheading / Deck..." in italic serif font */}
              <div>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Add Subheading / Deck..."
                  className="w-full text-lg sm:text-xl font-serif italic text-slate-300 placeholder:text-slate-600 border-none outline-none focus:ring-0 px-0 py-1 bg-transparent"
                />
              </div>

              {/* Rich Body Content Area: Dark canvas with floating image toolbar on image click */}
              <div className="relative flex-1 min-h-[480px] flex flex-col" onClick={handleEditorClick}>
                
                {/* Floating Image Toolbar matching Reference Image 4 */}
                {selectedImageFigure && toolbarPosition && (
                  <div
                    style={{ top: `${toolbarPosition.top}px`, left: `${toolbarPosition.left}px` }}
                    className="absolute z-30 bg-[#0B132B] text-white px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in duration-150"
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
                      Size
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
                        className="p-1 text-slate-300 hover:text-white cursor-pointer transition-colors"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateImageAlignment('center')}
                        title="Center (No Wrap)"
                        className="p-1 text-slate-300 hover:text-white cursor-pointer transition-colors"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateImageAlignment('right')}
                        title="Right (Wrap Text Left)"
                        className="p-1 text-slate-300 hover:text-white cursor-pointer transition-colors"
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

                {isEditorEmpty && (
                  <div className="absolute top-2 left-0 text-base text-slate-600 pointer-events-none select-none font-sans">
                    Start writing or type / for plugins
                  </div>
                )}
                
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  onKeyUp={saveSelectionRange}
                  onMouseUp={saveSelectionRange}
                  className="w-full flex-1 min-h-[480px] text-base text-slate-200 border-none outline-none focus:ring-0 px-0 py-2 leading-relaxed font-sans bg-transparent prose prose-invert max-w-none focus:outline-none"
                  style={{ minHeight: '480px' }}
                />
              </div>

            </div>
          </div>

          {/* Right Column: ARTICLE SETTINGS Sidebar (Collapsible with matching toggle button) */}
          {!sidebarCollapsed && (
            <aside className="lg:col-span-4 xl:col-span-4 relative bg-[#0F172A] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col gap-6 sticky top-20 transition-all duration-300 text-slate-200">
              
              {/* Circular Sidebar Collapse Toggle Button positioned on top-left edge matching Reference Image 1 & 5 */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                className="absolute -left-3.5 top-5 w-7 h-7 bg-[#1E293B] border border-slate-700 hover:border-slate-500 rounded-full shadow-md flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer z-10"
                title="Collapse Article Settings"
              >
                <PanelRightClose className="w-4 h-4 text-[#EA580C]" />
              </button>

              {/* Sidebar Header: ⚙️ ARTICLE SETTINGS */}
              <div className="flex items-center gap-2 text-white border-b border-slate-800 pb-3">
                <Settings className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Article Settings
                </h2>
              </div>

              {/* DETAILS / SEO Tabs */}
              <div className="flex items-center p-1 bg-[#1E293B] rounded-xl text-xs font-bold border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setActiveSidebarTab('details')}
                  className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer uppercase tracking-wider ${
                    activeSidebarTab === 'details'
                      ? 'bg-[#334155] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSidebarTab('seo')}
                  className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer uppercase tracking-wider ${
                    activeSidebarTab === 'seo'
                      ? 'bg-[#334155] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SEO
                </button>
              </div>

              {/* DETAILS TAB CONTENT (Reference Image 5) */}
              {activeSidebarTab === 'details' && (
                <div className="flex flex-col gap-5">
                  
                  {/* 1. SELECT CATEGORY (MAIN) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Select Category (Main)
                    </label>
                    <div className="relative">
                      <select
                        value={mainCategory}
                        onChange={(e) => {
                          setMainCategory(e.target.value);
                          setSelectedSubCategories([]);
                        }}
                        className="w-full appearance-none px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:border-[#EA580C] cursor-pointer"
                      >
                        {WEBSITE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat} className="bg-[#1E293B] text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* 2. SELECT SUB-CATEGORIES (OPTIONAL, MAX 5) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Select Sub-Categories (Optional, Max 5)
                    </label>
                    
                    {/* 2-Column Checkbox Grid */}
                    <div className="grid grid-cols-2 gap-2.5 p-3 bg-[#1E293B] border border-slate-700 rounded-xl max-h-48 overflow-y-auto no-scrollbar">
                      {currentSubcategories.map((sub) => {
                        const isChecked = selectedSubCategories.includes(sub);
                        return (
                          <label
                            key={sub}
                            className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none hover:text-white"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSubCategory(sub)}
                              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#EA580C] focus:ring-[#EA580C]/30 cursor-pointer"
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
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="e.g. BreakingNews, Football, WorldCup20"
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#EA580C]"
                    />

                    {/* Tag chips */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {tags.map((t) => (
                          <span
                            key={t}
                            onClick={() => handleRemoveTag(t)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#FB923C] rounded-md text-xs font-semibold cursor-pointer hover:bg-[#EA580C]/30 transition-colors"
                            title="Click to remove"
                          >
                            <span>#{t}</span>
                            <X className="w-3 h-3" />
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Helper Text */}
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Press Enter or Comma to Add • Click Tag to Remove • {tags.length} Tags
                    </div>
                  </div>

                  {/* 4. READ DURATION */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Read Duration
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={readDuration}
                        onChange={(e) => setReadDuration(e.target.value)}
                        placeholder="5 min read"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:border-[#EA580C]"
                      />
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                </div>
              )}

              {/* SEO TAB CONTENT (Reference Images 4 & 5) */}
              {activeSidebarTab === 'seo' && (
                <div className="flex flex-col gap-5">
                  
                  {/* AUTO-GENERATE SEO Button (Orange matching Reference Images 4 & 5) */}
                  <button
                    type="button"
                    onClick={handleAutoGenerateSEO}
                    disabled={isGeneratingSeo}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGeneratingSeo ? 'Generating SEO...' : 'Auto-Generate SEO'}</span>
                  </button>

                  {/* Helper Text */}
                  <p className="text-[11px] text-slate-400 leading-normal -mt-2">
                    Keyword &amp; meta description fill in automatically from your title and content. Edit any field to override.
                  </p>

                  {/* 1. CARD SUMMARY (SEO LEAD) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Card Summary (SEO Lead)
                    </label>
                    <textarea
                      rows={3}
                      value={cardSummary}
                      onChange={(e) => setCardSummary(e.target.value)}
                      placeholder="Concise 1-2 sentence preview details."
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#EA580C] resize-y"
                    />
                  </div>

                  {/* 2. FOCUS KEYWORD */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="e.g. Vexillum Minerals"
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#EA580C]"
                    />
                  </div>

                  {/* 3. META DESCRIPTION (with 0/160 character counter) */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Meta Description
                      </label>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          metaDescription.length > 160 ? 'text-red-400' : 'text-slate-400'
                        }`}
                      >
                        {metaDescription.length} / 160
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Discover why... — the sentence shown under the title in Google."
                      className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#EA580C] resize-y"
                    />
                  </div>

                  {/* 4. PREVIEW IN SEARCH RESULTS (Google Snippet Card) */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                      <span>Preview in Search Results</span>
                    </div>

                    {/* Google Search Card matching Reference Image 4 & 5 */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-md flex flex-col gap-2 text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#0B132B] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                          WT
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-slate-900 leading-none">
                            Washington Times
                          </span>
                          <span className="text-[10px] text-slate-500 truncate leading-none mt-1">
                            washington-times.com &rsaquo; article &rsaquo; {currentSlug}
                          </span>
                        </div>
                      </div>

                      {/* Clickable blue title link */}
                      <div className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-tight truncate">
                        {metaTitle || (title.trim() ? `${title.trim()} | Washington Times` : 'Your Article Title | Washington Times')}
                      </div>

                      {/* Snippet text */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {metaDescription ||
                          cardSummary ||
                          'Add a meta description to control the snippet shown in search results.'}
                      </p>
                    </div>

                    {/* Explanatory footnote */}
                    <p className="text-[11px] text-slate-400 leading-normal">
                      This is how the article can appear on Google. Meta description drives the snippet under the link.
                    </p>
                  </div>

                </div>
              )}

            </aside>
          )}

        </div>
      </main>

      {/* 3. INSERT / EDIT ARTICLE IMAGE POPUP MODAL matching Reference Images 2 & 3 */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F172A] rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-700 flex flex-col gap-5 my-8 animate-in fade-in zoom-in-95 duration-150 text-slate-200">
            
            {/* Modal Header: 🖼 Insert Article Image + Close */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#EA580C]" />
                <h3 className="text-base font-serif font-bold text-white">
                  {selectedImageFigure ? 'Edit Article Image' : 'Insert Article Image'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PASTE IMAGE URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Paste Image URL
              </label>
              <input
                type="text"
                value={modalImageUrl}
                onChange={(e) => setModalImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#EA580C]"
              />
            </div>

            {/* Divider: OR UPLOAD FILE */}
            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0F172A] px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 absolute">
                Or Upload File
              </span>
            </div>

            {/* CHOOSE COMPUTER FILE */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Choose Computer File
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
                className="w-full py-2.5 px-3.5 border border-dashed border-slate-700 rounded-xl bg-[#1E293B]/70 hover:bg-[#1E293B] hover:border-[#EA580C] cursor-pointer flex items-center justify-between text-xs text-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700 shadow-2xs shrink-0">
                    Choose file
                  </span>
                  <span className="text-slate-400 truncate text-xs">
                    {uploadedFileName || 'No file chosen'}
                  </span>
                </div>
                <Upload className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Quick Picks */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
                  Quick Picks:
                </span>
                {PRESET_EDITORIAL_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setModalImageUrl(preset.url);
                      setUploadedFileName(preset.name);
                    }}
                    className="text-[11px] font-medium text-slate-300 hover:text-[#EA580C] bg-[#1E293B] hover:bg-[#1E293B]/80 px-2 py-0.5 rounded border border-slate-700 shrink-0 cursor-pointer transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* IMAGE SEO KEYWORDS HIGHLIGHTED CARD matching Reference Images 2 & 3 */}
            <div className="bg-[#1C1917] border border-[#78350F]/70 rounded-xl p-3.5 flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Image SEO Keywords (Max 4 Keywords)</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-950/80 text-[#FB923C] border border-[#EA580C]/40">
                  {imageKeywords.length} / 4 Keywords
                </span>
              </div>

              <input
                type="text"
                value={imageKeywordInput}
                onChange={(e) => setImageKeywordInput(e.target.value)}
                onKeyDown={handleImageKeywordKeyDown}
                placeholder="e.g. Donald Trump, White House, Election 2026"
                className="w-full px-3 py-2 bg-[#0F172A] border border-amber-900/60 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#EA580C]"
              />

              {/* Keyword chips */}
              {imageKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {imageKeywords.map((kw) => (
                    <span
                      key={kw}
                      onClick={() => handleRemoveImageKeyword(kw)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-950 text-[#FB923C] border border-orange-800 rounded-md text-xs font-medium cursor-pointer hover:bg-orange-900 transition-colors"
                      title="Click to remove keyword"
                    >
                      <span>#{kw}</span>
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                </div>
              )}

              {/* Instruction subtext */}
              <div className="text-[11px] text-amber-400/80 font-medium flex items-center gap-1.5">
                <span>💡</span>
                <span>Type keyword and press Enter or comma (,) to add. Maximum 4 keywords per image.</span>
              </div>
            </div>

            {/* Image Caption */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Image Caption (Visible under picture to readers)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Brief description (e.g. President speaking with reporters outside Capitol)"
                className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#EA580C]"
              />
            </div>

            {/* Image Credit / Source (Optional) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Image Credit / Source (Optional)
              </label>
              <input
                type="text"
                value={imageCredit}
                onChange={(e) => setImageCredit(e.target.value)}
                placeholder="e.g. Reuters, AP Photo, Getty Images"
                className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#EA580C]"
              />
            </div>

            {/* TWO-COLUMN ROW: IMAGE SIZE & POSITION ALIGNMENT matching Reference Image 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* IMAGE SIZE DROPDOWN */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Image Size
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSizeDropdownOpen(!sizeDropdownOpen);
                    setAlignDropdownOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-[#EA580C] rounded-xl text-xs font-semibold text-white flex items-center justify-between cursor-pointer focus:outline-hidden"
                >
                  <span>
                    {imageSize === 'small' && 'Small (Width: 250px)'}
                    {imageSize === 'medium' && 'Medium (Width: 450px)'}
                    {imageSize === 'full' && 'Full-Width (100%)'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {sizeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setImageSize('small');
                        setSizeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer ${
                        imageSize === 'small' ? 'bg-[#EA580C] text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
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
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer ${
                        imageSize === 'medium' ? 'bg-[#EA580C] text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
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
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer ${
                        imageSize === 'full' ? 'bg-[#EA580C] text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Full-Width (100%)
                    </button>
                  </div>
                )}
              </div>

              {/* POSITION ALIGNMENT DROPDOWN */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Position Alignment
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAlignDropdownOpen(!alignDropdownOpen);
                    setSizeDropdownOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold text-white flex items-center justify-between cursor-pointer focus:outline-hidden"
                >
                  <span className="truncate">
                    {imageAlignment === 'center' && 'Center (No Wrap)'}
                    {imageAlignment === 'left' && 'Left — Wrap Text Right'}
                    {imageAlignment === 'right' && 'Right — Wrap Text Left'}
                    {imageAlignment === 'no_wrap' && 'No Wrap'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {alignDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setImageAlignment('center');
                        setAlignDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-2 ${
                        imageAlignment === 'center' ? 'bg-[#EA580C] text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
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
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-2 ${
                        imageAlignment === 'left' ? 'bg-[#EA580C] text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
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
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-2 ${
                        imageAlignment === 'right' ? 'bg-[#EA580C] text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
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
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-2 ${
                        imageAlignment === 'no_wrap' ? 'bg-[#EA580C] text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>No Wrap</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* MODAL FOOTER BUTTONS: CANCEL and + INSERT IMAGE */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-3">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleInsertImageIntoEditor}
                className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>+</span>
                <span>{selectedImageFigure ? 'Update Image' : 'Insert Image'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. LIVE ARTICLE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F172A] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 shadow-2xl border border-slate-700 flex flex-col gap-6 my-8 animate-in fade-in zoom-in-95 duration-150 text-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#EA580C]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Live Article Preview
                </span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Headline Header */}
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                <span>{mainCategory}</span>
                {selectedSubCategories.length > 0 && (
                  <span className="text-slate-400">&bull; {selectedSubCategories.join(', ')}</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                {title.trim() || 'Untitled Article Headline'}
              </h1>

              {subtitle.trim() && (
                <p className="text-lg sm:text-xl text-slate-300 font-serif italic leading-relaxed">
                  {subtitle}
                </p>
              )}
              
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-3 border-t border-slate-800">
                <span className="font-semibold text-slate-200">{user?.name || 'Staff Contributor'}</span>
                <span>&bull;</span>
                <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>&bull;</span>
                <span>{readDuration}</span>
              </div>
            </div>

            {/* Featured Image if assigned */}
            {featuredImageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-700">
                <img src={featuredImageUrl} alt={title} className="w-full h-80 sm:h-96 object-cover" />
              </div>
            )}

            {/* Rendered HTML Content with custom styles */}
            <div
              className="prose prose-invert max-w-none text-slate-200 text-base leading-relaxed break-words"
              dangerouslySetInnerHTML={{
                __html:
                  editorRef.current?.innerHTML ||
                  htmlContent ||
                  '<p class="text-slate-500 italic">No article body written yet.</p>',
              }}
            />

            {/* Tag pills */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                {tags.map((t) => (
                  <span key={t} className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors border border-slate-700"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  handleSubmitForReview();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-md"
              >
                Submit for Review Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function WriterEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070C1E] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WriterEditorMain />
    </Suspense>
  );
}
