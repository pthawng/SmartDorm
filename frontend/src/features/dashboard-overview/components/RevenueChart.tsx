import { Card, CardContent } from '@/shared/ui';
import type { RevenueDataPoint } from '../types';

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

const compactFormatter = new Intl.NumberFormat('vi-VN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function RevenueChart({ data }: RevenueChartProps) {
  // Find max value to calculate bar heights
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card className="border-slate-200 h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Revenue (Last 6 Months)</h3>
      </div>
      
      <CardContent className="flex-1 p-6 flex flex-col">
        {data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm">
            <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
            </div>
            <p className="font-medium text-slate-900">No Revenue Data</p>
            <p className="mt-1 text-xs">There is no sufficient data to plot.</p>
          </div>
        ) : (
          <div className="relative flex-1 pt-10 pb-6 flex items-end justify-between gap-2 sm:gap-4">
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 pt-10 pb-6 pointer-events-none flex flex-col justify-between">
              {[100, 75, 50, 25, 0].map((step) => (
                <div key={step} className="flex items-center w-full">
                  <span className="text-[10px] text-slate-400 w-8 tabular-nums invisible sm:visible">
                    {step === 0 ? '0' : compactFormatter.format((maxRevenue * step) / 100)}
                  </span>
                  <div className="w-full border-t border-dashed border-slate-200 ml-2" />
                </div>
              ))}
            </div>

            {data.map((point) => {
              // Minimum height 8% so empty bars are visible; max 100%
              const heightPct = Math.max((point.revenue / maxRevenue) * 100, 8);
              
              return (
                <div key={point.month} className="z-10 flex flex-col items-center justify-end flex-1 group h-full">
                  {/* Tooltip on hover mapping to top of bar */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity pointer-events-none shadow-lg z-20">
                    {compactFormatter.format(point.revenue)}
                  </div>
                  
                  {/* Always visible label (hidden on very small screens) */}
                  <div className="hidden sm:block absolute bottom-full mb-1 text-[10px] sm:text-xs font-semibold text-slate-600">
                    {compactFormatter.format(point.revenue)}
                  </div>
                  
                  {/* The Bar */}
                  <div 
                    className="w-full max-w-[48px] bg-primary-200 group-hover:bg-primary-600 rounded-t-md transition-all duration-300 relative z-10"
                    style={{ height: `${heightPct}%` }}
                  />
                  
                  {/* The X-Axis Label */}
                  <div className="absolute -bottom-6 text-[10px] sm:text-xs font-medium text-slate-500 text-center uppercase">
                    {point.month}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
