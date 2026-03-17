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
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
