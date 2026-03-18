import { Badge } from '@/shared/ui';
import type { PropertyStatus } from '../types';

const STATUS_VARIANT: Record<PropertyStatus, 'success' | 'neutral'> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
};

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
}

export function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="px-2 text-[11px] uppercase tracking-wider">
      {status}
    </Badge>
  );
}
