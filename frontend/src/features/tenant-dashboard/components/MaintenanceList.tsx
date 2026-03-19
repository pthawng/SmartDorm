import { Card } from '@/shared/ui';
import { MaintenanceSummary } from '../types';
import { MaintenanceStatus } from '@/entities/maintenance/constants';
import { StatusDot } from '@/shared/ui/StatusDot';
import { Plus, Wrench } from 'lucide-react';

interface MaintenanceListProps {
  requests: MaintenanceSummary[];
  onReport: () => void;
}

const STATUS_MAP: Record<MaintenanceStatus, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  [MaintenanceStatus.OPEN]: 'info',
  [MaintenanceStatus.IN_PROGRESS]: 'warning',
  [MaintenanceStatus.RESOLVED]: 'success',
  [MaintenanceStatus.CLOSED]: 'neutral',
};

/**
 * Airbnb-style 'Maintenance Spotlight' — provides a quick glance at service requests.
 * Uses high-fidelity status dots and streamlined ticket metadata.
 */
export function MaintenanceList({ requests, onReport }: MaintenanceListProps) {
  return (
    <Card className="relative p-10 border-none shadow-[0_32px_80px_-16px_rgba(0,0,0,0.06)] rounded-[2.5rem] bg-white group transition-all duration-500 hover:shadow-[0_48px_100px_-16px_rgba(0,0,0,0.1)]">
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Maintenance Activity
            </h4>
            <p className="text-xl font-black text-slate-900 tracking-tight">Home Service</p>
          </div>
          <button 
            onClick={onReport}
            className="h-10 w-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all border border-slate-100"
          >
            <Plus className="w-5 h-5" />
          </button>
        </header>

        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                <Wrench className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-6">
                No active requests. <br />Everything looks good!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div 
                  key={request.id} 
                  className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer group/item"
                >
                  <div className="flex items-center gap-4">
                    <StatusDot 
                      status={STATUS_MAP[request.status]} 
                      pulse={request.status === MaintenanceStatus.IN_PROGRESS} 
                    />
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-slate-900 group-hover/item:text-primary-600 transition-colors">
                        {request.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {request.status.replace('_', ' ')} • {request.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {requests.length > 0 && (
          <button className="w-full py-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-primary-600 transition-colors text-center">
            View All Tickets
          </button>
        )}
      </div>
    </Card>
  );
}
