import { NextRequest, NextResponse } from 'next/server';
import {
  amazonProductToCompanyInfo,
  extractAsin,
  fetchAmazonProductWithDecodo,
} from '@/lib/amazon-product-context';
import { ProviderManager } from '@/lib/api-providers/provider-manager';

function parseCompetitors(content: string): string[] {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  const parsed = JSON.parse(match ? match[0] : cleaned);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => typeof item === 'string' ? item : item?.name || item?.brand || item?.product)
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 8);
}

async function findAmazonCompetitors(product: any, marketplaceDomain: string): Promise<string[]> {
  try {
    const providerManager = new ProviderManager();
    const prompt = `Find direct Amazon competitors for this product using only amazon.${marketplaceDomain}.

Product:
- ASIN: ${product.asin}
- Title: ${product.title}
- Brand: ${product.brand || 'Unknown'}
- Category: ${product.category?.join(' > ') || 'Unknown'}
- Description: ${product.description || ''}
- Bullet points: ${product.bulletPoints?.join(' | ') || ''}

Return ONLY a valid JSON array of 4 to 8 competitor brand or product names. Exclude the same ASIN and avoid generic category names.`;

    const result = await providerManager.executeRequest({
      id: `amazon-competitors-${product.asin}-${Date.now()}`,
      prompt,
      providers: ['google-gemini'],
      priority: 'medium',
      userId: 'system',
      createdAt: new Date(),
      metadata: {
        context: `Search only amazon.${marketplaceDomain}.`,
        type: 'amazon-competitor-enrichment',
      },
    });

    const content = result.results.find((item) => item.status === 'success')?.data?.content;
    return content ? parseCompetitors(content) : [];
  } catch (error) {
    console.warn('Amazon competitor enrichment failed:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const asin = extractAsin(String(body.asinOrUrl || body.asin || ''));
    const amazonOnlySearch = Boolean(body.amazonOnlySearch);
    const marketplaceDomain = String(body.marketplaceDomain || 'com').replace(/^\./, '').trim() || 'com';

    if (!asin) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-character ASIN or Amazon listing URL.' },
        { status: 400 }
      );
    }

    const product = await fetchAmazonProductWithDecodo(asin, marketplaceDomain);

    const companyInfo = amazonProductToCompanyInfo(product, amazonOnlySearch);
    companyInfo.competitors = await findAmazonCompetitors(product, marketplaceDomain);

    return NextResponse.json({
      success: true,
      data: companyInfo,
      metadata: {
        source: 'decodo',
        asin,
        marketplaceDomain,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Amazon product context API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to build Amazon product context.',
      },
      { status: 500 }
    );
  }
}

