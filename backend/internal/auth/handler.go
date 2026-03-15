package auth

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

func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, err) // gin binding errors aren't directly app errors, but handler can wrap them or rely on robust binding parsing later. For MVP, wrap in validation logic.
		return
	}

	resp, err := h.service.Register(c.Request.Context(), req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Created(c, resp)
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, err)
		return
	}

	resp, err := h.service.Login(c.Request.Context(), req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, resp)
}

func (h *Handler) Token(c *gin.Context) {
	var req TokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, err)
		return
	}

	// Must extract user ID from the transient login context or a short-lived token.
	// In the architecture specified, the Token endpoint is protected. 
	// This implies the client must maintain standard auth context (like getting UserID).
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	resp, err := h.service.MintToken(c.Request.Context(), req, userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, resp)
}

func (h *Handler) GetMe(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	resp, err := h.service.GetUser(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, resp)
}
