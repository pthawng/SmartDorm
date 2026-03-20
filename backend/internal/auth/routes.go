package auth

import (
	"github.com/gin-gonic/gin"

	"smartdorm/shared/jwt"
	"smartdorm/shared/middleware"
)

// RegisterRoutes registers all auth endpoints onto the provided router group
func RegisterRoutes(router *gin.RouterGroup, handler *Handler, jwtIssuer *jwt.Issuer) {
	authGroup := router.Group("/auth")
	{
		// Public endpoints
		authGroup.POST("/register", handler.Register)
		authGroup.POST("/login", handler.Login)

		// Switch security context (explicitly choosing a role/workspace)
		authGroup.POST("/switch-context", middleware.RequireAuth(jwtIssuer), handler.SwitchContext)
		authGroup.POST("/refresh", handler.Refresh) // Added for Phase 0 (Compatibility)
		authGroup.POST("/logout", handler.Logout)
		authGroup.GET("/me", middleware.RequireAuth(jwtIssuer), handler.GetMe)
	}
}
