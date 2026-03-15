package middleware

import (
	"context"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"

	"smartdorm/infrastructure/cache"
	apperr "smartdorm/shared/errors"
	"smartdorm/shared/response"
)

// RateLimiter implements a fixed-window API rate limiter backed by Redis
func RateLimiter(redis *cache.Cache, maxRequests int64, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		key := fmt.Sprintf("rate_limit:ip:%s", ip)

		ctx := context.Background()

		// Increment request count
		count, err := redis.Client.Incr(ctx, key).Result()
		if err != nil {
			// On Redis failure, fail-open to allow request (logged asynchronously)
			c.Next()
			return
		}

		// Set expiry on first request in window
		if count == 1 {
			redis.Client.Expire(ctx, key, window)
		}

		// Deny request if limit exceeded
		if count > maxRequests {
			response.Error(c, apperr.New(apperr.CodeInternal, "Too many requests. Please try again later.", apperr.WithErr(fmt.Errorf("rate limit %v per %v exceeded for IP %s", maxRequests, window, ip))))
			c.AbortWithStatus(429)
			return
		}

		c.Next()
	}
}
