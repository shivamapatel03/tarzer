import { db } from '@/lib/db';
import CategoriesManagerClient from './CategoriesManagerClient';

export const revalidate = 0;

export default function AdminCategoriesPage() {
  const categories = db.getCategories();

  return <CategoriesManagerClient initialCategories={categories} />;
}
