/**
 * Standardized TanStack Query Key Factory.
 * Ensures consistent cache keys across all features.
 *
 * Pattern: [domain, ...filters]
 * - List:   queryKeys.rooms.list({ status: 'AVAILABLE' })
 * - Detail: queryKeys.rooms.detail('room-123')
 */

export const queryKeys = {
  // ── Auth ────────────────────────────────────────────────
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  // ── Properties ─────────────────────────────────────────
  properties: {
    all: () => ['properties'] as const,
    list: (filters?: Record<string, unknown>) => ['properties', 'list', filters] as const,
    detail: (id: string) => ['properties', 'detail', id] as const,
  },

  // ── Rooms ──────────────────────────────────────────────
  rooms: {
    all: () => ['rooms'] as const,
    list: (filters?: Record<string, unknown>) => ['rooms', 'list', filters] as const,
    detail: (id: string) => ['rooms', 'detail', id] as const,
  },

  // ── Contracts ──────────────────────────────────────────
  contracts: {
    all: () => ['contracts'] as const,
    list: (filters?: Record<string, unknown>) => ['contracts', 'list', filters] as const,
    detail: (id: string) => ['contracts', 'detail', id] as const,
  },

  // ── Invoices ───────────────────────────────────────────
  invoices: {
    all: () => ['invoices'] as const,
    list: (filters?: Record<string, unknown>) => ['invoices', 'list', filters] as const,
    detail: (id: string) => ['invoices', 'detail', id] as const,
  },

  // ── Renters ────────────────────────────────────────────
  renters: {
    all: () => ['renters'] as const,
    list: (filters?: Record<string, unknown>) => ['renters', 'list', filters] as const,
    detail: (id: string) => ['renters', 'detail', id] as const,
  },

  // ── Maintenance ────────────────────────────────────────
  maintenance: {
    all: () => ['maintenance'] as const,
    list: (filters?: Record<string, unknown>) => ['maintenance', 'list', filters] as const,
    detail: (id: string) => ['maintenance', 'detail', id] as const,
  },

  // ── Workspaces ─────────────────────────────────────────
  workspaces: {
    all: () => ['workspaces'] as const,
    detail: (id: string) => ['workspaces', 'detail', id] as const,
    members: (id: string) => ['workspaces', id, 'members'] as const,
  },

  // ── Dashboard Stats ────────────────────────────────────
  stats: {
    dashboard: () => ['stats', 'dashboard'] as const,
  },
} as const;
