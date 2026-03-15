package contract

import (
	"context"
	"strings"

	"smartdorm/infrastructure/db"
	apperr "smartdorm/shared/errors"
	"smartdorm/shared/pagination"

	"github.com/google/uuid"
)

type Repository interface {
	Create(ctx context.Context, workspaceID uuid.UUID, c *Contract) error
	GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Contract, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, roomID, renterID *uuid.UUID, status *string) ([]*Contract, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Contract, error)
	Delete(ctx context.Context, workspaceID, id uuid.UUID) error
}

type repository struct {
	db *db.Database
}

func NewRepository(db *db.Database) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, workspaceID uuid.UUID, c *Contract) error {
	const q = `
		INSERT INTO contracts (workspace_id, room_id, renter_id, start_date, end_date, monthly_rent, deposit_amount, terms_notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, status, created_at, updated_at`

	// DB default status is 'DRAFT'
	return r.db.GetContext(ctx, c, q, 
		workspaceID, 
		c.RoomID, 
		c.RenterID, 
		c.StartDate, 
		c.EndDate, 
		c.MonthlyRent, 
		c.DepositAmount, 
		c.TermsNotes)
}

func (r *repository) GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Contract, error) {
	const q = `
		SELECT id, workspace_id, room_id, renter_id, status, start_date, end_date, monthly_rent, deposit_amount, terms_notes, activated_at, terminated_at, termination_date, termination_reason, created_at, updated_at
		FROM contracts
		WHERE id = $1 AND workspace_id = $2`

	var contract Contract
	if err := r.db.GetContext(ctx, &contract, q, id, workspaceID); err != nil {
		return nil, err
	}
	return &contract, nil
}

func (r *repository) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, roomID, renterID *uuid.UUID, status *string) ([]*Contract, int64, error) {
	queryBase := `FROM contracts WHERE workspace_id = $1`
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

	qCount := `SELECT COUNT(*) ` + queryBase
	var total int64
	if err := r.db.GetContext(ctx, &total, qCount, args...); err != nil {
		return nil, 0, err
	}

	if total == 0 {
		return make([]*Contract, 0), 0, nil
	}

	qRows := `SELECT id, workspace_id, room_id, renter_id, status, start_date, end_date, monthly_rent, deposit_amount, terms_notes, activated_at, terminated_at, termination_date, termination_reason, created_at, updated_at ` + 
		queryBase + 
		` ORDER BY created_at DESC LIMIT $` + string(rune('0'+argIdx)) + ` OFFSET $` + string(rune('0'+argIdx+1))
	
	args = append(args, params.Limit(), params.Offset())

	var contracts []*Contract
	err := r.db.SelectContext(ctx, &contracts, qRows, args...)
	if err != nil {
		return nil, 0, err
	}

	return contracts, total, nil
}

func (r *repository) Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Contract, error) {
	if len(updates) == 0 {
		return r.GetByID(ctx, workspaceID, id)
	}

	query := "UPDATE contracts SET "
	var args []interface{}
	var setClauses []string
	
	i := 1
	for k, v := range updates {
		// Only allow safe columns
		if k == "status" || k == "start_date" || k == "end_date" || k == "monthly_rent" || k == "deposit_amount" || k == "terms_notes" || k == "activated_at" || k == "terminated_at" || k == "termination_date" || k == "termination_reason" {
			setClauses = append(setClauses, k+" = $"+string(rune('0'+i)))
			args = append(args, v)
			i++
		}
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	
	query += strings.Join(setClauses, ", ") + " WHERE id = $" + string(rune('0'+i)) + " AND workspace_id = $" + string(rune('0'+i+1)) + " RETURNING id, workspace_id, room_id, renter_id, status, start_date, end_date, monthly_rent, deposit_amount, terms_notes, activated_at, terminated_at, termination_date, termination_reason, created_at, updated_at"
	args = append(args, id, workspaceID)

	var contract Contract
	if err := r.db.GetContext(ctx, &contract, query, args...); err != nil {
		return nil, err
	}

	return &contract, nil
}

func (r *repository) Delete(ctx context.Context, workspaceID, id uuid.UUID) error {
	const q = `DELETE FROM contracts WHERE id = $1 AND workspace_id = $2 AND status = 'DRAFT'`

	res, err := r.db.Pool.Exec(ctx, q, id, workspaceID)
	if err != nil {
		return err
	}
	
	if res.RowsAffected() == 0 {
		return apperr.NewNotFound("Contract", id.String()) // Could also mean it wasn't DRAFT
	}

	return nil
}
