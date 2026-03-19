import { InvoiceStatus } from '@/entities/invoice/constants';
import { StatusBadge } from './StatusBadge';

interface InvoiceHeaderProps {
  invoiceId: string;
  status: InvoiceStatus;
  periodStart: string;
  periodEnd: string;
}

export function InvoiceHeader({ invoiceId, status, periodStart, periodEnd }: InvoiceHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap">
            Invoice #{invoiceId.substring(0, 8).toUpperCase()}
          </h1>
          <StatusBadge status={status} className="px-3 py-1 text-[10px] font-black" />
        </div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
          Billing Period: <span className="text-slate-600">{periodStart}</span> — <span className="text-slate-600">{periodEnd}</span>
        </p>
      </div>

      <div className="text-right hidden md:block">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Generated At</p>
        <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('vi-VN')}</p>
      </div>
    </div>
  );
}
