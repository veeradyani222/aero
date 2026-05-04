'use client'
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Info } from 'lucide-react';
import Card from '@/components/shared/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  description?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = 'blue',
  description
}: MetricCardProps): React.ReactElement {
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;

  const colorClasses = {
    blue: {
      bg: 'bg-white/10',
      text: 'text-white',
      accent: 'bg-white/5'
    },
    green: {
      bg: 'bg-primary',
      text: 'text-primary',
      accent: 'bg-primary/10'
    },
    red: {
      bg: 'bg-destructive',
      text: 'text-destructive',
      accent: 'bg-destructive/10'
    },
    yellow: {
      bg: 'bg-primary',
      text: 'text-primary',
      accent: 'bg-primary/10'
    },
    purple: {
      bg: 'bg-white/10',
      text: 'text-white',
      accent: 'bg-white/5'
    },
    gray: {
      bg: 'bg-white/10',
      text: 'text-white',
      accent: 'bg-white/5'
    },
  };

  return (
    <Card className="relative overflow-hidden group transition-all duration-300 border-white/10 hover:border-primary/50" variant="elevated">
      {/* Background accent */}
      <div className={`absolute inset-0 ${colorClasses[color].accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className={`p-3 bg-white/5 border border-white/10 group-hover:border-primary transition-colors`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</h3>
              {description && (
                <div className="flex items-center space-x-1">
                  <Info className="h-3 w-3 text-white/20" />
                  <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{description}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Value */}
        <div className="mb-6">
          <span className={`text-4xl font-serif font-bold tracking-tighter ${value === "No data available"
              ? "text-white/20 text-xl"
              : "text-white"
            }`}>
            {value}
          </span>
        </div>

        {/* Change indicator */}
        {change !== undefined ? (
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 px-3 py-1.5 ${isPositiveChange
                ? 'bg-primary text-black'
                : isNegativeChange
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/40'
              }`}>
              {isPositiveChange && <TrendingUp className="h-3 w-3" />}
              {isNegativeChange && <TrendingDown className="h-3 w-3" />}
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
            {changeLabel && (
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{changeLabel}</span>
            )}
          </div>
        ) : changeLabel ? (
          <div className="flex items-center justify-end">
            <span className="text-muted-foreground text-xs">{changeLabel}</span>
          </div>
        ) : null}
      </div>

      {/* Decorative element */}
      <div className={`absolute -top-2 -right-2 w-16 h-16 ${colorClasses[color].bg} opacity-5 group-hover:scale-110 transition-transform duration-300`} />
    </Card>
  );
} 
