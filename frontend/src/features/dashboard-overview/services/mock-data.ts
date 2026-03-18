import type { DashboardOverviewData } from '../types';

export const MOCK_DASHBOARD_DATA: DashboardOverviewData = {
  stats: {
    totalRevenue: 125500000,
    revenueTrend: 15.4,
    occupancyRate: 92,
    totalRooms: 50,
    occupiedRooms: 46,
  },
  revenueChart: [
    { month: 'Oct', revenue: 95000000 },
    { month: 'Nov', revenue: 105000000 },
    { month: 'Dec', revenue: 110000000 },
    { month: 'Jan', revenue: 115000000 },
    { month: 'Feb', revenue: 120000000 },
    { month: 'Mar', revenue: 125500000 },
  ],
  roomStatuses: [
    { id: '1', roomNumber: '102', status: 'AVAILABLE', property: 'The Modern Loft' },
    { id: '2', roomNumber: '205', status: 'MAINTENANCE', property: 'The Modern Loft' },
    { id: '3', roomNumber: '304', status: 'AVAILABLE', property: 'Sunrise Villas' },
    { id: '4', roomNumber: '101', status: 'OCCUPIED', property: 'The Modern Loft' },
  ],
  recentInvoices: [
    { id: 'inv-1', tenantName: 'Alice Nguyen', roomNumber: '201', amount: 4500000, date: new Date(Date.now() - 1*86400000).toISOString(), status: 'PAID' },
    { id: 'inv-2', tenantName: 'David Smith', roomNumber: '101', amount: 5500000, date: new Date(Date.now() - 3*86400000).toISOString(), status: 'OVERDUE' },
    { id: 'inv-3', tenantName: 'John Doe', roomNumber: '305', amount: 4000000, date: new Date(Date.now() - 4*86400000).toISOString(), status: 'PAID' },
    { id: 'inv-4', tenantName: 'Sarah Tran', roomNumber: '105', amount: 4800000, date: new Date(Date.now() - 5*86400000).toISOString(), status: 'PAID' },
    { id: 'inv-5', tenantName: 'Michael Le', roomNumber: '402', amount: 5000000, date: new Date().toISOString(), status: 'PENDING' },
  ],
};
