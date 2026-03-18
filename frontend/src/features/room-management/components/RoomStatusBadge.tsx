import { Badge } from '@/shared/ui';
import type { RoomStatus } from '../types';

const STATUS_CONFIG: Record<RoomStatus, { variant: 'success' | 'warning' | 'error'; label: string; dotColor: string }> = {
  AVAILABLE: { variant: 'success', label: 'Available', dotColor: 'bg-emerald-500' },
  OCCUPIED: { variant: 'error', label: 'Occupied', dotColor: 'bg-red-500' },
  MAINTENANCE: { variant: 'warning', label: 'Maintenance', dotColor: 'bg-amber-500' },
};

interface RoomStatusBadgeProps {
  status: RoomStatus;
}

export function RoomStatusBadge({ status }: RoomStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant={config.variant} className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </Badge>
  );
}
