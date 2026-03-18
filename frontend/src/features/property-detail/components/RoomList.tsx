import { Card, CardContent, EmptyState, Skeleton } from '@/shared/ui';
import type { RoomData } from '@/entities/room';
import { RoomCard } from './RoomCard';

interface RoomListProps {
  rooms: RoomData[];
  isLoading?: boolean;
  onViewRoom: (id: string) => void;
}

/**
 * Room loading skeleton — matches RoomCard layout.
 */
function RoomCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  );
}

/**
 * RoomList — sticky side panel listing available rooms.
 * Shows skeleton when rooms are loading.
 */
export function RoomList({ rooms, isLoading, onViewRoom }: RoomListProps) {
  return (
    <Card className="lg:sticky lg:top-24">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 font-display">
          Available Rooms
        </h3>
        {!isLoading && (
          <p className="mt-1 text-sm text-slate-500">
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} in this property
          </p>
        )}

        <div className="mt-5 space-y-3">
          {isLoading ? (
            <>
              <RoomCardSkeleton />
              <RoomCardSkeleton />
              <RoomCardSkeleton />
            </>
          ) : rooms.length === 0 ? (
            <EmptyState
              title="No rooms available"
              description="All rooms in this property are currently occupied."
              className="min-h-[180px] p-6"
            />
          ) : (
            rooms.map((room) => (
              <RoomCard key={room.id} room={room} onViewRoom={onViewRoom} />
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
