import { Loading, ErrorState } from '@/shared/ui';
import { useDashboardOverview } from '../hooks';

import { DashboardHeader } from './DashboardHeader';
import { StatsCard } from './StatsCard';
import { RevenueChart } from './RevenueChart';
import { RoomStatusOverview } from './RoomStatusOverview';
import { RecentTransactionsTable } from './RecentTransactionsTable';

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function DashboardOverviewFeature() {
  const { data, isLoading, isError, refetch } = useDashboardOverview();

  if (isLoading) {
    return <Loading message="Loading dashboard statistics..." />;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Failed to load dashboard"
          description="We couldn't fetch the latest property statistics. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  const { stats, revenueChart, roomStatuses, recentInvoices } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Dashboard Header */}
      <DashboardHeader />

      {/* 2. Key Stats Cards (Top row, 3 cards) */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Revenue"
          value={vndFormatter.format(stats.totalRevenue)}
          valueClassName="text-emerald-700"
          description="Revenue generated this month."
          trend={{ value: stats.revenueTrend, label: 'vs last month' }}
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          valueClassName="text-indigo-600"
          description={`${stats.occupiedRooms} / ${stats.totalRooms} rooms currently occupied.`}
          trend={stats.occupancyRate > 90 ? { value: 2.5, label: 'high occupancy' } : undefined}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatsCard
          title="Total Rooms"
          value={stats.totalRooms}
          description="Managed properties capacity."
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
      </div>

      {/* 3. Middle Section (2 Columns) */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueChart} />
        </div>
        <div className="lg:col-span-1 h-96 lg:h-auto">
          <RoomStatusOverview rooms={roomStatuses} />
        </div>
      </div>

      {/* 4. Bottom Section (Recent Transactions) */}
      <div>
        <RecentTransactionsTable transactions={recentInvoices} />
      </div>
    </div>
  );
}
