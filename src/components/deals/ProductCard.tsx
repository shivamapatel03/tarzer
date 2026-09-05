'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const badgeStyle = {
    'HOT DEAL': 'bg-[#FF6A00] text-white',
    'LOWEST PRICE': 'bg-[#111111] text-white',
    'LIMITED OFFER': 'bg-white text-[#111111] border border-[#111111]',
    'TARZER PICK': 'bg-[#FF6A00] text-white',
    'NONE': 'hidden'
  }[product.badge || 'HOT DEAL'] || 'bg-[#FF6A00] text-white';

  return (
    <div className="group relative flex flex-col bg-white border border-[#111111]/10 hover:border-[#111111] transition-all duration-200 shadow-xs">
      {/* Product Image & Badges - Compact 1:1 Aspect Ratio */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {product.badge && product.badge !== 'NONE' && (
            <span className={`px-1.5 py-0.5 text-[9px] font-pixel font-bold uppercase tracking-wider rounded-none shadow-xs ${badgeStyle}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Bold Orange Discount Block */}
        <div className="absolute top-2 right-2 bg-[#FF6A00] text-white px-1.5 py-0.5 font-pixel text-[10px] font-bold tracking-wider rounded-none shadow-xs">
          {product.discount_percentage}% OFF
        </div>

        {/* Marketplace Pill overlay on image bottom */}
        <div className="absolute bottom-2 left-2 bg-[#111111]/90 backdrop-blur-xs text-white text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-none">
          {product.marketplace?.name || 'STORE'}
        </div>
      </div>

      {/* Card Content - Compact Padding & Sizing */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-grow justify-between">
        <div>
          {/* Category breadcrumb */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#111111]/60 uppercase mb-1">
            <span className="truncate max-w-[65%]">{product.category?.name || 'FASHION'}</span>
            <span className="text-[9px] text-green-600 font-bold flex-shrink-0">VERIFIED</span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-[#111111] line-clamp-2 leading-snug group-hover:text-[#FF6A00] transition-colors mb-1.5" title={product.title}>
              {product.title}
            </h3>
          </Link>
        </div>

        <div>
          {/* Pricing Row */}
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-base sm:text-lg font-display font-extrabold text-[#111111]">
              ₹{product.current_price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] sm:text-xs text-[#111111]/45 line-through font-mono">
              ₹{product.original_price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Action CTA Button */}
          <div className="pt-1 border-t border-[#111111]/10">
            <a
              href={`/deal/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#111111] hover:bg-[#FF6A00] text-white font-bold text-[11px] uppercase tracking-wider py-2 px-2 flex items-center justify-center gap-1.5 transition-colors rounded-none group-hover:bg-[#FF6A00]"
            >
              <span>VIEW DEAL</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
