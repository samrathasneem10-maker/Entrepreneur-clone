import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  console.log('Connecting to MySQL on 127.0.0.1:3306...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  console.log('Connected to MySQL server successfully.');

  // 1. Ensure database exists
  await connection.query('CREATE DATABASE IF NOT EXISTS `entreprenuer_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  await connection.query('USE `entreprenuer_db`;');
  console.log('Using database `entreprenuer_db`.');

  // 2. Create tables
  console.log('Creating tables...');

  // Categories table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`categories\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(100) NOT NULL UNIQUE,
      \`slug\` VARCHAR(100) NOT NULL UNIQUE,
      \`description\` TEXT,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Authors table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`authors\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`slug\` VARCHAR(100) NOT NULL UNIQUE,
      \`name\` VARCHAR(150) NOT NULL,
      \`role\` VARCHAR(150) NULL,
      \`badge\` VARCHAR(150) DEFAULT 'Entrepreneur Staff',
      \`avatar\` VARCHAR(500) NULL,
      \`bio\` TEXT NULL,
      \`linkedin_url\` VARCHAR(500) NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Articles table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`articles\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`slug\` VARCHAR(255) NOT NULL UNIQUE,
      \`title\` VARCHAR(500) NOT NULL,
      \`category_name\` VARCHAR(100) NOT NULL,
      \`author_id\` INT NULL,
      \`author_name\` VARCHAR(150) NOT NULL,
      \`editor\` VARCHAR(150) DEFAULT 'AMANDA BREEN',
      \`date\` VARCHAR(50) NULL,
      \`read_time\` VARCHAR(50) DEFAULT '4 min read',
      \`excerpt\` TEXT NULL,
      \`content\` LONGTEXT NULL,
      \`image_url\` VARCHAR(1000) NULL,
      \`image_aspect\` VARCHAR(50) DEFAULT 'wide',
      \`views\` INT DEFAULT 0,
      \`is_hero\` BOOLEAN DEFAULT FALSE,
      \`is_featured\` BOOLEAN DEFAULT FALSE,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (\`category_name\`),
      INDEX (\`author_name\`),
      CONSTRAINT \`fk_articles_authors\` FOREIGN KEY (\`author_id\`) REFERENCES \`authors\` (\`id\`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Comments table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`comments\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`article_slug\` VARCHAR(255) NOT NULL,
      \`author\` VARCHAR(150) NOT NULL,
      \`avatar\` VARCHAR(500) NULL,
      \`text\` TEXT NOT NULL,
      \`likes\` INT DEFAULT 0,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX (\`article_slug\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Subscribers (Newsletters) table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`subscribers\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`email\` VARCHAR(255) NOT NULL UNIQUE,
      \`status\` VARCHAR(50) DEFAULT 'active',
      \`subscribed_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(150) NOT NULL,
      \`email\` VARCHAR(255) NOT NULL UNIQUE,
      \`password_hash\` VARCHAR(255) NULL,
      \`role\` VARCHAR(50) DEFAULT 'member',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('Tables created successfully.');

  // 3. Seed Categories
  console.log('Seeding categories...');
  const categories = [
    { name: 'Breaking Business News', slug: 'breaking-business-news', description: 'Real-time coverage of executive shakeups, corporate acquisitions, breaking earnings, and macroeconomic shifts.' },
    { name: 'Markets and Investing', slug: 'markets-investing', description: 'Wall Street equity analysis, index funds, bond yields, venture capital, and private equity investments.' },
    { name: 'Startups and Entrepreneurship', slug: 'startups-entrepreneurship', description: 'Actionable founder blueprints, bootstrapping guides, seed fundraising, and scaling operations.' },
    { name: 'Technology and AI', slug: 'technology-ai', description: 'Generative AI tools, autonomous agent frameworks, enterprise software, cybersecurity, and hardware breakthroughs.' },
    { name: 'Leadership', slug: 'leadership', description: 'Executive leadership strategies, high-stakes decision making, conflict resolution, and board governance.' },
    { name: 'Research and Insights', slug: 'research-insights', description: 'Data-backed market reports, consumer sentiment analytics, industry whitepapers, and predictive forecasting.' },
    { name: 'Economy', slug: 'economy', description: 'Federal Reserve policy, inflation benchmarks, GDP updates, employment data, and global trade flows.' },
    { name: 'Banking and Finance', slug: 'banking-finance', description: 'Commercial banking, liquidity management, treasury operations, fintech rails, and credit facilities.' },
    { name: 'Building a Business', slug: 'building-a-business', description: 'Practical playbooks on operations, logistics, legal compliance, and customer acquisition.' },
    { name: 'Thought Leaders', slug: 'thought-leaders', description: 'Deep-dive perspectives and mental frameworks from world-renowned founders, authors, and industry pioneers.' },
    { name: 'Entrepreneurs', slug: 'entrepreneurs', description: 'Inspiring profiles, lessons learned, and behind-the-scenes stories of modern builders.' },
  ];

  for (const cat of categories) {
    await connection.query(`
      INSERT INTO \`categories\` (\`name\`, \`slug\`, \`description\`)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE \`description\` = VALUES(\`description\`);
    `, [cat.name, cat.slug, cat.description]);
  }

  // 4. Seed Authors
  console.log('Seeding authors...');
  const authors = [
    {
      slug: 'sherin-shibu',
      name: 'Sherin Shibu',
      role: 'Business News Reporter',
      badge: 'Entrepreneur Staff',
      avatar: '/images/author-sherin.png',
      bio: 'Sherin Shibu is a business news reporter at Entrepreneur.com. She previously worked for PCMag, Business Insider, and specializes in business trends, consumer technology, and entrepreneurship. Columbia University graduate.',
      linkedin: 'https://linkedin.com',
    },
    {
      slug: 'ben-angel',
      name: 'Ben Angel',
      role: 'Bestselling Author & Contributor',
      badge: 'Entrepreneur Network Contributor',
      avatar: '/images/more-author-2.jpg',
      bio: "Ben Angel is the author of 'Unstoppable: A 90-Day Plan to Biohack Your Mind and Body for Success'. He has helped thousands of entrepreneurs maximize their cognitive performance and productivity.",
      linkedin: 'https://linkedin.com',
    },
    {
      slug: 'dean-guida',
      name: 'Dean Guida',
      role: 'Contributor & Tech CEO',
      badge: 'Entrepreneur Leadership Network Contributor',
      avatar: '/images/more-author-1.jpg',
      bio: "Dean Guida is the founder and CEO of Infragistics, a global software company providing tools and solutions to accelerate application design and development. Author of 'When Grit Is Not Enough'.",
      linkedin: 'https://linkedin.com',
    },
    {
      slug: 'rob-aquino',
      name: 'Rob Aquino',
      role: 'CEO & Business Strategist',
      badge: 'Entrepreneur Leadership Network Contributor',
      avatar: '/images/more-author-3.jpg',
      bio: 'Rob Aquino is the CEO of JBS Corp, specializing in corporate strategy, organizational scaling, and executive leadership development across growth-stage enterprises.',
      linkedin: 'https://linkedin.com',
    },
    {
      slug: 'molly-cavanah',
      name: 'Molly Cavanah',
      role: 'Growth Executive & Analyst',
      badge: 'Entrepreneur Leadership Network Contributor',
      avatar: '/images/more-author-4.jpg',
      bio: 'Molly Cavanah is a seasoned growth executive with extensive experience leading revenue operations, user acquisition, and predictive data analytics for venture-backed tech companies.',
      linkedin: 'https://linkedin.com',
    },
    {
      slug: 'mita-mallick',
      name: 'Mita Mallick',
      role: 'Executive Contributor',
      badge: 'Entrepreneur Leadership Network Contributor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
      bio: 'Mita Mallick is a corporate change-maker and author of the Wall Street Journal and USA Today bestseller, Reimagine Inclusion: Debunking 13 Myths to Transform Your Workplace.',
      linkedin: 'https://linkedin.com',
    },
    {
      slug: 'jason-feifer',
      name: 'Jason Feifer',
      role: 'Editor in Chief',
      badge: 'Entrepreneur Staff',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      bio: 'Jason Feifer is the editor in chief of Entrepreneur magazine, podcast host, and author of Build for Tomorrow. He shares practical frameworks on adapting to change.',
      linkedin: 'https://linkedin.com',
    },
    {
      slug: 'amanda-breen',
      name: 'Amanda Breen',
      role: 'Senior Features Editor',
      badge: 'Entrepreneur Staff',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
      bio: 'Amanda Breen is a senior features editor at Entrepreneur, reporting on the intersection of generative artificial intelligence and enterprise culture.',
      linkedin: 'https://linkedin.com',
    },
    {
      slug: 'aytekin-tank',
      name: 'Aytekin Tank',
      role: 'Founder & CEO of Jotform',
      badge: 'Entrepreneur Network Contributor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      bio: 'Aytekin Tank is the founder and CEO of Jotform and author of Automate Your Busywork. He writes about productivity, tech, and bootstrapping businesses.',
      linkedin: 'https://linkedin.com',
    },
    {
      slug: 'terry-rice',
      name: 'Terry Rice',
      role: 'Business Consultant & Speaker',
      badge: 'Entrepreneur Network Contributor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      bio: 'Terry Rice is a business development consultant and podcast host helping solopreneurs build thriving digital enterprises.',
      linkedin: 'https://linkedin.com',
    },
  ];

  const authorIdMap = new Map();
  for (const auth of authors) {
    const [result] = await connection.query(`
      INSERT INTO \`authors\` (\`slug\`, \`name\`, \`role\`, \`badge\`, \`avatar\`, \`bio\`, \`linkedin_url\`)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`name\` = VALUES(\`name\`),
        \`role\` = VALUES(\`role\`),
        \`badge\` = VALUES(\`badge\`),
        \`avatar\` = VALUES(\`avatar\`),
        \`bio\` = VALUES(\`bio\`);
    `, [auth.slug, auth.name, auth.role, auth.badge, auth.avatar, auth.bio, auth.linkedin]);

    const [rows] = await connection.query('SELECT `id` FROM `authors` WHERE `slug` = ?', [auth.slug]);
    if (rows.length > 0) {
      authorIdMap.set(auth.slug, rows[0].id);
      authorIdMap.set(auth.name.toLowerCase(), rows[0].id);
    }
  }

  // 5. Seed Articles
  console.log('Seeding articles...');
  const articles = [
    {
      slug: '53-side-hustle-ideas-to-make-extra-money-in-2026',
      title: '53 Side Hustle Ideas to Make Extra Money in 2026',
      category: 'Finance & Economics',
      authorSlug: 'sherin-shibu',
      authorName: 'Sherin Shibu',
      editor: 'AMANDA BREEN',
      date: 'JAN 26, 2026',
      readTime: '8 min read',
      excerpt: 'From freelancing and digital consulting to e-commerce products and content creation, discover high-yield strategies to build sustainable secondary income.',
      imageUrl: '/images/side-hustle-53.jpg',
      isHero: false,
      isFeatured: true,
      views: 18450,
      content: 'Building secondary income streams is one of the highest leverage actions you can take in 2026. Whether your goal is paying down debt, building emergency savings, or transitioning into full-time entrepreneurship, modern remote tools allow anyone to monetize specialized skills.',
    },
    {
      slug: 'youve-been-overlooking-your-best-idea-people-ai-is-about-to-fix-that',
      title: "You've Been Overlooking Your Best Idea People. AI Is About to Fix That.",
      category: 'Building a Business',
      authorSlug: 'sherin-shibu',
      authorName: 'Sherin Shibu',
      editor: 'AMANDA BREEN',
      date: '25m ago',
      readTime: '4 min read',
      excerpt: 'Frontline employees hold the most actionable operational insights. New enterprise AI tools finally give leaders a way to capture, rank, and execute them.',
      imageUrl: '/images/rushing-ai-cx.jpg',
      isHero: false,
      isFeatured: true,
      views: 9230,
      content: 'In most organizations, customer-facing employees recognize bottlenecks months before executive leadership sees them in quarterly reports. Generative AI tools now allow companies to continuously aggregate frontline ideas into structured innovation pipelines.',
    },
    {
      slug: 'not-every-boss-deserves-a-thank-you-card',
      title: 'Not Every Boss Deserves a Thank-You Card. Here’s What to Do When Your Boss Is a Bully.',
      category: 'Building a Business',
      authorSlug: 'mita-mallick',
      authorName: 'MITA MALLICK',
      editor: 'KARA MCINTYRE',
      date: 'OCT 14, 2026',
      readTime: '5 min read',
      excerpt: 'As some of us celebrate National Boss’s Day, it’s important to remember that not everyone has a good relationship with their boss. Here is how to protect your mental health and career.',
      imageUrl: '/images/related-boss-bully.png',
      isHero: false,
      isFeatured: false,
      views: 14200,
      content: 'When working for a leader who bullies, people often rationalize bad behavior with corporate power dynamics. Documenting patterns off company devices and setting clear personal boundaries are critical steps to reclaiming agency.',
    },
    {
      slug: 'how-to-biohack-your-brain-for-peak-performance',
      title: 'How to Biohack Your Brain for Peak Focus and Performance',
      category: 'Thought Leaders',
      authorSlug: 'ben-angel',
      authorName: 'Ben Angel',
      editor: 'AMANDA BREEN',
      date: '2h ago',
      readTime: '5 min read',
      excerpt: 'Proven neuroscience frameworks to eliminate brain fog, optimize daily cognitive output, and sustain high energy without burnout.',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
      isHero: false,
      isFeatured: true,
      views: 7800,
      content: 'Peak cognitive output is not about working 14 hours a day; it is about managing neurochemistry, blood glucose stability, and deep restorative sleep cycles to execute with maximum clarity.',
    },
    {
      slug: 'collaboration-drives-innovation-growth',
      title: 'Collaboration Drives Innovation and Growth',
      category: 'Thought Leaders',
      authorSlug: 'ben-angel',
      authorName: 'Ben Angel',
      editor: 'AMANDA BREEN',
      date: '4h ago',
      readTime: '5 min read',
      excerpt: 'When great minds work together, new ideas turn into real progress. How cross-functional teams build unstoppable momentum.',
      imageUrl: '/images/topic-sub-2.jpg',
      isHero: false,
      isFeatured: true,
      views: 6540,
      content: 'Cross-functional collaboration breaks organizational silos, turning raw creative friction into validated commercial solutions.',
    },
    {
      slug: 'unstoppable-90-day-plan-to-biohack-your-mind',
      title: 'The 90-Day Biohack Blueprint: How to Reclaim Energy, Focus and Drive',
      category: 'Leadership',
      authorSlug: 'ben-angel',
      authorName: 'Ben Angel',
      editor: 'AMANDA BREEN',
      date: '1d ago',
      readTime: '6 min read',
      excerpt: 'Eliminate chronic decision fatigue and optimize physical resilience using behavioral biohacking systems.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
      isHero: false,
      isFeatured: true,
      views: 11200,
      content: 'A systematic 90-day protocol targeting circadian alignment, nutritional timing, and active mental recovery unlocks sustained high performance for ambitious founders.',
    },
    {
      slug: 'apple-amazon-and-microsoft-want-these-new-ai-gadgets',
      title: 'Apple, Amazon and Microsoft Want These New AI Gadgets',
      category: 'Breaking Business News',
      authorSlug: 'sherin-shibu',
      authorName: 'Sherin Shibu',
      editor: 'AMANDA BREEN',
      date: '3h ago',
      readTime: '4 min read',
      excerpt: 'Big tech titans are aggressively investing in ambient computing hardware and specialized wearable AI devices.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
      isHero: false,
      isFeatured: true,
      views: 8900,
      content: 'As smartphone hardware cycles mature, leading technology giants are looking at voice-first, ambient devices as the primary consumer computing interface of the next decade.',
    },
    {
      slug: 'he-leads-a-240-billion-food-giant',
      title: "He Leads a $240 Billion Food Giant. Here’s the Difficult Management Rule He Follows.",
      category: 'Markets and Investing',
      authorSlug: 'sherin-shibu',
      authorName: 'Sherin Shibu',
      editor: 'AMANDA BREEN',
      date: '7h ago',
      readTime: '5 min read',
      excerpt: 'Decisive operational leadership requires eliminating redundant approvals and empowering unit leaders with true autonomy.',
      imageUrl: '/images/related-food-giant.png',
      isHero: false,
      isFeatured: true,
      views: 13400,
      content: 'Managing a massive global conglomerate requires ruthlessly simple principles: clear financial accountability, short feedback loops, and trusting operators on the ground.',
    },
    {
      slug: 'ai-is-changing-your-company-culture',
      title: 'AI Is Changing Your Company Culture Whether You Planned for It or Not',
      category: 'Technology and AI',
      authorSlug: 'amanda-breen',
      authorName: 'Amanda Breen',
      editor: 'AMANDA BREEN',
      date: '5h ago',
      readTime: '4 min read',
      excerpt: 'Adopting generative AI fundamentally shifts internal team trust, performance reviews, and creative autonomy across knowledge workers.',
      imageUrl: '/images/related-robot-hands.png',
      isHero: false,
      isFeatured: true,
      views: 9800,
      content: 'Generative AI changes expectations around speed and craftsmanship. Leaders who fail to establish clear guidelines risk alienating top creative talent.',
    },
  ];

  for (const art of articles) {
    const authorId = authorIdMap.get(art.authorSlug) || authorIdMap.get(art.authorName.toLowerCase()) || null;
    await connection.query(`
      INSERT INTO \`articles\` (
        \`slug\`, \`title\`, \`category_name\`, \`author_id\`, \`author_name\`, \`editor\`,
        \`date\`, \`read_time\`, \`excerpt\`, \`content\`, \`image_url\`, \`views\`, \`is_hero\`, \`is_featured\`
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`title\` = VALUES(\`title\`),
        \`category_name\` = VALUES(\`category_name\`),
        \`author_id\` = VALUES(\`author_id\`),
        \`author_name\` = VALUES(\`author_name\`),
        \`editor\` = VALUES(\`editor\`),
        \`date\` = VALUES(\`date\`),
        \`read_time\` = VALUES(\`read_time\`),
        \`excerpt\` = VALUES(\`excerpt\`),
        \`content\` = VALUES(\`content\`),
        \`image_url\` = VALUES(\`image_url\`),
        \`views\` = VALUES(\`views\`);
    `, [
      art.slug, art.title, art.category, authorId, art.authorName, art.editor,
      art.date, art.readTime, art.excerpt, art.content, art.imageUrl, art.views, art.isHero, art.isFeatured
    ]);
  }

  // 6. Seed Comments
  console.log('Seeding initial comments...');
  const comments = [
    {
      article_slug: '53-side-hustle-ideas-to-make-extra-money-in-2026',
      author: 'David Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
      text: 'Starting a niche newsletter completely changed my financial trajectory this year. Low overhead and direct audience relationship!',
      likes: 14,
    },
    {
      article_slug: '53-side-hustle-ideas-to-make-extra-money-in-2026',
      author: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
      text: 'Great breakdown on consulting vs productized services. High-yield local services are also super overlooked right now.',
      likes: 8,
    },
    {
      article_slug: 'youve-been-overlooking-your-best-idea-people-ai-is-about-to-fix-that',
      author: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
      text: 'Spot on analysis by Sherin. We implemented an internal frontline suggestion tool last quarter and our customer support NPS jumped 22 points.',
      likes: 19,
    },
  ];

  for (const c of comments) {
    await connection.query(`
      INSERT INTO \`comments\` (\`article_slug\`, \`author\`, \`avatar\`, \`text\`, \`likes\`)
      VALUES (?, ?, ?, ?, ?)
    `, [c.article_slug, c.author, c.avatar, c.text, c.likes]);
  }

  // 7. Seed Subscribers
  console.log('Seeding demo subscribers...');
  await connection.query(`
    INSERT INTO \`subscribers\` (\`email\`, \`status\`)
    VALUES ('founder@entrepreneur.com', 'active'), ('reader@example.com', 'active')
    ON DUPLICATE KEY UPDATE \`status\` = VALUES(\`status\`);
  `);

  // 8. Generate SQL dump file in database/entreprenuer_db.sql
  console.log('Generating database/entreprenuer_db.sql backup...');
  const dbDir = path.join(__dirname, '..', '..', 'database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Verify row counts
  const [catCount] = await connection.query('SELECT COUNT(*) as cnt FROM `categories`');
  const [authCount] = await connection.query('SELECT COUNT(*) as cnt FROM `authors`');
  const [artCount] = await connection.query('SELECT COUNT(*) as cnt FROM `articles`');
  const [commCount] = await connection.query('SELECT COUNT(*) as cnt FROM `comments`');
  const [subCount] = await connection.query('SELECT COUNT(*) as cnt FROM `subscribers`');

  console.log('\n--- Database Initialization Complete ---');
  console.log(`Database: entreprenuer_db`);
  console.log(`Categories: ${(catCount)[0].cnt}`);
  console.log(`Authors:    ${(authCount)[0].cnt}`);
  console.log(`Articles:   ${(artCount)[0].cnt}`);
  console.log(`Comments:   ${(commCount)[0].cnt}`);
  console.log(`Subscribers:${(subCount)[0].cnt}`);

  await connection.end();
  console.log('Connection closed cleanly.');
}

initDatabase().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
