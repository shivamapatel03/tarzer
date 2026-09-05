'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroSlide } from '@/lib/types';

interface HeroSliderProps {
  slides?: HeroSlide[];
}

const defaultSlides: HeroSlide[] = [
  {
    id: 'slide_1',
    title: 'LOOK EXPENSIVE.\nPAY LESS.',
    subtitle: 'The best fashion deals from your favorite stores, all in one place.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=2560&auto=format&fit=crop&q=95',
    button_text: 'EXPLORE DEALS',
    button_url: '/deals',
    theme: 'light',
    display_order: 1,
    active: true
  },
  {
    id: 'slide_2',
    title: 'UP TO 80% OFF\nON STYLE.',
    subtitle: 'Discover the latest clothing and apparel offers curated daily.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2560&auto=format&fit=crop&q=95',
    button_text: 'SHOP NOW',
    button_url: '/deals?sort=discount',
    theme: 'light',
    display_order: 2,
    active: true
  },
  {
    id: 'slide_3',
    title: 'TARZER PICKS.\nLOWEST PRICES.',
    subtitle: 'Find fashion worth buying without wasting hours searching.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=2560&auto=format&fit=crop&q=95',
    button_text: 'VIEW OFFERS',
    button_url: '/deals?badge=TARZER+PICK',
    theme: 'light',
    display_order: 3,
    active: true
  }
];

export default function HeroSlider({ slides = defaultSlides }: HeroSliderProps) {
  const activeSlides = slides && slides.length > 0 ? slides.filter((s) => s.active) : defaultSlides;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto transition every 3 seconds
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, activeSlides.length]);

  const slide = activeSlides[current] || activeSlides[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 w-full">
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white text-[#111111] min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex flex-col justify-between shadow-xs"
      >
        {/* Background Image with natural rich color & full vibrancy */}
        <div className="absolute inset-0 z-0 rounded-2xl sm:rounded-3xl overflow-hidden">
          <Image
            src={slide.image}
            alt={slide.title.replace('\n', ' ')}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-right md:object-center rounded-2xl sm:rounded-3xl transition-all duration-700 ease-out brightness-[0.98] contrast-[1.05]"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-20 px-6 sm:px-10 md:px-12 py-8 sm:py-10 md:py-12 w-full flex-1 flex flex-col justify-between">
          <div className="max-w-xl md:max-w-2xl flex flex-col justify-center space-y-3 sm:space-y-4 my-auto">
            {/* Main Title */}
            <h1 className="font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.0] whitespace-pre-line text-[#111111]">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base font-display max-w-lg leading-relaxed text-[#111111]/80">
              {slide.subtitle}
            </p>

            {/* CTA Button & Details */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={slide.button_url}
                className="inline-flex items-center gap-2 px-6 py-3 font-bold text-xs uppercase tracking-widest transition-all duration-200 rounded-sm shadow-sm bg-[#111111] text-white hover:bg-[#FF6A00]"
              >
                <span>{slide.button_text}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <span className="text-[11px] font-mono uppercase tracking-wider text-[#111111]/60 font-semibold">
                0% MARKUP · DIRECT AFFILIATE
              </span>
            </div>
          </div>

          {/* Minimal Slide Progress Indicator Bars */}
          <div className="mt-8 pt-2 flex items-center gap-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  current === idx ? 'w-8 bg-[#FF6A00]' : 'w-2 bg-[#111111]/20 hover:bg-[#111111]/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
