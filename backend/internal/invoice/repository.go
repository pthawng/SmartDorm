package invoice

import (
	"context"
	"strings"

	"smartdorm/infrastructure/db"
	"smartdorm/shared/pagination"

	"github.com/google/uuid"
)

type Repository interface {
	Create(ctx context.Context, workspaceID uuid.UUID, i *Invoice) error
	GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Invoice, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, contractID, renterID *uuid.UUID, status *string) ([]*Invoice, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Invoice, error)
	GetContractDetails(ctx context.Context, workspaceID, contractID uuid.UUID) (*uuid.UUID, error) // Returns RenterID for the contract
}

type repository struct {
	db *db.Database
}

func NewRepository(db *db.Database) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, workspaceID uuid.UUID, i *Invoice) error {
	const q = `
		INSERT INTO invoices (workspace_id, contract_id, renter_id, billing_period_start, billing_period_end, amount_due, due_date, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, status, created_at, updated_at`

	// DB default status is 'PENDING'
	return r.db.GetContext(ctx, i, q, 
		workspaceID, 
		i.ContractID, 
		i.RenterID, 
		i.BillingPeriodStart, 
		i.BillingPeriodEnd, 
		i.AmountDue, 
		i.DueDate, 
		i.Notes)
}

func (r *repository) GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Invoice, error) {
	const q = `
		SELECT id, workspace_id, contract_id, renter_id, billing_period_start, billing_period_end, amount_due, status, paid_at, due_date, notes, cancellation_reason, created_at, updated_at
		FROM invoices
		WHERE id = $1 AND workspace_id = $2`

	var invoice Invoice
	if err := r.db.GetContext(ctx, &invoice, q, id, workspaceID); err != nil {
		return nil, err
	}
	return &invoice, nil
}

func (r *repository) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, contractID, renterID *uuid.UUID, status *string) ([]*Invoice, int64, error) {
	queryBase := `FROM invoices WHERE workspace_id = $1`
	args := []interface{}{workspaceID}
	argIdx := 2

	if contractID != nil {
		queryBase += ` AND contract_id = $` + string(rune('0'+argIdx))
		args = append(args, *contractID)
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
		return make([]*Invoice, 0), 0, nil
	}

	qRows := `SELECT id, workspace_id, contract_id, renter_id, billing_period_start, billing_period_end, amount_due, status, paid_at, due_date, notes, cancellation_reason, created_at, updated_at ` + 
		queryBase + 
		` ORDER BY due_date DESC LIMIT $` + string(rune('0'+argIdx)) + ` OFFSET $` + string(rune('0'+argIdx+1))
	
	args = append(args, params.Limit(), params.Offset())

	var invoices []*Invoice
	err := r.db.SelectContext(ctx, &invoices, qRows, args...)
	if err != nil {
		return nil, 0, err
	}

	return invoices, total, nil
}

func (r *repository) Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Invoice, error) {
	if len(updates) == 0 {
		return r.GetByID(ctx, workspaceID, id)
	}

	query := "UPDATE invoices SET "
	var args []interface{}
	var setClauses []string
	
	i := 1
	for k, v := range updates {
		// Only allow safe columns
		if k == "amount_due" || k == "due_date" || k == "notes" || k == "status" || k == "paid_at" || k == "cancellation_reason" {
			setClauses = append(setClauses, k+" = $"+string(rune('0'+i)))
			args = append(args, v)
			i++
		}
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	
	query += strings.Join(setClauses, ", ") + " WHERE id = $" + string(rune('0'+i)) + " AND workspace_id = $" + string(rune('0'+i+1)) + " RETURNING id, workspace_id, contract_id, renter_id, billing_period_start, billing_period_end, amount_due, status, paid_at, due_date, notes, cancellation_reason, created_at, updated_at"
	args = append(args, id, workspaceID)

	var invoice Invoice
	if err := r.db.GetContext(ctx, &invoice, query, args...); err != nil {
		return nil, err
	}

	return &invoice, nil
}

func (r *repository) GetContractDetails(ctx context.Context, workspaceID, contractID uuid.UUID) (*uuid.UUID, error) {
	const q = `SELECT renter_id FROM contracts WHERE id = $1 AND workspace_id = $2 AND status = 'ACTIVE'`
	
	var renterID uuid.UUID
	if err := r.db.GetContext(ctx, &renterID, q, contractID, workspaceID); err != nil {
		return nil, err
	}

	return &renterID, nil
}
