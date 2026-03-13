-- 000001_init_schema.up.sql

-- Enable UUID extension if not already enabled (gen_random_uuid is built-in in PG 13+, but good practice)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- IDENTITY & AUTHORIZATION LAYER
-- ==========================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_users_email ON users(email);

CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_workspaces_created_by ON workspaces(created_by);

CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    role VARCHAR(30) NOT NULL CHECK (role IN ('owner','property_manager','staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_memberships_user_workspace UNIQUE (user_id, workspace_id)
);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_workspace_id ON memberships(workspace_id);

CREATE TABLE admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(30) NOT NULL CHECK (role IN ('super_admin','support','finance')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_admin_roles_user_role UNIQUE (user_id, role)
);
CREATE INDEX idx_admin_roles_user_id ON admin_roles(user_id);

-- ==========================================
-- DOMAIN LAYER
-- ==========================================

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_properties_workspace_id ON properties(workspace_id);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id),
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    room_number VARCHAR(50) NOT NULL,
    floor SMALLINT,
    area_sqm NUMERIC(6,2),
    monthly_price BIGINT NOT NULL CHECK (monthly_price > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE','OCCUPIED','MAINTENANCE')),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX uq_rooms_property_room_number ON rooms(property_id, room_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_rooms_property_id ON rooms(property_id);
CREATE INDEX idx_rooms_workspace_id ON rooms(workspace_id);
CREATE INDEX idx_rooms_status ON rooms(status);

CREATE TABLE renters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    user_id UUID REFERENCES users(id),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    id_number VARCHAR(50),
    date_of_birth DATE,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_renters_workspace_id ON renters(workspace_id);
CREATE INDEX idx_renters_user_id ON renters(user_id);

CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    room_id UUID NOT NULL REFERENCES rooms(id),
    renter_id UUID NOT NULL REFERENCES renters(id),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','ACTIVE','TERMINATED','EXPIRED')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent BIGINT NOT NULL CHECK (monthly_rent > 0),
    deposit_amount BIGINT NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0),
    terms_notes TEXT,
    activated_at TIMESTAMPTZ,
    terminated_at TIMESTAMPTZ,
    termination_date DATE,
    termination_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_contracts_dates CHECK (start_date < end_date)
);
CREATE UNIQUE INDEX uq_contracts_room_active ON contracts(room_id) WHERE status = 'ACTIVE';
CREATE INDEX idx_contracts_workspace_id ON contracts(workspace_id);
CREATE INDEX idx_contracts_room_id ON contracts(room_id);
CREATE INDEX idx_contracts_renter_id ON contracts(renter_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_workspace_status ON contracts(workspace_id, status);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    contract_id UUID NOT NULL REFERENCES contracts(id),
    renter_id UUID NOT NULL REFERENCES renters(id),
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    amount_due BIGINT NOT NULL CHECK (amount_due > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PAID','OVERDUE','CANCELLED')),
    paid_at TIMESTAMPTZ,
    due_date DATE NOT NULL,
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_invoices_period CHECK (billing_period_start < billing_period_end),
    CONSTRAINT ck_invoices_due_date CHECK (due_date >= billing_period_start)
);
CREATE UNIQUE INDEX uq_invoices_contract_period ON invoices(contract_id, billing_period_start);
CREATE INDEX idx_invoices_workspace_id ON invoices(workspace_id);
CREATE INDEX idx_invoices_contract_id ON invoices(contract_id);
CREATE INDEX idx_invoices_renter_id ON invoices(renter_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_workspace_status ON invoices(workspace_id, status);

CREATE TABLE maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    room_id UUID NOT NULL REFERENCES rooms(id),
    renter_id UUID REFERENCES renters(id),
    submitted_by_user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','IN_PROGRESS','RESOLVED','CLOSED')),
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW','NORMAL','HIGH','URGENT')),
    resolution_note TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_maintenance_workspace_id ON maintenance_requests(workspace_id);
CREATE INDEX idx_maintenance_room_id ON maintenance_requests(room_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
