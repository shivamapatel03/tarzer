import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import {
  Package,
  Flame,
  MousePointerClick,
  TrendingUp,
  Store,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Tag,
  Sliders,
  Sparkles,
  Zap
} from 'lucide-react';

export const revalidate = 0;

export default function AdminDashboardPage() {
  const analytics = db.getAnalytics();

  return (
    <div className="space-y-6">
      {/* Header section with clean minimalist typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-mono text-[#FF6A00] uppercase tracking-wider block font-bold">
            OVERVIEW & CONTROLS
          </span>
          <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-[#111111] tracking-tight">
            ADMIN DASHBOARD
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>IMPORT PRODUCT LINK</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Cards / Navigation Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/products"
          className="bg-white p-3.5 border border-neutral-200 hover:border-[#111111] transition-all flex items-center gap-3 group"
        >
          <div className="p-2 bg-neutral-100 group-hover:bg-[#111111] group-hover:text-white transition-colors">
            <Package className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-mono font-bold uppercase block text-neutral-900 group-hover:text-[#FF6A00] transition-colors truncate">
              Catalog ({analytics.totalProducts})
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Manage all items</span>
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-white p-3.5 border border-neutral-200 hover:border-[#111111] transition-all flex items-center gap-3 group"
        >
          <div className="p-2 bg-neutral-100 group-hover:bg-[#111111] group-hover:text-white transition-colors">
            <Tag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-mono font-bold uppercase block text-neutral-900 group-hover:text-[#FF6A00] transition-colors truncate">
              Categories
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Filter tags</span>
          </div>
        </Link>

        <Link
          href="/admin/brands"
          className="bg-white p-3.5 border border-neutral-200 hover:border-[#111111] transition-all flex items-center gap-3 group"
        >
          <div className="p-2 bg-neutral-100 group-hover:bg-[#111111] group-hover:text-white transition-colors">
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-mono font-bold uppercase block text-neutral-900 group-hover:text-[#FF6A00] transition-colors truncate">
              Stores & Brands
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Amazon, Myntra...</span>
          </div>
        </Link>

        <Link
          href="/admin/hero"
          className="bg-white p-3.5 border border-neutral-200 hover:border-[#111111] transition-all flex items-center gap-3 group"
        >
          <div className="p-2 bg-neutral-100 group-hover:bg-[#111111] group-hover:text-white transition-colors">
            <Sliders className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-mono font-bold uppercase block text-neutral-900 group-hover:text-[#FF6A00] transition-colors truncate">
              Hero Banners
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Homepage slides</span>
          </div>
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Total Catalog</span>
            <Package className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl sm:text-4xl font-black text-neutral-900">
              {analytics.totalProducts}
            </span>
            <span className="text-[11px] font-mono text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 font-bold">
              LIVE
            </span>
          </div>
        </div>

        {/* Active Deals */}
        <div className="bg-white p-5 border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Active Radar Deals</span>
            <Flame className="w-4 h-4 text-[#FF6A00]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl sm:text-4xl font-black text-[#FF6A00]">
              {analytics.activeDeals}
            </span>
            <span className="text-[11px] font-mono text-neutral-900 bg-neutral-100 px-2 py-0.5 font-bold">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="bg-white p-5 border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Affiliate Clicks</span>
            <MousePointerClick className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl sm:text-4xl font-black text-neutral-900">
              {analytics.totalClicks}
            </span>
            <span className="text-[11px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 font-bold">
              TRACKED
            </span>
          </div>
        </div>
      </div>

      {/* Highlights: Top Performing Deal & Top Marketplace Traffic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Product */}
        <div className="bg-white p-5 border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#FF6A00] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> TOP CONVERTING DEAL
            </span>
            <span className="text-[10px] font-mono text-neutral-400">BY CLICKS</span>
          </div>
          {analytics.topPerformingProduct ? (
            <div className="flex items-center gap-4 pt-1">
              {analytics.topPerformingProduct.image_url && (
                <div className="relative w-16 h-20 bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                  <Image
                    src={analytics.topPerformingProduct.image_url}
                    alt={analytics.topPerformingProduct.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-sm text-neutral-900 truncate">
                  {analytics.topPerformingProduct.title}
                </h4>
                <p className="text-xs font-mono text-neutral-500">
                  ₹{analytics.topPerformingProduct.current_price} · {analytics.topPerformingProduct.discount_percentage}% OFF
                </p>
                <div className="inline-block bg-[#111111] text-white text-[10px] font-mono px-2 py-0.5 font-bold">
                  {analytics.topPerformingProduct.clicks || 0} CLICKS LOGGED
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 font-mono py-4 text-center">No clicks recorded yet.</p>
          )}
        </div>

        {/* Top Marketplace */}
        <div className="bg-white p-5 border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-900 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-[#FF6A00]" /> STORE TRAFFIC BREAKDOWN
            </span>
            <span className="text-[10px] font-mono text-neutral-400">{analytics.marketplaceBreakdown.length} STORES</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {analytics.marketplaceBreakdown.map((m: any) => (
              <div key={m.name} className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="font-bold text-neutral-800">{m.name}</span>
                  <span className="text-neutral-500">{m.clicks} clicks ({analytics.totalClicks > 0 ? Math.round((m.clicks / analytics.totalClicks) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-[#FF6A00] transition-all"
                    style={{
                      width: `${analytics.totalClicks > 0 ? (m.clicks / analytics.totalClicks) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white border border-neutral-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="font-pixel text-base font-bold uppercase text-neutral-900">
              RECENT PRODUCTS
            </h3>
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              Latest deals added to TARZER
            </span>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-mono uppercase font-bold text-[#FF6A00] hover:underline flex items-center gap-1"
          >
            VIEW ALL ({analytics.totalProducts}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Recent Products List (< sm screens) */}
        <div className="sm:hidden divide-y divide-neutral-100">
          {analytics.recentProducts.map((p) => (
            <div key={p.id} className="py-2.5 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-9 h-11 bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                  <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="font-semibold text-xs text-neutral-900 truncate block">
                    {p.title}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="text-neutral-500">{p.marketplace?.name || 'Store'}</span>
                    <span>•</span>
                    <span className="font-bold text-neutral-900">₹{p.current_price}</span>
                    <span className="text-[#FF6A00] font-bold">({p.discount_percentage}% off)</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/product/${p.slug}`}
                target="_blank"
                className="p-1.5 text-neutral-500 hover:text-[#FF6A00] border border-neutral-200 flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop Recent Products Table (>= sm screens) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 font-mono text-neutral-400 uppercase text-[10px]">
                <th className="py-2 px-3">Product</th>
                <th className="py-2 px-3">Store</th>
                <th className="py-2 px-3">Price</th>
                <th className="py-2 px-3">Discount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {analytics.recentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-10 bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                        <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                      </div>
                      <span className="font-medium text-neutral-900 max-w-xs truncate block">
                        {p.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-neutral-700">
                    {p.marketplace?.name || 'Store'}
                  </td>
                  <td className="py-2.5 px-3 font-display font-bold text-neutral-900">
                    ₹{p.current_price}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 bg-[#FF6A00] text-white font-mono text-[10px] font-bold">
                      {p.discount_percentage}% OFF
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold ${
                      p.status === 'ACTIVE'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <Link
                      href={`/product/${p.slug}`}
                      target="_blank"
                      className="text-neutral-500 hover:text-[#FF6A00] inline-flex items-center gap-1 text-[11px]"
                    >
                      VIEW <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
