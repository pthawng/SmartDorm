package property

import (
	"time"

	"github.com/google/uuid"
)

type PropertyStatus string

const (
	PropertyStatusDraft     PropertyStatus = "draft"
	PropertyStatusPublished PropertyStatus = "published"
	PropertyStatusArchived  PropertyStatus = "archived"
)

type Property struct {
	ID          uuid.UUID      `db:"id"`
	WorkspaceID uuid.UUID      `db:"workspace_id"`
	Name        string         `db:"name"`
	Address     string         `db:"address"`
	City        string         `db:"city"`
	Type        *string        `db:"type"`
	Status      PropertyStatus `db:"status"`
	Amenities   []string       `db:"amenities"`
	Description *string        `db:"description"`
	RoomCount   int            `db:"room_count"`
	CreatedAt   time.Time      `db:"created_at"`
	UpdatedAt   time.Time      `db:"updated_at"`
	DeletedAt   *time.Time     `db:"deleted_at"`
}

type PropertyImage struct {
	ID           uuid.UUID `db:"id"`
	PropertyID   uuid.UUID `db:"property_id"`
	URL          string    `db:"url"`
	IsPrimary    bool      `db:"is_primary"`
	DisplayOrder int       `db:"display_order"`
	CreatedAt    time.Time `db:"created_at"`
}
