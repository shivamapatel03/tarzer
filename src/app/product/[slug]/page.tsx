import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import ProductGallery from './ProductGallery';
import ProductCard from '@/components/deals/ProductCard';
import { ArrowRight, ExternalLink, ShieldCheck, Clock, Tag, Store, Share2 } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = db.getProductBySlug(slug);
  if (!product) return { title: 'Deal Not Found — TARZER' };
  return {
    title: `${product.title} — ${product.discount_percentage}% OFF on ${product.marketplace?.name || 'TARZER'}`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} — ₹${product.current_price} (${product.discount_percentage}% OFF)`,
      description: product.description,
      images: [{ url: product.image_url }]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = db.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = db.getRelatedProducts(product.category_id, product.id, 4);
  const formattedDate = new Date(product.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#111111]/60 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-black">HOME</Link>
        <span>/</span>
        <Link href="/deals" className="hover:text-black">DEALS</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-black">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#FF6A00] truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 border-b border-[#111111]/15">
        
        {/* Left Column: Image Gallery (6 cols) */}
        <div className="lg:col-span-6">
          <ProductGallery
            mainImage={product.image_url}
            images={product.images}
            title={product.title}
          />
        </div>

        {/* Right Column: Deal Specs & Action (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            
            {/* Badges & Marketplace */}
            <div className="flex flex-wrap items-center gap-2.5">
              {product.badge && product.badge !== 'NONE' && (
                <span className="px-2.5 py-1 text-xs font-pixel font-bold bg-[#FF6A00] text-white uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
              {product.marketplace && (
                <Link
                  href={`/brand/${product.marketplace.slug}`}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-[#111111] text-white uppercase tracking-wider hover:bg-[#FF6A00] transition-colors"
                >
                  {product.marketplace.name}
                </Link>
              )}
              <span className="text-xs font-mono text-green-700 bg-green-50 px-2 py-1 font-bold border border-green-200">
                ACTIVE DEAL
              </span>
            </div>

            {/* Product Title */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] leading-tight tracking-tight">
              {product.title}
            </h1>

            {/* Pricing Section */}
            <div className="p-5 bg-[#F5F5F5] border border-[#111111]/10 space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-4xl sm:text-5xl font-black text-[#111111]">
                  ₹{product.current_price.toLocaleString('en-IN')}
                </span>
                <span className="text-lg sm:text-xl text-[#111111]/50 line-through font-mono">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
                <div className="bg-[#FF6A00] text-white font-pixel text-sm sm:text-base font-bold px-3 py-1">
                  {product.discount_percentage}% OFF
                </div>
              </div>
              <p className="text-xs font-mono text-[#111111]/60 uppercase">
                YOU SAVE: ₹{(product.original_price - product.current_price).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Available Sizes (if apparel) */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
                AVAILABLE SIZES:
              </span>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <span
                    key={size}
                    className="w-9 h-9 border border-[#111111]/20 bg-white font-mono text-xs font-bold flex items-center justify-center text-[#111111]"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
                PRODUCT DETAILS:
              </h3>
              <p className="text-sm sm:text-base text-[#111111]/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-3 pt-4">
              <a
                href={`/deal/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FF6A00] hover:bg-[#E55F00] text-white font-bold text-base uppercase tracking-widest py-4 px-6 flex items-center justify-center gap-3 transition-colors shadow-md rounded-none group cursor-pointer"
              >
                <span>GET THIS DEAL</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Price change disclaimer */}
              <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 text-amber-700 mt-0.5" />
                <span>
                  <strong>Price Notice:</strong> Deals change rapidly. Price and availability may vary on {product.marketplace?.name || 'the original marketplace'}. Last verified on {formattedDate}.
                </span>
              </div>
            </div>
          </div>

          {/* Meta specs footer */}
          <div className="pt-6 border-t border-[#111111]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#111111]/60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF6A00]" />
              <span>DIRECT AFFILIATE REDIRECT</span>
            </div>
            <div>
              <span>REF ID: {product.id}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Related Deals Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[#111111]">
            <div>
              <span className="text-xs font-pixel text-[#FF6A00] tracking-widest uppercase block mb-1">
                YOU MIGHT ALSO LIKE
              </span>
              <h2 className="font-pixel text-2xl sm:text-3xl font-extrabold uppercase text-[#111111]">
                RELATED FASHION DEALS
              </h2>
            </div>
            <Link
              href="/deals"
              className="text-xs font-mono uppercase tracking-wider text-[#111111] hover:text-[#FF6A00] font-bold"
            >
              EXPLORE MORE →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
