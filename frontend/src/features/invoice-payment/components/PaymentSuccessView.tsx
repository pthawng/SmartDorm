import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/shared/ui';
import { PaymentReference } from '../types';
import { ROUTES } from '@/shared/config/routes';

interface PaymentSuccessViewProps {
  reference: PaymentReference;
  amount: number;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function PaymentSuccessView({ reference, amount }: PaymentSuccessViewProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 animate-in fade-in zoom-in-95 duration-700">
      <Card className="p-0 overflow-hidden border-emerald-100 shadow-2xl shadow-emerald-100/50">
        <div className="bg-emerald-600 p-12 text-center text-white space-y-6 relative overflow-hidden">
          {/* Abstract background pulse */}
          <div className="absolute inset-0 bg-emerald-500 animate-pulse opacity-50 scale-150 rotate-12 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="h-24 w-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tight">Payment Settled</h2>
              <p className="text-emerald-100 font-bold uppercase tracking-[0.2em] text-[10px]">Transaction successfully authorized</p>
            </div>
          </div>
        </div>

        <div className="p-10 bg-white space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount Paid</span>
              <p className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">
                {vndFormatter.format(amount)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Method</span>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {reference.method.replace('_', ' ')}
              </p>
            </div>
            <div className="space-y-1 col-span-2 pt-4 border-t border-slate-50">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Network ID Reference</span>
              <p className="text-xs font-bold text-slate-600 font-mono tracking-widest leading-none">
                {reference.transactionId}
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
             <Button 
               variant="primary" 
               fullWidth 
               onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}
               className="h-16 font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 border-emerald-500 shadow-emerald-100"
             >
               Return to Dashboard
             </Button>
             <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest italic">
               A digital receipt has been dispatched to your registered workspace email.
             </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
