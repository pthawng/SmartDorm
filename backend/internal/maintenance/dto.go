package maintenance

import (
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type CreateMaintenanceRequest struct {
	RoomID      uuid.UUID  `json:"room_id" binding:"required"`
	RenterID    *uuid.UUID `json:"renter_id" binding:"omitempty"` // Staff creates on behalf of renter, or renter themselves
	Title       string     `json:"title" binding:"required,max=255"`
	Description string     `json:"description" binding:"required"`
	Priority    string     `json:"priority" binding:"required,oneof=LOW NORMAL HIGH URGENT"`
}

type UpdateMaintenanceRequest struct {
	Title       *string `json:"title" binding:"omitempty,max=255"`
	Description *string `json:"description" binding:"omitempty"`
	Priority    *string `json:"priority" binding:"omitempty,oneof=LOW NORMAL HIGH URGENT"`
	Status      *string `json:"status" binding:"omitempty,oneof=OPEN IN_PROGRESS RESOLVED CLOSED"`
}

type ResolveMaintenanceRequest struct {
	ResolutionNote string `json:"resolution_note" binding:"required"`
}

// --- Responses ---

type MaintenanceResponse struct {
	ID                 uuid.UUID  `json:"id"`
	WorkspaceID        uuid.UUID  `json:"workspace_id"`
	RoomID             uuid.UUID  `json:"room_id"`
	RenterID           *uuid.UUID `json:"renter_id,omitempty"`
	SubmittedByUserID  uuid.UUID  `json:"submitted_by_user_id"`
	Title              string     `json:"title"`
	Description        string     `json:"description"`
	Status             string     `json:"status"`
	Priority           string     `json:"priority"`
	ResolutionNote     *string    `json:"resolution_note,omitempty"`
	ResolvedAt         *string    `json:"resolved_at,omitempty"`
	CreatedAt          string     `json:"created_at"`
	UpdatedAt          string     `json:"updated_at"`
}

func mapToResponse(m *MaintenanceRequest) *MaintenanceResponse {
	var resolvedAt *string
	if m.ResolvedAt != nil {
		s := m.ResolvedAt.Format(time.RFC3339)
		resolvedAt = &s
	}

	return &MaintenanceResponse{
		ID:                 m.ID,
		WorkspaceID:        m.WorkspaceID,
		RoomID:             m.RoomID,
		RenterID:           m.RenterID,
		SubmittedByUserID:  m.SubmittedByUserID,
		Title:              m.Title,
		Description:        m.Description,
		Status:             m.Status,
		Priority:           m.Priority,
		ResolutionNote:     m.ResolutionNote,
		ResolvedAt:         resolvedAt,
		CreatedAt:          m.CreatedAt.Format(time.RFC3339),
		UpdatedAt:          m.UpdatedAt.Format(time.RFC3339),
	}
}
