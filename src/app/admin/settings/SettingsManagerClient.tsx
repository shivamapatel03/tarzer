'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Database, Key, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, ShieldCheck, Construction, Music } from 'lucide-react';
import { Instagram } from '@/components/ui/InstagramIcon';

export default function SettingsManagerClient() {
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [buildingMode, setBuildingMode] = useState(false);
  const [loadingBuildingMode, setLoadingBuildingMode] = useState(false);
  const [buildingModeMessage, setBuildingModeMessage] = useState('');
  const [supabaseStatus, setSupabaseStatus] = useState<{
    tested: boolean;
    ok?: boolean;
    message?: string;
    url?: string;
  }>({
    tested: false
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.building_mode === 'boolean') {
          setBuildingMode(data.building_mode);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleBuildingMode = async () => {
    setLoadingBuildingMode(true);
    setBuildingModeMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ building_mode: !buildingMode })
      });
      const data = await res.json();
      if (data.success) {
        setBuildingMode(data.building_mode);
        setBuildingModeMessage(data.message);
      }
    } catch (err: any) {
      setBuildingModeMessage('Failed to update: ' + err.message);
    } finally {
      setLoadingBuildingMode(false);
    }
  };

  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    try {
      const res = await fetch('/api/admin/supabase-status');
      const data = await res.json();
      setSupabaseStatus({
        tested: true,
        ok: data.ok,
        message: data.message,
        url: data.url
      });
    } catch (err: any) {
      setSupabaseStatus({
        tested: true,
        ok: false,
        message: err.message || 'Could not connect to Supabase endpoint'
      });
    } finally {
      setTestingSupabase(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-mono text-[#FF6A00] uppercase tracking-wider block font-bold">
            PLATFORM CONFIGURATION
          </span>
          <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-neutral-900 tracking-tight">
            SYSTEM SETTINGS
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 0. Website Public Status / Building Mode Card */}
        <div className={`border-2 p-5 space-y-4 shadow-2xs md:col-span-2 transition-all ${
          buildingMode ? 'bg-amber-50/70 border-amber-500' : 'bg-white border-neutral-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 flex items-center justify-center shrink-0 ${
                buildingMode ? 'bg-amber-500 text-white' : 'bg-green-600 text-white'
              }`}>
                <Construction className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <span>WEBSITE STATUS:</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold ${
                    buildingMode ? 'bg-amber-500 text-white' : 'bg-green-600 text-white'
                  }`}>
                    {buildingMode ? 'BUILDING... MODE (ENABLED)' : 'LIVE TO ALL VISITORS'}
                  </span>
                </h3>
                <p className="text-[11px] font-mono text-neutral-600 mt-0.5">
                  {buildingMode
                    ? 'Public visitors see the animated 8-bit "We are Building..." page. Admin panel remains fully accessible.'
                    : 'The full TARZER website is currently LIVE to all visitors.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleToggleBuildingMode}
                disabled={loadingBuildingMode}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer border ${
                  buildingMode
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-700 shadow-sm'
                    : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm'
                }`}
              >
                {loadingBuildingMode
                  ? 'SWITCHING...'
                  : buildingMode
                  ? 'DISABLE & GO LIVE'
                  : 'ACTIVATE BUILDING MODE'}
              </button>

              <Link
                href="/"
                target="_blank"
                className="px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-1"
              >
                <span>VIEW SITE</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              </Link>
            </div>
          </div>

          {buildingModeMessage && (
            <p className="text-xs font-mono text-[#FF6A00] font-bold">
              ✓ {buildingModeMessage}
            </p>
          )}
        </div>

        {/* 1. Supabase Cloud Configuration Card */}
        <div className="bg-white border border-neutral-200 p-5 space-y-4 shadow-2xs md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#FF6A00]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900">
                SUPABASE PROJECT CONFIGURATION
              </h3>
            </div>
            <button
              onClick={handleTestSupabase}
              disabled={testingSupabase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] hover:bg-[#FF6A00] text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {testingSupabase ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>TESTING CONNECTION...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>TEST CONNECTION</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-neutral-500 uppercase text-[10px] mb-1">
                NEXT_PUBLIC_SUPABASE_URL
              </label>
              <input
                type="text"
                readOnly
                value="https://dmnfohvegrwfbntogxcc.supabase.co"
                className="w-full bg-neutral-50 border border-neutral-200 p-2 text-neutral-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-500 uppercase text-[10px] mb-1">
                NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
              </label>
              <input
                type="text"
                readOnly
                value="sb_publishable_Xv2Z2qF3VUqy_bfQvGNy6w_6DMuUmNP"
                className="w-full bg-neutral-50 border border-neutral-200 p-2 text-neutral-800 font-bold truncate"
              />
            </div>
          </div>

          {/* Test Status Banner */}
          {supabaseStatus.tested && (
            <div
              className={`p-3 text-xs font-mono flex items-start gap-2 border ${
                supabaseStatus.ok
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {supabaseStatus.ok ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{supabaseStatus.ok ? 'Connection Successful' : 'Connection Error'}</p>
                <p className="text-[11px] text-neutral-600 mt-0.5">{supabaseStatus.message}</p>
              </div>
            </div>
          )}

          <div className="p-3 bg-neutral-50 border border-neutral-200 text-[11px] font-mono text-neutral-600 space-y-1">
            <p className="font-bold text-neutral-800">✓ Supabase Schema Status:</p>
            <p>Database schema definition is available in <code className="text-[#FF6A00] font-bold">supabase-schema.sql</code>.</p>
          </div>
        </div>

        {/* 2. Affiliate Credentials Card */}
        <div className="bg-white border border-neutral-200 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <Key className="w-4 h-4 text-[#FF6A00]" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900">
              AFFILIATE PROGRAM TAGS
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-neutral-500 uppercase text-[10px] mb-1">
                Amazon Associates Store ID
              </label>
              <input
                type="text"
                readOnly
                value="tarzerindia-21"
                className="w-full bg-neutral-50 border border-neutral-200 p-2 text-neutral-800 font-bold"
              />
            </div>
            <div>
              <label className="block text-neutral-500 uppercase text-[10px] mb-1">
                EarnKaro User ID (Myntra, Meesho, Shopsy)
              </label>
              <input
                type="text"
                readOnly
                value="2404238"
                className="w-full bg-neutral-50 border border-neutral-200 p-2 text-neutral-800 font-bold"
              />
            </div>
            <div>
              <label className="block text-neutral-500 uppercase text-[10px] mb-1">
                EarnKaro Profit Link Format
              </label>
              <input
                type="text"
                readOnly
                value="https://ekaro.in/enkr?id=2404238&url={DESTINATION_URL}"
                className="w-full bg-neutral-50 border border-neutral-200 p-2 text-neutral-800 font-bold truncate text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* 3. Official Brand Channels */}
        <div className="bg-white border border-neutral-200 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <Instagram className="w-4 h-4 text-[#FF6A00]" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900">
              OFFICIAL SOCIAL CHANNELS
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-neutral-500 uppercase text-[10px] mb-1">
                Instagram Official Handle
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="@tarzer.official"
                  className="w-full bg-neutral-50 border border-neutral-200 p-2 text-neutral-800 font-bold"
                />
                <a
                  href="https://www.instagram.com/tarzer.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 bg-[#FF6A00] text-white font-bold text-xs uppercase hover:bg-[#111111] transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>VISIT</span>
                </a>
              </div>
            </div>

            <div className="pt-2 text-xs font-sans text-neutral-600 leading-relaxed border-t border-neutral-100">
              Direct profile URL: <a href="https://www.instagram.com/tarzer.official" target="_blank" rel="noopener noreferrer" className="text-[#FF6A00] font-mono underline font-bold">https://www.instagram.com/tarzer.official</a>
            </div>
          </div>
        </div>

        {/* 4. Background Music Engine Card */}
        <div className="bg-white border border-neutral-200 p-5 space-y-4 shadow-2xs md:col-span-2">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <Music className="w-4 h-4 text-[#FF6A00]" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900">
              PIXEL MUSIC PLAYER (8-BIT SOUNDTRACK)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="block text-neutral-500 uppercase text-[10px] mb-1">
                Active Audio File
              </label>
              <input
                type="text"
                readOnly
                value="/music/music.mp3"
                className="w-full bg-neutral-50 border border-neutral-200 p-2 text-neutral-800 font-bold"
              />
            </div>
            <div>
              <label className="block text-neutral-500 uppercase text-[10px] mb-1">
                Playback Start Point
              </label>
              <input
                type="text"
                readOnly
                value="10 Seconds (Start Offset)"
                className="w-full bg-neutral-50 border border-neutral-200 p-2 text-[#FF6A00] font-bold"
              />
            </div>
            <div>
              <label className="block text-neutral-500 uppercase text-[10px] mb-1">
                Visualizer UI
              </label>
              <input
                type="text"
                readOnly
                value="Dynamic Pixel Equalizer & Logo Disc"
                className="w-full bg-neutral-50 border border-neutral-200 p-2 text-neutral-800 font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
