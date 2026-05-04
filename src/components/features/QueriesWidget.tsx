'use client'
import React from 'react';
import { useBrandContext } from '@/context/BrandContext';
import { Activity, Eye, ArrowRight, Clock } from 'lucide-react';
import { UserBrand } from '@/firebase/firestore/getUserBrands';

interface QueriesWidgetProps {
  brandOverride?: UserBrand;
  onViewAll?: () => void;
  className?: string;
}

export default function QueriesWidget({
  brandOverride,
  onViewAll,
  className = ''
}: QueriesWidgetProps): React.ReactElement {
  const { selectedBrand } = useBrandContext();

  // Use brand override if provided, otherwise use selected brand
  const brand = brandOverride || selectedBrand;

  if (!brand) {
    return (
      <div className={`bg-white/5 border border-white/10 p-4 ${className}`}>
        <div className="text-center py-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/20">No product selected</p>
        </div>
      </div>
    );
  }

  const queries = brand.queries || [];
  const queryResults = brand.queryProcessingResults || [];

  // Calculate processing stats
  const processedCount = queryResults.length;
  const totalQueries = queries.length;
  const processingRate = totalQueries > 0 ? Math.round((processedCount / totalQueries) * 100) : 0;

  // Get last processed date
  const lastProcessed = queryResults.length > 0
    ? new Date(queryResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date)
    : null;

  return (
    <div className={`bg-white/5 border border-white/10 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-primary"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-black">Queries</span>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-black/40 hover:text-black transition-colors"
          >
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center bg-gray-50 p-3 border border-gray-100">
            <p className="text-xl  font-bold text-black">{totalQueries}</p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-black/60">Total</p>
          </div>
          <div className="text-center bg-gray-50 p-3 border border-gray-100">
            <p className="text-xl  font-bold text-black">{processedCount}</p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-black/60">Active</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-bold uppercase tracking-widest text-black/60">Progress</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-black">{processingRate}%</span>
          </div>
          <div className="w-full bg-white/5 h-1">
            <div
              className="bg-primary h-1 transition-all duration-300"
              style={{ width: `${processingRate}%` }}
            />
          </div>
        </div>

        {/* Last Processed */}
        {lastProcessed && (
          <div className="flex items-center space-x-2 pt-2 border-t border-white/10 mb-4">
            <span className="text-[8px] font-bold uppercase tracking-widest text-black/60">
              Latest Analysis: {lastProcessed.toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Recent Queries Preview */}
        {queries.length > 0 && (
          <div className="space-y-2">
            {queries.slice(0, 2).map((query, index) => {
              const hasResult = queryResults.some(r => r.query === query.query);
              return (
                <div key={index} className="flex items-center justify-between bg-white/5 p-2 border border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/60 truncate flex-1 mr-2">
                    {query.query.length > 25 ? `${query.query.substring(0, 25)}...` : query.query}
                  </span>
                  {hasResult && <div className="w-1 h-1 bg-primary"></div>}
                </div>
              );
            })}
          </div>
        )}
        {queries.length > 2 && (
          <div className="text-center pt-1">
            <span className="text-xs text-muted-foreground">
              +{queries.length - 2} more
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
      </div >
    </div >
  );
} 


