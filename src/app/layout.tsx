import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
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
