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

  // Dashboard
  DASHBOARD: {
    HOME: '/dashboard',
    TENANT_HOME: '/dashboard/tenant',
    WORKSPACES: '/dashboard/workspaces',
    MESSAGES: '/dashboard/messages',

    // Properties
    PROPERTIES: '/dashboard/properties',

    // Rooms
    ROOMS: '/dashboard/rooms',
    ROOM_EDIT: (id: string) => `/dashboard/rooms/${id}/edit`,

    // Contracts
    CONTRACTS: '/dashboard/contracts',
    CONTRACT_APPLY: '/dashboard/contracts/new',
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
