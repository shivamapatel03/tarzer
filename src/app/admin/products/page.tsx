import { db } from '@/lib/db';
import ProductsManagerClient from './ProductsManagerClient';

export const revalidate = 0;

export default function AdminProductsPage() {
  // Fetch all products regardless of status for admin management
  const allProducts = db.getProducts({ status: undefined });

  return <ProductsManagerClient initialProducts={allProducts} />;
}
