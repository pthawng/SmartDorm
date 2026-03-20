package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// CORS handles Cross-Origin Resource Sharing especially for credentials (cookies)
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		
		// In production, you should validate the origin against a whitelist
		// For local development, we allow the dynamic origin if it's present
		if origin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}
		
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
