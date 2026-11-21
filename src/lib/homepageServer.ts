import { query } from '@/lib/db';
import {
  Article,
  HERO_GROWTH_DECISION_ARTICLE,
  UBER_DRIVER_BONUSES_ARTICLE,
  HOMEPAGE_RIGHT_STREAM,
  BASELINE_LATEST_NEWS_9,
  STARTUPS_ENTREPRENEURSHIP_SECTION,
  ECONOMY_POLICY_ARTICLES,
  GLOBAL_BUSINESS_SECTION,
  TECH_SUPER_INTELLIGENCE_SECTION,
  TRENDING_RESILIENCE_SECTION,
  LUXURY_LIFESTYLE_SECTION,
  INTERVIEWS_OPINIONS_SECTION,
  ENERGY_COMMODITIES_SECTION,
  BUSINESS_LEGAL_SECTION,
  RETAIL_ECOMMERCE_SECTION,
  RESEARCH_INSIGHTS_SECTION,
  MARKETING_BRANDING_SECTION,
} from '@/data/newsData';
import { formatPublicationDateOnly } from '@/lib/dateUtils';

const BASELINE_STARTUPS_4: Article[] = [
  STARTUPS_ENTREPRENEURSHIP_SECTION.featured,
  STARTUPS_ENTREPRENEURSHIP_SECTION.items[0],
  STARTUPS_ENTREPRENEURSHIP_SECTION.items[1],
  STARTUPS_ENTREPRENEURSHIP_SECTION.items[2],
];

const BASELINE_ECONOMY_POLICY_4: Article[] = ECONOMY_POLICY_ARTICLES.slice(0, 4);

const BASELINE_GLOBAL_BUSINESS_6: Article[] = [
  GLOBAL_BUSINESS_SECTION.featured,
  GLOBAL_BUSINESS_SECTION.topCards[0],
  GLOBAL_BUSINESS_SECTION.topCards[1],
  GLOBAL_BUSINESS_SECTION.numberedItems[0],
  GLOBAL_BUSINESS_SECTION.numberedItems[1],
  GLOBAL_BUSINESS_SECTION.numberedItems[2],
];

const BASELINE_TECH_SUPER_INTELLIGENCE_8: Article[] = [
  TECH_SUPER_INTELLIGENCE_SECTION.featured,
  ...TECH_SUPER_INTELLIGENCE_SECTION.leftItems,
  ...TECH_SUPER_INTELLIGENCE_SECTION.rightCards,
];

const BASELINE_LUXURY_LIFESTYLE_4: Article[] = LUXURY_LIFESTYLE_SECTION.slice(0, 4);
const BASELINE_INTERVIEWS_OPINIONS_4: Article[] = INTERVIEWS_OPINIONS_SECTION.slice(0, 4);

const BASELINE_ENERGY_COMMODITIES_7: Article[] = [
  ENERGY_COMMODITIES_SECTION.lead,
  ...ENERGY_COMMODITIES_SECTION.middle,
  ...ENERGY_COMMODITIES_SECTION.right,
];

const BASELINE_BUSINESS_LEGAL_4: Article[] = BUSINESS_LEGAL_SECTION.slice(0, 4);
const BASELINE_RETAIL_ECOMMERCE_4: Article[] = RETAIL_ECOMMERCE_SECTION.slice(0, 4);
const BASELINE_RESEARCH_INSIGHTS_4: Article[] = RESEARCH_INSIGHTS_SECTION.slice(0, 4);
const BASELINE_MARKETING_BRANDING_4: Article[] = MARKETING_BRANDING_SECTION.slice(0, 4);

export interface HomepageData {
  heroLatest: Article[];
  heroSlides: Article[];
  rightCard: Article;
  rightStream: Article[];
  featuredGrid: Article[];
  startupsFeatured: Article;
  startupsItems: Article[];
  economyArticles: Article[];
  globalFeatured: Article;
  globalTopCards: Article[];
  globalNumberedItems: Article[];
  techFeatured: Article;
  techLeftItems: Article[];
  techRightCards: Article[];
  trendingFeatured: Article;
  trendingItems: Article[];
  luxuryArticles: Article[];
  interviewsArticles: Article[];
  energyLead: Article;
  energyMiddle: Article[];
  energyRight: Article[];
  businessLegalArticles: Article[];
  retailArticles: Article[];
  researchArticles: Article[];
  marketingArticles: Article[];
}

