import { Badge } from '@/shared/ui';
import { ContractStatus } from '@/entities/contract';
import { cn } from '@/shared/utils/cn';

interface ContractStatusBadgeProps {
  status: ContractStatus;
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const config = {
    [ContractStatus.DRAFT]: { label: 'Draft', variant: 'info' as const },
    [ContractStatus.ACTIVE]: { label: 'Active', variant: 'success' as const },
    [ContractStatus.TERMINATED]: { label: 'Terminated', variant: 'error' as const },
    [ContractStatus.EXPIRED]: { label: 'Expired', variant: 'warning' as const },
  };

  const { label, variant } = config[status];

  const dotColors = {
    [ContractStatus.DRAFT]: 'bg-sky-500',
    [ContractStatus.ACTIVE]: 'bg-emerald-500',
    [ContractStatus.TERMINATED]: 'bg-rose-500',
    [ContractStatus.EXPIRED]: 'bg-amber-500',
  };

  return (
    <Badge variant={variant} className="capitalize gap-1.5 flex items-center">
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[status])} />
      {label}
    </Badge>
  );
}
