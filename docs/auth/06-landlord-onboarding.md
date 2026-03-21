# Landlord Onboarding: 2-Phase UX & Technical Orchestration

## 🎯 Vision: "Conversion-First, Stability-Second"
Traditional onboarding forms that wait for 10+ fields before submitting have high drop-off rates. The SmartDorm Landlord Onboarding is re-engineered into two distinct phases to maximize user conversion while maintaining system integrity.

---

## 🚀 2-Phase Architecture

### Phase 1: Registration (The "Fast" Conversion)
- **UX Target**: Step 2 (Property Name & Address).
- **Trigger**: "Create Workspace" button submit.
- **Workflow**:
    1.  **Frontend**: User submits workspace name.
    2.  **Backend (`POST /api/v1/workspaces`)**:
        - Runs `CreateWorkspaceTx` (Transaction).
        - Inserts into `workspaces` table.
        - Inserts into `memberships` table (assigns `role = 'owner'`).
        - Returns `workspace_id`.
    3.  **Frontend**: Receives `workspace_id` and immediately triggers `POST /auth/switch-context`.
    4.  **Backend (`POST /auth/switch-context`)**:
        - Validates workspace membership.
        - Issues a new JWT with `active_role = 'LANDLORD'` and `workspace_id`.
    5.  **Frontend**: 
        - Updates `authStore` via `setAuth(user, accessToken)`.
        - Persists `workspaceId` in draft to prevent duplicates.
        - Redirects or continues to Phase 2 (Onboarding Property Details).
- **Outcome**: The user is now officially a Landlord with an active workspace context.

### Phase 2: Setup (The "Product" Detailed Onboarding)
- **UX Target**: Step 3 & 4 (Amenities, Pricing, Review).
- **Trigger**: Final Submit on Step 4.
- **Technical Action**:
    1.  **Property Creation**: Calls `POST /properties` with rooms, amenities, and pricing data.
    2.  **Activation**: Calls `PATCH /workspaces/:id/status` to change status from `pending` to `active`.
- **Outcome**: The property is live, and the workspace is fully functional.

---

## 🛡️ Resiliency & Robustness Features

### 1. Robust Draft Persistence
The onboarding wizard saves more than just form data. The `localStorage` draft includes:
- `step`: Remembers the current step.
- `workspaceId`: Resumes setup for an existing `pending` workspace if Phase 1 succeeded but Phase 2 was interrupted.
- `phase`: Skips Phase 1 entirely on page refresh if the user is already a Landlord.

### 2. JWT Safety (Race Condition Fix)
To prevent `403 Forbidden` errors during the rapid role-switching phase:
- The `accessToken` returned from `switchContext` is **directly injected** into the `propertyApi.create` headers.
- This ensures the API call uses the `LANDLORD` identity even if the global `authStore` has not yet re-hydrated or the axios interceptor is stale.

### 3. Automatic Retry Strategy
Critical Phase 2 calls (Property Creation) are wrapped in a `withRetry` helper (max 3 attempts). This makes the final "Publish" step resilient to transient network issues or temporary server 5xx errors.

### 4. Workspace Status Lifecycle
- **`pending`**: Workspace created but property setup is incomplete. Orphan "pending" workspaces can be identified and cleaned up by background cron jobs.
- **`active`**: Full onboarding completed.

---

## 🛠️ API Reference Summary

- **`POST /api/v1/workspaces`**: Returns a workspace with `status: "pending"`.
- **`POST /auth/switch-context`**: Returns a new JWT with `context.type: "LANDLORD"`.
- **`PATCH /api/v1/workspaces/:id/status`**: Finalizes onboarding by setting `status: "active"`.
- **`POST /api/v1/properties`**: Expects a `LANDLORD` token.
