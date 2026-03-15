package workspace

import (
	"github.com/gin-gonic/gin"

	"smartdorm/shared/response"
	"smartdorm/shared/middleware"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Create(c *gin.Context) {
	var req CreateWorkspaceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, err)
		return
	}

	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	resp, err := h.service.CreateWorkspace(c.Request.Context(), req, userID)
	if err != nil {
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
