import { NextRequest, NextResponse } from 'next/server';
import { getUserBrands, QueryProcessingResult } from '@/firebase/firestore/getUserBrands';

// Process a single query through AI providers
async function processQuery(queryText: string, context?: string): Promise<any> {
  try {
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: queryText,
        provider: 'both', // Query both providers
        context: context || 'Please provide a comprehensive and helpful response.'
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to query AI providers: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing query:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Main handler to process queries for a user's brands
export async function POST(request: NextRequest) {
  try {
    const { brandData, queries } = await request.json();

    if (!brandData || !queries) {
      return NextResponse.json(
        { error: 'brandData and queries are required' },
        { status: 400 }
      );
    }

    console.log('🚀 Processing queries for brand:', brandData.companyName);

    const amazonOnlySearch = Boolean(brandData.amazonOnlySearch);
    const amazonProduct = brandData.amazonProduct;
    const amazonAsin = brandData.amazonAsin || amazonProduct?.asin;
    const amazonMarketplaceDomain = amazonProduct?.marketplaceDomain || 'com';
    const amazonHost = `amazon.${amazonMarketplaceDomain}`;

    const queryResults: QueryProcessingResult[] = [];
    const errors: any[] = [];
    
    // Generate unique processing session identifier for this API call
    const processingSessionId = `api_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const processingSessionTimestamp = new Date().toISOString();
    
    console.log(`🔄 Starting API processing session: ${processingSessionId} at ${processingSessionTimestamp}`);
    
    // Process each query
    for (const query of queries) {
      try {
        console.log(`  📝 Processing query: "${query.query.substring(0, 50)}..."`);
        
        const providerQuery = amazonOnlySearch
          ? `site:${amazonHost} ${query.query}`
          : query.query;

        const amazonProductContext = amazonProduct
          ? ` Amazon product context: ASIN ${amazonAsin}; marketplace ${amazonHost}; product title "${amazonProduct.title || ''}"; Amazon URL ${amazonProduct.url || ''}; category ${(amazonProduct.category || []).join(' > ')}.`
          : amazonAsin
          ? ` Amazon product context: ASIN ${amazonAsin}; marketplace ${amazonHost}.`
          : '';

        const amazonSearchInstruction = amazonOnlySearch
          ? ` Search only ${amazonHost} for this prompt. Prefer ${amazonHost} product listings, Amazon search result pages, Amazon reviews, and Amazon Q&A. Do not use non-Amazon sources unless Amazon has no usable result, and clearly say if Amazon-only evidence is unavailable.`
          : '';

        // Process through AI providers
        const aiResult = await processQuery(
          providerQuery,
          `Original shopper prompt: "${query.query}". This query is related to ${brandData.companyName} in the ${query.category} category. Topic: ${query.keyword}.${amazonProductContext}${amazonSearchInstruction}`
        );

        console.log(`  📊 AI Result for query:`, {
          query: query.query.substring(0, 50),
          hasResults: !!aiResult.results,
          resultsCount: aiResult.results?.length,
          error: aiResult.error
        });

        // Format the results
        const queryResult: QueryProcessingResult = {
          date: new Date().toISOString(),
          processingSessionId,
          processingSessionTimestamp,
          query: query.query,
          keyword: query.keyword,
          category: query.category,
          results: {}
        };

        // Process the results array from the API
        if (aiResult.results && Array.isArray(aiResult.results)) {
          aiResult.results.forEach((result: any) => {
            const provider = result.providerId || result.provider;

            if (provider === 'chatgptsearch' || provider === 'openai') {
              queryResult.results.chatgpt = {
                response: result.data?.content || result.response || '',
                error: result.error,
                timestamp: result.timestamp || new Date().toISOString(),
                responseTime: result.responseTime,
                tokenCount: undefined
              };
            } else if (provider === 'google-gemini' || provider === 'gemini') {
              const groundingChunks = result.data?.groundingMetadata?.groundingChunks || [];
              queryResult.results.gemini = {
                response: result.data?.content || result.response || '',
                error: result.error,
                timestamp: result.timestamp || new Date().toISOString(),
                responseTime: result.responseTime,
                tokenCount: undefined,
                webSearchUsed: result.data?.webSearchEnabled || false,
                citations: groundingChunks.length
              };
              queryResult.results.googleAI = {
                response: result.data?.content || result.response || '',
                error: result.error,
                timestamp: result.timestamp || new Date().toISOString(),
                responseTime: result.responseTime,
                aiOverview: result.data?.content || result.response || '',
                hasAIOverview: Boolean(result.data?.content || result.response),
                aiOverviewReferencesCount: groundingChunks.length,
                citations: groundingChunks.length,
                groundingMetadata: result.data?.groundingMetadata || null,
                modelUsed: result.data?.modelUsed || null
              };
            }
          });
        }

        queryResults.push(queryResult);

        // Add a small delay between queries to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`  ❌ Error processing query: ${error}`);
        errors.push({
          query: query.query,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log('✅ Processing complete:', {
      totalQueries: queries.length,
      processedQueries: queryResults.length,
      errors: errors.length
    });

    // Return the results for the client to update Firestore
    return NextResponse.json({
      success: true,
      brandId: brandData.id,
      brandName: brandData.companyName,
      queryResults,
      errors,
      summary: {
        totalQueries: queries.length,
        processedQueries: queryResults.length,
        totalErrors: errors.length
      }
    });

  } catch (error) {
    console.error('❌ Error in process-user-queries:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

 

