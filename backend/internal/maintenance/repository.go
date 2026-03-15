package maintenance

import (
	"context"
	"strings"

	"smartdorm/infrastructure/db"
	"smartdorm/shared/pagination"

	"github.com/google/uuid"
)

type Repository interface {
	Create(ctx context.Context, workspaceID uuid.UUID, m *MaintenanceRequest) error
	GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*MaintenanceRequest, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, roomID, renterID *uuid.UUID, status, priority *string) ([]*MaintenanceRequest, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*MaintenanceRequest, error)
}

type repository struct {
	db *db.Database
}

func NewRepository(db *db.Database) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, workspaceID uuid.UUID, m *MaintenanceRequest) error {
	const q = `
		INSERT INTO maintenance_requests (workspace_id, room_id, renter_id, submitted_by_user_id, title, description, priority)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, status, created_at, updated_at`

	// DB default status is 'OPEN'
	return r.db.GetContext(ctx, m, q, 
		workspaceID, 
		m.RoomID, 
		m.RenterID, 
		m.SubmittedByUserID,
		m.Title, 
		m.Description, 
		m.Priority)
}

func (r *repository) GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*MaintenanceRequest, error) {
	const q = `
		SELECT id, workspace_id, room_id, renter_id, submitted_by_user_id, title, description, status, priority, resolution_note, resolved_at, created_at, updated_at
		FROM maintenance_requests
		WHERE id = $1 AND workspace_id = $2`

	var m MaintenanceRequest
	if err := r.db.GetContext(ctx, &m, q, id, workspaceID); err != nil {
		return nil, err
	}
	return &m, nil
}

func (r *repository) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, roomID, renterID *uuid.UUID, status, priority *string) ([]*MaintenanceRequest, int64, error) {
	queryBase := `FROM maintenance_requests WHERE workspace_id = $1`
	args := []interface{}{workspaceID}
	argIdx := 2

	if roomID != nil {
		queryBase += ` AND room_id = $` + string(rune('0'+argIdx))
		args = append(args, *roomID)
		argIdx++
	}
	if renterID != nil {
		queryBase += ` AND renter_id = $` + string(rune('0'+argIdx))
		args = append(args, *renterID)
		argIdx++
	}
	if status != nil {
		queryBase += ` AND status = $` + string(rune('0'+argIdx))
		args = append(args, *status)
		argIdx++
	}
	if priority != nil {
		queryBase += ` AND priority = $` + string(rune('0'+argIdx))
		args = append(args, *priority)
		argIdx++
	}

	qCount := `SELECT COUNT(*) ` + queryBase
	var total int64
	if err := r.db.GetContext(ctx, &total, qCount, args...); err != nil {
		return nil, 0, err
	}

	if total == 0 {
		return make([]*MaintenanceRequest, 0), 0, nil
	}

	qRows := `SELECT id, workspace_id, room_id, renter_id, submitted_by_user_id, title, description, status, priority, resolution_note, resolved_at, created_at, updated_at ` + 
		queryBase + 
		` ORDER BY created_at DESC LIMIT $` + string(rune('0'+argIdx)) + ` OFFSET $` + string(rune('0'+argIdx+1))
	
	args = append(args, params.Limit(), params.Offset())

	var requests []*MaintenanceRequest
	err := r.db.SelectContext(ctx, &requests, qRows, args...)
	if err != nil {
		return nil, 0, err
	}

	return requests, total, nil
}

func (r *repository) Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*MaintenanceRequest, error) {
	if len(updates) == 0 {
		return r.GetByID(ctx, workspaceID, id)
	}

	query := "UPDATE maintenance_requests SET "
	var args []interface{}
	var setClauses []string
	
	i := 1
	for k, v := range updates {
		// Only allow safe columns
		if k == "title" || k == "description" || k == "status" || k == "priority" || k == "resolution_note" || k == "resolved_at" {
			setClauses = append(setClauses, k+" = $"+string(rune('0'+i)))
			args = append(args, v)
			i++
		}
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	
	query += strings.Join(setClauses, ", ") + " WHERE id = $" + string(rune('0'+i)) + " AND workspace_id = $" + string(rune('0'+i+1)) + " RETURNING id, workspace_id, room_id, renter_id, submitted_by_user_id, title, description, status, priority, resolution_note, resolved_at, created_at, updated_at"
	args = append(args, id, workspaceID)

	var m MaintenanceRequest
	if err := r.db.GetContext(ctx, &m, query, args...); err != nil {
		return nil, err
	}

	return &m, nil
}
