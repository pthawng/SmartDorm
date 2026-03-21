-- 000006_add_status_to_workspaces.down.sql
ALTER TABLE workspaces DROP COLUMN IF EXISTS status;
