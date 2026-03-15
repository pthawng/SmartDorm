package contract

import (
	"time"

	"github.com/google/uuid"
)

type Contract struct {
	ID                uuid.UUID  `db:"id"`
	WorkspaceID       uuid.UUID  `db:"workspace_id"`
	RoomID            uuid.UUID  `db:"room_id"`
	RenterID          uuid.UUID  `db:"renter_id"`
	Status            string     `db:"status"` // 'DRAFT', 'ACTIVE', 'TERMINATED', 'EXPIRED'
	StartDate         time.Time  `db:"start_date"`
	EndDate           time.Time  `db:"end_date"`
	MonthlyRent       int        `db:"monthly_rent"`
	DepositAmount     int        `db:"deposit_amount"`
	TermsNotes        *string    `db:"terms_notes"`
	ActivatedAt       *time.Time `db:"activated_at"`
	TerminatedAt      *time.Time `db:"terminated_at"`
	TerminationDate   *time.Time `db:"termination_date"`
	TerminationReason *string    `db:"termination_reason"`
	CreatedAt         time.Time  `db:"created_at"`
	UpdatedAt         time.Time  `db:"updated_at"`
}
