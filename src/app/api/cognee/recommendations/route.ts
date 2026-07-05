import { NextRequest, NextResponse } from 'next/server';
import {
  cogneeSearch,
  formatCogneeRecommendations,
  getCogneeDatasetName,
  isCogneeConfigured,
} from '@/lib/cognee';

const DEFAULT_QUERY =
  'Based on this brand\'s AI visibility data, what are the top 3-5 actionable recommendations to improve mentions, citations, and competitive positioning in ChatGPT, Gemini, and Google AI responses? Be specific and concise.';

export async function GET(request: NextRequest) {
  if (!isCogneeConfigured()) {
    return NextResponse.json({
      configured: false,
      recommendations: [],
      source: 'none',
    });
  }

  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId');
  const brandName = searchParams.get('brandName') || 'this brand';
  const customQuery = searchParams.get('query');

  if (!brandId) {
    return NextResponse.json(
      { error: 'brandId is required' },
      { status: 400 }
    );
  }

  try {
    const datasetName = getCogneeDatasetName(brandId);
    const query =
      customQuery ||
      DEFAULT_QUERY.replace('this brand', brandName);

    const searchResult = await cogneeSearch(datasetName, query);

    if (!searchResult?.content) {
      return NextResponse.json({
        configured: true,
        recommendations: [],
        source: 'cognee',
        message: 'No results found',
      });
    }

    const recommendations = formatCogneeRecommendations(searchResult.content, brandName);

    return NextResponse.json({
      configured: true,
      recommendations,
      source: recommendations.length > 0 ? 'cognee' : 'none',
    });
  } catch (error) {
    console.warn('[Cognee] Recommendations route failed:', error);
    return NextResponse.json({
      configured: true,
      recommendations: [],
      source: 'none',
    });
  }
}
