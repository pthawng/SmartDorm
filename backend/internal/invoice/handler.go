package invoice

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
	var req CreateInvoiceRequest
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

	var conIDPtr, renterIDPtr *uuid.UUID
	
	if idStr := c.Query("contract_id"); idStr != "" {
		if id, err := uuid.Parse(idStr); err == nil {
			conIDPtr = &id
		}
	}
	if idStr := c.Query("renter_id"); idStr != "" {
		if id, err := uuid.Parse(idStr); err == nil {
			renterIDPtr = &id
		}
	}

	var statusPtr *string
	if status := c.Query("status"); status != "" {
		statusPtr = &status
	}

	invoices, total, err := h.service.List(c.Request.Context(), workspaceID, params, conIDPtr, renterIDPtr, statusPtr)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.PaginatedList(c, invoices, params.Page, params.PageSize, total)
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

	var req UpdateInvoiceRequest
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

func (h *Handler) MarkPaid(c *gin.Context) {
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

	resp, err := h.service.MarkPaid(c.Request.Context(), workspaceID, id)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, resp)
}

func (h *Handler) Cancel(c *gin.Context) {
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

	var req CancelInvoiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, err)
		return
	}

	resp, err := h.service.Cancel(c.Request.Context(), workspaceID, id, req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, resp)
}
