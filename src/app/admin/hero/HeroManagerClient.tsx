'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sliders, Check, X, RefreshCw, PlusCircle, ArrowRight, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import { HeroSlide } from '@/lib/types';

interface HeroManagerClientProps {
  initialSlides: HeroSlide[];
}

export default function HeroManagerClient({ initialSlides }: HeroManagerClientProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Toggle active/inactive
  const handleToggleActive = async (slide: HeroSlide) => {
    const updated = { ...slide, active: !slide.active };
    // Optimistic UI update
    setSlides((prev) => prev.map((s) => (s.id === slide.id ? updated : s)));

    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        showToast(`Slide set to ${updated.active ? 'Active' : 'Inactive'}`);
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      setSlides((prev) => prev.map((s) => (s.id === slide.id ? slide : s)));
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    setSaving(true);
    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSlide)
      });
      if (res.ok) {
        setSlides((prev) => prev.map((s) => (s.id === editingSlide.id ? editingSlide : s)));
        showToast('Hero slide updated successfully!');
        setEditingSlide(null);
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      showToast('Error saving hero slide', 'error');
    } finally {
      setSaving(false);
    }
  };

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
            HOMEPAGE BANNER CONFIGURATION
          </span>
          <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-neutral-900 tracking-tight">
            HERO SLIDES
          </h1>
        </div>
      </div>

      {/* Slides List */}
      <div className="space-y-4">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`bg-white border border-neutral-200 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-neutral-400 transition-all shadow-2xs ${
              !slide.active ? 'opacity-60 bg-neutral-50' : ''
            }`}
          >
            {/* Image Preview & Info */}
            <div className="flex items-center gap-4 min-w-0">
              <span className="font-pixel text-lg font-bold text-neutral-300">
                0{slide.display_order || idx + 1}
              </span>

              <div className="relative w-28 h-18 bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                <Image src={slide.image} alt={slide.title} fill className="object-cover" />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold ${
                    slide.active
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {slide.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    Theme: {slide.theme}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-neutral-900 truncate">
                  {slide.title}
                </h3>
                <p className="text-xs text-neutral-500 truncate max-w-md">
                  {slide.subtitle}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100">
              <button
                onClick={() => setEditingSlide(slide)}
                className="px-3 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-mono uppercase text-neutral-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleToggleActive(slide)}
                className={`px-3 py-1.5 text-xs font-mono uppercase font-bold border transition-colors cursor-pointer ${
                  slide.active
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-neutral-600 border-neutral-300'
                }`}
              >
                {slide.active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-neutral-200 max-w-lg w-full p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FF6A00]" />
                <h3 className="font-pixel text-lg font-bold uppercase text-neutral-900">
                  EDIT HERO SLIDE
                </h3>
              </div>
              <button
                onClick={() => setEditingSlide(null)}
                className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Slide Headline *
                </label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Subtitle / Tagline *
                </label>
                <input
                  type="text"
                  value={editingSlide.subtitle}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Background Image URL *
                </label>
                <input
                  type="url"
                  value={editingSlide.image}
                  onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={editingSlide.button_text}
                    onChange={(e) => setEditingSlide({ ...editingSlide, button_text: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                    Button URL
                  </label>
                  <input
                    type="text"
                    value={editingSlide.button_url}
                    onChange={(e) => setEditingSlide({ ...editingSlide, button_url: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
