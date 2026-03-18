import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading, ErrorState } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useWorkspaces } from '../hooks';

import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceList } from './WorkspaceList';
import type { WorkspaceSummary } from '../types';

export function WorkspaceSwitcherFeature() {
  const navigate = useNavigate();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const { data: workspaces, isLoading, isError, refetch } = useWorkspaces();
  const [isSwitchingId, setIsSwitchingId] = useState<string | null>(null);

  const handleCreateWorkspace = () => {
    // In the future this might open a modal or go to a Create route.
    console.log('Navigate to Create Workspace');
  };

  const handleSelectWorkspace = (workspace: WorkspaceSummary) => {
    // Add artificial delay to give visual feedback that context is switching
    setIsSwitchingId(workspace.id);
    
    setTimeout(() => {
      // Cast to expected global store format for MVP mock bridging
      setCurrentWorkspace({ id: workspace.id, name: workspace.name } as any);
      navigate(ROUTES.DASHBOARD.HOME);
    }, 400);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <main className="flex-1 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 w-full">
          <Loading message="Loading your workspaces..." />
        </main>
      </div>
    );
  }

  if (isSwitchingId) {
    const targetWs = workspaces?.find(w => w.id === isSwitchingId);
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <main className="flex-1 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 w-full">
          <Loading message={`Switching to ${targetWs?.name || 'workspace'}...`} />
        </main>
      </div>
    );
  }

  if (isError || !workspaces) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <main className="flex-1 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 w-full">
          <ErrorState
            title="Failed to load workspaces"
            description="We encountered an error while fetching your portfolio data. Please try again."
            onRetry={refetch}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top Navigation Spacer (if needed in real layout) */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-display font-bold">
            S
          </div>
          <span className="font-display font-bold text-slate-900 tracking-tight">SmartDorm</span>
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 w-full">
        <WorkspaceHeader onCreate={handleCreateWorkspace} />
        
        <WorkspaceList
          workspaces={workspaces}
          activeWorkspaceId={currentWorkspace?.id || null}
          onSelect={handleSelectWorkspace}
        />
      </main>
    </div>
  );
}
