export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
export type ProductBadge = 'HOT DEAL' | 'LOWEST PRICE' | 'LIMITED OFFER' | 'TARZER PICK' | 'NONE';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  current_price: number;
  original_price: number;
  discount_percentage: number;
  marketplace_id: string;
  category_id: string;
  affiliate_url: string;
  image_url: string;
  badge: ProductBadge;
  status: ProductStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  marketplace?: Marketplace;
  category?: Category;
  images?: ProductImage[];
  clicks_count?: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  product_count?: number;
}

export interface Marketplace {
  id: string;
  name: string;
  slug: string;
  logo: string;
  website: string;
  product_count?: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  button_text: string;
  button_url: string;
  theme: 'orange' | 'dark' | 'light';
  display_order: number;
  active: boolean;
  created_at?: string;
}

export interface Click {
  id: string;
  product_id: string;
  marketplace_id: string;
  referrer?: string;
  clicked_at: string;
  product_title?: string;
  marketplace_name?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  created_at: string;
}

export interface FilterOptions {
  category?: string;
  marketplace?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  sort?: 'latest' | 'discount' | 'price-low' | 'price-high' | 'trending';
  q?: string;
  status?: string;
  featured?: boolean;
}

export interface ImportedProductMetadata {
  title: string;
  description: string;
  current_price: number;
  original_price: number;
  discount_percentage: number;
  image_url: string;
  additional_images: string[];
  marketplace: string;
  category: string;
  affiliate_url: string;
  brand?: string;
  source_domain: string;
}
