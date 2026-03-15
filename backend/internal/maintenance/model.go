package maintenance

import (
	"time"

	"github.com/google/uuid"
)

type MaintenanceRequest struct {
	ID                 uuid.UUID  `db:"id"`
	WorkspaceID        uuid.UUID  `db:"workspace_id"`
	RoomID             uuid.UUID  `db:"room_id"`
	RenterID           *uuid.UUID `db:"renter_id"` // Nullable: can be submitted by staff instead of renter
	SubmittedByUserID  uuid.UUID  `db:"submitted_by_user_id"` // Track the actual system user who submitted it
	Title              string     `db:"title"`
	Description        string     `db:"description"`
	Status             string     `db:"status"` // 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
	Priority           string     `db:"priority"` // 'LOW', 'NORMAL', 'HIGH', 'URGENT'
	ResolutionNote     *string    `db:"resolution_note"`
	ResolvedAt         *time.Time `db:"resolved_at"`
	CreatedAt          time.Time  `db:"created_at"`
	UpdatedAt          time.Time  `db:"updated_at"`
}
