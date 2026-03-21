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

	// Lifecycle
	Publish(ctx context.Context, workspaceID, id uuid.UUID) (*PropertyResponse, error)

	// Images
	AddImage(ctx context.Context, workspaceID, propertyID uuid.UUID, url string, isPrimary bool, displayOrder int) (*PropertyImageResponse, error)
	DeleteImage(ctx context.Context, workspaceID, propertyID, imageID uuid.UUID) error
	SetPrimaryImage(ctx context.Context, workspaceID, propertyID, imageID uuid.UUID) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, workspaceID uuid.UUID, req CreatePropertyRequest) (*PropertyResponse, error) {
	p := &Property{
		WorkspaceID: workspaceID,
		Name:        req.Name,
		Address:     req.Address,
		City:        req.City,
		Type:        req.Type,
		Amenities:   req.Amenities,
		Status:      PropertyStatusDraft, // Always draft on creation
		Description: req.Description,
	}

	err := s.repo.Create(ctx, workspaceID, p)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to create property")
	}

	return mapToResponse(p, nil), nil
}

func (s *service) Get(ctx context.Context, workspaceID, id uuid.UUID) (*PropertyResponse, error) {
	p, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Property", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get property")
	}

	images, err := s.repo.GetImages(ctx, id)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to get property images")
	}

	return mapToResponse(p, images), nil
}

func (s *service) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params) ([]*PropertyResponse, int64, error) {
	properties, total, err := s.repo.List(ctx, workspaceID, params)
	if err != nil {
		return nil, 0, apperr.NewInternal(err, "failed to list properties")
	}

	responses := make([]*PropertyResponse, len(properties))
	for i, p := range properties {
		// Optimization: For listing, we might not always want all images, 
		// but let's fetch them for now or just primary ones if needed.
		images, _ := s.repo.GetImages(ctx, p.ID)
		responses[i] = mapToResponse(p, images)
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
	if req.City != nil {
		updates["city"] = *req.City
	}
	if req.Type != nil {
		updates["type"] = *req.Type
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}
	if req.Amenities != nil {
		updates["amenities"] = req.Amenities
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

	images, _ := s.repo.GetImages(ctx, id)
	return mapToResponse(p, images), nil
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

// --- Lifecycle ---

func (s *service) Publish(ctx context.Context, workspaceID, id uuid.UUID) (*PropertyResponse, error) {
	// 1. Ownership check
	_, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Property", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get property")
	}

	// 2. Validate Image requirement
	images, err := s.repo.GetImages(ctx, id)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to check images")
	}
	if len(images) == 0 {
		return nil, apperr.NewValidation(map[string]string{"images": "Property must have at least one image to be published"})
	}

	// 3. Validate Room requirement
	roomCount, err := s.repo.CountRooms(ctx, id)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to check rooms")
	}
	if roomCount == 0 {
		return nil, apperr.NewValidation(map[string]string{"rooms": "Property must have at least one room to be published"})
	}

	// 4. Perform update to published
	updated, err := s.repo.Update(ctx, workspaceID, id, map[string]interface{}{
		"status": PropertyStatusPublished,
	})
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to publish property")
	}

	return mapToResponse(updated, images), nil
}

// --- Images ---

func (s *service) AddImage(ctx context.Context, workspaceID, propertyID uuid.UUID, url string, isPrimary bool, displayOrder int) (*PropertyImageResponse, error) {
	// Ownership check
	_, err := s.repo.GetByID(ctx, workspaceID, propertyID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Property", propertyID.String())
		}
		return nil, err
	}

	img := &PropertyImage{
		PropertyID:   propertyID,
		URL:          url,
		IsPrimary:    isPrimary,
		DisplayOrder: displayOrder,
	}

	if isPrimary {
		// If adding as primary, we'll need to reset others if we want it to be atomic,
		// but repo.SetPrimaryImage is usually called separately or we handle it here.
		// For simplicity, if isPrimary is true, we call SetPrimaryImage later or handle it in repo.
		// Let's use repo.AddImage then potentially SetPrimaryImage.
	}

	err = s.repo.AddImage(ctx, img)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to add image")
	}

	if isPrimary {
		err = s.repo.SetPrimaryImage(ctx, propertyID, img.ID)
		if err != nil {
			return nil, err
		}
		img.IsPrimary = true
	}

	return &PropertyImageResponse{
		ID:           img.ID,
		URL:          img.URL,
		IsPrimary:    img.IsPrimary,
		DisplayOrder: img.DisplayOrder,
	}, nil
}

func (s *service) DeleteImage(ctx context.Context, workspaceID, propertyID, imageID uuid.UUID) error {
	// Ownership check
	_, err := s.repo.GetByID(ctx, workspaceID, propertyID)
	if err != nil {
		return err
	}

	return s.repo.DeleteImage(ctx, propertyID, imageID)
}

func (s *service) SetPrimaryImage(ctx context.Context, workspaceID, propertyID, imageID uuid.UUID) error {
	// Ownership check
	_, err := s.repo.GetByID(ctx, workspaceID, propertyID)
	if err != nil {
		return err
	}

	return s.repo.SetPrimaryImage(ctx, propertyID, imageID)
}
