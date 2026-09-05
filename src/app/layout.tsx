import type { Metadata } from 'next';
import './globals.css';
import { db } from '@/lib/db';
import ClientRootWrapper from '@/components/layout/ClientRootWrapper';

export const metadata: Metadata = {
  metadataBase: new URL('https://tarzer.in'),
  title: 'TARZER — Look Expensive. Pay Less. Fashion Deals Radar',
  description:
    'Discover clothing, fashion, streetwear, footwear, and accessories at the lowest available prices from Amazon, Myntra, Meesho, and Shopsy.',
  keywords: [
    'fashion deals',
    'streetwear sales',
    'discount clothing',
    'lowest price fashion',
    'amazon fashion deals',
    'myntra discount',
    'meesho shopping',
    'TARZER'
  ],
  openGraph: {
    title: 'TARZER — Look Expensive. Pay Less.',
    description: 'The best fashion deals from your favorite stores, all in one place.',
    url: 'https://tarzer.in',
    siteName: 'TARZER',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'TARZER Fashion Deals Radar'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '64x64' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};

import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const rawHost = headerList.get('x-forwarded-host') || headerList.get('host') || '';
  const host = rawHost.toLowerCase().split(':')[0].trim();
  const isAdminHeader = headerList.get('x-is-admin-host') === '1';
  const isAdminSubdomain =
    isAdminHeader ||
    host.startsWith('admin.') ||
    host.startsWith('admin-') ||
    host === 'admin.tarzer.shop';

  const initialBuildingMode = db.getSetting('building_mode', 'false') === 'true';

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-[#111111] antialiased selection:bg-[#FF6A00] selection:text-white">
        <ClientRootWrapper 
          initialBuildingMode={initialBuildingMode}
          isAdminSubdomain={isAdminSubdomain}
        >
          {children}
        </ClientRootWrapper>
      </body>
    </html>
  );
}
