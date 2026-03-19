import { Card } from '@/shared/ui';
import { CreditCard, Wrench, User, FileText } from 'lucide-react';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

/**
 * Airbnb-style 'Quick Action' grid — minimalist resident services.
 * Features elevated icon cards with soft accent backgrounds.
 */
export function QuickActions() {
  const actions: QuickAction[] = [
    {
      label: 'Pay Rent',
      icon: <CreditCard className="w-5 h-5" />,
      onClick: () => {},
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Report Issue',
      icon: <Wrench className="w-5 h-5" />,
      onClick: () => {},
      color: 'bg-primary-50 text-primary-600',
    },
    {
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      onClick: () => {},
      color: 'bg-slate-50 text-slate-600',
    },
    {
      label: 'Contract',
      icon: <FileText className="w-5 h-5" />,
      onClick: () => {},
      color: 'bg-amber-50 text-amber-600',
    }
  ];

  return (
    <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:gap-8">
      {actions.map((action) => (
        <Card 
          key={action.label} 
          onClick={action.onClick}
          className="flex-shrink-0 w-44 sm:w-auto p-8 border-none shadow-[0_16px_40px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 rounded-[2rem] cursor-pointer bg-white flex flex-col items-center justify-center text-center space-y-4 group active:scale-95"
        >
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${action.color}`}>
             {action.icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-primary-600 transition-colors">
            {action.label}
          </span>
        </Card>
      ))}
    </div>
  );
}
