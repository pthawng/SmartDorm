import { Loading, ErrorState } from '@/shared/ui';
import { useTenantDashboard } from '../hooks';

import { WelcomeHeader } from './WelcomeHeader';
import { ActiveContractCard } from './ActiveContractCard';
import { InvoiceSummaryCard } from './InvoiceSummaryCard';
import { MaintenanceList } from './MaintenanceList';
import { RecentInvoicesTable } from './RecentInvoicesTable';

export function TenantDashboardView() {
  const { data, isLoading, isError, refetch } = useTenantDashboard();

  if (isLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Could not load dashboard"
          description="We encountered an issue fetching your dashboard data."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header */}
      <WelcomeHeader tenantName="David" />

      {/* 2. Top Grid Area (3 Cols) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Contract */}
        <div className="lg:col-span-1 border-r border-transparent">
          <ActiveContractCard contract={data.activeContract} />
        </div>

        {/* Invoice Summary (Upcoming Payment) */}
        <div className="lg:col-span-1">
          <InvoiceSummaryCard invoice={data.upcomingInvoice} />
        </div>

        {/* Maintenance / Quick Stats */}
        <div className="lg:col-span-1 md:col-span-2 lg:col-span-1">
          <MaintenanceList issues={data.activeIssues} />
        </div>
      </div>

      {/* 3. Bottom Half */}
      <div className="mt-8">
        <RecentInvoicesTable invoices={data.recentInvoices} />
      </div>
    </div>
  );
}
