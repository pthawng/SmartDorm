# SmartDorm — Project Context

## System Overview

SmartDorm is a multi-tenant SaaS **Rental Management System (RMS)** that enables landlords to manage their rental properties end-to-end: from listing rooms and onboarding renters, to generating invoices and handling maintenance requests.

SmartDorm uses a **workspace-based identity model**: a single user account can act as a workspace owner (landlord) in one workspace and simultaneously be a renter in another. Authorization is managed through `memberships` (workspace roles) and `admin_roles` (platform admin) — not a single embedded role on the user.

The system is designed for Vietnamese dormitory and apartment rental markets but is architected to be locale-agnostic.

## MVP Scope

### In Scope

| Module | Capabilities |
|---|---|
| Auth | Registration, login, context-based JWT minting |
| Workspace | Create and manage workspaces; membership management |
| Property | CRUD for properties within a workspace |
| Room | CRUD for rooms within a property; availability tracking |
| Renter | Renter profiles linked to a workspace |
| Contract | Create, activate, terminate rental contracts |
| Invoice | Generate, view, and mark invoices as paid |
| Maintenance | Submit and track maintenance requests |
| Scheduler | Background jobs: contract expiry, invoice overdue detection |

### Out of Scope (Future Phases)

- Community platform & social features
- Marketplace / listing discovery
- Reviews & ratings
- Real-time chat
- Payment gateway integration
- Push / email notifications

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Language | Go |
| Web Framework | Gin |
| Database | PostgreSQL |
| Cache / Session | Redis |
| Frontend | Next.js + TailwindCSS + TanStack Query |
| Containerization | Docker |
| Deployment | VPS |

## Architecture

- **Pattern:** Modular Monolith — all modules deployed as a single binary, but internally separated by domain boundaries.
- **API Style:** REST, versioned under `/api/v1/`.
- **Cross-module Communication:** Domain events (in-process event bus for MVP).
- **Multi-tenancy:** Workspace-level data isolation enforced at the repository layer via `workspace_id`.
- **Identity:** Single `users` table. Authorization via `memberships` (workspace roles) and `admin_roles` (platform admin).
- **Auth:** Context-based JWT. User logs in, receives available contexts, selects one, receives scoped JWT.

## Core Modules

```
smartdorm/
├── cmd/                  # Entry point
├── internal/
│   ├── auth/             # Authentication, context JWT minting
│   ├── workspace/        # Workspace + membership management
│   ├── property/         # Property management
│   ├── room/             # Room management
│   ├── renter/           # Renter profiles (formerly: tenant)
│   ├── contract/         # Rental contracts
│   ├── invoice/          # Invoice generation & tracking
│   ├── maintenance/      # Maintenance requests
│   └── scheduler/        # Background jobs
├── shared/               # Cross-cutting utilities (errors, pagination, events, logging)
├── infrastructure/       # DB, Redis, migrations
└── config/               # App configuration
```

## Key Design Decisions

1. Money stored as `int64` (smallest currency unit) throughout the stack.
2. All IDs are UUID v4.
3. Domain events are the only mechanism for cross-module side effects.
4. Workspace `workspace_id` is always verified server-side from the JWT — never from client input.
5. Single identity (`users`) with two authorization layers: `memberships` (workspace roles) and `admin_roles` (platform admin).
6. Rental domain entity called `renters` (not `tenants`) to avoid naming conflict with SaaS workspace concept.
