/**
 * Auth provider — syncs auth state on mount.
 */

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/endpoints/auth.api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { accessToken, setAuth, logout } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    authApi.me()
      .then((res) => setAuth(res.data.data, accessToken))
      .catch(() => logout());
  }, [accessToken, setAuth, logout]);

  return <>{children}</>;
}
