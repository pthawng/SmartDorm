package auth

import (
	"context"
	"time"

	"smartdorm/infrastructure/db"

	"github.com/google/uuid"
)

type Repository interface {
	CreateUser(ctx context.Context, email, passwordHash, fullName, phone string) (*User, error)
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	GetUserByID(ctx context.Context, id uuid.UUID) (*User, error)
	GetUserContexts(ctx context.Context, userID uuid.UUID) (*UserContexts, error)
	GetMembership(ctx context.Context, userID, workspaceID uuid.UUID) (*Membership, error)
	GetRenter(ctx context.Context, userID, renterID uuid.UUID) (bool, error)

	// Refresh Token methods
	StoreRefreshToken(ctx context.Context, id, userID uuid.UUID, tokenHash string, exp time.Time, activeRole string, workspaceID *uuid.UUID, deviceID *string, securityStamp uuid.UUID) error
	GetRefreshToken(ctx context.Context, tokenHash string) (*RefreshToken, error)
	DeleteRefreshToken(ctx context.Context, id uuid.UUID) error
	DeleteUserRefreshTokens(ctx context.Context, userID uuid.UUID) error
	UpdateSecurityStamp(ctx context.Context, userID uuid.UUID) (uuid.UUID, error) 
}

type repository struct {
	db *db.Database
}

func NewRepository(db *db.Database) Repository {
	return &repository{db: db}
}

func (r *repository) CreateUser(ctx context.Context, email, passwordHash, fullName, phone string) (*User, error) {
	const q = `
		INSERT INTO users (email, password_hash, full_name, phone) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id, email, password_hash, full_name, phone, security_stamp, is_active, created_at, updated_at, deleted_at`

	var user User
	var p *string
	if phone != "" {
		p = &phone
	}

	err := r.db.GetContext(ctx, &user, q, email, passwordHash, fullName, p)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	const q = `
		SELECT id, email, password_hash, full_name, phone, security_stamp, is_active, created_at, updated_at, deleted_at 
		FROM users 
		WHERE email = $1 AND deleted_at IS NULL`

	var user User
	err := r.db.GetContext(ctx, &user, q, email)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) GetUserByID(ctx context.Context, id uuid.UUID) (*User, error) {
	const q = `
		SELECT id, email, password_hash, full_name, phone, security_stamp, is_active, created_at, updated_at, deleted_at 
		FROM users 
		WHERE id = $1 AND deleted_at IS NULL`

	var user User
	err := r.db.GetContext(ctx, &user, q, id)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserContexts fetches all available workspaces, renter profiles, and admin roles for a user
func (r *repository) GetUserContexts(ctx context.Context, userID uuid.UUID) (*UserContexts, error) {
	contexts := &UserContexts{
		Workspaces: make([]WorkspaceContext, 0),
		Renters:    make([]RenterContext, 0),
		Admins:     make([]AdminContext, 0),
	}

	// 1. Fetch Workspaces (via memberships)
	const qWorkspaces = `
		SELECT w.id AS workspace_id, w.name AS workspace_name, m.role 
		FROM memberships m
		JOIN workspaces w ON m.workspace_id = w.id
		WHERE m.user_id = $1 AND w.deleted_at IS NULL`
	
	err := r.db.SelectContext(ctx, &contexts.Workspaces, qWorkspaces, userID)
	if err != nil {
		return nil, err
	}

	// 2. Fetch Renter Profiles
	const qRenters = `
		SELECT r.id AS renter_id, w.name AS workspace_name 
		FROM renters r
		JOIN workspaces w ON r.workspace_id = w.id
		WHERE r.user_id = $1 AND r.deleted_at IS NULL AND w.deleted_at IS NULL`
	
	err = r.db.SelectContext(ctx, &contexts.Renters, qRenters, userID)
	if err != nil {
		return nil, err
	}

	// 3. Fetch Admin Roles
	const qAdmins = `
		SELECT role FROM admin_roles WHERE user_id = $1`
	
	err = r.db.SelectContext(ctx, &contexts.Admins, qAdmins, userID)
	if err != nil {
		return nil, err
	}

	return contexts, nil
}

func (r *repository) GetMembership(ctx context.Context, userID, workspaceID uuid.UUID) (*Membership, error) {
	const q = `
		SELECT id, user_id, workspace_id, role, created_at 
		FROM memberships 
		WHERE user_id = $1 AND workspace_id = $2`

	var membership Membership
	err := r.db.GetContext(ctx, &membership, q, userID, workspaceID)
	if err != nil {
		return nil, err
	}
	return &membership, nil
}

func (r *repository) GetRenter(ctx context.Context, userID, renterID uuid.UUID) (bool, error) {
	const q = `
		SELECT EXISTS(
			SELECT 1 FROM renters 
			WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
		)`

	var exists bool
	err := r.db.GetContext(ctx, &exists, q, renterID, userID)
	return exists, err
}

func (r *repository) UpdateSecurityStamp(ctx context.Context, userID uuid.UUID) (uuid.UUID, error) {
	newStamp := uuid.New()
	const q = `UPDATE users SET security_stamp = $1, updated_at = NOW() WHERE id = $2`
	_, err := r.db.ExecContext(ctx, q, newStamp, userID)
	return newStamp, err
}

func (r *repository) StoreRefreshToken(ctx context.Context, id, userID uuid.UUID, tokenHash string, exp time.Time, activeRole string, workspaceID *uuid.UUID, deviceID *string, securityStamp uuid.UUID) error {
	const q = `
		INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, active_role, workspace_id, device_id, security_stamp) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	_, err := r.db.ExecContext(ctx, q, id, userID, tokenHash, exp, activeRole, workspaceID, deviceID, securityStamp)
	return err
}

func (r *repository) GetRefreshToken(ctx context.Context, tokenHash string) (*RefreshToken, error) {
	const q = `
		SELECT id, user_id, token_hash, expires_at, active_role, workspace_id, security_stamp, device_id, created_at 
		FROM refresh_tokens 
		WHERE token_hash = $1`
	var rt RefreshToken
	err := r.db.GetContext(ctx, &rt, q, tokenHash)
	if err != nil {
		return nil, err
	}
	return &rt, nil
}

func (r *repository) DeleteRefreshToken(ctx context.Context, id uuid.UUID) error {
	const q = `DELETE FROM refresh_tokens WHERE id = $1`
	_, err := r.db.ExecContext(ctx, q, id)
	return err
}

func (r *repository) DeleteUserRefreshTokens(ctx context.Context, userID uuid.UUID) error {
	const q = `DELETE FROM refresh_tokens WHERE user_id = $1`
	_, err := r.db.ExecContext(ctx, q, userID)
	return err
}
