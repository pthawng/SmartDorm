package workspace

import (
	"context"

	"github.com/google/uuid"
	apperr "smartdorm/shared/errors"
)

type Service interface {
	CreateWorkspace(ctx context.Context, req CreateWorkspaceRequest, userID uuid.UUID) (*WorkspaceResponse, error)
	GetWorkspaces(ctx context.Context, userID uuid.UUID) ([]*WorkspaceResponse, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateWorkspace(ctx context.Context, req CreateWorkspaceRequest, userID uuid.UUID) (*WorkspaceResponse, error) {
	// Rule: Automatically assign ownership. Transaction guarantees this.
	w, role, err := s.repo.CreateWorkspaceTx(ctx, req.Name, userID)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to create workspace")
	}

	return &WorkspaceResponse{
		ID:             w.ID,
		Name:           w.Name,
		CreatedBy:      w.CreatedBy,
		MembershipRole: role,
	}, nil
}

func (s *service) GetWorkspaces(ctx context.Context, userID uuid.UUID) ([]*WorkspaceResponse, error) {
	workspaces, err := s.repo.ListUserWorkspaces(ctx, userID)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to fetch workspaces")
	}

	// Make sure we never return nil arrays for JSON serializers (avoid `null` outputs)
	if workspaces == nil {
		workspaces = make([]*WorkspaceResponse, 0)
	}

	return workspaces, nil
}

func (s *service) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	return s.repo.UpdateStatus(ctx, id, status)
}
