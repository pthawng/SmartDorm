/**
 * Standardized Empty State component.
 * Used when a list/table has zero results.
 */

import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = 'No data found',
  description = 'There are no items to display right now.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
      {icon && <div className="text-gray-400">{icon}</div>}
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
