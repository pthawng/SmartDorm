package invoice

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"

	"smartdorm/shared/events"
	apperr "smartdorm/shared/errors"
	"smartdorm/shared/pagination"
)

type Service interface {
	Create(ctx context.Context, workspaceID uuid.UUID, req CreateInvoiceRequest) (*InvoiceResponse, error)
	Get(ctx context.Context, workspaceID, id uuid.UUID) (*InvoiceResponse, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, contractID, renterID *uuid.UUID, status *string) ([]*InvoiceResponse, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdateInvoiceRequest) (*InvoiceResponse, error)
	
	MarkPaid(ctx context.Context, workspaceID, id uuid.UUID) (*InvoiceResponse, error)
	Cancel(ctx context.Context, workspaceID, id uuid.UUID, req CancelInvoiceRequest) (*InvoiceResponse, error)
}

type service struct {
	repo     Repository
	eventBus events.Bus
}

func NewService(repo Repository, eventBus events.Bus) Service {
	return &service{
		repo:     repo,
		eventBus: eventBus,
	}
}

func parseDate(d string) (time.Time, error) {
	t, err := time.Parse("2006-01-02", d)
	if err != nil {
		return time.Time{}, apperr.NewValidation(map[string]string{"date": "Invalid date format, expected YYYY-MM-DD"})
	}
	return t, nil
}

func (s *service) Create(ctx context.Context, workspaceID uuid.UUID, req CreateInvoiceRequest) (*InvoiceResponse, error) {
	start, err := parseDate(req.BillingPeriodStart)
	if err != nil { return nil, err }
	end, err := parseDate(req.BillingPeriodEnd)
	if err != nil { return nil, err }
	due, err := parseDate(req.DueDate)
	if err != nil { return nil, err }

	if !start.Before(end) {
		return nil, apperr.NewValidation(map[string]string{"billing_period_end": "Must be after start date"})
	}

	// Fetch RenterID from the active contract
	renterID, err := s.repo.GetContractDetails(ctx, workspaceID, req.ContractID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewValidation(map[string]string{"contract_id": "Must be an ACTIVE contract belonging to your workspace"})
		}
		return nil, apperr.NewInternal(err, "failed to validate contract")
	}

	i := &Invoice{
		ContractID:         req.ContractID,
		RenterID:           *renterID,
		BillingPeriodStart: start,
		BillingPeriodEnd:   end,
		AmountDue:          req.AmountDue,
		DueDate:            due,
		Notes:              req.Notes,
	}

	if err := s.repo.Create(ctx, workspaceID, i); err != nil {
		return nil, apperr.NewInternal(err, "failed to create invoice")
	}

	i.WorkspaceID = workspaceID
	return mapToResponse(i), nil
}

func (s *service) Get(ctx context.Context, workspaceID, id uuid.UUID) (*InvoiceResponse, error) {
	i, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Invoice", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get invoice")
	}

	return mapToResponse(i), nil
}

func (s *service) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, contractID, renterID *uuid.UUID, status *string) ([]*InvoiceResponse, int64, error) {
	invoices, total, err := s.repo.List(ctx, workspaceID, params, contractID, renterID, status)
	if err != nil {
		return nil, 0, apperr.NewInternal(err, "failed to list invoices")
	}

	responses := make([]*InvoiceResponse, len(invoices))
	for idx, i := range invoices {
		responses[idx] = mapToResponse(i)
	}

	return responses, total, nil
}

func (s *service) Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdateInvoiceRequest) (*InvoiceResponse, error) {
	existing, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Invoice", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get invoice")
	}

	if existing.Status != "PENDING" && existing.Status != "OVERDUE" {
		return nil, apperr.NewValidation(map[string]string{"status": "Only PENDING or OVERDUE invoices can be updated"})
	}

	updates := make(map[string]interface{})

	if req.AmountDue != nil {
		updates["amount_due"] = *req.AmountDue
	}
	if req.DueDate != nil {
		d, err := parseDate(*req.DueDate)
		if err != nil { return nil, err }
		updates["due_date"] = d
	}
	if req.Notes != nil {
		updates["notes"] = *req.Notes
	}

	if len(updates) == 0 {
		return mapToResponse(existing), nil
	}

	i, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to update invoice")
	}

	return mapToResponse(i), nil
}

func (s *service) MarkPaid(ctx context.Context, workspaceID, id uuid.UUID) (*InvoiceResponse, error) {
	existing, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) { return nil, apperr.NewNotFound("Invoice", id.String()) }
		return nil, apperr.NewInternal(err, "failed to get invoice")
	}

	if existing.Status == "PAID" {
		return mapToResponse(existing), nil // Idempotent
	}
	if existing.Status == "CANCELLED" {
		return nil, apperr.NewValidation(map[string]string{"status": "Cannot pay a CANCELLED invoice"})
	}

	now := time.Now()
	updates := map[string]interface{}{
		"status":  "PAID",
		"paid_at": now,
	}

	i, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to mark invoice as paid")
	}

	// Emit Event
	event := &events.InvoicePaidEvent{
		WorkspaceID: i.WorkspaceID,
		InvoiceID:   i.ID,
		ContractID:  i.ContractID,
	}
	s.eventBus.Publish(event)

	return mapToResponse(i), nil
}

func (s *service) Cancel(ctx context.Context, workspaceID, id uuid.UUID, req CancelInvoiceRequest) (*InvoiceResponse, error) {
	existing, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) { return nil, apperr.NewNotFound("Invoice", id.String()) }
		return nil, apperr.NewInternal(err, "failed to get invoice")
	}

	if existing.Status == "PAID" {
		return nil, apperr.NewValidation(map[string]string{"status": "Cannot cancel an already PAID invoice"})
	}

	updates := map[string]interface{}{
		"status":              "CANCELLED",
		"cancellation_reason": req.CancellationReason,
	}

	i, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to cancel invoice")
	}

	return mapToResponse(i), nil
}
