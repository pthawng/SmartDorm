# SmartDorm — API Specifications

## Conventions

- Base URL: `/api/v1`
- Authentication: `Authorization: Bearer <JWT>` on all protected routes
- All request/response bodies: `Content-Type: application/json`
- All monetary values: `int64` (smallest currency unit)
- All IDs: UUID strings
- Timestamps: ISO 8601 UTC strings

### Standard Success Envelope
```json
{
  "success": true,
  "data": { ... }
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { "field": "reason" }
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

---

## Auth

> Public endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/token`.
> All other endpoints require `Authorization: Bearer <JWT>`.

---

### `POST /api/v1/auth/register`
Register a new user identity. No role is assigned at registration.
After registration, the user must create a workspace (to act as landlord) or wait to be linked as a renter.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "string (min 8 chars)",
  "full_name": "Nguyen Van A",
  "phone": "0901234567"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Nguyen Van A"
  }
}
```

---

### `POST /api/v1/auth/login`
Authenticate and receive the user's available contexts.
The client uses the returned contexts to call `POST /auth/token` and get a scoped JWT.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "Nguyen Van A"
    },
    "contexts": [
      {
        "type": "workspace",
        "workspace_id": "uuid",
        "workspace_name": "Nha Tro Minh Duc",
        "membership_role": "owner"
      },
      {
        "type": "renter",
        "renter_id": "uuid",
        "workspace_name": "Nha Tro B"
      },
      {
        "type": "admin",
        "admin_role": "support"
      }
    ]
  }
}
```

> `contexts` list contains all roles/memberships for this user across the platform.
> If a user has no contexts yet (new account), `contexts` is empty — they should create a workspace.

---

### `POST /api/v1/auth/token`
Mint a scoped JWT for a specific context. Call this after login to get an access token for operating in a particular role.

**Request Body — Workspace context:**
```json
{
  "context_type": "workspace",
  "workspace_id": "uuid"
}
```

**Request Body — Renter context:**
```json
{
  "context_type": "renter",
  "renter_id": "uuid"
}
```

**Request Body — Admin context:**
```json
{
  "context_type": "admin",
  "admin_role": "support"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "access_token": "jwt_string",
    "expires_at": "2026-03-13T17:00:00Z",
    "context": {
      "type": "workspace",
      "workspace_id": "uuid",
      "membership_role": "owner"
    }
  }
}
```

> **Errors:**
> - `403` if the user does not have the requested context (e.g., requesting a workspace they are not a member of)
> - `401` if the user is not authenticated (must call `/login` first — this endpoint requires a short-lived session token or the login call must be chained)

---

### `GET /api/v1/auth/me`
Get current authenticated user's identity (not context-specific).

