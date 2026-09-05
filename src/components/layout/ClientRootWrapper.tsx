'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import BuildingModeView from '@/components/ui/BuildingModeView';

interface ClientRootWrapperProps {
  children: React.ReactNode;
  initialBuildingMode: boolean;
  isAdminSubdomain?: boolean;
}

export default function ClientRootWrapper({
  children,
  initialBuildingMode,
  isAdminSubdomain = false,
}: ClientRootWrapperProps) {
  const pathname = usePathname();
  const [buildingMode, setBuildingMode] = useState(initialBuildingMode);
  const [clientIsAdminHost, setClientIsAdminHost] = useState(isAdminSubdomain);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hostname.toLowerCase().split(':')[0].trim();
      if (h.startsWith('admin.') || h.startsWith('admin-') || h === 'admin.tarzer.shop') {
        setClientIsAdminHost(true);
      }
    }
  }, []);

  // Periodic poll to ensure instant update when toggled in admin panel
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setBuildingMode(Boolean(data.building_mode));
        }
      } catch {
        // keep initial
      }
    }

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // Admin subdomain, admin routes, and API routes MUST NEVER show Building Mode
  const isAnyAdmin =
    isAdminSubdomain ||
    clientIsAdminHost ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/api') ||
    pathname?.startsWith('/login');

  if (isAnyAdmin) {
    return <>{children}</>;
  }

  // If Building Mode is active on public domain
  if (buildingMode) {
    return (
      <>
        <BuildingModeView />
      </>
    );
  }

  // Full Public Website
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}
