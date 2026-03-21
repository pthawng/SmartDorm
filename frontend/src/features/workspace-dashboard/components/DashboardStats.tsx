import { Card } from '@/shared/ui/Card';
import { cn } from '@/shared/utils';
import { Building2, DoorOpen, Percent, Wallet } from 'lucide-react';

export interface DashboardStatsData {
  totalProperties: number;
  totalRooms: number;
  occupancyRate: number;
  monthlyRevenue: number;
}

interface DashboardStatsProps {
  data: DashboardStatsData;
  className?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function DashboardStats({ data, className }: DashboardStatsProps) {
  const stats = [
    {
      label: 'Properties',
      value: data.totalProperties,
      icon: Building2,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      label: 'Total Rooms',
      value: data.totalRooms,
      icon: DoorOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Occupancy Rate',
      value: `${data.occupancyRate}%`,
      icon: Percent,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(data.monthlyRevenue),
      icon: Wallet,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
  ];

  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((stat, i) => (
        <Card key={i} className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-2xl", stat.bgColor)}>
              <stat.icon size={24} className={stat.color} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-display font-black text-slate-900 tracking-tight">
              {stat.value}
            </p>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
