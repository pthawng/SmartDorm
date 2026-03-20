import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { useTenantDashboard } from '../hooks/useTenantDashboard';
import { WelcomeHeader } from './WelcomeHeader';
import { CurrentStayCard } from './CurrentStayCard';
import { PaymentCard } from './PaymentCard';
import { MaintenanceList } from './MaintenanceList';
import { QuickActions } from './QuickActions';
import { Loading, ErrorState } from '@/shared/ui';
import { LifecycleTimeline } from '@/features/contract-lifecycle/components/LifecycleTimeline';
import { CONTRACT_STATUS_MAP } from '@/entities/contract/utils/status-mapper';
import { ContractStatus } from '@/entities/contract';
import { Button } from '@/shared/ui';

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

  // Check if there is an active lease or a pending one
  const activeContract = dashboardData.stay.contract;
  const isLeaseInProgress = activeContract && activeContract.status !== ContractStatus.ACTIVE;
  const statusTheme = activeContract ? CONTRACT_STATUS_MAP[activeContract.status] : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Soft Background Accents */}
      <div className="fixed top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary-50/30 blur-[120px] rounded-full opacity-60 translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-screen-2xl mx-auto py-16 md:py-24 px-6 lg:px-12 space-y-20 md:space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* 1. Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-12">
          <WelcomeHeader name={dashboardData.tenantName} />
        </header>

        {/* 2. Lifecycle High-Fidelity Alert (If Lease in Progress) */}
        {isLeaseInProgress && activeContract && (
           <section className="space-y-10 animate-in slide-in-from-right-10 duration-700">
              <div className="flex items-center gap-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Action Required</h4>
                 <div className="h-px bg-emerald-100 flex-1" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 <div className="lg:col-span-2">
                    <LifecycleTimeline currentStatus={activeContract.status} />
                 </div>
                 <div className="flex flex-col justify-center p-10 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Next Step</span>
                       <h3 className="text-2xl font-black">{statusTheme?.label}</h3>
                       <p className="text-slate-400 font-medium italic text-xs leading-relaxed">{statusTheme?.hint}</p>
                       
                       {activeContract.status === ContractStatus.PENDING_SIGNATURE && (
                         <Button 
                           variant="primary" 
                           fullWidth 
                           className="h-12 rounded-2xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest"
                           onClick={() => navigate(ROUTES.DASHBOARD.CONTRACT_REVIEW(activeContract.id))}
                         >
                            Review & Sign Digital Lease
                         </Button>
                       )}

                       {activeContract.status === ContractStatus.SIGNED && (
                         <Button 
                           variant="primary" 
                           fullWidth 
                           className="h-12 rounded-2xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest border-none shadow-lg shadow-emerald-500/20"
                           onClick={() => navigate(ROUTES.DASHBOARD.CONTRACT_PAY_DEPOSIT(activeContract.id))}
                         >
                            Pay Security Deposit
                         </Button>
                       )}

                       {activeContract.status === ContractStatus.DEPOSIT_PAID && (
                          <div className="flex items-center gap-3 py-3 px-4 bg-white/5 rounded-xl">
                             <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Awaiting Landlord Confirmation</span>
                          </div>
                       )}
                    </div>
                    <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                 </div>
              </div>
           </section>
        )}

        {/* 3. Hero Section: Current Stay */}
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Your Current Residence</h4>
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
              payment={dashboardData.upcomingInvoice} 
              onPay={() => navigate(ROUTES.DASHBOARD.INVOICE_PAY(dashboardData.upcomingInvoice?.id || ''))} 
            />
          </section>

          <section className="space-y-8 h-full">
            <div className="flex items-center gap-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 flex-shrink-0">Home Service</h4>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
            <MaintenanceList 
              requests={dashboardData.activeIssues} 
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
      </div>
    </div>
  );
}
