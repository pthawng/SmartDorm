package contract

import (
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type CreateContractRequest struct {
	RoomID        uuid.UUID `json:"room_id" binding:"required"`
	RenterID      uuid.UUID `json:"renter_id" binding:"required"`
	StartDate     string    `json:"start_date" binding:"required,datetime=2006-01-02"`
	EndDate       string    `json:"end_date" binding:"required,datetime=2006-01-02"`
	MonthlyRent   int       `json:"monthly_rent" binding:"required,gt=0"`
	DepositAmount int       `json:"deposit_amount" binding:"omitempty,gte=0"`
	TermsNotes    *string   `json:"terms_notes" binding:"omitempty"`
}

type UpdateContractRequest struct {
	StartDate     *string `json:"start_date" binding:"omitempty,datetime=2006-01-02"`
	EndDate       *string `json:"end_date" binding:"omitempty,datetime=2006-01-02"`
	MonthlyRent   *int    `json:"monthly_rent" binding:"omitempty,gt=0"`
	DepositAmount *int    `json:"deposit_amount" binding:"omitempty,gte=0"`
	TermsNotes    *string `json:"terms_notes" binding:"omitempty"`
}

type TerminateContractRequest struct {
	TerminationDate   string  `json:"termination_date" binding:"required,datetime=2006-01-02"`
	TerminationReason *string `json:"termination_reason" binding:"omitempty"`
}

// --- Responses ---

type ContractResponse struct {
	ID                uuid.UUID `json:"id"`
	WorkspaceID       uuid.UUID `json:"workspace_id"`
	RoomID            uuid.UUID `json:"room_id"`
	RenterID          uuid.UUID `json:"renter_id"`
	Status            string    `json:"status"`
	StartDate         string    `json:"start_date"`
	EndDate           string    `json:"end_date"`
	MonthlyRent       int       `json:"monthly_rent"`
	DepositAmount     int       `json:"deposit_amount"`
	TermsNotes        *string   `json:"terms_notes,omitempty"`
	ActivatedAt       *string   `json:"activated_at,omitempty"`
	TerminatedAt      *string   `json:"terminated_at,omitempty"`
	TerminationDate   *string   `json:"termination_date,omitempty"`
	TerminationReason *string   `json:"termination_reason,omitempty"`
	CreatedAt         string    `json:"created_at"`
	UpdatedAt         string    `json:"updated_at"`
}

func mapToResponse(c *Contract) *ContractResponse {
	var activatedAt, terminatedAt, termDate *string

	if c.ActivatedAt != nil {
		s := c.ActivatedAt.Format(time.RFC3339)
		activatedAt = &s
	}
	if c.TerminatedAt != nil {
		s := c.TerminatedAt.Format(time.RFC3339)
		terminatedAt = &s
	}
	if c.TerminationDate != nil {
		s := c.TerminationDate.Format("2006-01-02")
		termDate = &s
	}

	return &ContractResponse{
		ID:                c.ID,
		WorkspaceID:       c.WorkspaceID,
		RoomID:            c.RoomID,
		RenterID:          c.RenterID,
		Status:            c.Status,
		StartDate:         c.StartDate.Format("2006-01-02"),
		EndDate:           c.EndDate.Format("2006-01-02"),
		MonthlyRent:       c.MonthlyRent,
		DepositAmount:     c.DepositAmount,
		TermsNotes:        c.TermsNotes,
		ActivatedAt:       activatedAt,
		TerminatedAt:      terminatedAt,
		TerminationDate:   termDate,
		TerminationReason: c.TerminationReason,
		CreatedAt:         c.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         c.UpdatedAt.Format(time.RFC3339),
	}
}
