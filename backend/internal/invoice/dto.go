package invoice

import (
	"time"

	"github.com/google/uuid"
)

// --- Requests ---

type CreateInvoiceRequest struct {
	ContractID         uuid.UUID `json:"contract_id" binding:"required"`
	BillingPeriodStart string    `json:"billing_period_start" binding:"required,datetime=2006-01-02"`
	BillingPeriodEnd   string    `json:"billing_period_end" binding:"required,datetime=2006-01-02"`
	AmountDue          int       `json:"amount_due" binding:"required,gt=0"`
	DueDate            string    `json:"due_date" binding:"required,datetime=2006-01-02"`
	Notes              *string   `json:"notes" binding:"omitempty"`
}

type UpdateInvoiceRequest struct {
	AmountDue *int    `json:"amount_due" binding:"omitempty,gt=0"`
	DueDate   *string `json:"due_date" binding:"omitempty,datetime=2006-01-02"`
	Notes     *string `json:"notes" binding:"omitempty"`
}

type CancelInvoiceRequest struct {
	CancellationReason string `json:"cancellation_reason" binding:"required"`
}

// --- Responses ---

type InvoiceResponse struct {
	ID                 uuid.UUID `json:"id"`
	WorkspaceID        uuid.UUID `json:"workspace_id"`
	ContractID         uuid.UUID `json:"contract_id"`
	RenterID           uuid.UUID `json:"renter_id"`
	BillingPeriodStart string    `json:"billing_period_start"`
	BillingPeriodEnd   string    `json:"billing_period_end"`
	AmountDue          int       `json:"amount_due"`
	Status             string    `json:"status"`
	PaidAt             *string   `json:"paid_at,omitempty"`
	DueDate            string    `json:"due_date"`
	Notes              *string   `json:"notes,omitempty"`
	CancellationReason *string   `json:"cancellation_reason,omitempty"`
	CreatedAt          string    `json:"created_at"`
	UpdatedAt          string    `json:"updated_at"`
}

func mapToResponse(i *Invoice) *InvoiceResponse {
	var paidAt *string
	if i.PaidAt != nil {
		s := i.PaidAt.Format(time.RFC3339)
		paidAt = &s
	}

	return &InvoiceResponse{
		ID:                 i.ID,
		WorkspaceID:        i.WorkspaceID,
		ContractID:         i.ContractID,
		RenterID:           i.RenterID,
		BillingPeriodStart: i.BillingPeriodStart.Format("2006-01-02"),
		BillingPeriodEnd:   i.BillingPeriodEnd.Format("2006-01-02"),
		AmountDue:          i.AmountDue,
		Status:             i.Status,
		PaidAt:             paidAt,
		DueDate:            i.DueDate.Format("2006-01-02"),
		Notes:              i.Notes,
		CancellationReason: i.CancellationReason,
		CreatedAt:          i.CreatedAt.Format(time.RFC3339),
		UpdatedAt:          i.UpdatedAt.Format(time.RFC3339),
	}
}
