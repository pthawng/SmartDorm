import { InvoiceItem } from '@/entities/invoice/types';
import { Card } from '@/shared/ui';

interface PaymentBreakdownProps {
  items: InvoiceItem[];
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function PaymentBreakdown({ items }: PaymentBreakdownProps) {
  const total = items.reduce((acc, item) => acc + item.amount, 0);

  return (
    <Card className="p-6 bg-slate-50/50 border-slate-200 space-y-6">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Summary</h3>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span className="font-bold text-slate-600">{item.description}</span>
            <span className="font-black text-slate-900 tabular-nums">{vndFormatter.format(item.amount)}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-200 border-dashed flex justify-between items-end">
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subtotal</span>
         <span className="text-xl font-black text-slate-900 tabular-nums">{vndFormatter.format(total)}</span>
      </div>
    </Card>
  );
}
