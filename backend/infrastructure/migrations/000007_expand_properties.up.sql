ALTER TABLE properties 
ADD COLUMN type VARCHAR(50),
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN amenities JSONB DEFAULT '[]';

CREATE INDEX idx_properties_amenities ON properties USING GIN (amenities);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);

CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE UNIQUE INDEX uq_one_primary_per_property ON property_images(property_id) WHERE is_primary = true;
