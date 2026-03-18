import { WorkspaceCard } from './WorkspaceCard';
import type { WorkspaceSummary } from '../types';

interface WorkspaceListProps {
  workspaces: WorkspaceSummary[];
  activeWorkspaceId: string | null;
  onSelect: (workspace: WorkspaceSummary) => void;
}

export function WorkspaceList({ workspaces, activeWorkspaceId, onSelect }: WorkspaceListProps) {
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white border border-dashed border-slate-300 rounded-xl">
        <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-900">No workspaces yet</p>
        <p className="mt-1 text-sm max-w-sm text-center">
          You don't belong to any workspace. Create a new one to start managing your properties.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((ws) => (
        <WorkspaceCard
          key={ws.id}
          workspace={ws}
          isActive={activeWorkspaceId === ws.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
