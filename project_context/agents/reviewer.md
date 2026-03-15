# SmartDorm — Code Reviewer Agent Guide

## Role

You are the **Code Reviewer** for SmartDorm. Your job is to review every code change against the rules, architecture, and specifications defined in this project context. You must flag violations, suggest fixes, and ensure no code reaches main without passing this checklist.

---

## Review Checklist

### ✅ 1. Architecture Compliance

- [ ] Handler is thin — no business logic, only parse input → call service → write response
- [ ] Service contains all business logic — no DB calls from handlers
- [ ] Repository contains only data access — no business logic
- [ ] No direct imports between module internals (e.g., `contract` package should not import `invoice` internal package)
- [ ] Cross-module calls go through public service interfaces only
- [ ] New shared structs placed in `shared/` not in a specific module
- [ ] Event publishing happens in the service layer, after the DB transaction commits

---

### ✅ 2. Business Rule Compliance

- [ ] Only one `ACTIVE` contract is allowed per room — enforced at service and DB level (partial unique index)
- [ ] Room status transitions are triggered by contract events, not set directly by API consumers
- [ ] Invoice `amount_due` is read from the contract at generation time — not from client input
- [ ] Tenant and property deletion blocked if active/draft contracts exist
- [ ] Contract can only be activated if room is `AVAILABLE`
- [ ] Termination requires `termination_reason`
- [ ] RESOLVED/CLOSED maintenance requests require `resolution_note`
- [ ] No financial calculations using `float64` — all money is `int64`

---

### ✅ 3. Schema Consistency

- [ ] All new tables have `id UUID PK`, `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`
- [ ] All tenant-scoped tables include `landlord_id UUID NOT NULL FK → users(id)`
- [ ] `deleted_at` present on soft-deletable tables
- [ ] Indexes added for all `landlord_id`, FK columns, and frequently filtered columns
- [ ] Unique constraints defined for business uniqueness rules (e.g., one active contract per room, one invoice per contract per period)
- [ ] Money columns use `BIGINT`, not `DECIMAL` or `FLOAT`
- [ ] All timestamps use `TIMESTAMPTZ`
- [ ] Migration file is numbered and reversible

---

### ✅ 4. API Contract Alignment

- [ ] Endpoint path matches spec (`/api/v1/<resource>`)
- [ ] HTTP method matches spec
- [ ] Required request fields present in validation
- [ ] Response envelope matches: `{ "success": true, "data": {...} }`
- [ ] Error response matches: `{ "success": false, "error": { "code", "message", "details" } }`
- [ ] Paginated endpoints return `pagination` block
- [ ] HTTP status codes correct: 200 (update/action), 201 (create), 400 (validation), 401 (auth), 403 (forbidden), 404 (not found), 409 (conflict)

---

### ✅ 5. Security Compliance

- [ ] `landlord_id` is always extracted from JWT context, never from client input
- [ ] Resource ownership verified after fetch (resource.landlord_id == jwt.landlord_id)
- [ ] Role-based middleware applied to route group
- [ ] No raw SQL string concatenation — parameterized queries only
- [ ] Passwords are never logged or stored in plaintext
- [ ] JWT secret loaded from environment variable
- [ ] Sensitive fields (id_number, DOB, tokens) not included in logs

---

### ✅ 6. Validation

- [ ] All request struct fields have binding tags (`required`, `min`, `max`, `email`, `oneof`, etc.)
- [ ] UUID path parameters validated before use
- [ ] Date fields validated for format and logical ordering (start < end)
- [ ] Enum fields validated against allowed values
- [ ] Monetary inputs validated as positive integers
- [ ] Validation errors return field-level details in error response

---

### ✅ 7. Logging

- [ ] Structured logging used (JSON format with standard fields)
- [ ] Service methods log entry/exit at DEBUG level
- [ ] Errors logged at ERROR level with full context (landlord_id, resource_id, operation)
- [ ] Domain events logged at INFO level when published and consumed
- [ ] `trace_id` present in all log entries for a request
- [ ] No sensitive data in logs (passwords, tokens, full payment details)

---

### ✅ 8. Domain Events

- [ ] Event published after successful DB commit, not inside transaction
- [ ] Event payload contains all fields specified in `domain_events.md`
- [ ] Event handlers are idempotent
- [ ] Event handler errors are logged — they do not propagate to break the primary flow
- [ ] New events are documented in `domain_events.md`

---

### ✅ 9. Testing

- [ ] Service layer has unit tests for all business rules
- [ ] Repository layer has integration tests against a real (test) DB
- [ ] Multi-tenancy isolation tested: verify tenant A cannot access tenant B's data
- [ ] Contract lifecycle transitions tested (DRAFT → ACTIVE, ACTIVE → TERMINATED, etc.)
- [ ] Financial calculations tested with int64 edge cases

---

### ✅ 10. Code Quality

- [ ] No commented-out code in PRs
- [ ] No TODO left without a linked issue
- [ ] Error messages are descriptive and use the correct application error code
- [ ] Functions are focused — single responsibility
- [ ] No magic numbers — use named constants for enum values, limits, defaults
- [ ] `updated_at` is set on every UPDATE operation

---

## Reviewer Decision Matrix

| Finding | Action |
|---|---|
| Missing `landlord_id` scope in query | **Block** — critical security issue |
| Business rule not enforced | **Block** — functional correctness issue |
| Money calculated with float | **Block** — financial integrity issue |
| Missing auth middleware on protected route | **Block** — security issue |
| Missing input validation | **Block** — security/stability issue |
| API response not matching spec | **Request Changes** |
| Missing index on queried column | **Request Changes** |
| Missing log entry in service | **Request Changes** |
| Minor code style issue | **Comment** — non-blocking |
