package scheduler

import (
	"context"
	"time"

	"github.com/google/uuid"

	"smartdorm/infrastructure/db"
	"smartdorm/shared/events"
)

type ContractExpiryJob struct {
	db       *db.Database
	eventBus events.Bus
}

func NewContractExpiryJob(db *db.Database, eventBus events.Bus) *ContractExpiryJob {
	return &ContractExpiryJob{
		db:       db,
		eventBus: eventBus,
	}
}

// Helper to parse string back to UUID
func parseUUID(s string) uuid.UUID {
	id, _ := uuid.Parse(s)
	return id
}

func (j *ContractExpiryJob) Name() string {
	return "ContractExpiryJob"
}

// Run finds all ACTIVE contracts where end_date <= today and marks them as EXPIRED
func (j *ContractExpiryJob) Run(ctx context.Context) error {
	const qSelect = `
		SELECT id, workspace_id, room_id, renter_id 
		FROM contracts 
		WHERE status = 'ACTIVE' AND end_date <= CURRENT_DATE`

	type expiredContract struct {
		ID          string `db:"id"`
		WorkspaceID string `db:"workspace_id"`
		RoomID      string `db:"room_id"`
		RenterID    string `db:"renter_id"`
	}

	var toExpire []expiredContract
	if err := j.db.SelectContext(ctx, &toExpire, qSelect); err != nil {
		return err
	}

	if len(toExpire) == 0 {
		return nil
	}

	// In a real system you'd batch this or use a single UPDATE ... RETURNING
	// Using transaction for safe updates
	tx, err := j.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	const qUpdate = `UPDATE contracts SET status = 'EXPIRED', updated_at = NOW() WHERE id = $1`

	for _, c := range toExpire {
		_, err := tx.ExecContext(ctx, qUpdate, c.ID)
		if err != nil {
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	// Emit events after successful commit
	now := time.Now()
	for _, c := range toExpire {
		event := events.ContractExpiredEvent{
			WorkspaceID: parseUUID(c.WorkspaceID),
			ContractID:  parseUUID(c.ID),
			RoomID:      parseUUID(c.RoomID),
			RenterID:    parseUUID(c.RenterID),
			ExpiredAt:   now,
		}
		j.eventBus.Publish(event)
	}

	return nil
}
