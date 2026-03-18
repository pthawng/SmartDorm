import { useQuery } from '@tanstack/react-query';
import { MOCK_WORKSPACES } from '../services/mock-data';
import type { WorkspaceSummary } from '../types';

export function useWorkspaces() {
  return useQuery<WorkspaceSummary[]>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      // simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      return MOCK_WORKSPACES;
    },
    staleTime: 5 * 60 * 1000,
  });
}
