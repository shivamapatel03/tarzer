'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PixelSearchIcon, PixelCloseIcon, PixelArrowRight, PixelTrendingUp } from '@/components/ui/PixelIcons';
import { Product } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#111111]/80 backdrop-blur-md transition-all">
      <div className="w-full max-w-4xl mx-auto px-4 pt-8 md:pt-16 pb-6">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between pb-4 border-b border-white/20">
          <span className="font-pixel text-xs tracking-widest text-[#FF6A00]">TARZER SEARCH</span>
          <button
            onClick={onClose}
            className="text-white hover:text-[#FF6A00] transition-colors p-2 cursor-pointer"
            aria-label="Close search"
          >
            <PixelCloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative mt-4">
          <PixelSearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 text-white/50" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH STREETWEAR, HOODIES, SHOES, AMAZON DEALS..."
            className="w-full bg-transparent pl-12 pr-24 py-4 text-xl md:text-3xl font-display text-white placeholder-white/40 focus:outline-none border-b-2 border-white/30 focus:border-[#FF6A00] transition-colors tracking-tight uppercase"
          />
          {query && (
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#FF6A00] hover:bg-[#E55F00] text-white font-bold px-4 py-2 text-sm uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              Search <PixelArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Trending Suggestions when input is empty */}
        {!query && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-3 flex items-center gap-2">
              <PixelTrendingUp className="w-4 h-4 text-[#FF6A00]" /> Trending Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Acid Wash T-Shirt', 'Parachute Pants', 'Sneakers Under ₹1499', 'Winter Jackets 70% Off', 'Myntra Deals', 'Amazon Fashion', 'Streetwear Hoodies'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                  }}
                  className="bg-white/10 hover:bg-[#FF6A00] text-white text-xs uppercase tracking-wider px-3 py-2 font-medium transition-colors cursor-pointer border border-white/10"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {query && (
          <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs uppercase tracking-widest text-white/60">
                {loading ? 'Searching catalog...' : `${results.length} deals found`}
              </p>
              {results.length > 0 && (
                <button
                  onClick={handleSubmit}
                  className="text-xs text-[#FF6A00] hover:underline uppercase tracking-wider font-bold"
                >
                  View All Results →
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {results.slice(0, 6).map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="group flex gap-3 p-2 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#FF6A00] transition-all"
                >
                  <div className="relative w-16 h-20 bg-black flex-shrink-0 overflow-hidden">
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[10px] font-pixel text-[#FF6A00] uppercase tracking-wider">
                      {product.marketplace?.name || 'STORE'} · {product.discount_percentage}% OFF
                    </span>
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#FF6A00] transition-colors">
                      {product.title}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-white">₹{product.current_price}</span>
                      <span className="text-xs text-white/50 line-through">₹{product.original_price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {!loading && results.length === 0 && (
              <div className="text-center py-12 text-white/50">
                <p className="font-display text-lg">No fashion deals found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs mt-1">Try searching for tees, jackets, sneakers or store names.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
