package db

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/reflectx"
)

// Database wraps pgxpool and sqlx for the application
type Database struct {
	*sqlx.DB
	Pool *pgxpool.Pool
}

// New connects to PostgreSQL using pgxpool and wraps it with sqlx
func New(ctx context.Context, databaseURL string) (*Database, error) {
	// Configure pgxpool
	poolConfig, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse database URL: %w", err)
	}

	// Set health check and connection limits
	poolConfig.MaxConns = 50
	poolConfig.MinConns = 5
	poolConfig.MaxConnLifetime = time.Hour
	poolConfig.MaxConnIdleTime = 30 * time.Minute

	// Create pool
	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Verify connection
	if err := pool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Wrap with standard library database/sql interface compatible wrapper (used by sqlx)
	// sqlx is used heavily for struct scanning named queries
	// pgx stdlib adapter allows sqlx to use pgx pool connections
	db := sqldbFromPgxPool(pool)
	
	sqlxDB := sqlx.NewDb(db, "pgx")
	
	// Support snake_case struct tags automatically for scanning
	sqlxDB.Mapper = reflectx.NewMapperFunc("db", sqlx.NameMapper)

	slog.Info("Successfully connected to database")

	return &Database{
		DB:   sqlxDB,
		Pool: pool,
	}, nil
}

// Close closes the connection pool
func (d *Database) Close() {
	if d.Pool != nil {
		slog.Info("Closing database connection pool")
		d.Pool.Close()
	}
}
