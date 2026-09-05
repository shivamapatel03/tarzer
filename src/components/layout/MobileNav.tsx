'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, Search, Store } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  // Don't show bottom mobile nav on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#111111]/10 px-4 py-2 flex items-center justify-around shadow-lg">
      <Link
        href="/"
        className={`flex flex-col items-center py-1 px-3 ${
          pathname === '/' ? 'text-[#FF6A00]' : 'text-[#111111]/70'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Home</span>
      </Link>

      <Link
        href="/deals"
        className={`flex flex-col items-center py-1 px-3 ${
          pathname === '/deals' ? 'text-[#FF6A00]' : 'text-[#111111]/70'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Deals</span>
      </Link>

      <Link
        href="/deals"
        className={`flex flex-col items-center py-1 px-3 ${
          pathname.includes('/deals') ? 'text-[#FF6A00]' : 'text-[#111111]/70'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Search</span>
      </Link>

      <Link
        href="/#brands"
        className={`flex flex-col items-center py-1 px-3 ${
          pathname.startsWith('/brand') ? 'text-[#FF6A00]' : 'text-[#111111]/70'
        }`}
      >
        <Store className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Stores</span>
      </Link>
    </div>
  );
}
