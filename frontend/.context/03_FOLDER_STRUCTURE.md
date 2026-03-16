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
