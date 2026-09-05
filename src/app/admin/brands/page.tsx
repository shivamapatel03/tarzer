import Link from 'next/link';
import { db } from '@/lib/db';
import { Store, ExternalLink } from 'lucide-react';
import StoreLogo from '@/components/ui/StoreLogo';

export const revalidate = 0;

export default function AdminBrandsPage() {
  const marketplaces = db.getMarketplaces();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-mono text-[#FF6A00] uppercase tracking-wider block font-bold">
            PARTNER INTEGRATIONS
          </span>
          <h1 className="font-pixel text-2xl sm:text-3xl font-bold uppercase text-neutral-900 tracking-tight">
            SUPPORTED STORE PARTNERS
          </h1>
        </div>
        <div className="bg-[#111111] text-white px-3 py-1 text-xs font-mono uppercase font-bold">
          {marketplaces.length} STORES INTEGRATED
        </div>
      </div>

      {/* Grid of Stores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {marketplaces.map((mp) => (
          <div
            key={mp.id}
            className="bg-white border border-neutral-200 p-5 flex flex-col justify-between space-y-4 hover:border-neutral-400 transition-all shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-9 flex items-center">
                  <StoreLogo slug={mp.slug} name={mp.name} className="h-7 w-auto max-w-[120px]" />
                </div>
                <div>
                  <h3 className="font-pixel text-xl font-bold uppercase text-neutral-900">
                    {mp.name}
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400 block">
                    {mp.website}
                  </span>
                </div>
              </div>

              <span className="bg-[#111111] text-white px-2.5 py-1 text-xs font-mono font-bold">
                {mp.product_count || 0} DEALS
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-neutral-400">
                ID: {mp.id}
              </span>
              <Link
                href={`/brand/${mp.slug}`}
                target="_blank"
                className="text-xs font-mono uppercase font-bold text-[#FF6A00] hover:underline flex items-center gap-1"
              >
                VIEW LIVE RADAR <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