function rowToArticle(r: any): Article {
  let resolvedImg = r.imageUrl;
  if (!resolvedImg || resolvedImg.includes('placeholder')) {
    if (r.content) {
      const m = r.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (m && m[1] && m[1].trim() !== '') {
        resolvedImg = m[1];
      }
    }
  }
  const displayDate = r.publishedAt
    ? formatPublicationDateOnly(r.publishedAt)
    : (r.date || formatPublicationDateOnly(r.createdAt));

  return {
    id: r.slug || String(r.id),
    slug: r.slug,
    title: r.title,
    category: r.category || 'Business',
    editor: r.editor,
    date: displayDate || 'Oct 23, 2026',
    publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : undefined,
    readTime: r.readTime || '5 min read',
    excerpt: r.excerpt || r.cardSummary || '',
    imageUrl: resolvedImg || '',
    imageAspect: r.imageAspect,
    author: {
      name: r.authorName || 'Staff Contributor',
      avatar: r.authorAvatar || '/images/author-sherin.png',
      title: r.authorTitle || 'Staff Contributor',
      bio: r.authorBio,
    },
  };
}

function normalize(s: string): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function getHomepageArticlesFromDb(): Promise<HomepageData> {
  let dbRows: any[] = [];
  try {
    const sql = `
      SELECT 
        a.id,
        a.slug,
        a.title,
        a.category_name as category,
        a.author_name as authorName,
        a.editor,
        a.date,
        a.published_at as publishedAt,
        a.read_time as readTime,
        a.excerpt,
        a.content,
        a.image_url as imageUrl,
        a.image_aspect as imageAspect,
        a.views,
        COALESCE(a.status, 'published') as status,
        COALESCE(a.placement, 'none') as placement,
        a.placement_order as placementOrder,
        a.card_summary as cardSummary,
        a.sub_categories as subCategories,
        a.created_at as createdAt,
        COALESCE(u.avatar, au.avatar) as authorAvatar,
        COALESCE(au.role, 'Staff Contributor') as authorTitle,
        COALESCE(u.bio, au.bio) as authorBio,
        COALESCE(u.linkedin_url, au.linkedin_url) as authorLinkedinUrl
      FROM articles a
      LEFT JOIN authors au ON (a.author_id = au.id OR LOWER(TRIM(a.author_name)) = LOWER(TRIM(au.name)))
      LEFT JOIN users u ON (a.author_id = u.id OR LOWER(TRIM(a.author_name)) = LOWER(TRIM(u.name)) OR LOWER(TRIM(a.author_name)) = LOWER(TRIM(u.writer_name)))
      WHERE LOWER(COALESCE(a.status, 'published')) = 'published'
      ORDER BY 
        CASE WHEN a.placement_order IS NOT NULL AND a.placement_order > 0 THEN a.placement_order ELSE 999999 END ASC,
        CASE WHEN a.published_at IS NOT NULL THEN a.published_at ELSE a.created_at END DESC,
        a.id DESC
      LIMIT 250
    `;
    dbRows = await query<any[]>(sql);
  } catch (err) {
    console.warn('Failed to query homepage articles from MySQL:', err);
  }

  const allArticles: Article[] = dbRows.map(rowToArticle);

  // Group by placement
  const latestPlacement = allArticles.filter((a, idx) => {
    const raw = dbRows[idx];
    return raw && (raw.placement || '').toLowerCase() === 'latest_news';
  });

  const heroSlidesPlacement = allArticles.filter((a, idx) => {
    const raw = dbRows[idx];
    return raw && (raw.placement || '').toLowerCase() === 'hero_section';
  });

  const heroSub2Placement = allArticles.filter((a, idx) => {
    const raw = dbRows[idx];
    return raw && (raw.placement || '').toLowerCase() === 'hero_section_2';
  });

  const trendingPlacement = allArticles.filter((a, idx) => {
    const raw = dbRows[idx];
    return raw && (raw.placement || '').toLowerCase() === 'trending_news';
  });

  const nonePlacementArticles = allArticles.filter((a, idx) => {
    const raw = dbRows[idx];
    const p = (raw?.placement || 'none').toLowerCase().trim();
    return !p || p === 'none' || p === '';
  });

  // 1. Build Latest News (Slots 1 to 9)
  const combinedLatest: Article[] = [...latestPlacement];
  nonePlacementArticles.forEach((item) => {
    if (combinedLatest.length < 9 && !combinedLatest.some((c) => c.slug === item.slug || c.title.toLowerCase() === item.title.toLowerCase())) {
      combinedLatest.push(item);
    }
  });
  BASELINE_LATEST_NEWS_9.forEach((baseItem) => {
    if (combinedLatest.length < 9 && !combinedLatest.some((c) => c.slug === baseItem.slug || c.title.toLowerCase() === baseItem.title.toLowerCase())) {
      combinedLatest.push(baseItem);
    }
  });

  const heroLatest = combinedLatest.slice(0, 5);
  const featuredGrid = combinedLatest.slice(5, 9);

  // 2. Build Hero Slides (Slots 1 to 4)
  const combinedHeroSlides: Article[] = [...heroSlidesPlacement];
  nonePlacementArticles.forEach((item) => {
    if (combinedHeroSlides.length < 4 && !combinedHeroSlides.some((c) => c.slug === item.slug || c.title.toLowerCase() === item.title.toLowerCase())) {
      combinedHeroSlides.push(item);
    }
  });
  if (combinedHeroSlides.length === 0) {
    combinedHeroSlides.push(HERO_GROWTH_DECISION_ARTICLE);
  }

  // 3. Build Right Card & Right Stream
  const rightCard = heroSub2Placement[0] || nonePlacementArticles[0] || UBER_DRIVER_BONUSES_ARTICLE;
  const combinedRightStream: Article[] = heroSub2Placement.slice(1, 4);
  nonePlacementArticles.forEach((item) => {
    if (combinedRightStream.length < 3 && item.slug !== rightCard.slug && !combinedRightStream.some((c) => c.slug === item.slug)) {
      combinedRightStream.push(item);
    }
  });
  HOMEPAGE_RIGHT_STREAM.forEach((baseItem) => {
    if (combinedRightStream.length < 3 && !combinedRightStream.some((c) => c.slug === baseItem.slug)) {
      combinedRightStream.push(baseItem);
    }
  });

  // 4. Build Trending News (5 stories)
  const trendingFeatured = heroSub2Placement[0] || trendingPlacement[0] || TRENDING_RESILIENCE_SECTION.featured;
  const combinedTrending: Article[] = [...trendingPlacement];
  nonePlacementArticles.forEach((item) => {
    if (combinedTrending.length < 5 && !combinedTrending.some((c) => c.slug === item.slug)) {
      combinedTrending.push(item);
    }
  });
  TRENDING_RESILIENCE_SECTION.items.forEach((baseItem) => {
    if (combinedTrending.length < 5 && !combinedTrending.some((c) => c.slug === baseItem.slug)) {
      combinedTrending.push(baseItem);
    }
  });
  const trendingItems = combinedTrending.slice(0, 5).map((item, idx) => ({ ...item, rank: idx + 1 }));

  // Helper for category sections: Prepends DB articles of that category, then baseline, capped to count
  const buildCategorySection = (
    matchFn: (cat: string) => boolean,
    baseline: Article[],
    count: number
  ): Article[] => {
    const matchingDb = nonePlacementArticles.filter((art) => matchFn(normalize(art.category)));
    const combined: Article[] = [...matchingDb];
    baseline.forEach((baseItem) => {
      if (combined.length < count && !combined.some((c) => c.slug === baseItem.slug || c.title.toLowerCase().trim() === baseItem.title.toLowerCase().trim())) {
        combined.push(baseItem);
      }
    });
    return combined.slice(0, count);
  };

  // Startups & Entrepreneurship (4 slots)
  const startupsActive = buildCategorySection(
    (c) => c.includes('startup') || c.includes('entrepreneur'),
    BASELINE_STARTUPS_4,
    4
  );
  const startupsFeatured = startupsActive[0] || BASELINE_STARTUPS_4[0];
  const startupsItems = startupsActive.slice(1, 4);

  // Economy & Policy (4 slots)
  const economyArticles = buildCategorySection(
    (c) => c.includes('econom') || c.includes('policy'),
    BASELINE_ECONOMY_POLICY_4,
    4
  );

  // Global Business (6 slots: 1 featured, 2 top cards, 3 numbered)
  const globalActive = buildCategorySection(
    (c) => c.includes('global') || c.includes('international') || c.includes('world'),
    BASELINE_GLOBAL_BUSINESS_6,
    6
  );
  const globalFeatured = globalActive[0] || BASELINE_GLOBAL_BUSINESS_6[0];
  const globalTopCards = globalActive.slice(1, 3);
  const globalNumberedItems = globalActive.slice(3, 6).map((item, idx) => ({ ...item, rank: idx + 1 }));

  // Technology & Super Intelligence (8 slots: 1 featured, 5 left, 2 right)
  const techActive = buildCategorySection(
    (c) => c.includes('tech') || c.includes('ai') || c.includes('superintelligence'),
    BASELINE_TECH_SUPER_INTELLIGENCE_8,
    8
  );
  const techFeatured = techActive[0] || BASELINE_TECH_SUPER_INTELLIGENCE_8[0];
  const techLeftItems = techActive.slice(1, 6);
  const techRightCards = techActive.slice(6, 8);

  // Luxury & Lifestyle (4 slots)
  const luxuryArticles = buildCategorySection(
    (c) => c.includes('luxury') || c.includes('lifestyle'),
    BASELINE_LUXURY_LIFESTYLE_4,
    4
  );

  // Interviews & Opinions (4 slots)
  const interviewsArticles = buildCategorySection(
    (c) => c.includes('interview') || c.includes('opinion') || c.includes('ceo'),
    BASELINE_INTERVIEWS_OPINIONS_4,
    4
  );

  // Energy & Commodities (7 slots: 1 lead, 2 middle, 4 right)
  const energyActive = buildCategorySection(
    (c) => c.includes('energy') || c.includes('commodit') || c.includes('oil'),
    BASELINE_ENERGY_COMMODITIES_7,
    7
  );
  const energyLead = energyActive[0] || BASELINE_ENERGY_COMMODITIES_7[0];
  const energyMiddle = energyActive.slice(1, 3);
  const energyRight = energyActive.slice(3, 7);

  // Business & Legal Affairs (4 slots)
  const businessLegalArticles = buildCategorySection(
    (c) => c.includes('legal') || c.includes('affair') || c.includes('corporate') || c === 'business',
    BASELINE_BUSINESS_LEGAL_4,
    4
  );

  // Retail & E-commerce (4 slots)
  const retailArticles = buildCategorySection(
    (c) => c.includes('retail') || c.includes('commerce'),
    BASELINE_RETAIL_ECOMMERCE_4,
    4
  );

  // Research & Insights (4 slots)
  const researchArticles = buildCategorySection(
    (c) => c.includes('research') || c.includes('insight'),
    BASELINE_RESEARCH_INSIGHTS_4,
    4
  );

  // Marketing & Branding (4 slots)
  const marketingArticles = buildCategorySection(
    (c) => c.includes('marketing') || c.includes('brand'),
    BASELINE_MARKETING_BRANDING_4,
    4
  );

  return {
    heroLatest,
    heroSlides: combinedHeroSlides,
    rightCard,
    rightStream: combinedRightStream,
    featuredGrid,
    startupsFeatured,
    startupsItems,
    economyArticles,
    globalFeatured,
    globalTopCards,
    globalNumberedItems,
    techFeatured,
    techLeftItems,
    techRightCards,
    trendingFeatured,
    trendingItems,
    luxuryArticles,
    interviewsArticles,
    energyLead,
    energyMiddle,
    energyRight,
    businessLegalArticles,
    retailArticles,
    researchArticles,
    marketingArticles,
  };
}
