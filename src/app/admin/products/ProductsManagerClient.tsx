'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  PlusCircle,
  Trash2,
  ExternalLink,
  Star,
  Check,
  X,
  Copy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductsManagerClientProps {
  initialProducts: Product[];
}

export default function ProductsManagerClient({ initialProducts }: ProductsManagerClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'FEATURED'>('ALL');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter products locally
  const filtered = products.filter((p) => {
    if (statusFilter === 'ACTIVE' && p.status !== 'ACTIVE') return false;
    if (statusFilter === 'INACTIVE' && p.status !== 'INACTIVE') return false;
    if (statusFilter === 'FEATURED' && !p.featured) return false;

    if (search.trim()) {
      const term = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(term) ||
        (p.marketplace?.name && p.marketplace.name.toLowerCase().includes(term)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // Toggle active/inactive status
  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setLoadingId(product.id);

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
    );

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Status update failed');
      showToast(`Product set to ${newStatus}`);
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: product.status } : p))
      );
      showToast('Failed to update status', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (product: Product) => {
    const newFeatured = !product.featured;
    setLoadingId(product.id);

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, featured: newFeatured } : p))
    );

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeatured })
      });

      if (!res.ok) throw new Error('Featured toggle failed');
      showToast(newFeatured ? 'Marked as Featured' : 'Removed from Featured');
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, featured: product.featured } : p))
      );
      showToast('Failed to toggle featured', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  // Copy affiliate URL
  const handleCopyAffiliate = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Affiliate link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete product
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete deal "${title}"?`)) return;

    setLoadingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast('Deal deleted successfully');
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      showToast('Failed to delete product', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 px-4 py-2.5 text-xs font-mono font-bold shadow-lg flex items-center gap-2 border transition-all animate-in fade-in slide-in-from-bottom-2 ${
            toastMsg.type === 'success'
              ? 'bg-[#111111] text-white border-white/20'
              : 'bg-red-900 text-white border-red-700'
          }`}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-300" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#FF6A00] uppercase tracking-wider block font-bold">
            CATALOG MANAGEMENT
          </span>
          <h1 className="font-pixel text-xl sm:text-3xl font-bold uppercase text-neutral-900 tracking-tight">
            PRODUCTS & DEALS
          </h1>
        </div>

        <Link
          href="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ ADD DEAL / IMPORT</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between bg-white p-3 border border-neutral-200">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals, stores, categories..."
            className="w-full bg-neutral-50 border border-neutral-200 pl-9 pr-4 py-2 sm:py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white font-mono"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['ALL', 'ACTIVE', 'INACTIVE', 'FEATURED'] as const).map((tab) => {
            const count =
              tab === 'ALL'
                ? products.length
                : tab === 'ACTIVE'
                ? products.filter((p) => p.status === 'ACTIVE').length
                : tab === 'INACTIVE'
                ? products.filter((p) => p.status === 'INACTIVE').length
                : products.filter((p) => p.featured).length;

            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-mono uppercase tracking-wider border cursor-pointer transition-colors whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-[#111111] text-white border-[#111111] font-bold'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Mobile Card View (< sm screens) */}
      <div className="sm:hidden space-y-3">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className={`bg-white border border-neutral-200 p-3.5 space-y-3 shadow-2xs ${
              prod.status === 'INACTIVE' ? 'opacity-65 bg-neutral-50' : ''
            }`}
          >
            {/* Top item row */}
            <div className="flex items-start gap-3">
              <div className="relative w-14 h-18 bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                <Image src={prod.image_url} alt={prod.title} fill className="object-cover" />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">
                    {prod.marketplace?.name || 'Store'}
                  </span>
                  <span className="bg-[#FF6A00] text-white font-mono text-[9px] font-bold px-1.5 py-0.2">
                    {prod.discount_percentage}% OFF
                  </span>
                </div>

                <h4 className="font-semibold text-xs text-neutral-900 line-clamp-2">
                  {prod.title}
                </h4>

                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="font-display font-bold text-sm text-neutral-900">
                    ₹{prod.current_price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 line-through">
                    ₹{prod.original_price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Controls Row */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {/* Status Toggle */}
                <button
                  onClick={() => handleToggleStatus(prod)}
                  disabled={loadingId === prod.id}
                  className={`px-2 py-1 font-mono text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                    prod.status === 'ACTIVE'
                      ? 'bg-green-50 text-green-700 border-green-300'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                  }`}
                >
                  {prod.status}
                </button>

                {/* Featured Toggle */}
                <button
                  onClick={() => handleToggleFeatured(prod)}
                  disabled={loadingId === prod.id}
                  className={`p-1 border transition-colors cursor-pointer ${
                    prod.featured
                      ? 'bg-[#FF6A00] text-white border-[#FF6A00]'
                      : 'bg-white text-neutral-300 border-neutral-200'
                  }`}
                  title="Feature toggle"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopyAffiliate(prod.affiliate_url, prod.id)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 border border-neutral-200 bg-neutral-50"
                  title="Copy link"
                >
                  {copiedId === prod.id ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <Link
                  href={`/product/${prod.slug}`}
                  target="_blank"
                  className="p-1.5 text-neutral-500 hover:text-[#FF6A00] border border-neutral-200 bg-neutral-50"
                  title="View live product"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => handleDelete(prod.id, prod.title)}
                  disabled={loadingId === prod.id}
                  className="p-1.5 text-red-500 hover:text-red-700 border border-red-200 bg-red-50"
                  title="Delete product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Desktop Table View (>= sm screens) */}
      <div className="hidden sm:block bg-white border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200 font-mono text-neutral-600 uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Item</th>
                <th className="py-3 px-4 font-semibold">Store</th>
                <th className="py-3 px-4 font-semibold">Price & Discount</th>
                <th className="py-3 px-4 font-semibold text-center">Featured</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((prod) => (
                <tr
                  key={prod.id}
                  className={`hover:bg-neutral-50/80 transition-colors ${
                    prod.status === 'INACTIVE' ? 'opacity-60 bg-neutral-50/40' : ''
                  }`}
                >
                  {/* Item Image & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                        <Image src={prod.image_url} alt={prod.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 max-w-sm space-y-0.5">
                        <span className="font-semibold text-neutral-900 line-clamp-1 block">
                          {prod.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 uppercase">
                          <span>{prod.category?.name || 'Apparel'}</span>
                          <span>•</span>
                          <span className="text-[#FF6A00] font-bold">{prod.badge || 'HOT DEAL'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Store Name */}
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-800">
                    {prod.marketplace?.name || 'Store'}
                  </td>

                  {/* Pricing */}
                  <td className="py-3 px-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-bold text-sm text-neutral-900">
                        ₹{prod.current_price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 line-through">
                        ₹{prod.original_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="inline-block mt-0.5 bg-[#FF6A00] text-white font-mono text-[10px] font-bold px-1.5 py-0.2">
                      {prod.discount_percentage}% OFF
                    </span>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(prod)}
                      disabled={loadingId === prod.id}
                      className={`p-1.5 border transition-colors cursor-pointer ${
                        prod.featured
                          ? 'bg-[#FF6A00] text-white border-[#FF6A00]'
                          : 'bg-white text-neutral-300 border-neutral-200 hover:border-neutral-400 hover:text-neutral-600'
                      }`}
                      title={prod.featured ? 'Featured on Homepage' : 'Mark as Featured'}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>

                  {/* Status Toggle Button */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(prod)}
                      disabled={loadingId === prod.id}
                      className={`px-2.5 py-1 font-mono text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                        prod.status === 'ACTIVE'
                          ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
                      }`}
                    >
                      {prod.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handleCopyAffiliate(prod.affiliate_url, prod.id)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-800 cursor-pointer inline-block"
                      title="Copy affiliate link"
                    >
                      {copiedId === prod.id ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <Link
                      href={`/product/${prod.slug}`}
                      target="_blank"
                      className="p-1.5 text-neutral-400 hover:text-[#FF6A00] inline-block"
                      title="View live deal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleDelete(prod.id, prod.title)}
                      disabled={loadingId === prod.id}
                      className="p-1.5 text-red-400 hover:text-red-600 cursor-pointer inline-block"
                      title="Delete deal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-white border border-neutral-200 p-8 sm:p-12 text-center text-neutral-400 font-mono text-xs space-y-2">
          <p>NO PRODUCTS MATCHED YOUR SEARCH QUERY</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-[#FF6A00] underline uppercase text-[11px] cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
