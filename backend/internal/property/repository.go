package property

import (
	"context"
	"strings"

	"smartdorm/infrastructure/db"
	apperr "smartdorm/shared/errors"
	"smartdorm/shared/pagination"

	"github.com/google/uuid"
)

type Repository interface {
	Create(ctx context.Context, workspaceID uuid.UUID, p *Property) error
	GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Property, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params) ([]*Property, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Property, error)
	Delete(ctx context.Context, workspaceID, id uuid.UUID) error
}

type repository struct {
	db *db.Database
}

func NewRepository(db *db.Database) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, workspaceID uuid.UUID, p *Property) error {
	const q = `
		INSERT INTO properties (workspace_id, name, address, description)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at, updated_at, deleted_at`

	return r.db.GetContext(ctx, p, q, workspaceID, p.Name, p.Address, p.Description)
}

func (r *repository) GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Property, error) {
	const q = `
		SELECT id, workspace_id, name, address, description, created_at, updated_at, deleted_at
		FROM properties
		WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL`

	var p Property
	if err := r.db.GetContext(ctx, &p, q, id, workspaceID); err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *repository) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params) ([]*Property, int64, error) {
	// 1. Get total count
	const qCount = `SELECT COUNT(*) FROM properties WHERE workspace_id = $1 AND deleted_at IS NULL`
	var total int64
	if err := r.db.GetContext(ctx, &total, qCount, workspaceID); err != nil {
		return nil, 0, err
	}

	if total == 0 {
		return make([]*Property, 0), 0, nil
	}

	// 2. Fetch paginated rows
	const qRows = `
		SELECT id, workspace_id, name, address, description, created_at, updated_at, deleted_at
		FROM properties
		WHERE workspace_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`

	var properties []*Property
	err := r.db.SelectContext(ctx, &properties, qRows, workspaceID, params.Limit(), params.Offset())
	if err != nil {
		return nil, 0, err
	}

	return properties, total, nil
}

func (r *repository) Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Property, error) {
	if len(updates) == 0 {
		return r.GetByID(ctx, workspaceID, id)
	}

	// Dynamic UPDATE builder (acceptable for MVP when carefully mapped and isolated to repo)
	query := "UPDATE properties SET "
	var args []interface{}
	var setClauses []string
	
	i := 1
	for k, v := range updates {
		// Strict column mapping to prevent SQL injection by untrusted keys
		// Enforce safety manually since it's a map. The service layer MUST guarantee clean keys.
		if k == "name" || k == "address" || k == "description" {
			setClauses = append(setClauses, k+" = $"+string(rune('0'+i))) // Safe for 1-9 args
			args = append(args, v)
			i++
		}
	}

	// Update the updated_at timestamp
	setClauses = append(setClauses, "updated_at = NOW()")

	// Add WHERE clause enforcing data isolation
	query += strings.Join(setClauses, ", ") + " WHERE id = $" + string(rune('0'+i)) + " AND workspace_id = $" + string(rune('0'+i+1)) + " AND deleted_at IS NULL RETURNING id, workspace_id, name, address, description, created_at, updated_at, deleted_at"
	args = append(args, id, workspaceID)

	var p Property
	if err := r.db.GetContext(ctx, &p, query, args...); err != nil {
		return nil, err
	}

	return &p, nil
}

func (r *repository) Delete(ctx context.Context, workspaceID, id uuid.UUID) error {
	const q = `
		UPDATE properties 
		SET deleted_at = NOW() 
		WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL`

	res, err := r.db.Pool.Exec(ctx, q, id, workspaceID)
	if err != nil {
		return err
	}
	
	if res.RowsAffected() == 0 {
		return apperr.NewNotFound("Property", id.String())
	}

	return nil
}
