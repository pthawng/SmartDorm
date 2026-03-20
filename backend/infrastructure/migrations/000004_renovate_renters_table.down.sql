-- 000004_renovate_renters_table.down.sql

ALTER TABLE renters 
DROP COLUMN budget,
DROP COLUMN preferred_location,
DROP COLUMN verified,
DROP COLUMN rating;

ALTER TABLE renters DROP CONSTRAINT IF EXISTS uq_renters_user_id;
