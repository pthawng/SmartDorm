# SmartDorm — Database Schema

## Conventions

- All primary keys: `UUID` (gen_random_uuid())
- All timestamps: `TIMESTAMPTZ`, stored in UTC
- Soft deletes: `deleted_at TIMESTAMPTZ NULL` on applicable tables
- Money columns: `BIGINT` (int64, smallest currency unit — VND)
- Enum types defined as PostgreSQL constrained `VARCHAR` with CHECK

---

## Identity & Authorization Layer

---

### `users`
Single identity record for every person in the system.
No `role` column — authorization is handled via `memberships` and `admin_roles`.

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK, DEFAULT gen_random_uuid() |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |
| `password_hash` | TEXT | NOT NULL |
| `full_name` | VARCHAR(255) | NOT NULL |
| `phone` | VARCHAR(20) | NULL |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `deleted_at` | TIMESTAMPTZ | NULL |

**Indexes:**
- `idx_users_email` on `email`

---

### `workspaces`
A SaaS workspace owned by a landlord. Represents the landlord's isolated data environment.
One user (owner) can own multiple workspaces; multiple users can be members of one workspace (future: staff/property_manager roles).

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK, DEFAULT gen_random_uuid() |
| `name` | VARCHAR(255) | NOT NULL — e.g. "Nha Tro Minh Duc" |
| `created_by` | UUID | NOT NULL, FK → users(id) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `deleted_at` | TIMESTAMPTZ | NULL |

**Indexes:**
- `idx_workspaces_created_by` on `created_by`

---

### `memberships`
Links a user to a workspace with a specific role.
A user can belong to multiple workspaces (e.g., owns one workspace, member of another).

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | NOT NULL, FK → users(id) |
| `workspace_id` | UUID | NOT NULL, FK → workspaces(id) |
| `role` | VARCHAR(30) | NOT NULL, CHECK IN ('owner','property_manager','staff') |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

**Constraints:**
- `uq_memberships_user_workspace` UNIQUE (`user_id`, `workspace_id`)

**Indexes:**
- `idx_memberships_user_id` on `user_id`
- `idx_memberships_workspace_id` on `workspace_id`

> **Role definitions:**
> - `owner` — full control over workspace (the primary landlord)
> - `property_manager` — future: manage specific properties within workspace
> - `staff` — future: limited operational access

---

### `admin_roles`
Platform-level admin roles. Admin users do **not** belong to any workspace.

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `user_id` | UUID | NOT NULL, FK → users(id) |
| `role` | VARCHAR(30) | NOT NULL, CHECK IN ('super_admin','support','finance') |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

**Constraints:**
- `uq_admin_roles_user_role` UNIQUE (`user_id`, `role`)

**Indexes:**
- `idx_admin_roles_user_id` on `user_id`

---

## Domain Layer

---

### `properties`
A physical location managed within a workspace.

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `workspace_id` | UUID | NOT NULL, FK → workspaces(id) |
| `name` | VARCHAR(255) | NOT NULL |
| `address` | TEXT | NOT NULL |
| `city` | VARCHAR(100) | NOT NULL |
| `description` | TEXT | NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `deleted_at` | TIMESTAMPTZ | NULL |

**Indexes:**
- `idx_properties_workspace_id` on `workspace_id`

---

### `rooms`
An individual rentable unit within a property.

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `property_id` | UUID | NOT NULL, FK → properties(id) |
| `workspace_id` | UUID | NOT NULL, FK → workspaces(id) — denormalized for query isolation |
| `room_number` | VARCHAR(50) | NOT NULL |
| `floor` | SMALLINT | NULL |
| `area_sqm` | NUMERIC(6,2) | NULL |
| `monthly_price` | BIGINT | NOT NULL, CHECK > 0 |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'AVAILABLE', CHECK IN ('AVAILABLE','OCCUPIED','MAINTENANCE') |
| `description` | TEXT | NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `deleted_at` | TIMESTAMPTZ | NULL |

**Constraints:**
- `uq_rooms_property_room_number` UNIQUE (`property_id`, `room_number`) WHERE `deleted_at` IS NULL

**Indexes:**
- `idx_rooms_property_id` on `property_id`
- `idx_rooms_workspace_id` on `workspace_id`
- `idx_rooms_status` on `status`

---

### `renters`
A renter profile managed within a workspace (formerly `tenants` in domain).
Renamed to avoid conflict with the SaaS "tenant" (workspace) concept.

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `workspace_id` | UUID | NOT NULL, FK → workspaces(id) |
| `user_id` | UUID | NULL, FK → users(id) — linked if renter has a login account |
| `full_name` | VARCHAR(255) | NOT NULL |
| `phone` | VARCHAR(20) | NOT NULL |
| `email` | VARCHAR(255) | NULL |
| `id_number` | VARCHAR(50) | NULL — national ID / passport |
| `date_of_birth` | DATE | NULL |
| `emergency_contact_name` | VARCHAR(255) | NULL |
| `emergency_contact_phone` | VARCHAR(20) | NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `deleted_at` | TIMESTAMPTZ | NULL |

**Indexes:**
- `idx_renters_workspace_id` on `workspace_id`
- `idx_renters_user_id` on `user_id`

---

