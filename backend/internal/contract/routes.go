package contract

import (
	"github.com/gin-gonic/gin"

	"smartdorm/shared/jwt"
	"smartdorm/shared/middleware"
)

// RegisterRoutes registers all contract endpoints onto the provided router group
func RegisterRoutes(router *gin.RouterGroup, handler *Handler, jwtIssuer *jwt.Issuer) {
	group := router.Group("/contracts", middleware.RequireAuth(jwtIssuer), middleware.RequireWorkspace())
	{
		group.POST("", handler.Create)
		group.GET("", handler.List)
		group.GET("/:id", handler.Get)
		group.PATCH("/:id", handler.Update)
		group.DELETE("/:id", handler.Delete)

		// Lifecycle actions
		group.POST("/:id/activate", handler.Activate)
		group.POST("/:id/terminate", handler.Terminate)
	}
}
