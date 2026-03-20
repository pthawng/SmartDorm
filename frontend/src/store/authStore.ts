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
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
        }),

      hydrateAuth: async () => {
        try {
          // Dynamic import to avoid circular dependency
          const { authApi } = await import('@/services/endpoints/auth.api');
          const { data } = await authApi.refreshToken();
          set({
            user: data.data.user,
            accessToken: data.data.accessToken,
            isAuthenticated: true,
          });
        } catch (error) {
          useAuthStore.getState().logout();
          throw error;
        }
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
