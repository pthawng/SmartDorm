package auth

import (
	"time"

	"github.com/google/uuid"
)

// User represents the central identity record
type User struct {
	ID           uuid.UUID  `db:"id"`
	Email        string     `db:"email"`
	PasswordHash string     `db:"password_hash"`
	FullName     string     `db:"full_name"`
	Phone        *string    `db:"phone"`
	IsActive     bool       `db:"is_active"`
	CreatedAt    time.Time  `db:"created_at"`
	UpdatedAt    time.Time  `db:"updated_at"`
	DeletedAt    *time.Time `db:"deleted_at"`
}

// Membership represents a user's role within a workspace
type Membership struct {
	ID          uuid.UUID `db:"id"`
	UserID      uuid.UUID `db:"user_id"`
	WorkspaceID uuid.UUID `db:"workspace_id"`
	Role        string    `db:"role"` // 'owner', 'property_manager', 'staff'
	CreatedAt   time.Time `db:"created_at"`
}

// AdminRole represents a platform-level role
type AdminRole struct {
	ID        uuid.UUID `db:"id"`
	UserID    uuid.UUID `db:"user_id"`
	Role      string    `db:"role"` // 'super_admin', 'support', 'finance'
	CreatedAt time.Time `db:"created_at"`
}

// UserContexts represents the aggregated authorization contexts for a user
type UserContexts struct {
	Workspaces []WorkspaceContext
	Renters    []RenterContext
	Admins     []AdminContext
}

type WorkspaceContext struct {
	WorkspaceID   uuid.UUID `db:"workspace_id"`
	WorkspaceName string    `db:"workspace_name"`
	Role          string    `db:"role"`
}

type RenterContext struct {
	RenterID      uuid.UUID `db:"renter_id"`
	WorkspaceName string    `db:"workspace_name"`
}

type AdminContext struct {
	Role string `db:"role"`
}
