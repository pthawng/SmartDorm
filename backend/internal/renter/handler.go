package renter

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"smartdorm/shared/response"
	"smartdorm/shared/middleware"
	"smartdorm/shared/pagination"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Create(c *gin.Context) {
	var req CreateRenterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, err)
		return
	}

	workspaceID, err := middleware.GetWorkspaceID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	resp, err := h.service.Create(c.Request.Context(), workspaceID, req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Created(c, resp)
}

func (h *Handler) Get(c *gin.Context) {
	workspaceID, err := middleware.GetWorkspaceID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, err)
		return
	}

	resp, err := h.service.Get(c.Request.Context(), workspaceID, id)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, resp)
}

func (h *Handler) List(c *gin.Context) {
	workspaceID, err := middleware.GetWorkspaceID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	params, err := pagination.ParseParams(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	search := c.Query("search")

	renters, total, err := h.service.List(c.Request.Context(), workspaceID, params, search)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.PaginatedList(c, renters, params.Page, params.PageSize, total)
}

func (h *Handler) Update(c *gin.Context) {
	workspaceID, err := middleware.GetWorkspaceID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, err)
		return
	}

	var req UpdateRenterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, err)
		return
	}

	resp, err := h.service.Update(c.Request.Context(), workspaceID, id, req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, resp)
}

func (h *Handler) Delete(c *gin.Context) {
	workspaceID, err := middleware.GetWorkspaceID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, err)
		return
	}

	if err := h.service.Delete(c.Request.Context(), workspaceID, id); err != nil {
		response.Error(c, err)
		return
	}

	response.NoContent(c)
}

func (h *Handler) LinkUser(c *gin.Context) {
	workspaceID, err := middleware.GetWorkspaceID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, err)
		return
	}

	var req LinkUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, err)
		return
	}

	if err := h.service.LinkUser(c.Request.Context(), workspaceID, id, req); err != nil {
		response.Error(c, err)
		return
	}

	response.NoContent(c)
}
