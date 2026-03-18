# SmartDorm — Screen → Page Mapping (Final)

**Project**: SmartDorm Frontend  
**Architecture**: Feature-based + Domain-driven (React/Vite/TypeScript)  
**Status**: Production-Ready / Finalized

---

## 🏗 Updated Route Structure

```bash
pages/
├── (marketing)/                # Public: Landing, Search, Detail
│   ├── _layout.tsx
│   ├── landing.tsx
│   ├── search.tsx
│   ├── property-detail.tsx
│   └── room-detail.tsx
├── (auth)/                     # Auth: Login, Register
│   ├── login.tsx
│   └── register.tsx
└── (dashboard)/                # App: All Authenticated Screens
    ├── _layout.tsx
    ├── home.tsx                # Admin Dashboard
    ├── tenant-home.tsx         # Tenant Dashboard
    ├── workspaces.tsx          # Workspace Switcher
    ├── properties/
    │   └── list.tsx
    ├── rooms/
    │   ├── list.tsx
    │   └── edit.tsx
    ├── contracts/
    │   ├── list.tsx
    │   ├── apply.tsx
    │   └── review.tsx
    ├── invoices/
    │   ├── list.tsx
    │   ├── detail.tsx
    │   └── pay.tsx
    ├── maintenance/
    │   ├── list.tsx            # Kanban Board
    │   ├── new.tsx
    │   └── detail.tsx
    ├── settings/
    │   ├── profile.tsx
    │   ├── workspace.tsx
    │   └── team.tsx
    └── renters/
        ├── list.tsx
        └── detail.tsx
```

---

## 🗺 Production Mapping

| Screen Name | Route Path | Page File | Feature Module | Entities | API Endpoints |
|---|---|---|---|---|---|
| **Landing Page** | `/` | `pages/(marketing)/landing.tsx` | `features/property-search` | `property`, `room` | `GET /properties` |
| **Search Results** | `/search` | `pages/(marketing)/search.tsx` | `features/property-search` | `property`, `room` | `GET /properties`, `GET /rooms` |
| **Property Overview** | `/properties/:id` | `pages/(marketing)/property-detail.tsx` | `features/property-detail` | `property`, `room` | `GET /properties/{id}` |
| **Room Detail** | `/rooms/:id` | `pages/(marketing)/room-detail.tsx` | `features/room-detail` | `room`, `property` | `GET /rooms/{id}` |
| **Login** | `/login` | `pages/(auth)/login.tsx` | `features/auth-form` | `user` | `POST /auth/login` |
| **Registration** | `/register` | `pages/(auth)/register.tsx` | `features/auth-form` | `user` | `POST /auth/register` |
| **Admin Dashboard** | `/dashboard` | `pages/(dashboard)/home.tsx` | `features/dashboard-overview` | `room`, `invoice`, `contract` | `GET /stats/dashboard` |
| **Tenant Dashboard** | `/dashboard/tenant` | `pages/(dashboard)/tenant-home.tsx` | `features/tenant-dashboard` | `contract`, `invoice`, `maintenance_request` | `GET /contracts?status=ACTIVE` |
| **Workspace Select** | `/dashboard/workspaces` | `pages/(dashboard)/workspaces.tsx` | `features/workspace-switcher` | `workspace`, `membership` | `GET /workspaces` |
| **Property Master** | `/dashboard/properties` | `pages/(dashboard)/properties/list.tsx` | `features/property-list` | `property`, `workspace` | `GET /properties` |
| **Room Master** | `/dashboard/rooms` | `pages/(dashboard)/rooms/list.tsx` | `features/room-management` | `room`, `property` | `GET /rooms` |
| **Room Editor** | `/dashboard/rooms/:id/edit` | `pages/(dashboard)/rooms/edit.tsx` | `features/room-management` | `room` | `PATCH /rooms/{id}` |
| **Contract Search** | `/dashboard/contracts` | `pages/(dashboard)/contracts/list.tsx` | `features/contract-list` | `contract`, `renter`, `room` | `GET /contracts` |
| **Lease Application** | `/dashboard/contracts/new` | `pages/(dashboard)/contracts/apply.tsx` | `features/contract-sign-flow` | `contract`, `renter`, `room` | `POST /contracts` |
| **Signature Portal** | `/dashboard/contracts/:id/review` | `pages/(dashboard)/contracts/review.tsx` | `features/contract-sign-flow` | `contract`, `renter` | `PATCH /contracts/{id}/activate` |
| **Financial Ledger** | `/dashboard/invoices` | `pages/(dashboard)/invoices/list.tsx` | `features/invoice-table` | `invoice`, `contract`, `renter` | `GET /invoices` |
| **Invoice Detail** | `/dashboard/invoices/:id` | `pages/(dashboard)/invoices/detail.tsx` | `features/invoice-table` | `invoice`, `renter` | `GET /invoices/{id}` |
| **Bill Pay** | `/dashboard/invoices/:id/pay` | `pages/(dashboard)/invoices/pay.tsx` | `features/invoice-payment` | `invoice`, `contract` | `PATCH /invoices/{id}` |
| **Maintenance Board** | `/dashboard/maintenance` | `pages/(dashboard)/maintenance/list.tsx` | `features/maintenance-board` | `maintenance_request`, `room` | `GET /maintenance_requests` |
| **Issue Detail** | `/dashboard/maintenance/:id` | `pages/(dashboard)/maintenance/detail.tsx` | `features/maintenance-board` | `maintenance_request`, `user` | `GET /maintenance_requests/{id}` |
| **New Issue Report** | `/dashboard/maintenance/new` | `pages/(dashboard)/maintenance/new.tsx` | `features/maintenance-form` | `maintenance_request`, `room` | `POST /maintenance_requests` |
| **Renter Directory** | `/dashboard/renters` | `pages/(dashboard)/renters/list.tsx` | `features/renter-directory` | `renter`, `contract` | `GET /renters` |
| **Renter Profile** | `/dashboard/renters/:id` | `pages/(dashboard)/renters/detail.tsx` | `features/renter-directory` | `renter`, `contract`, `invoice` | `GET /renters/{id}` |
| **Org Settings** | `/dashboard/settings/workspace` | `pages/(dashboard)/settings/workspace.tsx` | `features/workspace-switcher` | `workspace`, `membership` | `GET /workspaces/{id}` |
| **User Settings** | `/dashboard/settings/profile` | `pages/(dashboard)/settings/profile.tsx` | `features/user-profile` | `user` | `GET /users/me` |
| **Team Management** | `/dashboard/settings/team` | `pages/(dashboard)/settings/team.tsx` | `features/team-management` | `membership`, `user` | `GET /workspaces/{id}/members` |

