'use client';

import { Category, Marketplace } from '@/lib/types';
import { Filter, X, RotateCcw } from 'lucide-react';

interface DealsFilterProps {
  categories: Category[];
  marketplaces: Marketplace[];
  selectedCategory?: string;
  selectedMarketplace?: string;
  selectedDiscount?: number;
  selectedPriceRange?: string;
  onCategoryChange: (slug?: string) => void;
  onMarketplaceChange: (slug?: string) => void;
  onDiscountChange: (discount?: number) => void;
  onPriceRangeChange: (range?: string) => void;
  onReset: () => void;
}

export default function DealsFilter({
  categories,
  marketplaces,
  selectedCategory,
  selectedMarketplace,
  selectedDiscount,
  selectedPriceRange,
  onCategoryChange,
  onMarketplaceChange,
  onDiscountChange,
  onPriceRangeChange,
  onReset
}: DealsFilterProps) {
  const discountOptions = [
    { label: 'All Discounts', value: 0 },
    { label: '30% Off or more', value: 30 },
    { label: '50% Off or more', value: 50 },
    { label: '60% Off or more', value: 60 },
    { label: '70% Off or more', value: 70 }
  ];

  const priceOptions = [
    { label: 'All Prices', value: '' },
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 – ₹1,000', value: '500-1000' },
    { label: '₹1,000 – ₹2,000', value: '1000-2000' },
    { label: '₹2,000 & Above', value: '2000-99999' }
  ];

  const hasActiveFilters = Boolean(
    selectedCategory || selectedMarketplace || selectedDiscount || selectedPriceRange
  );

  return (
    <aside className="w-full space-y-6">
      {/* Filter Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#111111]/20">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF6A00]" />
          <span className="font-pixel text-sm uppercase tracking-wider text-[#111111] font-bold">
            FILTERS
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-mono uppercase text-[#FF6A00] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Marketplaces / Stores Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-pixel uppercase tracking-widest text-[#111111]/70 font-semibold">
          MARKETPLACE
        </h4>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onMarketplaceChange(undefined)}
            className={`px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider border rounded-none cursor-pointer transition-colors ${
              !selectedMarketplace
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white text-[#111111] border-[#111111]/20 hover:border-[#111111]'
            }`}
          >
            All Stores
          </button>
          {marketplaces.map((mp) => (
            <button
              key={mp.id}
              onClick={() => onMarketplaceChange(selectedMarketplace === mp.slug ? undefined : mp.slug)}
              className={`px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider border rounded-none cursor-pointer transition-colors ${
                selectedMarketplace === mp.slug
                  ? 'bg-[#FF6A00] text-white border-[#FF6A00]'
                  : 'bg-white text-[#111111] border-[#111111]/20 hover:border-[#111111]'
              }`}
            >
              {mp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-pixel uppercase tracking-widest text-[#111111]/70 font-semibold">
          CATEGORY
        </h4>
        <div className="flex flex-col space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`text-left px-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              !selectedCategory ? 'bg-[#111111] text-white' : 'text-[#111111]/80 hover:bg-[#F5F5F5]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(selectedCategory === cat.slug ? undefined : cat.slug)}
              className={`flex items-center justify-between text-left px-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-[#FF6A00] text-white'
                  : 'text-[#111111]/80 hover:bg-[#F5F5F5]'
              }`}
            >
              <span>{cat.name}</span>
              {cat.product_count !== undefined && (
                <span className="text-[10px] font-mono opacity-60">({cat.product_count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Discount Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-pixel uppercase tracking-widest text-[#111111]/70 font-semibold">
          DISCOUNT
        </h4>
        <div className="space-y-1.5">
          {discountOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onDiscountChange(opt.value === 0 ? undefined : opt.value)}
              className={`w-full text-left px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider border rounded-none cursor-pointer transition-colors ${
                (selectedDiscount || 0) === opt.value
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-[#111111] border-[#111111]/15 hover:border-[#111111]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-pixel uppercase tracking-widest text-[#111111]/70 font-semibold">
          PRICE RANGE
        </h4>
        <div className="space-y-1.5">
          {priceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onPriceRangeChange(opt.value === '' ? undefined : opt.value)}
              className={`w-full text-left px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider border rounded-none cursor-pointer transition-colors ${
                (selectedPriceRange || '') === opt.value
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-[#111111] border-[#111111]/15 hover:border-[#111111]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
