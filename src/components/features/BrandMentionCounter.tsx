'use client'
import React from 'react';
import { matchCompetitorsInText, Competitor } from '@/lib/competitor-matching';

// Unified interface for all provider citations
interface Citation {
  url: string;
  text: string;
  source?: string;
}



// Unified brand mention and citation analysis
interface BrandAnalysisResult {
  provider: 'chatgpt' | 'google';
  brandMentioned: boolean;
  domainCited: boolean;
  citationCount: number;
  citations: Citation[];
  brandMentionCount: number;
  domainCitationCount: number;
  competitorMentioned: boolean;
  competitorCited: boolean;
  competitorMentionCount: number;
  competitorCitationCount: number;
}

interface BrandMentionAnalysis {
  brandName: string;
  brandDomain: string;
  competitors: string[];
  results: {
    chatgpt?: BrandAnalysisResult;
    google?: BrandAnalysisResult;
  };
  totals: {
    totalCitations: number;
    totalBrandMentions: number;
    totalDomainCitations: number;
    totalCompetitorMentions: number;
    totalCompetitorCitations: number;
    providersWithBrandMention: number;
    providersWithDomainCitation: number;
    providersWithCompetitorMention: number;
    providersWithCompetitorCitation: number;
  };
}

// Function to check if brand is mentioned in text
function isBrandMentioned(text: string, brandName: string): boolean {
  if (!text || !brandName) return false;
  const lowerText = text.toLowerCase();
  const lowerBrandName = brandName.toLowerCase();
  return lowerText.includes(lowerBrandName);
}

// Function to check if brand domain is cited in text
function isDomainCited(text: string, brandDomain: string): boolean {
  if (!text || !brandDomain) return false;
  const lowerText = text.toLowerCase();
  const lowerDomain = brandDomain.toLowerCase();
  // Check for "https://www." + domain first
  const httpsWwwDomain = `https://www.${lowerDomain}`;
  if (lowerText.includes(httpsWwwDomain)) return true;
  // If not found, check for "https://" + domain
  const httpsDomain = `https://${lowerDomain}`;
  if (lowerText.includes(httpsDomain)) return true;
  return false;
}

