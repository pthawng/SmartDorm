import { ROUTES } from './routes';

/**
 * Maps specific route paths to human-readable breadcrumb labels.
 * If a path isn't here, the system fallbacks to capitalizing the path segment.
 */
export const BREADCRUMB_CONFIG: Record<string, string> = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.DASHBOARD.HOME]: 'Dashboard',
  [ROUTES.DASHBOARD.TENANT_HOME]: 'Resident Portal',
  [ROUTES.DASHBOARD.PROPERTIES]: 'Properties',
  [ROUTES.DASHBOARD.ROOMS]: 'Room Management',
  [ROUTES.DASHBOARD.WORKSPACES]: 'Workspaces',
  [ROUTES.DASHBOARD.MESSAGES]: 'Messages',
  [ROUTES.DASHBOARD.APPLICATIONS]: 'My Applications',
  [ROUTES.DASHBOARD.CONTRACTS]: 'Contracts',
  [ROUTES.DASHBOARD.INVOICES]: 'Invoices',
  [ROUTES.DASHBOARD.MAINTENANCE]: 'Maintenance',
  [ROUTES.DASHBOARD.RENTERS]: 'Tenant Profiles',
  [ROUTES.DASHBOARD.SETTINGS_PROFILE]: 'Profile Settings',
  [ROUTES.DASHBOARD.SETTINGS_WORKSPACE]: 'Workspace Settings',
  [ROUTES.DASHBOARD.SETTINGS_TEAM]: 'Team Management',
};
