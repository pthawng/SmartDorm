# Information Architecture

This document describes the data objects in the SmartDorm system, derived from the database schema, to guide Frontend development.

## 1. Identity & Authorization Layer
Core objects for managing users, organizations (workspaces), and access control.

### User
The central identity for anyone interacting with the system.
- **Fields**: `id`, `email`, `full_name`, `phone`, `is_active`, `created_at`.
- **UI Context**: User Profile, User Management lists.

### Workspace
A logical container for properties and data. A user can be part of multiple workspaces.
- **Fields**: `id`, `name`, `created_by`.
- **UI Context**: Workspace switcher, Settings.

### Membership
Defines a user's role within a specific workspace.
- **Fields**: `user_id`, `workspace_id`, `role`.
- **Roles**: `owner`, `property_manager`, `staff`.
- **UI Context**: Team management within a workspace.

---

## 2. Asset Management (Domain Layer)
Objects representing the physical properties and individual units.

### Property
A building or facility containing multiple rooms.
- **Fields**: `id`, `name`, `address`, `city`, `description`.
- **Relationships**: Belongs to a **Workspace**.
- **UI Context**: Property List, Property Overview.

### Room
Individual rental units.
- **Fields**: `id`, `room_number`, `floor`, `area_sqm`, `monthly_price`, `status`, `description`.
- **Statuses**: `AVAILABLE`, `OCCUPIED`, `MAINTENANCE`.
- **Relationships**: Belongs to a **Property**.
- **UI Context**: Property Detail (Room list), Room Detail, Availability Dashboard.

---

## 3. Tenant & Contract Management
Managing the people who rent the rooms and their legal agreements.

### Renter
Information about the person occupying a room.
- **Fields**: `id`, `full_name`, `phone`, `email`, `id_number`, `date_of_birth`, `emergency_contact_name`, `emergency_contact_phone`.
- **Relationships**: Belongs to a **Workspace**; optionally linked to a **User**.
- **UI Context**: Renter Directory, Renter Detail.

### Contract
The rental agreement between the workspace and the renter for a specific room.
- **Fields**: `id`, `status`, `start_date`, `end_date`, `monthly_rent`, `deposit_amount`, `terms_notes`.
- **Statuses**: `DRAFT`, `ACTIVE`, `TERMINATED`, `EXPIRED`.
- **Relationships**: Links **Workspace**, **Room**, and **Renter**.
- **UI Context**: Leasing Dashboard, Contract Creation/Signing, Contract History.

---

## 4. Financials
Billing and payment tracking.

### Invoice
Monthly or periodic bills generated for a contract.
- **Fields**: `id`, `billing_period_start`, `billing_period_end`, `amount_due`, `status`, `due_date`, `paid_at`, `notes`.
- **Statuses**: `PENDING`, `PAID`, `OVERDUE`, `CANCELLED`.
- **Relationships**: Links **Workspace**, **Contract**, and **Renter**.
- **UI Context**: Financial Dashboard, Renter Bill Pay view, Invoice Detail.

---

## 5. Operations
Maintenance and issue tracking.

### Maintenance Request
Tickets submitted for room or property issues.
- **Fields**: `id`, `title`, `description`, `status`, `priority`, `resolution_note`, `resolved_at`.
- **Statuses**: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`.
- **Priorities**: `LOW`, `NORMAL`, `HIGH`, `URGENT`.
- **Relationships**: Links **Workspace**, **Room**, **Renter**, and **User** (reporter).
- **UI Context**: Maintenance Board (Kanban), Maintenance Issue Detail.
