package db

import (
	"database/sql"
	"time"

	"github.com/jackc/pgx/v5/stdlib"
	"github.com/jackc/pgx/v5/pgxpool"
)

// sqldbFromPgxPool creates a standard library *sql.DB from a *pgxpool.Pool.
// pgx v5 provides stdlib.OpenDBFromPool.
func sqldbFromPgxPool(pool *pgxpool.Pool) *sql.DB {
	// stdlib.OpenDBFromPool uses the existing pool for standard database/sql interface
	db := stdlib.OpenDBFromPool(pool)
	
	// The MaxOpenConns/MaxIdleConns should be managed by pgxpool, but we set them here
	// to ensure db.DB doesn't limit the pgxpool limits
	db.SetMaxOpenConns(50)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(time.Hour)
	
	return db
}
