package room

import (
	"github.com/gin-gonic/gin"

	"smartdorm/shared/jwt"
	"smartdorm/shared/middleware"
)

// RegisterRoutes registers all room endpoints onto the provided router group
func RegisterRoutes(router *gin.RouterGroup, handler *Handler, jwtIssuer *jwt.Issuer) {
	// Room endpoints require a Landlord context (WorkspaceID)
	roomGroup := router.Group("/rooms", middleware.RequireAuth(jwtIssuer), middleware.RequireWorkspace())
	{
		roomGroup.POST("", handler.Create)
		roomGroup.GET("", handler.List)
		roomGroup.GET("/:id", handler.Get)
		roomGroup.PATCH("/:id", handler.Update)
		roomGroup.DELETE("/:id", handler.Delete)
	}
}
