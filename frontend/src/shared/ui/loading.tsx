/**
 * Global Loading / Skeleton component.
 */

interface LoadingProps {
  /** Full-page loading overlay */
  fullPage?: boolean;
  /** Optional loading message */
  message?: string;
}

export function Loading({ fullPage = false, message = 'Loading...' }: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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

/** Table row skeleton placeholder */
export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        </td>
      ))}
    </tr>
  );
}
