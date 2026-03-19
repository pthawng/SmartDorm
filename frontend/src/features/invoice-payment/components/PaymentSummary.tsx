import { Card, Badge } from '@/shared/ui';
import { InvoiceStatus } from '@/entities/invoice/constants';

interface PaymentSummaryProps {
  totalAmount: number;
  dueDate: string;
  status: InvoiceStatus;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function PaymentSummary({ totalAmount, dueDate, status }: PaymentSummaryProps) {
  const isOverdue = status === InvoiceStatus.OVERDUE;

  return (
    <Card className={`p-0 overflow-hidden border-slate-200 shadow-2xl shadow-slate-100/50 flex flex-col sm:flex-row transition-all duration-700 ${
      isOverdue ? 'ring-2 ring-rose-500 ring-offset-4' : ''
    }`}>
      {/* Total Amount Spotlight */}
      <div className={`p-10 text-white sm:w-3/5 shrink-0 flex flex-col justify-center relative overflow-hidden transition-colors duration-700 ${
        isOverdue ? 'bg-rose-950' : 'bg-slate-900'
      }`}>
        {/* Decorative background glow */}
        <div className={`absolute -inset-24 opacity-30 blur-3xl rounded-full pointer-events-none ${
          isOverdue ? 'bg-rose-500 animate-pulse' : 'bg-primary-500'
        }`} />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${isOverdue ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {isOverdue ? 'Urgent Settlement Required' : 'Total Settlement Due'}
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <p className="text-7xl font-black text-white tabular-nums tracking-tighter leading-none drop-shadow-2xl">
              {vndFormatter.format(totalAmount).replace(' ₫', '')}
            </p>
            <span className={`text-2xl font-black uppercase tracking-widest ${isOverdue ? 'text-rose-500' : 'text-slate-500'}`}>VND</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Final balance confirmed by workspace admin</p>
        </div>
      </div>

      {/* Due Date Info */}
      <div className="p-10 flex-1 bg-slate-50 space-y-6 flex flex-col justify-center border-l border-slate-100">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Payment Deadline</span>
            <p className={`text-3xl font-black tabular-nums tracking-tighter ${isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
              {dueDate}
            </p>
          </div>
        </div>

        {isOverdue ? (
           <div className="space-y-3">
              <Badge variant="error" className="px-4 py-2 font-black text-xs animate-pulse ring-4 ring-rose-50 ring-offset-1">OVERDUE NOTICE</Badge>
              <p className="text-[10px] text-rose-500 font-bold leading-relaxed">
                Late fee accumulation has commenced. Continued delinquency may result in service interruption.
              </p>
           </div>
        ) : (
           <Badge variant="success" className="px-4 py-2 font-black text-xs opacity-80 ring-4 ring-emerald-50 ring-offset-1">ACTIVE CYCLE</Badge>
        )}
      </div>
    </Card>
  );
}
