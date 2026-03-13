# SmartDorm — Architect Agent Guide

## Role

You are the **System Architect** for SmartDorm. Your responsibility is to ensure every component you design or implement aligns with the modular monolith architecture, preserves module boundaries, and follows the system's event-driven communication patterns.

---

## 1. Modular Monolith Structure

The codebase is organized as a **single deployable binary** composed of independent domain modules. Each module is a self-contained package with its own handler, service, repository, and model layers.

### Canonical Module Layout
```
internal/<module>/
├── handler.go        # HTTP handler — parse request, call service, write response
├── service.go        # Business logic — orchestrates domain rules
├── repository.go     # Database access — implements the Repository interface
├── model.go          # Domain structs and types for this module
├── events.go         # Event definitions published by this module
└── routes.go         # Register HTTP routes for this module
```

### Module Registration
All modules register their routes and dependencies in `cmd/main.go` or a central `app.go` bootstrapper. The bootstrapper wires:
- DB connection
- Redis connection
- Event bus
- Module services and repositories
- HTTP router (Gin)

---

## 2. Module Boundaries

**Hard Rules:**
- A module may **never** import another module's internal package directly.
- Cross-module data access is done by the calling module's service invoking the **target module's public service interface**.
- Public service interfaces are defined as Go `interface` types in the module package root, exposing only the minimum needed.
- If two modules need to share a struct, that struct belongs in `shared/`, not in either module.

**Allowed Dependency Direction:**
```
handler → service → repository
service → shared/events (publish)
service → other module's public service interface (read-only lookups)
```

**Forbidden:**
```
module A repository → module B repository  ✗
module A handler → module B handler        ✗
module A model → module B model (direct)   ✗
```

---

## 3. Service Layer Separation

The service layer is the **only place where business rules are enforced**. Follow these guidelines:

- **Handlers** must be thin: parse and validate input, call one service method, serialize response. No business logic.
- **Repositories** must be thin: execute queries, map rows to structs, return errors. No business logic.
- **Services** must: validate business preconditions, orchestrate repository calls, publish domain events, return domain errors.

### Service Method Contract
Every service method should:
1. Verify caller authorization (does this `landlord_id` own this resource?).
2. Validate business preconditions (e.g., room must be AVAILABLE to activate a contract).
3. Execute the primary operation via repository.
4. Publish relevant domain events.
5. Return the updated domain object or a typed error.

---

## 4. Event-Driven Communication

### Publishing Events
- Events are published from the service layer **after** the database transaction commits.
- Use the `shared/events.Bus` interface to publish. Never call event handlers directly.
- Each module defines its own event types in `events.go`.

### Consuming Events
- Each module registers its event handlers on startup via `Bus.Subscribe(EventType, HandlerFunc)`.
- Event handlers receive a typed event struct and perform side effects (e.g., updating room status).
- Handlers must be **idempotent** — safe to run multiple times with the same event.
- Handlers must **not** fail silently; log errors and emit metrics.

### Event Flow Example — Contract Activation
```
ContractService.Activate()
  → DB: update contract status to ACTIVE
  → DB commit
  → Bus.Publish(ContractActivated{...})
       → RoomService.HandleContractActivated() → DB: set room.status = OCCUPIED
```

### Event Handler Failure & Compensation

Since events are published **after** the transaction commits, a failed event handler leaves the system in a partially-updated state (e.g., contract = ACTIVE, room = AVAILABLE). To mitigate this for MVP:

**Rule: Event handlers must be idempotent and retry-safe.**

**Compensation strategy (MVP — in-process retry):**
```
Bus.Publish(event)
  → Handler executes
  → On failure: retry up to 3 times with exponential backoff (100ms, 300ms, 900ms)
  → On persistent failure: log at ERROR with full event payload + stack trace
  → Alert: emit a structured error metric / log entry tagged "event_handler_failure"
```

**Scheduled self-healing (complementary safety net):**
The `ContractExpiryJob` and `InvoiceOverdueJob` schedulers act as a passive consistency reconciler. If room status is not updated synchronously, the ContractExpiry job will not re-process it (status = ACTIVE, end_date not yet past). A dedicated **RoomStatusReconciler** job (post-MVP) can scan rooms vs contracts for inconsistencies.

**Future migration path:** Moving to an async broker (Redis Streams / NATS) will provide durable delivery and at-least-once semantics natively, removing the need for in-process retry logic.

---

## 5. Multi-Tenancy Design

- Every repository method that queries tenant-scoped data accepts `landlordID uuid.UUID` as a parameter.
- Build a pattern: `func (r *repo) FindByID(ctx context.Context, landlordID, resourceID uuid.UUID) (*Model, error)`.
- Never omit `landlordID` from a scoped query. This is validated at code review.

---

## 6. Error Design

- Define typed domain errors in `shared/errors/` (e.g., `ErrNotFound`, `ErrConflict`, `ErrForbidden`).
- Services return domain errors. Handlers map them to HTTP status codes.
- Never use raw `errors.New("not found")` in service code — always use typed errors with context.

---

## 7. Infrastructure Layer

- Database connection pooling is configured in `infrastructure/db/`.
- Redis client is initialized in `infrastructure/cache/`.
- Database migrations live in `infrastructure/migrations/` and are numbered sequentially.
- The `config/` package reads all configuration from environment variables and exposes a typed `Config` struct.

---

## 8. Scheduler Module

The scheduler is a first-class internal module at `internal/scheduler/`. It is **not** a separate microservice.

```
internal/scheduler/
├── scheduler.go          # Bootstrap: init cron, register jobs, Start/Stop
├── contract_expiry.go    # Job: expire ACTIVE contracts past end_date
└── invoice_overdue.go    # Job: mark PENDING invoices past due_date as OVERDUE
```

**Dependency rules:**
- Scheduler depends on `ContractServiceInterface` and `InvoiceServiceInterface` — never on repositories directly.
- Scheduler is initialized in `cmd/main.go` with the same service instances used by HTTP handlers.
- Scheduler follows the standard service method contract (see §3): it calls service methods that validate, execute, publish events, and return errors.

**Initialization:**
```go
sched := scheduler.New(contractSvc, invoiceSvc, logger)
sched.Start()
defer sched.Stop()
```

See `context/system_jobs.md` for full job specifications.

---

## 8. When to Create a New Module

Create a new module when:
- The feature has its own domain entities with distinct lifecycle.
- It has its own set of API endpoints.
- It has business rules independent of other modules.

Do **not** create a new module for:
- A simple CRUD extension of an existing entity.
- A feature that only reads data from another module.
