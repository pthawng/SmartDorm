package renter

import (
	"github.com/gin-gonic/gin"

	"smartdorm/shared/jwt"
	"smartdorm/shared/middleware"
)

// RegisterRoutes registers all renter endpoints onto the provided router group
func RegisterRoutes(router *gin.RouterGroup, handler *Handler, jwtIssuer *jwt.Issuer) {
	// Renter management is a Landlord concern, so we require the workspace context
	renterGroup := router.Group("/renters", middleware.RequireAuth(jwtIssuer), middleware.RequireWorkspace())
	{
		renterGroup.POST("", handler.Create)
		renterGroup.GET("", handler.List)
		renterGroup.GET("/:id", handler.Get)
		renterGroup.PATCH("/:id", handler.Update)
		renterGroup.DELETE("/:id", handler.Delete)
		
		// Linking an external user to the created renter profile
		renterGroup.POST("/:id/link", handler.LinkUser)
	}
}
