import { Card } from '@/shared/ui';
import { cn } from '@/shared/utils';
import { RoleBadge } from './RoleBadge';
import type { WorkspaceSummary } from '../types';

interface WorkspaceCardProps {
  workspace: WorkspaceSummary;
  isActive: boolean;
  onSelect: (workspace: WorkspaceSummary) => void;
}

export function WorkspaceCard({ workspace, isActive, onSelect }: WorkspaceCardProps) {
  return (
    <Card 
      onClick={() => {
        if (!isActive) onSelect(workspace);
      }}
      className={cn(
        "overflow-hidden transition-all duration-200",
        isActive 
          ? "border-primary-500 ring-2 ring-primary-500/20 shadow-md cursor-default bg-primary-50/10" 
          : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className={cn(
            "p-3 rounded-lg flex items-center justify-center",
            isActive ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-500"
          )}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary-500"></span>
                Current
              </span>
            )}
            <RoleBadge role={workspace.role} />
          </div>
        </div>
        
        <h3 className={cn(
          "text-lg font-bold font-display transition-colors line-clamp-1",
          isActive ? "text-primary-900" : "text-slate-900 group-hover:text-primary-700"
        )}>
          {workspace.name}
        </h3>
        
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{workspace.activeProperties} {workspace.activeProperties === 1 ? 'Property' : 'Properties'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{workspace.memberCount} Team</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
