import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Instagram } from '@/components/ui/InstagramIcon';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white border-t border-white/10 pt-16 pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 bg-[#FF6A00] flex-shrink-0 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="TARZER"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-pixel text-2xl font-bold tracking-tight text-white">
                TARZER
              </span>
            </div>
            <p className="text-xl font-display font-medium text-white/90 max-w-sm">
              Fashion at the right price.
            </p>
            <p className="text-sm text-white/50 max-w-md leading-relaxed">
              Curating lowest-price fashion deals across Amazon, Myntra, Meesho, Shopsy, and top streetwear hubs. Zero markup. Direct affiliate discovery.
            </p>

            {/* Official Instagram */}
            <div className="pt-1">
              <a
                href="https://www.instagram.com/tarzer.official"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-[#FF6A00] text-white text-xs font-mono tracking-wider transition-colors border border-white/15 hover:border-[#FF6A00] group"
              >
                <Instagram className="w-4 h-4 text-[#FF6A00] group-hover:text-white transition-colors" />
                <span>@tarzer.official</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-pixel uppercase tracking-widest text-[#FF6A00]">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-white transition-colors">
                  All Deals
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#brands" className="hover:text-white transition-colors">
                  Brands & Stores
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About TARZER
                </Link>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/tarzer.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF6A00] transition-colors flex items-center gap-1.5 text-white/80"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#FF6A00]" />
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Marketplaces */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-pixel uppercase tracking-widest text-[#FF6A00]">
              PARTNER STORES
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/70">
              <Link href="/brand/amazon" className="hover:text-[#FF6A00] flex items-center gap-1 transition-colors">
                Amazon Deals <ArrowUpRight className="w-3 h-3" />
              </Link>
              <Link href="/brand/myntra" className="hover:text-[#FF6A00] flex items-center gap-1 transition-colors">
                Myntra Deals <ArrowUpRight className="w-3 h-3" />
              </Link>
              <Link href="/brand/meesho" className="hover:text-[#FF6A00] flex items-center gap-1 transition-colors">
                Meesho Deals <ArrowUpRight className="w-3 h-3" />
              </Link>
              <Link href="/brand/shopsy" className="hover:text-[#FF6A00] flex items-center gap-1 transition-colors">
                Shopsy Deals <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex items-center justify-between text-xs text-white/40">
          <div className="font-mono text-[11px]">
            &copy; {new Date().getFullYear()} TARZER. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}
