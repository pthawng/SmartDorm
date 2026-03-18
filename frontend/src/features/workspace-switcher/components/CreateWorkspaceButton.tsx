import { Button } from '@/shared/ui';

interface CreateWorkspaceButtonProps {
  onClick: () => void;
}

export function CreateWorkspaceButton({ onClick }: CreateWorkspaceButtonProps) {
  return (
    <Button variant="primary" onClick={onClick} className="shadow-sm active:scale-[0.98] transition-transform">
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Create Workspace</span>
      </div>
    </Button>
  );
}
