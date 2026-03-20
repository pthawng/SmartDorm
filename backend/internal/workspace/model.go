package workspace

import (
	"time"

	"github.com/google/uuid"
)

type Workspace struct {
	ID        uuid.UUID  `db:"id"`
	Name      string     `db:"name"`
	Status    string     `db:"status"` // "pending", "active"
	CreatedBy uuid.UUID  `db:"created_by"`
	CreatedAt time.Time  `db:"created_at"`
	UpdatedAt time.Time  `db:"updated_at"`
	DeletedAt *time.Time `db:"deleted_at"`
}

type Membership struct {
	ID          uuid.UUID `db:"id"`
	UserID      uuid.UUID `db:"user_id"`
	WorkspaceID uuid.UUID `db:"workspace_id"`
	Role        string    `db:"role"`
	CreatedAt   time.Time `db:"created_at"`
}
