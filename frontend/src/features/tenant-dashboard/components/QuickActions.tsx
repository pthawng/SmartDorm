import { Card } from '@/shared/ui';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      label: 'Pay Rent',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: () => {},
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Report Issue',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      onClick: () => {},
      color: 'bg-primary-50 text-primary-600',
    },
    {
      label: 'Digital Key',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      onClick: () => {},
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Contract',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: () => {},
      color: 'bg-slate-50 text-slate-600',
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Card 
          key={action.label} 
          onClick={action.onClick}
          className="p-6 border-none shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300 rounded-3xl cursor-pointer bg-white flex flex-col items-center justify-center text-center space-y-3 active:scale-95"
        >
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${action.color}`}>
             {action.icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{action.label}</span>
        </Card>
      ))}
    </div>
  );
}
