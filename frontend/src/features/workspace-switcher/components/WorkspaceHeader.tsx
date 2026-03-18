import { CreateWorkspaceButton } from './CreateWorkspaceButton';

interface WorkspaceHeaderProps {
  onCreate: () => void;
}

export function WorkspaceHeader({ onCreate }: WorkspaceHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">Select a Workspace</h1>
        <p className="mt-2 text-slate-500 text-sm">Choose a property portfolio to manage.</p>
      </div>
      <div>
        <CreateWorkspaceButton onClick={onCreate} />
      </div>
    </div>
  );
}
