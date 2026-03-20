import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/shared/config/routes';
import { toast } from 'sonner';

interface GuestRouteProps {
  children: ReactNode;
}

/**
 * Guard for routes that should ONLY be accessible to guests (Login, Register).
 * If a user is already authenticated, they are redirected to the dashboard.
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      toast.error('You are already logged in. Please log out first to access this page.', {
        id: 'guest-route-guard',
        duration: 4000,
      });
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD.HOME} replace />;
  }

  return <>{children}</>;
}
