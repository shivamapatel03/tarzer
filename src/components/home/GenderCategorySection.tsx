'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/lib/types';

interface GenderCategorySectionProps {
  categories: Category[];
}

const GENDER_AESTHETICS = [
  {
    name: 'MEN',
    slug: 'men',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&q=80',
  },
  {
    name: 'WOMEN',
    slug: 'women',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  },
  {
    name: 'KIDS',
    slug: 'kids',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&q=80',
  },
  {
    name: 'STREETWEAR',
    slug: 'streetwear',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80',
  },
  {
    name: 'GEN Z',
    slug: 'gen-z',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  },
  {
    name: 'KOREAN',
    slug: 'korean',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80',
  }
];

export default function GenderCategorySection({ categories }: GenderCategorySectionProps) {
  // Map live categories to merge active product counts
  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

  return (
    <section className="py-4 sm:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header (clean with no divider line) */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF6A00] inline-block" />
            <h3 className="font-pixel text-xs sm:text-sm font-extrabold text-[#111111] uppercase tracking-wider">
              SHOP BY GENDER & VIBE
            </h3>
          </div>
          <Link
            href="/deals"
            className="text-[10px] sm:text-xs font-mono font-bold text-[#111111]/60 hover:text-[#FF6A00] uppercase tracking-wider transition-colors"
          >
            VIEW ALL DEALS →
          </Link>
        </div>

        {/* Circular Category Bubbles - Compact Story Style */}
        <div className="flex items-center justify-start sm:justify-center gap-5 sm:gap-8 md:gap-12 overflow-x-auto pb-2 scrollbar-none">
          {GENDER_AESTHETICS.map((item) => {
            const dbCat = categoryMap.get(item.slug);
            const count = dbCat?.product_count ?? 12;
            const imgSrc = dbCat?.image || item.image;

            return (
              <Link
                key={item.slug}
                href={`/category/${item.slug}`}
                className="group flex flex-col items-center flex-shrink-0 cursor-pointer"
              >
                {/* Circular Image Bubble */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full p-1 border-2 border-[#111111]/15 group-hover:border-[#FF6A00] transition-colors duration-200">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-[#111111]">
                    <Image
                      src={imgSrc}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 64px, 88px"
                      className="object-cover group-hover:scale-115 transition-transform duration-300 ease-out"
                    />
                  </div>
                </div>

                {/* Category Label */}
                <span className="font-pixel text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wide text-[#111111] group-hover:text-[#FF6A00] transition-colors mt-2 text-center">
                  {item.name}
                </span>

                {/* Subtext offer count */}
                <span className="text-[9px] font-mono text-[#111111]/50 uppercase tracking-tight -mt-0.5">
                  {count > 0 ? `${count} OFFERS` : 'EXPLORE'}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
