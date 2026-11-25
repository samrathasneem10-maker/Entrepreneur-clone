export interface ResolvedAuthor {
  name: string;
  avatar: string;
  title: string;
  bio: string;
  linkedinUrl: string;
}

export const KNOWN_AUTHORS_REGISTRY: Record<string, ResolvedAuthor> = {
  'sherin-shibu': {
    name: 'Sherin Shibu',
    avatar: '/images/sherin-shibu.jpg',
    title: 'Business News Reporter',
    bio: 'Sherin Shibu is a business news reporter at United States Today. She previously worked for PCMag, Business Insider, and specializes in business trends, consumer technology, and entrepreneurship. Columbia University graduate.',
    linkedinUrl: 'https://www.linkedin.com/in/sherin-shibu',
  },
  'scott-smrkovski': {
    name: 'Scott Smrkovski',
    avatar: '/images/home-hero/author-scott.png',
    title: 'Executive Contributor',
    bio: 'Scott Smrkovski is a serial founder, angel investor, and executive contributor specializing in capital efficiency, venture scaling, and founder operational frameworks.',
    linkedinUrl: 'https://www.linkedin.com/in/scott-smrkovski',
  },
  'amanda-breen': {
    name: 'Amanda Breen',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    title: 'Senior Features Editor',
    bio: 'Amanda Breen is a senior features editor at United States Today covering wellness, workplace culture, and consumer innovation.',
    linkedinUrl: 'https://www.linkedin.com/in/amanda-breen',
  },
  'dylan-candice-odulio': {
    name: 'Dylan Candice Odulio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    title: 'News Reporter, United States Today',
    bio: 'Dylan Candice Odulio is a culture, consumer retail, and breaking news reporter at United States Today, covering viral retail trends, corporate strategy, and modern brand controversies.',
    linkedinUrl: 'https://www.linkedin.com/in/dylan-candice-odulio',
  },
  'jason-feifer': {
    name: 'Jason Feifer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    title: 'Editor in Chief',
    bio: 'Jason Feifer is the Editor in Chief of United States Today magazine, podcast host, and author of Build for Tomorrow. He helps entrepreneurs and modern professionals adapt to change and build future-proof businesses.',
    linkedinUrl: 'https://www.linkedin.com/in/jasonfeifer',
  },
  'ben-angel': {
    name: 'Ben Angel',
    avatar: '/images/more-author-2.jpg',
    title: 'Bestselling Author & Contributor',
    bio: "Ben Angel is the author of 'Unstoppable: A 90-Day Plan to Biohack Your Mind and Body for Success'. He has helped thousands of entrepreneurs maximize their cognitive performance and productivity.",
    linkedinUrl: 'https://www.linkedin.com/in/benangel',
  },
  'aytekin-tank': {
    name: 'Aytekin Tank',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    title: 'Founder & CEO of Jotform',
    bio: 'Aytekin Tank is the founder and CEO of Jotform and author of Automate Your Busywork. He writes about productivity, tech, and bootstrapping businesses.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'terry-rice': {
    name: 'Terry Rice',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    title: 'Business Consultant & Speaker',
    bio: 'Terry Rice is a business development consultant and podcast host helping solopreneurs build thriving digital enterprises.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'benjamin-ahmed': {
    name: 'Benjamin Ahmed',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    title: 'Consumer Tech Reporter',
    bio: 'Benjamin Ahmed is a technology journalist covering consumer hardware, smart home ecosystems, AI assistants, and enterprise product roadmaps at United States Today.',
    linkedinUrl: 'https://www.linkedin.com/in/benjamin-ahmed',
  },
  'brandon-morgan': {
    name: 'Brandon Morgan',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
    title: 'Career & Growth Advisor',
    bio: 'Brandon Morgan writes about professional decision-making frameworks, executive habits, and long-term career resilience for entrepreneurs and modern professionals.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'michael-andrews-cooper': {
    name: 'Michael Andrews Cooper',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    title: 'Executive Leadership Strategist',
    bio: 'Michael Andrews Cooper is an executive coach and innovation strategist who advises fast-growing startups and Fortune 500 leadership teams on turning early concepts into scalable enterprises.',
    linkedinUrl: 'https://www.linkedin.com',
  },
  'samra-thsaneem': {
    name: 'Samra Thasneem',
    avatar: '/uploads/upload_1795317297120_modern-muslim-woman-hijab-office-room_285396-11089.webp',
    title: 'Executive Contributor',
    bio: 'Executive business contributor at United States Today.',
    linkedinUrl: 'https://www.linkedin.com/in/fathima-samra-8823b634a',
  },
  'samra-thasneem': {
    name: 'Samra Thasneem',
    avatar: '/uploads/upload_1795317297120_modern-muslim-woman-hijab-office-room_285396-11089.webp',
    title: 'Executive Contributor',
    bio: 'Executive business contributor at United States Today.',
    linkedinUrl: 'https://www.linkedin.com/in/fathima-samra-8823b634a',
  },
  'samra': {
    name: 'Samra Thasneem',
    avatar: '/uploads/upload_1795317297120_modern-muslim-woman-hijab-office-room_285396-11089.webp',
    title: 'Executive Contributor',
    bio: 'Executive business contributor at United States Today.',
    linkedinUrl: 'https://www.linkedin.com/in/fathima-samra-8823b634a',
  },
  'dean-guida': {
    name: 'Dean Guida',
    avatar: '/images/more-author-1.jpg',
    title: 'Contributor & Tech CEO',
    bio: "Dean Guida is the founder and CEO of Infragistics, a global software company providing tools and solutions to accelerate application design and development. Author of 'When Grit Is Not Enough'.",
    linkedinUrl: 'https://www.linkedin.com/in/deanguida',
  },
  'rob-aquino': {
    name: 'Rob Aquino',
    avatar: '/images/more-author-3.jpg',
    title: 'CEO & Business Strategist',
    bio: 'Rob Aquino is the CEO of JBS Corp, specializing in corporate strategy, organizational scaling, and executive leadership development across growth-stage enterprises.',
    linkedinUrl: 'https://www.linkedin.com/in/robaquino',
  },
  'molly-cavanah': {
    name: 'Molly Cavanah',
    avatar: '/images/more-author-4.jpg',
    title: 'Growth Executive & Analyst',
    bio: 'Molly Cavanah is a seasoned growth executive with extensive experience leading revenue operations, user acquisition, and predictive data analytics for venture-backed tech companies.',
    linkedinUrl: 'https://www.linkedin.com/in/mollycavanah',
  },
  'mita-mallick': {
    name: 'Mita Mallick',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    title: 'Executive Contributor',
    bio: 'Mita Mallick is a corporate change-maker and author of the Wall Street Journal and USA Today bestseller, Reimagine Inclusion: Debunking 13 Myths to Transform Your Workplace.',
    linkedinUrl: 'https://www.linkedin.com/in/mita-mallick-22103b4',
  },
  'staff-contributor': {
    name: 'Staff Contributor',
    avatar: '/images/author-sherin.png',
    title: 'United States Today Staff',
    bio: 'United States Today editorial desk covering breaking market trends, corporate strategy, and executive leadership.',
    linkedinUrl: 'https://www.linkedin.com',
  },
};

