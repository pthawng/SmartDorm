package property

import (
	"time"

	"github.com/google/uuid"
)

type Property struct {
	ID          uuid.UUID  `db:"id"`
	WorkspaceID uuid.UUID  `db:"workspace_id"`
	Name        string     `db:"name"`
	Address     string     `db:"address"`
	Description *string    `db:"description"`
	CreatedAt   time.Time  `db:"created_at"`
	UpdatedAt   time.Time  `db:"updated_at"`
	DeletedAt   *time.Time `db:"deleted_at"`
}
