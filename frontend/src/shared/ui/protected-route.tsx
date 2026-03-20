/**
 * Protected Route guard with role-based access control.
 *
 * Usage in router:
 *   <ProtectedRoute requiredPermission="manage_rooms">
 *     <RoomListPage />
 *   </ProtectedRoute>
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { usePermission, type Permission } from '@/shared/hooks/use-permission';
import { ROUTES } from '@/shared/config/routes';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  /** If set, the user must have this permission */
  requiredPermission?: Permission;
  /** If set, the user must have ANY of these permissions */
  requiredAny?: Permission[];
  /** Where to redirect if unauthorized (defaults to dashboard) */
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredAny,
  fallbackPath = ROUTES.DASHBOARD.HOME,
}: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { can, canAny } = usePermission();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (requiredAny && !canAny(...requiredAny)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
