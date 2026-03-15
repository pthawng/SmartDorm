package contract

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
	Create(ctx context.Context, workspaceID uuid.UUID, req CreateContractRequest) (*ContractResponse, error)
	Get(ctx context.Context, workspaceID, id uuid.UUID) (*ContractResponse, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, roomID, renterID *uuid.UUID, status *string) ([]*ContractResponse, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdateContractRequest) (*ContractResponse, error)
	Delete(ctx context.Context, workspaceID, id uuid.UUID) error
	
	Activate(ctx context.Context, workspaceID, id uuid.UUID) (*ContractResponse, error)
	Terminate(ctx context.Context, workspaceID, id uuid.UUID, req TerminateContractRequest) (*ContractResponse, error)
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

func (s *service) Create(ctx context.Context, workspaceID uuid.UUID, req CreateContractRequest) (*ContractResponse, error) {
	startDate, err := parseDate(req.StartDate)
	if err != nil {
		return nil, err
	}
	endDate, err := parseDate(req.EndDate)
	if err != nil {
		return nil, err
	}

	if !startDate.Before(endDate) {
		return nil, apperr.NewValidation(map[string]string{"end_date": "Must be after start_date"})
	}

	c := &Contract{
		RoomID:        req.RoomID,
		RenterID:      req.RenterID,
		StartDate:     startDate,
		EndDate:       endDate,
		MonthlyRent:   req.MonthlyRent,
		DepositAmount: req.DepositAmount,
		TermsNotes:    req.TermsNotes,
		Status:        "DRAFT", // Enforced here conceptually, though repo sets it implicitly if not mapped
	}

	if err := s.repo.Create(ctx, workspaceID, c); err != nil {
		// MVP: Unique index uq_contracts_room_active ensures no two ACTIVE contracts exist for a room
		// But during Create, it's DRAFT. Business rule might prevent creating if ACTIVE exists, but schema allows multiple DRAFTs.
		return nil, apperr.NewInternal(err, "failed to create contract")
	}

	c.WorkspaceID = workspaceID
	return mapToResponse(c), nil
}

func (s *service) Get(ctx context.Context, workspaceID, id uuid.UUID) (*ContractResponse, error) {
	c, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Contract", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get contract")
	}

	return mapToResponse(c), nil
}

func (s *service) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, roomID, renterID *uuid.UUID, status *string) ([]*ContractResponse, int64, error) {
	contracts, total, err := s.repo.List(ctx, workspaceID, params, roomID, renterID, status)
	if err != nil {
		return nil, 0, apperr.NewInternal(err, "failed to list contracts")
	}

	responses := make([]*ContractResponse, len(contracts))
	for i, c := range contracts {
		responses[i] = mapToResponse(c)
	}

	return responses, total, nil
}

func (s *service) Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdateContractRequest) (*ContractResponse, error) {
	// First check status: Only DRAFT contracts can have their core terms updated
	existing, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Contract", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get contract")
	}

	if existing.Status != "DRAFT" {
		return nil, apperr.NewValidation(map[string]string{"status": "Only DRAFT contracts can be updated"})
	}

	updates := make(map[string]interface{})

	if req.StartDate != nil {
		sd, err := parseDate(*req.StartDate)
		if err != nil {
			return nil, err
		}
		updates["start_date"] = sd
	}
	if req.EndDate != nil {
		ed, err := parseDate(*req.EndDate)
		if err != nil {
			return nil, err
		}
		updates["end_date"] = ed
	}
	if req.MonthlyRent != nil {
		updates["monthly_rent"] = *req.MonthlyRent
	}
	if req.DepositAmount != nil {
		updates["deposit_amount"] = *req.DepositAmount
	}
	if req.TermsNotes != nil {
		updates["terms_notes"] = *req.TermsNotes
	}

	if len(updates) == 0 {
		return mapToResponse(existing), nil
	}

	c, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to update contract")
	}

	return mapToResponse(c), nil
}

func (s *service) Activate(ctx context.Context, workspaceID, id uuid.UUID) (*ContractResponse, error) {
	existing, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Contract", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get contract")
	}

	// Business Logic: Only DRAFT transitions to ACTIVE
	if existing.Status != "DRAFT" {
		return nil, apperr.NewValidation(map[string]string{"status": "Only DRAFT contracts can be activated"})
	}

	now := time.Now()
	updates := map[string]interface{}{
		"status":       "ACTIVE",
		"activated_at": now,
	}

	c, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		// If uq_contracts_room_active is violated, return explicit conflict error
		return nil, apperr.NewInternal(err, "failed to activate contract (check if room already has active contract)")
	}

	// Emit Domain Event via Out-of-band/Async Bus
	event := &events.ContractActivatedEvent{
		WorkspaceID: c.WorkspaceID,
		ContractID:  c.ID,
		RoomID:      c.RoomID,
		RenterID:    c.RenterID,
	}
	s.eventBus.Publish(event)

	return mapToResponse(c), nil
}

func (s *service) Terminate(ctx context.Context, workspaceID, id uuid.UUID, req TerminateContractRequest) (*ContractResponse, error) {
	existing, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Contract", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get contract")
	}

	if existing.Status != "ACTIVE" {
		return nil, apperr.NewValidation(map[string]string{"status": "Only ACTIVE contracts can be terminated"})
	}

	termDate, err := parseDate(req.TerminationDate)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	updates := map[string]interface{}{
		"status":             "TERMINATED",
		"terminated_at":      now,
		"termination_date":   termDate,
		"termination_reason": req.TerminationReason,
	}

	c, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to terminate contract")
	}

	// Emit Domain Event
	event := &events.ContractTerminatedEvent{
		WorkspaceID: c.WorkspaceID,
		ContractID:  c.ID,
		RoomID:      c.RoomID,
		RenterID:    c.RenterID,
	}
	s.eventBus.Publish(event)

	return mapToResponse(c), nil
}

func (s *service) Delete(ctx context.Context, workspaceID, id uuid.UUID) error {
	err := s.repo.Delete(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, apperr.NewNotFound("Contract", "")) {
			return apperr.NewValidation(map[string]string{"status": "Contract not found or cannot be deleted (must be DRAFT)"})
		}
		return apperr.NewInternal(err, "failed to delete contract")
	}

	return nil
}
