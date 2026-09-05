import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import ProductCard from '@/components/deals/ProductCard';
import StoreLogo from '@/components/ui/StoreLogo';
import { ArrowLeft, Store, ExternalLink } from 'lucide-react';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BrandPageProps) {
  const { slug } = await params;
  const marketplace = db.getMarketplaceBySlug(slug);
  if (!marketplace) return { title: 'Store Not Found — TARZER' };
  return {
    title: `${marketplace.name} Fashion Deals & Offers — TARZER`,
    description: `Discover lowest price fashion deals, discount sales, and curated clothing offers on ${marketplace.name}.`
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const marketplace = db.getMarketplaceBySlug(slug);

  if (!marketplace) {
    notFound();
  }

  const products = db.getProducts({ marketplace: slug, status: 'ACTIVE' });
  const allMarketplaces = db.getMarketplaces();

  return (
    <div className="py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#111111]/60 mb-6">
        <Link href="/" className="hover:text-black">HOME</Link>
        <span>/</span>
        <Link href="/deals" className="hover:text-black">STORES</Link>
        <span>/</span>
        <span className="text-[#FF6A00] font-bold">{marketplace.name}</span>
      </div>

      {/* Brand Header Banner */}
      <div className="bg-[#111111] text-white p-6 sm:p-12 mb-10 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#FF6A00]" />
            <span className="font-pixel text-xs uppercase tracking-widest text-[#FF6A00]">
              PARTNER MARKETPLACE
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white p-2.5 inline-flex items-center justify-center">
              <StoreLogo slug={marketplace.slug} name={marketplace.name} className="h-9 sm:h-11 w-auto" height={44} />
            </div>
          </div>

          <h1 className="font-pixel text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none text-white">
            {marketplace.name} DEALS
          </h1>

          <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed">
            All curated fashion drops and deals available on {marketplace.name}. Clicks automatically route you to genuine verified seller listings.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <span className="bg-[#FF6A00] text-white font-pixel text-xs uppercase tracking-wider px-3 py-1">
              {products.length} VERIFIED DEALS
            </span>
            <a
              href={marketplace.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase text-white/70 hover:text-white flex items-center gap-1 hover:underline"
            >
              VISIT OFFICIAL WEBSITE <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Back to All Stores */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">OTHER STORES</span>
          <div className="flex flex-wrap md:flex-col gap-2">
            {allMarketplaces.map((m) => (
              <Link
                key={m.id}
                href={`/brand/${m.slug}`}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border text-center transition-colors ${
                  m.slug === slug
                    ? 'bg-[#FF6A00] text-white border-[#FF6A00]'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
              >
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid - Compact Layout */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#F5F5F5] border border-[#111111]/10 p-8">
          <span className="font-pixel text-3xl block text-[#111111]/40 mb-2">NO OFFERS</span>
          <h3 className="font-pixel text-xl font-bold uppercase text-[#111111]">
            NO ACTIVE DEALS ON {marketplace.name.toUpperCase()} CURRENTLY
          </h3>
          <p className="text-sm text-[#111111]/60 mt-1 max-w-md mx-auto">
            Check back shortly or explore offers from other supported stores.
          </p>
          <Link
            href="/deals"
            className="mt-6 inline-block px-6 py-2.5 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#FF6A00] transition-colors"
          >
            VIEW ALL ACTIVE DEALS
          </Link>
        </div>
      )}
    </div>
  );
}
