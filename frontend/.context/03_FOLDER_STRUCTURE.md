# Frontend Folder Structure (Feature + Domain)

**Author**: Senior Developer
**Project**: SmartDorm
**Framework**: React (Vite) + TailwindCSS + TanStack Query

---

## 🏗 Architectural Pattern
We follow a **Feature-based + Domain-driven** structure. This approach encapsulates complex logic within "Features" and shares core business logic through "Entities/Domains", preventing the "Big Ball of Mud" as the project scales.

```bash
src/
├── app/                # Main Providers, Styles, and Entry setup
├── features/           # Self-contained business modules (e.g. auth-form)
├── entities/           # Core domain types & cross-feature logic (e.g. room types)
├── pages/              # View components mapped to Routes
├── shared/             # Generic UI, utils, hooks, constants
├── services/           # Global API clients (Axios config)
├── store/              # Global Zustand stores
└── assets/             # Images, icons, global styles
```

---

## 📁 Detailed breakdown

### 1. `features/` (The "How")
Each feature represents a specific user capability. Features can import from `entities` and `shared`, but **never** from another feature.
- **Example**: `features/auth-form/`, `features/contract-signing/`, `features/maintenance-board/`
- **Internal Structure**:
  ```bash
  features/feature-name/
  ├── components/       # Feature-specific UI
  ├── hooks/            # Feature-specific logic (TanStack Query / RHF)
  ├── services/         # API calls for this feature
  ├── types/            # Feature-specific schemas/interfaces
  └── index.ts          # Public API for the feature
  ```

### 2. `entities/` (The "What")
Contains core data models and business logic that reflect the Backend Domain Layer. This is where we define the "objects" described in `INFORMATION_ARCHITECTURE.md`.
- **Items**: `user`, `workspace`, `property`, `room`, `renter`, `contract`, `invoice`.
- **Internal Structure**:
  ```bash
  entities/domain-name/
  ├── types.ts          # Entity interfaces (e.g., RoomData)
  ├── model/            # Logic (Zod schemas, state helpers)
  └── constants.ts      # Enums (e.g., RoomStatus)
  ```

### 3. `pages/` (The "Views")
Route-level components. Pages should be thin, mostly composing components from `features` or `entities`.
```bash
pages/
├── (auth)/             # Login, Register pages
├── (dashboard)/        # Main app pages (Home, Room List)
└── (marketing)/        # Landing page
```

### 4. `shared/` (The "Basics")
Global components and utilities that are business-agnostic.
- `shared/ui/`: Atomic components (Buttons, Inputs, Modals) — usually from Shadcn/UI.
- `shared/hooks/`: Generic hooks (useThrottle, useBoolean).
- `shared/api/`: Base API client configuration.

---

## 🗺 Mapping to Modules

| Module | Feature Location | Domain Entity |
|---|---|---|
| **Identity & Auth** | `features/auth-login`, `features/workspace-switcher` | `entities/user`, `entities/workspace` |
| **Properties** | `features/property-list`, `features/room-editor` | `entities/property`, `entities/room` |
| **Leasing** | `features/contract-sign-flow` | `entities/contract`, `entities/renter` |
| **Financials** | `features/invoice-table` | `entities/invoice` |
| **Operations** | `features/maintenance-form` | `entities/maintenance` |

---

## 🛠 Best Practices
1. **Public API**: Always export through an `index.ts` in each feature/entity folder to control what other parts of the app can access.
2. **Absolute Imports**: Use `@/features/...`, `@/shared/...` instead of relative paths (Configured in `vite.config.ts` and `tsconfig.json`).
3. **Zustand Usage**: Stores live in `store/` if they are global (e.g., `authStore`), or inside `features/` if they are scoped to a specific complex interaction.
4. **Validation**: Use Zod schemas in `entities/domain/model/` to ensure consistency between Forms (Frontend) and Schema (Backend).



SmartDorm — Full Project Structure (Senior+ Final)
Architectural Pattern: Feature-based + Domain-driven Rules: Thin Pages, Isolated Features, Centralized API & Config, Global Library Layer, Absolute Imports (@/*)

📂 src/ Tree Overview
bash
src/
├── app/                    # Entry, Providers, Global Layout, Router
├── pages/                  # Route-level Thin Components
├── features/               # Isolated Business Logic Modules
├── entities/               # Core Domain Models & Schemas
├── services/               # API clients & Centralized Endpoints
├── shared/                 # Config, UI, Lib, Types, Utils
├── store/                  # Global Zustand Stores
└── tests/                  # Test Setup, Mocks, Integration Suites
🏗 Detailed Infrastructure
1. src/app/ (Orchestration)
providers/: Centralized Context Providers.
query-provider.tsx: TanStack Query (v5+) setup & DevTools.
auth-provider.tsx: RBAC and session syncing.
theme-provider.tsx: Tailwind/Theme config.
router/: Central React Router definition.
index.tsx: Page mapping, lazy loading, and protected route guards.
layout/: Global Shell.
root-layout.tsx: Sidebar, Header, Breadcrumbs, Global Modals.
index.tsx: React DOM entry point.
2. src/services/ (Data Typing Layer)
apiClient.ts: Base Axios instance + interceptors (JWT, Workspace-ID).
endpoints/: Single source of truth for all domain API calls.
room.api.ts, contract.api.ts, invoice.api.ts, auth.api.ts, etc.
3. src/shared/ (The Foundation)
config/: Centralized System Config.
env.ts: Typed environment variables (Vite-style).
routes.ts: Centralized route constants (e.g., ROUTES.DASHBOARD.ROOMS).
types/: Senior+ Global Typings.
api.ts: ApiResponse<T>, PaginatedResponse<T>, QueryOptions.
common.ts: ID, ISOString, Nullable<T>.
lib/: Senior+ Library Layer.
date.ts: date-fns wrappers for consistent formatting.
currency.ts: Advanced money/pricing formatters.
storage.ts: Type-safe LocalStorage/SessionStorage wrappers.
ui/: UI Kit + System UI.
atoms/: Basic components (Button, Input, Checkbox).
loading.tsx: Skeleton patterns and global spinners.
error-boundary.tsx: Component-level and Page-level error capture.
empty-state.tsx: Standardized empty view patterns (No Data found).
utils/: Lightweight bit-logic helpers (string manipulation, math).
4. src/tests/ (Verification Layer)
setup.ts: Vitest/Jest global configuration.
mocks/: MSW handlers for API mocking.
utils.tsx: Custom render methods with providers.
🏙 Feature & Entity Internal Patterns
Feature: src/features/<feature-name>/
components/: Feature-specific UI.
hooks/: Business logic (TanStack Query hooks mapping to 01_USER_FLOW endpoints).
services/: Local mappers/selectors for global endpoints.
types/: Feature-specific DTOs/Interfaces.
index.ts: Strict public API (Export only what's needed).
Entity: src/entities/<domain>/
types.ts: Backend-matching interfaces as per 02_INFORMATION_ARCHITECTURE.
constants.ts: Enums (e.g., RoomStatus = 'AVAILABLE').
model/: Zod schemas for form/API validation.
index.ts: Public API.
🎯 Production Engineering Rules
Thin Pages: Zero business logic inside src/pages/. Only layout coordination.
Absolute Imports: Strictly use @/* (configured in tsconfig.json).
API Centralization: Features must call services from @/services/endpoints/.
Validation Driven: Every POST/PATCH request must have an associated Zod model from @/entities/.
Standardized Formatting: Use @/shared/lib/ for all date/currency display to ensure UI consistency.