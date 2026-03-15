package room

import (
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type CreateRoomRequest struct {
	PropertyID uuid.UUID `json:"property_id" binding:"required"`
	Name       string    `json:"name" binding:"required,max=50"`
	Floor      *string   `json:"floor" binding:"omitempty,max=20"`
	Status     string    `json:"status" binding:"required,oneof=AVAILABLE OCCUPIED MAINTENANCE"`
	RentAmount int       `json:"rent_amount" binding:"required,gte=0"`
}

type UpdateRoomRequest struct {
	Name       *string `json:"name" binding:"omitempty,max=50"`
	Floor      *string `json:"floor" binding:"omitempty,max=20"`
	Status     *string `json:"status" binding:"omitempty,oneof=AVAILABLE OCCUPIED MAINTENANCE"`
	RentAmount *int    `json:"rent_amount" binding:"omitempty,gte=0"`
}

// --- Responses ---

type RoomResponse struct {
	ID         uuid.UUID `json:"id"`
	PropertyID uuid.UUID `json:"property_id"`
	Name       string    `json:"name"`
	Floor      *string   `json:"floor,omitempty"`
	Status     string    `json:"status"`
	RentAmount int       `json:"rent_amount"`
	CreatedAt  string    `json:"created_at"`
	UpdatedAt  string    `json:"updated_at"`
}

func mapToResponse(r *Room) *RoomResponse {
	return &RoomResponse{
		ID:         r.ID,
		PropertyID: r.PropertyID,
		Name:       r.Name,
		Floor:      r.Floor,
		Status:     r.Status,
		RentAmount: r.RentAmount,
		CreatedAt:  r.CreatedAt.Format(time.RFC3339),
		UpdatedAt:  r.UpdatedAt.Format(time.RFC3339),
	}
}
