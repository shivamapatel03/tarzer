'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tag,
  Store,
  Sliders,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Add Product / Import', href: '/admin/products/add', icon: PlusCircle, highlight: true },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'Brands / Stores', href: '/admin/brands', icon: Store },
    { label: 'Hero Slides', href: '/admin/hero', icon: Sliders },
    { label: 'Analytics & Clicks', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#111111] text-white flex flex-col justify-between border-r border-white/10 min-h-screen flex-shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-8 h-8 bg-[#FF6A00] p-1 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="TARZER"
                width={32}
                height={32}
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <span className="font-pixel text-lg font-bold tracking-tight text-white block leading-none">
                TARZER
              </span>
              <span className="text-[9px] font-mono text-[#FF6A00] uppercase tracking-widest">
                ADMIN PANEL
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors rounded-none ${
                  isActive
                    ? 'bg-[#FF6A00] text-white font-bold'
                    : item.highlight
                    ? 'text-[#FF6A00] hover:bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-mono text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span>VIEW LIVE SITE</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono uppercase tracking-wider text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}
