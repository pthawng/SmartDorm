package logger

import (
	"context"
	"log/slog"
	"os"

	"github.com/google/uuid"
)

// InitLogger configures the default structured JSON logger for the app
func InitLogger(env string) {
	var handler slog.Handler

	opts := &slog.HandlerOptions{
		Level: slog.LevelDebug,
	}

	if env == "production" {
		opts.Level = slog.LevelInfo
		handler = slog.NewJSONHandler(os.Stdout, opts)
	} else {
		// Pretty text output for development
		handler = slog.NewTextHandler(os.Stdout, opts)
	}

	logger := slog.New(handler)
	slog.SetDefault(logger)
}

type contextKey string

const TraceIDKey contextKey = "trace_id"

// WithTrace returns a context with a trace ID
func WithTrace(ctx context.Context) context.Context {
	return context.WithValue(ctx, TraceIDKey, uuid.New().String())
}

// GetTrace extracts the trace ID
func GetTrace(ctx context.Context) string {
	if traceID, ok := ctx.Value(TraceIDKey).(string); ok {
		return traceID
	}
	return ""
}
