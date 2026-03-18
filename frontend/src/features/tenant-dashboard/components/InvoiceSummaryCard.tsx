import { Card, CardContent, Button, Badge } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/utils';
import type { InvoiceSummary } from '../types';

interface InvoiceSummaryCardProps {
  invoice: InvoiceSummary | null;
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

/**
 * InvoiceSummaryCard - Highlights the most urgent outstanding invoice.
 */
export function InvoiceSummaryCard({ invoice }: InvoiceSummaryCardProps) {
  const navigate = useNavigate();

  if (!invoice) {
    return (
      <Card className="h-full border-slate-200">
        <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
          <div className="mb-3 rounded-full bg-emerald-50 p-3 text-emerald-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-900">All caught up!</p>
          <p className="mt-1 text-xs text-slate-500">You have no upcoming invoices.</p>
        </CardContent>
      </Card>
    );
  }

  const isOverdue = invoice.status === 'OVERDUE';
  const isUnpaid = invoice.status === 'UNPAID';

  return (
    <Card className={cn(
      "h-full overflow-hidden transition-colors",
      isOverdue ? "border-red-200 shadow-md shadow-red-100/50" : "border-slate-200"
    )}>
      <div className={cn(
        "p-5 border-b flex justify-between items-start",
        isOverdue ? "bg-red-50/50 border-red-100" : "bg-white border-slate-100"
      )}>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Upcoming Payment</h3>
          <p className={cn(
            "mt-1 text-2xl font-bold font-display",
            isOverdue ? "text-red-700" : "text-slate-900"
          )}>
            {vndFormatter.format(invoice.amount)}
          </p>
        </div>
        <Badge variant={isOverdue ? 'error' : 'warning'} className="px-2.5 py-1 text-xs">
          {invoice.status}
        </Badge>
      </div>

      <CardContent className="p-5 flex flex-col justify-between h-[calc(100%-89px)]">
        <div>
          <p className="font-medium text-slate-900">{invoice.title}</p>
          <p className="text-sm text-slate-500 mt-1">
            Due by {dateFormatter.format(new Date(invoice.due_date))}
          </p>
          
          {isOverdue && (
            <div className="mt-3 flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium">Please pay immediately to avoid late fees.</p>
            </div>
          )}
        </div>

        <Button
          variant={isOverdue || isUnpaid ? 'primary' : 'outline'}
          size="lg"
          className="w-full mt-6 shadow-sm transition-transform active:scale-[0.98] font-semibold"
          onClick={() => navigate(`${ROUTES.DASHBOARD.INVOICES}/${invoice.id}`)}
        >
          Pay Now
        </Button>
      </CardContent>
    </Card>
  );
}
