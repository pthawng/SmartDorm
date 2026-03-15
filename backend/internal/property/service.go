package property

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"

	apperr "smartdorm/shared/errors"
	"smartdorm/shared/pagination"
)

type Service interface {
	Create(ctx context.Context, workspaceID uuid.UUID, req CreatePropertyRequest) (*PropertyResponse, error)
	Get(ctx context.Context, workspaceID, id uuid.UUID) (*PropertyResponse, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params) ([]*PropertyResponse, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdatePropertyRequest) (*PropertyResponse, error)
	Delete(ctx context.Context, workspaceID, id uuid.UUID) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, workspaceID uuid.UUID, req CreatePropertyRequest) (*PropertyResponse, error) {
	p := &Property{
		Name:        req.Name,
		Address:     req.Address,
		Description: req.Description,
	}

	err := s.repo.Create(ctx, workspaceID, p)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to create property")
	}

	p.WorkspaceID = workspaceID // Set from context
	return mapToResponse(p), nil
}

func (s *service) Get(ctx context.Context, workspaceID, id uuid.UUID) (*PropertyResponse, error) {
	p, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Property", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get property")
	}

	return mapToResponse(p), nil
}

func (s *service) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params) ([]*PropertyResponse, int64, error) {
	properties, total, err := s.repo.List(ctx, workspaceID, params)
	if err != nil {
		return nil, 0, apperr.NewInternal(err, "failed to list properties")
	}

	responses := make([]*PropertyResponse, len(properties))
	for i, p := range properties {
		responses[i] = mapToResponse(p)
	}

	return responses, total, nil
}

func (s *service) Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdatePropertyRequest) (*PropertyResponse, error) {
	updates := make(map[string]interface{})

	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.Address != nil {
		updates["address"] = *req.Address
	}
	if req.Description != nil {
		updates["description"] = *req.Description // Can be nil to clear it
	}

	if len(updates) == 0 {
		return s.Get(ctx, workspaceID, id) // No-op update
	}

	p, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Property", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to update property")
	}

	return mapToResponse(p), nil
}

func (s *service) Delete(ctx context.Context, workspaceID, id uuid.UUID) error {
	err := s.repo.Delete(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return apperr.NewNotFound("Property", id.String())
		}
		return apperr.NewInternal(err, "failed to delete property")
	}

	return nil
}
