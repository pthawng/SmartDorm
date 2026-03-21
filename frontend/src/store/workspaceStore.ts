/**
 * Workspace Store — active workspace context.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkspaceData } from '@/entities/workspace';
import type { MembershipData } from '@/entities/membership';

interface WorkspaceState {
  currentWorkspace: WorkspaceData | null;
  memberships: MembershipData[];
  setCurrentWorkspace: (workspace: WorkspaceData) => void;
  setMemberships: (memberships: MembershipData[]) => void;
  fetchWorkspaces: () => Promise<void>;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      currentWorkspace: null,
      memberships: [],

      setCurrentWorkspace: (workspace) => {
        localStorage.setItem('workspace_id', workspace.id);
        set({ currentWorkspace: workspace });
      },

      setMemberships: (memberships) => set({ memberships }),

      fetchWorkspaces: async () => {
        const { workspaceApi } = await import('@/services/endpoints/workspace.api');
        const { data } = await workspaceApi.getAll();
        
        // Map WorkspaceData[] to MembershipData[]
        const memberships: MembershipData[] = data.data.map((ws: any) => ({
          user_id: '', // Not strictly needed for switcher display
          workspace_id: ws.id,
          role: ws.membership_role || 'owner',
          workspace: {
            id: ws.id,
            name: ws.name,
            created_by: ws.created_by,
            created_at: ws.created_at
          }
        }));

        set({ memberships });

        // Sync current workspace if it's already set to reflect any name changes
        const { currentWorkspace } = useWorkspaceStore.getState();
        if (currentWorkspace) {
          const updated = memberships.find(m => m.workspace_id === currentWorkspace.id);
          if (updated?.workspace) {
            set({ currentWorkspace: updated.workspace });
          }
        }
      },

      clearWorkspace: () => {
        localStorage.removeItem('workspace_id');
        set({ currentWorkspace: null, memberships: [] });
      },
    }),
    {
      name: 'smartdorm-workspace',
    },
  ),
);
