/**
 * Dashboard Layout — authenticated app shell.
 * Thin: only composes the root layout and outlet.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/shared/config/routes';

export function DashboardLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-gray-50 lg:block">
        {/* TODO: Dashboard sidebar nav from features */}
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
