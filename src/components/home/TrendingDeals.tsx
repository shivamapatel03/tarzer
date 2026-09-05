'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PixelHotIcon } from '@/components/ui/PixelHotIcon';
import ProductCard from '@/components/deals/ProductCard';
import { Product } from '@/lib/types';

interface TrendingDealsProps {
  products: Product[];
}

const FILTER_TABS = [
  { label: 'ALL DEALS', slug: 'all' },
  { label: 'MEN', slug: 'men' },
  { label: 'WOMEN', slug: 'women' },
  { label: 'KIDS', slug: 'kids' },
  { label: 'STREETWEAR', slug: 'streetwear' },
  { label: 'GEN Z', slug: 'gen-z' },
  { label: 'KOREAN', slug: 'korean' }
];

export default function TrendingDeals({ products }: TrendingDealsProps) {
  const [selectedSlug, setSelectedSlug] = useState('all');

  const filteredProducts = products.filter((p) => {
    if (selectedSlug === 'all') return true;
    return p.category?.slug === selectedSlug;
  });

  const displayList = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <section className="py-14 md:py-20 bg-white border-b border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#111111]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PixelHotIcon className="w-4 h-4" />
              <span className="text-xs font-pixel text-[#FF6A00] tracking-widest uppercase">
                RADAR DROPS
              </span>
            </div>
            <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] uppercase tracking-tight">
              TRENDING DEALS
            </h2>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#111111] hover:text-[#FF6A00] transition-colors border-b border-[#111111] hover:border-[#FF6A00] pb-0.5"
            >
              VIEW ALL {products.length}+ OFFERS <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Filter Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setSelectedSlug(tab.slug)}
              className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                selectedSlug === tab.slug
                  ? 'bg-[#111111] text-[#FF6A00] border-[#111111] font-bold'
                  : 'bg-[#F9F9F9] text-[#111111]/70 border-[#111111]/15 hover:border-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Compact Responsive Grid: 2 cols on mobile, up to 5 on desktop */}
        {displayList.length === 0 ? (
          <div className="py-14 text-center border-2 border-dashed border-neutral-200 bg-[#FAFAFA] p-6">
            <PixelHotIcon className="w-7 h-7 mx-auto mb-2 text-[#FF6A00]" />
            <h3 className="font-pixel text-lg font-bold uppercase text-neutral-800">
              RADAR IS READY FOR LIVE DROPS
            </h3>
            <p className="text-xs font-mono text-neutral-500 mt-1 max-w-sm mx-auto">
              No live deals in this category yet. Add real product links via the admin panel to populate this radar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {displayList.slice(0, 10).map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 5} />
            ))}
          </div>
        )}

        {/* Bottom CTA block */}
        <div className="mt-12 text-center">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#111111] hover:bg-[#FF6A00] text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors rounded-none shadow-sm"
          >
            <span>DISCOVER ALL LIVE FASHION DEALS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
