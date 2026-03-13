# SmartDorm — Business Logic

## 1. Identity & Authorization Model

SmartDorm uses a **two-layer authorization model** with a single identity system:

```
Identity Layer
    users
      │
      ├── memberships  →  workspace roles  (product/user system)
      │
      └── admin_roles  →  platform roles   (internal admin system)
```

### 1.1 Workspace Roles (User System)

| Role | Context | Permissions |
|---|---|---|
| `owner` | Within a workspace | Full CRUD on workspace's properties, rooms, renters, contracts, invoices, maintenance |
| `property_manager` | Within a workspace | *(future)* Manage assigned properties only |
| `staff` | Within a workspace | *(future)* Read-only operational access |

> The initial workspace creator is automatically assigned `owner` role via `memberships`.

### 1.2 Renter Access

Renters are **not** workspace members. They access the system through their own **renter profile** linked to a `user` account.

| Context | Permissions |
|---|---|
| Renter (authenticated) | Read own contracts (ACTIVE + EXPIRED only), read own invoices, submit and read own maintenance requests |

### 1.3 Platform Admin Roles (Admin System)

| Role | Permissions |
|---|---|
| `super_admin` | Full system access — workspaces, users, billing |
| `support` | Read-only access to workspace data for customer support |
| `finance` | Access to subscription and billing data |

> Admin users do **not** belong to any workspace. Admin endpoints are completely separate from the user-facing API.

### 1.4 Dual-Role: One User, Multiple Contexts

A single user account can simultaneously:
- Be an `owner` of one or more workspaces (acting as landlord)
- Be a `renter` in another workspace (renting a room from a different landlord)
- Hold an `admin_role` on the platform

```
User: Nguyen Van A
  ├── memberships → Workspace "Nha Tro A", role = 'owner'  [Landlord context]
  └── renters.user_id → "Nha Tro B"                        [Renter context]
```

At login, the system returns all available contexts. The user (or client app) selects which context to operate in, and receives a JWT scoped to that context.

---

## 2. Domain Entities

### User
Represents any authenticated identity in the system.
- Fields: `id`, `email`, `password_hash`, `full_name`, `phone`, `created_at`
- No embedded role — authorization is determined by `memberships` and `admin_roles`.

### Workspace
A SaaS workspace operated by a landlord. All rental domain data is workspace-scoped.
- Has many `Properties`.
- Has many `Members` (via `memberships`).
- Has many `Renters`.

### Membership
Links a user to a workspace with a role.
- One user can have memberships in multiple workspaces.
- Each workspace-user pair is unique (cannot have two roles in same workspace — future: composite role support).

### Property
A physical location managed within a workspace (e.g., a building or house).
- Belongs to one `Workspace`.
- Has many `Rooms`.

### Room
An individual rentable unit within a Property.
- Belongs to one `Property`.
- Has a `status`: `AVAILABLE`, `OCCUPIED`, `MAINTENANCE`.
- Has a `monthly_price` (int64, VND).

### Renter
A renter profile managed within a workspace. Previously called "Tenant" in domain — renamed to avoid naming conflict with SaaS "tenant" (workspace).
- Optionally linked to a `User` account (a renter may not have a login yet).
- Belongs to one `Workspace` (a renter profile is workspace-scoped).
- Has personal info: `full_name`, `phone`, `id_number`, `date_of_birth`.

### Contract
A formal rental agreement between a workspace and a renter for a specific room.
- Belongs to one `Workspace`, one `Renter`, one `Room`.
- Has a lifecycle: `DRAFT` → `ACTIVE` → `TERMINATED` / `EXPIRED`.
- Defines: `start_date`, `end_date`, `monthly_rent` (int64), `deposit_amount` (int64).

### Invoice
A periodic billing record generated from an active contract.
- Belongs to one `Contract`, one `Workspace`, one `Renter` (denormalized).
- Contains: `billing_period_start`, `billing_period_end`, `amount_due` (int64), `status`.
- Status: `PENDING` → `PAID` / `OVERDUE`; can be `CANCELLED`.

### MaintenanceRequest
A repair or service request submitted for a room.
- Belongs to one `Room` and one `Workspace`.
- Optionally linked to a `Renter`.
- Status: `OPEN` → `IN_PROGRESS` → `RESOLVED` / `CLOSED`.

