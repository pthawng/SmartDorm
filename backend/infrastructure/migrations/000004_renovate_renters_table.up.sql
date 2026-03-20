-- 000004_renovate_renters_table.up.sql

-- Add domain-specific fields to renters
ALTER TABLE renters 
ADD COLUMN budget BIGINT DEFAULT 0,
ADD COLUMN preferred_location TEXT,
ADD COLUMN verified BOOLEAN DEFAULT false,
ADD COLUMN rating NUMERIC(3,2) DEFAULT 0.0;

-- Ensure user_id link is unique (one profile per user)
-- Drop existing and recreate for consistency if needed, but for now just add constraint
ALTER TABLE renters ADD CONSTRAINT uq_renters_user_id UNIQUE (user_id);
