package invoice

import (
	"time"

	"github.com/google/uuid"
)

type Invoice struct {
	ID                 uuid.UUID  `db:"id"`
	WorkspaceID        uuid.UUID  `db:"workspace_id"`
	ContractID         uuid.UUID  `db:"contract_id"`
	RenterID           uuid.UUID  `db:"renter_id"`
	BillingPeriodStart time.Time  `db:"billing_period_start"`
	BillingPeriodEnd   time.Time  `db:"billing_period_end"`
	AmountDue          int        `db:"amount_due"`
	Status             string     `db:"status"` // 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'
	PaidAt             *time.Time `db:"paid_at"`
	DueDate            time.Time  `db:"due_date"`
	Notes              *string    `db:"notes"`
	CancellationReason *string    `db:"cancellation_reason"`
	CreatedAt          time.Time  `db:"created_at"`
	UpdatedAt          time.Time  `db:"updated_at"`
}
