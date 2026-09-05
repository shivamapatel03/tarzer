import { db } from '@/lib/db';
import { MousePointerClick, TrendingUp, Store, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default function AdminAnalyticsPage() {
  const analytics = db.getAnalytics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-mono text-[#FF6A00] uppercase tracking-wider block font-bold">
            TELEMETRY & CONVERSIONS
          </span>
          <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-neutral-900 tracking-tight">
            AFFILIATE CLICK ANALYTICS
          </h1>
        </div>
        <div className="bg-[#111111] text-white px-3.5 py-1.5 font-mono text-xs font-bold uppercase">
          {analytics.totalClicks} RECORDED REDIRECTS
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-neutral-200 space-y-1">
          <span className="text-xs font-mono uppercase text-neutral-500 font-semibold">Total Clicks</span>
          <p className="font-display text-3xl font-black text-neutral-900">
            {analytics.totalClicks}
          </p>
          <span className="text-[10px] font-mono text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 inline-block font-bold">
            RADAR ACTIVE
          </span>
        </div>

        <div className="bg-white p-5 border border-neutral-200 space-y-1">
          <span className="text-xs font-mono uppercase text-neutral-500 font-semibold">Top Converting Store</span>
          <p className="font-pixel text-2xl font-bold uppercase text-neutral-900">
            {analytics.topMarketplace?.name || 'Amazon'}
          </p>
          <span className="text-xs font-mono text-[#FF6A00] font-bold">
            {analytics.topMarketplace?.clicks || 0} REDIRECTS
          </span>
        </div>

        <div className="bg-white p-5 border border-neutral-200 space-y-1">
          <span className="text-xs font-mono uppercase text-neutral-500 font-semibold">Active Catalog Items</span>
          <p className="font-display text-3xl font-black text-neutral-900">
            {analytics.activeDeals}
          </p>
          <span className="text-xs font-mono text-neutral-400">OF {analytics.totalProducts} TOTAL</span>
        </div>
      </div>

      {/* Click Traffic by Marketplace */}
      <div className="bg-white p-5 border border-neutral-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#FF6A00]" /> CLICK SHARE BY STORE PARTNER
          </h3>
          <span className="text-[10px] font-mono text-neutral-400">{analytics.marketplaceBreakdown.length} STORES</span>
        </div>

        <div className="space-y-3">
          {analytics.marketplaceBreakdown.map((m: any) => (
            <div key={m.name} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-neutral-800">{m.name}</span>
                <span className="text-neutral-500">
                  {m.clicks} clicks ({analytics.totalClicks > 0 ? Math.round((m.clicks / analytics.totalClicks) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-[#FF6A00] transition-all"
                  style={{
                    width: `${analytics.totalClicks > 0 ? (m.clicks / analytics.totalClicks) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Clicks Log */}
      <div className="bg-white border border-neutral-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div>
            <h3 className="font-pixel text-base font-bold uppercase text-neutral-900">
              RECENT REDIRECT EVENTS
            </h3>
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              Live affiliate outbound traffic log
            </span>
          </div>
          <Clock className="w-4 h-4 text-neutral-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 font-mono text-neutral-400 uppercase text-[10px]">
                <th className="py-2 px-3">Event ID</th>
                <th className="py-2 px-3">Product</th>
                <th className="py-2 px-3">Store</th>
                <th className="py-2 px-3">Referrer</th>
                <th className="py-2 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              {analytics.recentClicks.map((click: any) => (
                <tr key={click.id} className="hover:bg-neutral-50">
                  <td className="py-2.5 px-3 text-neutral-400 text-[11px]">{click.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-neutral-900 max-w-xs truncate">
                    {click.product_title || 'Product Deal'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 text-[10px] font-bold">
                      {click.marketplace_name || 'Store'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-neutral-400 text-[11px] truncate max-w-[140px]">
                    {click.referrer || 'Direct'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-neutral-500 text-[11px]">
                    {new Date(click.clicked_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
