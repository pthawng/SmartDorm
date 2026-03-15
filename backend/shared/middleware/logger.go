package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const HeaderTraceID = "X-Trace-ID"

// Logger logs each HTTP request using structured logging
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// Generate trace ID for the request
		traceID := uuid.New().String()
		c.Set("trace_id", traceID)
		
		// Optional: echo back the trace ID to client
		c.Header(HeaderTraceID, traceID)

		// Process request
		c.Next()

		// Log post-request
		latency := time.Since(start)
		status := c.Writer.Status()

		// Extract identity context if present (set by Auth middleware)
		userID, _ := c.Get(ContextUserID)
		workspaceID, _ := c.Get(ContextWorkspaceID)
		role, _ := c.Get(ContextRole)

		level := slog.LevelInfo
		if status >= 500 {
			level = slog.LevelError
		} else if status >= 400 {
			level = slog.LevelWarn
		}

		slog.Log(c.Request.Context(), level, "HTTP request handled",
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"status", status,
			"latency_ms", latency.Milliseconds(),
			"trace_id", traceID,
			"user_id", userID,
			"workspace_id", workspaceID,
			"role", role,
			"client_ip", c.ClientIP(),
			"errors", c.Errors.String(),
		)
	}
}
