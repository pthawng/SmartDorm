import { Card, Badge } from '@/shared/ui';
import type { MaintenanceSummary } from '../types';

interface MaintenanceListProps {
  issues: MaintenanceSummary[];
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
  PENDING: 'warning',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
  REJECTED: 'error',
};

export function MaintenanceList({ issues }: MaintenanceListProps) {
  return (
    <Card className="h-full border-slate-200">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Recent Maintenance</h3>
        <span className="text-xs font-medium text-slate-500">{issues.length} active</span>
      </div>
      
      {issues.length === 0 ? (
        <div className="flex h-[calc(100%-61px)] flex-col items-center justify-center p-6 text-center text-slate-500">
          <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-900">No maintenance issues</p>
          <p className="mt-1 text-xs text-slate-500">Check back here if you report a problem.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {[...issues]
            .sort((a, b) => {
              const pScore = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
              const sScore = { PENDING: 0, IN_PROGRESS: 1, REJECTED: 2, RESOLVED: 3 };
              
              const pA = pScore[a.priority as keyof typeof pScore] ?? 4;
              const pB = pScore[b.priority as keyof typeof pScore] ?? 4;
              if (pA !== pB) return pA - pB;
              
              const sA = sScore[a.status as keyof typeof sScore] ?? 4;
              const sB = sScore[b.status as keyof typeof sScore] ?? 4;
              return sA - sB;
            })
            .map((issue) => (
            <div key={issue.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-slate-900 text-sm line-clamp-1 pr-4">{issue.title}</p>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${PRIORITY_COLORS[issue.priority]}`}>
                  {issue.priority}
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>{dateFormatter.format(new Date(issue.created_at))}</span>
                <Badge variant={STATUS_VARIANT[issue.status] ?? 'neutral'} className="text-[10px] px-2 py-0">
                  {issue.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
