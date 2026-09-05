'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Instagram } from '@/components/ui/InstagramIcon';
import PixelMusicPlayer from '@/components/ui/PixelMusicPlayer';

export default function BuildingModeView() {
  const [percent, setPercent] = useState(78);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = [
    'CURATING 80% STREETWEAR DEALS...',
    'SYNCING AMAZON & MYNTRA RADARS...',
    'VERIFYING CASH-ON-DELIVERY DROPS...',
    'CALIBRATING LOWEST PRICE ALGORITHMS...',
    'FINALIZING VIBES & SOUNDTRACK...'
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length);
    }, 2400);

    const progressInterval = setInterval(() => {
      setPercent((prev) => (prev >= 98 ? 72 : prev + 1));
    }, 800);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [phases.length]);

  return (
    <div className="h-screen max-h-screen w-full bg-[#0B0B0C] text-white flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Background Pixel Grid & Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6A0012_0%,transparent_70%)] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-[#FF6A00] p-1 border-2 border-white shadow-[2px_2px_0px_0px_#FFFFFF]">
            <Image
              src="/logo.png"
              alt="TARZER"
              width={36}
              height={36}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <span className="font-pixel text-xl sm:text-2xl font-bold tracking-tight text-white">
            TARZER
          </span>
        </div>
      </header>

      {/* Main Center Building Showcase - Clean & Fits 100vh Desktop Viewport */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 text-center my-auto py-2 sm:py-4 flex flex-col items-center justify-center">
        {/* Big Pixel Headline */}
        <h1 className="font-pixel text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white mb-3 sm:mb-4 leading-none text-balance">
          WE ARE <span className="text-[#FF6A00]">BUILDING...</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base font-display text-neutral-300 max-w-md mb-5 sm:mb-6 leading-relaxed">
          The ultimate Gen Z & streetwear deal radar is undergoing scheduled calibration. Best drops landing soon.
        </p>

        {/* Retro 8-bit Pixel Progress Box */}
        <div className="w-full max-w-md bg-white/5 border-2 border-white/20 p-3.5 sm:p-4 mb-5 sm:mb-6 text-left shadow-[4px_4px_0px_0px_#FF6A00]">
          <div className="flex items-center justify-between text-xs font-pixel tracking-wider text-[#FF6A00] mb-2 font-bold">
            <span className="truncate">{phases[phaseIndex]}</span>
            <span className="font-mono text-white shrink-0 ml-2">{percent}%</span>
          </div>

          {/* Segmented Pixel Bar */}
          <div className="w-full h-3.5 sm:h-4 bg-black/60 border border-white/30 p-0.5 flex gap-0.5">
            {Array.from({ length: 20 }).map((_, i) => {
              const active = i / 20 <= percent / 100;
              return (
                <div
                  key={i}
                  className={`flex-1 h-full transition-colors duration-200 ${
                    active ? 'bg-[#FF6A00]' : 'bg-transparent'
                  }`}
                />
              );
            })}
          </div>

          <div className="mt-2 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
            <span>STATUS: PRE-LAUNCH</span>
            <span>TARZER RADAR: VERIFIED</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center">
          <a
            href="https://www.instagram.com/tarzer.official"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-[#FF6A00] hover:bg-[#E55F00] text-white font-pixel text-xs tracking-wider uppercase font-bold border-2 border-white shadow-[3px_3px_0px_0px_#FFFFFF] transition-transform hover:translate-y-[-2px]"
          >
            <Instagram className="w-4 h-4" />
            <span>GET DROP NOTIFICATIONS ON INSTAGRAM</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-neutral-500 border-t border-white/10">
        <p>© {new Date().getFullYear()} TARZER. ALL RIGHTS RESERVED.</p>
        <p className="text-[#FF6A00] font-bold tracking-wider uppercase">
          LOOK EXPENSIVE · PAY LESS
        </p>
      </footer>

      {/* Pixel Music Player on Building Page */}
      <PixelMusicPlayer />
    </div>
  );
}
