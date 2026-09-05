'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Link as LinkIcon,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react';
import { Category, Marketplace, ProductBadge } from '@/lib/types';
import StoreLogo from '@/components/ui/StoreLogo';

export default function AddProductPage() {
  const router = useRouter();

  // Categories & Marketplaces state
  const [categories, setCategories] = useState<Category[]>([]);
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);

  // Input & Import state
  const [inputUrl, setInputUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number>(499);
  const [originalPrice, setOriginalPrice] = useState<number>(1299);
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=85');
  const [marketplaceId, setMarketplaceId] = useState('mp_amazon');
  const [categoryId, setCategoryId] = useState('cat_streetwear');
  const [badge, setBadge] = useState<ProductBadge>('HOT DEAL');
  const [featured, setFeatured] = useState(false);

  // Saving state
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Load categories and marketplaces on mount
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        if (d.categories && d.categories.length > 0) {
          setCategories(d.categories);
          setCategoryId(d.categories[0].id);
        }
      });
    fetch('/api/brands')
      .then((r) => r.json())
      .then((d) => {
        if (d.marketplaces && d.marketplaces.length > 0) {
          setMarketplaces(d.marketplaces);
          setMarketplaceId(d.marketplaces[0].id);
        }
      });
  }, []);

  // Calculate discount percentage automatically: ((orig - cur) / orig) * 100
  const calculatedDiscount = Math.max(
    0,
    originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0
  );

  // Selected marketplace & category objects for live preview
  const selectedMarketplace = marketplaces.find((m) => m.id === marketplaceId);
  const selectedCategory = categories.find((c) => c.id === categoryId);

  // Handle Link Import extraction
  const handleExtract = async (urlToUse?: string) => {
    const url = (urlToUse || inputUrl).trim();
    if (!url) {
      setImportStatus({ type: 'error', message: 'Please enter a valid product URL' });
      return;
    }

    setImporting(true);
    setImportStatus(null);

    try {
      const res = await fetch('/api/import-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const json = await res.json();

      if (!res.ok || !json.data) {
        throw new Error(json.error || 'Failed to extract metadata');
      }

      const d = json.data;
      setTitle(d.title || '');
      setDescription(d.description || '');
      setCurrentPrice(d.current_price || 499);
      setOriginalPrice(d.original_price || 1299);
      setAffiliateUrl(d.affiliate_url || url);
      if (d.image_url) setImageUrl(d.image_url);
      if (d.marketplace) setMarketplaceId(d.marketplace);
      if (d.category) setCategoryId(d.category);

      setImportStatus({
        type: 'success',
        message: `${json.marketplaceName || 'Store'} metadata parsed successfully!`
      });
    } catch (err: any) {
      setImportStatus({
        type: 'warning',
        message: 'Could not auto-fetch metadata directly. Template loaded for quick completion.'
      });
      setAffiliateUrl(url);
    } finally {
      setImporting(false);
    }
  };

  // Quick preset sample urls for fast testing
  const PRESET_SAMPLES = [
    {
      store: 'Amazon',
      name: 'Acid Wash Tee',
      url: 'https://www.amazon.in/dp/B00EXAMPLE?tag=tarzer-21'
    },
    {
      store: 'Myntra',
      name: 'Oversized Bomber',
      url: 'https://www.myntra.com/jackets/streetwear-bomber-101'
    },
    {
      store: 'Meesho',
      name: 'Dragon Streetwear Tee',
      url: 'https://www.meesho.com/af_invite/264029691:facebook:9918905?p_id=994867610&ext_id=ggbgre&utm_source=facebook'
    }
  ];

  // Publish / Save product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !affiliateUrl.trim()) {
      setImportStatus({ type: 'error', message: 'Title and Affiliate URL are required.' });
      return;
    }

    setPublishing(true);
    setImportStatus(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        current_price: Number(currentPrice),
        original_price: Number(originalPrice),
        discount_percentage: calculatedDiscount,
        marketplace_id: marketplaceId,
        category_id: categoryId,
        affiliate_url: affiliateUrl.trim(),
        image_url: imageUrl.trim(),
        badge: badge,
        featured: featured,
        status: 'ACTIVE'
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setPublishSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setImportStatus({ type: 'error', message: err.message || 'Error publishing deal' });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[11px] font-mono text-[#FF6A00] uppercase tracking-wider block font-bold">
              PRODUCT CREATOR
            </span>
            <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-neutral-900 tracking-tight">
              ADD NEW DEAL / IMPORT LINK
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={publishing || publishSuccess}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {publishing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>SAVING DEAL...</span>
              </>
            ) : publishSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>PUBLISHED!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>PUBLISH TO TARZER</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Fast Link Importer Box */}
      <div className="bg-white border border-neutral-200 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-[#FF6A00]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900">
            AUTO-IMPORT FROM STORE URL
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste Amazon, Myntra, Meesho, or Shopsy product link here..."
            className="flex-1 bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
          />
          <button
            type="button"
            onClick={() => handleExtract()}
            disabled={importing || !inputUrl}
            className="px-5 py-2 bg-[#111111] hover:bg-[#FF6A00] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {importing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>EXTRACTING...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>FETCH METADATA</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Demo URL pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400">Quick Test Samples:</span>
          {PRESET_SAMPLES.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => {
                setInputUrl(s.url);
                handleExtract(s.url);
              }}
              className="text-[11px] font-mono px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 transition-colors cursor-pointer"
            >
              {s.store}: {s.name}
            </button>
          ))}
        </div>

        {/* Status Message */}
        {importStatus && (
          <div
            className={`p-3 text-xs font-mono flex items-center gap-2 border ${
              importStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border-green-200'
                : importStatus.type === 'warning'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {importStatus.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
            {importStatus.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
            {importStatus.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
            <span>{importStatus.message}</span>
          </div>
        )}
      </div>

      {/* 2. Main Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 pb-2 border-b border-neutral-100">
            DEAL DETAILS
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Acid-Wash Drop Shoulder Heavyweight Tee"
                className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white font-medium"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                Description / Highlights
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of material, fit, and style highlights..."
                className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
              />
            </div>

            {/* Store & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Store / Marketplace *
                </label>
                <select
                  value={marketplaceId}
                  onChange={(e) => setMarketplaceId(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00]"
                >
                  {marketplaces.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 border border-neutral-200">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Deal Price (₹) *
                </label>
                <input
                  type="number"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  required
                  min={1}
                  className="w-full bg-white border border-neutral-200 px-3 py-2 text-sm font-bold text-neutral-900 focus:outline-none focus:border-[#FF6A00] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Original MRP (₹) *
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  required
                  min={1}
                  className="w-full bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:border-[#FF6A00] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Calculated Off
                </label>
                <div className="h-[38px] flex items-center px-3 bg-[#FF6A00] text-white font-mono font-bold text-xs">
                  {calculatedDiscount}% DISCOUNT
                </div>
              </div>
            </div>

            {/* Affiliate URL */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                Direct Affiliate Redirect Link *
              </label>
              <input
                type="url"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                required
                placeholder="https://amazon.in/dp/...?tag=tarzer-21"
                className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                Image CDN / URL *
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                placeholder="https://images.unsplash.com/... or store cdn"
                className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
              />
            </div>

            {/* Badge & Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Deal Badge
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value as ProductBadge)}
                  className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="HOT DEAL">HOT DEAL</option>
                  <option value="LOWEST PRICE">LOWEST PRICE</option>
                  <option value="LIMITED OFFER">LIMITED OFFER</option>
                  <option value="TARZER PICK">TARZER PICK</option>
                  <option value="STEAL OF THE DAY">STEAL OF THE DAY</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#FF6A00]"
                  />
                  <span className="text-xs font-mono uppercase font-bold text-neutral-900">
                    Feature on Homepage
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-neutral-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#FF6A00]" /> LIVE TARZER CARD PREVIEW
              </span>
              <span className="text-[10px] font-mono text-green-600 font-bold">READY</span>
            </div>

            {/* Product Card Rendering */}
            <div className="border border-neutral-200 bg-white overflow-hidden shadow-xs max-w-sm mx-auto">
              {/* Image Container */}
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title || 'Product Preview'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs">
                    Image Preview
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-2.5 left-2.5 bg-[#FF6A00] text-white text-[10px] font-mono font-bold px-2 py-0.5">
                  {badge}
                </div>

                {/* Discount Badge */}
                <div className="absolute bottom-2.5 left-2.5 bg-[#111111] text-white text-[10px] font-mono font-bold px-2 py-0.5">
                  {calculatedDiscount}% OFF
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 uppercase">
                  <span>{selectedCategory?.name || 'Streetwear'}</span>
                  <span className="text-neutral-800 font-bold">{selectedMarketplace?.name || 'Store'}</span>
                </div>

                <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">
                  {title || 'Sample Product Title'}
                </h4>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-display font-black text-lg text-neutral-900">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-mono text-neutral-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="w-full py-2 bg-[#111111] text-white text-xs font-mono font-bold uppercase text-center flex items-center justify-center gap-1.5">
                    <span>GRAB DEAL</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 text-[11px] font-mono text-neutral-500 space-y-1">
              <p className="font-bold text-neutral-700">✓ Affiliate Tracking:</p>
              <p className="truncate">Target: {affiliateUrl || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
