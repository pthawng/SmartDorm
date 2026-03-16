# User Flow Design

**Author**: Lead Product Designer
**Project**: SmartDorm
**Context**: Backend Migration Schema 000001 | Stitch Design Project ID 4434345706878704605

---

## Overview
This document outlines the interaction paths between the Frontend screens and the Backend data structures. It focuses on transition logic, business status changes, and API requirements.

---

## 1. Journey A: Tenant Journey (From Explorer to Resident)
*Objective: Help a potential tenant find a room, sign a legal contract, and pay their first fee.*

### Step 1: Landing Page & Property Explore
- **Screen**: Landing Page / Search Results
- **Entry Point**: Direct access (URL).
- **Actions**:
    - Filter by city/price (from `properties` and `rooms`).
    - Select a property.
- **Exit Point**: **Room Detail Screen**.
- **API Connection**:
    - `GET /properties` (Filter by `city`)
    - `GET /rooms` (Filter by `status = 'AVAILABLE'`)

### Step 2: Room Choice & Detail
- **Screen**: Room Detail
- **Entry Point**: Property List / Search.
- **Actions**:
    - View room specs (`area_sqm`, `floor`).
    - View pricing (`monthly_price`).
    - Click "Apply Now".
- **Exit Point**: **Login/Register** (if not authenticated) or **Contract Application**.
- **API Connection**: `GET /rooms/{id}`

### Step 3: Contract Creation (Application)
- **Screen**: Contract Application Form
- **Entry Point**: Room Detail.
- **Actions**:
    - Fill in personal info (populates `renters` table).
    - Select start/end dates.
- **Exit Point**: **Contract Preview / Draft**.
- **API Connection**:
    - `POST /renters` (Create/Update tenant profile)
    - `POST /contracts` (Initial status: `DRAFT`)

### Step 4: Digital Signature & Activation
- **Screen**: Contract Review
- **Entry Point**: Application Submission.
- **Actions**:
    - "Sign Contract".
- **Exit Point**: **Payment Screen**.
- **Decision Point**:
    - If user cancels -> Contract remains `DRAFT` or gets deleted.
    - If user signs -> `contracts.status` updates to `ACTIVE` and `rooms.status` updates to `OCCUPIED`.
- **API Connection**: `PATCH /contracts/{id}/activate`

### Step 5: Initial Payment
- **Screen**: Invoice / Payment Portal
- **Entry Point**: Contract Activation.
- **Actions**:
    - Pay deposit/first month.
- **Exit Point**: **Tenant Dashboard**.
- **API Connection**:
    - `POST /invoices` (Auto-generated from contract terms)
    - `PATCH /invoices/{id}` (Update status to `PAID` and `paid_at = NOW()`)

---

## 2. Journey B: Landlord Operations (Property & Finance Management)
*Objective: Provide the property manager with oversight and tools to manage assets and income.*

### Step 1: Admin Dashboard
- **Screen**: Admin Overview
- **Entry Point**: Login (Role: `property_manager` or `owner`).
- **Actions**:
    - View total revenue (Sum of `invoices.amount_due` where `status = 'PAID'`).
    - View occupancy rate (Count of `rooms` where `status = 'OCCUPIED'`).
- **Exit Point**: **Room List** or **Financial Report**.
- **API Connection**: `GET /stats/dashboard` (Aggregates `rooms`, `invoices`, `contracts`).

### Step 2: Room Management
- **Screen**: Room List / Table
- **Entry Point**: Admin Navbar.
- **Actions**:
    - Toggle room status (e.g., move room to `MAINTENANCE`).
    - Edit `monthly_price`.
- **Exit Point**: **Room Edit Modal**.
- **API Connection**: `PATCH /rooms/{id}`

### Step 3: Financial Auditing
- **Screen**: Invoice Management
- **Entry Point**: Dashboard Sidebar.
- **Actions**:
    - Filter `invoices` by `status = 'OVERDUE'`.
    - Manual mark as `PAID` (if tenant pays cash).
- **Exit Point**: **Invoice Detail**.
- **API Connection**: `GET /invoices` (Filtered by `workspace_id`).

---

## 3. Journey C: Maintenance Flow (Issue Resolution)
*Objective: Streamline communication for repairs between Tenant and Landlord.*

### Step 1: Issue Reporting (Tenant)
- **Screen**: Maintenance Request Form
- **Entry Point**: Tenant Dashboard -> "Report Issue".
- **Actions**:
    - Input `title`, `description`, `priority`.
- **Exit Point**: **Request History List**.
- **API Connection**: `POST /maintenance_requests` (Initial status: `OPEN`).

### Step 2: Request Triage (Landlord)
- **Screen**: Maintenance Board (Kanban/List)
- **Entry Point**: Admin Dashboard.
- **Actions**:
    - Change status to `IN_PROGRESS`.
    - Assign priority.
- **Exit Point**: **Update Modal**.
- **API Connection**: `PATCH /maintenance_requests/{id}`

### Step 3: Resolution
- **Screen**: Request Detail
- **Entry Point**: Maintenance Board.
- **Actions**:
    - Add `resolution_note`.
    - Mark as `RESOLVED`.
- **Exit Point**: **Archived Requests**.
- **Decision Point**:
    - If fixed -> `status = 'RESOLVED'`, `resolved_at = NOW()`.
- **API Connection**: `PATCH /maintenance_requests/{id}` (Final update).
