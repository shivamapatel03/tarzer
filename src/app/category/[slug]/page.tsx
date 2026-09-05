import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import ProductCard from '@/components/deals/ProductCard';
import { ArrowLeft, Tag } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = db.getCategoryBySlug(slug);
  if (!category) return { title: 'Category Not Found — TARZER' };
  return {
    title: `${category.name} Deals & Offers — TARZER`,
    description: `Discover the best deals and lowest prices on ${category.name} across Amazon, Myntra, Meesho, and Shopsy.`
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = db.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = db.getProducts({ category: slug, status: 'ACTIVE' });
  const allCategories = db.getCategories();

  return (
    <div className="py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#111111]/60 mb-6">
        <Link href="/" className="hover:text-black">HOME</Link>
        <span>/</span>
        <Link href="/deals" className="hover:text-black">CATEGORIES</Link>
        <span>/</span>
        <span className="text-[#FF6A00] font-bold">{category.name}</span>
      </div>

      {/* Category Hero Banner */}
      <div className="relative overflow-hidden bg-[#111111] text-white p-6 sm:p-12 mb-10 border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#FF6A00]" />
            <span className="font-pixel text-xs uppercase tracking-widest text-[#FF6A00]">
              CATEGORY COLLECTION
            </span>
          </div>

          <h1 className="font-pixel text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none text-white">
            {category.name}
          </h1>

          <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed">
            Curated selection of verified low-price {category.name.toLowerCase()} offers across verified online marketplaces.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <span className="bg-[#FF6A00] text-white font-pixel text-xs uppercase tracking-wider px-3 py-1">
              {products.length} DEALS FOUND
            </span>
            <Link
              href="/deals"
              className="text-xs font-mono uppercase text-white/70 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> BROWSE ALL CATEGORIES
            </Link>
          </div>
        </div>

        {/* Category Ambient Image */}
        <div className="absolute top-0 right-0 w-full sm:w-1/2 h-full opacity-25 sm:opacity-40 pointer-events-none">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent" />
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#111111]/10 scrollbar-none">
        <span className="text-xs font-mono uppercase tracking-wider text-[#111111]/50 flex-shrink-0">
          QUICK SWITCH:
        </span>
        {allCategories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border rounded-none transition-colors ${
              c.slug === slug
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white text-[#111111] border-[#111111]/20 hover:border-[#111111]'
            }`}
          >
            {c.name}
          </Link>
        ))}
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
          <span className="font-pixel text-3xl block text-[#111111]/40 mb-2">EMPTY RACK</span>
          <h3 className="font-pixel text-xl font-bold uppercase text-[#111111]">
            NO ACTIVE DEALS IN {category.name.toUpperCase()} RIGHT NOW
          </h3>
          <p className="text-sm text-[#111111]/60 mt-1 max-w-md mx-auto">
            Our deal radar is constantly scanning. Check back soon or explore other categories.
          </p>
          <Link
            href="/deals"
            className="mt-6 inline-block px-6 py-2.5 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#FF6A00] transition-colors"
          >
            VIEW ALL LIVE DEALS
          </Link>
        </div>
      )}
    </div>
  );
}
