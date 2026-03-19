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
    <div className="min-h-screen bg-white">
      {/* Soft Background Accents */}
      <div className="fixed top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary-50/30 blur-[120px] rounded-full opacity-60 translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-slate-50/50 blur-[100px] rounded-full opacity-40 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-screen-2xl mx-auto py-16 md:py-24 px-6 lg:px-12 space-y-20 md:space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* 1. Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-12">
          <WelcomeHeader name={dashboardData.tenantName} />
        </header>

        {/* 2. Hero Section: Current Stay */}
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Your Current Stay</h4>
            <div className="h-px bg-slate-100 flex-1 ml-10" />
          </div>
          <CurrentStayCard stay={dashboardData.stay} />
        </section>

        {/* 3. Critical Row: Payment & Maintenance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-stretch">
          <section className="space-y-8 h-full">
            <div className="flex items-center gap-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 flex-shrink-0">Financial Status</h4>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
            <PaymentCard 
              payment={dashboardData.payment} 
              onPay={() => navigate(ROUTES.DASHBOARD.INVOICE_PAY(dashboardData.payment.id))} 
            />
          </section>

          <section className="space-y-8 h-full">
            <div className="flex items-center gap-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 flex-shrink-0">Home Service</h4>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
            <MaintenanceList 
              requests={dashboardData.recentMaintenance} 
              onReport={() => {}} 
            />
          </section>
        </div>

        {/* 4. Utility Row: Quick Actions */}
        <section className="space-y-10">
           <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Quick Shortcuts</h4>
              <div className="h-px bg-slate-100 flex-1 ml-10" />
           </div>
           <QuickActions />
        </section>

        {/* Clean Footer */}
        <footer className="pt-24 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-12 opacity-40">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
             © 2024 SmartDorm Residences. <br className="sm:hidden" />Premium Lifestyle Operating System.
           </p>
           <div className="flex gap-10">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest cursor-pointer hover:text-primary-600 transition-colors">Support</span>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest cursor-pointer hover:text-primary-600 transition-colors">Privacy</span>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.1em] italic">v3.0.0-AIRBNB</span>
           </div>
        </footer>
      </div>
    </div>
  );
}
