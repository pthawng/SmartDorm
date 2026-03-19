import { Card, Badge } from '@/shared/ui';
import { MaintenanceSummary } from '../types';
import { MaintenanceStatus } from '@/entities/maintenance/constants';

interface MaintenanceListProps {
  requests: MaintenanceSummary[];
  onReport: () => void;
}

const STATUS_VARIANTS: Record<MaintenanceStatus, "success" | "warning" | "error" | "default"> = {
  [MaintenanceStatus.OPEN]: "default",
  [MaintenanceStatus.IN_PROGRESS]: "warning",
  [MaintenanceStatus.RESOLVED]: "success",
  [MaintenanceStatus.CLOSED]: "success",
};

export function MaintenanceList({ requests, onReport }: MaintenanceListProps) {
  return (
    <Card className="p-8 border-none shadow-soft rounded-3xl bg-white space-y-6">
      <div className="flex items-center justify-between">
         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Maintenance Activity</h4>
         <button 
           onClick={onReport}
           className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:underline"
         >
           Report Issue
         </button>
      </div>

      <div className="divide-y divide-slate-50">
        {requests.length === 0 ? (
          <p className="py-10 text-center text-sm font-medium text-slate-400 italic">No active requests. Everything looks good!</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 transition-colors px-2 -mx-2 rounded-xl">
              <div className="space-y-1">
                 <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{request.title}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{request.createdAt}</p>
              </div>
              <Badge variant={STATUS_VARIANTS[request.status]} className="text-[8px] font-black px-2 py-0.5 uppercase">
                 {request.status.replace('_', ' ')}
              </Badge>
            </div>
          ))
        )}
      </div>

      {requests.length > 0 && (
         <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors border-t border-slate-50">
           View All Requests
         </button>
      )}
    </Card>
  );
}
