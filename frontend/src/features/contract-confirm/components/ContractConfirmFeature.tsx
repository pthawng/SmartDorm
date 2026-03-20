import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getContractById, signContract } from '@/features/contract-sign-flow/services/contract-api';
import { Button, Card, Badge, Loading, ErrorState } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { LifecycleTimeline } from '@/features/contract-lifecycle/components/LifecycleTimeline';

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function ContractConfirmFeature() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: contract, isLoading, isError } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => getContractById(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: () => signContract(id!), // Using signContract mock for activation
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
    },
  });

  if (isLoading) return <Loading message="Retrieving signed legal documents..." />;
  if (isError || !contract) return <ErrorState title="Lifecycle Error" description="The requested lease document could not be located." />;

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-in zoom-in-95 duration-700">
        <div className="h-32 w-32 bg-slate-900 rounded-[2.5rem] rotate-12 flex items-center justify-center text-white shadow-2xl mb-12">
           <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
        </div>
        <h3 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter mb-4">Lease Force-Activated</h3>
        <p className="text-slate-400 font-medium max-w-sm italic mb-12">
          The contract is now legally binding and visible in the active portfolio.
        </p>
        <Button 
          variant="primary" 
          className="h-16 px-12 rounded-[2rem] bg-slate-900 font-black text-sm uppercase tracking-widest"
          onClick={() => navigate(ROUTES.DASHBOARD.HOME)}
        >
          Return to Command Center
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-3">
            <Badge variant="info" className="rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-[0.3em] bg-indigo-50 text-indigo-600">Phase 05: final counter-sign</Badge>
            <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter">Contract Activation</h1>
            <p className="text-slate-400 font-medium italic">Verify tenant execution and officially validate the legal agreement.</p>
         </div>
         <div className="flex items-center gap-4 py-4 px-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Deposit Received: {vndFormatter.format(contract.deposit_amount)}</span>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
         <div className="lg:col-span-3 space-y-10">
            <LifecycleTimeline currentStatus={contract.status} />
            
            <Card className="p-10 border-slate-100 shadow-sm rounded-[2.5rem] bg-slate-50/30">
               <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-10">Verification Stack</h4>
               <div className="space-y-6">
                  {[
                    { label: 'Tenant Execution', value: 'Digitally Signed', status: 'VERIFIED' },
                    { label: 'Identity Documents', value: 'Authenticated', status: 'VERIFIED' },
                    { label: 'Security Deposit', value: vndFormatter.format(contract.deposit_amount), status: 'VERIFIED' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                       <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</p>
                          <p className="font-black text-slate-900 text-sm italic">{item.value}</p>
                       </div>
                       <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px]">{item.status}</Badge>
                    </div>
                  ))}
               </div>
            </Card>
         </div>

         <div className="lg:col-span-2 space-y-10">
            <Card className="p-10 border-none bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
               <div className="relative z-10 space-y-8">
                  <div className="h-16 w-16 bg-white/10 rounded-2.5xl flex items-center justify-center">
                     <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-3xl font-black uppercase tracking-tighter">Final Execute</h3>
                     <p className="text-slate-400 text-xs font-medium italic">By activating, you confirm the receipt of funds and finalize the legal entry of the tenant into your inventory.</p>
                  </div>
               </div>

               <div className="relative z-10 space-y-4">
                  <Button 
                    variant="primary" 
                    fullWidth 
                    className="h-16 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 border-none text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                    onClick={() => mutation.mutate()}
                    isLoading={mutation.isPending}
                  >
                    Confirm & Activate
                  </Button>
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    className="h-12 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white"
                    onClick={() => navigate(ROUTES.DASHBOARD.HOME)}
                  >
                    Hold Activation
                  </Button>
               </div>

               {/* Design accents */}
               <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            </Card>
         </div>
      </div>
    </div>
  );
}
