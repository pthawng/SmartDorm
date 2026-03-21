package property

import (
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type CreatePropertyRequest struct {
	Name        string   `json:"name" binding:"required,max=255"`
	Address     string   `json:"address" binding:"required"`
	City        string   `json:"city" binding:"required"`
	Type        *string  `json:"type" binding:"omitempty"`
	Description *string  `json:"description" binding:"omitempty"`
	Amenities   []string `json:"amenities" binding:"omitempty"`
}

type AddPropertyImageRequest struct {
	URL          string `json:"url" binding:"required,url"`
	IsPrimary    bool   `json:"is_primary"`
	DisplayOrder int    `json:"display_order"`
}

type UpdatePropertyRequest struct {
	Name        *string         `json:"name" binding:"omitempty,max=255"`
	Address     *string         `json:"address" binding:"omitempty"`
	City        *string         `json:"city" binding:"omitempty"`
	Type        *string         `json:"type" binding:"omitempty"`
	Status      *PropertyStatus `json:"status" binding:"omitempty,oneof=draft published archived"`
	Description *string         `json:"description" binding:"omitempty"`
	Amenities   []string        `json:"amenities" binding:"omitempty"`
}

// --- Responses ---

type PropertyResponse struct {
	ID          uuid.UUID                `json:"id"`
	WorkspaceID uuid.UUID                `json:"workspace_id"`
	Name        string                   `json:"name"`
	Address     string                   `json:"address"`
	City        string                   `json:"city"`
	Type        *string                  `json:"type,omitempty"`
	Status      PropertyStatus           `json:"status"`
	Amenities   []string                 `json:"amenities"`
	Description *string                  `json:"description,omitempty"`
	RoomCount   int                      `json:"unit_count"`
	Images      []*PropertyImageResponse `json:"images,omitempty"`
	CreatedAt   string                   `json:"created_at"`
	UpdatedAt   string                   `json:"updated_at"`
}

type PropertyImageResponse struct {
	ID           uuid.UUID `json:"id"`
	URL          string    `json:"url"`
	IsPrimary    bool      `json:"is_primary"`
	DisplayOrder int       `json:"display_order"`
}

func mapToResponse(p *Property, images []*PropertyImage) *PropertyResponse {
	imgResponses := make([]*PropertyImageResponse, 0)
	for _, img := range images {
		imgResponses = append(imgResponses, &PropertyImageResponse{
			ID:           img.ID,
			URL:          img.URL,
			IsPrimary:    img.IsPrimary,
			DisplayOrder: img.DisplayOrder,
		})
	}

	return &PropertyResponse{
		ID:          p.ID,
		WorkspaceID: p.WorkspaceID,
		Name:        p.Name,
		Address:     p.Address,
		City:        p.City,
		Type:        p.Type,
		Status:      p.Status,
		Amenities:   p.Amenities,
		Description: p.Description,
		RoomCount:   p.RoomCount,
		Images:      imgResponses,
		CreatedAt:   p.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   p.UpdatedAt.Format(time.RFC3339),
	}
}