export function resolveArticleAuthor(rawArticle: any): ResolvedAuthor {
  if (!rawArticle) {
    return KNOWN_AUTHORS_REGISTRY['staff-contributor'];
  }

  // Extract author name from various formats
  let rawName = '';
  if (typeof rawArticle.author === 'string') {
    rawName = rawArticle.author;
  } else if (rawArticle.author?.name) {
    rawName = rawArticle.author.name;
  } else if (rawArticle.authorName) {
    rawName = rawArticle.authorName;
  } else if (rawArticle.author_name) {
    rawName = rawArticle.author_name;
  } else if (rawArticle.author_full_name) {
    rawName = rawArticle.author_full_name;
  }

  const cleanName = (rawName || '').trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Look up in known registry
  const matched =
    KNOWN_AUTHORS_REGISTRY[slug] ||
    (slug.includes('samra') ? KNOWN_AUTHORS_REGISTRY['samra-thasneem'] : undefined);

  if (matched) {
    return {
      name: matched.name,
      avatar: matched.avatar,
      title: matched.title,
      bio: matched.bio,
      linkedinUrl: matched.linkedinUrl,
    };
  }

  // Check if article has non-placeholder avatar/bio
  const authorObj = typeof rawArticle.author === 'object' ? rawArticle.author : null;
  const avatar =
    rawArticle.authorAvatar ||
    rawArticle.author_avatar ||
    authorObj?.avatar;

  const validAvatar =
    avatar && !avatar.includes('user-avatar-butterfly') && !avatar.includes('placeholder')
      ? avatar
      : '/images/author-sherin.png';

  const title =
    rawArticle.authorTitle ||
    rawArticle.author_role ||
    authorObj?.title ||
    'United States Today Staff';

  const bio =
    rawArticle.authorBio ||
    rawArticle.author_bio ||
    authorObj?.bio ||
    `${cleanName || 'The author'} is an active contributor at United States Today.`;

  const linkedin =
    rawArticle.authorLinkedinUrl ||
    rawArticle.author_linkedin ||
    authorObj?.linkedinUrl ||
    'https://www.linkedin.com';

  return {
    name: cleanName || 'Staff Contributor',
    avatar: validAvatar,
    title,
    bio,
    linkedinUrl: linkedin,
  };
}
