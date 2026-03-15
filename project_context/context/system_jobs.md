# SmartDorm — System Jobs (Scheduler)

## Overview

SmartDorm requires background scheduled jobs to drive state transitions that cannot be initiated by user actions alone. All scheduled jobs run within the same binary as the modular monolith (no separate process for MVP).

**Library:** [`robfig/cron/v3`](https://github.com/robfig/cron) — production-grade cron scheduler for Go.

**Module location:**
```
internal/scheduler/
├── scheduler.go          # Bootstrap: initializes cron, registers all jobs
├── contract_expiry.go    # Job: expire active contracts past end_date
└── invoice_overdue.go    # Job: mark PENDING invoices past due_date as OVERDUE
```

The `scheduler` package is initialized in `cmd/main.go` / `app.go` alongside other modules. It depends on the `contract` and `invoice` service interfaces — it does **not** access repositories directly.

---

## Jobs

---

### Job 1: `ContractExpiryJob`

**File:** `internal/scheduler/contract_expiry.go`

**Schedule:** Every hour (`0 * * * *`)

**Purpose:** Detect contracts where `end_date < TODAY` and `status = 'ACTIVE'`, transition them to `EXPIRED`, and release the room.

**Logic:**
```
1. Query: SELECT * FROM contracts WHERE status = 'ACTIVE' AND end_date < CURRENT_DATE
2. For each contract:
   a. Call ContractService.Expire(ctx, contractID)
   b. Service transitions status → EXPIRED (DB update)
   c. Service publishes ContractExpired event
   d. RoomModule handler: set room.status = AVAILABLE
3. Log result: count of contracts expired, any errors
```

**Error handling:**
- Process each contract independently — one failure does not abort the rest.
- Log failures at `ERROR` level with `contract_id` and error context.
- A failed expiry will be retried on the next scheduled run (idempotent by design).

**Idempotency guarantee:** The query only returns `ACTIVE` contracts past `end_date`. Once transitioned to `EXPIRED`, those records are excluded from future runs.

---

### Job 2: `InvoiceOverdueJob`

**File:** `internal/scheduler/invoice_overdue.go`

**Schedule:** Every hour (`0 * * * *`)

**Purpose:** Detect invoices where `due_date < TODAY` and `status = 'PENDING'`, mark them as `OVERDUE`.

**Logic:**
```
1. Query: SELECT * FROM invoices WHERE status = 'PENDING' AND due_date < CURRENT_DATE
2. For each invoice:
   a. Call InvoiceService.MarkOverdue(ctx, invoiceID)
   b. Service transitions status → OVERDUE (DB update)
   c. Service publishes InvoiceOverdue event
   d. notification module (future): alert landlord and tenant
3. Log result: count of invoices marked overdue, any errors
```

**Error handling:**
- Process each invoice independently.
- Log failures at `ERROR` level with `invoice_id`.
- Retried on next run (idempotent).

---

## Scheduler Bootstrap

```go
// internal/scheduler/scheduler.go

type Scheduler struct {
    cron            *cron.Cron
    contractService ContractServiceInterface
    invoiceService  InvoiceServiceInterface
    logger          Logger
}

func New(contractSvc ContractServiceInterface, invoiceSvc InvoiceServiceInterface, logger Logger) *Scheduler {
    return &Scheduler{
        cron:            cron.New(),
        contractService: contractSvc,
        invoiceService:  invoiceSvc,
        logger:          logger,
    }
}

func (s *Scheduler) Start() {
    s.cron.AddFunc("0 * * * *", s.runContractExpiry)
    s.cron.AddFunc("0 * * * *", s.runInvoiceOverdue)
    s.cron.Start()
    s.logger.Info("scheduler started")
}

func (s *Scheduler) Stop() {
    s.cron.Stop()
}
```

---

## Integration with Event Bus

Jobs use the service layer, not direct repository access. The service publishes events through the standard event bus — the same flow as API-triggered actions.

```
Scheduler Job
  → Service.Expire() / Service.MarkOverdue()
  → DB update (transaction)
  → Bus.Publish(ContractExpired{} / InvoiceOverdue{})
  → Subscribed handlers react
```

---

## Operational Notes

- Scheduler runs in the same process. On multi-instance deployment (future), use a **distributed lock** (Redis SETNX) to prevent duplicate job execution across instances. For MVP single-VPS deployment, no lock is needed.
- All job runs are logged with: `job_name`, `started_at`, `duration_ms`, `records_processed`, `errors`.
- Schedule can be made configurable via environment variable in future phases.
