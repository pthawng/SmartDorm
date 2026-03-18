export interface DashboardStats {
  totalRevenue: number;
  revenueTrend: number; // percentage e.g. 15 for +15%
  occupancyRate: number; // percentage e.g. 92
  totalRooms: number;
  occupiedRooms: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface RoomStatusSummary {
  id: string;
  roomNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  property: string;
}

export interface RecentTransaction {
  id: string;
  tenantName: string;
  roomNumber: string;
  amount: number;
  date: string;
  status: 'PAID' | 'OVERDUE' | 'PENDING';
}

export interface DashboardOverviewData {
  stats: DashboardStats;
  revenueChart: RevenueDataPoint[];
  roomStatuses: RoomStatusSummary[];
  recentInvoices: RecentTransaction[];
}
