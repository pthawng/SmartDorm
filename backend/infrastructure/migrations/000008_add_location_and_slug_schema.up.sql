ALTER TABLE properties
ADD COLUMN district VARCHAR(100),
ADD COLUMN ward VARCHAR(100),
ADD COLUMN latitude NUMERIC(10, 8),
ADD COLUMN longitude NUMERIC(11, 8),
ADD COLUMN slug VARCHAR(255) UNIQUE,
ADD COLUMN idempotency_key VARCHAR(255);

CREATE UNIQUE INDEX uq_properties_idempotency ON properties(workspace_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
