package renter

import (
	"context"
	"database/sql" // Added by instruction
	"errors"      // Added by instruction (implicitly needed for errors.Is)
	"strings"

	"smartdorm/infrastructure/db"
	apperr "smartdorm/shared/errors" // Added by instruction
	"smartdorm/shared/pagination"

	"github.com/google/uuid"
)

type Repository interface {
	Create(ctx context.Context, workspaceID uuid.UUID, r *Renter) error
	GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Renter, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, search string) ([]*Renter, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Renter, error)
	Delete(ctx context.Context, workspaceID, id uuid.UUID) error
	LinkUser(ctx context.Context, workspaceID, renterID, userID uuid.UUID) error
	GetUserByEmail(ctx context.Context, email string) (*uuid.UUID, error) // Helper to lookup user id for linking
}

type repository struct {
	db *db.Database
}

func NewRepository(db *db.Database) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, workspaceID uuid.UUID, renter *Renter) error {
	const q = `
		INSERT INTO renters (workspace_id, full_name, phone, email, id_number, date_of_birth, emergency_contact_name, emergency_contact_phone)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at, deleted_at`

	return r.db.GetContext(ctx, renter, q, 
		workspaceID, 
		renter.FullName, 
		renter.Phone, 
		renter.Email, 
		renter.IDNumber, 
		renter.DateOfBirth, 
		renter.EmergencyContactName, 
		renter.EmergencyContactPhone)
}

func (r *repository) GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Renter, error) {
	const q = `
		SELECT id, workspace_id, user_id, full_name, phone, email, id_number, date_of_birth, emergency_contact_name, emergency_contact_phone, created_at, updated_at, deleted_at
		FROM renters
		WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL`

	var renter Renter
	if err := r.db.GetContext(ctx, &renter, q, id, workspaceID); err != nil {
		return nil, err
	}
	return &renter, nil
}

func (r *repository) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, search string) ([]*Renter, int64, error) {
	queryBase := `FROM renters WHERE workspace_id = $1 AND deleted_at IS NULL`
	args := []interface{}{workspaceID}
	argIdx := 2

	if search != "" {
		// Basic ILIKE search on name or phone
		queryBase += ` AND (full_name ILIKE $` + string(rune('0'+argIdx)) + ` OR phone ILIKE $` + string(rune('0'+argIdx)) + `)`
		searchTerm := "%" + search + "%"
		args = append(args, searchTerm)
		argIdx++
	}

	// 1. Get total count
	qCount := `SELECT COUNT(*) ` + queryBase
	var total int64
	if err := r.db.GetContext(ctx, &total, qCount, args...); err != nil {
		return nil, 0, err
	}

	if total == 0 {
		return make([]*Renter, 0), 0, nil
	}

	// 2. Fetch paginated rows
	qRows := `SELECT id, workspace_id, user_id, full_name, phone, email, id_number, date_of_birth, emergency_contact_name, emergency_contact_phone, created_at, updated_at, deleted_at ` + 
		queryBase + 
		` ORDER BY created_at DESC LIMIT $` + string(rune('0'+argIdx)) + ` OFFSET $` + string(rune('0'+argIdx+1))
	
	args = append(args, params.Limit(), params.Offset())

	var renters []*Renter
	err := r.db.SelectContext(ctx, &renters, qRows, args...)
	if err != nil {
		return nil, 0, err
	}

	return renters, total, nil
}

func (r *repository) Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Renter, error) {
	if len(updates) == 0 {
		return r.GetByID(ctx, workspaceID, id)
	}

	query := "UPDATE renters SET "
	var args []interface{}
	var setClauses []string
	
	i := 1
	for k, v := range updates {
		if k == "full_name" || k == "phone" || k == "email" || k == "id_number" || k == "date_of_birth" || k == "emergency_contact_name" || k == "emergency_contact_phone" {
			setClauses = append(setClauses, k+" = $"+string(rune('0'+i)))
			args = append(args, v)
			i++
		}
	}

	setClauses = append(setClauses, "updated_at = NOW()")
	
	query += strings.Join(setClauses, ", ") + " WHERE id = $" + string(rune('0'+i)) + " AND workspace_id = $" + string(rune('0'+i+1)) + " AND deleted_at IS NULL RETURNING id, workspace_id, user_id, full_name, phone, email, id_number, date_of_birth, emergency_contact_name, emergency_contact_phone, created_at, updated_at, deleted_at"
	args = append(args, id, workspaceID)

	var renter Renter
	if err := r.db.GetContext(ctx, &renter, query, args...); err != nil {
		return nil, err
	}

	return &renter, nil
}

func (r *repository) Delete(ctx context.Context, workspaceID, renterID uuid.UUID) error {
	query := `
		DELETE FROM renters
		WHERE id = $1 AND workspace_id = $2
	`
	res, err := r.db.ExecContext(ctx, query, renterID, workspaceID)
	if err != nil {
		return err
	}
	
	if errors.Is(err, sql.ErrNoRows) {
		return apperr.NewNotFound("Renter", renterID.String())
	}
	
	affected, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if affected == 0 {
		return apperr.NewNotFound("Renter", renterID.String())
	}

	return nil
}

func (r *repository) LinkUser(ctx context.Context, workspaceID, renterID, userID uuid.UUID) error {
	const q = `
		UPDATE renters
		SET user_id = $1, updated_at = NOW()
		WHERE id = $2 AND workspace_id = $3 AND deleted_at IS NULL`

	res, err := r.db.Pool.Exec(ctx, q, userID, renterID, workspaceID)
	if err != nil {
		return err
	}

	if res.RowsAffected() == 0 {
		return apperr.NewNotFound("Renter", renterID.String())
	}
	return nil
}

func (r *repository) GetUserByEmail(ctx context.Context, email string) (*uuid.UUID, error) {
	const q = `SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL`
	var id uuid.UUID
	err := r.db.GetContext(ctx, &id, q, email)
	if err != nil {
		return nil, err // Let service layer handle sql.ErrNoRows
	}
	return &id, nil
}
