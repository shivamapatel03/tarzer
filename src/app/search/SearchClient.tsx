'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowRight, TrendingUp } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/deals/ProductCard';

interface SearchClientProps {
  initialProducts: Product[];
  query: string;
}

export default function SearchClient({ initialProducts, query: initialQuery }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const suggestions = ['Acid Wash T-Shirt', 'Streetwear Hoodies', 'Combat Boots', 'Bomber Jackets', 'Raw Denim Jeans'];

  return (
    <div className="py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#111111]/60 mb-6">
        <Link href="/" className="hover:text-black">HOME</Link>
        <span>/</span>
        <span className="text-[#FF6A00] font-bold">SEARCH RADAR</span>
      </div>

      {/* Search Header Form */}
      <div className="bg-[#111111] text-white p-6 sm:p-10 mb-10 border border-white/10">
        <span className="text-xs font-pixel text-[#FF6A00] tracking-widest uppercase block mb-2">
          DEAL SEARCH RADAR
        </span>
        <h1 className="font-pixel text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-6">
          FIND FASHION DEALS
        </h1>

        <form onSubmit={handleSearch} className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, jackets, tees, sneakers..."
            className="w-full bg-white/10 border border-white/20 text-white pl-12 pr-28 py-4 text-base md:text-lg focus:outline-none focus:border-[#FF6A00] rounded-none transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 bg-[#FF6A00] hover:bg-[#E55F00] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer"
          >
            SEARCH
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-white/50 uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#FF6A00]" /> POPULAR:
          </span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSearchTerm(s);
                router.push(`/search?q=${encodeURIComponent(s)}`);
              }}
              className="text-xs font-mono uppercase px-2.5 py-1 bg-white/10 hover:bg-[#FF6A00] text-white transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-4 mb-8 border-b-2 border-[#111111]">
        <div>
          <span className="text-xs font-mono uppercase text-[#111111]/60">SEARCH QUERY:</span>
          <h2 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-[#111111]">
            &ldquo;{initialQuery}&rdquo;
          </h2>
        </div>
        <div className="bg-[#111111] text-white font-pixel text-xs uppercase px-3 py-1.5">
          {initialProducts.length} RESULTS
        </div>
      </div>

      {/* Grid Results */}
      {initialProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {initialProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#F5F5F5] border border-[#111111]/10 p-8">
          <span className="font-pixel text-4xl block text-[#111111]/30 mb-2">NO MATCHES</span>
          <h3 className="font-pixel text-xl font-bold uppercase text-[#111111]">
            NO OFFERS FOUND FOR &ldquo;{initialQuery}&rdquo;
          </h3>
          <p className="text-sm text-[#111111]/60 mt-2 max-w-md mx-auto">
            Try checking for typos, searching broader keywords like &quot;shirts&quot;, &quot;shoes&quot;, or browse our entire catalog.
          </p>
          <Link
            href="/deals"
            className="mt-6 inline-block px-6 py-3 bg-[#111111] hover:bg-[#FF6A00] text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none"
          >
            EXPLORE ALL DEALS
          </Link>
        </div>
      )}
    </div>
  );
}
