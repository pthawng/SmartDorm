/**
 * Root Layout — global shell with sidebar and header.
 * Used as a placeholder; to be designed with Stitch UI.
 */

import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — will be composed from features */}
      <aside className="hidden w-64 border-r bg-gray-50 lg:block">
        {/* TODO: Sidebar navigation */}
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
