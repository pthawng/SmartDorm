import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/shared/ui/header';
import { Footer } from '@/shared/ui/footer';
import { cn } from '@/shared/utils';
import { useAuthStore } from '@/store/authStore';

export function RootLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.startsWith('/workspaces');
  const isAuthPath = location.pathname === '/login' || location.pathname === '/register';
  
  // Immersive feel: Tenant screens and general dashboard now use the full width airy layout.
  const isImmersivePath = 
    location.pathname === '/dashboard' ||
    location.pathname === '/dashboard/' ||
    location.pathname.startsWith('/workspaces') ||
    location.pathname.startsWith('/dashboard/tenant') || 
    location.pathname.startsWith('/dashboard/contracts') ||
    location.pathname.startsWith('/dashboard/invoices') ||
    location.pathname.startsWith('/dashboard/maintenance') ||
    location.pathname.startsWith('/dashboard/messages') ||
    location.pathname.startsWith('/dashboard/workspaces/setup');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Global Header (Hidden on immersive Auth screens) */}
      {!isAuthPath && (
        <Header 
          isDashboard={isDashboard} 
          isLoggedIn={isAuthenticated} 
          userName={user?.full_name || user?.email || 'Alex Rivers'}
          userRole={user?.role}
        />
      )}

      <div className="flex flex-1">
        {/* Main content area */}
        <main className="flex-1 relative flex flex-col">
          <div className={cn(
             "mx-auto animate-in fade-in duration-500 flex-1 w-full",
             isDashboard 
               ? (isImmersivePath ? "max-w-none p-0" : "max-w-7xl py-12 px-6 lg:px-12") 
               : "max-w-none"
          )}>
            <Outlet />
          </div>

          {/* Global Footer (Hidden on focused Messaging and Auth views) */}
          {!location.pathname.startsWith('/dashboard/messages') && !isAuthPath && (
            <Footer isDashboard={isDashboard} />
          )}
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
