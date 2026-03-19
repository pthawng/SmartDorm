import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/shared/ui/sidebar';

export function RootLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="flex-1 overflow-auto h-screen relative">
        <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default RootLayout;
