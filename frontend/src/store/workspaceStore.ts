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
