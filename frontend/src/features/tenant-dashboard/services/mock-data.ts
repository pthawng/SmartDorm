import type { TenantDashboardData, ContractSummary, InvoiceSummary, MaintenanceSummary } from '../types';

export const MOCK_CONTRACT: ContractSummary = {
  id: 'ctr-1',
  room_number: '101',
  property_name: 'The Modern Loft',
  start_date: '2026-01-01',
  end_date: '2027-01-01',
  monthly_rent: 4500000,
  status: 'ACTIVE',
};

export const MOCK_INVOICES: InvoiceSummary[] = [
  {
    id: 'inv-3',
    amount: 4500000,
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'OVERDUE',
    title: 'March 2026 Rent',
  },
  {
    id: 'inv-2',
    amount: 4500000,
    due_date: '2026-02-15T00:00:00.000Z',
    status: 'PAID',
    title: 'February 2026 Rent',
  },
  {
    id: 'inv-1',
    amount: 4500000,
    due_date: '2026-01-15T00:00:00.000Z',
    status: 'PAID',
    title: 'January 2026 Rent',
  },
];

export const MOCK_ISSUES: MaintenanceSummary[] = [
  {
    id: 'mnt-1',
    title: 'Leaking AC Unit',
    status: 'PENDING',
    priority: 'HIGH',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mnt-2',
    title: 'Broken chair wheel',
    status: 'RESOLVED',
    priority: 'LOW',
    created_at: '2026-02-10T10:00:00.000Z',
  },
];

export const MOCK_DASHBOARD_DATA: TenantDashboardData = {
  activeContract: MOCK_CONTRACT,
  upcomingInvoice: MOCK_INVOICES[0], // the overdue one
  recentInvoices: MOCK_INVOICES,
  activeIssues: MOCK_ISSUES,
};
