# Authorization System: High-Level Overview

## 🎯 Vision
The SmartDorm Authorization System is designed with a **Security-First, UX-Second** philosophy. It transitions from a basic RBAC (Role-Based Access Control) to a sophisticated, context-aware system that handles multi-tenancy (Workspaces) and hybrid roles (Landlord/Tenant) with zero redundancy and maximum auditability.

## 🚀 Key "Senior-Level" Design Decisions

### 1. Permission-Based, Not Role-Based (Internal)
While users see "Roles" (Landlord, Tenant), the backend enforces permissions (`property:create`, `contract:sign`). This decoupling allows for future flexibility (e.g., custom staff roles) without refactoring the entire middleware chain.

###    - **Context Awareness**: Access tokens (JWT) embed the user's active role and workspace context.
    - **Session Rotation**: Refresh tokens rotate on every use to prevent replay attacks.
    - **Stateful Validation**: The system validates workspace membership and user status on every refresh.
    - **Global Revocation**: A "Security Stamp" mechanism allows instant invalidation of all sessions across all devices (e.g., on password change).
poofing and inconsistency.

### 3. Identity vs. Domain Decoupling
*   **Identity**: A `User` is an authenticated entity.
*   **Role Fallback**: Any authenticated user is a `TENANT` by default. No "Role" column in the `users` table is required.
*   **Domain Profile**: The `renters` table is strictly for domain data (budget, preferences, rating) and is optional for authentication.

### 4. Deterministic Context Snapshots
Refresh Tokens store a **Snapshot** of the user's active session (Role + Workspace). When a token rotates, the context is preserved 100%, preventing "context loss" bugs where a user is mysteriously switched back to a default view after a refresh.

## 🛡️ Security Invariants
*  ### 5. Privilege Escalation Prevention
Switching context via `/auth/switch-context` requires a strict database membership check. This prevents users from "teleporting" into workspaces they don't belong to.
*   **Context Consistency**: Middleware enforces that if a role is `LANDLORD`, a `workspace_id` **must** be present.
*   **Auditability**: Every role switch and sensitive mutation is logged with a structured audit trail.

## 🗺️ Future Evolution
The system is architected for a seamless transition from hard-coded roles to granular, database-backed memberships (OWNER, MANAGER, STAFF). See the **[Roadmap](file:///e:/SmartDorm/docs/auth/05-roadmap.md)** for more details.
