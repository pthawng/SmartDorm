# Future Roadmap: Authorization Evolution

## 📈 The Journey to Granular Control
While the current implementation provides a robust, production-grade foundation, the system is designed to evolve alongside the business needs of the SmartDorm platform.

## Phase 1: Hard-Coded RBAC (Current)
- **Status**: Completed 🚀
- **Features**: 
    - Fixed permissions in `shared/auth/permissions.go`.
    - Roles like `LANDLORD` and `TENANT` drive the access logic.
    - Policy layer handles basic ownership rules.
- **Benefit**: Rapid delivery with high security and low complexity.

## Phase 2: Granular Workspace Memberships (In Progress 🏗️)
- **Concept**: Refine the `LANDLORD` role into specific workspace-level roles.
- **Status**: Foundation laid. JWT now includes `membership_role: "OWNER | MANAGER | STAFF"`.
- **Next Steps**:
    - Update middleware to use `membership_role` for dynamic permission mapping.
OWNER**: Full control over workspace settings and billing.
    - **MANAGER**: Can manage properties and contracts but cannot delete the workspace.
    - **STAFF**: Can view data and update maintenance requests but cannot manage contracts.
- **Implementation**:
    - Updates to `memberships` table.
    - JWT will include `membership_role: "OWNER | MANAGER | STAFF"`.

## Phase 3: DB-Backed Dynamic Permissions (Mid-Term)
- **Concept**: Move Permission-to-Role mappings from code to the Database.
- **Benefit**: Admin users can create custom roles (e.g., "Accountant", "Maintenance Team") through a UI without any code changes.
- **Implementation**:
    - New tables: `roles`, `permissions`, `role_permissions`.
    - Cache layer (Redis) to store permission sets for active sessions.

## Phase 4: Full Policy Engine / ABAC (Long-Term)
- **Concept**: Attribute-Based Access Control (ABAC).
- **Example Rule**: "A Manager can only edit properties in the 'District 1' region."
- **Implementation**:
    - Integration with a policy engine like **Casbin** or **Open Policy Agent (OPA)**.
    - Logic becomes purely declarative.

---

### 🎯 Pro-Tip for Reviewers
The current codebase already uses `RequirePermission(permission)` instead of `RequireRole(role)` in most routes. This makes the transition to **Phase 3** as simple as swapping the in-memory resolver for a DB-backed one—**no need to touch the route definitions.**
