import React, { useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useBrandQueries } from '@/hooks/useBrandQueries';
import type { LifetimeBrandAnalytics } from '@/firebase/firestore/brandAnalytics';
import { analyzeBrandMentions } from './BrandMentionCounter';
import { useBrandContext } from '@/context/BrandContext';

interface LifetimeAnalyticsChartsProps {
  lifetimeAnalytics: LifetimeBrandAnalytics;
  brandId: string;
}

const COLORS = ['#FFD700', '#D1D5DB', '#404040'];

const providerColors = {
  chatgpt: 'var(--primary)',
  google: '#000000',
};

export default function LifetimeAnalyticsCharts({ lifetimeAnalytics, brandId }: LifetimeAnalyticsChartsProps) {
  const { selectedBrand } = useBrandContext();
  const { queries, loading: queriesLoading } = useBrandQueries({ brandId });

  // Log the first query result for debugging
  useEffect(() => {
    if (queries.length > 0) {
      // eslint-disable-next-line no-console
      console.log('Sample query for LifetimeAnalyticsCharts:', queries[0]);
    }
  }, [queries]);

  // --- Trend Line Data ---
  const trendData = useMemo(() => {
    const brandName = lifetimeAnalytics.brandName;
    const brandDomain = lifetimeAnalytics.brandDomain;
    // Group by day (YYYY-MM-DD)
    const byDay: Record<string, { date: string; mentions: number; citations: number }> = {};
    queries.forEach(q => {
      const day = q.date ? new Date(q.date).toISOString().slice(0, 10) : 'Unknown';
      // Use analyzeBrandMentions to get counts
      const analysis = analyzeBrandMentions(brandName, brandDomain, {
        chatgpt: q.results?.chatgpt
          ? {
              response: q.results.chatgpt.response || '',
              citations: Array.isArray(q.results.chatgpt.citations)
                ? q.results.chatgpt.citations
                : typeof q.results.chatgpt.citations === 'number'
                  ? []
                  : [],
            }
          : undefined,
        googleAI: q.results?.googleAI
          ? {
              aiOverview: q.results.googleAI.aiOverview || '',
              citations: Array.isArray(q.results.googleAI.citations)
                ? q.results.googleAI.citations
                : typeof q.results.googleAI.citations === 'number'
                  ? []
                  : [],
            }
          : undefined,
        perplexity: q.results?.perplexity
          ? {
              response: q.results.perplexity.response || '',
              citations: Array.isArray(q.results.perplexity.citations)
                ? q.results.perplexity.citations
                : typeof q.results.perplexity.citations === 'number'
                  ? []
                  : [],
            }
          : undefined,
      }, selectedBrand?.competitors || []);
      if (!byDay[day]) byDay[day] = { date: day, mentions: 0, citations: 0 };
      byDay[day].mentions += analysis.totals.totalBrandMentions;
      byDay[day].citations += analysis.totals.totalCitations;
    });
    // Sort by date
    return Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date));
  }, [queries, lifetimeAnalytics.brandName, lifetimeAnalytics.brandDomain]);

  // --- Donut Data for Brand Visibility ---
  const donutData = useMemo(() => {
    const visible = Math.round(lifetimeAnalytics.brandVisibilityScore);
    return [
      { name: 'Visible', value: visible },
      { name: 'Not Visible', value: 100 - visible },
    ];
  }, [lifetimeAnalytics.brandVisibilityScore]);

  // --- Provider Bar Data ---
  const barData = useMemo(() => {
    const stats = lifetimeAnalytics.providerStats;
    return [
      {
        provider: 'ChatGPT',
        mentions: stats?.chatgpt?.brandMentions ?? 0,
        citations: stats?.chatgpt?.citations ?? 0,
      },
      {
        provider: 'Google',
        mentions: stats?.google?.brandMentions ?? 0,
        citations: stats?.google?.citations ?? 0,
      },
    ];
  }, [lifetimeAnalytics.providerStats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Trend Line Chart */}
      <div className="bg-gray-50 border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-1.5 h-1.5 bg-primary"></div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Mentions Over Time</h3>
        </div>
        {queriesLoading ? (
          <div className="text-center text-gray-500">Loading trend data...</div>
        ) : trendData.length === 0 ? (
          <div className="text-center text-gray-500">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mentions" stroke="#FFD700" name="Mentions" strokeWidth={3} dot={{ r: 4, fill: '#FFD700' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
        {(!queriesLoading && trendData.length > 0 && trendData.length < 3) && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            Not enough data yet! We usually need 2-3 data points to show a clear line chart. More data will be available after next analysis.
          </div>
        )}
      </div>

      {/* Donut Chart for Brand Visibility */}
      <div className="bg-gray-50 border border-gray-100 p-6 flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-8 w-full">
          <div className="w-1.5 h-1.5 bg-primary"></div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Brand Visibility</h3>
        </div>
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              data={donutData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {donutData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={idx === 0 ? '#FFD700' : 'rgba(0,0,0,0.1)'} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-6 text-center">
          <span className="text-4xl  font-bold text-foreground">{donutData[0].value}%</span>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-foreground/40">Overall Visibility Score</p>
        </div>
      </div>

      {/* Provider Comparison Bar Chart (full width) */}
      <div className="md:col-span-2 bg-gray-50 border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-1.5 h-1.5 bg-primary"></div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Provider Comparison</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="provider" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="mentions" fill="#FFD700" name="Mentions" />
            <Bar dataKey="citations" fill="#000000" name="Citations" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 


