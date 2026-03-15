package cache

import (
	"context"
	"fmt"
	"log/slog"
	"github.com/redis/go-redis/v9"
)

// Cache wraps the Redis client
type Cache struct {
	Client *redis.Client
}

// New connects to Redis
func New(ctx context.Context, redisURL string) (*Cache, error) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse redis URL: %w", err)
	}

	client := redis.NewClient(opts)

	// Verify connection
	status := client.Ping(ctx)
	if err := status.Err(); err != nil {
		return nil, fmt.Errorf("failed to ping redis: %w", err)
	}

	slog.Info("Successfully connected to Redis")

	return &Cache{
		Client: client,
	}, nil
}

// Close closes the Redis connection
func (c *Cache) Close() error {
	slog.Info("Closing Redis connection")
	return c.Client.Close()
}
