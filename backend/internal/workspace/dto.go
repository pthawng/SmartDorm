package workspace

import (
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type CreateWorkspaceRequest struct {
	Name string `json:"name" binding:"required,max=255"`
}

// --- Responses ---

type WorkspaceResponse struct {
	ID             uuid.UUID `json:"id" db:"id"`
	Name           string    `json:"name" db:"name"`
	CreatedBy      uuid.UUID `json:"created_by" db:"created_by"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	MembershipRole string    `json:"membership_role,omitempty" db:"membership_role"` // Included when requested by a specific user context
}

type DashboardStatsResponse struct {
	TotalProperties int     `json:"total_properties"`
	TotalRooms      int     `json:"total_rooms"`
	OccupancyRate   float64 `json:"occupancy_rate"`
	MonthlyRevenue  float64 `json:"monthly_revenue"`
}
