import { Card, Button, Badge } from '@/shared/ui';
import { DashboardPaymentInfo } from '../types';
import { InvoiceStatus } from '@/entities/invoice/constants';

interface PaymentCardProps {
  payment: DashboardPaymentInfo;
  onPay: () => void;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function PaymentCard({ payment, onPay }: PaymentCardProps) {
  const isOverdue = payment.status === InvoiceStatus.OVERDUE;

  return (
    <Card className={`relative p-10 border-none shadow-premium hover:shadow-hover transition-all duration-700 rounded-[32px] overflow-hidden group ${
      isOverdue ? 'bg-rose-50/30' : 'bg-white'
    }`}>
      {/* Visual background indicator */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 transition-opacity duration-700 ${
        isOverdue ? 'bg-rose-200 opacity-60' : 'bg-primary-100 opacity-20'
      }`} />

      <div className="relative z-10 space-y-10">
        <header className="flex items-start justify-between">
          <div className="space-y-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] block ${
              isOverdue ? 'text-rose-500' : 'text-slate-400'
            }`}>
              {isOverdue ? 'Urgent Settlement' : 'Upcoming Rent'}
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">
                {vndFormatter.format(payment.nextAmount).replace(' ₫', '')}
              </p>
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">VND</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {isOverdue ? (
              <Badge variant="error" className="animate-pulse px-4 py-1.5 font-black text-[9px] uppercase tracking-widest shadow-lg shadow-rose-100 ring-4 ring-white border-none">Urgent</Badge>
            ) : (
              <Badge variant="warning" className="px-4 py-1.5 font-black text-[9px] uppercase tracking-widest ring-4 ring-white border-none opacity-80">Pending</Badge>
            )}
          </div>
        </header>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Due Date</span>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{payment.dueDate}</span>
             </div>
             <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Method</span>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Auto-Debit</span>
             </div>
          </div>

          <Button 
            variant="primary" 
            fullWidth 
            onClick={onPay}
            className={`h-20 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 group-hover:scale-[1.02] shadow-2xl ${
              isOverdue ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-slate-900 hover:bg-slate-800 shadow-primary-100'
            }`}
          >
            {isOverdue ? 'Pay Immediately' : 'Secure Checkout'}
          </Button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 opacity-30 grayscale group-hover:opacity-60 transition-all duration-700">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">256-Bit SSL Secured Session</span>
        </div>
      </div>
    </Card>
  );
}
