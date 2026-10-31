'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
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
  ChevronRight,
  ChevronLeft,
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
  User,
  LogOut,
  Bookmark,
  CheckCircle2,
  Info,
  MoreVertical,
  Copy,
  RotateCcw,
} from 'lucide-react';
import ProfileSettingsModal from '@/components/writer/ProfileSettingsModal';
import { MAIN_CATEGORIES } from '@/data/categoriesData';

const WEBSITE_CATEGORIES = MAIN_CATEGORIES.map((c) => c.name);

const CATEGORY_SUBCATEGORIES_MAP: Record<string, string[]> = MAIN_CATEGORIES.reduce((acc, cat) => {
  acc[cat.name] = cat.subcategories.map((s) => s.name);
  return acc;
}, {} as Record<string, string[]>);

const PRESET_EDITORIAL_IMAGES = [
  { name: 'Business Leadership', url: '/images/topic-hero-leaders.jpg' },
  { name: 'Strategy & Growth', url: '/images/topic-sub-1.jpg' },
  { name: 'Innovation & AI', url: '/images/topic-sub-2.jpg' },
  { name: 'Mentorship', url: '/images/hero-mentor.jpg' },
  { name: 'Startups & Ventures', url: '/images/related-introvert.png' },
  { name: 'Operations & Scaling', url: '/images/related-founders-warehouse.png' },
];

const INITIAL_ALL_CATEGORIES: string[] = MAIN_CATEGORIES.map((c) => c.name);

// Helper: Extract plain text from HTML string
function extractPlainTextFromHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Requirement 3: Focus Keyword - Identify 2 relevant, meaningful words representing the main topic
function generateFocusKeyword(heading: string, description: string): string {
  const STOP_WORDS = new Set([
    'the', 'is', 'and', 'of', 'for', 'a', 'an', 'in', 'on', 'at', 'to', 'by', 'with', 'from',
    'as', 'that', 'this', 'these', 'those', 'it', 'its', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
    'can', 'could', 'may', 'might', 'must', 'or', 'but', 'nor', 'not', 'no', 'so', 'yet',
    'if', 'then', 'else', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very', 'just', 'into',
    'about', 'over', 'after', 'before', 'between', 'under', 'above', 'out', 'up', 'down',
    'off', 'again', 'further', 'once', 'here', 'there', 'what', 'which', 'who', 'whom',
    'their', 'theirs', 'them', 'they', 'our', 'ours', 'we', 'us', 'you', 'your', 'yours',
    'he', 'him', 'his', 'she', 'her', 'hers', 'my', 'mine', 'me', 'new', 'get', 'like',
    'also', 'across', 'per', 'via', 'well', 'much', 'many', 'own', 'same', 'make', 'made'
  ]);

  const cleanWords = (text: string) =>
    (text || '')
      .replace(/[^\w\s-]/gi, ' ')
      .split(/\s+/)
      .map((w) => w.trim().replace(/^[-_]+|[-_]+$/g, ''))
      .filter((w) => w.length > 2 && !/^\d+$/.test(w));

  const headingWords = cleanWords(heading);
  const descWords = cleanWords(description);

  // Check for meaningful 2-word consecutive phrases (bigrams) in text
  const combinedText = `${heading} ${description}`;
  const rawTokens = combinedText
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const bigramCounts: Record<string, { phrase: string; score: number; firstPos: number }> = {};
  for (let i = 0; i < rawTokens.length - 1; i++) {
    const w1 = rawTokens[i].toLowerCase();
    const w2 = rawTokens[i + 1].toLowerCase();
    if (!STOP_WORDS.has(w1) && !STOP_WORDS.has(w2) && w1.length > 2 && w2.length > 2 && !/^\d+$/.test(w1) && !/^\d+$/.test(w2)) {
      const key = `${w1} ${w2}`;
      const capitalized = `${rawTokens[i].charAt(0).toUpperCase() + rawTokens[i].slice(1).toLowerCase()} ${rawTokens[i + 1].charAt(0).toUpperCase() + rawTokens[i + 1].slice(1).toLowerCase()}`;
      if (!bigramCounts[key]) {
        bigramCounts[key] = { phrase: capitalized, score: i < 15 ? 4 : 2, firstPos: i };
      } else {
        bigramCounts[key].score += 2;
      }
    }
  }

  const sortedBigrams = Object.values(bigramCounts).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.firstPos - b.firstPos;
  });

  if (sortedBigrams.length > 0) {
    return sortedBigrams[0].phrase;
  }

  const headingWordSet = new Set(headingWords.map((w) => w.toLowerCase()));
  const descWordSet = new Set(descWords.map((w) => w.toLowerCase()));

  const scores: Record<string, { word: string; score: number; order: number }> = {};
  let orderIndex = 0;

  headingWords.forEach((w) => {
    const lower = w.toLowerCase();
    if (STOP_WORDS.has(lower)) return;
    if (!scores[lower]) {
      scores[lower] = {
        word: w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        score: 0,
        order: orderIndex++,
      };
    }
    scores[lower].score += 3;
    if (descWordSet.has(lower)) {
      scores[lower].score += 5;
    }
  });

  descWords.forEach((w) => {
    const lower = w.toLowerCase();
    if (STOP_WORDS.has(lower)) return;
    if (!scores[lower]) {
      scores[lower] = {
        word: w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        score: 0,
        order: orderIndex++,
      };
    }
    scores[lower].score += 1;
    if (headingWordSet.has(lower) && scores[lower].score < 8) {
      scores[lower].score += 5;
    }
  });

  const sortedCandidates = Object.values(scores).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.order - b.order;
  });

  if (sortedCandidates.length >= 2) {
    return `${sortedCandidates[0].word} ${sortedCandidates[1].word}`;
  } else if (sortedCandidates.length === 1) {
    return sortedCandidates[0].word;
  }
  return 'Search Results';
}

// Suggest two relevant focus keywords based on article heading and content
function generateFocusKeywordsList(heading: string, description: string): string[] {
  const primary = generateFocusKeyword(heading, description);
  const words = (heading + ' ' + description)
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .map((w) => w.trim().replace(/^[-_]+|[-_]+$/g, ''))
    .filter((w) => w.length > 3 && !/^\d+$/.test(w));

  const uniqueWords: string[] = [];
  words.forEach((w) => {
    const formatted = w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    if (!uniqueWords.includes(formatted) && !primary.toLowerCase().includes(formatted.toLowerCase())) {
      uniqueWords.push(formatted);
    }
  });

  const secondary = uniqueWords.length >= 2 ? `${uniqueWords[0]} ${uniqueWords[1]}` : (uniqueWords[0] || 'Market Insights');
  return [primary, secondary];
}

