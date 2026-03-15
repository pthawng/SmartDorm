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

		// Protected endpoints (require transient/identity token logic)
		// Assuming for MVP: the client can use an existing short-lived token to switch contexts,
		// OR login returns a base token that is used here to get a context token.
		authGroup.POST("/token", middleware.RequireAuth(jwtIssuer), handler.Token)
		authGroup.GET("/me", middleware.RequireAuth(jwtIssuer), handler.GetMe)
	}
}
