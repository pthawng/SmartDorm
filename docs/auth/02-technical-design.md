# Technical Design: Claims, Tokens & Context

## 🔑 JWT Structure (Access Token)
Access tokens are signed using HS256 and contain the following claims:

```json
{
  "sub": "user_uuid",
  "active_role": "LANDLORD | TENANT | ADMIN",
  "workspace_id": "workspace_uuid (optional)",
  "membership_role": "OWNER | MANAGER | STAFF (for LANDLORD context)",
  "security_stamp": "uuid (session version)",
  "iat": 1711000000,
  "exp": 1711003600
}
```

## 🛡️ Global Revocation: Security Stamp Model
Standard JWTs are stateless and cannot be revoked easily. We solve this by introducing an **Identity Versioning** layer:

1.  **Security Stamp**: A unique UUID stored in the `users` table and mirrored in the `refresh_tokens` snapshot.
2.  **Validation**: During `POST /auth/refresh`, the system compares the token's stamp with the current DB stamp.
3.  **Invalidation**: If the stamps mismatch (meaning a global revocation event occurred), the session is killed.
4.  **Triggers**:
    - Password change.
    - Account locked/suspended.
    - Explicit "Logout all devices" action.

## 🎭 Role Binding Model: Decoupling Platform vs. Workspace
To avoid "Overloading" roles, we distinguish between three layers of identity:

### 1. Platform Role (`active_role`)
The user's current session mode. This controls the high-level UI/UX and broad routing.
- **TENANT**: Regular user browsing and renting.
- **LANDLORD**: Management mode for properties/workspaces.

### 2. Workspace Membership Role (`membership_role`)
The specific authority a user has **within a specific workspace**.
- **OWNER**: Full billing and workspace management.
- **MANAGER**: Property/Contract management.
- **STAFF**: Read-only or operation-specific.

### 3. Effective Permissions
Derived from the `membership_role` at the API/Middleware layer. Permissions are **Business-Logic centered** (e.g., `property:create`).

## 🔄 Refresh Token Snapshots
Standard refresh tokens only store a `user_id`. Our system implements **Context Snapshots**:

| Field | Description |
| :--- | :--- |
| `id` | Unique identifier (UUID) |
| `user_id` | Foreign key to `users` |
| `active_role` | The role active at the time of token issuance |
| `workspace_id` | The workspace active at the time of token issuance |
| `expires_at` | Expiration timestamp |

### Token Rotation Flow
1.  Client sends `refresh_token`.
2.  Backend retrieves the snapshot from the database.
3.  Backend re-validates the snapshot context (e.g., "Is this user still a member of this workspace?").
4.  Backend issues a **New Access Token** using the snapshot's role/workspace.
5.  Backend issues a **New Refresh Token** (Rotation) and deletes the old one.

## 🔀 Context Switching Flow
To switch from `TENANT` to `LANDLORD` (or between workspaces):

1.  **Request**: `POST /auth/switch-context { "context_type": "workspace", "workspace_id": "..." }`
2.  **Validation**: Backend checks the `memberships` table.
3.  **Issuance**: If valid, returns a new JWT and updates the Refresh Token snapshot.
4.  **Logging**: An `audit.ActionSwitch` event is recorded.
