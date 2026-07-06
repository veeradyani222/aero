'use client'
import React, { useState, useRef } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useBrandContext } from '@/context/BrandContext';
import { useToast } from '@/context/ToastContext';
import { RefreshCw, Zap, AlertCircle, CheckCircle, RotateCcw, StopCircle } from 'lucide-react';
import { updateBrandWithQueryResults } from '@/firebase/firestore/getUserBrands';
import { saveDetailedQueryResults } from '@/firebase/firestore/detailedQueryResults';
import { calculateCumulativeAnalytics, saveBrandAnalytics, calculateLifetimeBrandAnalytics, saveLifetimeAnalytics } from '@/firebase/firestore/brandAnalytics';
import { calculateCumulativeCompetitorAnalytics } from '@/utils/competitor-analytics';
import { saveCompetitorAnalytics } from '@/firebase/firestore/competitorAnalytics';
import { Competitor } from '@/lib/competitor-matching';
import { getFirebaseIdTokenWithRetry } from '@/utils/getFirebaseToken';
import { isFirebaseConfigured } from '@/firebase/config';

interface ProcessQueriesButtonProps {
  brandId?: string;
  onComplete?: (result: any) => void;
  onProgress?: (results: any[]) => void; // New callback for real-time updates
  onStart?: () => void; // New callback for when processing starts
  onQueryStart?: (query: string) => void; // New callback for when individual query processing starts
  autoStart?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function ProcessQueriesButton({
  brandId,
  onComplete,
  onProgress,
  onStart,
  onQueryStart,
  autoStart = false,
  className = '',
  variant = 'primary',
  size = 'md',
}: ProcessQueriesButtonProps): React.ReactElement {
  const { user, userProfile, refreshUserProfile } = useAuthContext();
  const { selectedBrand, brands, refetchBrands } = useBrandContext();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'cancelled'>('idle');
  const [message, setMessage] = useState('');
  const [processedResults, setProcessedResults] = useState<any[]>([]);

  // Add ref to track cancellation
  const cancelledRef = useRef(false);
  const autoStartTriggeredRef = useRef(false);

  const handleProcessQueries = async () => {
    if (!user?.uid) {
      setStatus('error');
      setMessage('Please sign in to process queries');
      return;
    }

    // Validate required data
    const targetBrandId = brandId || selectedBrand?.id;
    const targetBrand = brands.find(b => b.id === targetBrandId);

    if (!targetBrand) {
      setStatus('error');
      setMessage('No brand selected');
      return;
    }

    const brandName = targetBrand.companyName;
    const queries = targetBrand.queries || [];
    const amazonOnlySearch = Boolean((targetBrand as any).amazonOnlySearch);
    const amazonProduct = (targetBrand as any).amazonProduct;
    const amazonAsin = (targetBrand as any).amazonAsin || amazonProduct?.asin;
    const amazonMarketplaceDomain = amazonProduct?.marketplaceDomain || 'com';
    const amazonHost = `amazon.${amazonMarketplaceDomain}`;

    if (queries.length === 0) {
      setStatus('error');
      setMessage('No queries to process');
      return;
    }

    setProcessing(true);
    setStatus('processing');
    setMessage(`Processing ${queries.length} queries for ${brandName}...`);
    setProcessedResults([]); // Reset processed results
    cancelledRef.current = false;

    // Notify parent that processing has started
    if (onStart) {
      onStart();
    }

    try {
      const idToken = isFirebaseConfigured
        ? await getFirebaseIdTokenWithRetry(3, 1000)
        : null;

      if (isFirebaseConfigured && !idToken) {
        throw new Error('Failed to get authentication token. Please sign in again.');
      }

      // Generate unique processing session identifier
      const processingSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const processingSessionTimestamp = new Date().toISOString();

      // Process queries one by one and save incrementally
      const allResults: any[] = [];
      let processedCount = 0;
      let failedCount = 0;

      for (const query of queries) {
        // Check if cancelled
        if (cancelledRef.current) {
          break;
        }

        try {
          // Notify parent that this specific query is starting
          if (onQueryStart) {
            onQueryStart(query.query);
          }

          setMessage(`Processing query ${processedCount + failedCount + 1} of ${queries.length} for ${brandName}...`);

          const amazonSearchInstruction = amazonOnlySearch
            ? ` Search only ${amazonHost} for this prompt. Prefer ${amazonHost} product listings, Amazon search result pages, Amazon reviews, and Amazon Q&A. Do not use non-Amazon sources unless Amazon has no usable result, and clearly say if Amazon-only evidence is unavailable.`
            : '';

          const amazonProductContext = amazonProduct
            ? ` Amazon product context: ASIN ${amazonAsin}; marketplace ${amazonHost}; product title "${amazonProduct.title || ''}"; Amazon URL ${amazonProduct.url || ''}; category ${(amazonProduct.category || []).join(' > ')}.`
            : amazonAsin
              ? ` Amazon product context: ASIN ${amazonAsin}; marketplace ${amazonHost}.`
              : '';

          const providerQuery = amazonOnlySearch
            ? `site:${amazonHost} ${query.query}`
            : query.query;

          // Process individual query with authentication

          let response;
          try {
            response = await fetch(`${window.location.origin}/api/user-query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {}),
              },
              body: JSON.stringify({
                query: providerQuery,
                context: `Original shopper prompt: "${query.query}". This query is related to ${targetBrand.companyName} in the ${query.category} category. Topic: ${query.keyword}.${amazonProductContext}${amazonSearchInstruction}`,
                isAutoStart: false
              }),
            });
          } catch (fetchError) {
            console.error('❌ Fetch error:', fetchError);
            throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'}`);
          }

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API error response:', errorText);

            // Parse error response if possible
            try {
              const errorData = JSON.parse(errorText);
              if (errorData.code === 'AUTHENTICATION_REQUIRED') {
                showError(
                  'Authentication Failed',
                  'Please sign in again to continue processing queries.',
                );
                throw new Error('Authentication failed. Please sign in again.');
              }

              showError(
                'Query Processing Failed',
                errorData.error || 'An unexpected error occurred while processing your query.',
              );
              throw new Error(errorData.error || `Failed to process query (${response.status})`);
            } catch (parseError) {
              showError(
                'Network Error',
                'Failed to communicate with the server. Please check your connection and try again.',
              );
              throw new Error(`Failed to process query (${response.status}): ${query.query.substring(0, 30)}...`);
            }
          }

          const queryData = await response.json();

          // Refresh user profile to update credits in sidebar
          if (queryData.userCredits) {
            await refreshUserProfile();
          }

          // Format the result with processing session information
          const queryResult: any = {
            date: new Date().toISOString(),
            processingSessionId,
            processingSessionTimestamp,
            query: query.query,
            keyword: query.keyword,
            category: query.category,
            results: {}
          };

          // Process the enhanced results from the new API
          if (queryData.success && queryData.results && Array.isArray(queryData.results)) {
            queryData.results.forEach((result: any) => {
              if (result.providerId === 'chatgptsearch') {
                queryResult.results.chatgpt = {
                  response: result.data?.content || '',
                  ...(result.error && { error: result.error }),
                  timestamp: result.timestamp || new Date().toISOString(),
                  responseTime: result.responseTime,
                  webSearchUsed: result.data?.webSearchUsed || false,
                  citations: result.data?.annotations?.length || 0
                };
              } else if (result.providerId === 'google-gemini') {
                const groundingChunks = result.data?.groundingMetadata?.groundingChunks || [];
                queryResult.results.gemini = {
                  response: result.data?.content || '',
                  ...(result.error && { error: result.error }),
                  timestamp: result.timestamp || new Date().toISOString(),
                  responseTime: result.responseTime,
                  webSearchUsed: result.data?.webSearchEnabled || false,
                  citations: groundingChunks.length
                };
                queryResult.results.googleAI = {
                  response: result.data?.content || '',
                  ...(result.error && { error: result.error }),
                  timestamp: result.timestamp || new Date().toISOString(),
                  responseTime: result.responseTime,
                  aiOverview: result.data?.content || '',
                  hasAIOverview: Boolean(result.data?.content),
                  aiOverviewReferencesCount: groundingChunks.length,
                  citations: groundingChunks.length,
                  groundingMetadata: result.data?.groundingMetadata || null,
                  modelUsed: result.data?.modelUsed || null,
                };
              } else if (result.providerId === 'google-ai-overview') {
                queryResult.results.googleAI = {
                  response: `Found ${result.data?.totalItems || 0} search results`,
                  ...(result.error && { error: result.error }),
                  timestamp: result.timestamp || new Date().toISOString(),
                  responseTime: result.responseTime,
                  totalItems: result.data?.totalItems || 0,
                  organicResults: result.data?.organicResultsCount || 0,
                  peopleAlsoAsk: result.data?.peopleAlsoAskCount || 0,
                  location: result.data?.location || 'Unknown',
                  // Include AI Overview content if available
                  aiOverview: result.data?.aiOverview || null,
                  aiOverviewReferencesCount: result.data?.aiOverviewReferences?.length || 0,
                  hasAIOverview: result.data?.hasAIOverview || false,
                  serpFeaturesCount: result.data?.serpFeatures?.length || 0,
                  // Include other SERP data counts instead of arrays
                  relatedSearchesCount: result.data?.relatedSearches?.length || 0,
                  videoResultsCount: result.data?.videoResults?.length || 0,
                  // Remove rawDataForSEOResponse to reduce document size
                  hasRawData: !!(result.data?.rawDataForSEOResponse)
                };
              } else if (result.providerId === 'perplexity') {
                queryResult.results.perplexity = {
                  response: result.data?.content || '',
                  ...(result.error && { error: result.error }),
                  timestamp: result.timestamp || new Date().toISOString(),
                  responseTime: result.responseTime,
                  citations: result.data?.citations?.length || 0,
                  realTimeData: result.data?.realTimeData || false,
                  // Store flattened citation data to avoid nested arrays but preserve citation info
                  citationsData: result.data?.citations ? result.data.citations.join('|||') : '',
                  searchResultsData: result.data?.searchResults ?
                    result.data.searchResults.map((r: any) => `${r.title || ''}|||${r.url || ''}`).join('###') : '',
                  structuredCitationsData: result.data?.structuredCitations ?
                    result.data.structuredCitations.join('|||') : '',
                  // Store counts for display
                  citationsCount: result.data?.citations?.length || 0,
                  searchResultsCount: result.data?.searchResults?.length || 0,
                  structuredCitationsCount: result.data?.structuredCitations?.length || 0,
                  // Store metadata as simple key-value pairs (avoid nested objects/arrays)
                  hasMetadata: !!(result.data?.metadata),
                  hasUsageStats: !!(result.data?.usage)
                };
              }
            });
          }

          // Add credit information to the result
          // Credits system disabled - no credit tracking

          allResults.push(queryResult);
          processedCount++;

          // Update local state immediately to show progress
          setProcessedResults([...allResults]);

          // Notify parent component about progress
          if (onProgress) {
            onProgress([...allResults]);
          }

          // Save individual result immediately
          setMessage(`Saving result ${processedCount} of ${queries.length} for ${brandName}...`);

          // Save detailed results to separate collection first
          const { success: detailedSaveSuccess, error: detailedSaveError } = await saveDetailedQueryResults(
            targetBrandId!,
            targetBrand.userId,
            targetBrand.companyName,
            [queryResult] // Save just the current result to detailed collection
          );

          if (!detailedSaveSuccess) {
            console.error('❌ Error saving detailed result:', detailedSaveError);
            // Continue anyway, as the main brand document save is more important
          }

          const { error: updateError } = await updateBrandWithQueryResults(
            targetBrandId!,
            allResults // Save all results so far
          );

          if (updateError) {
            console.error('Error saving individual result:', updateError);
          }

          // Calculate and save incremental analytics after each query
          try {
            setMessage(`Updating analytics for ${brandName}...`);

            const analyticsData = calculateCumulativeAnalytics(
              targetBrand.userId,
              targetBrandId!,
              targetBrand.companyName,
              targetBrand.domain,
              processingSessionId,
              processingSessionTimestamp,
              allResults // Use all results processed so far
            );

            const { success: analyticsSaveSuccess, error: analyticsSaveError } = await saveBrandAnalytics(analyticsData);

            if (!analyticsSaveSuccess) {
              console.error('❌ Error saving incremental analytics:', analyticsSaveError);
            }
          } catch (analyticsError) {
            console.error('❌ Error calculating/saving incremental analytics:', analyticsError);
            // Don't fail the entire process for analytics errors
          }

          // Calculate and save competitor analytics after each query
          try {
            setMessage(`Updating competitor analytics for ${brandName}...`);

            // Convert brand competitors to Competitor format
            const competitors: Competitor[] = (((targetBrand as any).competitors as string[]) || []).map((comp: string) => ({
              name: comp,
              domain: undefined, // Will be enhanced later to include competitor domains
              aliases: undefined
            }));

            if (competitors.length > 0) {
              const competitorAnalyticsData = calculateCumulativeCompetitorAnalytics(
                targetBrand.userId,
                targetBrandId!,
                targetBrand.companyName,
                targetBrand.domain,
                processingSessionId,
                processingSessionTimestamp,
                competitors,
                allResults // Use all results processed so far
              );

              const { result: competitorSaveResult, error: competitorSaveError } = await saveCompetitorAnalytics(competitorAnalyticsData);

              if (!competitorSaveResult?.success) {
                console.error('❌ Error saving incremental competitor analytics:', competitorSaveError);
              }
            }
          } catch (competitorAnalyticsError) {
            console.error('❌ Error calculating/saving competitor analytics:', competitorAnalyticsError);
            // Don't fail the entire process for competitor analytics errors
          }

          // Small delay between queries
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (queryError) {
          console.error(`Error processing query: ${query.query}`, queryError);

          // If it's an authentication error, stop processing
          if (queryError instanceof Error && queryError.message.includes('Authentication failed')) {
            setStatus('error');
            setMessage(queryError.message);
            return;
          }

          failedCount++;
        }
      }

      // Check if cancelled
      if (cancelledRef.current) {
        setStatus('cancelled');
        setMessage(`Processing cancelled. Processed ${processedCount} of ${queries.length} queries.`);
        showWarning(
          '⏸️ Processing Cancelled',
          `Processed ${processedCount} of ${queries.length} queries before cancellation. You can resume processing the remaining queries anytime.`
        );
      } else {
        setStatus(failedCount > 0 ? 'error' : 'success');
        setMessage(
          failedCount > 0
            ? `Processed ${processedCount} of ${queries.length} queries for ${brandName}. ${failedCount} failed.`
            : `Successfully processed ${processedCount} queries for ${brandName}!`
        );
        // Calculate next processing date (7 days from now)
        const nextProcessingDate = new Date();
        nextProcessingDate.setDate(nextProcessingDate.getDate() + 7);
        const nextProcessingFormatted = nextProcessingDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        if (failedCount > 0) {
          showError(
            'Some Queries Failed',
            `Processed ${processedCount} of ${queries.length} queries for ${brandName}. Please try again for the failed queries.`
          );
        } else {
          showSuccess(
            '🎉 All Queries Processed!',
            `Successfully processed ${processedCount} queries for ${brandName}.`
          );
        }

        if (failedCount === 0) {
          // Show scheduling information after a brief delay
          setTimeout(() => {
            showInfo(
              '📅 Next Processing Scheduled',
              `Your next automatic processing is scheduled for ${nextProcessingFormatted}. You can also process queries manually anytime.`
            );
          }, 3000);
        }
      }

      // Analytics are now calculated and saved incrementally after each query
      // No need for final analytics calculation since it's done per query

      // Calculate and save lifetime analytics after completing all queries to ensure citations table gets updated
      // Run this even if cancelled, as long as some queries were processed
      if (processedCount > 0) {
        try {
          setMessage(`Updating lifetime analytics for ${brandName}...`);

          const { result: lifetimeAnalytics, error: lifetimeError } = await calculateLifetimeBrandAnalytics(targetBrandId!);

          if (lifetimeError) {
            console.error('❌ Error calculating lifetime analytics:', lifetimeError);
          } else if (lifetimeAnalytics) {
            const { success: lifetimeSaveSuccess, error: lifetimeSaveError } = await saveLifetimeAnalytics(lifetimeAnalytics);

            if (!lifetimeSaveSuccess) {
              console.error('❌ Error saving lifetime analytics:', lifetimeSaveError);
            }
          }
        } catch (lifetimeError) {
          console.error('❌ Error in lifetime analytics processing:', lifetimeError);
          // Don't fail the entire process for lifetime analytics errors
        }
      }

      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete({
          success: !cancelledRef.current && failedCount === 0,
          cancelled: cancelledRef.current,
          queryResults: allResults,
          summary: {
            totalQueries: queries.length,
            processedQueries: processedCount,
            totalErrors: failedCount,
            creditsUsed: 0
          }
        });
      }

      // Force a complete refresh of brand data to ensure all components update
      try {
        await refetchBrands();
      } catch (refreshError) {
        console.error('❌ Error during final brand data refresh:', refreshError);
      }

      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to process queries';
      setMessage(errorMessage);
      console.error('Process queries error:', error);

      // Show error notification
      showError(
        '❌ Processing Failed',
        'An unexpected error occurred while processing queries. Please check your connection and try again.',
      );

      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } finally {
      setProcessing(false);
      cancelledRef.current = false; // Reset cancellation flag

      // Refresh user profile to show updated credits
      try {
        await refreshUserProfile();
      } catch (refreshError) {
        console.error('❌ Error refreshing user profile:', refreshError);
      }

      // Do a final refresh to get the latest data
      try {
        await refetchBrands();
      } catch (error) {
        console.error('Error doing final refresh:', error);
      }
    }
  };

