import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const buildingMode = db.getSetting('building_mode', 'false') === 'true';
    return NextResponse.json({
      building_mode: buildingMode
    });
  } catch {
    return NextResponse.json({
      building_mode: false
    });
  }
}
