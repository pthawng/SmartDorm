import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';

export interface DashboardOverviewData {
  stats: {
    totalProperties: number;
    totalRooms: number;
    occupancyRate: number;
    totalRevenue: number;
  };
}

export function useDashboardOverview(workspaceId?: string) {
  return useQuery<DashboardOverviewData>({
    queryKey: ['dashboard', 'overview', workspaceId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/workspaces/${workspaceId}/dashboard`);
      return {
        stats: {
          totalProperties: data.total_properties,
          totalRooms: data.total_rooms,
          occupancyRate: data.occupancy_rate,
          totalRevenue: data.monthly_revenue,
        }
      };
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, 
  });
}
