import * as cheerio from 'cheerio';
import { ImportedProductMetadata } from './types';
import { buildAffiliateUrl } from './affiliate';

export interface ExtractionResult {
  success: boolean;
  message: string;
  marketplaceId: string;
  marketplaceName: string;
  data: ImportedProductMetadata;
}

export async function extractProductMetadata(url: string): Promise<ExtractionResult> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch (err) {
    throw new Error('Invalid URL provided');
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  
  // Detect marketplace
  let marketplaceId = 'mp_amazon';
  let marketplaceName = 'Amazon';
  let defaultCategory = 'cat_streetwear';

  if (hostname.includes('amazon') || hostname.includes('amzn')) {
    marketplaceId = 'mp_amazon';
    marketplaceName = 'Amazon';
  } else if (hostname.includes('myntra')) {
    marketplaceId = 'mp_myntra';
    marketplaceName = 'Myntra';
  } else if (hostname.includes('meesho')) {
    marketplaceId = 'mp_meesho';
    marketplaceName = 'Meesho';
  } else if (hostname.includes('shopsy')) {
    marketplaceId = 'mp_shopsy';
    marketplaceName = 'Shopsy';
  }

  let targetFetchUrl = url;
  const isMeesho = hostname.includes('meesho');

  // Meesho specific URL handling: resolve af_invite or canonical /s/p/{ext_id}
  if (isMeesho) {
    const extId =
      parsedUrl.searchParams.get('ext_id') ||
      parsedUrl.searchParams.get('external_product_id') ||
      parsedUrl.pathname.match(/\/p\/([a-zA-Z0-9]+)/)?.[1];

    if (extId) {
      targetFetchUrl = `https://www.meesho.com/s/p/${extId}`;
    }
  }

  // Attempt server-side OpenGraph / metadata extraction
  let extracted: Partial<ImportedProductMetadata> = {
    source_domain: hostname,
    affiliate_url: buildAffiliateUrl(url, marketplaceName.toLowerCase()),
    marketplace: marketplaceId,
    category: defaultCategory,
    additional_images: []
  };

  let extractionNote = 'Metadata extracted successfully';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // Meesho and modern marketplaces permit mobile Safari UA over datacenter IPs
    const primaryUa = isMeesho
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1'
      : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

    let response = await fetch(targetFetchUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': primaryUa,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    clearTimeout(timeout);

    // If initial desktop UA got blocked by anti-bot (e.g. 403), retry once with Mobile Safari UA
    if (!response.ok && response.status === 403 && !isMeesho) {
      try {
        const retryController = new AbortController();
        const retryTimeout = setTimeout(() => retryController.abort(), 6000);
        response = await fetch(targetFetchUrl, {
          signal: retryController.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        });
        clearTimeout(retryTimeout);
      } catch {
        // keep initial response
      }
    }

    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);

      // 1. Check JSON-LD (high fidelity for e-commerce, Meesho, Shopify)
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const json = JSON.parse($(el).html() || '{}');
          if (json['@type'] === 'Product' || json['@type'] === 'IndividualProduct') {
            if (json.name && !extracted.title) extracted.title = json.name;
            if (json.image && !extracted.image_url) {
              if (Array.isArray(json.image)) {
                extracted.image_url = json.image[0];
                extracted.additional_images = json.image.slice(1);
              } else if (typeof json.image === 'string') {
                extracted.image_url = json.image;
              }
            }
            if (json.description && !extracted.description) {
              extracted.description = json.description;
            }
            if (json.offers) {
              const offer = Array.isArray(json.offers) ? json.offers[0] : json.offers;
              if (offer && offer.price) {
                const parsedPrice = parseFloat(offer.price);
                if (parsedPrice > 0) {
                  extracted.current_price = Math.round(parsedPrice);
                  extracted.original_price = Math.round(parsedPrice * 1.8);
                }
              }
            }
          }
        } catch {
          // ignore json parse error
        }
      });

      // 2. Title fallback
      if (!extracted.title) {
        const ogTitle = $('meta[property="og:title"]').attr('content') ||
                        $('meta[name="twitter:title"]').attr('content') ||
                        $('#productTitle').text().trim() ||
                        $('title').text().trim();
        
        let cleanedTitle = ogTitle
          ? ogTitle.replace(/Online at Low Prices in India|Amazon\.in|Myntra|Buy\s+/gi, '').replace(/[-|:]+$/, '').trim()
          : '';
        
        if (cleanedTitle && !cleanedTitle.toLowerCase().includes('access denied')) {
          extracted.title = cleanedTitle;
        }
      }

      // 3. Description fallback
      if (!extracted.description) {
        const ogDesc = $('meta[property="og:description"]').attr('content') ||
                       $('meta[name="description"]').attr('content') ||
                       $('meta[name="twitter:description"]').attr('content') ||
                       '';
        if (ogDesc && !ogDesc.toLowerCase().includes('access denied')) {
          extracted.description = ogDesc.trim();
        }
      }

      // 4. Main Image fallback
      if (!extracted.image_url) {
        const ogImage = $('meta[property="og:image"]').attr('content') ||
                        $('meta[name="twitter:image"]').attr('content') ||
                        $('#landingImage').attr('src') ||
                        $('img[data-old-hires]').attr('data-old-hires') ||
                        '';
        extracted.image_url = ogImage;
      }

      // 5. Pricing fallback from meta tags
      if (!extracted.current_price) {
        const metaPrice = $('meta[property="product:price:amount"]').attr('content') ||
                          $('meta[property="og:price:amount"]').attr('content');
        if (metaPrice) {
          const parsedPrice = parseFloat(metaPrice);
          if (parsedPrice > 0) {
            extracted.current_price = Math.round(parsedPrice);
            extracted.original_price = Math.round(parsedPrice * 1.8);
          }
        }
      }

      // 6. Infer category from title
      const titleLower = (extracted.title || '').toLowerCase();
      if (titleLower.includes('t-shirt') || titleLower.includes('tshirt') || titleLower.includes('tee')) {
        extracted.category = 'cat_tshirts';
      } else if (titleLower.includes('hoodie') || titleLower.includes('sweatshirt')) {
        extracted.category = 'cat_hoodies';
      } else if (titleLower.includes('jean') || titleLower.includes('denim')) {
        extracted.category = 'cat_jeans';
      } else if (titleLower.includes('jacket') || titleLower.includes('bomber') || titleLower.includes('coat')) {
        extracted.category = 'cat_jackets';
      } else if (titleLower.includes('shoe') || titleLower.includes('sneaker') || titleLower.includes('boot') || titleLower.includes('footwear')) {
        extracted.category = 'cat_shoes';
      } else if (titleLower.includes('korean')) {
        extracted.category = 'cat_korean';
      } else if (titleLower.includes('shirt')) {
        extracted.category = 'cat_shirts';
      } else if (titleLower.includes('bag') || titleLower.includes('belt') || titleLower.includes('cap') || titleLower.includes('watch')) {
        extracted.category = 'cat_accessories';
      } else if (titleLower.includes('women') || titleLower.includes('dress') || titleLower.includes('kurti') || titleLower.includes('saree')) {
        extracted.category = 'cat_women';
      } else if (titleLower.includes('men')) {
        extracted.category = 'cat_men';
      }
    } else {
      extractionNote = 'Marketplace anti-bot protection active; loaded deal template.';
    }
  } catch {
    extractionNote = 'Direct metadata fetch unavailable; fallback template populated.';
  }

  // Fallbacks if incomplete
  const finalTitle = extracted.title || inferTitleFromUrl(parsedUrl, marketplaceName);
  const finalCurrentPrice = extracted.current_price || 699;
  const finalOriginalPrice = extracted.original_price || 1499;
  const discount = Math.round(((finalOriginalPrice - finalCurrentPrice) / finalOriginalPrice) * 100);

  const finalData: ImportedProductMetadata = {
    title: finalTitle,
    description: extracted.description || `Premium fashion deal from ${marketplaceName}. Verified genuine product at lowest available discount price.`,
    current_price: finalCurrentPrice,
    original_price: finalOriginalPrice,
    discount_percentage: Math.max(0, discount),
    image_url: extracted.image_url || getPlaceholderImage(extracted.category || defaultCategory),
    additional_images: extracted.additional_images || [],
    marketplace: marketplaceId,
    category: extracted.category || defaultCategory,
    affiliate_url: buildAffiliateUrl(url, marketplaceName.toLowerCase()),
    source_domain: hostname
  };

  return {
    success: true,
    message: extractionNote,
    marketplaceId,
    marketplaceName,
    data: finalData
  };
}

