import { Card, Button } from '@/shared/ui';
import { DashboardPaymentInfo } from '../types';
import { InvoiceStatus } from '@/entities/invoice/constants';
import { CreditCard, Calendar, ArrowRight } from 'lucide-react';
import { StatusDot } from '@/shared/ui/StatusDot';

interface PaymentCardProps {
  payment: DashboardPaymentInfo;
  onPay: () => void;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

/**
 * Airbnb-style 'Payment Spotlight' — emphasizes financial status & actions.
 * Large format cards with clear status indicators and bold CTAs.
 */
export function PaymentCard({ payment, onPay }: PaymentCardProps) {
  const isOverdue = payment.status === InvoiceStatus.OVERDUE;
  const isPending = payment.status === InvoiceStatus.PENDING;

  return (
    <Card className="relative p-10 border-none shadow-[0_32px_80px_-16px_rgba(0,0,0,0.06)] rounded-[2.5rem] bg-white group transition-all duration-500 hover:shadow-[0_48px_100px_-16px_rgba(0,0,0,0.1)]">
      <div className="space-y-10">
        <header className="flex items-start justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
              Financial Status
            </span>
            <div className="flex items-center gap-3">
              <StatusDot 
                status={isOverdue ? 'error' : isPending ? 'warning' : 'success'} 
                pulse={isOverdue} 
              />
              <span className={`text-sm font-black uppercase tracking-widest ${
                isOverdue ? 'text-rose-500' : isPending ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {payment.status}
              </span>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
            <CreditCard className="w-5 h-5" />
          </div>
        </header>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Due</span>
          <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
            {vndFormatter.format(payment.nextAmount)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-50">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Next Due Date</span>
              <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {payment.dueDate}
              </span>
            </div>
          </div>

          <Button 
            variant="primary" 
            fullWidth 
            onClick={onPay}
            className={`h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] group-hover:scale-[1.02] transition-all shadow-xl ${
              isOverdue ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              Pay Now <ArrowRight className="w-3 h-3 pt-0.5" />
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
