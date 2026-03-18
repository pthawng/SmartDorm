import { Card, Badge, Button, Table } from '@/shared/ui';
import type { TableColumn } from '@/shared/ui/Table';
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

  const sorted = [...invoices].sort((a, b) => {
    const p: Record<string, number> = { OVERDUE: 0, UNPAID: 1, PAID: 2 };
    return (p[a.status] ?? 3) - (p[b.status] ?? 3);
  });

  const columns: TableColumn<InvoiceSummary>[] = [
    {
      key: 'title',
      header: 'Invoice',
      cell: (row) => (
        <span className={row.status === 'OVERDUE' ? 'font-semibold text-red-700' : 'font-medium text-slate-900'}>
          {row.title}
        </span>
      ),
    },
    {
      key: 'due_date',
      header: 'Due Date',
      cell: (row) => <span className="text-slate-600">{dateFormatter.format(new Date(row.due_date))}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      cell: (row) => <span className="font-medium text-slate-900">{vndFormatter.format(row.amount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      cell: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] ?? 'neutral'} className="px-2">
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'action',
      header: '',
      align: 'right',
      cell: (row) => (
        <Button
          variant={row.status === 'OVERDUE' || row.status === 'UNPAID' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => navigate(`${ROUTES.DASHBOARD.INVOICES}/${row.id}`)}
          className={row.status === 'PAID' ? 'text-slate-500' : 'shadow-sm active:scale-[0.98] transition-transform font-medium'}
        >
          {row.status === 'PAID' ? 'View' : 'Pay Now'}
        </Button>
      ),
    },
  ];

  return (
    <Card className="border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Recent Invoices</h3>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}>
          View All
        </Button>
      </div>
      <Table<InvoiceSummary>
        columns={columns}
        data={sorted}
        keyExtractor={(row) => row.id}
        emptyMessage="No recent invoices found."
        className="border-0 shadow-none rounded-none"
      />
    </Card>
  );
}
