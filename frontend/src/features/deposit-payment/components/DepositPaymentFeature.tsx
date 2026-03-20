import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Loading, ErrorState } from '@/shared/ui';
import { useDepositPayment } from '../hooks/useDepositPayment';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/utils';

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function DepositPaymentFeature({ contractId }: { contractId: string }) {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'QR' | 'BANK' | 'CARD'>('QR');
  
  const { 
    contract, 
    isLoading, 
    isError, 
    isSubmitting, 
    isSuccess, 
    onPay 
  } = useDepositPayment(contractId);

  const handleGoDashboard = () => {
    navigate(ROUTES.DASHBOARD.TENANT_HOME);
  };

  if (isLoading) return <Loading message="Preparing secure payment gateway..." />;
  if (isError || !contract) return <ErrorState title="Lifecycle Error" description="This contract cannot be activated at this time." />;

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-in zoom-in-95 duration-700">
        <div className="h-32 w-32 bg-emerald-500 rounded-[2.5rem] rotate-12 flex items-center justify-center text-white shadow-2xl shadow-emerald-200 mb-12">
           <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
           </svg>
        </div>
        <h3 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter mb-4">Contract Active</h3>
        <p className="text-slate-400 font-medium max-w-sm italic mb-12">
          Payment confirmed. Your lease is now legally active and visible in your tenant dashboard.
        </p>
        <Button 
          variant="primary" 
          className="h-16 px-12 rounded-[2rem] bg-slate-900 font-black text-sm uppercase tracking-widest"
          onClick={handleGoDashboard}
        >
          Enter Tenant Portal
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-3">
        <Badge variant="success" className="rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-[0.3em] bg-emerald-50 text-emerald-600">Phase 04: Financial Execution</Badge>
        <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter">Security Deposit</h1>
        <p className="text-slate-400 font-medium max-w-lg mx-auto italic">Execute payment to activate your legal lease agreement and secure your unit.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Payment Methods */}
        <div className="md:col-span-3 space-y-8">
           <section className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Select Protocol</h4>
              <div className="grid grid-cols-1 gap-4">
                 {[ 
                   { id: 'QR', label: 'E-Wallet QR', desc: 'Momo, ZaloPay, VNPay' },
                   { id: 'BANK', label: 'Direct Transfer', desc: 'Secure Bank-to-Bank' },
                   { id: 'CARD', label: 'Credit/Debit', desc: 'Visa, Mastercard, JCB' }
                 ].map(m => (
                   <button 
                     key={m.id}
                     onClick={() => setMethod(m.id as any)}
                     className={cn(
                       "flex items-center gap-6 p-6 rounded-[1.5rem] border-2 transition-all text-left",
                       method === m.id 
                         ? "border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100" 
                         : "border-slate-100 hover:border-slate-200"
                     )}
                   >
                      <div className={cn(
                        "h-6 w-6 rounded-full border-4 flex items-center justify-center",
                        method === m.id ? "border-emerald-600 bg-white" : "border-slate-200"
                      )}>
                         {method === m.id && <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                      </div>
                      <div>
                         <p className="font-black text-slate-900 uppercase text-xs tracking-wider">{m.label}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{m.desc}</p>
                      </div>
                   </button>
                 ))}
              </div>
           </section>

           <Button 
             variant="primary" 
             fullWidth 
             className="h-16 rounded-[2rem] bg-slate-900 shadow-2xl font-black text-sm uppercase tracking-widest"
             onClick={() => onPay()}
             isLoading={isSubmitting}
           >
              Confirm & Activate Lease
           </Button>
        </div>

        {/* Amount Card */}
        <div className="md:col-span-2">
           <Card className="p-10 border-none bg-slate-900 text-white rounded-[2.5rem] shadow-2xl shadow-slate-300 relative overflow-hidden group">
              <div className="relative z-10 space-y-10">
                 <div className="space-y-1">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Total Required</span>
                    <h2 className="text-4xl font-black tabular-nums">{vndFormatter.format(contract.deposit_amount)}</h2>
                 </div>

                 <div className="space-y-6 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-[9px]">Base Deposit</span>
                       <span className="font-bold text-xs">{vndFormatter.format(contract.deposit_amount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-[9px]">Activation Fee</span>
                       <span className="font-bold text-xs text-emerald-400">WAIVED</span>
                    </div>
                 </div>

                 <div className="pt-8 text-center bg-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Security Certificate</p>
                    <div className="flex justify-center gap-4 text-emerald-400/50">
                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 18c-3.75-1.02-6-4.99-6-8.91V6.3l6-2.25 6 2.25v4.79c0 3.92-2.25 7.89-6 8.91z"/></svg>
                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                    </div>
                 </div>
              </div>

              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 h-48 w-48 bg-slate-800/50 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />
           </Card>
        </div>
      </div>
    </div>
  );
}
