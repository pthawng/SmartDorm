package workspace

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"smartdorm/shared/response"
	"smartdorm/shared/middleware"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

type UpdateStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=pending active"`
}

func (h *Handler) Create(c *gin.Context) {
	var req CreateWorkspaceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Printf("[WorkspaceHandler] Bind error: %v\n", err)
		response.Error(c, err)
		return
	}

	userID, err := middleware.GetUserID(c)
	if err != nil {
		fmt.Printf("[WorkspaceHandler] UserID error: %v\n", err)
		response.Error(c, err)
		return
	}

	resp, err := h.service.CreateWorkspace(c.Request.Context(), req, userID)
	if err != nil {
		fmt.Printf("[WorkspaceHandler] Service error: %v\n", err)
		response.Error(c, err)
		return
	}

	response.Created(c, resp)
}

func (h *Handler) List(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	resp, err := h.service.GetWorkspaces(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	// This is not paginated per the API Spec (`GET /api/v1/workspaces`).
	// It just lists all workspaces the user is a member of.
	response.OK(c, resp)
}

func (h *Handler) UpdateStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(c, err)
		return
	}

	var req UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, err)
		return
	}

	if err := h.service.UpdateStatus(c.Request.Context(), id, req.Status); err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, gin.H{"message": "Workspace status updated successfully"})
}

func (h *Handler) GetDashboard(c *gin.Context) {
	workspaceID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, err)
		return
	}

	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	stats, err := h.service.GetDashboardStats(c.Request.Context(), workspaceID, userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, stats)
}
