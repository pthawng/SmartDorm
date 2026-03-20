import { jwtDecode } from 'jwt-decode';

/**
 * Permission check utility for UI elements.
 * NOTE: This is only for UI/UX (hiding elements). 
 * Security is enforced strictly on the Backend.
 */

interface Claims {
  active_role: string;
  workspace_id?: string;
}

// Map from Backend (must be kept in sync or fetched from API)
const RolePermissions: Record<string, string[]> = {
  LANDLORD: [
    'property:create', 'property:read', 'property:update', 'property:delete',
    'room:create', 'room:read', 'room:update', 'room:delete',
    'contract:view', 'contract:manage', 'contract:sign',
    'invoice:view', 'invoice:edit'
  ],
  TENANT: [
    'property:read', 'room:read',
    'contract:view', 'contract:apply', 'contract:sign',
    'invoice:view', 'invoice:pay'
  ]
};

export const can = (permission: string): boolean => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;

  try {
    const claims = jwtDecode<Claims>(token);
    const role = claims.active_role;
    const permissions = RolePermissions[role] || [];
    
    return permissions.includes(permission);
  } catch (e) {
    return false;
  }
};
