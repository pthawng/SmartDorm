import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { useNavigate } from 'react-router-dom';

export function DashboardHeader() {
  const navigate = useNavigate();
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">Overview</h1>
        <p className="mt-1 text-slate-500">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}
          className="bg-white"
        >
          View Invoices
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.DASHBOARD.ROOM_NEW)}
        >
          Add Room
        </Button>
      </div>
    </div>
  );
}
