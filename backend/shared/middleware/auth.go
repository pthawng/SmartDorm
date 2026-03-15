package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"smartdorm/shared/errors"
	"smartdorm/shared/jwt"
	"smartdorm/shared/response"
)

// Constants for context keys
const (
	ContextUserID         = "user_id"
	ContextRole           = "role"
	ContextWorkspaceID    = "workspace_id"
	ContextMembershipRole = "membership_role"
	ContextRenterID       = "renter_id"
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

		// Inject universal identity context
		if claims.UserID != nil {
			c.Set(ContextUserID, *claims.UserID)
		}
		c.Set(ContextRole, claims.Role)

		// Inject role-specific context
		switch claims.Role {
		case jwt.RoleLandlord:
			if claims.WorkspaceID != nil && claims.MembershipRole != nil {
				c.Set(ContextWorkspaceID, *claims.WorkspaceID)
				c.Set(ContextMembershipRole, *claims.MembershipRole)
			}
		case jwt.RoleTenant:
			if claims.RenterID != nil {
				c.Set(ContextRenterID, *claims.RenterID)
			}
		}

		c.Next()
	}
}

// RequireWorkspace enforces that the caller has a valid LANDLORD identity for a workspace
func RequireWorkspace() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get(ContextRole)
		if !exists || role != jwt.RoleLandlord {
			response.Error(c, errors.NewForbidden("Requires Landlord context"))
			c.Abort()
			return
		}

		if _, exists := c.Get(ContextWorkspaceID); !exists {
			response.Error(c, errors.NewForbidden("Missing Workspace ID in context"))
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireTenant enforces that the caller has a valid TENANT identity
func RequireTenant() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get(ContextRole)
		if !exists || role != jwt.RoleTenant {
			response.Error(c, errors.NewForbidden("Requires Tenant context"))
			c.Abort()
			return
		}

		if _, exists := c.Get(ContextRenterID); !exists {
			response.Error(c, errors.NewForbidden("Missing Renter ID in context"))
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

func GetRenterID(c *gin.Context) (uuid.UUID, error) {
	val, exists := c.Get(ContextRenterID)
	if !exists {
		return uuid.Nil, errors.NewInternal(nil, "ContextRenterID missing from gin context")
	}
	return val.(uuid.UUID), nil
}

func GetUserID(c *gin.Context) (uuid.UUID, error) {
	val, exists := c.Get(ContextUserID)
	if !exists {
		return uuid.Nil, errors.NewInternal(nil, "ContextUserID missing from gin context")
	}
	return val.(uuid.UUID), nil
}
