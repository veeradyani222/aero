'use client'
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  ArrowUpDown,
  ChevronDown,
  ExternalLink,
  Globe,
  Quote,
  Search
} from 'lucide-react';
import Link from 'next/link';
import WebLogo from '@/components/shared/WebLogo';

interface Citation {
  id: string;
  url: string;
  text: string;
  source: string;
  provider: 'chatgpt' | 'perplexity' | 'googleAI';
  query: string;
  queryId: string;
  brandName: string;
  domain?: string;
  timestamp: string;
  type?: string;
  isBrandMention?: boolean;
  isDomainCitation?: boolean;
}

interface CitationsTableProps {
  citations: Citation[];
}

export default function CitationsTable({ citations }: CitationsTableProps) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Citation>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [filterBrandMention, setFilterBrandMention] = useState(false);
  const [filterDomainCitation, setFilterDomainCitation] = useState(false);

  // Filter citations
  const filteredCitations = citations.filter(citation => {
    if (selectedProvider !== 'all' && citation.provider !== selectedProvider) {
      return false;
    }
    if (filterBrandMention && !citation.isBrandMention) {
      return false;
    }
    if (filterDomainCitation && !citation.isDomainCitation) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        citation.text.toLowerCase().includes(term) ||
        citation.url.toLowerCase().includes(term) ||
        citation.query.toLowerCase().includes(term) ||
        citation.source.toLowerCase().includes(term) ||
        citation.domain?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Sort citations
  const sortedCitations = [...filteredCitations].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    return 0;
  });

  // Paginate citations
  const totalPages = Math.ceil(sortedCitations.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedCitations = sortedCitations.slice(startIndex, startIndex + itemsPerPage);

  // Handle sort
  const handleSort = (field: keyof Citation) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              placeholder="Search citations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-black focus:outline-none focus:border-primary transition-all duration-300"
            />
          </div>
          
          {/* Platform Filter */}
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 text-black focus:outline-none focus:border-primary transition-all duration-300"
          >
            <option value="all" className="bg-black">All Platforms</option>
            <option value="chatgpt" className="bg-black">ChatGPT</option>
            <option value="perplexity" className="bg-black">Perplexity</option>
            <option value="googleAI" className="bg-black">Google AI</option>
          </select>
          {/* Brand Mentioned Filter */}
          <label className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-black/60 cursor-pointer hover:text-black transition-colors">
            <input
              type="checkbox"
              checked={filterBrandMention}
              onChange={e => setFilterBrandMention(e.target.checked)}
              className="accent-primary"
            />
            <span>Brand Mentioned</span>
          </label>
          {/* Domain Cited Filter */}
          <label className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-black/60 cursor-pointer hover:text-black transition-colors">
            <input
              type="checkbox"
              checked={filterDomainCitation}
              onChange={e => setFilterDomainCitation(e.target.checked)}
              className="accent-white"
            />
            <span>Domain Cited</span>
          </label>
        </div>

        {/* Items per page */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      {/* Table */}
      <div className="border border-white/10 overflow-hidden">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-[10px] font-bold text-black/40 uppercase tracking-widest cursor-pointer hover:text-black transition-colors"
                  onClick={() => handleSort('source')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Source</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Citation
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('provider')}
              >
                <div className="flex items-center space-x-1">
                  <span>Platform</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-white/10">
            {paginatedCitations.map((citation) => (
              <tr key={citation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {citation.domain && (
                      <WebLogo domain={`https://${citation.domain}`} className="w-6 h-6" size={24} />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{citation.source}</div>
                      {citation.domain && (
                        <div className="text-sm text-gray-500">{citation.domain}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xl">
                    <p className="text-sm text-gray-900 line-clamp-2">{citation.text}</p>
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-1"
                    >
                      <span className="truncate max-w-md">{citation.url}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest
                    ${citation.provider === 'chatgpt' ? 'bg-primary/20 text-black' :
                    citation.provider === 'perplexity' ? 'bg-white/20 text-black' :
                    'bg-white/10 text-black/60'}`}
                  >
                    {citation.provider === 'chatgpt' ? 'ChatGPT' :
                     citation.provider === 'perplexity' ? 'Perplexity' : 'Google AI'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(citation.timestamp), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-col gap-2">
                    {citation.isBrandMention && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-primary text-black">
                        Brand Mentioned
                      </span>
                    )}
                    {citation.isDomainCitation && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-white text-black">
                        Domain Cited
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedCitations.length)} of {sortedCitations.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300  disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300  disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 


