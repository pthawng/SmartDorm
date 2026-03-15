package workspace

import "github.com/google/uuid"

// --- Requests ---

type CreateWorkspaceRequest struct {
	Name string `json:"name" binding:"required,max=255"`
}

// --- Responses ---

type WorkspaceResponse struct {
	ID             uuid.UUID `json:"id"`
	Name           string    `json:"name"`
	CreatedBy      uuid.UUID `json:"created_by"`
	MembershipRole string    `json:"membership_role,omitempty"` // Included when requested by a specific user context
}
