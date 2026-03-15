package invoice

import (
	"github.com/gin-gonic/gin"

	"smartdorm/shared/jwt"
	"smartdorm/shared/middleware"
)

// RegisterRoutes registers all invoice endpoints onto the provided router group
func RegisterRoutes(router *gin.RouterGroup, handler *Handler, jwtIssuer *jwt.Issuer) {
	group := router.Group("/invoices", middleware.RequireAuth(jwtIssuer), middleware.RequireWorkspace())
	{
		group.POST("", handler.Create)
		group.GET("", handler.List)
		group.GET("/:id", handler.Get)
		group.PATCH("/:id", handler.Update)

		// State transitions
		group.POST("/:id/pay", handler.MarkPaid)
		group.POST("/:id/cancel", handler.Cancel)
	}
}
