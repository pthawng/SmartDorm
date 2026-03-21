/**
 * Centralized route constants.
 * NEVER hardcode route strings in components — always reference ROUTES.
 */

export const ROUTES = {
  // Marketing (Public)
  HOME: '/',
  SEARCH: '/search',
  PROPERTY_DETAIL: (id: string) => `/properties/${id}`,
  ROOM_DETAIL: (id: string) => `/rooms/${id}`,

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  BECOME_LANDLORD: '/become-landlord',
  BECOME_LANDLORD_SETUP: '/dashboard/workspaces/setup',

  // Dashboard
  DASHBOARD: {
    HOME: '/dashboard',
    TENANT_HOME: '/dashboard/tenant',
    WORKSPACES: '/dashboard/workspaces',
    WORKSPACE_DETAIL: (id: string) => `/workspaces/${id}`,
    MESSAGES: '/dashboard/messages',
    APPLICATIONS: '/dashboard/applications',

    // Properties
    PROPERTIES: '/dashboard/properties',
    PROPERTY_NEW: '/dashboard/properties/new',

    // Rooms
    ROOMS: '/dashboard/rooms',
    ROOM_EDIT: (id: string) => `/dashboard/rooms/${id}/edit`,

    // Contracts
    CONTRACTS: '/dashboard/contracts',
    CONTRACT_APPLY: '/dashboard/contracts/new',
    CONTRACT_ISSUE: '/dashboard/contracts/issue',
    CONTRACT_PAY_DEPOSIT: (id: string) => `/dashboard/contracts/${id}/pay-deposit`,
    CONTRACT_CONFIRM: (id: string) => `/dashboard/contracts/${id}/confirm`,
    CONTRACT_REVIEW: (id: string) => `/dashboard/contracts/${id}/review`,

    // Invoices
    INVOICES: '/dashboard/invoices',
    INVOICE_DETAIL: (id: string) => `/dashboard/invoices/${id}`,
    INVOICE_PAY: (id: string) => `/dashboard/invoices/${id}/pay`,

    // Maintenance
    MAINTENANCE: '/dashboard/maintenance',
    MAINTENANCE_NEW: '/dashboard/maintenance/new',
    MAINTENANCE_DETAIL: (id: string) => `/dashboard/maintenance/${id}`,

    // Settings
    SETTINGS_PROFILE: '/dashboard/settings/profile',
    SETTINGS_WORKSPACE: '/dashboard/settings/workspace',
    SETTINGS_TEAM: '/dashboard/settings/team',

    // Renters
    RENTERS: '/dashboard/renters',
    RENTER_DETAIL: (id: string) => `/dashboard/renters/${id}`,
  },
} as const;
