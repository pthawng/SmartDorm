import { Card, Badge, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { useNavigate } from 'react-router-dom';
import type { RecentTransaction } from '../types';

interface RecentTransactionsTableProps {
  transactions: RecentTransaction[];
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
  PENDING: 'warning',
  OVERDUE: 'error',
};

export function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-slate-200">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}>
          View All Invoices
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Tenant</th>
              <th scope="col" className="px-6 py-3 font-medium">Room</th>
              <th scope="col" className="px-6 py-3 font-medium text-right">Amount</th>
              <th scope="col" className="px-6 py-3 font-medium">Date</th>
              <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-900">No recent transactions</p>
                    <p className="mt-1 text-xs text-slate-500">Invoices and payments will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className={tx.status === 'OVERDUE' ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-slate-50/80 transition-colors'}
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    {tx.tenantName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {tx.roomNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-900">
                    {vndFormatter.format(tx.amount)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {dateFormatter.format(new Date(tx.date))}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <Badge variant={STATUS_VARIANT[tx.status] ?? 'neutral'} className="px-2">
                      {tx.status}
                    </Badge>
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
