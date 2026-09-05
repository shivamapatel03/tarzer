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
}

export default function ClientRootWrapper({
  children,
  initialBuildingMode,
}: ClientRootWrapperProps) {
  const pathname = usePathname();
  const [buildingMode, setBuildingMode] = useState(initialBuildingMode);
  const [adminBypass, setAdminBypass] = useState(false);

  // Periodic poll or check on mount to ensure instant update when toggled in admin panel
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

  // Admin routes and API routes MUST NEVER be blocked
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/api');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  // If Building Mode is active and not bypassed
  if (buildingMode && !adminBypass) {
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
