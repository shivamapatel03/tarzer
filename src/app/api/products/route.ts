import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { FilterOptions } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const marketplace = searchParams.get('marketplace') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const minDiscount = searchParams.get('minDiscount') ? Number(searchParams.get('minDiscount')) : undefined;
    const sort = (searchParams.get('sort') as any) || undefined;
    const q = searchParams.get('q') || undefined;
    const status = searchParams.get('status') || undefined;
    const featured = searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined;

    const filters: FilterOptions = {
      category,
      marketplace,
      minPrice,
      maxPrice,
      minDiscount,
      sort,
      q,
      status,
      featured
    };

    const products = db.getProducts(filters);
    return NextResponse.json({ products, total: products.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.affiliate_url || !body.current_price) {
      return NextResponse.json({ error: 'Title, current price, and affiliate URL are required' }, { status: 400 });
    }

    const newProduct = db.createProduct(body);
    return NextResponse.json({ product: newProduct, success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
