import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { useTenantDashboard } from '../hooks/useTenantDashboard';
import { WelcomeHeader } from './WelcomeHeader';
import { CurrentStayCard } from './CurrentStayCard';
import { PaymentCard } from './PaymentCard';
import { MaintenanceList } from './MaintenanceList';
import { QuickActions } from './QuickActions';
import { Loading, ErrorState } from '@/shared/ui';

export function TenantDashboardFeature() {
  const navigate = useNavigate();
  const { dashboardData, isLoading, isError } = useTenantDashboard();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-32 px-6">
        <Loading message="Preparing your home dashboard..." />
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto py-32 px-6">
        <ErrorState 
          title="Couldn't Load Your Dashboard" 
          description="We're having trouble reaching the property server. Please refresh or try again later." 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 lg:px-12 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Decorative page artifacts */}
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary-50/50 blur-3xl rounded-full opacity-50 translate-x-1/2 -translate-y-1/2" />
      
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-12">
        <WelcomeHeader 
          name={dashboardData.tenantName} 
        />
        <div className="flex -space-x-3 overflow-hidden p-1">
          <div className="h-14 w-14 rounded-full ring-4 ring-white bg-slate-100 flex items-center justify-center shadow-lg">
             <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" className="rounded-full h-full w-full object-cover" alt="Tenant" />
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Urgent Actions Section (Mobile First Priority) */}
        <div className="lg:col-span-4 space-y-12 order-1 lg:order-2">
           <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Financial Spotlight</h4>
              <PaymentCard 
                payment={dashboardData.payment} 
                onPay={() => navigate(ROUTES.DASHBOARD.INVOICE_PAY(dashboardData.payment.id))} 
              />
           </section>

           <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Home Service</h4>
              <MaintenanceList requests={dashboardData.recentMaintenance} onReport={() => {}} />
           </section>
        </div>

        {/* Primary Content (Stay Showcase) */}
        <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Your Current Stay</h4>
           <CurrentStayCard stay={dashboardData.stay} />
        </div>

      </div>

      {/* Secondary Row: Quick Actions */}
      <section className="space-y-10">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Service Shortcuts</h4>
            <div className="h-px bg-slate-100 flex-1 ml-8" />
         </div>
         <QuickActions />
      </section>

      <footer className="pt-20 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8 grayscale opacity-30">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2024 SmartDorm Residences. Premium Lifestyle Experience Platform.</p>
         <div className="flex gap-8">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest cursor-pointer hover:text-primary-600">Support Center</span>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Legal</span>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest font-mono italic">SM-D v2.0</span>
         </div>
      </footer>
    </div>
  );
}
