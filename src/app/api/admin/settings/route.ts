import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = db.getAllSettings();
    const buildingMode = db.getSetting('building_mode', 'false') === 'true';

    return NextResponse.json({
      success: true,
      building_mode: buildingMode,
      settings
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (typeof body.building_mode !== 'undefined') {
      db.setSetting('building_mode', body.building_mode ? 'true' : 'false');
    }

    if (body.settings && typeof body.settings === 'object') {
      for (const [key, val] of Object.entries(body.settings)) {
        db.setSetting(key, String(val));
      }
    }

    const currentBuildingMode = db.getSetting('building_mode', 'false') === 'true';

    return NextResponse.json({
      success: true,
      building_mode: currentBuildingMode,
      message: currentBuildingMode ? 'Building Mode is now ENABLED' : 'Building Mode is now DISABLED (Site is LIVE)'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
