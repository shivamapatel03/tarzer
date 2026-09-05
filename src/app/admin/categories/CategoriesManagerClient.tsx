'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  ExternalLink,
  Search,
  X,
  Check,
  AlertCircle,
  Tag,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Category } from '@/lib/types';

interface CategoriesManagerClientProps {
  initialCategories: Category[];
}

const PRESET_IMAGES = [
  { label: 'Korean Style', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80' },
  { label: 'Gen Z / Y2K', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80' },
  { label: 'Kids Wear', url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80' },
  { label: 'Streetwear', url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80' },
  { label: 'Men Fashion', url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80' },
  { label: 'Women Fashion', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' },
  { label: 'Kicks & Shoes', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80' }
];

export default function CategoriesManagerClient({ initialCategories }: CategoriesManagerClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New Category Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [customSlug, setCustomSlug] = useState(false);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!customSlug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleOpenModal = () => {
    setName('');
    setSlug('');
    setCustomSlug(false);
    setImage(PRESET_IMAGES[Math.floor(Math.random() * PRESET_IMAGES.length)].url);
    setModalOpen(true);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          image: image.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      setCategories((prev) => [data.category, ...prev]);
      showToast(`Category "${name}" created successfully!`);
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error creating category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete "${catName}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showToast('Category deleted successfully.');
      } else {
        const err = await res.json();
        showToast(err.error || 'Delete failed', 'error');
      }
    } catch (err: any) {
      showToast('Error deleting category', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = categories.filter((c) => {
    if (!search.trim()) return true;
    return c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 text-xs font-mono font-bold shadow-lg flex items-center gap-2 border transition-all ${
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-mono text-[#FF6A00] uppercase tracking-wider block font-bold">
            TAXONOMY MANAGEMENT
          </span>
          <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-neutral-900 tracking-tight">
            CATEGORIES
          </h1>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW CATEGORY</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between bg-white p-3 border border-neutral-200">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-neutral-50 border border-neutral-200 pl-9 pr-4 py-1.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
          />
        </div>
        <span className="text-xs font-mono text-neutral-500 uppercase">
          {filtered.length} categories
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-neutral-200 p-4 flex flex-col justify-between space-y-4 hover:border-neutral-400 transition-all shadow-2xs"
          >
            <div className="flex items-start gap-3.5">
              <div className="relative w-14 h-16 bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 space-y-1">
                <h3 className="font-bold text-sm text-neutral-900 truncate">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-mono text-neutral-400 block truncate">
                  slug: /{cat.slug}
                </span>
                <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-mono font-bold">
                  {cat.product_count || 0} DEALS
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
              <Link
                href={`/category/${cat.slug}`}
                target="_blank"
                className="text-neutral-500 hover:text-[#FF6A00] inline-flex items-center gap-1 text-[11px]"
              >
                <span>VIEW RADAR</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                disabled={deletingId === cat.id}
                className="text-red-400 hover:text-red-600 cursor-pointer p-1"
                title="Delete category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-neutral-200 max-w-lg w-full p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FF6A00]" />
                <h3 className="font-pixel text-lg font-bold uppercase text-neutral-900">
                  CREATE NEW CATEGORY
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="e.g. Graphic Tees, Korean Style"
                  className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  URL Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. graphic-tees"
                  className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
                />
              </div>

              {/* Preset Image Selector */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5">
                  Select Visual Thumbnail:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`relative aspect-square border overflow-hidden transition-all cursor-pointer ${
                        image === preset.url
                          ? 'border-[#FF6A00] ring-2 ring-[#FF6A00]'
                          : 'border-neutral-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={preset.url} alt={preset.label} fill className="object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] font-mono truncate px-1 py-0.5 text-center">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Custom Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
