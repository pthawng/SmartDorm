import { Button } from '@/shared/ui/Button';
import { ROUTES } from '@/shared/config/routes';
import { useNavigate } from 'react-router-dom';

export function WorkspaceHeader() {
  const navigate = useNavigate();
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-8 border-b border-slate-100">
      <div>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Overview</h1>
        <p className="mt-1 text-slate-500 text-sm font-medium">{today}</p>
      </div>

      <div className="flex items-center gap-4">

        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}
          className="bg-white font-bold text-slate-700 shadow-sm border-slate-200"
        >
          View Invoices
        </Button>
      </div>
    </div>
  );
}
