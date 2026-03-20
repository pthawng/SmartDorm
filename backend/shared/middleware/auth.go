package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"smartdorm/shared/auth"
	"smartdorm/shared/errors"
	"smartdorm/shared/jwt"
	"smartdorm/shared/response"
)

// Constants for context keys
const (
	ContextUserID      = "user_id"
	ContextActiveRole  = "active_role"
	ContextWorkspaceID = "workspace_id"
)

// RequireAuth is the base middleware that parses the JWT
func RequireAuth(jwtIssuer *jwt.Issuer) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, errors.NewUnauthorized("Missing Authorization header"))
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Error(c, errors.NewUnauthorized("Invalid Authorization header format"))
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims, err := jwtIssuer.ValidateToken(tokenString)
		if err != nil {
			response.Error(c, errors.NewUnauthorized("Invalid or expired token"))
			c.Abort()
			return
		}

		// Inject identity context
		if claims.UserID != nil {
			c.Set(ContextUserID, *claims.UserID)
		}
		c.Set(ContextActiveRole, claims.ActiveRole)

		// Inject workspace context if present
		if claims.WorkspaceID != nil {
			c.Set(ContextWorkspaceID, *claims.WorkspaceID)
		}

		c.Next()
	}
}

// RequireRole enforces that the caller has a specific platform role
func RequireRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get(ContextActiveRole)
		if !exists {
			response.Error(c, errors.NewUnauthorized("Missing role context"))
			c.Abort()
			return
		}

		roleStr := role.(string)
		for _, r := range allowedRoles {
			if r == roleStr {
				c.Next()
				return
			}
		}

		response.Error(c, errors.NewForbidden("Insufficient role permissions"))
		c.Abort()
	}
}

// RequireWorkspaceContext ensures a Landlord has an active workspace selected
func RequireWorkspaceContext() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, _ := c.Get(ContextActiveRole)
		if role != jwt.RoleLandlord {
			response.Error(c, errors.NewForbidden("Requires Landlord role"))
			c.Abort()
			return
		}

		if _, exists := c.Get(ContextWorkspaceID); !exists {
			response.Error(c, errors.NewForbidden("No workspace selected"))
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireWorkspace is an alias for RequireWorkspaceContext for backward compatibility
func RequireWorkspace() gin.HandlerFunc {
	return RequireWorkspaceContext()
}

// RequireTenant ensures a user is in a Tenant context
func RequireTenant() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, _ := c.Get(ContextActiveRole)
		if role != jwt.RoleTenant {
			response.Error(c, errors.NewForbidden("Requires Tenant role"))
			c.Abort()
			return
		}
		c.Next()
	}
}

// RequirePermission enforces that the caller has a specific fine-grained permission
func RequirePermission(p auth.Permission) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get(ContextActiveRole)
		if !exists {
			response.Error(c, errors.NewUnauthorized("Missing role context"))
			c.Abort()
			return
		}

		if !auth.HasPermission(role.(string), p) {
			reason := "Missing permission: " + string(p)
			response.Error(c, errors.NewForbidden("Insufficient permissions", reason))
			c.Abort()
			return
		}

		c.Next()
	}
}

// ValidateContext ensures that the security context is internally consistent.
// Elite Logic: LANDLORD must have workspace, TENANT must NOT have workspace.
func ValidateContext() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get(ContextActiveRole)
		if !exists {
			c.Next()
			return
		}

		_, hasWorkspace := c.Get(ContextWorkspaceID)

		if role == jwt.RoleLandlord && !hasWorkspace {
			response.Error(c, errors.NewForbidden("Inconsistent context", "Landlord role requires an active workspaceId"))
			c.Abort()
			return
		}

		if role == jwt.RoleTenant && hasWorkspace {
			// Explicit rule: workspace_id == null -> TENANT
			response.Error(c, errors.NewForbidden("Inconsistent context", "Tenant role should not have a workspace context"))
			c.Abort()
			return
		}

		c.Next()
	}
}

// Helpers to extract UUID securely from context in Handlers

func GetWorkspaceID(c *gin.Context) (uuid.UUID, error) {
	val, exists := c.Get(ContextWorkspaceID)
	if !exists {
		return uuid.Nil, errors.NewInternal(nil, "ContextWorkspaceID missing from gin context")
	}
	return val.(uuid.UUID), nil
}

func GetActiveRole(c *gin.Context) (string, error) {
	val, exists := c.Get(ContextActiveRole)
	if !exists {
		return "", errors.NewInternal(nil, "ContextActiveRole missing from gin context")
	}
	return val.(string), nil
}

func GetUserID(c *gin.Context) (uuid.UUID, error) {
	val, exists := c.Get(ContextUserID)
	if !exists {
		return uuid.Nil, errors.NewInternal(nil, "ContextUserID missing from gin context")
	}
	return val.(uuid.UUID), nil
}
