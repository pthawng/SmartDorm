/**
 * Auth provider — syncs auth state on mount.
 */

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/endpoints/auth.api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { accessToken, setAuth, logout } = useAuthStore();

  useEffect(() => {
    // If no token, try a silent refresh to restore session
    if (!accessToken) {
      authApi.refreshToken()
        .then((res) => setAuth(res.data.data.user, res.data.data.accessToken))
        .catch(() => {
          // Silent fail — user stays unauthenticated
        });
      return;
    }

    // If we have a token, just verify it
    authApi.me()
      .then((res) => setAuth(res.data.data, accessToken))
      .catch(() => logout());
  }, [accessToken, setAuth, logout]);

  return <>{children}</>;
}
