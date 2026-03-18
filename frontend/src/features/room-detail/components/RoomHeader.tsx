import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { Badge } from '@/shared/ui';
import { RoomStatus } from '@/entities/room/constants';

interface RoomHeaderProps {
  roomNumber: string;
  status: RoomStatus;
  propertyName: string;
  propertyId: string;
}

const STATUS_VARIANT: Record<RoomStatus, 'success' | 'error' | 'warning'> = {
  [RoomStatus.AVAILABLE]: 'success',
  [RoomStatus.OCCUPIED]: 'error',
  [RoomStatus.MAINTENANCE]: 'warning',
};

/**
 * RoomHeader — breadcrumb, room title, and status badge.
 */
export function RoomHeader({ roomNumber, status, propertyName, propertyId }: RoomHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <Link to={ROUTES.HOME} className="transition-colors hover:text-primary-600">Home</Link>
        <span className="text-slate-300">/</span>
        <Link to={ROUTES.SEARCH} className="transition-colors hover:text-primary-600">Properties</Link>
        <span className="text-slate-300">/</span>
        <Link to={ROUTES.PROPERTY_DETAIL(propertyId)} className="font-medium text-slate-700 transition-colors hover:text-primary-600">
          {propertyName}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900">Room {roomNumber}</span>
      </nav>

      {/* Title & Status */}
      <div className="flex items-center gap-4">
        <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
          Room {roomNumber}
        </h1>
        <Badge variant={STATUS_VARIANT[status]} className="px-3 py-1.5 text-sm uppercase tracking-wider">
          {status}
        </Badge>
      </div>
    </div>
  );
}