---

## 3. Business Rules

### Workspace
- A user becomes `owner` of a workspace automatically upon creating it.
- A workspace cannot be deleted if it has active contracts.

### Property & Room
- Workspace members (`owner`) can only manage properties within their workspace.
- A room cannot be deleted if it has an active contract.
- A room's status automatically becomes `OCCUPIED` when a contract is activated, and reverts to `AVAILABLE` when the contract ends or is terminated.

### Renter
- A renter profile is owned by a workspace; a renter profile cannot belong to multiple workspaces.
- A renter cannot be deleted if they have an active or draft contract.
- A `user` can be linked to multiple renter profiles across different workspaces (dual-role support).

### Contract
- Only one `ACTIVE` contract is allowed per room at any time.
- A contract cannot be activated if the room is `OCCUPIED` or `MAINTENANCE`.
- `start_date` must be before `end_date`.
- `monthly_rent` must be greater than zero.
- Terminating a contract requires a `termination_reason` and `termination_date`.
- When a contract expires (`end_date` reached), it transitions to `EXPIRED` via a scheduled job.
- Contracts cannot be deleted once created.

### Invoice
- Invoices are generated per billing cycle (monthly by default).
- Only one invoice per contract per billing period is allowed (unique constraint).
- An invoice's `amount_due` is set at generation time from the contract's `monthly_rent`; it is **server-computed** and cannot be supplied or edited by the client.
- Only a workspace `owner` (or authorized member) can mark an invoice as `PAID`.
- Invoices cannot be deleted once created; they can only be cancelled with a reason.
- An invoice transitions to `OVERDUE` when `due_date` passes and status is still `PENDING` (via scheduler).

### Maintenance
- Any user with access to the room (renter or workspace member) can submit a maintenance request.
- Only the workspace `owner` (or property_manager) can update the status of a request.
- Closing or resolving a request requires a `resolution_note`.

---

## 4. Workflows

### Workspace Creation

```
User registers
      │
      ▼
POST /workspaces { name }
      │
      ▼
Workspace created
      │
      ▼
Membership created: user_id + workspace_id + role = 'owner'
```

### Contract Lifecycle

```
[DRAFT] ──activate()──► [ACTIVE] ──terminate()──► [TERMINATED]
                              │
                         end_date reached (scheduler)
                              │
                              ▼
                          [EXPIRED]
```

- `DRAFT`: Contract created but not yet in effect. Room status unchanged.
- `ACTIVE`: Contract in force. Room status → `OCCUPIED`. Invoices can be generated.
- `TERMINATED`: Ended early by workspace owner. Room status → `AVAILABLE`.
- `EXPIRED`: Naturally ended at `end_date`. Room status → `AVAILABLE`.

### Invoice Generation Workflow

```
Active Contract exists
       │
       ▼
Owner triggers invoice generation (or scheduler runs)
       │
       ▼
System checks: no existing invoice for this period?
       │
  YES  │   NO → Return error: DUPLICATE_INVOICE
       ▼
amount_due = contract.monthly_rent (server-computed snapshot)
Invoice created with status PENDING
       │
       ▼
[Event: InvoiceGenerated] → Notify relevant consumers
       │
Owner marks as PAID
       ▼
Invoice status → PAID
[Event: InvoicePaid]
```

### Maintenance Request Workflow

```
Renter / Owner submits request
       │
       ▼
Status: OPEN
       │
Owner begins work
       ▼
Status: IN_PROGRESS
       │
Work complete
       ▼
Status: RESOLVED ──► Owner closes ──► CLOSED
```

---

## 5. Billing Logic

- `amount_due` on an invoice = `contract.monthly_rent` at the time of generation (snapshot).
- Future phases may include utility charges (water, electricity) as line items.
- All amounts in `int64` (smallest currency unit — VND for Vietnamese market).
- Pro-rating (partial month billing) is **out of scope for MVP**.
- Late payment fees are **out of scope for MVP**.

---

## 6. Multi-Tenancy Isolation

- Every domain entity stores `workspace_id` as a foreign key.
- All queries are scoped by `workspace_id` extracted from the authenticated JWT.
- Renters can only view data associated with their own contracts within a workspace.
- Cross-workspace data access is forbidden at both the repository and service layers.
