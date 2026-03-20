# Security Rules & Invariants

## 🏗️ Invariant Enforcement

### 1. The "Elite" Consistency Rule
Implemented in `middleware.ValidateContext()`, this rule ensures that the security context never enters an "impossible" state:
- **Rule A**: `Role == LANDLORD` ➡️ `WorkspaceID != nil`.
- **Rule B**: `Role == TENANT` ➡️ `WorkspaceID == nil`.

If an Access Token fails this check, it is rejected immediately, preventing logic leaks in downstream handlers.

### 2. Privilege Escalation Prevention
User inputs in `/auth/token` are treated as **Untrusted**.
- Any request for a `LANDLORD` context **must** be validated against the `memberships` table in real-time.
- Ownership of the `workspace_id` is verified before the token is signed.

### 4. Global Session Revocation
The system supports instant session termination (Global Logout) through the `security_stamp` mechanism.
- **Triggers**: Password updates, account deactivation, or explicit forced logout.
- **Enforcement**: Revocation is checked during every token rotation/refresh.

### 5. Stale Context Protection
If a user is removed from a workspace, their next token refresh will fail even if their refresh token hasn't expired. This prevents "Zombies" (users retaining access to a workspace after being fired).
- This is checked during every token rotation by re-verifying the `memberships` table for the snapshotted `workspace_id`.

## 📜 Audit Logging Strategy
We only log **Mutations** (State Changes). Read-only requests are not logged to prevent log bloat.

| Action | Logged Data |
| :--- | :--- |
| `CREATE` | User, ResourceType, ResourceID, WorkspaceID |
| `UPDATE` | User, ResourceType, ResourceID, WorkspaceID |
| `SWITCH_ROLE` | User, NewRole, TargetWorkspaceID |
| `SIGN / PAY` | User, Contract/Invoice ID, WorkspaceID |

## 🚫 Secure Fallback Logic
In `HasPermission(role, permission)`, our code implements a **Default Deny** policy:
```go
perms, ok := RolePermissions[role]
if !ok {
    // Log warning: Undefined role encountered
    return false // DENY
}
```
This ensures that if a new role is introduced but not mapped, it has zero permissions by default.
