-- 000003_add_context_to_refresh_tokens.down.sql

ALTER TABLE refresh_tokens 
DROP COLUMN active_role,
DROP COLUMN workspace_id;
