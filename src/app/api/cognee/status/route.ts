import { NextResponse } from 'next/server';
import { getCogneeStatus } from '@/lib/cognee';

export async function GET() {
  const status = await getCogneeStatus();

  return NextResponse.json({
    ...status,
    integration: 'aero-cognee',
    docs: 'https://docs.cognee.ai/cognee-cloud/overview',
  });
}