---

## 📦 Final Feature List (18 Modules)

| Feature | Responsibility | Main Entity Dependencies |
|---|---|---|
| `features/auth-form` | Unified Login/Register logic | `user` |
| `features/property-search` | High-level search & filters | `property`, `room` |
| `features/property-detail` | Overview of a single property | `property`, `room` |
| `features/room-detail` | Public specs/pricing/gallery | `room`, `property` |
| `features/dashboard-overview` | Aggregated stats (Landlord) | `room`, `invoice`, `contract` |
| `features/tenant-dashboard` | Personalized resident home | `contract`, `invoice`, `maintenance_request` |
| `features/property-list` | Property CRUD/Listing | `property`, `workspace` |
| `features/room-management` | Room List + Detail Editor | `room`, `property` |
| `features/contract-list` | searchable/filterable lease list | `contract`, `renter`, `room` |
| `features/contract-sign-flow` | Multi-step lease creation wizard | `contract`, `renter`, `room` |
| `features/invoice-table` | Bill records for landlords | `invoice`, `contract` |
| `features/invoice-payment` | One-off checkout/payment logic | `invoice`, `contract` |
| `features/maintenance-form` | Issue submission (Tenant) | `maintenance_request`, `room` |
| `features/maintenance-board` | Triage (Kanban) + Detail (Manager) | `maintenance_request`, `user` |
| `features/workspace-switcher` | Context shifting + Org settings | `workspace`, `membership` |
| `features/user-profile` | Personal data management | `user` |
| `features/renter-directory` | CRM for tenants | `renter`, `contract` |
| `features/team-management` | Staff invitations/roles | `membership`, `user` |

---

## ⚖️ Remaining Risks

> [!WARNING]
> **Mobile Optimization**: This mapping is desktop-heavy. For a Tenant-first mobile experience (e.g., payment/maintenance), ensure `features/tenant-dashboard` and `features/invoice-payment` follow responsive-first patterns or consider a separate `/mobile` route group if layouts diverge significantly.

> [!NOTE]
> **Role-Based Guards**: While `/dashboard` is namespaced, internal logic for `Admin Dashboard` vs `Tenant Dashboard` must be gated via `Membership` roles to prevent unauthorized access at the route level.

> [!TIP]
> **Real-time Updates**: Maintenance requests and occupancy stats will likely require TanStack Query's polling or WebSocket integration in `features/maintenance-board` to stay synced in a team environment.
    