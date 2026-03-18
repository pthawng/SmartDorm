import { Card, Badge, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { useNavigate } from 'react-router-dom';
import type { InvoiceSummary } from '../types';

interface RecentInvoicesTableProps {
  invoices: InvoiceSummary[];
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
  PAID: 'success',
  UNPAID: 'warning',
  OVERDUE: 'error',
};

export function RecentInvoicesTable({ invoices }: RecentInvoicesTableProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-slate-200">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Recent Invoices</h3>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}>
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Invoice</th>
              <th scope="col" className="px-6 py-3 font-medium">Due Date</th>
              <th scope="col" className="px-6 py-3 font-medium text-right">Amount</th>
              <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
              <th scope="col" className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No recent invoices found.
                </td>
              </tr>
            ) : (
              [...invoices]
                .sort((a, b) => {
                  const p = { OVERDUE: 0, UNPAID: 1, PAID: 2 };
                  return (p[a.status] ?? 3) - (p[b.status] ?? 3);
                })
                .map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    className={
                      invoice.status === 'OVERDUE' 
                        ? 'bg-red-50/50 hover:bg-red-50 transition-colors' 
                        : 'hover:bg-slate-50/80 transition-colors'
                    }
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                      {invoice.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {dateFormatter.format(new Date(invoice.due_date))}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-900">
                      {vndFormatter.format(invoice.amount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <Badge variant={STATUS_VARIANT[invoice.status] ?? 'neutral'} className="px-2">
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Button
                        variant={invoice.status === 'OVERDUE' || invoice.status === 'UNPAID' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => navigate(`${ROUTES.DASHBOARD.INVOICES}/${invoice.id}`)}
                        className={invoice.status === 'PAID' ? 'text-slate-500' : 'shadow-sm active:scale-[0.98] transition-transform font-medium'}
                      >
                        {invoice.status === 'PAID' ? 'View' : 'Pay Now'}
                      </Button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
