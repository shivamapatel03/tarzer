import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Flame, ShieldCheck } from 'lucide-react';
import { Product } from '@/lib/types';

interface FeaturedOfferProps {
  product: Product | null;
}

export default function FeaturedOffer({ product }: FeaturedOfferProps) {
  if (!product) return null;

  return (
    <section className="py-16 md:py-24 bg-[#111111] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Tag */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 bg-[#FF6A00] inline-block"></span>
          <span className="font-pixel text-xs uppercase tracking-widest text-[#FF6A00]">
            EDITORIAL SPOTLIGHT
          </span>
        </div>

        {/* Asymmetric Minimal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white/5 border border-white/10 p-6 sm:p-10 md:p-14">
          
          {/* Left Column: Huge Asymmetric Typography & Specs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-white/50 block">
                CURATED SELECTION · 24H EXCLUSIVE
              </span>
              <h2 className="font-pixel text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.95] text-white uppercase">
                TARZER<br />
                <span className="text-[#FF6A00]">DEAL OF THE DAY</span>
              </h2>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-[#FF6A00] text-white font-pixel text-xs uppercase tracking-wider">
                  {product.badge || 'HOT DEAL'}
                </span>
                <span className="text-xs font-mono text-white/70 uppercase">
                  STORE: {product.marketplace?.name || 'AMAZON'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {product.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>

            {/* Price & Discount Showcase */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-baseline gap-4 sm:gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">OFFER PRICE</span>
                <span className="font-display text-4xl sm:text-5xl font-black text-white">
                  ₹{product.current_price.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">ORIGINAL MRP</span>
                <span className="font-mono text-xl sm:text-2xl text-white/40 line-through">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-[#FF6A00] text-white font-pixel text-base sm:text-lg font-bold px-3.5 py-1.5 self-center">
                {product.discount_percentage}% OFF
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={`/deal/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF6A00] hover:bg-[#E55F00] text-white font-bold text-sm sm:text-base uppercase tracking-widest px-8 py-4.5 flex items-center gap-2.5 transition-colors rounded-none shadow-lg cursor-pointer"
              >
                <span>GET DEAL</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <Link
                href={`/product/${product.slug}`}
                className="text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white hover:underline transition-colors px-4 py-2"
              >
                VIEW FULL DETAILS →
              </Link>
            </div>
          </div>

          {/* Right Column: Large Product Image (5 cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative aspect-[3/4] w-full bg-black overflow-hidden border border-white/20 group">
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute top-4 right-4 bg-[#111111]/90 backdrop-blur-xs text-white font-mono text-xs px-3 py-1 uppercase tracking-widest">
                VERIFIED LOWEST PRICE
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