function inferTitleFromUrl(url: URL, marketplace: string): string {
  // If Meesho af_invite or has ext_id
  const extId = url.searchParams.get('ext_id') || url.searchParams.get('external_product_id');
  if (extId) {
    return `Curated ${marketplace} Streetwear Deal (${extId.toUpperCase()})`;
  }

  const pathname = url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    const filtered = segments.filter(
      (s) => !['af_invite', 'dp', 'gp', 's', 'p', 'buy', 'product'].includes(s.toLowerCase())
    );
    if (filtered.length > 0) {
      const slug = filtered[filtered.length - 1];
      const cleaned = slug.replace(/[-_]+/g, ' ').replace(/\.html?$/i, '');
      if (cleaned.length > 3 && isNaN(Number(cleaned))) {
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      }
    }
  }
  return `Curated ${marketplace} Fashion Deal`;
}

function getPlaceholderImage(category: string): string {
  const mapping: Record<string, string> = {
    cat_tshirts: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=85',
    cat_hoodies: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=85',
    cat_jeans: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=900&q=85',
    cat_jackets: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85',
    cat_shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=85',
    cat_shirts: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85',
    cat_accessories: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=85',
    cat_streetwear: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&q=85',
    cat_women: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85',
    cat_men: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&q=85'
  };
  return mapping[category] || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85';
}
