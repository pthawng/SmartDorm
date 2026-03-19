import { Link } from 'react-router-dom';
import { Card, Loading, ErrorState, Button } from '@/shared/ui';
import { StatusBadge } from './StatusBadge';
import { useInvoices } from '../hooks/useInvoices';
import { ROUTES } from '@/shared/config/routes';

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function InvoiceTable() {
  const { data: invoices, isLoading, isError } = useInvoices();

  if (isLoading) return <Loading message="Syncing financial records..." />;
  if (isError) return <ErrorState title="Database Connection Error" description="Unable to load current billing cycle data." />;

  return (
    <Card className="p-0 overflow-hidden border-slate-200 shadow-xl shadow-slate-100/50">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Billing & Invoices</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Cycle: April 2026</p>
        </div>
        <Button variant="outline" size="sm" className="font-black text-[10px] uppercase tracking-widest">
           Summary Report
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recipient / Room</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Due Date</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
              <th className="px-8 py-5 text-right w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 overflow-hidden">
            {invoices?.map((invoice) => (
              <tr key={invoice.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                <td className="px-8 py-6">
                  <StatusBadge status={invoice.status} className="px-3 py-1 font-black text-[9px]" />
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <p className="font-black text-slate-900 tracking-tight text-sm leading-none">{invoice.renter_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{invoice.room_name}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <p className="text-xs font-bold text-slate-700 tabular-nums uppercase">{invoice.due_date}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-black text-slate-900 tabular-nums tracking-tighter">
                    {vndFormatter.format(invoice.amount_due)}
                  </p>
                </td>
                <td className="px-8 py-6 text-right">
                   <Link 
                     to={ROUTES.DASHBOARD.INVOICE_DETAIL(invoice.id)}
                     className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-primary-500 hover:text-white transition-all shadow-sm border border-slate-100"
                   >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                     </svg>
                   </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
