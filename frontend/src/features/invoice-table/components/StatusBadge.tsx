import { InvoiceStatus } from '@/entities/invoice/constants';
import { Badge } from '@/shared/ui';

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    [InvoiceStatus.PAID]: { variant: 'success' as const, label: 'PAID' },
    [InvoiceStatus.PENDING]: { variant: 'warning' as const, label: 'PENDING' },
    [InvoiceStatus.OVERDUE]: { variant: 'error' as const, label: 'OVERDUE' },
    [InvoiceStatus.CANCELLED]: { variant: 'neutral' as const, label: 'CANCELLED' },
  };

  const { variant, label } = config[status] || { variant: 'neutral', label: status };

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
