import { useQuery } from '@tanstack/react-query';
import { MOCK_DASHBOARD_DATA } from '../services/mock-data';
import type { TenantDashboardData } from '../types';

/**
 * useTenantDashboard - Fetches aggregated dashboard data 
 * (In a real app, this might be 3 concurrent queries or 1 gateway aggregation endpoint)
 */
export function useTenantDashboard() {
  return useQuery<TenantDashboardData>({
    queryKey: ['tenant', 'dashboard'],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_DASHBOARD_DATA;
    },
    staleTime: 5 * 60 * 1000,
  });
}
