import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading, ErrorState, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { usePropertyDetail } from '../hooks';
import { PropertyHeader } from './PropertyHeader';
import { PropertyGallery } from './PropertyGallery';
import { PropertyInfo } from './PropertyInfo';
import { RoomList } from './RoomList';
import { RoomStatus } from '@/entities/room/constants';

/** Cached formatter for the sticky bar */
const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

/**
 * PropertyDetailView — composed feature component.
 * Orchestrates data fetching and renders all sub-components.
 * This is the ONLY component that talks to hooks/state.
 */
export function PropertyDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    property,
    rooms,
    isLoading,
    isRoomsLoading,
    isError,
    refetch,
  } = usePropertyDetail(id ?? '');

  const handleViewRoom = (roomId: string) => {
    navigate(ROUTES.ROOM_DETAIL(roomId));
  };

  const handleScrollToRooms = () => {
    document.getElementById('room-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  const startingPrice = useMemo(() => {
    const availableRooms = rooms.filter(r => r.status === RoomStatus.AVAILABLE);
    if (availableRooms.length === 0) return null;
    return Math.min(...availableRooms.map(r => r.monthly_price));
  }, [rooms]);

  if (isLoading) return <Loading message="Loading property..." />;
  if (isError || !property) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <ErrorState
          title="Failed to load property"
          description="We couldn't load this property. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:pb-8">
        <PropertyHeader property={property} />
        <PropertyGallery images={property.gallery} />

        {/* Two-column layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          {/* Left — Description & Amenities (60%) */}
          <div className="lg:col-span-3">
            <PropertyInfo
              description={property.description}
              amenities={property.amenities}
              manager={property.manager}
            />
          </div>

          {/* Right — Room List (40%) */}
          <div id="room-list" className="scroll-mt-24 lg:col-span-2 pb-24 lg:pb-0">
            <RoomList
              rooms={rooms}
              isLoading={isRoomsLoading}
              onViewRoom={handleViewRoom}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/80 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {startingPrice ? 'Prices from' : 'Status'}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {startingPrice ? (
                <>
                  {vndFormatter.format(startingPrice)}
                  <span className="text-sm font-normal text-slate-500">/mo</span>
                </>
              ) : (
                'Fully Booked'
              )}
            </p>
          </div>
          <Button
            variant={startingPrice ? 'primary' : 'outline'}
            size="md"
            className="w-full max-w-[160px]"
            onClick={startingPrice ? handleScrollToRooms : undefined}
            disabled={!startingPrice && !isRoomsLoading}
          >
            {startingPrice ? 'Apply Now' : 'Join Waitlist'}
          </Button>
        </div>
      </div>
    </>
  );
}
