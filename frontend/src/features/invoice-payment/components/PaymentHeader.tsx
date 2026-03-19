import { InvoiceStatus } from '@/entities/invoice/constants';
import { StatusBadge } from '@/features/invoice-table/components/StatusBadge';

interface PaymentHeaderProps {
  invoiceId: string;
  status: InvoiceStatus;
}

export function PaymentHeader({ invoiceId, status }: PaymentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
           <div className="h-8 w-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-black">01</div>
           <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">Checkout Initiation</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap">
            Authorize Payment
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
            Order Reference: <span className="text-slate-600">SMART-{invoiceId.substring(0, 6).toUpperCase()}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <StatusBadge status={status} className="px-2 py-0 text-[8px] font-black" />
          </p>
        </div>
      </div>

      <div className="text-right hidden md:block">
         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="text-right">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Level</p>
               <p className="text-xs font-black text-emerald-600 uppercase mt-1">Tier-1 Encrypted</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
         </div>
      </div>
    </div>
  );
}
