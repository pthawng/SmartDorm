package events

// EventType is the discriminator for domain events
type EventType string

const (
	ContractCreated          EventType = "ContractCreated"
	ContractActivated        EventType = "ContractActivated"
	ContractTerminated       EventType = "ContractTerminated"
	ContractExpired          EventType = "ContractExpired"
	
	InvoiceGenerated         EventType = "InvoiceGenerated"
	InvoicePaid              EventType = "InvoicePaid"
	InvoiceOverdue           EventType = "InvoiceOverdue"
	
	MaintenanceRequested     EventType = "MaintenanceRequested"
	MaintenanceStatusChanged EventType = "MaintenanceStatusChanged"
)

// Event wrapped interface for the Bus
type Event interface {
	Type() EventType
}

// HandlerFunc processes an event. MUST be idempotent.
type HandlerFunc func(event Event) error

// Bus defines the event bus abstraction
type Bus interface {
	Publish(event Event)
	Subscribe(eventType EventType, handler HandlerFunc)
}
