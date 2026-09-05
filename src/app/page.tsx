import { db } from '@/lib/db';
import HeroSlider from '@/components/home/HeroSlider';
import TrendingDeals from '@/components/home/TrendingDeals';
import CategoryBlocks from '@/components/home/CategoryBlocks';
import BrandSection from '@/components/home/BrandSection';
import InstagramReelsSection from '@/components/home/InstagramReelsSection';
import HowItWorks from '@/components/home/HowItWorks';

export const revalidate = 0; // Fresh deals on load

export default async function HomePage() {
  const slides = db.getHeroSlides(true);
  const products = db.getProducts({ status: 'ACTIVE' });
  const categories = db.getCategories();
  const marketplaces = db.getMarketplaces();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Rotating Slider */}
      <HeroSlider slides={slides} />

      {/* 2. Trending Deals Grid */}
      <TrendingDeals products={products} />

      {/* 3. Full Category Archive */}
      <CategoryBlocks categories={categories} />

      {/* 4. Shop by Store / Brand */}
      <BrandSection marketplaces={marketplaces} />

      {/* 5. Instagram Reels Section */}
      <InstagramReelsSection />

      {/* 6. How TARZER Works 3-Step Guide */}
      <HowItWorks />
    </div>
  );
}
