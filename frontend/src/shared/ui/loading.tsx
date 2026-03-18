/**
 * Global Loading / Spinner component.
 * Uses design system color tokens for visual consistency.
 */

interface LoadingProps {
  fullPage?: boolean;
  message?: string;
}

export function Loading({ fullPage = false, message = 'Loading...' }: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-primary-600" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      {content}
    </div>
  );
}

/** Table row skeleton — consistent with design system Skeleton component */
export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded-md bg-slate-100" />
        </td>
      ))}
    </tr>
  );
}
