'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { Product, Category, Marketplace } from '@/lib/types';
import ProductCard from '@/components/deals/ProductCard';
import DealsFilter from '@/components/deals/DealsFilter';
import DealsSort from '@/components/deals/DealsSort';

interface DealsClientProps {
  initialProducts: Product[];
  categories: Category[];
  marketplaces: Marketplace[];
}

export default function DealsClient({
  initialProducts,
  categories,
  marketplaces
}: DealsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State from URL query or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    searchParams.get('category') || undefined
  );
  const [selectedMarketplace, setSelectedMarketplace] = useState<string | undefined>(
    searchParams.get('marketplace') || undefined
  );
  const [selectedDiscount, setSelectedDiscount] = useState<number | undefined>(
    searchParams.get('minDiscount') ? Number(searchParams.get('minDiscount')) : undefined
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | undefined>(
    searchParams.get('priceRange') || undefined
  );
  const [sort, setSort] = useState<'latest' | 'discount' | 'price-low' | 'price-high' | 'trending'>(
    (searchParams.get('sort') as any) || 'latest'
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter & sort products locally for instant response
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Status
        if (p.status !== 'ACTIVE') return false;

        // Search query
        if (searchQuery.trim()) {
          const term = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(term);
          const matchDesc = p.description.toLowerCase().includes(term);
          const matchCat = p.category?.name.toLowerCase().includes(term);
          const matchMp = p.marketplace?.name.toLowerCase().includes(term);
          if (!matchTitle && !matchDesc && !matchCat && !matchMp) return false;
        }

        // Category
        if (selectedCategory && p.category?.slug !== selectedCategory) {
          return false;
        }

        // Marketplace
        if (selectedMarketplace && p.marketplace?.slug !== selectedMarketplace) {
          return false;
        }

        // Minimum discount
        if (selectedDiscount && p.discount_percentage < selectedDiscount) {
          return false;
        }

        // Price range
        if (selectedPriceRange) {
          const [min, max] = selectedPriceRange.split('-').map(Number);
          if (p.current_price < min || p.current_price > max) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === 'discount') {
          return b.discount_percentage - a.discount_percentage;
        }
        if (sort === 'price-low') {
          return a.current_price - b.current_price;
        }
        if (sort === 'price-high') {
          return b.current_price - a.current_price;
        }
        if (sort === 'trending') {
          return (b.clicks_count || 0) - (a.clicks_count || 0);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [
    initialProducts,
    searchQuery,
    selectedCategory,
    selectedMarketplace,
    selectedDiscount,
    selectedPriceRange,
    sort
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setSelectedMarketplace(undefined);
    setSelectedDiscount(undefined);
    setSelectedPriceRange(undefined);
    setSort('latest');
  };

  return (
    <div className="py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="pb-8 mb-8 border-b-2 border-[#111111] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#FF6A00] inline-block"></span>
            <span className="font-pixel text-xs uppercase tracking-widest text-[#FF6A00]">
              DEAL DISCOVERY ENGINE
            </span>
          </div>
          <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#111111] uppercase tracking-tight leading-[0.95]">
            THE BEST DEALS.<br />
            <span className="text-[#FF6A00]">ZERO SEARCHING.</span>
          </h1>
        </div>

        <div className="flex flex-col md:items-end">
          <div className="bg-[#111111] text-white px-3.5 py-1.5 font-pixel text-sm uppercase tracking-wider inline-block">
            {filteredProducts.length} ACTIVE OFFERS
          </div>
          <span className="text-xs font-mono text-[#111111]/50 uppercase mt-1">
            UPDATED EVERY 15 MINUTES
          </span>
        </div>
      </div>

      {/* Search Bar & Mobile Filter Trigger */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals by keywords, clothing type, or brand..."
            className="w-full bg-[#F5F5F5] pl-10 pr-4 py-3 text-sm font-medium border border-[#111111]/15 focus:outline-none focus:border-[#111111] focus:bg-white rounded-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#111111]/50 hover:text-black"
            >
              CLEAR
            </button>
          )}
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          {/* Mobile Filters button */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort dropdown */}
          <DealsSort currentSort={sort} onSortChange={setSort} />
        </div>
      </div>

      {/* Main Grid Layout: Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar (3 cols) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24 bg-[#FAFAFA] p-5 border border-[#111111]/10">
          <DealsFilter
            categories={categories}
            marketplaces={marketplaces}
            selectedCategory={selectedCategory}
            selectedMarketplace={selectedMarketplace}
            selectedDiscount={selectedDiscount}
            selectedPriceRange={selectedPriceRange}
            onCategoryChange={setSelectedCategory}
            onMarketplaceChange={setSelectedMarketplace}
            onDiscountChange={setSelectedDiscount}
            onPriceRangeChange={setSelectedPriceRange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#111111]/10 mb-4">
                  <span className="font-pixel text-sm uppercase font-bold text-[#111111]">
                    FILTER CATALOG
                  </span>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-1">
                    <X className="w-5 h-5 text-[#111111]" />
                  </button>
                </div>
                <DealsFilter
                  categories={categories}
                  marketplaces={marketplaces}
                  selectedCategory={selectedCategory}
                  selectedMarketplace={selectedMarketplace}
                  selectedDiscount={selectedDiscount}
                  selectedPriceRange={selectedPriceRange}
                  onCategoryChange={setSelectedCategory}
                  onMarketplaceChange={setSelectedMarketplace}
                  onDiscountChange={setSelectedDiscount}
                  onPriceRangeChange={setSelectedPriceRange}
                  onReset={handleResetFilters}
                />
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#FF6A00] text-white font-bold py-3 uppercase tracking-wider text-xs mt-6"
              >
                APPLY FILTERS ({filteredProducts.length})
              </button>
            </div>
          </div>
        )}

        {/* Product Grid (9 cols) */}
        <div className="lg:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#F5F5F5] border border-[#111111]/10 p-8">
              <span className="font-pixel text-4xl block text-[#111111]/30 mb-2">0 RESULTS</span>
              <h3 className="font-pixel text-xl font-bold text-[#111111] uppercase">
                NO DEALS MATCH YOUR FILTERS
              </h3>
              <p className="text-sm text-[#111111]/60 mt-1 max-w-md mx-auto">
                Try loosening your filters, removing discount restrictions, or resetting all criteria to view all deals.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2.5 bg-[#FF6A00] text-white font-bold text-xs uppercase tracking-wider rounded-none hover:bg-[#E55F00] transition-colors"
              >
                RESET ALL FILTERS
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
