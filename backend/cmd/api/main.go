package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"smartdorm/config"
	"smartdorm/infrastructure/cache"
	"smartdorm/infrastructure/db"
	"smartdorm/shared/events"
	"smartdorm/shared/jwt"
	"smartdorm/shared/logger"

	"smartdorm/internal/auth"
	"smartdorm/internal/contract"
	"smartdorm/internal/invoice"
	"smartdorm/internal/maintenance"
	"smartdorm/internal/property"
	"smartdorm/internal/renter"
	"smartdorm/internal/room"
	"smartdorm/internal/scheduler"
	"smartdorm/internal/workspace"
	"smartdorm/shared/middleware"

	"github.com/gin-gonic/gin"
	"log/slog"
)

func main() {
	// 1. Load Configuration
	cfg, err := config.Load()
	if err != nil {
		fmt.Printf("Failed to load configuration: %v\n", err)
		os.Exit(1)
	}

	// 2. Initialize Logger
	logger.InitLogger(cfg.Environment)
	slog.Info("Starting SmartDorm API...")

	// 3. Run Database Migrations
	// Assuming migrations are in "infrastructure/migrations" relative to the project root
	// Or use an environment variable for flexibility (e.g. MIGRATIONS_URL="file://infrastructure/migrations")
	err = db.RunMigrations(cfg.DatabaseURL, "file://infrastructure/migrations")
	if err != nil {
		slog.Error("Database migration failed", "err", err)
		os.Exit(1)
	}

	// 4. Initialize Database
	dbConn, err := db.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		slog.Error("Failed to connect to database", "err", err)
		os.Exit(1)
	}
	defer dbConn.Close()
	slog.Info("Database connected successfully")

	// 5. Initialize Redis Cache
	redisClient, err := cache.New(context.Background(), cfg.RedisURL)
	if err != nil {
		slog.Error("Failed to connect to Redis", "err", err)
		os.Exit(1)
	}
	// Important: We do NOT defer redisClient.Close() here if it's managed via the cache package's internal pool,
	// but cache.NewRedisClient returns a *redis.Client, so we should close it.
	defer redisClient.Close()
	slog.Info("Redis connected successfully")

	// 6. Initialize Shared Infrastructure component (Event Bus)
	eventBus := events.NewMemoryBus()
	jwtIssuer := jwt.NewIssuer(cfg.JWTSecret)

	// 7. Setup Gin Router
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery(), middleware.CORS())
	
	// Elite Logic: Global Context Consistency Check
	router.Use(middleware.ValidateContext())

	// Implement core middlewares explicitly here before routing:
	// - CORS
	// - Rate Limiting (using redisClient)
	// - Request ID tracking
	// We assume these are registered directly via Use() or inside the group

	v1 := router.Group("/api/v1")
	{
		// 8. Initialize and Wire Modules
		// Some order matters for dependencies

		// Auth Module
		authRepo := auth.NewRepository(dbConn)
		authSvc := auth.NewService(authRepo, jwtIssuer)
		authHandler := auth.NewHandler(authSvc)
		auth.RegisterRoutes(v1, authHandler, jwtIssuer)

		// Workspace Module
		workspaceRepo := workspace.NewRepository(dbConn)
		workspaceSvc := workspace.NewService(workspaceRepo)
		workspaceHandler := workspace.NewHandler(workspaceSvc)
		workspace.RegisterRoutes(v1, workspaceHandler, jwtIssuer)

		// Property Module
		propertyRepo := property.NewRepository(dbConn)
		propertySvc := property.NewService(propertyRepo)
		propertyHandler := property.NewHandler(propertySvc)
		property.RegisterRoutes(v1, propertyHandler, jwtIssuer)

		// Room Module
		roomRepo := room.NewRepository(dbConn)
		roomSvc := room.NewService(roomRepo, eventBus)
		roomHandler := room.NewHandler(roomSvc)
		room.RegisterRoutes(v1, roomHandler, jwtIssuer)

		// Renter Module
		renterRepo := renter.NewRepository(dbConn)
		renterSvc := renter.NewService(renterRepo)
		renterHandler := renter.NewHandler(renterSvc)
		renter.RegisterRoutes(v1, renterHandler, jwtIssuer)

		// Contract Module
		contractRepo := contract.NewRepository(dbConn)
		contractSvc := contract.NewService(contractRepo, eventBus)
		contractHandler := contract.NewHandler(contractSvc)
		contract.RegisterRoutes(v1, contractHandler, jwtIssuer)

		// Invoice Module
		invoiceRepo := invoice.NewRepository(dbConn)
		invoiceSvc := invoice.NewService(invoiceRepo, eventBus)
		invoiceHandler := invoice.NewHandler(invoiceSvc)
		invoice.RegisterRoutes(v1, invoiceHandler, jwtIssuer)

		// Maintenance Module
		maintenanceRepo := maintenance.NewRepository(dbConn)
		maintenanceSvc := maintenance.NewService(maintenanceRepo)
		maintenanceHandler := maintenance.NewHandler(maintenanceSvc)
		maintenance.RegisterRoutes(v1, maintenanceHandler, jwtIssuer)

		// 9. Initialize Scheduler
		sched := scheduler.NewScheduler(24 * time.Hour)

		// Register Jobs
		contractExpiryJob := scheduler.NewContractExpiryJob(dbConn, eventBus)
		sched.Register(contractExpiryJob)

		invoiceOverdueJob := scheduler.NewInvoiceOverdueJob(dbConn)
		sched.Register(invoiceOverdueJob)

		// Start Scheduler
		sched.Start()
		defer sched.Stop()
	}

	// 10. Start HTTP Server with Graceful Shutdown
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: router,
	}

	// Run server in a goroutine
	go func() {
		slog.Info("Server listening", "port", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("ListenAndServe failed", "err", err)
			os.Exit(1)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	slog.Info("Shutting down server...")

	// 10 seconds timeout for graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		slog.Error("Server forced to shutdown", "err", err)
	}

	slog.Info("Server exiting")
}
