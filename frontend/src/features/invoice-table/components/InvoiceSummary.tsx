import { Card, Badge } from '@/shared/ui';
import { InvoiceStatus } from '@/entities/invoice/constants';

interface InvoiceSummaryProps {
  totalAmount: number;
  dueDate: string;
  status: InvoiceStatus;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function InvoiceSummary({ totalAmount, dueDate, status }: InvoiceSummaryProps) {
  const isOverdue = status === InvoiceStatus.OVERDUE;

  return (
    <Card className="p-0 overflow-hidden border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row">
      {/* Total Amount Spotlight */}
      <div className="bg-slate-900 p-8 text-white md:w-80 shrink-0">
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${isOverdue ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Amount Due</span>
          </div>
          <p className="text-4xl font-black text-white tabular-nums tracking-tighter leading-none">
            {vndFormatter.format(totalAmount)}
          </p>
        </div>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">Includes Rent, Utilities & Fees</p>
      </div>

      {/* Due Date Info */}
      <div className="p-8 flex-1 bg-white space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Payment Deadline</span>
            <p className={`text-2xl font-black tabular-nums tracking-tighter ${isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
              {dueDate}
            </p>
          </div>
          {isOverdue && (
            <Badge variant="error" className="px-3 py-1 font-black animate-bounce">OVERDUE WARNING</Badge>
          )}
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
           <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg ${isOverdue ? 'bg-rose-100 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
             {isOverdue ? '⚠️' : 'ℹ️'}
           </div>
           <div>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Payment Context</p>
             <p className="text-xs font-bold text-slate-700 leading-tight">
               {isOverdue 
                 ? 'Your payment is late. Penalty fees may apply after 3 days.' 
                 : 'Please ensure payment is processed by the deadline for continued access.'}
             </p>
           </div>
        </div>
      </div>
    </Card>
  );
}
