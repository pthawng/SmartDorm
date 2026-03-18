import { Card, CardContent } from '@/shared/ui';
import { cn } from '@/shared/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  valueClassName?: string;
  description: string;
  trend?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, valueClassName, description, trend, icon }: StatsCardProps) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </h3>
          {icon && <div className="text-slate-400">{icon}</div>}
        </div>
        
        <div className="flex items-baseline gap-4">
          <p className={cn("text-4xl lg:text-5xl font-bold font-display tracking-tight", valueClassName || "text-slate-900")}>
            {value}
          </p>
          
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
                trend.value > 0
                  ? "bg-emerald-50 text-emerald-700"
                  : trend.value < 0
                  ? "bg-red-50 text-red-700"
                  : "bg-slate-50 text-slate-700"
              )}
            >
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        
        <p className="mt-4 text-sm font-medium text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}
