import { Card, Badge, Button, Table } from '@/shared/ui';
import type { TableColumn } from '@/shared/ui/Table';
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

  const columns: TableColumn<RecentTransaction>[] = [
    {
      key: 'tenantName',
      header: 'Tenant',
      cell: (row) => (
        <span className={row.status === 'OVERDUE' ? 'font-semibold text-red-700' : 'font-medium text-slate-900'}>
          {row.tenantName}
        </span>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Room',
      cell: (row) => <span className="text-slate-600">{row.roomNumber}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      cell: (row) => <span className="font-medium text-slate-900">{vndFormatter.format(row.amount)}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      cell: (row) => <span className="text-slate-600">{dateFormatter.format(new Date(row.date))}</span>,
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
  ];

  return (
    <Card className="border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}>
          View All Invoices
        </Button>
      </div>
      <Table<RecentTransaction>
        columns={columns}
        data={transactions}
        keyExtractor={(row) => row.id}
        emptyMessage="No recent transactions. Invoices and payments will appear here."
        className="border-0 shadow-none rounded-none"
      />
    </Card>
  );
}
