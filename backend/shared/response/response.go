package response

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	apperrors "smartdorm/shared/errors"
)

// Success Envelope
type SuccessResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
}

// Error Envelope
type ErrorResponse struct {
	Success bool         `json:"success"`
	Error   ErrorPayload `json:"error"`
}

type ErrorPayload struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Reason  string            `json:"reason,omitempty"`
	Details map[string]string `json:"details,omitempty"`
}

// OK sends a standard success response
func OK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, SuccessResponse{
		Success: true,
		Data:    data,
	})
}

// Created sends a standard 201 Created response
func Created(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, SuccessResponse{
		Success: true,
		Data:    data,
	})
}

// NoContent sends a 204 No Content response
func NoContent(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

// PaginatedList sends a standardized paginated response
func PaginatedList(c *gin.Context, data interface{}, page, pageSize int, total int64) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
		"pagination": gin.H{
			"page":      page,
			"pageSize":  pageSize,
			"total":     total,
			"pageCount": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// Error handles sending standardized error responses mapped from internal app errors
func Error(c *gin.Context, err error) {
	var appErr *apperrors.AppError
	if errors.As(err, &appErr) {
		status := mapErrorCodeToHTTPStatus(appErr.Code)
		c.JSON(status, ErrorResponse{
			Success: false,
			Error: ErrorPayload{
				Code:    string(appErr.Code),
				Message: appErr.Message,
				Reason:  appErr.Reason,
				Details: appErr.Details,
			},
		})
		return
	}

	// Unhandled internal error
	c.JSON(http.StatusInternalServerError, ErrorResponse{
		Success: false,
		Error: ErrorPayload{
			Code:    string(apperrors.CodeInternal),
			Message: "Internal server error",
		},
	})
}

// Map domain error code to HTTP status
func mapErrorCodeToHTTPStatus(code apperrors.ErrorCode) int {
	switch code {
	case apperrors.CodeValidation:
		return http.StatusBadRequest
	case apperrors.CodeNotFound:
		return http.StatusNotFound
	case apperrors.CodeUnauthorized:
		return http.StatusUnauthorized
	case apperrors.CodeForbidden:
		return http.StatusForbidden
	case apperrors.CodeConflict:
		return http.StatusConflict
	default:
		return http.StatusInternalServerError
	}
}