### `contracts`
A formal rental agreement between a workspace and a renter for a specific room.

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `workspace_id` | UUID | NOT NULL, FK → workspaces(id) |
| `room_id` | UUID | NOT NULL, FK → rooms(id) |
| `renter_id` | UUID | NOT NULL, FK → renters(id) |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'DRAFT', CHECK IN ('DRAFT','ACTIVE','TERMINATED','EXPIRED') |
| `start_date` | DATE | NOT NULL |
| `end_date` | DATE | NOT NULL |
| `monthly_rent` | BIGINT | NOT NULL, CHECK > 0 |
| `deposit_amount` | BIGINT | NOT NULL, DEFAULT 0, CHECK >= 0 |
| `terms_notes` | TEXT | NULL |
| `activated_at` | TIMESTAMPTZ | NULL |
| `terminated_at` | TIMESTAMPTZ | NULL |
| `termination_date` | DATE | NULL — effective date of termination (may differ from terminated_at) |
| `termination_reason` | TEXT | NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

**Constraints:**
- `ck_contracts_dates` CHECK (`start_date` < `end_date`)
- `uq_contracts_room_active` UNIQUE (`room_id`) WHERE `status` = 'ACTIVE' — only one active contract per room

**Indexes:**
- `idx_contracts_workspace_id` on `workspace_id`
- `idx_contracts_room_id` on `room_id`
- `idx_contracts_renter_id` on `renter_id`
- `idx_contracts_status` on `status`
- `idx_contracts_workspace_status` on `(workspace_id, status)` — composite for common filter pattern

---

### `invoices`
A periodic billing record generated from an active contract.

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `workspace_id` | UUID | NOT NULL, FK → workspaces(id) |
| `contract_id` | UUID | NOT NULL, FK → contracts(id) |
| `renter_id` | UUID | NOT NULL, FK → renters(id) — denormalized for direct renter queries |
| `billing_period_start` | DATE | NOT NULL |
| `billing_period_end` | DATE | NOT NULL |
| `amount_due` | BIGINT | NOT NULL, CHECK > 0 |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING', CHECK IN ('PENDING','PAID','OVERDUE','CANCELLED') |
| `paid_at` | TIMESTAMPTZ | NULL |
| `due_date` | DATE | NOT NULL |
| `notes` | TEXT | NULL |
| `cancellation_reason` | TEXT | NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

**Constraints:**
- `uq_invoices_contract_period` UNIQUE (`contract_id`, `billing_period_start`)
- `ck_invoices_period` CHECK (`billing_period_start` < `billing_period_end`)
- `ck_invoices_due_date` CHECK (`due_date` >= `billing_period_start`)

**Indexes:**
- `idx_invoices_workspace_id` on `workspace_id`
- `idx_invoices_contract_id` on `contract_id`
- `idx_invoices_renter_id` on `renter_id`
- `idx_invoices_status` on `status`
- `idx_invoices_due_date` on `due_date`
- `idx_invoices_workspace_status` on `(workspace_id, status)` — composite for dashboard queries

---

### `maintenance_requests`
A repair or service request submitted for a room.

| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `workspace_id` | UUID | NOT NULL, FK → workspaces(id) |
| `room_id` | UUID | NOT NULL, FK → rooms(id) |
| `renter_id` | UUID | NULL, FK → renters(id) — set if submitted by a renter |
| `submitted_by_user_id` | UUID | NOT NULL, FK → users(id) |
| `title` | VARCHAR(255) | NOT NULL |
| `description` | TEXT | NOT NULL |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'OPEN', CHECK IN ('OPEN','IN_PROGRESS','RESOLVED','CLOSED') |
| `priority` | VARCHAR(20) | NOT NULL, DEFAULT 'NORMAL', CHECK IN ('LOW','NORMAL','HIGH','URGENT') |
| `resolution_note` | TEXT | NULL |
| `resolved_at` | TIMESTAMPTZ | NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

**Indexes:**
- `idx_maintenance_workspace_id` on `workspace_id`
- `idx_maintenance_room_id` on `room_id`
- `idx_maintenance_status` on `status`

---

## Ownership Hierarchy

```
users (Identity)
  │
  ├── memberships ──────────────────── workspaces (SaaS workspace)
  │     role: owner / property_manager   └── properties
  │                                            └── rooms
  │                                                 ├── contracts ──► renters
  │                                                 │     └── invoices
  │                                                 └── maintenance_requests
  │
  ├── renters.user_id ─────────────── links user identity to a renter profile
  │     (optional — renter may not have login)
  │
  └── admin_roles ─────────────────── platform-level admin (not workspace-scoped)
```

### Dual-role example
```
User: Nguyen Van A (user_id = X)
  │
  ├── memberships: workspace_id = "Nha Tro A", role = 'owner'   → acts as landlord
  │
  └── renters:     workspace_id = "Nha Tro B", user_id = X      → acts as renter elsewhere
```

---

## Key Relationships Summary

| Relationship | Type | Notes |
|---|---|---|
| User → Workspace | Many-to-Many via `memberships` | A user can own/manage multiple workspaces |
| Workspace → Properties | One-to-Many | A workspace has many properties |
| Property → Rooms | One-to-Many | A property has many rooms |
| Room → Workspace | Many-to-One | Denormalized for isolation queries |
| Renter → Workspace | Many-to-One | Renter profile is workspace-scoped |
| Renter → User | Many-to-One (nullable) | Optional: renter may have a login |
| Contract → Room | Many-to-One | One active contract per room at a time |
| Contract → Renter | Many-to-One | A renter can have multiple contracts over time |
| Invoice → Contract | Many-to-One | One invoice per contract per billing period |
| Invoice → Renter | Many-to-One | Denormalized for direct renter queries |
| MaintenanceRequest → Room | Many-to-One | Many requests per room over time |
| User → AdminRole | One-to-Many | A user can have multiple admin roles |
