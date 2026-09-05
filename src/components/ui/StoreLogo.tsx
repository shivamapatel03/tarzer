import React from 'react';

interface StoreLogoProps {
  slug: string;
  name?: string;
  className?: string;
  height?: number;
}

export function AmazonLogo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/amazon-png.webp"
      alt="Amazon"
      className={`object-contain max-h-full w-auto select-none ${className}`}
      loading="eager"
    />
  );
}

export function MyntraLogo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/myntranew.svg"
      alt="Myntra"
      className={`object-contain max-h-full w-auto select-none ${className}`}
      loading="eager"
    />
  );
}

export function MeeshoLogo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/messho.webp"
      alt="Meesho"
      className={`object-contain max-h-full w-auto select-none ${className}`}
      loading="eager"
    />
  );
}

export function ShopsyLogo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/shopsynew.webp"
      alt="Shopsy"
      className={`object-contain max-h-full w-auto select-none ${className}`}
      loading="eager"
    />
  );
}

export default function StoreLogo({ slug, name, className = 'h-8 w-auto', height }: StoreLogoProps) {
  const normalized = (slug || '').toLowerCase().trim();

  let logoSrc = '';
  let altText = name || slug;

  if (normalized.includes('amazon')) {
    logoSrc = '/logos/amazon-png.webp';
    altText = 'Amazon';
  } else if (normalized.includes('myntra')) {
    logoSrc = '/logos/myntranew.svg';
    altText = 'Myntra';
  } else if (normalized.includes('meesho')) {
    logoSrc = '/logos/messho.webp';
    altText = 'Meesho';
  } else if (normalized.includes('shopsy')) {
    logoSrc = '/logos/shopsynew.webp';
    altText = 'Shopsy';
  }

  if (logoSrc) {
    return (
      <div className={`relative flex items-center justify-start ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt={altText}
          style={height ? { maxHeight: `${height}px`, width: 'auto', objectFit: 'contain' } : undefined}
          className="max-h-full h-full w-auto object-contain select-none"
          loading="eager"
        />
      </div>
    );
  }

  // Fallback text
  return (
    <span className="font-pixel text-base sm:text-lg font-bold text-[#111111] uppercase tracking-wide">
      {name || slug}
    </span>
  );
}
