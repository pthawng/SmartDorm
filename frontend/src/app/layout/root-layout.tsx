import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/shared/ui/sidebar';
import { Header } from '@/shared/ui/header';
import { Footer } from '@/shared/ui/footer';
import { cn } from '@/shared/utils';

export function RootLayout() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');
  
  // Refined check: Tenant screens should NOT have a sidebar to maintain the 'Airbnb' airy feel.
  const isTenantPath = 
    location.pathname === '/dashboard' ||
    location.pathname === '/dashboard/' ||
    location.pathname.startsWith('/dashboard/tenant') || 
    location.pathname.startsWith('/dashboard/contracts') ||
    location.pathname.startsWith('/dashboard/invoices') ||
    location.pathname.startsWith('/dashboard/maintenance');

  const showSidebar = isDashboard && !isTenantPath;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {/* Global Header */}
      <Header isDashboard={isDashboard} isLoggedIn={true} />

      <div className="flex flex-1">
        {/* Sidebar - Desktop (Only for Landlord/Admin contexts) */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-auto relative flex flex-col">
          <div className={cn(
             "mx-auto animate-in fade-in duration-500 flex-1 w-full",
             isDashboard 
               ? (isTenantPath ? "max-w-none p-0" : (showSidebar ? "max-w-7xl py-8 px-6 lg:px-12" : "max-w-6xl py-8 px-6 lg:px-12")) 
               : "max-w-none"
          )}>
            <Outlet />
          </div>

          {/* Global Footer */}
          <Footer isDashboard={isDashboard} />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
