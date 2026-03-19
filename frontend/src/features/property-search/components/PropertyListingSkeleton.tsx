import { Card } from '@/shared/ui/Card';
import { Skeleton } from '@/shared/ui/Skeleton';

/**
 * Loading skeleton grid for property discovery.
 */
export function PropertyListingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-10" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <div className="pt-4 flex justify-between">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
