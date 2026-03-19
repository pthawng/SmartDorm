import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/shared/ui/sidebar';

export function DashboardLayout() {
  // Authentication bypassed temporarily for UI testing
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="flex-1 overflow-auto h-screen relative">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
