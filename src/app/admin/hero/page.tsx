import { db } from '@/lib/db';
import HeroManagerClient from './HeroManagerClient';

export const revalidate = 0;

export default function AdminHeroPage() {
  const slides = db.getHeroSlides(false);
  return <HeroManagerClient initialSlides={slides} />;
}
