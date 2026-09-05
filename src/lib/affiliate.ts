/**
 * TARZER Affiliate Link Engine
 * Handles automatic tagging for Amazon (Store ID: tarzerindia-21)
 * and EarnKaro profit link wrapping for Myntra, Meesho, Shopsy, Ajio, Flipkart (EarnKaro ID: 2404238).
 */

export const DEFAULT_AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || 'tarzerindia-21';
export const DEFAULT_EARNKARO_ID = process.env.NEXT_PUBLIC_EARNKARO_USER_ID || '2404238';

export function buildAffiliateUrl(rawUrl: string, marketplaceSlug?: string): string {
  if (!rawUrl || !rawUrl.trim()) return '';
  const trimmed = rawUrl.trim();

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();

    // 1. Amazon Link Transformation
    if (host.includes('amazon') || host.includes('amzn')) {
      // If already has a tag, replace it or append tarzerindia-21
      url.searchParams.set('tag', DEFAULT_AMAZON_TAG);
      return url.toString();
    }

    // 2. Already an EarnKaro link
    if (host.includes('ekaro.in') || host.includes('earnkaro.com')) {
      return trimmed;
    }

    // 3. Supported EarnKaro Stores: Myntra, Meesho, Shopsy, Ajio, Flipkart, Nykaa
    if (
      host.includes('myntra') ||
      host.includes('meesho') ||
      host.includes('shopsy') ||
      host.includes('ajio') ||
      host.includes('flipkart') ||
      host.includes('nykaa') ||
      marketplaceSlug === 'myntra' ||
      marketplaceSlug === 'meesho' ||
      marketplaceSlug === 'shopsy'
    ) {
      // Clean query trackers before wrapping
      const cleanUrl = `${url.origin}${url.pathname}`;
      return `https://ekaro.in/enkr?id=${DEFAULT_EARNKARO_ID}&url=${encodeURIComponent(cleanUrl)}`;
    }

    // Return original url if unsupported
    return trimmed;
  } catch (err) {
    // If invalid URL format, return raw string
    return trimmed;
  }
}