// Requirement 2: Card Summary - Extract short meaningful summary from description, ending in "..." at word boundary
function generateCardSummary(description: string, fallbackContent: string = ''): string {
  const text = (description || fallbackContent || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';

  const maxLen = 140;
  if (text.length <= maxLen) {
    return text;
  }

  let cutIndex = text.lastIndexOf(' ', maxLen);
  if (cutIndex < 80) {
    cutIndex = text.indexOf(' ', maxLen);
    if (cutIndex === -1 || cutIndex > 160) cutIndex = maxLen;
  }

  let truncated = text.substring(0, cutIndex).trim().replace(/[,;:.!?-]+$/, '');
  // Strip trailing prepositions/conjunctions/stop words
  truncated = truncated.replace(/\s+(to|and|or|of|in|for|with|at|by|from|as|that|the|a|an)$/i, '').trim().replace(/[,;:.!?-]+$/, '');
  return `${truncated}...`;
}

// Requirement 4: Meta Description - Concise summary within 150-160 characters ending in "..."
function generateMetaDescription(description: string, fallbackContent: string = ''): string {
  const text = (description || fallbackContent || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';

  const maxLen = 140;
  if (text.length <= maxLen) {
    return text;
  }

  let cutIndex = text.lastIndexOf(' ', maxLen);
  if (cutIndex < 80) {
    cutIndex = text.indexOf(' ', maxLen);
    if (cutIndex === -1 || cutIndex > 160) cutIndex = maxLen;
  }

  const truncated = text.substring(0, cutIndex).trim().replace(/[,;:.!?]+$/, '');
  return `${truncated}...`;
}

function WriterEditorMain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [showProfileSettingsModal, setShowProfileSettingsModal] = useState(false);

  // Article Core Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const subtitleTextareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResizeTextarea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    autoResizeTextarea(titleTextareaRef.current);
  }, [title]);

  useEffect(() => {
    autoResizeTextarea(subtitleTextareaRef.current);
  }, [subtitle]);

  const [authorName, setAuthorName] = useState('');
  const [mainCategory, setMainCategory] = useState(MAIN_CATEGORIES[0].name);
  const [allCategories, setAllCategories] = useState<string[]>(INITIAL_ALL_CATEGORIES);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

  // Synchronized Categories using Navigation Menu (MAIN_CATEGORIES) as Single Source of Truth
  const activeMainCatObj = useMemo(() => {
    return (
      MAIN_CATEGORIES.find((c) => c.name.toLowerCase() === mainCategory.trim().toLowerCase()) ||
      MAIN_CATEGORIES.find((c) => c.aliases?.some((a) => a.toLowerCase() === mainCategory.trim().toLowerCase())) ||
      MAIN_CATEGORIES.find((c) => c.slug.toLowerCase() === mainCategory.trim().toLowerCase()) ||
      MAIN_CATEGORIES[0]
    );
  }, [mainCategory]);

  const currentSubcategories = useMemo(() => {
    return activeMainCatObj ? activeMainCatObj.subcategories : [];
  }, [activeMainCatObj]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);
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
  const [isMainCatExpanded, setIsMainCatExpanded] = useState(true);
  const [isSubCatExpanded, setIsSubCatExpanded] = useState(true);

  // Link Insertion & Editing Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);
  const [currentLinkElement, setCurrentLinkElement] = useState<HTMLAnchorElement | null>(null);

  // Active Toolbar Formatting Tracking
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    subscript: false,
    superscript: false,
    insertOrderedList: false,
    insertUnorderedList: false,
    link: false,
    blockquote: false,
    code: false,
  });

  // Dedicated Toggle Section States for Quote Card & Code Section
  const [isQuoteActive, setIsQuoteActive] = useState(false);
  const [isCodeActive, setIsCodeActive] = useState(false);
  const quoteContentRef = useRef<string>('');
  const codeContentRef = useRef<string>('');
  const lastToggledQuoteElRef = useRef<HTMLElement | null>(null);
  const lastToggledCodeElRef = useRef<HTMLElement | null>(null);

  // Dynamic Database Categories & Subcategories State
  const [mainCategoriesList, setMainCategoriesList] = useState<string[]>(WEBSITE_CATEGORIES);
  const [subCategoriesMap, setSubCategoriesMap] = useState<Record<string, string[]>>(CATEGORY_SUBCATEGORIES_MAP);

  // Image In-Place Edit Tracking Refs
  const editingImageFigureRef = useRef<HTMLElement | null>(null);
  const editingImageIdRef = useRef<string | null>(null);

  // SEO Fields
  const [cardSummary, setCardSummary] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);

  // SEO Manual Edit Tracking (Requirement 5: Do not overwrite manually edited SEO fields)
  const [isCardSummaryEdited, setIsCardSummaryEdited] = useState(false);
  const [isFocusKeywordEdited, setIsFocusKeywordEdited] = useState(false);
  const [isMetaDescriptionEdited, setIsMetaDescriptionEdited] = useState(false);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [showPreviewMenu, setShowPreviewMenu] = useState(false);

  // Focus Keyword Analysis Checkers
  const isTitleKeywordMatch = useMemo(() => {
    if (!focusKeyword.trim() || !title.trim()) return false;
    const cleanKw = focusKeyword.trim().toLowerCase();
    const cleanTitle = title.trim().toLowerCase();
    return cleanTitle.includes(cleanKw);
  }, [focusKeyword, title]);

  const isMetaDescKeywordMatch = useMemo(() => {
    if (!focusKeyword.trim() || !metaDescription.trim()) return false;
    const cleanKw = focusKeyword.trim().toLowerCase();
    const cleanDesc = metaDescription.trim().toLowerCase();
    return cleanDesc.includes(cleanKw);
  }, [focusKeyword, metaDescription]);

  // Preview Insights & Quality Stats
  const wordCount = useMemo(() => {
    const text = (editorRef.current?.innerText || extractPlainTextFromHtml(htmlContent)).trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }, [htmlContent]);

  const hasHeadings = useMemo(() => {
    return /<h[1-6][^>]*>/i.test(htmlContent);
  }, [htmlContent]);

  const contentScore = useMemo(() => {
    let score = 25;
    if (title.trim().length >= 15) score += 20;
    if (focusKeyword.trim()) score += 15;
    if (isTitleKeywordMatch) score += 15;
    if (isMetaDescKeywordMatch) score += 15;
    if (metaDescription.trim().length >= 50 && metaDescription.trim().length <= 160) score += 10;
    return Math.min(100, score);
  }, [title, focusKeyword, isTitleKeywordMatch, isMetaDescKeywordMatch, metaDescription]);

  // Insert/Edit Image Modal State
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

    if (searchParams.get('sidebar') === 'collapsed') {
      setSidebarCollapsed(true);
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

    if (!idParam) {
      try {
        const savedDraftStr = localStorage.getItem('entrepreneur_writer_draft');
        if (savedDraftStr) {
          const savedDraft = JSON.parse(savedDraftStr);
          if (
            savedDraft &&
            (savedDraft.title ||
              savedDraft.htmlContent ||
              (savedDraft.selectedSubCategories && savedDraft.selectedSubCategories.length > 0) ||
              savedDraft.mainCategory)
          ) {
            if (savedDraft.title) setTitle(savedDraft.title);
            if (savedDraft.subtitle) setSubtitle(savedDraft.subtitle);
            if (savedDraft.authorName) setAuthorName(savedDraft.authorName);
            if (savedDraft.mainCategory) setMainCategory(savedDraft.mainCategory);
            if (savedDraft.selectedSubCategories && Array.isArray(savedDraft.selectedSubCategories)) {
              setSelectedSubCategories(savedDraft.selectedSubCategories);
            }
            if (savedDraft.tags && Array.isArray(savedDraft.tags)) {
              setTags(savedDraft.tags);
            }
            if (savedDraft.readDuration) setReadDuration(savedDraft.readDuration);
            if (savedDraft.featuredImageUrl) setFeaturedImageUrl(savedDraft.featuredImageUrl);
            if (savedDraft.cardSummary) setCardSummary(savedDraft.cardSummary);
            if (savedDraft.focusKeyword) setFocusKeyword(savedDraft.focusKeyword);
            if (savedDraft.metaDescription) setMetaDescription(savedDraft.metaDescription);
            if (savedDraft.htmlContent) {
              setHtmlContent(savedDraft.htmlContent);
              setIsEditorEmpty(false);
              setTimeout(() => {
                if (editorRef.current) {
                  editorRef.current.innerHTML = savedDraft.htmlContent;
                }
              }, 100);
            }
            return;
          }
        }
      } catch (err) {
        console.error('Error reading draft on mount:', err);
      }

      // Clean slate only on opening fresh editor without draft
      setTitle('');
      setSubtitle('');
      setTags([]);
      setTagInput('');
      setHtmlContent('');
      setIsEditorEmpty(true);
      setFeaturedImageUrl('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }
  }, [searchParams]);

  // Hydrate initial author name from logged in user if not set
  useEffect(() => {
    if (!authorName && user) {
      setAuthorName(user.writerName || user.name || '');
    }
  }, [user, authorName]);

  // Dynamic Category Loading from Database: Load ALL categories and subcategories
  useEffect(() => {
    const fetchDynamicCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data?.success) {
          const catSet = new Set<string>(INITIAL_ALL_CATEGORIES);

          if (Array.isArray(data.categories) && data.categories.length > 0) {
            data.categories.forEach((cat: any) => {
              if (cat.name && typeof cat.name === 'string') {
                catSet.add(cat.name);
              }
              if (cat.parent_name && typeof cat.parent_name === 'string') {
                catSet.add(cat.parent_name);
              }
            });
          }

          if (Array.isArray(data.mainCategories)) {
            data.mainCategories.forEach((m: any) => {
              if (m.name) catSet.add(m.name);
              if (Array.isArray(m.subcategories)) {
                m.subcategories.forEach((s: any) => {
                  const sName = typeof s === 'string' ? s : s?.name;
                  if (sName) catSet.add(sName);
                });
              }
            });
          }

          if (catSet.size > 0) {
            setAllCategories(Array.from(catSet));
          }
        }
      } catch (err) {
        console.error('Error loading dynamic categories:', err);
      }
    };

    fetchDynamicCategories();
  }, []);

  // Requirement 5: Dynamic SEO Updates when heading or description changes (unless manually edited)
  useEffect(() => {
    if (!mounted) return;
    const descriptionSource = subtitle.trim() || extractPlainTextFromHtml(htmlContent);

    if (!isCardSummaryEdited && descriptionSource) {
      setCardSummary(generateCardSummary(descriptionSource));
    }
    if (!isFocusKeywordEdited && (title.trim() || descriptionSource)) {
      setFocusKeyword(generateFocusKeyword(title, descriptionSource));
    }
    if (!isMetaDescriptionEdited && descriptionSource) {
      setMetaDescription(generateMetaDescription(descriptionSource));
    }
    if (title.trim() || descriptionSource) {
      setSuggestedKeywords(generateFocusKeywordsList(title, descriptionSource));
    }
    if (title.trim()) {
      setMetaTitle(`${title.trim()} | Washington Times`);
    }
  }, [title, subtitle, htmlContent, mounted, isCardSummaryEdited, isFocusKeywordEdited, isMetaDescriptionEdited]);

  // Auto-persist category, author, subcategories, tags, and SEO to draft storage on change
  useEffect(() => {
    if (!mounted) return;
    try {
      const existingStr = localStorage.getItem('entrepreneur_writer_draft');
      const existing = existingStr ? JSON.parse(existingStr) : {};
      localStorage.setItem(
        'entrepreneur_writer_draft',
        JSON.stringify({
          ...existing,
          authorName,
          mainCategory,
          selectedSubCategories,
          tags,
          cardSummary,
          focusKeyword,
          metaDescription,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch {}
  }, [mainCategory, selectedSubCategories, authorName, tags, cardSummary, focusKeyword, metaDescription, mounted]);

  const loadArticleById = async (idOrSlug: string) => {
    try {
      const res = await fetch(`/api/articles?slug=${encodeURIComponent(idOrSlug)}`);
      const data = await res.json();
      if (data?.success && data?.data?.length > 0) {
        const art = data.data[0];
        setEditingArticleId(art.dbId || art.id);
        setTitle(art.title || '');
        setSubtitle(art.excerpt || '');
        if (art.authorName || art.author?.name) {
          setAuthorName(art.authorName || art.author?.name);
        }
        if (art.category) setMainCategory(art.category);
        if (art.subCategories) {
          if (Array.isArray(art.subCategories)) {
            setSelectedSubCategories(art.subCategories);
          } else if (typeof art.subCategories === 'string') {
            try {
              setSelectedSubCategories(JSON.parse(art.subCategories));
            } catch {
              setSelectedSubCategories(art.subCategories.split(',').map((s: string) => s.trim()));
            }
          }
        }
        if (art.tags) {
          if (Array.isArray(art.tags)) {
            setTags(art.tags);
          } else if (typeof art.tags === 'string') {
            try {
              setTags(JSON.parse(art.tags));
            } catch {
              setTags(art.tags.split(',').map((t: string) => t.trim()).filter(Boolean));
            }
          }
        }
        if (art.cardSummary) {
          setCardSummary(art.cardSummary);
          setIsCardSummaryEdited(true);
        }
        if (art.focusKeyword) {
          setFocusKeyword(art.focusKeyword);
          setIsFocusKeywordEdited(true);
        }
        if (art.metaDescription) {
          setMetaDescription(art.metaDescription);
          setIsMetaDescriptionEdited(true);
        }
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

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    const text = (editorRef.current.innerText || '')
      .replace(/\u00a0/g, ' ')
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .trim();
    const hasMediaOrBlock =
      content.includes('<img') ||
      content.includes('<blockquote') ||
      content.includes('<pre') ||
      content.includes('<ol') ||
      content.includes('<ul');
    const isEmpty = text.length === 0 && !hasMediaOrBlock;
    setHtmlContent(content);
    setIsEditorEmpty(isEmpty);

    const sel = typeof window !== 'undefined' ? window.getSelection() : null;
    let insideQuote = false;
    let insideCode = false;
    if (sel && sel.anchorNode && editorRef.current?.contains(sel.anchorNode)) {
      let el: Node | null = sel.anchorNode;
      if (el.nodeType === Node.TEXT_NODE) el = el.parentNode;
      if ((el as HTMLElement)?.closest?.('blockquote')) insideQuote = true;
      if ((el as HTMLElement)?.closest?.('pre')) insideCode = true;
    }
    setIsQuoteActive(insideQuote);
    setIsCodeActive(insideCode);

    const fullText = (title + ' ' + subtitle + ' ' + text).trim();
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    setReadDuration(`${minutes} min read`);
  };

  const updateActiveFormats = () => {
    if (typeof window === 'undefined') return;
    try {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      const isStrike = document.queryCommandState('strikeThrough');
      const isSub = document.queryCommandState('subscript');
      const isSuper = document.queryCommandState('superscript');
      let isOL = document.queryCommandState('insertOrderedList');
      let isUL = document.queryCommandState('insertUnorderedList');

      let isLink = false;
      let insideQuote = false;
      let insideCode = false;

      const sel = window.getSelection();
      if (sel && sel.anchorNode && editorRef.current?.contains(sel.anchorNode)) {
        let el: Node | null = sel.anchorNode;
        if (el.nodeType === Node.TEXT_NODE) el = el.parentNode;
        if ((el as HTMLElement)?.closest?.('blockquote')) insideQuote = true;
        if ((el as HTMLElement)?.closest?.('pre')) insideCode = true;
        while (el && el !== editorRef.current) {
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
        strikeThrough: isStrike,
        subscript: isSub,
        superscript: isSuper,
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
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0);
    }
    updateActiveFormats();
  };

  const ensureEditorSelection = () => {
    if (!editorRef.current) return null;
    editorRef.current.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0);
      return sel;
    }
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
      return sel;
    }
    return sel;
  };

  const executeFormatting = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      ensureEditorSelection();
      document.execCommand(command, false, value);
      handleEditorInput();
      setTimeout(updateActiveFormats, 50);
    }
  };

  // Full-featured Link Modal Handlers
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
      while (node && node !== editorRef.current) {
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
      showToast('Please enter a valid URL.', 'warning');
      return;
    }
    if (cleanUrl.toLowerCase().startsWith('javascript:')) {
      showToast('JavaScript links are not permitted for security reasons.', 'error');
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

    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRangeRef.current) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
      }

      const sel = window.getSelection();
      const hasSelection = sel && !sel.isCollapsed && sel.toString().length > 0;

      if (hasSelection) {
        document.execCommand('createLink', false, cleanUrl);
        if (editorRef.current) {
          const links = editorRef.current.querySelectorAll('a');
          links.forEach((a) => {
            if (a.getAttribute('href') === cleanUrl) {
              a.className = 'text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer';
              if (linkOpenNewTab) {
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener noreferrer');
              }
            }
          });
        }
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

  // Requirement: Toggle Quote Card Section at exact cursor position
  const toggleQuoteSection = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    let range: Range | null = null;
    if (sel && sel.rangeCount > 0 && editorRef.current.contains(sel.anchorNode)) {
      range = sel.getRangeAt(0);
    } else if (savedRangeRef.current && editorRef.current.contains(savedRangeRef.current.commonAncestorContainer)) {
      range = savedRangeRef.current;
    }

    // Check if cursor is currently inside an existing quote block
    let existingQuote: HTMLElement | null = null;
    if (range) {
      let node: Node | null = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
      existingQuote = (node as HTMLElement)?.closest?.('blockquote') || null;
    }

    // If not directly inside, check last toggled quote element if it still exists in editor
    if (!existingQuote && lastToggledQuoteElRef.current && editorRef.current.contains(lastToggledQuoteElRef.current)) {
      existingQuote = lastToggledQuoteElRef.current;
    }

    if (existingQuote) {
      // TOGGLE OFF: remove blockquote and restore original content as paragraph(s)
      quoteContentRef.current = existingQuote.innerHTML;
      const text = existingQuote.innerText?.trim() || existingQuote.textContent?.trim() || '';
      const p = document.createElement('p');
      p.innerHTML = text ? text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>') : '<br>';

      existingQuote.parentNode?.replaceChild(p, existingQuote);
      lastToggledQuoteElRef.current = null;
      setIsQuoteActive(false);

      // Place cursor in restored paragraph
      const newRange = document.createRange();
      newRange.selectNodeContents(p);
      newRange.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(newRange);
      savedRangeRef.current = newRange;

      handleEditorInput();
      showToast('Quote section removed and restored to text.');
      setTimeout(updateActiveFormats, 50);
      return;
    }

    // TOGGLE ON: Format current paragraph or selection as quote block in-place
    let targetBlock: HTMLElement | null = null;
    if (range) {
      let node: Node | null = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
      targetBlock = ((node as HTMLElement)?.closest?.('p, div, h1, h2, h3, h4, h5, h6, li') as HTMLElement | null) || null;
      if (targetBlock && !editorRef.current.contains(targetBlock)) targetBlock = null;
      if (targetBlock === editorRef.current) targetBlock = null;
    }

    const quoteEl = document.createElement('blockquote');
    quoteEl.id = 'writer-quote-section';
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
        editorRef.current.appendChild(quoteEl);
      }
    }

    lastToggledQuoteElRef.current = quoteEl;
    setIsQuoteActive(true);

    const pInside = quoteEl.querySelector('p') || quoteEl;
    const newRange = document.createRange();
    newRange.selectNodeContents(pInside);
    newRange.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(newRange);
    savedRangeRef.current = newRange;

    handleEditorInput();
    showToast('Quote section formatted.');
    setTimeout(updateActiveFormats, 50);
  };

  // Requirement: Toggle Code Block Section at exact cursor position
  const toggleCodeSection = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    let range: Range | null = null;
    if (sel && sel.rangeCount > 0 && editorRef.current.contains(sel.anchorNode)) {
      range = sel.getRangeAt(0);
    } else if (savedRangeRef.current && editorRef.current.contains(savedRangeRef.current.commonAncestorContainer)) {
      range = savedRangeRef.current;
    }

    // Check if cursor is currently inside a code block
    let existingCode: HTMLElement | null = null;
    if (range) {
      let node: Node | null = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
      existingCode = (node as HTMLElement)?.closest?.('pre') || null;
    }

    // If not directly inside, check last toggled code element
    if (!existingCode && lastToggledCodeElRef.current && editorRef.current.contains(lastToggledCodeElRef.current)) {
      existingCode = lastToggledCodeElRef.current;
    }

    if (existingCode) {
      // TOGGLE OFF: remove pre and restore original content as paragraph
      codeContentRef.current = existingCode.innerHTML;
      const text = existingCode.textContent?.trim() || '';
      const p = document.createElement('p');
      p.innerHTML = text ? text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>') : '<br>';

      existingCode.parentNode?.replaceChild(p, existingCode);
      lastToggledCodeElRef.current = null;
      setIsCodeActive(false);

      // Place cursor in restored paragraph
      const newRange = document.createRange();
      newRange.selectNodeContents(p);
      newRange.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(newRange);
      savedRangeRef.current = newRange;

      handleEditorInput();
      showToast('Code block removed and restored to text.');
      setTimeout(updateActiveFormats, 50);
      return;
    }

    // TOGGLE ON: Format current paragraph or selection as code block in-place
    let targetBlock: HTMLElement | null = null;
    if (range) {
      let node: Node | null = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
      targetBlock = ((node as HTMLElement)?.closest?.('p, div, h1, h2, h3, h4, h5, h6, li') as HTMLElement | null) || null;
      if (targetBlock && !editorRef.current.contains(targetBlock)) targetBlock = null;
      if (targetBlock === editorRef.current) targetBlock = null;
    }

    const codeEl = document.createElement('pre');
    codeEl.id = 'writer-code-section';
    codeEl.className = 'code-section bg-slate-50 border border-slate-200 text-slate-800 p-2.5 sm:p-3 rounded-md font-mono text-xs sm:text-sm my-3 overflow-x-auto whitespace-pre';
    codeEl.setAttribute('contenteditable', 'true');

    if (range && !range.collapsed && range.toString().trim()) {
      const fragment = range.extractContents();
      const codeTag = document.createElement('code');
      codeTag.appendChild(fragment);
      codeEl.appendChild(codeTag);
      range.insertNode(codeEl);
    } else if (targetBlock && targetBlock.parentNode) {
      const content = targetBlock.textContent?.trim() || targetBlock.innerHTML.trim() || '<br>';
      codeEl.innerHTML = `<code>${content}</code>`;
      targetBlock.parentNode.replaceChild(codeEl, targetBlock);
    } else {
      codeEl.innerHTML = '<code><br></code>';
      if (range) {
        range.insertNode(codeEl);
      } else {
        editorRef.current.appendChild(codeEl);
      }
    }

    lastToggledCodeElRef.current = codeEl;
    setIsCodeActive(true);

    const codeInside = codeEl.querySelector('code') || codeEl;
    const newRange = document.createRange();
    newRange.selectNodeContents(codeInside);
    newRange.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(newRange);
    savedRangeRef.current = newRange;

    handleEditorInput();
    showToast('Code block formatted.');
    setTimeout(updateActiveFormats, 50);
  };

  // Requirement 6: Numbered and Bullet List toggle functions & selection handling
  const applyListFormatting = (listType: 'ol' | 'ul') => {
    if (!editorRef.current) return;
    const sel = ensureEditorSelection();

    if (!sel || sel.rangeCount === 0) {
      const listTag = listType === 'ol' ? 'ol' : 'ul';
      const fallbackHtml = `<${listTag} class="${listType === 'ol' ? 'editor-ordered-list' : 'editor-unordered-list'}"><li>Numbered item</li></${listTag}><p><br></p>`;
      document.execCommand('insertHTML', false, fallbackHtml);
      handleEditorInput();
      setTimeout(updateActiveFormats, 50);
      return;
    }

    const range = sel.getRangeAt(0);
    let node: Node | null = range.startContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
    const currentLi = (node as HTMLElement)?.closest?.('li');
    const currentList = currentLi?.parentElement;

    if (currentList) {
      const currentTag = currentList.tagName.toLowerCase();
      if (currentTag === listType) {
        // Toggle OFF: convert li back to paragraph
        document.execCommand(listType === 'ol' ? 'insertOrderedList' : 'insertUnorderedList', false);
        // Fallback if not unwrapped by execCommand
        if (currentLi && currentLi.parentElement) {
          const p = document.createElement('p');
          p.innerHTML = currentLi.innerHTML || '<br>';
          currentLi.replaceWith(p);
          if (currentList.children.length === 0) currentList.remove();
        }
      } else {
        // Switch between ol and ul
        const newList = document.createElement(listType);
        newList.className = listType === 'ol' ? 'editor-ordered-list' : 'editor-unordered-list';
        newList.innerHTML = currentList.innerHTML;
        currentList.replaceWith(newList);
      }
      handleEditorInput();
      setTimeout(updateActiveFormats, 50);
      return;
    }

    // Direct conversion of selected word or entire paragraph:
    let parentBlock = range.commonAncestorContainer as HTMLElement;
    if (parentBlock.nodeType === Node.TEXT_NODE) parentBlock = parentBlock.parentElement as HTMLElement;
    while (parentBlock && parentBlock !== editorRef.current && !['P', 'DIV', 'H1', 'H2', 'H3'].includes(parentBlock.tagName)) {
      parentBlock = parentBlock.parentElement as HTMLElement;
    }

    const selectedText = range.toString().trim();

    if (parentBlock && parentBlock !== editorRef.current && (parentBlock.tagName === 'P' || parentBlock.tagName === 'DIV')) {
      const list = document.createElement(listType);
      list.className = listType === 'ol' ? 'editor-ordered-list' : 'editor-unordered-list';
      const li = document.createElement('li');
      li.innerHTML = parentBlock.innerHTML || '<br>';
      list.appendChild(li);
      parentBlock.replaceWith(list);
    } else if (selectedText) {
      const list = document.createElement(listType);
      list.className = listType === 'ol' ? 'editor-ordered-list' : 'editor-unordered-list';
      const li = document.createElement('li');
      li.textContent = selectedText;
      list.appendChild(li);
      range.deleteContents();
      range.insertNode(list);
    } else {
      const command = listType === 'ol' ? 'insertOrderedList' : 'insertUnorderedList';
      document.execCommand(command, false);
    }

    handleEditorInput();
    setTimeout(updateActiveFormats, 50);
  };

  const toggleOrderedList = () => applyListFormatting('ol');
  const toggleUnorderedList = () => applyListFormatting('ul');

  // List Enter & Double Enter Handling (Pressing Enter creates next list item, double enter exits list)
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        let node: Node | null = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        const li = (node as HTMLElement)?.closest?.('li');
        if (li && (li.textContent === '' || li.textContent === '\n') && li.parentElement) {
          e.preventDefault();
          const parentList = li.parentElement;
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          if (parentList.nextSibling) {
            parentList.parentNode?.insertBefore(p, parentList.nextSibling);
          } else {
            parentList.parentNode?.appendChild(p);
          }
          li.remove();
          if (parentList.children.length === 0) {
            parentList.remove();
          }
          const newRange = document.createRange();
          newRange.setStart(p, 0);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
          handleEditorInput();
          setTimeout(updateActiveFormats, 50);
          return;
        }
      }
    }
    setTimeout(updateActiveFormats, 50);
  };

  // Image & Link selection inside editor
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // Ignore clicks inside the floating toolbar or open modals
    if (target.closest('.floating-image-toolbar') || target.closest('[role="dialog"]')) {
      return;
    }

    // Requirement 1: Link Redirection when clicking anchor tag
    const anchor = target.closest('a') as HTMLAnchorElement | null;
    if (anchor && editorRef.current?.contains(anchor)) {
      const href = anchor.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        const targetAttr = anchor.getAttribute('target') || '_blank';
        window.open(href, targetAttr, 'noopener,noreferrer');
        showToast(`Redirecting to ${href}...`, 'success');
        return;
      }
    }

    const figure = target.closest('figure.article-image-figure') as HTMLElement | null;

    if (figure && editorRef.current?.contains(figure)) {
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

      setSelectedImageProps({
        src: img?.getAttribute('src') || '',
        alt: img?.getAttribute('alt') || '',
        caption: parsedCaption,
        credit: cleanCredit,
        size,
        alignment: align,
      });

      const figRect = figure.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      setToolbarPosition({
        top: Math.max(10, figRect.top - editorRect.top - 48),
        left: Math.max(10, figRect.left - editorRect.left + figRect.width / 2 - 180),
      });
    } else {
      setSelectedImageFigure(null);
      setToolbarPosition(null);
      setSelectedImageProps(null);
    }
    updateActiveFormats();
  };

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

  const handleDeleteSelectedImage = () => {
    if (!selectedImageFigure) return;
    selectedImageFigure.remove();
    setSelectedImageFigure(null);
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

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const rawVal = e.currentTarget ? e.currentTarget.value : tagInput;
      const trimmed = (rawVal || '').trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        if (tags.length >= 10) {
          showToast('Maximum 10 tags allowed.', 'warning');
          return;
        }
        setTags((prev) => [...prev, trimmed]);
        setTagInput('');
        if (e.currentTarget) e.currentTarget.value = '';
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      // Allow backspace to pop last tag back into input for quick editing
      const lastTag = tags[tags.length - 1];
      setTags((prev) => prev.slice(0, -1));
      setTagInput(lastTag);
    }
  };

  const handleTagBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawVal = e.currentTarget ? e.currentTarget.value : tagInput;
    const trimmed = (rawVal || '').trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      if (tags.length < 10) {
        setTags((prev) => [...prev, trimmed]);
        setTagInput('');
        if (e.currentTarget) e.currentTarget.value = '';
      }
    }
  };

  const handleEditTag = (tagToEdit: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToEdit));
    setTagInput(tagToEdit);
    setTimeout(() => {
      tagInputRef.current?.focus();
    }, 50);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

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

  const handleInsertImageIntoEditor = () => {
    const finalUrl = modalImageUrl.trim();
    if (!finalUrl) {
      showToast('Please provide an image URL or choose a file.', 'error');
      return;
    }

    let sizeClass = 'max-w-[450px] w-full';
    if (imageSize === 'small') {
      sizeClass = 'max-w-[250px] w-full';
    } else if (imageSize === 'full') {
      sizeClass = 'w-full max-w-none';
    }

    let alignClass = 'my-6 block clear-both mx-auto text-center';
    if (imageAlignment === 'left') {
      alignClass = 'float-left mr-6 mb-4 my-2 text-left';
    } else if (imageAlignment === 'right') {
      alignClass = 'float-right ml-6 mb-4 my-2 text-right';
    } else if (imageAlignment === 'no_wrap') {
      alignClass = 'my-6 block clear-both text-left';
    }

    const captionSafe = imageCaption.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const rawCredit = imageCredit.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Format credit cleanly: e.g. "122445" -> "(PHOTO: 122445)"
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

    const altSafe = (captionSafe || imageKeywords.join(', ') || title.trim() || 'Article Image').replace(/"/g, '&quot;');

    const captionMarkup = (captionSafe || formattedCredit)
      ? `<figcaption class="flex items-center justify-between text-xs text-slate-500 mt-2 px-0.5 w-full font-sans">
          <span class="image-caption text-left text-slate-600 italic font-normal">${captionSafe}</span>
          <span class="image-credit text-right text-slate-400 font-medium tracking-wide">${formattedCredit}</span>
        </figcaption>`
      : '';

    const targetFigure =
      editingImageFigureRef.current ||
      (editingImageIdRef.current && editorRef.current?.querySelector(`figure[data-image-id="${editingImageIdRef.current}"]`) as HTMLElement | null) ||
      (selectedImageFigure && editorRef.current?.contains(selectedImageFigure) ? selectedImageFigure : null);

    if (targetFigure && editorRef.current?.contains(targetFigure)) {
      targetFigure.dataset.size = imageSize;
      targetFigure.dataset.align = imageAlignment;
      targetFigure.className = `article-image-figure group relative cursor-pointer ${alignClass} ${sizeClass} select-none`;
      const img = targetFigure.querySelector('img');
      if (img) {
        img.src = finalUrl;
        img.alt = altSafe;
      }
      const figcaption = targetFigure.querySelector('figcaption');
      if (figcaption) {
        if (captionMarkup) {
          figcaption.className = 'flex items-center justify-between text-xs text-slate-500 mt-2 px-0.5 w-full font-sans';
          figcaption.innerHTML = `
            <span class="image-caption text-left text-slate-600 italic font-normal">${captionSafe}</span>
            <span class="image-credit text-right text-slate-400 font-medium tracking-wide">${formattedCredit}</span>
          `;
        } else {
          figcaption.remove();
        }
      } else if (captionMarkup) {
        targetFigure.insertAdjacentHTML('beforeend', captionMarkup);
      }

      if (!featuredImageUrl || (selectedImageProps && featuredImageUrl === selectedImageProps.src)) {
        setFeaturedImageUrl(finalUrl);
      }

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
      setShowImageModal(false);
      showToast('Image updated successfully in place!', 'success');
      return;
    }

    const newImageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const figureMarkup = `
      <figure class="article-image-figure group relative cursor-pointer ${alignClass} ${sizeClass} select-none" data-image-id="${newImageId}" data-size="${imageSize}" data-align="${imageAlignment}" contenteditable="false">
        <img src="${finalUrl}" alt="${altSafe}" class="rounded-xl w-full h-auto object-cover shadow-sm border border-slate-200 pointer-events-none" />
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

    editingImageFigureRef.current = null;
    editingImageIdRef.current = null;
    setShowImageModal(false);
    setModalImageUrl('');
    setUploadedFileName('');
    setImageKeywords([]);
    setImageCaption('');
    setImageCredit('');
    showToast('Image inserted into article body!', 'success');
  };

  const handleAutoGenerateSEO = () => {
    const descriptionSource =
      subtitle.trim() ||
      (editorRef.current ? extractPlainTextFromHtml(editorRef.current.innerHTML) : extractPlainTextFromHtml(htmlContent));

    if (!title.trim() && !descriptionSource) {
      showToast('Please enter an article title or description first before generating SEO.', 'error');
      return;
    }

    setIsGeneratingSeo(true);

    const generatedKeyword = generateFocusKeyword(title, descriptionSource);
    const generatedSummary = generateCardSummary(descriptionSource, title);
    const generatedMetaDesc = generateMetaDescription(descriptionSource, title);

    setFocusKeyword(generatedKeyword);
    setCardSummary(generatedSummary);
    setMetaDescription(generatedMetaDesc);
    setSuggestedKeywords(generateFocusKeywordsList(title, descriptionSource));
    setMetaTitle(title.trim() ? `${title.trim()} | Washington Times` : 'Article | Washington Times');

    // Reset manual edit tracking so user gets fresh auto-synced values
    setIsCardSummaryEdited(false);
    setIsFocusKeywordEdited(false);
    setIsMetaDescriptionEdited(false);

    setTimeout(() => {
      setIsGeneratingSeo(false);
      showToast('SEO fields auto-generated successfully!', 'success');
    }, 400);
  };

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
          authorName: authorName.trim(),
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
        authorName: authorName.trim() || user?.name || 'Staff Contributor',
        readTime: readDuration,
        tags,
        subCategories: selectedSubCategories,
        cardSummary: cardSummary.trim(),
        focusKeyword: focusKeyword.trim(),
        metaDescription: metaDescription.trim(),
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
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `?id=${data.article.dbId}`);
          }
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
        authorName: authorName.trim() || user?.name || 'Staff Contributor',
        readTime: readDuration,
        tags,
        subCategories: selectedSubCategories,
        cardSummary: cardSummary.trim(),
        focusKeyword: focusKeyword.trim(),
        metaDescription: metaDescription.trim(),
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
          router.push('/dashboard/writer?tab=pending_review');
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#EA580C] selection:text-white">
      
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

      {/* 1. TOP STICKY DARK NAV BAR matching Reference Image 1 */}
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

      {/* 2. MAIN 2-COLUMN ARTICLE EDITOR AREA (Clean White Canvas) */}
      <main className="w-full max-w-[1680px] mx-auto px-3 sm:px-4 lg:px-6 py-5 sm:py-7 flex-1">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-start justify-center relative">

          {/* Left Column: First Box (Article Editor Canvas) - FIXED SIZE AND POSITION (Never resizes on toggle) */}
          <div className="w-full lg:w-[860px] xl:w-[940px] 2xl:w-[980px] shrink-0 flex flex-col gap-5 relative">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5 min-h-[920px] lg:min-h-[960px] relative text-slate-800">
              
              {/* Toggle Article Settings Button (Exact matching Reference Image 1 marking 1) */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                aria-expanded={!sidebarCollapsed}
                aria-controls="article-settings-sidebar"
                className={`absolute top-5 w-8 h-8 bg-white border border-slate-300 hover:border-slate-400 rounded-lg shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all cursor-pointer z-30 ${
                  sidebarCollapsed ? 'right-4' : '-right-4'
                }`}
                title={sidebarCollapsed ? 'Open Article Settings' : 'Hide Article Settings'}
                aria-label="Toggle Article Settings"
              >
                {!sidebarCollapsed ? (
                  <PanelRightClose className="w-4 h-4 text-slate-700" />
                ) : (
                  <PanelRightOpen className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {/* HORIZONTAL RICH TEXT TOOLBAR matching Reference Image 1 & 2 */}
              <div className="sticky top-[58px] z-20 flex flex-wrap items-center gap-1 sm:gap-1.5 p-2 bg-slate-50/98 backdrop-blur-xs border border-slate-200/90 rounded-xl text-slate-600 shadow-xs">
                
                {/* Group 1: Undo & Redo */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeFormatting('undo')}
                  title="Undo"
                  className="p-1.5 hover:bg-white hover:text-slate-900 rounded-md transition-colors cursor-pointer"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeFormatting('redo')}
                  title="Redo"
                  className="p-1.5 hover:bg-white hover:text-slate-900 rounded-md transition-colors cursor-pointer"
                >
                  <Redo2 className="w-4 h-4" />
                </button>

                {/* Divider */}
                <span className="w-[1px] h-4 bg-slate-300 mx-1 select-none" />

                {/* Group 2: B, I, U (Strikethrough, Subscript, Superscript removed per Requirement 3) */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeFormatting('bold')}
                  title="Bold"
                  className={`p-1.5 rounded-md transition-colors font-bold cursor-pointer ${
                    activeFormats.bold ? 'bg-slate-200 text-[#1642D0] shadow-2xs' : 'hover:bg-white hover:text-slate-900 text-slate-600'
                  }`}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeFormatting('italic')}
                  title="Italic"
                  className={`p-1.5 rounded-md transition-colors italic cursor-pointer ${
                    activeFormats.italic ? 'bg-slate-200 text-[#1642D0] shadow-2xs' : 'hover:bg-white hover:text-slate-900 text-slate-600'
                  }`}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executeFormatting('underline')}
                  title="Underline"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    activeFormats.underline ? 'bg-slate-200 text-[#1642D0] shadow-2xs' : 'hover:bg-white hover:text-slate-900 text-slate-600'
                  }`}
                >
                  <UnderlineIcon className="w-4 h-4" />
                </button>

                {/* Divider */}
                <span className="w-[1px] h-4 bg-slate-300 mx-1 select-none" />

                {/* Group 3: Link & Lists (Numbered & Bulleted Lists per Requirement 6) */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={openLinkModal}
                  title="Insert or Edit Link"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    activeFormats.link ? 'bg-slate-200 text-[#1642D0] shadow-2xs' : 'hover:bg-white hover:text-slate-900 text-slate-600'
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={toggleUnorderedList}
                  title="Bulleted List"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    activeFormats.insertUnorderedList ? 'bg-slate-200 text-[#1642D0] shadow-2xs' : 'hover:bg-white hover:text-slate-900 text-slate-600'
                  }`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={toggleOrderedList}
                  title="Numbered List"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    activeFormats.insertOrderedList ? 'bg-slate-200 text-[#1642D0] shadow-2xs' : 'hover:bg-white hover:text-slate-900 text-slate-600'
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                {/* Divider */}
                <span className="w-[1px] h-4 bg-slate-300 mx-1 select-none" />

                {/* Group 4: Toggle Quote Section (3rd Icon) & Toggle Code Section (4th Icon) */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={toggleQuoteSection}
                  title="Toggle Quote Section"
                  aria-pressed={isQuoteActive}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    isQuoteActive ? 'bg-slate-200 text-[#1642D0] shadow-2xs font-bold' : 'hover:bg-white hover:text-slate-900 text-slate-600'
                  }`}
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={toggleCodeSection}
                  title="Toggle Code Section"
                  aria-pressed={isCodeActive}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    isCodeActive ? 'bg-slate-200 text-[#1642D0] shadow-2xs font-bold' : 'hover:bg-white hover:text-slate-900 text-slate-600'
                  }`}
                >
                  <Code className="w-4 h-4" />
                </button>

                {/* Divider */}
                <span className="w-[1px] h-4 bg-slate-300 mx-1 select-none" />

                {/* Group 5: INSERT IMAGE (Cream/Orange Accent Button matching Reference Image 1) */}
                <button
                  type="button"
                  data-testid="toolbar-insert-image-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    saveSelectionRange();
                    setSelectedImageFigure(null);
                    setModalImageUrl('/images/writer-reference-book.png');
                    setImageCaption('apple');
                    setImageCredit('122445');
                    setShowImageModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF7ED] border border-[#FFEDD5] hover:bg-[#FFEDD5] text-[#EA580C] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                >
                  <ImageIcon className="w-4 h-4 text-[#EA580C]" />
                  <span>Insert Image</span>
                </button>

              </div>

              {/* Title Field: "Add Title..." in large bold serif font with automatic word-wrapping */}
              <div>
                <textarea
                  ref={titleTextareaRef}
                  rows={1}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    autoResizeTextarea(e.target);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      subtitleTextareaRef.current?.focus();
                    }
                  }}
                  placeholder="Add Title..."
                  className="w-full text-3xl sm:text-4xl font-serif font-bold text-slate-900 placeholder:text-slate-300 border-none outline-none focus:ring-0 px-0 py-1 bg-transparent resize-none overflow-hidden block"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Subheading Field: "Add Subheading / Deck..." in italic serif font with automatic word-wrapping */}
              <div>
                <textarea
                  ref={subtitleTextareaRef}
                  rows={1}
                  value={subtitle}
                  onChange={(e) => {
                    setSubtitle(e.target.value);
                    autoResizeTextarea(e.target);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      editorRef.current?.focus();
                    }
                  }}
                  placeholder="Add Subheading / Deck..."
                  className="w-full text-lg sm:text-xl font-serif italic text-slate-700 placeholder:text-slate-300 border-none outline-none focus:ring-0 px-0 py-1 bg-transparent resize-none overflow-hidden block"
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
                
                {/* Floating Image Toolbar matching Reference Image 4 */}
                {selectedImageFigure && toolbarPosition && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ top: `${toolbarPosition.top}px`, left: `${toolbarPosition.left}px` }}
                    className="floating-image-toolbar absolute z-30 bg-[#0B132B] text-white px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in duration-150"
                  >
                    {/* Edit Image Button */}
                    <button
                      type="button"
                      data-testid="floating-edit-image-btn"
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
                  <div className="absolute top-2 left-0 text-base text-slate-300 pointer-events-none select-none font-sans">
                    Start writing or type / for plugins
                  </div>
                )}
                
                <div
                  ref={editorRef}
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
                  onKeyDown={handleEditorKeyDown}
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

              {/* Bottom Tags Bar matching Screenshot 1 */}
              {tags.length > 0 && (
                <div
                  data-testid="editor-bottom-tags-bar"
                  className="px-6 sm:px-8 py-3.5 border-t border-slate-100 flex items-center flex-wrap gap-2.5 bg-slate-50/60 rounded-b-2xl"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none mr-0.5">
                    TAGS:
                  </span>
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors uppercase tracking-wide select-none"
                    >
                      #{t.replace(/^#/, '')}
                    </span>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Second Box (Article Settings Sidebar) - NARROWER WIDTH & INCREASED HEIGHT */}
          {!sidebarCollapsed && (
            <aside
              id="article-settings-sidebar"
              className="w-full lg:w-[320px] xl:w-[335px] shrink-0 relative bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col gap-4 sticky top-20 transition-all duration-300 text-slate-800 min-h-[920px] lg:min-h-[960px] self-start animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Sidebar Header: ⚙️ ARTICLE SETTINGS */}
              <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2.5">
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
                  className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer uppercase tracking-wider ${
                    activeSidebarTab === 'details'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSidebarTab('seo')}
                  className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer uppercase tracking-wider ${
                    activeSidebarTab === 'seo'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  SEO
                </button>
              </div>

              {/* DETAILS TAB CONTENT */}
              {activeSidebarTab === 'details' && (
                <div className="flex flex-col gap-4">
                  
                  {/* 1. SELECT CATEGORY (MAIN) - Collapsible Section */}
                  <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setIsMainCatExpanded((prev) => !prev)}
                      aria-expanded={isMainCatExpanded}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors text-left cursor-pointer"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Select Category (Main)
                      </span>
                      {isMainCatExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    {isMainCatExpanded && (
                      <div className="p-3 pt-2 border-t border-slate-100 bg-white">
                        <div className="relative">
                          <select
                            value={activeMainCatObj.name}
                            onChange={(e) => {
                              const newCat = e.target.value;
                              setMainCategory(newCat);
                              const targetCat = MAIN_CATEGORIES.find((c) => c.name === newCat);
                              const validSubs = targetCat ? targetCat.subcategories.map((s) => s.name) : [];
                              setSelectedSubCategories((prev) =>
                                prev.filter((s) => validSubs.includes(s))
                              );
                            }}
                            className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#1642D0] cursor-pointer"
                          >
                            {MAIN_CATEGORIES.map((cat) => (
                              <option key={cat.id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. SELECT SUB-CATEGORIES (OPTIONAL) & METADATA - Collapsible Section */}
                  <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setIsSubCatExpanded((prev) => !prev)}
                      aria-expanded={isSubCatExpanded}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                          Select Sub-Categories (Optional)
                        </span>
                        {selectedSubCategories.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#1642D0]">
                            {selectedSubCategories.length}/5
                          </span>
                        )}
                      </div>
                      {isSubCatExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    {isSubCatExpanded && (
                      <div className="p-3.5 pt-2 border-t border-slate-100 bg-white flex flex-col gap-4">
                        {/* 2-Column Checkbox Grid */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                          {currentSubcategories.length === 0 ? (
                            <p className="col-span-2 text-center text-xs text-slate-400 py-3">
                              No sub-categories available for this category.
                            </p>
                          ) : (
                            currentSubcategories.map((sub) => {
                              const isChecked = selectedSubCategories.includes(sub.name);
                              return (
                                <label
                                  key={sub.name}
                                  className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none hover:text-slate-900"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleSubCategory(sub.name)}
                                    className="w-4 h-4 rounded border-slate-300 text-[#1642D0] focus:ring-[#1642D0]/30 cursor-pointer"
                                  />
                                  <span className="truncate" title={sub.name}>{sub.name}</span>
                                </label>
                              );
                            })
                          )}
                        </div>

                        {/* Counter: SELECTED: X / 5 */}
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Selected: {selectedSubCategories.length} / 5
                        </div>

                        {/* 3. TAGS matching Screenshot 1 */}
                        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Tags
                          </label>

                          {/* Bordered Tags Container Box with dark navy pills & inline input */}
                          <div
                            onClick={() => tagInputRef.current?.focus()}
                            className="w-full min-h-[50px] p-2 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center gap-1.5 focus-within:border-[#1642D0] focus-within:ring-2 focus-within:ring-[#1642D0]/10 transition-all cursor-text"
                          >
                            {tags.map((t) => (
                              <span
                                key={t}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0F172A] text-white rounded-md text-xs font-bold uppercase tracking-wide group select-none shadow-xs"
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTag(t);
                                  }}
                                  className="cursor-pointer hover:underline"
                                  title="Click to edit tag"
                                >
                                  #{t.replace(/^#/, '')}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTag(t);
                                  }}
                                  className="text-slate-300 hover:text-white hover:bg-slate-700 rounded-full p-0.5 transition-colors cursor-pointer"
                                  title="Remove tag"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}

                            <input
                              ref={tagInputRef}
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleTagKeyDown}
                              onBlur={handleTagBlur}
                              placeholder="Add more tags..."
                              className="flex-1 min-w-[120px] bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none py-1 px-1 border-none"
                            />
                          </div>

                          {/* Helper Text matching Screenshot 1 */}
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Press Enter or Comma to Add • Click Tag to Remove • {tags.length} Tags
                          </div>
                        </div>

                        {/* 4. READ DURATION */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
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

                        {/* 5. AUTHOR / WRITER */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Author / Writer
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              placeholder="Writer Account"
                                suppressHydrationWarning
                              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#1642D0]"
                            />
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* SEO TAB CONTENT */}
              {activeSidebarTab === 'seo' && (
                <div className="flex flex-col gap-5">
                  
                  {/* AUTO-GENERATE SEO Button */}
                  <button
                    type="button"
                    onClick={handleAutoGenerateSEO}
                    disabled={isGeneratingSeo}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGeneratingSeo ? 'Generating SEO...' : 'Auto-Generate SEO'}</span>
                  </button>

                  <p className="text-[11px] text-slate-500 leading-normal -mt-2">
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
                      onChange={(e) => {
                        setCardSummary(e.target.value);
                        setIsCardSummaryEdited(true);
                      }}
                      placeholder="Concise 1-2 sentence preview details."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1642D0] resize-y"
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
                      onChange={(e) => {
                        setFocusKeyword(e.target.value);
                        setIsFocusKeywordEdited(true);
                      }}
                      placeholder="e.g. Search Results"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1642D0]"
                    />

                    {/* Status Indicators matching Reference Screenshot 2 */}
                    <div className="flex flex-col gap-1.5 mt-1">
                      {/* 1. Title includes focus keyword */}
                      <div className="flex items-start gap-1.5 text-[11px] leading-tight">
                        {focusKeyword.trim() && isTitleKeywordMatch ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-emerald-600 font-medium">The title includes the focus keyword.</span>
                          </>
                        ) : (
                          <>
                            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-slate-500 font-medium">The title does not include the focus keyword.</span>
                          </>
                        )}
                      </div>

                      {/* 2. Meta description includes focus keyword */}
                      <div className="flex items-start gap-1.5 text-[11px] leading-tight">
                        {focusKeyword.trim() && isMetaDescKeywordMatch ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
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

                  {/* 3. META DESCRIPTION (with 0/160 character counter) */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Meta Description
                      </label>
                      <span
                        className={`text-[10px] font-bold tracking-wider ${
                          metaDescription.length > 160 ? 'text-red-500' : 'text-slate-400'
                        }`}
                      >
                        {metaDescription.length}/160
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={metaDescription}
                      onChange={(e) => {
                        setMetaDescription(e.target.value);
                        setIsMetaDescriptionEdited(true);
                      }}
                      placeholder="Concise 1-2 sentence preview details."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1642D0] resize-y"
                    />
                  </div>

                  {/* 4. PREVIEW IN SEARCH RESULTS (Google Snippet Card) */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5" />
                        <span>Preview in Search Results</span>
                      </div>

                      {/* Three-dot menu button with functional actions */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPreviewMenu(!showPreviewMenu)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Preview options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {showPreviewMenu && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`${metaTitle || title.trim() || 'Your Article Title'} | Washington Times\nhttps://washington-times.com/article/${currentSlug}`);
                                showToast('Search snippet copied to clipboard!', 'success');
                                setShowPreviewMenu(false);
                              }}
                              className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy Snippet</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleAutoGenerateSEO();
                                setShowPreviewMenu(false);
                              }}
                              className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                              <span>Regenerate SEO</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCardSummaryEdited(false);
                                setIsFocusKeywordEdited(false);
                                setIsMetaDescriptionEdited(false);
                                showToast('Manual SEO overrides reset.', 'success');
                                setShowPreviewMenu(false);
                              }}
                              className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                              <span>Reset Overrides</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#0B132B] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                          WT
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-slate-900 leading-none">
                            Washington Times
                          </span>
                          <span className="text-[10px] text-slate-500 truncate leading-none mt-1">
                            washington-times.com &rsaquo; arti..
                          </span>
                        </div>
                      </div>

                      <div className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-tight truncate">
                        {metaTitle || (title.trim() ? `${title.trim()} | Washington Times` : 'Your Article Title |...')}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {metaDescription ||
                          cardSummary ||
                          'Add a meta description to control the snippet shown in search results.'}
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </aside>
          )}

        </div>
      </main>

      {/* 3. INSERT / EDIT ARTICLE IMAGE POPUP MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 my-8 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#EA580C]" />
                <h3 className="text-base font-serif font-bold text-slate-900">
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

            {/* PASTE IMAGE URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Paste Image URL
              </label>
              <input
                type="text"
                value={modalImageUrl}
                onChange={(e) => setModalImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1642D0]"
              />
            </div>

            {/* Divider: OR UPLOAD FILE */}
            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
                Or Upload File
              </span>
            </div>

            {/* CHOOSE COMPUTER FILE */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
                className="w-full py-2.5 px-3.5 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-[#1642D0] cursor-pointer flex items-center justify-between text-xs text-slate-600 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs shrink-0">
                    Choose file
                  </span>
                  <span className="text-slate-500 truncate text-xs">
                    {uploadedFileName || 'No file chosen'}
                  </span>
                </div>
                <Upload className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Quick Picks */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
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
                    className="text-[11px] font-medium text-slate-600 hover:text-[#EA580C] bg-slate-100 hover:bg-orange-50 px-2 py-0.5 rounded border border-slate-200 shrink-0 cursor-pointer transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* IMAGE SEO KEYWORDS HIGHLIGHTED CARD */}
            <div className="bg-[#FFFDF7] border border-[#FED7AA] rounded-xl p-3.5 flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Image SEO Keywords (Max 4 Keywords)</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                  {imageKeywords.length} / 4 Keywords
                </span>
              </div>

              <input
                type="text"
                value={imageKeywordInput}
                onChange={(e) => setImageKeywordInput(e.target.value)}
                onKeyDown={handleImageKeywordKeyDown}
                placeholder="e.g. Donald Trump, White House, Election 2026"
                className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#EA580C]"
              />

              {imageKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
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

              <div className="text-[11px] text-amber-800/80 font-medium flex items-center gap-1.5">
                <span>💡</span>
                <span>Type keyword and press Enter or comma (,) to add. Maximum 4 keywords per image.</span>
              </div>
            </div>

            {/* Image Caption */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Image Caption (Visible under picture to readers)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="e.g. apple"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1642D0]"
              />
            </div>

            {/* Image Credit / Source (Optional) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Image Credit / Source (e.g. 122445 or Reuters)
              </label>
              <input
                type="text"
                value={imageCredit}
                onChange={(e) => setImageCredit(e.target.value)}
                placeholder="e.g. 122445"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1642D0]"
              />
            </div>

            {/* TWO-COLUMN ROW: IMAGE SIZE & POSITION ALIGNMENT */}
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
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EA580C] rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-between cursor-pointer focus:outline-hidden"
                >
                  <span>
                    {imageSize === 'small' && 'Small (Width: 250px)'}
                    {imageSize === 'medium' && 'Medium (Width: 450px)'}
                    {imageSize === 'full' && 'Full-Width (100%)'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {sizeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setImageSize('small');
                        setSizeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer ${
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
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer ${
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
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer ${
                        imageSize === 'full' ? 'bg-[#1642D0] text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
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
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-between cursor-pointer focus:outline-hidden"
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
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setImageAlignment('center');
                        setAlignDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-2 ${
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
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-2 ${
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
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-2 ${
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
                      className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-2 ${
                        imageAlignment === 'no_wrap' ? 'bg-[#1642D0] text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>No Wrap</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* MODAL FOOTER BUTTONS: CANCEL and + INSERT IMAGE */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
              <button
                type="button"
                onClick={() => {
                  editingImageFigureRef.current = null;
                  editingImageIdRef.current = null;
                  setShowImageModal(false);
                }}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                data-testid="modal-submit-image-btn"
                onClick={handleInsertImageIntoEditor}
                className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>+</span>
                <span>{selectedImageFigure || editingImageFigureRef.current ? 'Update Image' : 'Insert Image'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. LIVE ARTICLE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 shadow-2xl flex flex-col gap-6 my-8 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#EA580C]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Live Article Preview
                </span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Headline Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-[13px] font-sans font-bold uppercase tracking-wider text-[#1642D0]">
                <span>{mainCategory}</span>
                {selectedSubCategories.length > 0 && (
                  <span className="text-slate-400 font-normal">&bull; {selectedSubCategories.join(', ')}</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#1642D0] leading-[1.14] tracking-tight">
                {title.trim() || 'Untitled Article Headline'}
              </h1>

              {subtitle.trim() && (
                <p className="text-[#0f2b82] text-base sm:text-lg lg:text-[18.5px] font-serif font-bold leading-relaxed pt-1">
                  {subtitle}
                </p>
              )}

              {/* Horizontal Line Above Byline */}
              <div className="border-t border-slate-200 mt-2 mb-1" />

              {/* Byline with Author Name, Avatar, Date, Read Duration, and Bookmark */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden shrink-0">
                    {(authorName.trim() || user?.name) ? (
                      <span className="uppercase text-[#1642D0]">
                        {(authorName.trim() || user?.name || 'W').charAt(0)}
                      </span>
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-xs sm:text-[13px] font-sans font-bold uppercase tracking-wider text-slate-800">
                      <span className="text-slate-600 font-bold">BY</span>
                      <span className="text-[#1642D0] font-bold">
                        {authorName.trim() || user?.name || 'Sherin Shibu'}
                      </span>
                      <span className="text-slate-300 font-normal">|</span>
                      <span className="text-slate-500 font-normal">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-slate-300 font-normal">&bull;</span>
                      <span className="text-slate-500 font-normal">{readDuration}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Staff Contributor &bull; Verified Author
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                  <Bookmark className="w-4 h-4 text-slate-700" />
                </div>
              </div>

              {/* Action Bar (Listen to this post, SHARE, COMMENT) */}
              <div className="flex items-center justify-between pt-2 pb-2 border-y border-slate-100 mb-1">
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-2 border border-slate-200 rounded-full bg-white px-3.5 py-1.5 shadow-xs">
                    <div className="w-5 h-5 rounded-full bg-[#10182b] flex items-center justify-center text-white text-[9px] shrink-0">
                      ▶
                    </div>
                    <span className="font-sans font-semibold text-xs text-[#10182b]">
                      Listen to this post
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 tracking-wider font-sans uppercase py-1.5 px-2.5 rounded-md hover:bg-slate-100 cursor-pointer">
                    <span>SHARE</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 tracking-wider font-sans uppercase">
                  <svg className="w-3.5 h-3.5 fill-slate-600 shrink-0" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                  <span>COMMENT</span>
                </div>
              </div>
            </div>

            {/* Featured Image if assigned */}
            {featuredImageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <img src={featuredImageUrl} alt={title} className="w-full h-80 sm:h-96 object-cover" />
              </div>
            )}

            {/* Rendered HTML Content */}
            <div
              className="prose prose-slate max-w-none text-slate-800 text-base leading-relaxed break-words"
              dangerouslySetInnerHTML={{
                __html:
                  editorRef.current?.innerHTML ||
                  htmlContent ||
                  '<p class="text-slate-400 italic">No article body written yet.</p>',
              }}
            />

            {/* Tag pills matching Screenshot 1 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none mr-1">
                  Tags:
                </span>
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 bg-slate-100 uppercase tracking-wide"
                  >
                    #{t.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
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

      {/* LINK INSERTION & EDITING MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[#1642D0]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  {currentLinkElement ? 'Edit Hyperlink' : 'Insert Hyperlink'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Display Text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Text to Display
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Clickable link text"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#1642D0]"
                />
              </div>

              {/* Destination URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Link URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#1642D0]"
                />
                <span className="text-[10px] text-slate-400">
                  Valid protocols: https://, http://, mailto: (https:// prepended by default)
                </span>
              </div>

              {/* Open in new tab toggle */}
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={linkOpenNewTab}
                  onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#1642D0] focus:ring-[#1642D0]/30 cursor-pointer"
                />
                <span>Open link in new browser tab</span>
              </label>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                {currentLinkElement ? (
                  <button
                    type="button"
                    onClick={handleRemoveLink}
                    className="px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Remove Link
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyLink}
                    className="px-4 py-2 bg-[#1642D0] hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    {currentLinkElement ? 'Update Link' : 'Insert Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global list & link styling for editor and preview */}
      <style jsx global>{`
        .article-editor-canvas ol,
        .prose ol {
          list-style-type: decimal !important;
          margin: 0.75rem 0 !important;
          padding-left: 1.75rem !important;
        }
        .article-editor-canvas ol li,
        .prose ol li {
          list-style-type: decimal !important;
          display: list-item !important;
          margin-bottom: 0.35rem !important;
          padding-left: 0.25rem !important;
        }
        .article-editor-canvas ul,
        .prose ul {
          list-style-type: disc !important;
          margin: 0.75rem 0 !important;
          padding-left: 1.75rem !important;
        }
        .article-editor-canvas ul li,
        .prose ul li {
          list-style-type: disc !important;
          display: list-item !important;
          margin-bottom: 0.35rem !important;
          padding-left: 0.25rem !important;
        }
        .article-editor-canvas a,
        .prose a {
          color: #2563eb !important;
          text-decoration: underline !important;
          cursor: pointer !important;
        }
      `}</style>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileSettingsModal}
        onClose={() => setShowProfileSettingsModal(false)}
      />

    </div>
  );
}

export default function WriterEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WriterEditorMain />
    </Suspense>
  );
}
