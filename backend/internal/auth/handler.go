package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"smartdorm/shared/response"
	"smartdorm/shared/middleware"
	"smartdorm/shared/errors"
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

	if resp.RefreshToken != "" {
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("refreshToken", resp.RefreshToken, 3600*24*7, "/api/v1/auth/refresh", "", false, true)
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

	if resp.RefreshToken != "" {
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("refreshToken", resp.RefreshToken, 3600*24*7, "/api/v1/auth/refresh", "", false, true)
	}

	response.OK(c, resp)
}

func (h *Handler) SwitchContext(c *gin.Context) {
	var req TokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, err)
		return
	}

	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	resp, err := h.service.SwitchContext(c.Request.Context(), req, userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	if resp.RefreshToken != "" {
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("refreshToken", resp.RefreshToken, 3600*24*7, "/api/v1/auth/refresh", "", false, true)
	}

	response.OK(c, resp)
}

func (h *Handler) Refresh(c *gin.Context) {
	// 1. Read RT from cookie
	cookie, err := c.Cookie("refreshToken")
	if err != nil {
		response.Error(c, errors.NewUnauthorized("No refresh token provided"))
		return
	}

	// 2. Call service to rotate
	resp, err := h.service.Refresh(c.Request.Context(), cookie)
	if err != nil {
		response.Error(c, err)
		return
	}

	// 3. Set NEW cookie
	if resp.RefreshToken != "" {
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("refreshToken", resp.RefreshToken, 3600*24*7, "/api/v1/auth/refresh", "", false, true)
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

func (h *Handler) Logout(c *gin.Context) {
	cookie, err := c.Cookie("refreshToken")
	if err == nil {
		// Attempt to delete from DB if cookie exists
		_ = h.service.Logout(c.Request.Context(), cookie)
	}

	// Always clear the cookie
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("refreshToken", "", -1, "/api/v1/auth/refresh", "", false, true)

	response.OK(c, nil)
}
