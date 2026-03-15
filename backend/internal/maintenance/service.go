package maintenance

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"

	apperr "smartdorm/shared/errors"
	"smartdorm/shared/pagination"
)

type Service interface {
	Create(ctx context.Context, workspaceID, userID uuid.UUID, req CreateMaintenanceRequest) (*MaintenanceResponse, error)
	Get(ctx context.Context, workspaceID, id uuid.UUID) (*MaintenanceResponse, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, roomID, renterID *uuid.UUID, status, priority *string) ([]*MaintenanceResponse, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdateMaintenanceRequest) (*MaintenanceResponse, error)
	Resolve(ctx context.Context, workspaceID, id uuid.UUID, req ResolveMaintenanceRequest) (*MaintenanceResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, workspaceID, userID uuid.UUID, req CreateMaintenanceRequest) (*MaintenanceResponse, error) {
	m := &MaintenanceRequest{
		RoomID:            req.RoomID,
		RenterID:          req.RenterID,
		SubmittedByUserID: userID,
		Title:             req.Title,
		Description:       req.Description,
		Priority:          req.Priority,
	}

	if err := s.repo.Create(ctx, workspaceID, m); err != nil {
		return nil, apperr.NewInternal(err, "failed to create maintenance request")
	}

	m.WorkspaceID = workspaceID
	return mapToResponse(m), nil
}

func (s *service) Get(ctx context.Context, workspaceID, id uuid.UUID) (*MaintenanceResponse, error) {
	m, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("MaintenanceRequest", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get maintenance request")
	}

	return mapToResponse(m), nil
}

func (s *service) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, roomID, renterID *uuid.UUID, status, priority *string) ([]*MaintenanceResponse, int64, error) {
	requests, total, err := s.repo.List(ctx, workspaceID, params, roomID, renterID, status, priority)
	if err != nil {
		return nil, 0, apperr.NewInternal(err, "failed to list maintenance requests")
	}

	responses := make([]*MaintenanceResponse, len(requests))
	for i, req := range requests {
		responses[i] = mapToResponse(req)
	}

	return responses, total, nil
}

func (s *service) Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdateMaintenanceRequest) (*MaintenanceResponse, error) {
	existing, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) { return nil, apperr.NewNotFound("MaintenanceRequest", id.String()) }
		return nil, apperr.NewInternal(err, "failed to get maintenance request")
	}

	if existing.Status == "RESOLVED" || existing.Status == "CLOSED" {
		return nil, apperr.NewValidation(map[string]string{"status": "Cannot update a RESOLVED or CLOSED request"})
	}

	updates := make(map[string]interface{})

	if req.Title != nil { updates["title"] = *req.Title }
	if req.Description != nil { updates["description"] = *req.Description }
	if req.Priority != nil { updates["priority"] = *req.Priority }
	if req.Status != nil { 
		// If they manually set to RESOLVED via update, enforce resolve note
		if *req.Status == "RESOLVED" {
			return nil, apperr.NewValidation(map[string]string{"status": "Use the /resolve endpoint to resolve tickets"})
		}
		updates["status"] = *req.Status 
	}

	if len(updates) == 0 {
		return mapToResponse(existing), nil
	}

	m, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to update maintenance request")
	}

	return mapToResponse(m), nil
}

func (s *service) Resolve(ctx context.Context, workspaceID, id uuid.UUID, req ResolveMaintenanceRequest) (*MaintenanceResponse, error) {
	existing, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) { return nil, apperr.NewNotFound("MaintenanceRequest", id.String()) }
		return nil, apperr.NewInternal(err, "failed to get maintenance request")
	}

	if existing.Status == "RESOLVED" || existing.Status == "CLOSED" {
		return nil, apperr.NewValidation(map[string]string{"status": "Request is already resolved or closed"})
	}

	now := time.Now()
	updates := map[string]interface{}{
		"status":          "RESOLVED",
		"resolution_note": req.ResolutionNote,
		"resolved_at":     now,
	}

	m, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to resolve maintenance request")
	}

	return mapToResponse(m), nil
}