  const handleStopProcessing = () => {
    cancelledRef.current = true;
    setMessage('Stopping processing...');
  };

  React.useEffect(() => {
    if (!autoStart || autoStartTriggeredRef.current || processing) {
      return;
    }

    const targetBrandId = brandId || selectedBrand?.id;
    const targetBrand = brands.find(b => b.id === targetBrandId);

    if (!user?.uid || !targetBrand || (targetBrand.queries || []).length === 0) {
      return;
    }

    autoStartTriggeredRef.current = true;
    void handleProcessQueries();
  }, [autoStart, brandId, brands, processing, selectedBrand?.id, user?.uid]);

  // Check if queries have been processed
  const getProcessedQueriesCount = () => {
    const targetBrandId = brandId || selectedBrand?.id;
    const targetBrand = brands.find(b => b.id === targetBrandId);
    return targetBrand?.queryProcessingResults?.length || 0;
  };

  const hasProcessedQueries = getProcessedQueriesCount() > 0;

  // Calculate required credits
  const getRequiredCredits = () => {
    const targetBrandId = brandId || selectedBrand?.id;
    const targetBrand = brands.find(b => b.id === targetBrandId);
    const queryCount = targetBrand?.queries?.length || 0;
    return queryCount * 10;
  };

  const requiredCredits = getRequiredCredits();
  const availableCredits = userProfile?.credits || 0;
  // Credits are disabled; always treat as having enough credits
  const hasEnoughCredits = true;

