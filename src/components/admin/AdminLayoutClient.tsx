'use client';

import { useState } from 'react';
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
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Zap,
  CheckCircle2,
  MoreHorizontal,
  Construction
} from 'lucide-react';

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [buildingMode, setBuildingMode] = useState(false);
  const [loadingBuildingMode, setLoadingBuildingMode] = useState(false);

  // Fetch current building mode state
  useState(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.building_mode === 'boolean') {
          setBuildingMode(data.building_mode);
        }
      })
      .catch(() => {});
  });

  const handleToggleBuildingMode = async () => {
    setLoadingBuildingMode(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ building_mode: !buildingMode })
      });
      const data = await res.json();
      if (data.success) {
        setBuildingMode(data.building_mode);
      }
    } catch (err) {
      console.error('Failed to toggle building mode:', err);
    } finally {
      setLoadingBuildingMode(false);
    }
  };

  // If on login page, don't show the admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

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
    { label: 'Products & Deals', href: '/admin/products', icon: Package },
    { label: '+ Add / Import Link', href: '/admin/products/add', icon: PlusCircle, isAction: true },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'Store Partners', href: '/admin/brands', icon: Store },
    { label: 'Hero Banners', href: '/admin/hero', icon: Sliders },
    { label: 'Analytics & Clicks', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings & Supabase', href: '/admin/settings', icon: Settings }
  ];

  const mobileBottomItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Add Deal', href: '/admin/products/add', icon: PlusCircle, highlight: true },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'More', action: () => setMobileOpen(true), icon: MoreHorizontal }
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#111111] flex flex-col md:flex-row antialiased selection:bg-[#FF6A00] selection:text-white">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 md:w-64 bg-[#111111] text-white flex flex-col justify-between border-r border-white/10 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Brand Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-8 h-8 bg-[#FF6A00] flex items-center justify-center p-1 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="TARZER"
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <span className="font-pixel text-lg font-bold tracking-tight text-white block leading-none group-hover:text-[#FF6A00] transition-colors">
                  TARZER
                </span>
                <span className="text-[10px] font-mono text-[#FF6A00] uppercase tracking-widest block mt-0.5">
                  ADMIN CONTROL
                </span>
              </div>
            </Link>

            {/* Close button for mobile */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-white/60 hover:text-white p-1.5 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Button */}
          <div className="p-3">
            <Link
              href="/admin/products/add"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>IMPORT NEW DEAL</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors rounded-none ${
                    isActive
                      ? 'bg-white text-[#111111] font-bold shadow-xs'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-[#FF6A00]' : 'text-white/60'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#111111] flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-mono text-white/70 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>LIVE STORE RADAR</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>SIGN OUT</span>
            </span>
            <span className="text-[10px] text-white/40">admin@tarzer.in</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#111111]/10 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between shadow-2xs backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-[#111111] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Status pills */}
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-green-50 border border-green-200 text-green-700 text-[10px] sm:text-[11px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></span>
                ONLINE
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-700 text-[11px] font-mono">
                <CheckCircle2 className="w-3 h-3 text-[#FF6A00]" />
                SUPABASE READY
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Building Mode 1-Click Toggle */}
            <button
              onClick={handleToggleBuildingMode}
              disabled={loadingBuildingMode}
              className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                buildingMode
                  ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-[#FF6A00] hover:text-[#FF6A00]'
              }`}
              title={buildingMode ? 'Click to Disable Building Mode and Go Live' : 'Click to Enable Building Mode'}
            >
              <Construction className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">BUILDING:</span>
              <span className="font-bold">{buildingMode ? 'ON' : 'OFF'}</span>
            </button>

            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 bg-[#FF6A00] hover:bg-[#E55F00] text-white font-mono text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ ADD DEAL</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-mono text-xs uppercase tracking-wider transition-colors"
            >
              <span>PREVIEW</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Main Content with bottom padding for mobile bar */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>

        {/* Mobile Sticky Bottom Navigation Bar (Visible only on < md screens) */}
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 md:hidden flex items-center justify-around py-1.5 shadow-lg safe-area-bottom">
          {mobileBottomItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.href ? pathname === item.href : false;

            if (item.action) {
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer min-w-[56px]"
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="text-[9px] font-mono uppercase">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={idx}
                href={item.href!}
                className={`flex flex-col items-center justify-center p-1 min-w-[56px] transition-colors ${
                  item.highlight
                    ? 'text-[#FF6A00] font-bold'
                    : isActive
                    ? 'text-[#111111] font-bold'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#FF6A00]' : ''}`} />
                <span className="text-[9px] font-mono uppercase tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
