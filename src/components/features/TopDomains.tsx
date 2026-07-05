'use client'
import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import Card from '@/components/shared/Card';

interface DomainEntry {
  rank: number;
  domain: string;
  mentions: number;
  progress: number;
  icon: string;
  change?: number;
}

interface TopDomainsProps {
  title?: string;
  subtitle?: string;
  data: DomainEntry[];
}

export default function TopDomains({ 
  title = "Top Referenced Domains",
  subtitle = "Top 30 most cited domains across AI platforms in the last 30 days",
  data 
}: TopDomainsProps): React.ReactElement {
  
  const getDomainIcon = (domain: string) => {
    // Simple icon mapping based on domain
    const iconMap: { [key: string]: string } = {
      'zeni.ai': '⚡',
      'mercury.com': '▪️',
      'affoweb.com': '🔺',
      'kruzeconsulting.c...': '📊',
      'topapps.ai': '⚫',
      'codemasters': '⚪',
      'freshbooks.c...': '🔷',
      'phoenixstrat...': '🔶'
    };
    
    return iconMap[domain] || '🌐';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-primary';
    if (progress >= 40) return 'bg-white/40';
    return 'bg-white/10';
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-1.5 h-1.5 bg-primary"></div>
          <div>
            <h3 className="text-sm font-serif font-bold text-white tracking-tight">{title}</h3>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">{subtitle}</p>
          </div>
        </div>
        <button className="text-white/40 hover:text-primary transition-all duration-300 p-2">
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center space-x-4 group hover:bg-white/5 p-4 border-b border-white/5 transition-all duration-300">
            {/* Rank */}
            <div className="flex items-center space-x-3 min-w-[60px]">
              <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">#{entry.rank}</span>
              <span className="text-lg">{getDomainIcon(entry.domain)}</span>
            </div>

            {/* Domain info and progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-serif font-bold text-sm truncate tracking-tight">{entry.domain}</span>
                <span className="text-primary font-serif font-bold text-sm ml-4">{entry.mentions}</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-white/5 h-0.5">
                <div 
                  className={`${getProgressColor(entry.progress)} h-0.5 transition-all duration-500`}
                  style={{ width: `${entry.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <button className="text-primary hover:underline text-xs font-bold uppercase tracking-widest transition-colors">
          View all domains →
        </button>
      </div>
    </Card>
  );
} 
