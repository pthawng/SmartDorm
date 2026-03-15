package workspace

import (
	"context"

	"smartdorm/infrastructure/db"

	"github.com/google/uuid"
)

type Repository interface {
	CreateWorkspaceTx(ctx context.Context, name string, userID uuid.UUID) (*Workspace, string, error)
	ListUserWorkspaces(ctx context.Context, userID uuid.UUID) ([]*WorkspaceResponse, error)
}

type repository struct {
	db *db.Database
}

func NewRepository(db *db.Database) Repository {
	return &repository{db: db}
}

// CreateWorkspaceTx creates a workspace and assigns the owner role in a single transaction
func (r *repository) CreateWorkspaceTx(ctx context.Context, name string, userID uuid.UUID) (*Workspace, string, error) {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return nil, "", err
	}
	defer tx.Rollback()

	// 1. Create Workspace
	const qWorkspace = `
		INSERT INTO workspaces (name, created_by)
		VALUES ($1, $2)
		RETURNING id, name, created_by, created_at, updated_at, deleted_at`

	var w Workspace
	if err := tx.GetContext(ctx, &w, qWorkspace, name, userID); err != nil {
		return nil, "", err
	}

	// 2. Assign Membership (owner)
	const qMembership = `
		INSERT INTO memberships (user_id, workspace_id, role)
		VALUES ($1, $2, 'owner')
		RETURNING role`

	var role string
	if err := tx.GetContext(ctx, &role, qMembership, userID, w.ID); err != nil {
		return nil, "", err
	}

	// 3. Commit
	if err := tx.Commit(); err != nil {
		return nil, "", err
	}

	return &w, role, nil
}

func (r *repository) ListUserWorkspaces(ctx context.Context, userID uuid.UUID) ([]*WorkspaceResponse, error) {
	const q = `
		SELECT w.id, w.name, w.created_by, m.role AS membership_role
		FROM workspaces w
		JOIN memberships m ON w.id = m.workspace_id
		WHERE m.user_id = $1 AND w.deleted_at IS NULL
		ORDER BY w.created_at DESC`

	var workspaces []*WorkspaceResponse
	if err := r.db.SelectContext(ctx, &workspaces, q, userID); err != nil {
		return nil, err
	}

	return workspaces, nil
}
