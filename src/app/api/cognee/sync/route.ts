import { NextRequest, NextResponse } from 'next/server';
import { isCogneeConfigured, syncBrandContextToCognee } from '@/lib/cognee';
import type { CogneeSyncPayload } from '@/lib/cognee';

export async function POST(request: NextRequest) {
  if (!isCogneeConfigured()) {
    return NextResponse.json({
      configured: false,
      synced: false,
      message: 'Cognee is not configured — no sync performed',
    });
  }

  try {
    const body = (await request.json()) as CogneeSyncPayload;

    if (!body.brandId || !body.brandName) {
      return NextResponse.json(
        { error: 'brandId and brandName are required' },
        { status: 400 }
      );
    }

    const synced = await syncBrandContextToCognee(body);

    return NextResponse.json({
      configured: true,
      synced,
      dataset: `aero-brand-${body.brandId.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
    });
  } catch (error) {
    console.warn('[Cognee] Sync route failed (non-blocking):', error);
    return NextResponse.json({
      configured: true,
      synced: false,
    });
  }
}
