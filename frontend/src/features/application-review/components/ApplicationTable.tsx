import { cn } from '@/shared/utils';
import type { LeaseApplication } from '../types';
import { Badge } from '@/shared/ui';

interface ApplicationTableProps {
  applications: LeaseApplication[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusColorMap = {
  'PENDING': 'bg-sky-50 text-sky-600 border-sky-100 ring-2 ring-sky-50',
  'APPROVED': 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-2 ring-emerald-50',
  'REJECTED': 'bg-rose-50 text-rose-600 border-rose-100 ring-2 ring-rose-50',
  'REVISION_REQUESTED': 'bg-amber-50 text-amber-600 border-amber-100 ring-2 ring-amber-50',
};

const statusLabelMap = {
  'PENDING': 'Inbox',
  'APPROVED': 'Approved',
  'REJECTED': 'Rejected',
  'REVISION_REQUESTED': 'Revision',
};

export function ApplicationTable({ applications, selectedId, onSelect }: ApplicationTableProps) {
  return (
    <div className="flex flex-col">
      {applications.map((app) => (
        <button
          key={app.id}
          onClick={() => onSelect(app.id)}
          className={cn(
            "p-5 text-left transition-all border-b border-slate-50 relative group",
            selectedId === app.id 
              ? "bg-white shadow-inner active:scale-[0.99]" 
              : "hover:bg-slate-50/50"
          )}
        >
          {/* Active Highlight Indicator */}
          {selectedId === app.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900 rounded-r-full" />
          )}

          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tighter group-hover:text-slate-950 transition-colors">
                {app.applicant.full_name}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                Room {app.room_number}
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                {new Date(app.applied_at).toLocaleDateString()}
              </span>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "rounded-full text-[9px] font-bold px-2 py-0.5 whitespace-nowrap border uppercase tracking-wider",
                statusColorMap[app.status]
              )}
            >
              {statusLabelMap[app.status]}
            </Badge>
          </div>
          
          <p className="text-[11px] text-slate-500 font-medium line-clamp-1 leading-relaxed">
            {app.message || `Applying for ${app.terms.duration_months} months starting ${new Date(app.terms.start_date).toLocaleDateString()}`}
          </p>
        </button>
      ))}

      {applications.length === 0 && (
        <div className="py-20 px-6 text-center animate-in fade-in duration-500">
          <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Zero Results</p>
          <p className="text-[11px] text-slate-400 mt-1 italic">No applications match the current filter.</p>
        </div>
      )}
    </div>
  );
}
