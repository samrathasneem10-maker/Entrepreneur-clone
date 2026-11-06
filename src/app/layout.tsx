import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://entrepreneur-clone.vercel.app');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Entrepreneur - Small Business News, Ideas, & Growth Strategies',
  description: 'Your ultimate resource for small business news, entrepreneurship, business management, side hustle ideas, franchise opportunities, and leadership.',
  keywords: ['Entrepreneur', 'Business News', 'Small Business', 'Side Hustles', 'Franchises', 'Startup Funding', 'Leadership'],
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Entrepreneur - Small Business News, Ideas, & Growth Strategies',
    description: 'Your ultimate resource for small business news, entrepreneurship, business management, side hustle ideas, franchise opportunities, and leadership.',
    url: '/',
    siteName: 'United States Today',
    images: [
      {
        url: '/Thumbail.jpg',
        width: 1200,
        height: 630,
        alt: 'United States Today',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Entrepreneur - Small Business News, Ideas, & Growth Strategies',
    description: 'Your ultimate resource for small business news, entrepreneurship, business management, side hustle ideas, franchise opportunities, and leadership.',
    images: ['/Thumbail.jpg'],
  },
};

import { ClientProviders } from '@/components/auth/Providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-US"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta property="og:image" content="/Thumbail.jpg" />
        <meta property="og:image:secure_url" content="/Thumbail.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="United States Today" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/Thumbail.jpg" />
      </head>
      <body
        className="min-h-full flex flex-col bg-white text-slate-900 font-sans tracking-normal leading-normal"
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
