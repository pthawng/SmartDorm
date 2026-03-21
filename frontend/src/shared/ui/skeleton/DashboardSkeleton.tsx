import { Skeleton } from '@/shared/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col h-72">
               <Skeleton className="h-32 w-full rounded-none" />
               <div className="p-5 space-y-4 flex-1">
                 <Skeleton className="h-5 w-3/4" />
                 <Skeleton className="h-4 w-1/2" />
                 <div className="flex gap-2 pt-4 mt-auto">
                   <Skeleton className="h-8 w-20 rounded-lg" />
                   <Skeleton className="h-8 w-24 rounded-lg" />
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
