import { Button, Card, Badge } from '@/shared/ui';
import type { ContractDraft } from '../types';

interface ReviewStepProps {
  draft: ContractDraft;
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function ReviewStep({ draft, onBack, onConfirm, isSubmitting }: ReviewStepProps) {
  return (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
      <header className="text-center space-y-3">
        <Badge variant="success" className="rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-[0.3em] bg-emerald-50 text-emerald-600">Verification Phase</Badge>
        <h3 className="text-4xl font-display font-black text-slate-900 uppercase tracking-tighter">Review Issuance</h3>
        <p className="text-slate-400 font-medium max-w-lg mx-auto italic">Confirm the details below. Once issued, a legal digital offer will be sent to the prospective tenant.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Room Box */}
        <Card className="p-8 border-none bg-slate-50 relative overflow-hidden group">
           <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">01. Asset</span>
           <div className="mt-4">
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Room {draft.room_number || 'N/A'}</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{draft.property_name}</p>
           </div>
           <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
           </div>
        </Card>

        {/* Tenant Box */}
        <Card className="p-8 border-none bg-slate-50 relative overflow-hidden group">
           <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">02. Recipient</span>
           <div className="mt-4">
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{draft.tenant_name || 'Select Tenant'}</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 truncate">{draft.tenant_email}</p>
           </div>
           <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
           </div>
        </Card>

        {/* Terms Box */}
        <Card className="p-8 border-none bg-slate-900 text-white relative overflow-hidden group">
           <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">03. Financials</span>
           <div className="mt-4">
              <h4 className="text-2xl font-black text-emerald-400 tabular-nums">{vndFormatter.format(draft.monthly_rent)}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{draft.duration_months} Months @ {new Date(draft.start_date).toLocaleDateString()}</p>
           </div>
           <div className="absolute top-0 right-0 p-4 opacity-[0.2] pointer-events-none group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 1.13-1.03 2.03-3 2.03-2.11 0-3-1.05-3.11-2.43H6.01c.1 1.97 1.54 3.42 3.49 3.88V21h3v-2.13c2.06-.37 3.69-1.63 3.69-3.61 0-2.63-2.39-3.72-4.39-4.36z"/></svg>
           </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
         <Button variant="outline" className="w-full sm:w-auto px-12 h-14 rounded-2xl border-2 border-slate-100 font-black text-xs uppercase tracking-widest" onClick={onBack}>
            Modify Terms
         </Button>
         <Button 
           variant="primary" 
           className="w-full sm:w-auto px-16 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 font-black text-xs uppercase tracking-widest"
           onClick={onConfirm}
           isLoading={isSubmitting}
         >
            Send Official Offer
         </Button>
      </div>
    </div>
  );
}
