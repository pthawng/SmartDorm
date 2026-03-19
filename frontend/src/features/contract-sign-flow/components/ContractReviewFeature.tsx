import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Loading, ErrorState, Button, Card } from '@/shared/ui';
import { useContractReview } from '../hooks/useContractReview';
import { ContractSummary } from './ContractSummary';
import { RenterInfo } from './RenterInfo';
import { RoomInfo } from './RoomInfo';
import { TermsSection } from './TermsSection';
import { SignatureSection } from './SignatureSection';
import { ROUTES } from '@/shared/config/routes';

export function ContractReviewFeature() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);
  
  const { 
    contract, 
    isLoading, 
    isError, 
    isSubmitting,
    isSuccess,
    onActivate 
  } = useContractReview(id || '');

  const handleEdit = () => {
    navigate(ROUTES.DASHBOARD.CONTRACT_APPLY);
  };

  const handleGoDashboard = () => {
    navigate(ROUTES.DASHBOARD.TENANT_HOME);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <Loading message="Fetching legal document for review..." />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25" />
          <div className="relative h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-200">
             <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
             </svg>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Contract Executed</h2>
          <p className="text-slate-500 font-medium"> The lease agreement is now legally active. All parties have been notified via secure digital channels.</p>
        </div>

        <Card className="p-6 bg-slate-50 border-slate-200">
           <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              <span>Reference ID</span>
              <span className="text-slate-900">{id?.substring(0, 8).toUpperCase()}</span>
           </div>
           <Button variant="primary" fullWidth onClick={handleGoDashboard}>
              Return to Contract Portal
           </Button>
        </Card>
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <ErrorState 
          title="Document Not Found" 
          description="We couldn't retrieve the contract requested for signature. It may have expired or been deleted."
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <span className="text-primary-600 font-black text-[10px] uppercase tracking-[0.3em]">Signature Portal</span>
        <h1 className="text-4xl font-display font-black tracking-tighter text-slate-900 uppercase">Review & Execute Lease</h1>
        <p className="text-slate-500 font-medium italic text-sm">Please cross-verify all identity and financial data before final activation.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
        <div className="space-y-10">
          <section className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">01. Asset & Pricing</h2>
                <span className="h-px bg-slate-100 flex-1 ml-6" />
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <RoomInfo roomId={contract.room_id} />
                </div>
                <div className="lg:col-span-2">
                  <ContractSummary 
                    rent={contract.monthly_rent} 
                    deposit={contract.deposit_amount}
                    startDate={contract.start_date}
                    endDate={contract.end_date}
                    onEdit={handleEdit}
                  />
                </div>
             </div>
          </section>

          <section className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">02. Tenant Verification</h2>
                <span className="h-px bg-slate-100 flex-1 ml-6" />
             </div>
             <RenterInfo 
               fullName={contract.tenant.full_name}
               phone={contract.tenant.phone}
               idNumber={contract.tenant.id_number}
               email={contract.tenant.email}
               onEdit={handleEdit}
             />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t-4 border-slate-900">
             <TermsSection />
             <div className="flex flex-col justify-center">
               <SignatureSection 
                 isAgreed={isAgreed}
                 onAgreedChange={setIsAgreed}
                 onSubmit={onActivate}
                 isSubmitting={isSubmitting}
               />
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
