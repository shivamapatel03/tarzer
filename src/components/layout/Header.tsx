'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  PixelSearchIcon,
  PixelChevronDown,
  PixelMenuIcon,
  PixelCloseIcon,
  PixelArrowRight,
} from '@/components/ui/PixelIcons';
import { PixelHotIcon } from '@/components/ui/PixelHotIcon';
import CategoryBar from './CategoryBar';
import StoreLogo from '@/components/ui/StoreLogo';
import { Search, X } from 'lucide-react';

const brandList = [
  { name: 'Amazon', slug: 'amazon' },
  { name: 'Myntra', slug: 'myntra' },
  { name: 'Meesho', slug: 'meesho' },
  { name: 'Shopsy', slug: 'shopsy' },
];

const categoryList = [
  { name: 'Men', slug: 'men' },
  { name: 'Women', slug: 'women' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Streetwear', slug: 'streetwear' },
  { name: 'Gen Z', slug: 'gen-z' },
  { name: 'Korean', slug: 'korean' },
  { name: 'T-Shirts', slug: 't-shirts' },
  { name: 'Hoodies', slug: 'hoodies' },
  { name: 'Jackets', slug: 'jackets' },
  { name: 'Jeans', slug: 'jeans' },
  { name: 'Shoes', slug: 'shoes' },
  { name: 'Shirts', slug: 'shirts' }
];

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [brandsDropdownOpen, setBrandsDropdownOpen] = useState(false);
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/deals?q=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#111111]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 md:w-9 md:h-9 bg-[#FF6A00] flex-shrink-0 overflow-hidden shadow-xs">
                <Image
                  src="/logo.png"
                  alt="TARZER"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <span className="font-pixel text-xl md:text-2xl font-bold tracking-tight text-[#111111] group-hover:text-[#FF6A00] transition-colors leading-none">
                TARZER
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 shrink-0">
            <Link
              href="/deals"
              className="text-xs sm:text-sm font-semibold tracking-wider text-[#111111] hover:text-[#FF6A00] transition-colors uppercase flex items-center gap-1.5 group"
            >
              <span>Deals</span>
              <PixelHotIcon className="w-4 h-4" />
            </Link>

            {/* Brands Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setBrandsDropdownOpen(true)}
              onMouseLeave={() => setBrandsDropdownOpen(false)}
            >
              <button
                onClick={() => setBrandsDropdownOpen(!brandsDropdownOpen)}
                className="text-xs sm:text-sm font-semibold tracking-wider text-[#111111] hover:text-[#FF6A00] transition-colors uppercase flex items-center gap-1 py-4 cursor-pointer"
              >
                <span>Brands</span>
                <PixelChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${
                    brandsDropdownOpen ? 'rotate-180 text-[#FF6A00]' : 'text-[#111111]/60'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`${
                  brandsDropdownOpen ? 'block' : 'hidden group-hover:lg:block'
                } absolute top-full left-0 w-72 bg-white border-2 border-[#111111] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
              >
                <div className="space-y-1">
                  {brandList.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={`/brand/${brand.slug}`}
                      onClick={() => setBrandsDropdownOpen(false)}
                      className="group/item flex items-center justify-between p-2.5 hover:bg-[#F5F5F5] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-20 flex items-center justify-start">
                          <StoreLogo
                            slug={brand.slug}
                            name={brand.name}
                            className="h-5 sm:h-6 w-auto max-w-[75px]"
                            height={24}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-tight text-[#111111] group-hover/item:text-[#FF6A00] transition-colors">
                          {brand.name}
                        </span>
                      </div>
                      <PixelArrowRight className="w-3.5 h-3.5 text-[#111111]/40 group-hover/item:text-[#FF6A00] group-hover/item:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>

                <div className="my-1.5 border-t border-[#111111]/10" />

                <Link
                  href="/deals"
                  onClick={() => setBrandsDropdownOpen(false)}
                  className="group/deals flex items-center justify-between p-2.5 bg-[#111111] text-white hover:bg-[#FF6A00] transition-colors"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    All Products From This Platform
                  </span>
                  <PixelArrowRight className="w-3.5 h-3.5 group-hover/deals:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <Link
              href="/about"
              className="text-xs sm:text-sm font-semibold tracking-wider text-[#111111]/70 hover:text-[#FF6A00] transition-colors uppercase"
            >
              About
            </Link>
          </nav>

          {/* Comfortable Inline Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative hidden md:block w-60 lg:w-72 shrink-0"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals..."
                className="w-full h-9 sm:h-10 bg-[#F5F5F5] hover:bg-[#EFEFEF] focus:bg-white border border-[#111111]/15 focus:border-[#FF6A00] rounded-full pl-9 pr-8 text-xs sm:text-sm text-[#111111] placeholder:text-[#111111]/45 focus:outline-none transition-all font-medium"
              />
              <Search className="w-4 h-4 text-[#111111]/50 absolute left-3 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-[#111111]/40 hover:text-[#111111] cursor-pointer p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111111] hover:text-[#FF6A00] transition-colors cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <PixelCloseIcon className="w-5 h-5" /> : <PixelMenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#111111]/10 px-4 pt-3 pb-6 space-y-3">
            {/* Simple Inline Search for Mobile */}
            <form onSubmit={handleSearch} className="relative w-full pt-1 pb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals..."
                className="w-full bg-[#F5F5F5] border border-[#111111]/15 focus:border-[#FF6A00] rounded-full pl-9 pr-8 py-2 text-xs text-[#111111] placeholder:text-[#111111]/50 focus:outline-none font-medium"
              />
              <Search className="w-4 h-4 text-[#111111]/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#111111]/40 hover:text-[#111111] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold uppercase tracking-wider text-[#111111] hover:text-[#FF6A00] py-2 border-b border-[#F5F5F5]"
            >
              Home
            </Link>
            <Link
              href="/deals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-base font-bold uppercase tracking-wider text-[#111111] hover:text-[#FF6A00] py-2 border-b border-[#F5F5F5] group"
            >
              <span className="flex items-center gap-2">
                <span>All Deals</span>
                <PixelHotIcon className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-pixel px-1.5 py-0.5 bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/30 font-bold tracking-wider">
                HOT
              </span>
            </Link>

            {/* Mobile Categories Accordion */}
            <div>
              <button
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                className="w-full flex items-center justify-between text-base font-bold uppercase tracking-wider text-[#111111] hover:text-[#FF6A00] py-2 border-b border-[#F5F5F5] cursor-pointer"
              >
                <span>Categories</span>
                <PixelChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    mobileCategoriesOpen ? 'rotate-180 text-[#FF6A00]' : ''
                  }`}
                />
              </button>
              {mobileCategoriesOpen && (
                <div className="grid grid-cols-2 gap-1.5 py-2 px-2 bg-[#F5F5F5] border border-[#111111]/10 my-1">
                  {categoryList.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1 px-1.5 text-xs font-semibold uppercase text-[#111111] hover:text-[#FF6A00] truncate"
                    >
                      • {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Brands Accordion */}
            <div>
              <button
                onClick={() => setMobileBrandsOpen(!mobileBrandsOpen)}
                className="w-full flex items-center justify-between text-base font-bold uppercase tracking-wider text-[#111111] hover:text-[#FF6A00] py-2 border-b border-[#F5F5F5] cursor-pointer"
              >
                <span>Brands</span>
                <PixelChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    mobileBrandsOpen ? 'rotate-180 text-[#FF6A00]' : ''
                  }`}
                />
              </button>
              {mobileBrandsOpen && (
                <div className="py-2 px-2 bg-[#F5F5F5] border border-[#111111]/10 my-1 space-y-1">
                  {brandList.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={`/brand/${brand.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 bg-white hover:bg-[#111111] hover:text-white transition-colors group"
                    >
                      <div className="h-5 w-16 flex items-center justify-start">
                        <StoreLogo
                          slug={brand.slug}
                          name={brand.name}
                          className="h-5 w-auto max-w-[60px]"
                          height={20}
                        />
                      </div>
                      <span className="text-xs font-bold uppercase">{brand.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold uppercase tracking-wider text-[#111111] hover:text-[#FF6A00] py-2 border-b border-[#F5F5F5]"
            >
              About TARZER
            </Link>
          </div>
        )}
      </header>

      {/* Second Navbar: Dedicated Category Bar */}
      <CategoryBar />
    </>
  );
}
