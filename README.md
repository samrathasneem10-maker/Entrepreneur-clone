# Entrepreneur.com Clone

A modern, high-fidelity web platform inspired by [Entrepreneur.com](https://www.entrepreneur.com) — built for entrepreneurs, founders, and small business leaders.

This application is powered by **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**, featuring editorial layouts, full-text live search, dynamic category archives, interactive newsletter subscriptions, and smooth shimmer skeleton loading.

---

## 🌟 Key Features

- **📰 Editorial Homepage**:
  - **3-Column Hero Section**: Real-time breaking news stream, central featured cover story, and secondary featured spotlights.
  - **Editorial Grids**: Top trending stories, founder profiles, business growth guides, and deep dives.
  - **Overcoming Impossible Live**: Interactive workshop and executive event showcase.
  - **Side Hustle & Newsletter Hub**: Guides paired with multi-topic newsletter subscription selections.
  - **Agentic AI & Technology**: Dedicated innovation showcase for AI workflows and tech trends.
  - **Franchise 500 & Quiz**: Categorized franchise directory, category pills, and franchise match quiz.
  - **Multimedia & Video Feed**: Featured video stories with responsive media cards.
  - **Magazine Showcase**: High-resolution print issue archives with custom cover art and issue navigation.

- **📖 Dynamic Article Reading View (`/article/[id]`)**:
  - Scroll-synchronized **reading progress bar** in the sticky header.
  - Metadata breakdown (read times, relative timestamps, author credits).
  - Social utilities (1-click link copy, bookmarks, social share links).
  - Related articles grid and author attribution.

- **🔍 Full-Text Live Search (`/search`)**:
  - Live query filtering across titles, excerpts, categories, and author names.
  - Search tag shortcuts ("AI", "Leadership", "Startups", "Side Hustles").
  - URL state synchronization and pagination.

- **🗂️ Topic & Category Archives (`/topic/[slug]`)**:
  - Paginated article stream per category.
  - "Top Stories" ranked sidebar and standard leaderboard advertising placeholders.

- **👤 Author Profiles (`/author/[slug]`)**:
  - Detailed contributor profiles with bio, title, avatar, and article history.

- **🔐 Authentication UI**:
  - Interactive modal dialogs for Sign In and Sign Up.
  - Client-side auth state with user avatar display in the header and 1-click logout.

- **⚡ Shimmer Skeleton Loading**:
  - Smooth route transition skeletons for the homepage, article view, search, author profiles, and topic archives.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Typography**: `Playfair Display`, `Inter`, `Bodoni Moda`, and `Noe Display`

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed:

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/samrathasneem10-maker/Entrepreneur-clone.git
   cd Entrepreneur-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build

To build and verify the application for production:

```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
├── public/                     # Static assets, branding, and imagery
├── src/
│   ├── app/                    # Next.js App Router routes & error boundaries
│   │   ├── article/[id]/       # Dynamic article page with reading progress bar
│   │   ├── author/[slug]/      # Author profile and articles
│   │   ├── topic/[slug]/       # Categorized archive streams
│   │   ├── newsletters/        # Newsletter preferences page
│   │   ├── search/             # Live search page
│   │   ├── globals.css         # Tailwind v4 styles and shimmer animations
│   │   ├── layout.tsx          # App root layout with ClientProviders
│   │   └── page.tsx            # Main homepage
│   ├── components/             # Reusable UI components
│   │   ├── auth/               # Auth modal, context, and form elements
│   │   ├── skeletons/          # Shimmer skeleton loaders
│   │   ├── ArticleCard.tsx     # Configurable article card
│   │   ├── LoadingProvider.tsx # Client-side transition shimmer provider
│   │   ├── MarketTicker.tsx    # Live financial market ticker
│   │   ├── NavDrawer.tsx       # Slide-out navigation drawer
│   │   └── SearchBar.tsx       # Search modal overlay
│   ├── layouts/
│   │   ├── Header.tsx          # Dual-row sticky navigation header
│   │   └── Footer.tsx          # Multi-column publication footer
│   ├── sections/               # Modular homepage sections
│   └── data/
│       └── newsData.ts         # In-memory dataset, navigation structure & helpers
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration for Tailwind v4
└── tsconfig.json               # TypeScript configuration
```

---

## 📄 License

This project is created for demonstration and portfolio purposes. All trademarks, logos, and brand names are property of their respective owners.
