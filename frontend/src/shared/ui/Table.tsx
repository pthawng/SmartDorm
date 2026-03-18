import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

// ── Column definition ────────────────────────────────────────
export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string | undefined;
}

/**
 * Generic, reusable Table for Dashboard data.
 * Supports custom cell renderers, loading skeletons, and row click.
 */
export function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyMessage = 'No data found.',
  className,
  onRowClick,
  rowClassName,
}: TableProps<T>) {
  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <div className={cn('w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          {/* Head */}
          <thead className="border-b border-slate-100 bg-slate-50/80">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'h-12 px-4 font-semibold text-xs uppercase tracking-wide text-slate-500',
                    alignClass[col.align ?? 'left'],
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-3">
                        <div
                          className="h-4 rounded-md bg-slate-100 animate-pulse"
                          style={{ width: `${60 + Math.random() * 30}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : data.length === 0
                ? (
                  <tr>
                    <td colSpan={columns.length} className="h-40 text-center text-sm text-slate-500">
                      {emptyMessage}
                    </td>
                  </tr>
                )
                : data.map((row, i) => (
                  <tr
                    key={keyExtractor(row, i)}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'group transition-colors hover:bg-slate-50/80',
                      onRowClick && 'cursor-pointer',
                      rowClassName?.(row),
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={cn(
                          'px-4 py-3 text-slate-700',
                          alignClass[col.align ?? 'left'],
                          col.className,
                        )}
                      >
                        {col.cell
                          ? col.cell(row)
                          : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
