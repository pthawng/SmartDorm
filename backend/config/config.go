package config

import (
	"log/slog"
	"os"
	"strconv"
	"github.com/joho/godotenv"
)

// Config holds the application configuration
type Config struct {
	Environment string
	Port        int
	DatabaseURL string
	RedisURL    string
	JWTSecret   string
}

// Load reads configuration from environment variables and an optional .env file
func Load() (*Config, error) {
	// Try loading .env file if it exists, but don't fail if it doesn't
	_ = godotenv.Load()

	portStr := getEnvOrDefault("PORT", "8080")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		slog.Warn("Invalid PORT environment variable, defaulting to 8080", "error", err)
		port = 8080
	}

	cfg := &Config{
		Environment: getEnvOrDefault("ENV", "development"),
		Port:        port,
		DatabaseURL: getEnvOrDefault("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/smartdorm?sslmode=disable"),
		RedisURL:    getEnvOrDefault("REDIS_URL", "redis://localhost:6379/0"),
		JWTSecret:   getEnvOrDefault("JWT_SECRET", "super-secret-key-change-me-in-production"),
	}

	return cfg, nil
}

func getEnvOrDefault(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
