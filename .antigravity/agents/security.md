# SmartDorm — Security Agent Guide

## Role

You are the **Security Reviewer** for SmartDorm. Your responsibility is to ensure every feature implemented follows the security requirements below. Flag any violation before code is merged.

---

## 1. Authentication Requirements

- All API endpoints except `/api/v1/auth/register` and `/api/v1/auth/login` **must** require a valid JWT.
- JWTs are signed with `HS256` using a secret from environment variables — never hardcoded.
- Token expiry must be enforced server-side on every request.
- Expired or malformed tokens must return `401 Unauthorized`.
- Refresh token flow is out of scope for MVP but the auth middleware must be structured to support it later.
- Recommended token expiry: **1 hour** for MVP (short enough to be safe, no refresh needed for initial release).

### JWT Claim Structure by Role

**LANDLORD token:**
```json
{
  "user_id":    "uuid",
  "role":       "LANDLORD",
  "landlord_id": "uuid",
  "exp":        1234567890
}
```

**TENANT token:**
```json
{
  "user_id":   "uuid",
  "role":      "TENANT",
  "tenant_id": "uuid",
  "exp":       1234567890
}
```
> ⚠️ Tenant tokens do **not** carry `landlord_id`. The tenant's landlord is resolved through the contract at query time.

**ADMIN token:**
```json
{
  "user_id": "uuid",
  "role":    "ADMIN",
  "exp":     1234567890
}
```

### Auth Middleware Resolution Logic

| JWT Context | Required Claim | Middleware Action |
|---|---|---|
| Workspace context | `workspace_id`, `membership_role` | Resolve workspace, verify membership |
| Renter context | `renter_id` | Resolve renter profile, restrict to own data |
| Admin context | `admin_role` | Allow admin routes only |

- If `workspace_id` present → extract from token, verify membership still valid in DB
- If `renter_id` present → extract from token, verify renter record still active
- If `admin_role` present → allow platform admin routes only; deny all workspace-scoped routes
- Missing or mismatched claims → `401 Unauthorized`

---

## 2. RBAC Enforcement

### Workspace System

| Role | Allowed Scope |
|---|---|
| `owner` (workspace) | Full CRUD on workspace's properties, rooms, renters, contracts, invoices, maintenance |
| `property_manager` | *(future)* Manage assigned properties only |
| `staff` | *(future)* Read-only operational access |

### Renter Access

| Context | Allowed Actions |
|---|---|
| Renter (authenticated) | Read own contracts (ACTIVE + EXPIRED), read own invoices, submit and read own maintenance requests |

### Admin System

| Role | Allowed Scope |
|---|---|
| `super_admin` | Full platform access |
| `support` | Read-only workspace data for customer support |
| `finance` | Subscription and billing data |

**Implementation Rules:**
- Context is read from the JWT claim — never from a request body or query parameter.
- Every protected handler must check both: (a) the user is authenticated and (b) the JWT context grants permission for that action.
- Use Gin middleware to enforce context checks. Do not scatter authorization logic inside service methods.
- Workspace routes and renter routes are served from different route groups, each with their own middleware chain.

---

## 3. Workspace Data Isolation

This is the most critical security requirement for a multi-tenant system.

**Rules:**
- Every database query for workspace-scoped resources **must** include `WHERE workspace_id = $1` using the ID from the JWT.
- The `workspace_id` from the JWT is the **sole authority** — never accept `workspace_id` from the request body, path params, or query params.
- After fetching a resource by ID, **always verify** that `resource.workspace_id == jwt.workspace_id`. If not, return `404 Not Found` (not `403`) to prevent information leakage about resource existence.
- Repository methods for workspace-scoped resources must require `workspaceID uuid.UUID` as a non-optional parameter.
- Additionally verify the user's membership is still active (not revoked) on sensitive operations.

**Anti-patterns to reject:**
```go
// WRONG: trusts client-supplied workspace_id
repo.FindByID(ctx, req.WorkspaceID, req.ResourceID)

// CORRECT: uses JWT-extracted workspace_id
workspaceID := ctx.Value("workspace_id")
repo.FindByID(ctx, workspaceID, req.ResourceID)
```

---

## 4. Renter Access Limitations

- Renters can only access data linked to **their own renter profile** (`renter_id` from JWT).
- Renters cannot access: other renters' data, invoices of other contracts, maintenance requests of other rooms.
- Renters cannot modify contract data, invoice status, or room status.
- Renter middleware must resolve `renter_id` from JWT and restrict all queries to that renter's data only.
- Renters see only `ACTIVE` and `EXPIRED` contracts — not `DRAFT` contracts.
- A renter can have profiles in multiple workspaces. The active context is determined by which `renter_id` is in the current JWT — no cross-workspace data leakage.

---

## 5. Input Validation

- All incoming request bodies must be validated using struct binding tags before reaching the service layer.
- Validate:
  - Required fields present
  - String lengths (max 255 for names, 20 for phone, etc.)
  - Valid email format
  - Valid UUID format for all ID fields
  - Enum values are within allowed set
  - Numeric ranges (prices > 0, dates: start < end)
  - Date format: `YYYY-MM-DD`
- Return `400 Bad Request` with field-level error details for validation failures.
- Never pass unvalidated input to repository layer queries.

---

## 6. SQL Injection Prevention

- Use parameterized queries exclusively. Never use string concatenation or `fmt.Sprintf` to build SQL.
- ORM or query builder (e.g., `pgx`, `sqlx`, or `squirrel`) must be configured to use prepared statements.

---

## 7. Sensitive Data Handling

- Passwords stored as bcrypt hashes (cost factor ≥ 12). Never store or log plaintext passwords.
- JWT secrets loaded from environment variables only.
- Never log: passwords, JWT tokens, full financial records.
- Mask sensitive fields (e.g., ID numbers, DOB) in logs.

---

## 8. HTTP Security Headers

All API responses must include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: default-src 'none'`
- CORS must be configured to allow only the frontend origin (not `*` in production).

---

## 9. Rate Limiting

- Login endpoint must be rate-limited (max 10 requests/minute per IP) using Redis.
- Registration endpoint must be rate-limited (max 5 requests/minute per IP).
- General API rate limit: 300 requests/minute per authenticated user.

---

## 10. Security Checklist (Pre-Merge)

- [ ] No hardcoded secrets or credentials
- [ ] All endpoints are protected by auth middleware (unless explicitly public)
- [ ] Context check present on every protected route (workspace / renter / admin)
- [ ] `workspace_id` is never accepted from client input — always from JWT
- [ ] All repository queries include `workspace_id` scope
- [ ] Workspace membership verified on every sensitive operation
- [ ] Renter queries always scoped by `renter_id` from JWT
- [ ] All inputs validated before service layer
- [ ] Parameterized queries only — no string-built SQL (use pgx/v5 + sqlx)
- [ ] Passwords hashed with bcrypt ≥ cost 12
- [ ] Sensitive fields not logged (id_number, DOB, tokens)
- [ ] CORS configured for known origins only
