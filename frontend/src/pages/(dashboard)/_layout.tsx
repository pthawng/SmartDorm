/**
 * Dashboard Layout — authenticated app shell.
 * Thin: only composes the root layout and outlet.
 */

import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  // Authentication bypassed temporarily for UI testing
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-gray-50 lg:block">
        {/* TODO: Dashboard sidebar nav from features */}
      </aside>
      <main className="flex-1 overflow-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
