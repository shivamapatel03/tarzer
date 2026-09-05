import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildAffiliateUrl } from '@/lib/affiliate';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = db.getProductBySlug(slug);

    if (!product) {
      // Fallback: search by id if not found by slug
      const productById = db.getProductById(slug);
      if (!productById) {
        return NextResponse.redirect(new URL('/deals', req.url));
      }
      // Record click
      const referrer = req.headers.get('referer') || 'tarzer-direct';
      db.recordClick(productById.id, productById.marketplace_id, referrer);
      const targetUrl = buildAffiliateUrl(productById.affiliate_url, productById.marketplace?.slug);
      return NextResponse.redirect(targetUrl, 307);
    }

    // Record click with privacy in mind
    const referrer = req.headers.get('referer') || 'tarzer-direct';
    db.recordClick(product.id, product.marketplace_id, referrer);

    // Redirect to destination affiliate URL with up-to-date affiliate tags
    const targetUrl = buildAffiliateUrl(product.affiliate_url, product.marketplace?.slug);
    return NextResponse.redirect(targetUrl, 307);
  } catch (error) {
    return NextResponse.redirect(new URL('/deals', req.url));
  }
}
