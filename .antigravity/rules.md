# SmartDorm — Development Rules & Standards

## 1. Architecture Rules

- Follow **Modular Monolith** structure. Each domain (auth, property, room, tenant, contract, invoice, maintenance) lives in its own package with clear boundaries.
- Modules communicate exclusively via **domain events** or public service interfaces — never by importing each other's internal packages.
- No circular dependencies between modules.
- All business logic lives in the **service layer**; handlers are thin and only responsible for parsing requests and writing responses.
- Repository interfaces must be defined in the domain package; implementations live in the infrastructure layer.
- The `shared/` package is the only cross-cutting package allowed. It must contain only utilities, not business logic.

## 2. Validation Rules

- All incoming request bodies must be validated before reaching the service layer.
- Use struct tags for field-level validation (e.g., `binding:"required,email"`).
- Validate UUIDs, enums, date ranges, and numeric constraints explicitly.
- Return descriptive, field-level validation errors in a consistent format (see Error Handling).
- Never trust client-supplied `landlord_id` — always derive it from the authenticated JWT context.

## 3. Logging Requirements

- Use structured logging (JSON format) with consistent fields: `timestamp`, `level`, `module`, `action`, `trace_id`, `user_id`, `error`.
- Log at entry and exit of every service method at `DEBUG` level in development.
- Log all errors at `ERROR` level with full context (input parameters, stack trace if applicable).
- Log all domain events at `INFO` level when published and when consumed.
- Never log sensitive data: passwords, tokens, full payment details.
- Every HTTP request must be logged with method, path, status code, latency, and `trace_id`.

## 4. Financial Data Handling

- **All monetary values are stored and processed as `int64` (cents/smallest currency unit).** Never use `float64` for money.
- Display-only formatting to human-readable currency strings happens only at the API response layer.
- Document the currency unit in every field comment (e.g., `// AmountDue int64 // in VND cents`).
- Invoice totals must be computed server-side; never accept a pre-calculated total from the client.
- All financial calculations must be auditable — log input values and result.

## 5. Pagination Requirements

- All list endpoints **must** support cursor-based or offset pagination.
- Default page size: `20`. Maximum page size: `100`.
- Pagination parameters: `page` (int, 1-based) and `page_size` (int).
- All paginated responses must include: `data[]`, `total`, `page`, `page_size`, `total_pages`.
- Never return unbounded lists from the database.

## 6. Error Handling Rules

- Use a unified error response envelope:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Human-readable message",
      "details": { "field": "reason" }
    }
  }
  ```
- Use application-level error codes (e.g., `NOT_FOUND`, `UNAUTHORIZED`, `CONTRACT_ALREADY_ACTIVE`).
- Map domain errors to HTTP status codes in the handler layer only.
- Never expose internal error messages or stack traces to the client in production.
- Wrap all database errors; never return raw DB errors to upper layers.

## 7. Multi-Tenancy Rules

- Every data-access query for workspace-scoped resources **must** include a `workspace_id` filter.
- Enforce `workspace_id` scoping at the repository layer, not just the handler layer.
- `workspace_id` is always extracted from the JWT — never accepted from client input (body, path, or query params).
- Row-level ownership must be verified before any update or delete operation.
- Workspace membership (`memberships` table) must be verified on sensitive operations.
- Tests must verify cross-workspace data isolation explicitly.

## 8. General Standards

- All IDs use UUID v4.
- All timestamps use UTC and are stored as `TIMESTAMPTZ`.
- Database migrations are versioned and never destructive without an explicit rollback script.
- All environment configuration is injected via environment variables — no hardcoded secrets.
- API versioning prefix: `/api/v1/`.

---

## 9. Database Access Library (Locked)

**Chosen stack: `pgx/v5` + `sqlx`**

This choice is locked for the entire project. Do **not** use raw `database/sql`, `gorm`, `ent`, or `squirrel`.

### Rules

- Use `pgx/v5` as the PostgreSQL driver for connection pooling and raw query execution.
- Use `sqlx` on top of `pgx` for struct scanning (`StructScan`, `Select`, `Get`) and named query support.
- All queries are written as **raw SQL strings** with named parameters — no query builder.
- Use `pgx` connection pool (`pgxpool.Pool`) passed as a dependency to all repositories.

### Query Conventions

```go
// SELECT single row
func (r *repo) FindByID(ctx context.Context, landlordID, id uuid.UUID) (*Model, error) {
    const q = `SELECT * FROM table WHERE id = $1 AND landlord_id = $2 AND deleted_at IS NULL`
    var m Model
    err := r.db.GetContext(ctx, &m, q, id, landlordID)
    // ...
}

// SELECT list
func (r *repo) List(ctx context.Context, landlordID uuid.UUID) ([]*Model, error) {
    const q = `SELECT * FROM table WHERE landlord_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT $2 OFFSET $3`
    var results []*Model
    err := r.db.SelectContext(ctx, &results, q, landlordID, limit, offset)
    // ...
}
```

### Transaction Pattern

```go
// Use pgx transaction, wrap with sqlx
tx, err := r.pool.Begin(ctx)
if err != nil { return err }
defer tx.Rollback(ctx)
sqlxTx := sqlx.NewTx(tx, r.db.DriverName())
// ... execute queries on sqlxTx ...
return tx.Commit(ctx)
```

### Anti-Patterns

```go
// WRONG: string-built query
query := fmt.Sprintf("SELECT * FROM rooms WHERE landlord_id = '%s'", landlordID)

// WRONG: using an ORM (gorm, ent)
db.Where("landlord_id = ?", landlordID).Find(&rooms)

// CORRECT: parameterized raw SQL
const q = `SELECT * FROM rooms WHERE landlord_id = $1`
r.db.SelectContext(ctx, &rooms, q, landlordID)
```
