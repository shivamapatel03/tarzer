'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@tarzer.in');
  const [password, setPassword] = useState('shivam@171450');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@tarzer.in');
    setPassword('shivam@171450');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-center items-center px-4 py-12 antialiased selection:bg-[#FF6A00] selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to TARZER
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex relative w-14 h-14 bg-[#FF6A00] p-2 shadow-lg mb-1">
            <Image
              src="/logo.png"
              alt="TARZER"
              width={56}
              height={56}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <h1 className="font-pixel text-2xl font-bold uppercase tracking-tight text-white">
            ADMINISTRATOR PORTAL
          </h1>
          <p className="text-[11px] font-mono uppercase text-white/50 tracking-widest">
            TARZER CONTROL CENTER
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 border border-white/10 p-7 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/20 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6A00] font-mono"
                  placeholder="admin@tarzer.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/20 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6A00] font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6A00] hover:bg-[#E55F00] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-md font-mono"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>ENTER DASHBOARD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Fill Box */}
          <div className="p-3 bg-white/5 border border-white/10 text-[11px] font-mono text-white/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-white/80 font-bold text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A00]" /> DEFAULT CREDENTIALS:
              </div>
              <p className="text-[10px] text-white/60">admin@tarzer.in / shivam@171450</p>
            </div>

            <button
              type="button"
              onClick={handleQuickFill}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono uppercase cursor-pointer transition-colors"
            >
              Fill In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
