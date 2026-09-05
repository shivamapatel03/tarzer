'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryItem {
  name: string;
  slug: string;
  image: string;
}

function formatCategoryTitle(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  if (lower === 'gen z') return 'Gen Z';
  if (lower === 't-shirts') return 'T-Shirts';
  return trimmed
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    name: 'Men',
    slug: 'men',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'Women',
    slug: 'women',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'Kids',
    slug: 'kids',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'Streetwear',
    slug: 'streetwear',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'Gen Z',
    slug: 'gen-z',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'Korean',
    slug: 'korean',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'Hoodies',
    slug: 'hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'Jackets',
    slug: 'jackets',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'Jeans',
    slug: 'jeans',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=85',
  },
  {
    name: 'Shirts',
    slug: 'shirts',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=85',
  },
];

export default function CategoryBar() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll positions for edge indicators and arrows
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  // Fetch dynamic categories from API
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data.categories) && data.categories.length > 0) {
          const fallbackMap = new Map(DEFAULT_CATEGORIES.map((c) => [c.slug, c.image]));

          const fetched: CategoryItem[] = data.categories.map(
            (c: { name: string; slug: string; image?: string }) => ({
              name: c.name,
              slug: c.slug,
              image: c.image || fallbackMap.get(c.slug) || DEFAULT_CATEGORIES[0].image,
            })
          );

          const prioritySlugs = [
            'men',
            'women',
            'kids',
            'streetwear',
            'gen-z',
            'korean',
            't-shirts',
            'hoodies',
            'jackets',
            'jeans',
            'shoes',
            'shirts',
          ];

          const sorted = [...fetched].sort((a, b) => {
            const indexA = prioritySlugs.indexOf(a.slug);
            const indexB = prioritySlugs.indexOf(b.slug);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.name.localeCompare(b.name);
          });

          setCategories(sorted);
        }
      } catch (err) {
        console.error('Failed to load categories in CategoryBar:', err);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = 280;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="w-full bg-white border-b border-[#111111]/10 relative z-20 select-none py-2.5 sm:py-3.5">
      <div className="max-w-7xl mx-auto relative flex items-center justify-center">
        {/* Left Arrow (Desktop only) */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-2 z-30 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-neutral-200 text-neutral-800 hover:text-[#FF6A00] hover:border-[#FF6A00] items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Circular Category Stories Container Perfectly Centered */}
        <nav
          ref={scrollRef}
          onScroll={checkScroll}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth flex justify-start md:justify-center px-4 sm:px-6 lg:px-8 py-1"
        >
          <div className="flex items-center justify-center gap-3.5 sm:gap-5 md:gap-6 shrink-0 md:mx-auto">
            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center shrink-0 cursor-pointer"
                >
                  {/* Circular Avatar with Subtle Pixel Animated Orange Ring */}
                  <div className="relative">
                    {/* Rotating Pixel Dashed Orange Ring on Hover / Active */}
                    <div
                      className={`absolute -inset-[2px] rounded-full pointer-events-none transition-opacity duration-200 z-10 ${
                        isActive
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full animate-pixel-spin"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="none"
                          stroke="#FF6A00"
                          strokeWidth="2.5"
                          strokeDasharray="6 5"
                          strokeLinecap="square"
                        />
                      </svg>
                    </div>

                    {/* Circular Avatar */}
                    <div
                      className={`relative w-13 h-13 sm:w-15 sm:h-15 md:w-17 md:h-17 rounded-full p-0.5 border transition-colors duration-200 ${
                        isActive
                          ? 'border-[#FF6A00]'
                          : 'border-neutral-200 group-hover:border-transparent'
                      }`}
                    >
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-100">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 52px, (max-width: 768px) 60px, 68px"
                          className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-200 ease-out"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Simple Category Label */}
                  <span
                    className={`text-[11px] sm:text-xs font-semibold tracking-normal transition-colors mt-1.5 text-center whitespace-nowrap ${
                      isActive
                        ? 'text-[#FF6A00] font-bold'
                        : 'text-neutral-900 group-hover:text-[#FF6A00]'
                    }`}
                  >
                    {formatCategoryTitle(cat.name)}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right Arrow (Desktop only) */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-2 z-30 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-neutral-200 text-neutral-800 hover:text-[#FF6A00] hover:border-[#FF6A00] items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
