package renter

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
	Create(ctx context.Context, workspaceID uuid.UUID, req CreateRenterRequest) (*RenterResponse, error)
	Get(ctx context.Context, workspaceID, id uuid.UUID) (*RenterResponse, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, search string) ([]*RenterResponse, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdateRenterRequest) (*RenterResponse, error)
	Delete(ctx context.Context, workspaceID, id uuid.UUID) error
	LinkUser(ctx context.Context, workspaceID, id uuid.UUID, req LinkUserRequest) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func parseDate(d *string) (*time.Time, error) {
	if d == nil {
		return nil, nil
	}
	t, err := time.Parse("2006-01-02", *d)
	if err != nil {
		return nil, apperr.NewValidation(map[string]string{"date": "Invalid date format, expected YYYY-MM-DD"})
	}
	return &t, nil
}

func (s *service) Create(ctx context.Context, workspaceID uuid.UUID, req CreateRenterRequest) (*RenterResponse, error) {
	dob, err := parseDate(req.DateOfBirth)
	if err != nil {
		return nil, err
	}

	r := &Renter{
		FullName:              req.FullName,
		Phone:                 req.Phone,
		Email:                 req.Email,
		IDNumber:              req.IDNumber,
		DateOfBirth:           dob,
		EmergencyContactName:  req.EmergencyContactName,
		EmergencyContactPhone: req.EmergencyContactPhone,
	}

	if err := s.repo.Create(ctx, workspaceID, r); err != nil {
		return nil, apperr.NewInternal(err, "failed to create renter")
	}

	r.WorkspaceID = workspaceID
	return mapToResponse(r), nil
}

func (s *service) Get(ctx context.Context, workspaceID, id uuid.UUID) (*RenterResponse, error) {
	r, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Renter", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get renter")
	}

	return mapToResponse(r), nil
}

func (s *service) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, search string) ([]*RenterResponse, int64, error) {
	renters, total, err := s.repo.List(ctx, workspaceID, params, search)
	if err != nil {
		return nil, 0, apperr.NewInternal(err, "failed to list renters")
	}

	responses := make([]*RenterResponse, len(renters))
	for i, r := range renters {
		responses[i] = mapToResponse(r)
	}

	return responses, total, nil
}

func (s *service) Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdateRenterRequest) (*RenterResponse, error) {
	updates := make(map[string]interface{})

	if req.FullName != nil {
		updates["full_name"] = *req.FullName
	}
	if req.Phone != nil {
		updates["phone"] = *req.Phone
	}
	if req.Email != nil {
		updates["email"] = *req.Email
	}
	if req.IDNumber != nil {
		updates["id_number"] = *req.IDNumber
	}
	if req.DateOfBirth != nil {
		dob, err := parseDate(req.DateOfBirth)
		if err != nil {
			return nil, err
		}
		updates["date_of_birth"] = dob
	}
	if req.EmergencyContactName != nil {
		updates["emergency_contact_name"] = *req.EmergencyContactName
	}
	if req.EmergencyContactPhone != nil {
		updates["emergency_contact_phone"] = *req.EmergencyContactPhone
	}

	if len(updates) == 0 {
		return s.Get(ctx, workspaceID, id) // No-op
	}

	r, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Renter", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to update renter")
	}

	return mapToResponse(r), nil
}

func (s *service) Delete(ctx context.Context, workspaceID, id uuid.UUID) error {
	err := s.repo.Delete(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, apperr.NewNotFound("Renter", "")) {
			return apperr.NewNotFound("Renter", id.String())
		}
		return apperr.NewInternal(err, "failed to delete renter")
	}

	return nil
}

func (s *service) LinkUser(ctx context.Context, workspaceID, id uuid.UUID, req LinkUserRequest) error {
	// Look up the user by email
	userID, err := s.repo.GetUserByEmail(ctx, req.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return apperr.NewValidation(map[string]string{"email": "No active user found with this email"})
		}
		return apperr.NewInternal(err, "database error querying user by email")
	}

	// Link them
	err = s.repo.LinkUser(ctx, workspaceID, id, *userID)
	if err != nil {
		if errors.Is(err, apperr.NewNotFound("Renter", "")) {
			return apperr.NewNotFound("Renter", id.String())
		}
		return apperr.NewInternal(err, "failed to link user to renter")
	}

	return nil
}
