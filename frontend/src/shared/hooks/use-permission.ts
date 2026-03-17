/**
 * Permission hook — RBAC enforcement on the client.
 * Uses the current user's membership role to gate UI actions.
 *
 * Usage:
 *   const { can, role } = usePermission();
 *   if (can('manage_rooms')) { ... }
 */

import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { MembershipRole } from '@/entities/membership';

/** All domain-level permissions in the system */
export type Permission =
  | 'view_dashboard'
  | 'manage_properties'
  | 'manage_rooms'
  | 'manage_contracts'
  | 'manage_invoices'
  | 'manage_renters'
  | 'manage_maintenance'
  | 'manage_team'
  | 'manage_workspace'
  | 'report_issue'
  | 'view_own_contract'
  | 'pay_invoice';

/**
 * Role → Permission matrix.
 * Defines what each role can do.
 */
const ROLE_PERMISSIONS: Record<MembershipRole, Permission[]> = {
  [MembershipRole.OWNER]: [
    'view_dashboard',
    'manage_properties',
    'manage_rooms',
    'manage_contracts',
    'manage_invoices',
    'manage_renters',
    'manage_maintenance',
    'manage_team',
    'manage_workspace',
  ],
  [MembershipRole.PROPERTY_MANAGER]: [
    'view_dashboard',
    'manage_properties',
    'manage_rooms',
    'manage_contracts',
    'manage_invoices',
    'manage_renters',
    'manage_maintenance',
  ],
  [MembershipRole.STAFF]: [
    'view_dashboard',
    'manage_rooms',
    'manage_maintenance',
    'report_issue',
  ],
};

/** Tenant permissions (user with no workspace membership but has a contract) */
const TENANT_PERMISSIONS: Permission[] = [
  'view_own_contract',
  'pay_invoice',
  'report_issue',
];

export function usePermission() {
  const user = useAuthStore((s) => s.user);
  const memberships = useWorkspaceStore((s) => s.memberships);
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);

  const currentMembership = useMemo(
    () =>
      memberships.find((m) => m.workspace_id === currentWorkspace?.id),
    [memberships, currentWorkspace],
  );

  const role = currentMembership?.role ?? null;

  const permissions = useMemo<Permission[]>(() => {
    if (role) return ROLE_PERMISSIONS[role] ?? [];
    if (user) return TENANT_PERMISSIONS;
    return [];
  }, [role, user]);

  const can = (permission: Permission): boolean =>
    permissions.includes(permission);

  const canAny = (...perms: Permission[]): boolean =>
    perms.some((p) => permissions.includes(p));

  const canAll = (...perms: Permission[]): boolean =>
    perms.every((p) => permissions.includes(p));

  return {
    role,
    permissions,
    can,
    canAny,
    canAll,
    isOwner: role === MembershipRole.OWNER,
    isManager: role === MembershipRole.PROPERTY_MANAGER,
    isStaff: role === MembershipRole.STAFF,
    isTenant: !role && !!user,
  };
}
