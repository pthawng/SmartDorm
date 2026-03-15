package room

import (
	"context"
	"strings"

	"smartdorm/infrastructure/db"
	apperr "smartdorm/shared/errors"
	"smartdorm/shared/pagination"

	"github.com/google/uuid"
)

type Repository interface {
	Create(ctx context.Context, workspaceID uuid.UUID, r *Room) error
	GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Room, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, propertyID *uuid.UUID, status *string) ([]*Room, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Room, error)
	Delete(ctx context.Context, workspaceID, id uuid.UUID) error
}

type repository struct {
	db *db.Database
}

func NewRepository(db *db.Database) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, workspaceID uuid.UUID, room *Room) error {
	const q = `
		INSERT INTO rooms (workspace_id, property_id, name, floor, status, rent_amount)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at, deleted_at`

	return r.db.GetContext(ctx, room, q, workspaceID, room.PropertyID, room.Name, room.Floor, room.Status, room.RentAmount)
}

func (r *repository) GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Room, error) {
	const q = `
		SELECT id, workspace_id, property_id, name, floor, status, rent_amount, created_at, updated_at, deleted_at
		FROM rooms
		WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL`

	var room Room
	if err := r.db.GetContext(ctx, &room, q, id, workspaceID); err != nil {
		return nil, err
	}
	return &room, nil
}

func (r *repository) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, propertyID *uuid.UUID, status *string) ([]*Room, int64, error) {
	queryBase := `FROM rooms WHERE workspace_id = $1 AND deleted_at IS NULL`
	args := []interface{}{workspaceID}
	argIdx := 2

	if propertyID != nil {
		queryBase += ` AND property_id = $` + string(rune('0'+argIdx))
		args = append(args, *propertyID)
		argIdx++
	}

	if status != nil {
		queryBase += ` AND status = $` + string(rune('0'+argIdx))
		args = append(args, *status)
		argIdx++
	}

	// 1. Get total count
	qCount := `SELECT COUNT(*) ` + queryBase
	var total int64
	if err := r.db.GetContext(ctx, &total, qCount, args...); err != nil {
		return nil, 0, err
	}

	if total == 0 {
		return make([]*Room, 0), 0, nil
	}

	// 2. Fetch paginated rows
	qRows := `SELECT id, workspace_id, property_id, name, floor, status, rent_amount, created_at, updated_at, deleted_at ` + 
		queryBase + 
		` ORDER BY created_at DESC LIMIT $` + string(rune('0'+argIdx)) + ` OFFSET $` + string(rune('0'+argIdx+1))
	
	args = append(args, params.Limit(), params.Offset())

	var rooms []*Room
	err := r.db.SelectContext(ctx, &rooms, qRows, args...)
	if err != nil {
		return nil, 0, err
	}

	return rooms, total, nil
}

func (r *repository) Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Room, error) {
	if len(updates) == 0 {
		return r.GetByID(ctx, workspaceID, id)
	}

	query := "UPDATE rooms SET "
	var args []interface{}
	var setClauses []string
	
	i := 1
	for k, v := range updates {
		if k == "name" || k == "floor" || k == "status" || k == "rent_amount" {
			setClauses = append(setClauses, k+" = $"+string(rune('0'+i)))
			args = append(args, v)
			i++
		}
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	
	query += strings.Join(setClauses, ", ") + " WHERE id = $" + string(rune('0'+i)) + " AND workspace_id = $" + string(rune('0'+i+1)) + " AND deleted_at IS NULL RETURNING id, workspace_id, property_id, name, floor, status, rent_amount, created_at, updated_at, deleted_at"
	args = append(args, id, workspaceID)

	var room Room
	if err := r.db.GetContext(ctx, &room, query, args...); err != nil {
		return nil, err
	}

	return &room, nil
}

func (r *repository) Delete(ctx context.Context, workspaceID, id uuid.UUID) error {
	const q = `
		UPDATE rooms 
		SET deleted_at = NOW() 
		WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL`

	res, err := r.db.Pool.Exec(ctx, q, id, workspaceID)
	if err != nil {
		return err
	}
	
	if res.RowsAffected() == 0 {
		return apperr.NewNotFound("Room", id.String())
	}

	return nil
}
