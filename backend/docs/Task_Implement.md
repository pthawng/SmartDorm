SmartDorm Backend — Task Checklist
Phase 1: Foundation
 Initialize Go module and project structure (go.mod, directory layout)
 Configuration loading (
config/config.go
)
 Database infrastructure (infrastructure/db/)
 Redis infrastructure (infrastructure/cache/)
 Database migrations (infrastructure/migrations/)
Phase 2: Shared Layer
 Domain errors (shared/errors/)
 Response helpers (shared/response/)
 Pagination utilities (shared/pagination/)
 Event bus (shared/events/)
 JWT utilities (shared/jwt/)
 Middleware: auth, rate limiting, logging, security headers (shared/middleware/)
 Logger (shared/logger/)
Phase 3: Auth Module
 internal/auth/model.go — User, Membership, AdminRole structs
 internal/auth/dto.go — Request/Response DTOs
 internal/auth/repository.go — User/membership DB queries
 internal/auth/service.go — Register, Login, Token minting
 internal/auth/handler.go — HTTP handlers
 internal/auth/routes.go — Route registration
Phase 4: Workspace Module
 internal/workspace/model.go
 internal/workspace/dto.go
 internal/workspace/repository.go
 internal/workspace/service.go
 internal/workspace/handler.go
 internal/workspace/routes.go
Phase 5: Property Module
 internal/property/model.go
 internal/property/dto.go
 internal/property/repository.go
 internal/property/service.go
 internal/property/handler.go
 internal/property/routes.go
Phase 6: Room Module
 internal/room/model.go
 internal/room/dto.go
 internal/room/repository.go
 internal/room/service.go — incl. event handler for ContractActivated/Terminated/Expired
 internal/room/handler.go
 internal/room/routes.go
Phase 7: Renter Module
 internal/renter/model.go
 internal/renter/dto.go
 internal/renter/repository.go
 internal/renter/service.go
 internal/renter/handler.go
 internal/renter/routes.go
Phase 8: Contract Module
 internal/contract/model.go
 internal/contract/dto.go
 internal/contract/events.go
 internal/contract/repository.go
 internal/contract/service.go — lifecycle: DRAFT→ACTIVE→TERMINATED/EXPIRED
 internal/contract/handler.go
 internal/contract/routes.go
Phase 9: Invoice Module
 internal/invoice/model.go
 internal/invoice/dto.go
 internal/invoice/events.go
 internal/invoice/repository.go
 internal/invoice/service.go — generate, mark-paid, cancel; event consumer
 internal/invoice/handler.go
 internal/invoice/routes.go
Phase 10: Maintenance Module
 internal/maintenance/model.go
 internal/maintenance/dto.go
 internal/maintenance/events.go
 internal/maintenance/repository.go
 internal/maintenance/service.go
 internal/maintenance/handler.go
 internal/maintenance/routes.go
Phase 11: Scheduler Module
 internal/scheduler/scheduler.go
 internal/scheduler/contract_expiry.go
 internal/scheduler/invoice_overdue.go
Phase 12: Entry Point & Wiring
 cmd/api/main.go — Bootstrap all modules, start server + scheduler
Phase 13: Verification
 Build compiles cleanly
 Migrations are syntactically valid SQL
 run go vet on the project