**Auth:** Required

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string",
    "full_name": "string",
    "phone": "string"
  }
}
```

---

## Workspaces

### `POST /api/v1/workspaces`
Create a new workspace. The authenticated user becomes `owner` via a membership record.

**Auth:** Required — any authenticated user.

**Request Body:**
```json
{
  "name": "Nha Tro Minh Duc"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nha Tro Minh Duc",
    "created_by": "uuid",
    "membership_role": "owner"
  }
}
```

---

### `GET /api/v1/workspaces`
List all workspaces the authenticated user is a member of.

**Auth:** Required.

**Response `200`:** List of workspace objects with membership role.

---

## Properties

> All property endpoints require a **workspace context JWT** (`membership_role: owner`).
> Data is automatically scoped to `workspace_id` from the JWT — never from client input.

### `GET /api/v1/properties`
List all properties for the authenticated landlord.

**Query Params:** `page`, `page_size`

**Response `200`:** Paginated list of property objects.

---

### `POST /api/v1/properties`
Create a new property.

**Request Body:**
```json
{
  "name": "Nha Tro ABC",
  "address": "123 Nguyen Trai",
  "city": "Ho Chi Minh",
  "description": "optional"
}
```

**Response `201`:** Created property object.

---

### `GET /api/v1/properties/:id`
Get a single property by ID.

**Response `200`:** Property object.

---

### `PUT /api/v1/properties/:id`
Update property details.

**Request Body:** Same fields as POST (all optional).

**Response `200`:** Updated property object.

---

### `DELETE /api/v1/properties/:id`
Soft-delete a property. Fails if property has rooms with active contracts.

**Response `200`:** `{ "success": true }`

---

## Rooms

### `GET /api/v1/properties/:property_id/rooms`
List rooms within a property.

**Query Params:** `page`, `page_size`, `status` (filter)

**Response `200`:** Paginated list of room objects.

---

### `POST /api/v1/properties/:property_id/rooms`
Create a new room in a property.

**Request Body:**
```json
{
  "room_number": "101",
  "floor": 1,
  "area_sqm": 25.5,
  "monthly_price": 3000000,
  "description": "optional"
}
```

**Response `201`:** Created room object.

---

### `GET /api/v1/rooms/:id`
Get a single room.

**Response `200`:** Room object.

---

### `PUT /api/v1/rooms/:id`
Update room details. Cannot change `status` directly via this endpoint.

**Response `200`:** Updated room object.

---

### `DELETE /api/v1/rooms/:id`
Soft-delete a room. Fails if room has an active contract.

**Response `200`:** `{ "success": true }`

---

## Tenants

### `GET /api/v1/tenants`
List all tenants for the authenticated landlord.

**Query Params:** `page`, `page_size`, `search` (name/phone)

**Response `200`:** Paginated list of tenant objects.

---

### `POST /api/v1/tenants`
Create a new tenant profile.

**Request Body:**
```json
{
  "full_name": "Tran Thi B",
  "phone": "0912345678",
  "email": "tenant@example.com",
  "id_number": "001234567890",
  "date_of_birth": "1999-05-15",
  "emergency_contact_name": "Tran Van C",
  "emergency_contact_phone": "0987654321"
}
```

**Response `201`:** Created tenant object.

---

### `GET /api/v1/tenants/:id`
Get a single tenant.

**Response `200`:** Tenant object.

---

### `PUT /api/v1/tenants/:id`
Update tenant profile.

**Response `200`:** Updated tenant object.

---

### `DELETE /api/v1/tenants/:id`
Soft-delete a tenant. Fails if tenant has an active or draft contract.

**Response `200`:** `{ "success": true }`

---

## Contracts

### `GET /api/v1/contracts`
List all contracts for the authenticated landlord.

**Query Params:** `page`, `page_size`, `status`, `room_id`, `tenant_id`

**Response `200`:** Paginated list of contract objects.

---

### `POST /api/v1/contracts`
Create a new contract in `DRAFT` status.

**Request Body:**
```json
{
  "room_id": "uuid",
  "tenant_id": "uuid",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "monthly_rent": 3000000,
  "deposit_amount": 6000000,
  "terms_notes": "optional"
}
```

**Response `201`:** Created contract object.

---

### `GET /api/v1/contracts/:id`
Get a single contract.

**Response `200`:** Full contract object with room and tenant summary.

---

### `PUT /api/v1/contracts/:id`
Update a contract. Only allowed when status is `DRAFT`.

**Response `200`:** Updated contract object.

---

### `POST /api/v1/contracts/:id/activate`
Activate a draft contract. Room must be `AVAILABLE`.

**Request Body:** _(empty)_

**Response `200`:** Updated contract object with status `ACTIVE`.

---

### `POST /api/v1/contracts/:id/terminate`
Terminate an active contract.

**Request Body:**
```json
{
  "termination_reason": "Tenant moved out early",
  "termination_date": "2025-06-30"
}
```

**Response `200`:** Updated contract object with status `TERMINATED`.

---

## Invoices

### `GET /api/v1/invoices`
List all invoices for the authenticated landlord.

**Query Params:** `page`, `page_size`, `status`, `contract_id`

**Response `200`:** Paginated list of invoice objects.

---

### `POST /api/v1/invoices`
Generate an invoice for a billing period.

**Request Body:**
```json
{
  "contract_id": "uuid",
  "billing_period_start": "2025-01-01",
  "billing_period_end": "2025-01-31",
  "due_date": "2025-01-15",
  "notes": "optional"
}
```

**Response `201`:** Created invoice object.

---

### `GET /api/v1/invoices/:id`
Get a single invoice.

**Response `200`:** Invoice object.

---

### `POST /api/v1/invoices/:id/mark-paid`
Mark an invoice as paid.

**Request Body:**
```json
{
  "paid_at": "2025-01-10T09:00:00Z"
}
```

**Response `200`:** Updated invoice with status `PAID`.

---

### `POST /api/v1/invoices/:id/cancel`
Cancel an invoice.

**Request Body:**
```json
{
  "cancellation_reason": "Contract terminated before period end"
}
```

**Response `200`:** Updated invoice with status `CANCELLED`.

---

## Maintenance Requests

### `GET /api/v1/maintenance`
List maintenance requests. Landlord sees all; tenant sees only their own.

**Query Params:** `page`, `page_size`, `status`, `room_id`, `priority`

**Response `200`:** Paginated list of maintenance request objects.

---

### `POST /api/v1/maintenance`
Submit a new maintenance request.

**Request Body:**
```json
{
  "room_id": "uuid",
  "title": "Broken AC",
  "description": "The air conditioner stopped working",
  "priority": "HIGH"
}
```

**Response `201`:** Created maintenance request object.

---

### `GET /api/v1/maintenance/:id`
Get a single maintenance request.

**Response `200`:** Maintenance request object.

---

### `PUT /api/v1/maintenance/:id/status`
Update the status of a maintenance request. Landlord only.

**Request Body:**
```json
{
  "status": "IN_PROGRESS | RESOLVED | CLOSED",
  "resolution_note": "Required when RESOLVED or CLOSED"
}
```

**Response `200`:** Updated maintenance request object.

---

## Tenant Portal (`/me`)

> All `/me` endpoints require a valid JWT with `role = TENANT`.
> Data is automatically scoped to the authenticated tenant via `tenant_id` from the JWT claim.
> Tenants cannot access any `/properties`, `/rooms`, `/tenants`, `/contracts`, or `/invoices` landlord endpoints.

---

### `GET /api/v1/me/profile`
Get the authenticated tenant's profile.

**Auth:** Required — `TENANT` role.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "Tran Thi B",
    "phone": "0912345678",
    "email": "tenant@example.com"
  }
}
```

