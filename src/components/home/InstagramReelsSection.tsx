'use client';

import Link from 'next/link';
import { Play, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { Instagram } from '@/components/ui/InstagramIcon';

interface ReelPlaceholder {
  id: string;
  title: string;
  caption: string;
  views: string;
  likes: string;
  tag: string;
  bgGradient: string;
  instagramUrl: string;
}

const placeholderReels: ReelPlaceholder[] = [
  {
    id: 'reel_1',
    title: 'Oversized Tee Try-On',
    caption: 'Heavyweight boxy tee review + link in bio! 🔥',
    views: '18.4K',
    likes: '1.2K',
    tag: 'TRY-ON',
    bgGradient: 'from-zinc-900 via-neutral-900 to-black',
    instagramUrl: 'https://www.instagram.com/tarzer.official'
  },
  {
    id: 'reel_2',
    title: 'Sneakers Under ₹1499',
    caption: 'Best everyday kicks deal on Myntra right now 👟',
    views: '24.1K',
    likes: '2.4K',
    tag: 'DEAL DROP',
    bgGradient: 'from-neutral-900 via-stone-900 to-black',
    instagramUrl: 'https://www.instagram.com/tarzer.official'
  },
  {
    id: 'reel_3',
    title: 'Parachute Pants Styling',
    caption: '3 aesthetic streetwear outfits with 1 pant ⚡',
    views: '31.8K',
    likes: '3.1K',
    tag: 'LOOKBOOK',
    bgGradient: 'from-stone-900 via-zinc-900 to-black',
    instagramUrl: 'https://www.instagram.com/tarzer.official'
  },
  {
    id: 'reel_4',
    title: 'Winter Bomber Jacket',
    caption: '70% off flash deal test & fabric quality check 🧥',
    views: '15.6K',
    likes: '980',
    tag: 'UNBOXING',
    bgGradient: 'from-neutral-950 via-zinc-900 to-black',
    instagramUrl: 'https://www.instagram.com/tarzer.official'
  }
];

export default function InstagramReelsSection() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#111111] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Instagram className="w-4 h-4 text-[#FF6A00]" />
              <span className="text-xs font-pixel text-[#FF6A00] tracking-widest uppercase">
                INSTAGRAM @TARZER.OFFICIAL
              </span>
            </div>
            <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] uppercase tracking-tight">
              LATEST REELS & DROPS
            </h2>
          </div>

          <a
            href="https://www.instagram.com/tarzer.official"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#FF6A00] text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 group self-start md:self-auto"
          >
            <Instagram className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>FOLLOW ON INSTAGRAM</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/70" />
          </a>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {placeholderReels.map((reel) => (
            <a
              key={reel.id}
              href={reel.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[9/16] rounded-xl overflow-hidden border border-neutral-300/80 bg-neutral-900 flex flex-col justify-between p-3.5 transition-all duration-300 hover:border-[#FF6A00] hover:shadow-xl hover:-translate-y-1"
            >
              {/* Subtle Animated Background Layer */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${reel.bgGradient} opacity-95 group-hover:opacity-90 transition-opacity`}
              />

              {/* Grid / Noise pattern effect */}
              <div className="absolute inset-0 bg-[radial-gradient(#FF6A00_1px,transparent_1px)] [background-size:16px_16px] opacity-10 group-hover:opacity-20 transition-opacity" />

              {/* Top Bar: Tag Badge + Reel Icon */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-pixel uppercase tracking-widest bg-white/15 text-white backdrop-blur-xs border border-white/20">
                  {reel.tag}
                </span>
                <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-white group-hover:text-[#FF6A00] transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:bg-[#FF6A00] group-hover:border-[#FF6A00] group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/60 mt-3 group-hover:text-white transition-colors">
                  WATCH REEL
                </span>
              </div>

              {/* Bottom Info & Stats */}
              <div className="relative z-10 space-y-1.5 pt-2 border-t border-white/10">
                <h3 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-[#FF6A00] transition-colors">
                  {reel.title}
                </h3>
                <p className="text-[11px] text-white/70 line-clamp-2 leading-tight">
                  {reel.caption}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-white/50 pt-1">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-[#FF6A00]" /> {reel.likes}
                  </span>
                  <span>{reel.views} VIEWS</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Sub-Banner */}
        <div className="mt-8 p-4 bg-[#F5F5F5] border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF6A00]/10 text-[#FF6A00] flex items-center justify-center shrink-0">
              <Instagram className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-neutral-900">
                Tag @tarzer.official to get featured in our next haul
              </p>
              <p className="text-[11px] text-neutral-500 font-mono">
                Daily try-on clips, real outfit inspirations, and exclusive coupon codes.
              </p>
            </div>
          </div>
          <a
            href="https://www.instagram.com/tarzer.official"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase text-[#FF6A00] hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>Visit @tarzer.official</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
