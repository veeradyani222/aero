'use client'
import React from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Trophy, Medal, Award } from 'lucide-react';
import Card from '@/components/shared/Card';
import WebLogo from '@/components/shared/WebLogo';

interface LeaderboardEntry {
  rank: number;
  brand: string;
  domain?: string; // Added for WebLogo
  mentions: number;
  visibility: number;
  change: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  logo?: string;
}

interface LeaderboardTableProps {
  title: string;
  data: LeaderboardEntry[];
  showSentiment?: boolean;
}

export default function LeaderboardTable({
  title,
  data,
  showSentiment = false
}: LeaderboardTableProps): React.ReactElement {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-primary bg-primary/10';
      case 'negative':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-black/70 bg-gray-100';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-[#FFD700]" />;
      case 2:
        return <Medal className="h-5 w-5 text-[#C0C0C0]" />;
      case 3:
        return <Award className="h-5 w-5 text-[#CD7F32]" />;
      default:
        return null;
    }
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-1.5 h-1.5 bg-primary"></div>
          <h3 className="text-sm font-serif font-bold text-black tracking-tight">{title}</h3>
          <span className="text-black/60 text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-2 py-1">
            {data.length} entries
          </span>
        </div>
        <button className="text-black/60 hover:text-black transition-all duration-300 p-2">
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left text-[10px] font-bold text-black/60 uppercase tracking-widest py-4 px-3">Rank</th>
              <th className="text-left text-[10px] font-bold text-black/60 uppercase tracking-widest py-4 px-3">Brand</th>
              <th className="text-left text-[10px] font-bold text-black/60 uppercase tracking-widest py-4 px-3">Mentions</th>
              <th className="text-left text-[10px] font-bold text-black/60 uppercase tracking-widest py-4 px-3">Visibility</th>
              <th className="text-left text-[10px] font-bold text-black/60 uppercase tracking-widest py-4 px-3">Change</th>
              {showSentiment && (
                <th className="text-left text-[10px] font-bold text-black/60 uppercase tracking-widest py-4 px-3">Sentiment</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-all duration-300 group">
                <td className="py-4 px-3">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(entry.rank)}
                    <div className={`inline-flex items-center justify-center w-8 h-8 text-[10px] font-bold tracking-widest transition-colors ${entry.rank <= 3
                      ? entry.rank === 1
                        ? 'bg-primary text-black'
                        : entry.rank === 2
                          ? 'bg-white text-black'
                          : 'bg-white/40 text-black'
                      : 'bg-white/5 text-white/40 group-hover:bg-primary group-hover:text-black'
                      }`}>
                      {entry.rank}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className="flex items-center space-x-3">
                    {entry.domain ? (
                      <div className="bg-white/5 p-1 border border-white/10 group-hover:border-primary transition-colors">
                        <WebLogo
                          domain={entry.domain}
                          size={24}
                          className=""
                          alt={`${entry.brand} logo`}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary transition-colors">
                        <span className="text-white text-[10px] font-bold">
                          {entry.brand.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-black font-serif font-bold text-sm tracking-tight">{entry.brand}</span>
                      <p className="text-black/60 text-[8px] font-bold uppercase tracking-widest">AI Platform</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div>
                    <span className="text-black font-serif font-bold text-sm">{formatNumber(entry.mentions)}</span>
                    <p className="text-black/60 text-[8px] font-bold uppercase tracking-widest">mentions</p>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="w-20 bg-white/5 h-0.5">
                        <div
                          className="bg-primary h-0.5 transition-all duration-300"
                          style={{ width: `${entry.visibility}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-black font-serif font-bold text-[10px] min-w-[2rem]">{entry.visibility}%</span>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${entry.change > 0
                    ? 'bg-primary text-black'
                    : entry.change < 0
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/40'
                    }`}>
                    {entry.change > 0 && <ChevronUp className="h-3 w-3" />}
                    {entry.change < 0 && <ChevronDown className="h-3 w-3" />}
                    <span>
                      {entry.change > 0 ? '+' : ''}{entry.change}%
                    </span>
                  </div>
                </td>
                {showSentiment && (
                  <td className="py-4 px-3">
                    <span className={`inline-flex px-2 py-1  text-xs font-medium capitalize ${getSentimentColor(entry.sentiment)}`}>
                      {entry.sentiment}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 
