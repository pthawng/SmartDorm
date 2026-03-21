import { useQuery } from '@tanstack/react-query';
import { workspaceApi } from '@/services/endpoints/workspace.api';
import type { WorkspaceSummary } from '../types';

export function useWorkspaces() {
  return useQuery<WorkspaceSummary[]>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data } = await workspaceApi.getAll();
      
      return data.data.map((ws: any) => ({
        id: ws.id,
        name: ws.name,
        role: (ws.membership_role || 'owner').toUpperCase() as any,
        memberCount: 0,
        activeProperties: 0,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
