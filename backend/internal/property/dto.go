package property

import (
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type CreatePropertyRequest struct {
	Name        string   `json:"name" binding:"required,max=255"`
	City        string   `json:"city" binding:"required"`
	District    string   `json:"district" binding:"required"`
	Address     string   `json:"address" binding:"omitempty"`
	Ward        string   `json:"ward" binding:"omitempty"`
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
	City        *string         `json:"city" binding:"omitempty"`
	District    *string         `json:"district" binding:"omitempty"`
	Address     *string         `json:"address" binding:"omitempty"`
	Ward        *string         `json:"ward" binding:"omitempty"`
	Latitude    *float64        `json:"latitude" binding:"omitempty"`
	Longitude   *float64        `json:"longitude" binding:"omitempty"`
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
	District    *string                  `json:"district,omitempty"`
	Ward        *string                  `json:"ward,omitempty"`
	Latitude    *float64                 `json:"latitude,omitempty"`
	Longitude   *float64                 `json:"longitude,omitempty"`
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
		District:    p.District,
		Ward:        p.Ward,
		Latitude:    p.Latitude,
		Longitude:   p.Longitude,
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
