-- 000003_add_context_to_refresh_tokens.up.sql

ALTER TABLE refresh_tokens 
ADD COLUMN active_role VARCHAR(30),
ADD COLUMN workspace_id UUID REFERENCES workspaces(id);

-- Optional: Populate existing tokens with a default role if needed
UPDATE refresh_tokens SET active_role = 'TENANT' WHERE active_role IS NULL;
