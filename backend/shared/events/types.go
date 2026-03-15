package events

import (
	"time"

	"github.com/google/uuid"
)

// -- Contract Events ---

type ContractCreatedEvent struct {
	ContractID    uuid.UUID
	WorkspaceID   uuid.UUID
	RoomID        uuid.UUID
	RenterID      uuid.UUID
	StartDate     time.Time
	EndDate       time.Time
	MonthlyRent   int64
	DepositAmount int64
	CreatedAt     time.Time
}

func (e ContractCreatedEvent) Type() EventType { return ContractCreated }

type ContractActivatedEvent struct {
	ContractID  uuid.UUID
	WorkspaceID uuid.UUID
	RoomID      uuid.UUID
	RenterID    uuid.UUID
	StartDate   time.Time
	EndDate     time.Time
	ActivatedAt time.Time
}

func (e ContractActivatedEvent) Type() EventType { return ContractActivated }

type ContractTerminatedEvent struct {
	ContractID        uuid.UUID
	WorkspaceID       uuid.UUID
	RoomID            uuid.UUID
	RenterID          uuid.UUID
	TerminationReason string
	TerminatedAt      time.Time
}

func (e ContractTerminatedEvent) Type() EventType { return ContractTerminated }

type ContractExpiredEvent struct {
	ContractID  uuid.UUID
	WorkspaceID uuid.UUID
	RoomID      uuid.UUID
	RenterID    uuid.UUID
	ExpiredAt   time.Time
}

func (e ContractExpiredEvent) Type() EventType { return ContractExpired }

// --- Invoice Events ---

type InvoiceGeneratedEvent struct {
	InvoiceID          uuid.UUID
	WorkspaceID        uuid.UUID
	ContractID         uuid.UUID
	RenterID           uuid.UUID
	AmountDue          int64
	BillingPeriodStart time.Time
	BillingPeriodEnd   time.Time
	DueDate            time.Time
	CreatedAt          time.Time
}

func (e InvoiceGeneratedEvent) Type() EventType { return InvoiceGenerated }

type InvoicePaidEvent struct {
	InvoiceID   uuid.UUID
	WorkspaceID uuid.UUID
	ContractID  uuid.UUID
	RenterID    uuid.UUID
	AmountPaid  int64
	PaidAt      time.Time
}

func (e InvoicePaidEvent) Type() EventType { return InvoicePaid }

type InvoiceOverdueEvent struct {
	InvoiceID   uuid.UUID
	WorkspaceID uuid.UUID
	ContractID  uuid.UUID
	RenterID    uuid.UUID
	AmountDue   int64
	DueDate     time.Time
	OverdueAt   time.Time
}

func (e InvoiceOverdueEvent) Type() EventType { return InvoiceOverdue }

// --- Maintenance Events ---

type MaintenanceRequestedEvent struct {
	RequestID   uuid.UUID
	WorkspaceID uuid.UUID
	RoomID      uuid.UUID
	RenterID    *uuid.UUID // nullable
	SubmittedBy uuid.UUID
	Title       string
	Priority    string
	CreatedAt   time.Time
}

func (e MaintenanceRequestedEvent) Type() EventType { return MaintenanceRequested }

type MaintenanceStatusChangedEvent struct {
	RequestID   uuid.UUID
	WorkspaceID uuid.UUID
	RoomID      uuid.UUID
	OldStatus   string
	NewStatus   string
	ChangedAt   time.Time
}

func (e MaintenanceStatusChangedEvent) Type() EventType { return MaintenanceStatusChanged }
