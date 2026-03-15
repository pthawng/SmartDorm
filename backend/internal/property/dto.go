package property

import (
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type CreatePropertyRequest struct {
	Name        string  `json:"name" binding:"required,max=255"`
	Address     string  `json:"address" binding:"required"`
	Description *string `json:"description" binding:"omitempty"`
}

type UpdatePropertyRequest struct {
	Name        *string `json:"name" binding:"omitempty,max=255"`
	Address     *string `json:"address" binding:"omitempty"`
	Description *string `json:"description" binding:"omitempty"`
}

// --- Responses ---

type PropertyResponse struct {
	ID          uuid.UUID `json:"id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
	Name        string    `json:"name"`
	Address     string    `json:"address"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   string    `json:"created_at"`
	UpdatedAt   string    `json:"updated_at"`
}

func mapToResponse(p *Property) *PropertyResponse {
	return &PropertyResponse{
		ID:          p.ID,
		WorkspaceID: p.WorkspaceID,
		Name:        p.Name,
		Address:     p.Address,
		Description: p.Description,
		CreatedAt:   p.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   p.UpdatedAt.Format(time.RFC3339),
	}
}
