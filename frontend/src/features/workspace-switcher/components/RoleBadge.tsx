import { Badge } from '@/shared/ui';
import type { WorkspaceRole } from '../types';

interface RoleBadgeProps {
  role: WorkspaceRole;
}

const ROLE_MAP: Record<WorkspaceRole, { variant: 'success' | 'info' | 'neutral', label: string }> = {
  OWNER: { variant: 'success', label: 'Owner' },
  MANAGER: { variant: 'info', label: 'Manager' },
  STAFF: { variant: 'neutral', label: 'Staff' },
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = ROLE_MAP[role];
  return (
    <Badge variant={config.variant} className="text-[10px] uppercase tracking-wider px-2 py-0.5">
      {config.label}
    </Badge>
  );
}
