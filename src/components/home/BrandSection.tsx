import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Marketplace } from '@/lib/types';
import StoreLogo from '@/components/ui/StoreLogo';

interface BrandSectionProps {
  marketplaces: Marketplace[];
}

export default function BrandSection({ marketplaces }: BrandSectionProps) {
  // Store brand taglines
  const storeMeta: Record<string, { tagline: string; discountRange: string; badgeColor: string }> = {
    amazon: {
      tagline: 'Lightning deals & brand outlets with express delivery',
      discountRange: 'UP TO 70% OFF',
      badgeColor: 'bg-[#FF9900] text-black'
    },
    myntra: {
      tagline: 'Top fashion brands, designer drops & sneaker steals',
      discountRange: 'UP TO 80% OFF',
      badgeColor: 'bg-[#FF3F6C] text-white'
    },
    meesho: {
      tagline: 'Wholesale-rate streetwear, everyday basics & unbranded gems',
      discountRange: 'STARTING AT ₹199',
      badgeColor: 'bg-[#570A57] text-white'
    },
    shopsy: {
      tagline: 'Budget fashion trends with massive seasonal clearance',
      discountRange: 'UP TO 75% OFF',
      badgeColor: 'bg-[#0070E0] text-white'
    }
  };

  return (
    <section id="brands" className="py-16 md:py-24 bg-[#F5F5F5] border-b border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b-2 border-[#111111]">
          <div>
            <span className="text-xs font-pixel text-[#FF6A00] tracking-widest uppercase block mb-1">
              SUPPORTED PLATFORMS
            </span>
            <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] uppercase tracking-tight">
              SHOP THE BEST OFFERS
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#111111]/60 uppercase tracking-wider mt-2 md:mt-0">
            COMPARE DISCOUNTS ACROSS TOP MARKETPLACES
          </p>
        </div>

        {/* Marketplaces Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketplaces.map((mp) => {
            const meta = storeMeta[mp.slug] || {
              tagline: 'Curated fashion deals with direct affiliate redirection',
              discountRange: 'BIG DISCOUNTS',
              badgeColor: 'bg-[#111111] text-white'
            };

            return (
              <Link
                key={mp.id}
                href={`/brand/${mp.slug}`}
                className="group relative bg-white border border-[#111111]/15 hover:border-[#111111] p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xs"
              >
                {/* Store Header with Real Official Logo */}
                <div>
                  <div className="flex items-center justify-between mb-4 min-h-[38px]">
                    <StoreLogo slug={mp.slug} name={mp.name} className="h-8 sm:h-9 w-auto max-w-[140px]" />
                    <span className={`text-[10px] font-pixel px-2 py-0.5 uppercase tracking-wider ${meta.badgeColor}`}>
                      {meta.discountRange}
                    </span>
                  </div>

                  <p className="text-xs text-[#111111]/70 leading-relaxed min-h-[36px]">
                    {meta.tagline}
                  </p>
                </div>

                {/* Store Footer Link */}
                <div className="pt-6 mt-4 border-t border-[#111111]/10 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1 group-hover:text-[#FF6A00] transition-colors">
                    {mp.product_count !== undefined ? `${mp.product_count} ACTIVE DEALS` : 'BROWSE DEALS'}
                  </span>
                  <div className="w-8 h-8 bg-[#111111] text-white group-hover:bg-[#FF6A00] flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
