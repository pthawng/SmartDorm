import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading, ErrorState } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useWorkspaces } from '../hooks';

import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceList } from './WorkspaceList';
import type { WorkspaceSummary } from '../types';

export function WorkspaceSwitcherFeature() {
  const navigate = useNavigate();
  const { switchContext } = useAuthStore();
  const { currentWorkspace } = useWorkspaceStore();
  const { data: workspaces, isLoading, isError, refetch } = useWorkspaces();
  const [isSwitchingId, setIsSwitchingId] = useState<string | null>(null);

  const handleCreateWorkspace = () => {
    navigate(ROUTES.BECOME_LANDLORD);
  };

  const handleSelectWorkspace = async (workspace: WorkspaceSummary) => {
    setIsSwitchingId(workspace.id);
    try {
      await switchContext(workspace.id);
      navigate(ROUTES.DASHBOARD.WORKSPACE_DETAIL(workspace.id));
    } catch (error) {
      console.error('Failed to switch workspace:', error);
      setIsSwitchingId(null);
    }
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
      {/* Main Content */}

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
