'use client'
import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import Card from '@/components/shared/Card';

interface TrendData {
  date: string;
  chatgpt: number;
  googleAio: number;
  perplexity: number;
}

interface TrendChartsProps {
  brandVisibilityData?: TrendData[];
  linkVisibilityData?: TrendData[];
}

// Mock data - in real app this would come from props
const defaultBrandData: TrendData[] = [
  { date: 'May 30', chatgpt: 2, googleAio: 1, perplexity: 1 },
  { date: 'Jun 2', chatgpt: 2, googleAio: 1, perplexity: 1 },
  { date: 'Jun 5', chatgpt: 3, googleAio: 2, perplexity: 1 },
  { date: 'Jun 8', chatgpt: 3, googleAio: 2, perplexity: 2 },
  { date: 'Jun 11', chatgpt: 4, googleAio: 3, perplexity: 2 },
  { date: 'Jun 14', chatgpt: 4, googleAio: 3, perplexity: 3 },
  { date: 'Jun 17', chatgpt: 5, googleAio: 4, perplexity: 3 },
  { date: 'Jun 20', chatgpt: 6, googleAio: 5, perplexity: 4 },
  { date: 'Jun 23', chatgpt: 8, googleAio: 7, perplexity: 6 },
  { date: 'Jun 27', chatgpt: 22, googleAio: 18, perplexity: 15 }
];

const defaultLinkData: TrendData[] = [
  { date: 'May 30', chatgpt: 1, googleAio: 0, perplexity: 1 },
  { date: 'Jun 2', chatgpt: 1, googleAio: 1, perplexity: 1 },
  { date: 'Jun 5', chatgpt: 2, googleAio: 1, perplexity: 1 },
  { date: 'Jun 8', chatgpt: 2, googleAio: 2, perplexity: 1 },
  { date: 'Jun 11', chatgpt: 3, googleAio: 2, perplexity: 2 },
  { date: 'Jun 14', chatgpt: 3, googleAio: 3, perplexity: 2 },
  { date: 'Jun 17', chatgpt: 4, googleAio: 3, perplexity: 3 },
  { date: 'Jun 20', chatgpt: 5, googleAio: 4, perplexity: 3 },
  { date: 'Jun 23', chatgpt: 7, googleAio: 6, perplexity: 5 },
  { date: 'Jun 27', chatgpt: 20, googleAio: 16, perplexity: 13 }
];

export default function TrendCharts({ 
  brandVisibilityData = defaultBrandData,
  linkVisibilityData = defaultLinkData 
}: TrendChartsProps): React.ReactElement {

  const renderChart = (data: TrendData[], maxValue: number = 25) => {
    const chartHeight = 200;
    const chartWidth = 500;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    
    const xStep = (chartWidth - padding.left - padding.right) / (data.length - 1);
    const yStep = (chartHeight - padding.top - padding.bottom) / maxValue;

    const createPath = (values: number[], color: string) => {
      const points = values.map((value, index) => ({
        x: padding.left + (index * xStep),
        y: chartHeight - padding.bottom - (value * yStep)
      }));
      
      const path = points.reduce((acc, point, index) => {
        return acc + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
      }, '');
      
      return (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    };

    const yTicks = [0, 25, 50, 75, 100];
    const yLabels = ['0%', '25%', '50%', '75%', '100%'];

    return (
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {yTicks.map((tick, index) => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={chartHeight - padding.bottom - (tick * maxValue / 100 * yStep)}
                x2={chartWidth - padding.right}
                y2={chartHeight - padding.bottom - (tick * maxValue / 100 * yStep)}
                stroke="rgb(55, 65, 81)"
                strokeWidth="1"
                opacity="0.3"
              />
              <text
                x={padding.left - 10}
                y={chartHeight - padding.bottom - (tick * maxValue / 100 * yStep) + 4}
                textAnchor="end"
                className="text-xs text-muted-foreground"
              >
                {yLabels[index]}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {data.map((item, index) => (
            <text
              key={item.date}
              x={padding.left + (index * xStep)}
              y={chartHeight - 10}
              textAnchor="middle"
              className="text-xs text-muted-foreground"
            >
              {item.date}
            </text>
          ))}

          {/* Chart lines */}
          {createPath(data.map(d => d.chatgpt), 'rgb(var(--primary))')}
          {createPath(data.map(d => d.googleAio), 'white')}
          {createPath(data.map(d => d.perplexity), 'rgba(255,255,255,0.4)')}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">ChatGPT</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Google AIO</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white/40"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Perplexity</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Brand Visibility Trend */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-1.5 h-1.5 bg-primary"></div>
          <h3 className="text-sm  font-bold text-white tracking-tight">Brand Visibility Trend</h3>
        </div>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8">
          How often your brand appears in AI responses
        </p>
        {renderChart(brandVisibilityData)}
      </Card>

      {/* Link Visibility Trend */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-1.5 h-1.5 bg-white"></div>
          <h3 className="text-sm  font-bold text-white tracking-tight">Link Visibility Trend</h3>
        </div>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8">
          How often your website links appear in AI responses
        </p>
        {renderChart(linkVisibilityData)}
      </Card>
    </div>
  );
} 
