package room

import (
	"time"

	"github.com/google/uuid"
)

type Room struct {
	ID          uuid.UUID  `db:"id"`
	WorkspaceID uuid.UUID  `db:"workspace_id"`
	PropertyID  uuid.UUID  `db:"property_id"`
	Name        string     `db:"name"`
	Floor       *string    `db:"floor"`
	Status      string     `db:"status"` // 'AVAILABLE', 'OCCUPIED', 'MAINTENANCE'
	RentAmount  int        `db:"rent_amount"` // numeric(10,2) in schema = int cents
	CreatedAt   time.Time  `db:"created_at"`
	UpdatedAt   time.Time  `db:"updated_at"`
	DeletedAt   *time.Time `db:"deleted_at"`
}
