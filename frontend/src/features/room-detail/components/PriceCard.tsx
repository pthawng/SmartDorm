import { memo } from 'react';
import { Card, CardContent, Button } from '@/shared/ui';
import { cn } from '@/shared/utils';
import { RoomStatus } from '@/entities/room/constants';
import { ROUTES } from '@/shared/config/routes';
import { useNavigate } from 'react-router-dom';

interface PriceCardProps {
  roomId: string;
  monthlyPrice: number;
  depositMonths: number;
  status: RoomStatus;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

/**
 * PriceCard — sticky right-column card with price and CTA.
 */
export const PriceCard = memo(function PriceCard({
  roomId,
  monthlyPrice,
  depositMonths,
  status,
}: PriceCardProps) {
  const navigate = useNavigate();
  const isAvailable = status === RoomStatus.AVAILABLE;

  const handleApply = () => {
    navigate(`${ROUTES.DASHBOARD.CONTRACT_APPLY}?room_id=${roomId}`);
  };

  return (
    <Card
      className={cn(
        'overflow-hidden lg:sticky lg:top-24',
        isAvailable
          ? 'border-emerald-200 shadow-md shadow-emerald-100/50'
          : 'border-slate-200'
      )}
    >
      <div
        className={cn(
          'relative border-b p-6',
          isAvailable ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'
        )}
      >
        {isAvailable && (
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              ⭐ Popular Choice
            </span>
          </div>
        )}
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Monthly Rent
        </h3>
        <p className="font-display text-4xl font-bold text-primary-700">
          {vndFormatter.format(monthlyPrice)}
          <span className="text-lg font-medium text-slate-400">/mo</span>
        </p>
      </div>

      <CardContent className="p-6 text-slate-600">
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Security Deposit</span>
            <span className="font-medium text-slate-900">{depositMonths} month(s) rent</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Contract Length</span>
            <span className="font-medium text-slate-900">12 months</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Utilities</span>
            <span className="font-medium text-slate-900">Not included</span>
          </div>
        </div>

        {isAvailable && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <span className="animate-pulse">🔥</span>
            <span className="font-medium">High demand:</span> 3 people viewed this today.
          </div>
        )}

        <Button
          variant={isAvailable ? 'primary' : 'outline'}
          size="lg"
          className="w-full text-base font-semibold shadow-sm transition-transform active:scale-[0.98]"
          onClick={handleApply}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Apply Now' : status}
        </Button>

        {isAvailable && (
          <p className="mt-4 text-center text-xs text-slate-500">
            No hidden fees. Fast approval process.
          </p>
        )}
      </CardContent>
    </Card>
  );
});
