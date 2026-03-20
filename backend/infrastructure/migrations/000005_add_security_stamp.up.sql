-- Add security_stamp to users to track global session version
ALTER TABLE users ADD COLUMN security_stamp UUID NOT NULL DEFAULT gen_random_uuid();

-- Add security_stamp snapshot to refresh_tokens to allow validation
ALTER TABLE refresh_tokens ADD COLUMN security_stamp UUID;

-- Populate existing refresh tokens with current user stamp (best effort fallback)
UPDATE refresh_tokens rt
SET security_stamp = u.security_stamp
FROM users u
WHERE rt.user_id = u.id;

-- Make it mandatory for new tokens
ALTER TABLE refresh_tokens ALTER COLUMN security_stamp SET NOT NULL;
