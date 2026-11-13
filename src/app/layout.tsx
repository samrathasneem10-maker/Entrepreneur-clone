import type { Metadata } from 'next';
import './globals.css';
import { SITE_NAME, getSiteUrl } from '@/lib/siteConfig';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SITE_NAME,
  description: `Your ultimate resource for U.S. and global business news, markets, economy, technology, entrepreneurship, franchises, and leadership from ${SITE_NAME}.`,
  keywords: [SITE_NAME, 'Business News', 'US News', 'Markets', 'Economy', 'Technology', 'Startups', 'Leadership'],
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
    title: SITE_NAME,
    description: `Your ultimate resource for U.S. and global business news, markets, economy, technology, entrepreneurship, franchises, and leadership from ${SITE_NAME}.`,
    url: '/',
    siteName: SITE_NAME,
    images: [
      {
        url: '/Thumbail.jpg',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: `Your ultimate resource for U.S. and global business news, markets, economy, technology, entrepreneurship, franchises, and leadership from ${SITE_NAME}.`,
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
