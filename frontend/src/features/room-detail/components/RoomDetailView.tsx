import { useNavigate, useParams } from 'react-router-dom';
import { Loading, ErrorState, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { useRoomDetail } from '../hooks';
import { RoomStatus } from '@/entities/room/constants';

import { RoomGallery } from './RoomGallery';
import { RoomHeader } from './RoomHeader';
import { RoomInfo } from './RoomInfo';
import { PropertyInfo } from './PropertyInfo';
import { PriceCard } from './PriceCard';

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

/**
 * RoomDetailView — composed feature component.
 * Orchestrates data fetching and renders all sub-components.
 */
export function RoomDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    room,
    property,
    isLoading,
    isPropertyLoading,
    isError,
    refetch,
  } = useRoomDetail(id ?? '');

  const handleApply = () => {
    navigate(`${ROUTES.DASHBOARD.CONTRACT_APPLY}?room_id=${id}`);
  };

  if (isLoading) return <Loading message="Loading room details..." />;
  if (isError || !room) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <ErrorState
          title="Failed to load room"
          description="We couldn't load this room. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  const isAvailable = room.status === RoomStatus.AVAILABLE;

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:pb-16 pb-32">
        <RoomGallery images={room.gallery} />

        {/* Two-column layout */}
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {/* Left Column (65%) */}
          <div className="lg:col-span-2">
            <RoomHeader
              roomNumber={room.room_number}
              status={room.status}
              propertyName={property?.name ?? (isPropertyLoading ? 'Loading property...' : 'Unknown Property')}
              propertyId={room.property_id.toString()}
            />

            <RoomInfo
              floor={room.floor}
              areaSqm={room.area_sqm}
              description={room.description}
              amenities={room.amenities}
            />

            {property && (
              <PropertyInfo
                propertyId={property.id.toString()}
                propertyName={property.name}
                propertyAddress={`${property.address}, ${property.city}`}
              />
            )}
          </div>

          {/* Right Column (35%) */}
          <div>
            <PriceCard
              roomId={room.id.toString()}
              monthlyPrice={room.monthly_price}
              depositMonths={room.deposit_months}
              status={room.status}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/80 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">
              Monthly Rent
            </p>
            <p className="text-2xl font-display font-bold text-primary-700 truncate">
              {vndFormatter.format(room.monthly_price)}
            </p>
          </div>
          <Button
            variant={isAvailable ? 'primary' : 'outline'}
            size="md"
            className="shrink-0 min-w-[140px] font-semibold shadow-sm transition-transform active:scale-[0.98]"
            onClick={isAvailable ? handleApply : undefined}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Apply Now' : room.status}
          </Button>
        </div>
      </div>
    </>
  );
}
