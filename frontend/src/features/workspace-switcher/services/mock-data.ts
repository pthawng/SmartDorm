import type { WorkspaceSummary } from '../types';

export const MOCK_WORKSPACES: WorkspaceSummary[] = [
  {
    id: 'ws-1',
    name: 'SmartDorm Global',
    role: 'OWNER',
    memberCount: 12,
    activeProperties: 5,
  },
  {
    id: 'ws-2',
    name: 'The Modern Loft Management',
    role: 'MANAGER',
    memberCount: 4,
    activeProperties: 2,
  },
  {
    id: 'ws-3',
    name: 'Sunrise Villas LLC',
    role: 'STAFF',
    memberCount: 8,
    activeProperties: 8,
  },
];
