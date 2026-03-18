import { useQuery } from '@tanstack/react-query';
import { MOCK_DASHBOARD_DATA } from '../services/mock-data';
import type { DashboardOverviewData } from '../types';

export function useDashboardOverview() {
  return useQuery<DashboardOverviewData>({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      // simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_DASHBOARD_DATA;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
