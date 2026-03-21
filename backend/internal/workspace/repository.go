package workspace

import (
	"context"

	"smartdorm/infrastructure/db"

	"github.com/google/uuid"
)

type Repository interface {
	CreateWorkspaceTx(ctx context.Context, name string, userID uuid.UUID) (*Workspace, string, error)
	ListUserWorkspaces(ctx context.Context, userID uuid.UUID) ([]*WorkspaceResponse, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status string) error
	IsMember(ctx context.Context, workspaceID, userID uuid.UUID) (bool, error)
	GetDashboardStats(ctx context.Context, workspaceID uuid.UUID) (*DashboardStatsResponse, error)
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

	// 1. Create Workspace (Default: pending)
	const qWorkspace = `
		INSERT INTO workspaces (name, status, created_by)
		VALUES ($1, 'pending', $2)
		RETURNING id, name, status, created_by, created_at, updated_at, deleted_at`

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
		SELECT w.id, w.name, w.created_by, w.created_at, m.role AS membership_role
		FROM workspaces w
		JOIN memberships m ON w.id = m.workspace_id
		WHERE m.user_id = $1 AND w.deleted_at IS NULL
		ORDER BY w.created_at DESC`

	var list []WorkspaceResponse
	if err := r.db.SelectContext(ctx, &list, q, userID); err != nil {
		return nil, err
	}

	workspaces := make([]*WorkspaceResponse, len(list))
	for i := range list {
		workspaces[i] = &list[i]
	}

	return workspaces, nil
}

func (r *repository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	const q = `UPDATE workspaces SET status = $1, updated_at = NOW() WHERE id = $2`
	_, err := r.db.ExecContext(ctx, q, status, id)
	return err
}

func (r *repository) IsMember(ctx context.Context, workspaceID, userID uuid.UUID) (bool, error) {
	const q = `SELECT EXISTS(SELECT 1 FROM memberships WHERE workspace_id = $1 AND user_id = $2)`
	var exists bool
	err := r.db.GetContext(ctx, &exists, q, workspaceID, userID)
	return exists, err
}

func (r *repository) GetDashboardStats(ctx context.Context, workspaceID uuid.UUID) (*DashboardStatsResponse, error) {
	var totalProperties int
	if err := r.db.GetContext(ctx, &totalProperties, `SELECT COUNT(*) FROM properties WHERE workspace_id = $1 AND deleted_at IS NULL`, workspaceID); err != nil {
		return nil, err
	}

	var stats struct {
		TotalRooms    int `db:"total_rooms"`
		OccupiedRooms int `db:"occupied_rooms"`
	}
	const roomsQuery = `
		SELECT 
			COUNT(r.id) AS total_rooms,
			COALESCE(SUM(CASE WHEN r.status = 'OCCUPIED' THEN 1 ELSE 0 END), 0) AS occupied_rooms
		FROM rooms r
		JOIN properties p ON r.property_id = p.id
		WHERE p.workspace_id = $1 AND p.deleted_at IS NULL AND r.deleted_at IS NULL`
	
	if err := r.db.GetContext(ctx, &stats, roomsQuery, workspaceID); err != nil {
		return nil, err
	}

	occupancyRate := float64(0)
	if stats.TotalRooms > 0 {
		occupancyRate = float64(stats.OccupiedRooms) / float64(stats.TotalRooms) * 100.0
	}

	monthlyRevenue := float64(15000000)

	return &DashboardStatsResponse{
		TotalProperties: totalProperties,
		TotalRooms:      stats.TotalRooms,
		OccupancyRate:   occupancyRate,
		MonthlyRevenue:  monthlyRevenue,
	}, nil
}
