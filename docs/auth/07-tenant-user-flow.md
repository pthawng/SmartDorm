# Tenant User Flow: From Discovery to Residency

## 🎯 Vision: "Frictionless Housing"
The SmartDorm Tenant Flow is designed to be a high-trust, fast-moving journey from finding a room to signing a legal contract. It bridges the gap between a marketing "search" experience and a structured "dashboard" living experience.

---

## 🚀 The Tenant Journey

### 1. Discovery (Public/Marketing)
- **Landing Page**: Entry point with featured properties.
- **Search & Filters**: Users search by city, price range, and amenities.
- **Property/Room Detail**: High-quality images, descriptions, and rule sets.
- **Trigger**: Click "Apply Now" (Requires `LOGIN` or `REGISTER`).

### 2. Application Phase
- **Submission**: Tenant fills out basic info (if not already in profile) and clicks Apply.
- **Dashboard Transition**: User is redirected to `DASHBOARD -> APPLICATIONS` to track the status.
- **Status Tracking**: "Applied" -> "Reviewing" -> "Offered".

### 3. Lease & Contract Execution
- **Contract Issuance**: Landlord reviews and issues a digital contract.
- **Deposit Payment**: Tenant reviews the contract and pays the security deposit via `CONTRACTS -> PAY DEPOSIT`. 
- **Digital Signature**: Once paid, both parties sign/confirm the contract.
- **Activation**: The contract status moves to `ACTIVE`, and the user is officially a resident.

### 4. Living in SmartDorm (Resident Phase)
- **Tenant Home**: Overview of the current active lease, upcoming bills, and recent messages.
- **Invoice Management**: Monthly rent is generated automatically. Tenant pays via `INVOICES -> PAY`.
- **Maintenance**: Tenant reports issues via `MAINTENANCE -> NEW`.
- **Communication**: Real-time messaging with the Landlord for house-related queries.

---

## 🗺️ Key Routes (Tenant Context)

| Phase | Route | Component |
| :--- | :--- | :--- |
| **Search** | `/search` | `SearchPage` |
| **Apply** | `/rooms/:id` | `RoomDetail` |
| **Lease** | `/dashboard/contracts/new` | `ContractApplyPage` |
| **Living** | `/dashboard/tenant` | `TenantHome` |
| **Bills** | `/dashboard/invoices` | `InvoiceListPage` |
| **Support** | `/dashboard/maintenance` | `MaintenanceListPage` |

---

## 🛡️ Permission Guards
- **Guest**: Access to `/search`, `/properties/:id`, `/rooms/:id`.
- **Authenticated (Tenant)**: Access to `/dashboard/tenant`, contract applications, and property creation (only if becoming a Landlord).
- **Resident**: (Internal distinction) Access to invoices and maintenance specific to their active contract.