---

### `GET /api/v1/me/contracts`
List contracts belonging to the authenticated tenant.

**Auth:** Required — `TENANT` role.

**Query Params:** `page`, `page_size`, `status`

**Response `200`:** Paginated list of contract objects (read-only view — no landlord-sensitive fields).

> Returns contracts where `tenant_id` matches the JWT `tenant_id`. Only `ACTIVE` and `EXPIRED` contracts are returned (no `DRAFT` — tenants should not see unsigned drafts).

---

### `GET /api/v1/me/contracts/:id`
Get a single contract by ID, if it belongs to the authenticated tenant.

**Auth:** Required — `TENANT` role.

**Response `200`:** Full contract object.

**Error:** `404` if contract does not belong to this tenant (prevents enumeration).

---

### `GET /api/v1/me/invoices`
List invoices for the authenticated tenant's contracts.

**Auth:** Required — `TENANT` role.

**Query Params:** `page`, `page_size`, `status`, `contract_id`

**Response `200`:** Paginated list of invoice objects.

> Resolved via `tenant_id` → their contracts → invoices on those contracts. Returns invoices for all tenant contracts if `contract_id` is not specified.

---

### `GET /api/v1/me/invoices/:id`
Get a single invoice by ID, if it belongs to the authenticated tenant's contract.

**Auth:** Required — `TENANT` role.

**Response `200`:** Invoice object.

**Error:** `404` if invoice does not belong to this tenant's contracts.

---

### `POST /api/v1/me/maintenance`
Submit a maintenance request. The `room_id` must correspond to a room the tenant has an active contract for.

**Auth:** Required — `TENANT` role.

**Request Body:**
```json
{
  "room_id": "uuid",
  "title": "Broken AC",
  "description": "The air conditioner stopped working since yesterday.",
  "priority": "HIGH"
}
```

**Validation:**
- `room_id` must correspond to a room in one of the tenant's `ACTIVE` contracts. Returns `403` otherwise.
- `priority` must be one of: `LOW`, `NORMAL`, `HIGH`, `URGENT`.

**Response `201`:** Created maintenance request object.

---

### `GET /api/v1/me/maintenance`
List maintenance requests submitted by the authenticated tenant.

**Auth:** Required — `TENANT` role.

**Query Params:** `page`, `page_size`, `status`

**Response `200`:** Paginated list of maintenance request objects (only requests submitted by this tenant).

---

### `GET /api/v1/me/maintenance/:id`
Get a single maintenance request submitted by the authenticated tenant.

**Auth:** Required — `TENANT` role.

**Response `200`:** Maintenance request object.

**Error:** `404` if request was not submitted by this tenant.
