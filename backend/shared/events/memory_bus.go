package events

import (
	"log/slog"
	"reflect"
	"time"
)

// MemoryBus implements an in-process, synchronous Event Bus (for MVP)
type MemoryBus struct {
	handlers map[EventType][]HandlerFunc
}

func NewMemoryBus() *MemoryBus {
	return &MemoryBus{
		handlers: make(map[EventType][]HandlerFunc),
	}
}

// Subscribe registers a handler for a specific event type
func (b *MemoryBus) Subscribe(eventType EventType, handler HandlerFunc) {
	b.handlers[eventType] = append(b.handlers[eventType], handler)
}

// Publish executes all registered handlers for the event synchronously
func (b *MemoryBus) Publish(event Event) {
	eventType := event.Type()
	handlers, ok := b.handlers[eventType]
	if !ok || len(handlers) == 0 {
		return // No subscribers
	}

	for _, handler := range handlers {
		b.invokeWithRetry(handler, event)
	}
}

// invokeWithRetry implements the MVP compensation strategy (max 3 retries, exponential backoff)
func (b *MemoryBus) invokeWithRetry(handler HandlerFunc, event Event) {
	const maxRetries = 3
	backoffs := []time.Duration{100 * time.Millisecond, 300 * time.Millisecond, 900 * time.Millisecond}

	var err error
	for i := 0; i <= maxRetries; i++ {
		err = handler(event)
		if err == nil {
			return // Success
		}

		if i < maxRetries {
			time.Sleep(backoffs[i])
		}
	}

	// If we exhausted retries, log the structured failure metric
	slog.Error("event_handler_failure",
		"event_type", event.Type(),
		"event_payload", reflect.TypeOf(event).String(),
		"error", err,
		"attempt_count", maxRetries+1,
	)
}
