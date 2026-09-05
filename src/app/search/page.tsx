import { Suspense } from 'react';
import { db } from '@/lib/db';
import SearchClient from './SearchClient';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Search Deals: "${q}" — TARZER` : 'Search Fashion Deals — TARZER',
    description: `Browse real-time fashion discounts and deals matching ${q || 'fashion'}.`
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q ? q.trim() : '';
  const products = query ? db.getProducts({ q: query, status: 'ACTIVE' }) : [];

  return (
    <Suspense fallback={<div className="p-12 text-center font-mono">SCANNING SEARCH RADAR...</div>}>
      <SearchClient initialProducts={products} query={query} />
    </Suspense>
  );
}
