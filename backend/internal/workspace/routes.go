package workspace

import (
	"github.com/gin-gonic/gin"

	"smartdorm/shared/jwt"
	"smartdorm/shared/middleware"
)

// RegisterRoutes registers all workspace endpoints onto the provided router group
func RegisterRoutes(router *gin.RouterGroup, handler *Handler, jwtIssuer *jwt.Issuer) {
	// These endpoints only require base identity auth (knowing who the User is),
	// they do not require contextual Tenant/Landlord tokens yet, because they are used 
	// to discover or create those contexts.
	wsGroup := router.Group("/workspaces", middleware.RequireAuth(jwtIssuer))
	{
		wsGroup.POST("", handler.Create)
		wsGroup.GET("", handler.List)
		wsGroup.PATCH("/:id/status", handler.UpdateStatus)
		wsGroup.GET("/:id/dashboard", handler.GetDashboard)
	}
}
