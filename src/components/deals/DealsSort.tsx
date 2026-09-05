'use client';

import { ArrowUpDown } from 'lucide-react';

interface DealsSortProps {
  currentSort: string;
  onSortChange: (sort: 'latest' | 'discount' | 'price-low' | 'price-high' | 'trending') => void;
}

export default function DealsSort({ currentSort, onSortChange }: DealsSortProps) {
  const options = [
    { label: 'Latest Deals', value: 'latest' },
    { label: 'Highest Discount', value: 'discount' },
    { label: 'Lowest Price', value: 'price-low' },
    { label: 'Trending / Clicks', value: 'trending' }
  ];

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-3.5 h-3.5 text-[#FF6A00]" />
      <span className="text-xs font-mono uppercase tracking-wider text-[#111111]/70 hidden sm:inline">
        SORT BY:
      </span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as any)}
        className="bg-white border border-[#111111]/20 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#111111] focus:outline-none focus:border-[#FF6A00] rounded-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
