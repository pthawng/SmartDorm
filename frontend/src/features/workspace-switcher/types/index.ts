export type WorkspaceRole = 'OWNER' | 'MANAGER' | 'STAFF';

export interface WorkspaceSummary {
  id: string;
  name: string;
  role: WorkspaceRole;
  memberCount: number;
  activeProperties: number;
}
