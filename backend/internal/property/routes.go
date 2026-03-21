package property

import (
	"github.com/gin-gonic/gin"

	"smartdorm/shared/jwt"
	"smartdorm/shared/middleware"
)

// RegisterRoutes registers all property endpoints onto the provided router group
func RegisterRoutes(router *gin.RouterGroup, handler *Handler, jwtIssuer *jwt.Issuer) {
	// Property endpoints require a Landlord context (WorkspaceID)
	// Apply both RequireAuth and RequireWorkspace (enforcing LANDLORD role and injecting WorkspaceID)
	propGroup := router.Group("/properties", middleware.RequireAuth(jwtIssuer), middleware.RequireWorkspace())
	{
		propGroup.POST("", handler.Create)
		propGroup.GET("", handler.List)
		propGroup.GET("/:id", handler.Get)
		propGroup.PATCH("/:id", handler.Update)
		propGroup.DELETE("/:id", handler.Delete)

		// Lifecycle
		propGroup.POST("/:id/publish", handler.Publish)

		// Images
		propGroup.POST("/:id/images", handler.AddImage)
		propGroup.DELETE("/:id/images/:imageId", handler.DeleteImage)
		propGroup.PATCH("/:id/images/:imageId/primary", handler.SetPrimaryImage)
	}
}
