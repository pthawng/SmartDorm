package maintenance

import (
	"github.com/gin-gonic/gin"

	"smartdorm/shared/jwt"
	"smartdorm/shared/middleware"
)

// RegisterRoutes registers all maintenance endpoints onto the provided router group
func RegisterRoutes(router *gin.RouterGroup, handler *Handler, jwtIssuer *jwt.Issuer) {
	group := router.Group("/maintenance-requests", middleware.RequireAuth(jwtIssuer), middleware.RequireWorkspace())
	{
		group.POST("", handler.Create)
		group.GET("", handler.List)
		group.GET("/:id", handler.Get)
		group.PATCH("/:id", handler.Update)

		// State transitions
		group.POST("/:id/resolve", handler.Resolve)
	}
}
