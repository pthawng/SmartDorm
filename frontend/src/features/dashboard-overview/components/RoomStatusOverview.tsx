import { Card, Badge, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { useNavigate } from 'react-router-dom';
import type { RoomStatusSummary } from '../types';

interface RoomStatusOverviewProps {
  rooms: RoomStatusSummary[];
}

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'info' | 'neutral' | 'error'> = {
  AVAILABLE: 'success',
  OCCUPIED: 'neutral',
  MAINTENANCE: 'error',
};

export function RoomStatusOverview({ rooms }: RoomStatusOverviewProps) {
  const navigate = useNavigate();
  // Sort to bring MAINTENANCE to top, then AVAILABLE, then OCCUPIED
  const sortedRooms = [...rooms].sort((a, b) => {
    const p = { MAINTENANCE: 0, AVAILABLE: 1, OCCUPIED: 2 };
    return p[a.status] - p[b.status];
  });

  return (
    <Card className="border-slate-200 h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Room Status</h3>
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DASHBOARD.ROOMS)}>
          View All
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-slate-100">
          {sortedRooms.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-slate-500">
              <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-900">No rooms managed</p>
              <p className="mt-1 text-xs text-slate-500">Add a room to track capacity.</p>
            </div>
          ) : (
            sortedRooms.map((room) => (
              <div key={room.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Room {room.roomNumber}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{room.property}</p>
                </div>
                <Badge variant={STATUS_VARIANT[room.status]} className="text-[10px] px-2 py-0.5">
                  {room.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
