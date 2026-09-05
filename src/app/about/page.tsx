import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Sparkles, HelpCircle, Mail } from 'lucide-react';
import { Instagram } from '@/components/ui/InstagramIcon';

export const metadata = {
  title: 'About TARZER — The Fashion Deal Radar',
  description: 'Learn about TARZER, our mission to make high-end fashion affordable, and how our affiliate discovery engine works.'
};

export default function AboutPage() {
  const faqs = [
    {
      q: 'How does TARZER work?',
      a: 'TARZER is a curated fashion deal discovery platform. We do not sell items directly or hold inventory. Instead, our team and automated radar scan top marketplaces like Amazon, Myntra, Meesho, and Shopsy to uncover verified low-price deals. When you click "View Deal", you are redirected directly to the seller to complete your purchase.'
    },
    {
      q: 'Does using TARZER cost me anything extra?',
      a: 'Zero. TARZER is 100% free for shoppers. In fact, you often save between 40% and 80% on normal retail prices. We may earn a modest affiliate commission from partner marketplaces when you purchase, at absolutely no additional cost to you.'
    },
    {
      q: 'Why did the price change when I clicked the deal?',
      a: 'Online marketplace pricing and flash sales change rapidly based on seller inventory and demand. We update our database continuously, but please check the final checkout price on the original store platform.'
    },
    {
      q: 'Are the products authentic?',
      a: 'Yes. All deals point to verified sellers on established marketplaces like Amazon, Myntra, and official brand stores with standard buyer protection and return policies.'
    }
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Manifesto Hero */}
      <div className="pb-12 mb-16 border-b-2 border-[#111111] grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF6A00] inline-block"></span>
            <span className="font-pixel text-xs uppercase tracking-widest text-[#FF6A00]">
              THE TARZER MANIFESTO
            </span>
          </div>
          <h1 className="font-pixel text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] text-[#111111]">
            LOOK EXPENSIVE.<br />
            <span className="text-[#FF6A00]">PAY LESS.</span>
          </h1>
          <p className="text-lg sm:text-xl font-display font-medium text-[#111111]/80 max-w-2xl leading-relaxed pt-2">
            Great style isn&rsquo;t about how much you spend — it&rsquo;s about knowing where to find it. TARZER is the minimalist radar for Gen Z and modern fashion enthusiasts who refuse to pay full retail.
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
          <div className="relative w-24 h-24 bg-[#FF6A00] p-3 shadow-md mb-3">
            <Image
              src="/logo.png"
              alt="TARZER"
              width={96}
              height={96}
              className="object-contain w-full h-full"
            />
          </div>
          <span className="text-xs font-mono uppercase text-[#111111]/60">
            EST. 2026 · AFFILIATE DISCOVERY
          </span>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-8 bg-[#F5F5F5] border border-[#111111]/15 space-y-4">
          <div className="w-10 h-10 bg-[#111111] text-[#FF6A00] flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-pixel text-2xl font-bold uppercase text-[#111111]">
            ZERO CLUTTER
          </h3>
          <p className="text-sm text-[#111111]/70 leading-relaxed font-sans">
            We stripped away confusing carts, spam banners, and fake countdown timers. Just high-res curation, authentic discounts, and direct links.
          </p>
        </div>

        <div className="p-8 bg-[#F5F5F5] border border-[#111111]/15 space-y-4">
          <div className="w-10 h-10 bg-[#FF6A00] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-pixel text-2xl font-bold uppercase text-[#111111]">
            RADAR PRECISION
          </h3>
          <p className="text-sm text-[#111111]/70 leading-relaxed font-sans">
            Our curators filter through tens of thousands of items across Amazon, Myntra, Meesho, and Shopsy to isolate genuine lowest-price drops.
          </p>
        </div>

        <div className="p-8 bg-[#F5F5F5] border border-[#111111]/15 space-y-4">
          <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-pixel text-2xl font-bold uppercase text-[#111111]">
            GEN Z AESTHETIC
          </h3>
          <p className="text-sm text-[#111111]/70 leading-relaxed font-sans">
            Curated through an editorial streetwear lens. From vintage washed denim to heavyweight boxy tees and chunky lug-sole boots.
          </p>
        </div>
      </div>

      {/* Affiliate Transparency Section */}
      <div className="bg-[#111111] text-white p-8 sm:p-14 mb-20 border border-white/10 space-y-4">
        <span className="text-xs font-pixel text-[#FF6A00] tracking-widest uppercase block">
          ETHICS & TRANSPARENCY
        </span>
        <h2 className="font-pixel text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          OUR AFFILIATE COMMITMENT
        </h2>
        <p className="text-sm sm:text-base text-white/75 leading-relaxed max-w-3xl">
          TARZER participates in affiliate marketing programs, including the Amazon Associates Program and partner affiliate networks. This means we may earn a referral commission on qualifying purchases made through links on our site.
        </p>
        <p className="text-sm sm:text-base text-white/75 leading-relaxed max-w-3xl">
          Our editorial recommendations are always independent. We feature products solely because of their aesthetic appeal, high value-for-money, and genuine discount rates.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="mb-20">
        <div className="mb-8 pb-4 border-b-2 border-[#111111] flex items-center justify-between">
          <h2 className="font-pixel text-3xl sm:text-4xl font-extrabold uppercase text-[#111111]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <HelpCircle className="w-6 h-6 text-[#FF6A00]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 bg-[#FAFAFA] border border-[#111111]/10 space-y-2">
              <h3 className="font-bold text-base text-[#111111]">
                {faq.q}
              </h3>
              <p className="text-sm text-[#111111]/70 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Banner */}
      <div className="p-8 sm:p-12 bg-[#FF6A00] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <span className="text-xs font-pixel uppercase tracking-widest text-black">
            COLLABORATIONS & PARTNERSHIPS
          </span>
          <h2 className="font-pixel text-3xl sm:text-4xl font-bold uppercase text-white">
            WANT TO LIST YOUR BRAND?
          </h2>
          <p className="text-sm text-white/90">
            For brand partnerships, affiliate integrations, or curated drops, reach our team at <strong className="underline">contact@tarzer.in</strong> or message us on Instagram.
          </p>
          <div className="pt-1">
            <a
              href="https://www.instagram.com/tarzer.official"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-white hover:text-[#111111] text-white text-xs font-mono uppercase font-bold px-4 py-2 transition-colors group"
            >
              <Instagram className="w-4 h-4 text-[#FF6A00] group-hover:text-[#111111] transition-colors" />
              <span>@tarzer.official</span>
            </a>
          </div>
        </div>
        <Link
          href="/deals"
          className="bg-[#111111] hover:bg-white hover:text-[#111111] text-white font-bold text-xs uppercase tracking-widest px-8 py-4 transition-colors rounded-none whitespace-nowrap"
        >
          EXPLORE DEALS →
        </Link>
      </div>
    </div>
  );
}
