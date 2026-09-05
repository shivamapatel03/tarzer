import { Suspense } from 'react';
import { db } from '@/lib/db';
import DealsClient from './DealsClient';

export const metadata = {
  title: 'All Fashion Deals — TARZER Radar',
  description: 'Browse the latest fashion discounts and lowest prices across Amazon, Myntra, Meesho, and Shopsy.'
};

export default function DealsPage() {
  const products = db.getProducts({ status: 'ACTIVE' });
  const categories = db.getCategories();
  const marketplaces = db.getMarketplaces();

  return (
    <Suspense fallback={<div className="p-12 text-center font-mono">LOADING DEALS RADAR...</div>}>
      <DealsClient
        initialProducts={products}
        categories={categories}
        marketplaces={marketplaces}
      />
    </Suspense>
  );
}
