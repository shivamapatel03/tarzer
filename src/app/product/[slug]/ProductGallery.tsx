'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  mainImage: string;
  images?: { id: string; image_url: string }[];
  title: string;
}

export default function ProductGallery({ mainImage, images = [], title }: ProductGalleryProps) {
  // Combine main image and any extra gallery images, deduplicating
  const allImages = [mainImage, ...images.map((i) => i.image_url)].filter(
    (img, idx, arr) => arr.indexOf(img) === idx
  );

  const [selected, setSelected] = useState(allImages[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails (if multiple) */}
      {allImages.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[550px] scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(img)}
              className={`relative w-16 h-20 flex-shrink-0 bg-[#F5F5F5] border-2 transition-colors cursor-pointer ${
                selected === img ? 'border-[#FF6A00]' : 'border-transparent hover:border-[#111111]/30'
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Canvas */}
      <div className="relative aspect-[3/4] w-full max-h-[600px] bg-[#F5F5F5] border border-[#111111]/15 overflow-hidden group">
        <Image
          src={selected}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-[#111111]/90 backdrop-blur-xs text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1">
          HIGH-RES VERIFIED
        </div>
      </div>
    </div>
  );
}
