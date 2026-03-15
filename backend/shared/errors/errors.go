package errors

import "fmt"

// ErrorCode represents application-level error codes
type ErrorCode string

const (
	CodeValidation     ErrorCode = "VALIDATION_ERROR"
	CodeNotFound       ErrorCode = "NOT_FOUND"
	CodeUnauthorized   ErrorCode = "UNAUTHORIZED"
	CodeForbidden      ErrorCode = "FORBIDDEN"
	CodeConflict       ErrorCode = "CONFLICT"
	CodeInternal       ErrorCode = "INTERNAL_ERROR"
	CodeDomain         ErrorCode = "DOMAIN_ERROR"
)

// AppError represents a typed domain error
type AppError struct {
	Code    ErrorCode
	Message string
	Details map[string]string // Field-level details for validation errors
	Err     error             // Underlying error (for internal logging, not exposed)
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("[%s] %s: %v", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

// Unwrap allows errors.Is and errors.As to work with the underlying error
func (e *AppError) Unwrap() error {
	return e.Err
}

// Option is a functional option for AppError
type Option func(*AppError)

// WithDetails adds validation details to the error
func WithDetails(details map[string]string) Option {
	return func(e *AppError) {
		e.Details = details
	}
}

// WithErr wraps an underlying error
func WithErr(err error) Option {
	return func(e *AppError) {
		e.Err = err
	}
}

// New creates a new application error
func New(code ErrorCode, msg string, opts ...Option) *AppError {
	e := &AppError{
		Code:    code,
		Message: msg,
	}
	for _, opt := range opts {
		opt(e)
	}
	return e
}

// Helper functions for common errors

func NewNotFound(resource, id string) *AppError {
	return New(CodeNotFound, fmt.Sprintf("%s with ID %s not found", resource, id))
}

func NewUnauthorized(msg string) *AppError {
	return New(CodeUnauthorized, msg)
}

func NewForbidden(msg string) *AppError {
	return New(CodeForbidden, msg)
}

func NewValidation(details map[string]string) *AppError {
	return New(CodeValidation, "Validation failed", WithDetails(details))
}

func NewConflict(msg string) *AppError {
	return New(CodeConflict, msg)
}

func NewInternal(err error, msg string) *AppError {
	m := "Internal server error"
	if msg != "" {
		m = msg
	}
	return New(CodeInternal, m, WithErr(err))
}
