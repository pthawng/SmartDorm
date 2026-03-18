import { memo } from 'react';
import { Badge, Button } from '@/shared/ui';
import type { RoomData } from '@/entities/room';
import { RoomStatus } from '@/entities/room/constants';

interface RoomCardProps {
  room: RoomData;
  onViewRoom: (id: string) => void;
}

const STATUS_VARIANT: Record<RoomStatus, 'success' | 'error' | 'warning'> = {
  [RoomStatus.AVAILABLE]: 'success',
  [RoomStatus.OCCUPIED]: 'error',
  [RoomStatus.MAINTENANCE]: 'warning',
};

/** Cached formatter — avoids creating a new Intl.NumberFormat on every render */
const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

/**
 * RoomCard — single room summary. Pure presentational.
 * Memoized to avoid re-rendering when parent state changes.
 */
export const RoomCard = memo(function RoomCard({ room, onViewRoom }: RoomCardProps) {
  const isAvailable = room.status === RoomStatus.AVAILABLE;

  // We conditionally apply a green highlight for available rooms
  const baseClasses = "flex flex-col gap-4 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between";
  const statusClasses = isAvailable
    ? "border-emerald-200 bg-emerald-50/40 shadow-sm hover:bg-emerald-50/80"
    : "border-slate-200 bg-white hover:bg-slate-50";

  return (
    <div className={`${baseClasses} ${statusClasses}`}>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="font-display text-base font-semibold text-slate-900">
            Room {room.room_number}
          </span>
          <Badge variant={STATUS_VARIANT[room.status]}>
            {room.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Floor {room.floor}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{room.area_sqm}m²</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-2">
        <p className="text-lg font-bold text-primary-700">
          {vndFormatter.format(room.monthly_price)}
          <span className="text-sm font-medium text-slate-400">/mo</span>
        </p>
        <Button
          variant={isAvailable ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onViewRoom(room.id)}
          disabled={room.status === RoomStatus.MAINTENANCE}
          className="shrink-0"
        >
          {isAvailable ? 'Apply Now' : 'View Room'}
        </Button>
      </div>
    </div>
  );
});
