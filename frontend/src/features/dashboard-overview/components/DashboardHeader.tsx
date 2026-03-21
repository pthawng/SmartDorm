import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '@/store/workspaceStore';

export function DashboardHeader() {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceStore();
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
           <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">Workspace</span>
           <span className="text-sm font-semibold text-slate-500">{currentWorkspace?.name || 'Loading...'}</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="mt-1 text-slate-500 text-sm font-medium">{today}</p>
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
          onClick={() => navigate(ROUTES.DASHBOARD.PROPERTY_NEW)}
        >
          Add Property
        </Button>
      </div>
    </div>
  );
}
