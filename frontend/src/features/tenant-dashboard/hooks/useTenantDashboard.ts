import { useQuery } from '@tanstack/react-query';
import { getTenantDashboardData } from '../services/dashboard-api';

/**
 * Hook to manage and fetch the Tenant Dashboard state.
 */
export function useTenantDashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tenant-dashboard'],
    queryFn: getTenantDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    dashboardData: data,
    isLoading,
    isError,
    error,
  };
}
