package renter

import (
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type CreateRenterRequest struct {
	FullName              string  `json:"full_name" binding:"required,max=255"`
	Phone                 string  `json:"phone" binding:"required,max=20"`
	Email                 *string `json:"email" binding:"omitempty,email,max=255"`
	IDNumber              *string `json:"id_number" binding:"omitempty,max=50"`
	DateOfBirth           *string `json:"date_of_birth" binding:"omitempty,datetime=2006-01-02"` // YYYY-MM-DD
	EmergencyContactName  *string `json:"emergency_contact_name" binding:"omitempty,max=255"`
	EmergencyContactPhone *string `json:"emergency_contact_phone" binding:"omitempty,max=20"`
}

type UpdateRenterRequest struct {
	FullName              *string `json:"full_name" binding:"omitempty,max=255"`
	Phone                 *string `json:"phone" binding:"omitempty,max=20"`
	Email                 *string `json:"email" binding:"omitempty,email,max=255"`
	IDNumber              *string `json:"id_number" binding:"omitempty,max=50"`
	DateOfBirth           *string `json:"date_of_birth" binding:"omitempty,datetime=2006-01-02"`
	EmergencyContactName  *string `json:"emergency_contact_name" binding:"omitempty,max=255"`
	EmergencyContactPhone *string `json:"emergency_contact_phone" binding:"omitempty,max=20"`
}

type LinkUserRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// --- Responses ---

type RenterResponse struct {
	ID                    uuid.UUID  `json:"id"`
	WorkspaceID           uuid.UUID  `json:"workspace_id"`
	UserID                *uuid.UUID `json:"user_id,omitempty"`
	FullName              string     `json:"full_name"`
	Phone                 string     `json:"phone"`
	Email                 *string    `json:"email,omitempty"`
	IDNumber              *string    `json:"id_number,omitempty"`
	DateOfBirth           *string    `json:"date_of_birth,omitempty"`
	EmergencyContactName  *string    `json:"emergency_contact_name,omitempty"`
	EmergencyContactPhone *string    `json:"emergency_contact_phone,omitempty"`
	CreatedAt             string     `json:"created_at"`
	UpdatedAt             string     `json:"updated_at"`
}

func mapToResponse(r *Renter) *RenterResponse {
	var dobStr *string
	if r.DateOfBirth != nil {
		d := r.DateOfBirth.Format("2006-01-02")
		dobStr = &d
	}

	return &RenterResponse{
		ID:                    r.ID,
		WorkspaceID:           r.WorkspaceID,
		UserID:                r.UserID,
		FullName:              r.FullName,
		Phone:                 r.Phone,
		Email:                 r.Email,
		IDNumber:              r.IDNumber,
		DateOfBirth:           dobStr,
		EmergencyContactName:  r.EmergencyContactName,
		EmergencyContactPhone: r.EmergencyContactPhone,
		CreatedAt:             r.CreatedAt.Format(time.RFC3339),
		UpdatedAt:             r.UpdatedAt.Format(time.RFC3339),
	}
}
