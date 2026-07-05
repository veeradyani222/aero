'use client';

import { useEffect, useState } from 'react';
import type { RecommendationData } from '@/firebase/firestore/dashboardData';

interface UseCogneeRecommendationsOptions {
  brandId?: string | null;
  brandName?: string | null;
  /** Only fetch when Firestore has no recommendations (preserves existing behavior). */
  enabled?: boolean;
}

interface UseCogneeRecommendationsReturn {
  recommendations: RecommendationData[];
  loading: boolean;
  configured: boolean;
  source: 'cognee' | 'none';
}

/**
 * Optional Cognee-powered recommendations.
 * Returns empty when Cognee is off, loading, or has no data —
 * dashboard fallbacks stay unchanged.
 */
export function useCogneeRecommendations({
  brandId,
  brandName,
  enabled = true,
}: UseCogneeRecommendationsOptions): UseCogneeRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [source, setSource] = useState<'cognee' | 'none'>('none');

  useEffect(() => {
    if (!enabled || !brandId) {
      setRecommendations([]);
      setLoading(false);
      setConfigured(false);
      setSource('none');
      return;
    }

    let cancelled = false;

    async function fetchCogneeRecommendations() {
      setLoading(true);

      try {
        const params = new URLSearchParams({ brandId });
        if (brandName) params.set('brandName', brandName);

        const response = await fetch(`/api/cognee/recommendations?${params.toString()}`);

        if (!response.ok || cancelled) return;

        const data = await response.json();
        if (cancelled) return;

        setConfigured(Boolean(data.configured));
        setSource(data.source === 'cognee' ? 'cognee' : 'none');
        setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
      } catch {
        if (!cancelled) {
          setRecommendations([]);
          setSource('none');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCogneeRecommendations();

    return () => {
      cancelled = true;
    };
  }, [brandId, brandName, enabled]);

  return { recommendations, loading, configured, source };
}
