/**
 * Auth Store — global authentication state.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserData } from '@/entities/user';

interface AuthState {
  user: UserData | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserData, token: string) => void;
  hydrateAuth: () => Promise<void>;
  switchContext: (workspaceId: string) => Promise<any>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('access_token', token);
        set((state) => ({
          user: { 
            ...user, 
            role: user.role || state.user?.role || 'TENANT' 
          },
          accessToken: token,
          isAuthenticated: true,
        }));
      },

      hydrateAuth: async () => {
        try {
          const { authApi } = await import('@/services/endpoints/auth.api');
          const { data } = await authApi.refreshToken();
          const { user: userData, accessToken, context } = data.data;
          localStorage.setItem('access_token', accessToken);
          set({
            user: { ...userData, role: (context?.type || 'TENANT') as any },
            accessToken,
            isAuthenticated: true,
          });
        } catch (error) {
          useAuthStore.getState().logout();
          throw error;
        }
      },

      switchContext: async (workspaceId: string) => {
        const { authApi } = await import('@/services/endpoints/auth.api');
        const { data: response } = await authApi.switchContext({
          context_type: 'workspace',
          workspace_id: workspaceId,
        });

        const { user: userData, accessToken, context } = response.data;
        const user = { ...userData, role: (context?.type || 'LANDLORD') as any };
        
        // Sync both stores from the same atomic response
        localStorage.setItem('access_token', accessToken);
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });

        // Source of truth for workspace context in workspaceStore
        const { useWorkspaceStore } = await import('./workspaceStore');
        const workspaceStore = useWorkspaceStore.getState();
        
        const activeWorkspace = 
          user.memberships?.find(m => m.workspace_id === workspaceId)?.workspace ||
          workspaceStore.memberships.find(m => m.workspace_id === workspaceId)?.workspace;
        
        if (activeWorkspace) {
          workspaceStore.setCurrentWorkspace(activeWorkspace as any);
        } else {
          localStorage.setItem('workspace_id', workspaceId);
        }

        return response.data; // Return full response for hooks to use
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('workspace_id');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'smartdorm-auth',
      partialize: (state) => {
        // Step 1 & 2: Prefer memory, Use localStorage ONLY as a fallback
        // Step 3: Log usage if we are still relying on localStorage for the accessToken
        if (state.accessToken) {
          console.debug('[AuthStore] Persisting accessToken to localStorage (Gradual Migration Step 1-3)');
        }
        return {
          user: state.user,
          // accessToken is NO LONGER persisted to localStorage (Phase 4 Step 4)
          isAuthenticated: state.isAuthenticated,
        };
      },
    },
  ),
);
