package audit

import (
	"context"
	"log/slog"
	"time"

	"github.com/google/uuid"
)

// Action represents a trackable mutation
type Action string

const (
	ActionCreate Action = "CREATE"
	ActionUpdate Action = "UPDATE"
	ActionDelete Action = "DELETE"
	ActionSign   Action = "SIGN"
	ActionPay    Action = "PAY"
	ActionSwitch Action = "SWITCH_ROLE"
)

// Record represents a single audit log entry
type Record struct {
	UserID       uuid.UUID
	Action       Action
	ResourceType string
	ResourceID   string
	WorkspaceID  *uuid.UUID
	Timestamp    time.Time
}

// LogMutation records a security-sensitive change.
// For MVP, we use structured logging (slog). In production, this would go to a DB or Kafka.
func LogMutation(ctx context.Context, userID uuid.UUID, action Action, resourceType string, resourceID string, workspaceID *uuid.UUID) {
	slog.InfoContext(ctx, "Security Audit Log",
		"audit_version", "1.0",
		"ts", time.Now().UTC(),
		"user_id", userID,
		"action", action,
		"resource_type", resourceType,
		"resource_id", resourceID,
		"workspace_id", workspaceID,
	)
}
