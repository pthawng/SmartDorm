package room

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"

	"github.com/google/uuid"

	"smartdorm/shared/events"
	apperr "smartdorm/shared/errors"
	"smartdorm/shared/pagination"
)

type Service interface {
	Create(ctx context.Context, workspaceID uuid.UUID, req CreateRoomRequest) (*RoomResponse, error)
	Get(ctx context.Context, workspaceID, id uuid.UUID) (*RoomResponse, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, propertyID *uuid.UUID, status *string) ([]*RoomResponse, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdateRoomRequest) (*RoomResponse, error)
	Delete(ctx context.Context, workspaceID, id uuid.UUID) error

	// Event Handlers (as consumers)
	HandleContractActivated(ctx context.Context, event events.ContractActivatedEvent) error
	HandleContractTerminated(ctx context.Context, event events.ContractTerminatedEvent) error
	HandleContractExpired(ctx context.Context, event events.ContractExpiredEvent) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository, eventBus events.Bus) Service {
	s := &service{repo: repo}

	// Register event consumers
	// Rules: "Event handlers should be idempotent where possible" - Update is idempotent here.
	eventBus.Subscribe(events.ContractActivated, func(event events.Event) error {
		e := event.(*events.ContractActivatedEvent)
		return s.UpdateStatus(context.Background(), e.WorkspaceID, e.RoomID, "OCCUPIED")
	})

	eventBus.Subscribe(events.ContractTerminated, func(event events.Event) error {
		e := event.(*events.ContractTerminatedEvent)
		return s.UpdateStatus(context.Background(), e.WorkspaceID, e.RoomID, "AVAILABLE")
	})

	eventBus.Subscribe(events.ContractExpired, func(event events.Event) error {
		e := event.(*events.ContractExpiredEvent)
		return s.UpdateStatus(context.Background(), e.WorkspaceID, e.RoomID, "AVAILABLE")
	})

	return s
}

func (s *service) Create(ctx context.Context, workspaceID uuid.UUID, req CreateRoomRequest) (*RoomResponse, error) {
	r := &Room{
		PropertyID: req.PropertyID,
		Name:       req.Name,
		Floor:      req.Floor,
		Status:     req.Status,
		RentAmount: req.RentAmount,
	}

	err := s.repo.Create(ctx, workspaceID, r)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to create room")
	}

	r.WorkspaceID = workspaceID
	return mapToResponse(r), nil
}

func (s *service) UpdateStatus(ctx context.Context, workspaceID, roomID uuid.UUID, status string) error {
	// A simpler internal method to just flip the status
	updates := map[string]interface{}{
		"status": status,
	}
	_, err := s.repo.Update(ctx, workspaceID, roomID, updates)
	if err != nil && !errors.Is(err, sql.ErrNoRows) { // Ignore ErrNoRows, could be soft-deleted edge case or eventual consistency race.
		slog.ErrorContext(ctx, "Failed to update room status", "error", err, "room_id", roomID, "new_status", status)
		return err
	}
	slog.InfoContext(ctx, "Room status updated via internal method", "room_id", roomID, "new_status", status)
	return nil
}

func (s *service) Get(ctx context.Context, workspaceID, id uuid.UUID) (*RoomResponse, error) {
	r, err := s.repo.GetByID(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Room", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to get room")
	}

	return mapToResponse(r), nil
}

func (s *service) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params, propertyID *uuid.UUID, status *string) ([]*RoomResponse, int64, error) {
	rooms, total, err := s.repo.List(ctx, workspaceID, params, propertyID, status)
	if err != nil {
		return nil, 0, apperr.NewInternal(err, "failed to list rooms")
	}

	responses := make([]*RoomResponse, len(rooms))
	for i, r := range rooms {
		responses[i] = mapToResponse(r)
	}

	return responses, total, nil
}

func (s *service) Update(ctx context.Context, workspaceID, id uuid.UUID, req UpdateRoomRequest) (*RoomResponse, error) {
	updates := make(map[string]interface{})

	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.Floor != nil {
		updates["floor"] = *req.Floor
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}
	if req.RentAmount != nil {
		updates["rent_amount"] = *req.RentAmount
	}

	if len(updates) == 0 {
		return s.Get(ctx, workspaceID, id) 
	}

	r, err := s.repo.Update(ctx, workspaceID, id, updates)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("Room", id.String())
		}
		return nil, apperr.NewInternal(err, "failed to update room")
	}

	return mapToResponse(r), nil
}

func (s *service) Delete(ctx context.Context, workspaceID, id uuid.UUID) error {
	err := s.repo.Delete(ctx, workspaceID, id)
	if err != nil {
		if errors.Is(err, apperr.NewNotFound("Room", "")) {
			return apperr.NewNotFound("Room", id.String())
		}
		return apperr.NewInternal(err, "failed to delete room")
	}

	return nil
}

// --- Event Handlers Implementation ---

func (s *service) HandleContractActivated(ctx context.Context, event events.ContractActivatedEvent) error {
	updates := map[string]interface{}{
		"status": "OCCUPIED",
	}
	_, err := s.repo.Update(ctx, event.WorkspaceID, event.RoomID, updates)
	if err != nil && !errors.Is(err, sql.ErrNoRows) { // Ignore ErrNoRows, could be soft-deleted edge case or eventual consistency race.
		slog.ErrorContext(ctx, "Failed to update room to OCCUPIED on ContractActivatedEvent", "error", err, "room_id", event.RoomID)
		return err
	}
	slog.InfoContext(ctx, "Room status updated to OCCUPIED via Event", "room_id", event.RoomID)
	return nil
}

func (s *service) HandleContractTerminated(ctx context.Context, event events.ContractTerminatedEvent) error {
	updates := map[string]interface{}{
		"status": "AVAILABLE",
	}
	_, err := s.repo.Update(ctx, event.WorkspaceID, event.RoomID, updates)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		slog.ErrorContext(ctx, "Failed to update room to AVAILABLE on ContractTerminatedEvent", "error", err, "room_id", event.RoomID)
		return err
	}
	slog.InfoContext(ctx, "Room status updated to AVAILABLE via Event", "room_id", event.RoomID)
	return nil
}

func (s *service) HandleContractExpired(ctx context.Context, event events.ContractExpiredEvent) error {
	updates := map[string]interface{}{
		"status": "AVAILABLE",
	}
	_, err := s.repo.Update(ctx, event.WorkspaceID, event.RoomID, updates)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		slog.ErrorContext(ctx, "Failed to update room to AVAILABLE on ContractExpiredEvent", "error", err, "room_id", event.RoomID)
		return err
	}
	slog.InfoContext(ctx, "Room status updated to AVAILABLE via Event", "room_id", event.RoomID)
	return nil
}
