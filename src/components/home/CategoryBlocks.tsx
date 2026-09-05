import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '@/lib/types';

interface CategoryBlocksProps {
  categories: Category[];
}

export default function CategoryBlocks({ categories }: CategoryBlocksProps) {
  return (
    <section id="categories" className="py-16 md:py-24 bg-white border-b border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b-2 border-[#111111]">
          <div>
            <span className="text-xs font-pixel text-[#FF6A00] tracking-widest uppercase block mb-1">
              CATEGORY ARCHIVE
            </span>
            <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] uppercase tracking-tight">
              SHOP BY CATEGORY
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#111111]/60 uppercase tracking-wider mt-2 md:mt-0">
            DISCOVER LOWEST PRICES ACROSS ALL GENRES
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative h-48 sm:h-60 md:h-72 overflow-hidden bg-[#111111] flex flex-col justify-end p-4 border border-[#111111]/10 hover:border-[#FF6A00] transition-all"
            >
              {/* Background Image with Hover Zoom */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover object-center opacity-70 group-hover:opacity-90 group-hover:scale-108 transition-all duration-500 ease-out"
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Orange Accent Bar (revealed on hover) */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF6A00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Category Info */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                    {cat.product_count !== undefined ? `${cat.product_count} OFFERS` : 'EXPLORE'}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#FF6A00] -translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </div>
                <h3 className="font-pixel text-base sm:text-lg md:text-xl font-bold text-white uppercase tracking-tight group-hover:text-[#FF6A00] transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