// Function to count brand mentions in text
function countBrandMentions(text: string, brandName: string): number {
  if (!text || !brandName) return 0;
  const lowerText = text.toLowerCase();
  const lowerBrandName = brandName.toLowerCase();
  const regex = new RegExp(lowerBrandName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

// Function to count domain citations in citations array
function countDomainCitations(citations: Citation[], brandDomain: string): number {
  if (!brandDomain) return 0;
  const lowerDomain = brandDomain.toLowerCase();
  const httpsWwwDomain = `https://www.${lowerDomain}`;
  const httpsDomain = `https://${lowerDomain}`;
  return citations.filter(citation => {
    const lowerUrl = citation.url.toLowerCase();
    if (lowerUrl.includes(httpsWwwDomain)) return true;
    if (lowerUrl.includes(httpsDomain)) return true;
    return false;
  }).length;
}

// Function to check if competitors are mentioned in text
function areCompetitorsMentioned(text: string, competitors: string[]): boolean {
  if (!text || !competitors.length) return false;
  const competitorObjects: Competitor[] = competitors.map(name => ({ name }));
  const matches = matchCompetitorsInText(text, competitorObjects);
  return matches.length > 0;
}

// Function to check if competitors are cited in citations
function areCompetitorsCited(citations: Citation[], competitors: string[]): boolean {
  if (!citations || !competitors.length) return false;
  return citations.some(citation => 
    competitors.some(competitor => 
      citation.url.toLowerCase().includes(competitor.toLowerCase()) ||
      citation.text.toLowerCase().includes(competitor.toLowerCase())
    )
  );
}

// Function to count competitor mentions in text
function countCompetitorMentions(text: string, competitors: string[]): number {
  if (!text || !competitors.length) return 0;
  const competitorObjects: Competitor[] = competitors.map(name => ({ name }));
  const matches = matchCompetitorsInText(text, competitorObjects);
  return matches.length;
}

// Function to count competitor citations
function countCompetitorCitations(citations: Citation[], competitors: string[]): number {
  if (!citations || !competitors.length) return 0;
  return citations.filter(citation => 
    competitors.some(competitor => 
      citation.url.toLowerCase().includes(competitor.toLowerCase()) ||
      citation.text.toLowerCase().includes(competitor.toLowerCase())
    )
  ).length;
}

// Main function to analyze brand mentions and citations across all providers
export function analyzeBrandMentions(
  brandName: string,
  brandDomain: string,
  queryResults: {
    chatgpt?: { response: string; citations?: Citation[] };
    googleAI?: { aiOverview?: string; citations?: Citation[] };
  },
  competitors: string[] = []
): BrandMentionAnalysis {
  const results: BrandMentionAnalysis['results'] = {};
  
  // Analyze ChatGPT
  if (queryResults.chatgpt?.response) {
    const citations = queryResults.chatgpt.citations || [];
    const brandMentioned = isBrandMentioned(queryResults.chatgpt.response, brandName);
    const domainCited = isDomainCited(queryResults.chatgpt.response, brandDomain);
    const brandMentionCount = countBrandMentions(queryResults.chatgpt.response, brandName);
    const domainCitationCount = countDomainCitations(citations, brandDomain);
    
    // Add competitor analysis
    const competitorMentioned = areCompetitorsMentioned(queryResults.chatgpt.response, competitors);
    const competitorCited = areCompetitorsCited(citations, competitors);
    const competitorMentionCount = countCompetitorMentions(queryResults.chatgpt.response, competitors);
    const competitorCitationCount = countCompetitorCitations(citations, competitors);
    
    results.chatgpt = {
      provider: 'chatgpt',
      brandMentioned,
      domainCited,
      citationCount: citations.length,
      citations,
      brandMentionCount,
      domainCitationCount,
      competitorMentioned,
      competitorCited,
      competitorMentionCount,
      competitorCitationCount
    };
  }
  
  // Analyze Google AI Overview
  if (queryResults.googleAI) {
    const aiOverviewText = queryResults.googleAI.aiOverview || '';
    const citations = queryResults.googleAI.citations || [];
    const brandMentioned = isBrandMentioned(aiOverviewText, brandName);
    const domainCited = isDomainCited(aiOverviewText, brandDomain);
    const brandMentionCount = countBrandMentions(aiOverviewText, brandName);
    const domainCitationCount = countDomainCitations(citations, brandDomain);
    
    // Add competitor analysis
    const competitorMentioned = areCompetitorsMentioned(aiOverviewText, competitors);
    const competitorCited = areCompetitorsCited(citations, competitors);
    const competitorMentionCount = countCompetitorMentions(aiOverviewText, competitors);
    const competitorCitationCount = countCompetitorCitations(citations, competitors);
    
    results.google = {
      provider: 'google',
      brandMentioned,
      domainCited,
      citationCount: citations.length,
      citations,
      brandMentionCount,
      domainCitationCount,
      competitorMentioned,
      competitorCited,
      competitorMentionCount,
      competitorCitationCount
    };
  }
  
  // Calculate totals
  const allResults = Object.values(results).filter(Boolean) as BrandAnalysisResult[];
  const totals = {
    totalCitations: allResults.reduce((sum, result) => sum + result.citationCount, 0),
    totalBrandMentions: allResults.reduce((sum, result) => sum + result.brandMentionCount, 0),
    totalDomainCitations: allResults.reduce((sum, result) => sum + result.domainCitationCount, 0),
    totalCompetitorMentions: allResults.reduce((sum, result) => sum + result.competitorMentionCount, 0),
    totalCompetitorCitations: allResults.reduce((sum, result) => sum + result.competitorCitationCount, 0),
    providersWithBrandMention: allResults.filter(result => result.brandMentioned).length,
    providersWithDomainCitation: allResults.filter(result => result.domainCited).length,
    providersWithCompetitorMention: allResults.filter(result => result.competitorMentioned).length,
    providersWithCompetitorCitation: allResults.filter(result => result.competitorCited).length
  };
  
  return {
    brandName,
    brandDomain,
    competitors,
    results,
    totals
  };
}

// Component to display brand mention analysis
interface BrandMentionCounterProps {
  analysis: BrandMentionAnalysis;
}

export function BrandMentionCounter({ analysis }: BrandMentionCounterProps) {
  const { brandName, brandDomain, competitors, results, totals } = analysis;
  
  return (
    <div className="bg-white/5 border border-white/10">
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-1.5 bg-primary"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-black">Brand Mention & Citation Analysis</span>
        </div>
      </div>
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
          <div className="bg-white/5 p-4 border border-white/10">
            <div className="text-2xl  font-bold text-black">{totals.totalBrandMentions}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Brand Mentions</div>
          </div>
          <div className="bg-white/5 p-4 border border-white/10">
            <div className="text-2xl  font-bold text-black">{totals.totalDomainCitations}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Domain Citations</div>
          </div>
          <div className="bg-white/5 p-4 border border-white/10">
            <div className="text-2xl  font-bold text-black">{totals.totalCitations}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Total Citations</div>
          </div>
          <div className="bg-white/5 p-4 border border-white/10">
            <div className="text-2xl  font-bold text-black">{totals.providersWithBrandMention}/{Object.keys(results).length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Providers w/ Brand</div>
          </div>
          <div className="bg-white/5 p-4 border border-white/10">
            <div className="text-2xl  font-bold text-black">{totals.totalCompetitorMentions}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Competitor Mentions</div>
          </div>
          <div className="bg-white/5 p-4 border border-white/10">
            <div className="text-2xl  font-bold text-black">{totals.totalCompetitorCitations}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Competitor Citations</div>
          </div>
        </div>
        
        {/* Brand Information */}
        <div className="bg-white/5 p-4 border border-white/10 mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3">Tracking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest">
            <div>
              <span className="text-black/40">Brand Name:</span>
              <span className="ml-2 text-black">{brandName || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-black/40">Brand Domain:</span>
              <span className="ml-2 text-black">{brandDomain || 'Not specified'}</span>
            </div>
          </div>
        </div>
        
        {/* Provider-specific Results */}
        <div className="space-y-4">
          {Object.entries(results).map(([providerKey, result]) => {
            if (!result) return null;
            
            const providerColors = {
              chatgpt: { bg: 'bg-white/5', border: 'border-white/10', text: 'text-black', name: 'ChatGPT' },
              google: { bg: 'bg-white/5', border: 'border-white/10', text: 'text-black', name: 'Google AI Overview' },
            };
            
            const colors = providerColors[result.provider];
            
            return (
              <div key={providerKey} className={`${colors.bg} ${colors.border} border  p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest ${colors.text}`}>{colors.name}</h4>
                  <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest">
                    <span className={`${result.brandMentioned ? 'text-black' : 'text-black/20'}`}>
                      Brand: {result.brandMentioned ? '✓' : '✗'}
                    </span>
                    <span className={`${result.domainCited ? 'text-black' : 'text-black/20'}`}>
                      Domain: {result.domainCited ? '✓' : '✗'}
                    </span>
                    <span className={`${result.competitorMentioned ? 'text-black' : 'text-black/20'}`}>
                      Competitor: {result.competitorMentioned ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-[10px] font-bold uppercase tracking-widest">
                  <div>
                    <span className="text-black/40">Brand Mentions:</span>
                    <span className={`ml-2 ${colors.text}`}>{result.brandMentionCount}</span>
                  </div>
                  <div>
                    <span className="text-black/40">Domain Citations:</span>
                    <span className={`ml-2 ${colors.text}`}>{result.domainCitationCount}</span>
                  </div>
                  <div>
                    <span className="text-black/40">Total Citations:</span>
                    <span className={`ml-2 ${colors.text}`}>{result.citationCount}</span>
                  </div>
                  <div>
                    <span className="text-black/40">Competitor Mentions:</span>
                    <span className={`ml-2 text-black`}>{result.competitorMentionCount}</span>
                  </div>
                  <div>
                    <span className="text-black/40">Competitor Citations:</span>
                    <span className={`ml-2 text-black/60`}>{result.competitorCitationCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* No Results Message */}
        {Object.keys(results).length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100  flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">No Analysis Available</h3>
            <p className="text-xs text-gray-600">No query results available for brand mention analysis</p>
          </div>
        )}
      </div>
    </div>
  );
} 