  // Button styling based on variant and size
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-300 focus:outline-none';

  const getVariantStyles = () => {
    if (!hasEnoughCredits && requiredCredits > 0) {
      // Insufficient credits styling
      return {
        primary: 'bg-red-600 text-black cursor-not-allowed opacity-70',
        secondary: 'bg-white text-red-600 border border-red-600 cursor-not-allowed opacity-70',
        ghost: 'text-red-600 cursor-not-allowed opacity-70'
      };
    }

    if (hasProcessedQueries && status === 'idle') {
      // Different styling for reprocess button
      return {
        primary: 'bg-orange-600 text-black hover:bg-orange-700 focus:ring-orange-600',
        secondary: 'bg-white text-orange-600 border border-orange-600 hover:bg-orange-50 focus:ring-orange-600',
        ghost: 'text-orange-600 hover:bg-orange-100 focus:ring-orange-600'
      };
    }

    return {
      primary: 'bg-primary text-black hover:bg-white focus:ring-primary',
      secondary: 'bg-white/5 text-black hover:bg-white/10 focus:ring-white',
      ghost: 'text-black/60 hover:text-black hover:bg-white/5 focus:ring-white'
    };
  };

  const variantStyles = getVariantStyles();

  const sizeStyles = {
    sm: 'px-4 py-2 text-[10px] font-bold uppercase tracking-widest space-x-2',
    md: 'px-6 py-3 text-sm  font-bold space-x-3',
    lg: 'px-8 py-4 text-base  font-bold space-x-4'
  };

