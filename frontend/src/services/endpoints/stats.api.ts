/**
 * Dashboard Stats API endpoints.
 */

import { apiClient } from '@/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';

export interface DashboardStats {
  totalRevenue: number;
  occupancyRate: number;
  totalRooms: number;
  occupiedRooms: number;
  activeContracts: number;
  overdueInvoices: number;
}

export const statsApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/stats/dashboard'),
};