  const statusStyles = {
    idle: '',
    processing: 'opacity-50 cursor-not-allowed',
    success: 'bg-primary text-black',
    error: 'bg-white text-black',
    cancelled: 'bg-white/10 text-black'
  };

  // Icon based on status and processed state
  const getIcon = () => {
    switch (status) {
      case 'processing':
        return <RefreshCw className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} animate-spin`} />;
      case 'success':
        return <CheckCircle className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      case 'error':
        return <AlertCircle className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      case 'cancelled':
        return <StopCircle className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
      default:
        if (!hasEnoughCredits && requiredCredits > 0) {
          return <AlertCircle className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
        }
        if (hasProcessedQueries) {
          return <RotateCcw className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
        }
        return <Zap className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />;
    }
  };

  // Button text based on status and processed state
  const getButtonText = () => {
    if (message && status !== 'idle') {
      return message;
    }

    if (processing) {
      return 'Processing...';
    }

    if (hasProcessedQueries) {
      return 'Reprocess Queries';
    }

    return 'Process Queries';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleProcessQueries}
          disabled={processing || !user}
          className={`
            ${baseStyles} 
            ${variantStyles[variant]} 
            ${sizeStyles[size]} 
            ${statusStyles[status]}
            ${className}
          `}
          title={!user ? 'Please sign in to process queries' : ''}
        >
          {getIcon()}
          <span>{getButtonText()}</span>
        </button>

        {/* Stop button - only visible during processing */}
        {processing && !cancelledRef.current && (
          <button
            onClick={handleStopProcessing}
            className={`
              ${baseStyles}
              bg-red-600 text-black hover:bg-red-700 focus:ring-red-600
              ${sizeStyles[size]}
              animate-fade-in
            `}
            title="Stop processing queries"
          >
            <StopCircle className={`${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
            <span>Stop</span>
          </button>
        )}
      </div>

      {processing && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-black mt-4 text-center animate-pulse">
          ⚠️ System Processing: Do not close this window
        </p>
      )}

      {/* Credit information */}
      {/* Credits display removed (credits disabled) */}
    </div>
  );
} 


