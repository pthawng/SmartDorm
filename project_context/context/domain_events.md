# SmartDorm — Domain Events

## Overview

SmartDorm uses an in-process event bus for cross-module communication. Modules publish events after completing state transitions; other modules subscribe to react without direct coupling.

All events are:
- Published **after** the primary transaction commits (not inside the DB transaction).
- Identified by a `EventType` string constant.
- Carried as typed structs in the `shared/events` package.

---

## Event Catalogue

---

### `ContractCreated`

**Trigger:** A new contract is persisted with status `DRAFT`.

**Publisher:** `contract` module

**Payload:**
```
ContractCreated {
  ContractID     UUID
  WorkspaceID    UUID
  RoomID         UUID
  RenterID       UUID
  StartDate      Date
  EndDate        Date
  MonthlyRent    int64
  DepositAmount  int64
  CreatedAt      Timestamp
}
```

**Consumers:**
| Consumer | Action |
|---|---|
| `audit` (future) | Record creation in audit log |

---

### `ContractActivated`

**Trigger:** Contract status transitions from `DRAFT` → `ACTIVE`.

**Publisher:** `contract` module

**Payload:**
```
ContractActivated {
  ContractID   UUID
  WorkspaceID  UUID
  RoomID       UUID
  RenterID     UUID
  StartDate    Date
  EndDate      Date
  ActivatedAt  Timestamp
}
```

**Consumers:**
| Consumer | Action |
|---|---|
| `room` module | Update room status to `OCCUPIED` |
| `audit` (future) | Record activation event |

---

### `ContractTerminated`

**Trigger:** Workspace owner terminates a contract early.

**Publisher:** `contract` module

**Payload:**
```
ContractTerminated {
  ContractID         UUID
  WorkspaceID        UUID
  RoomID             UUID
  RenterID           UUID
  TerminationReason  string
  TerminatedAt       Timestamp
}
```

**Consumers:**
| Consumer | Action |
|---|---|
| `room` module | Update room status to `AVAILABLE` |
| `invoice` module | Mark any open invoices for this contract as `CANCELLED` |

---

### `ContractExpired`

**Trigger:** Scheduled job detects `end_date` has passed for an `ACTIVE` contract.

**Publisher:** `contract` module (scheduler)

**Payload:**
```
ContractExpired {
  ContractID   UUID
  WorkspaceID  UUID
  RoomID       UUID
  RenterID     UUID
  ExpiredAt    Timestamp
}
```

**Consumers:**
| Consumer | Action |
|---|---|
| `room` module | Update room status to `AVAILABLE` |
| `invoice` module | Mark any open invoices for this contract as `CANCELLED` |

---

### `InvoiceGenerated`

**Trigger:** A new invoice is created for a billing period.

**Publisher:** `invoice` module

**Payload:**
```
InvoiceGenerated {
  InvoiceID            UUID
  WorkspaceID          UUID
  ContractID           UUID
  RenterID             UUID
  AmountDue            int64
  BillingPeriodStart   Date
  BillingPeriodEnd     Date
  DueDate              Date
  CreatedAt            Timestamp
}
```

**Consumers:**
| Consumer | Action |
|---|---|
| `notification` (future) | Send invoice notification to renter |
| `audit` (future) | Record invoice creation |

---

### `InvoicePaid`

**Trigger:** Workspace owner marks an invoice as `PAID`.

**Publisher:** `invoice` module

**Payload:**
```
InvoicePaid {
  InvoiceID    UUID
  WorkspaceID  UUID
  ContractID   UUID
  RenterID     UUID
  AmountPaid   int64
  PaidAt       Timestamp
}
```

**Consumers:**
| Consumer | Action |
|---|---|
| `notification` (future) | Send payment confirmation to renter |
| `audit` (future) | Record payment event |

---

### `InvoiceOverdue`

**Trigger:** Scheduled job detects an invoice's `due_date` has passed while status is still `PENDING`.

**Publisher:** `invoice` module (scheduler)

**Payload:**
```
InvoiceOverdue {
  InvoiceID    UUID
  WorkspaceID  UUID
  ContractID   UUID
  RenterID     UUID
  AmountDue    int64
  DueDate      Date
  OverdueAt    Timestamp
}
```

**Consumers:**
| Consumer | Action |
|---|---|
| `notification` (future) | Alert workspace owner and renter of overdue invoice |

---

### `MaintenanceRequested`

**Trigger:** A new maintenance request is submitted.

**Publisher:** `maintenance` module

**Payload:**
```
MaintenanceRequested {
  RequestID    UUID
  WorkspaceID  UUID
  RoomID       UUID
  RenterID     UUID (nullable)
  SubmittedBy  UUID
  Title        string
  Priority     string
  CreatedAt    Timestamp
}
```

**Consumers:**
| Consumer | Action |
|---|---|
| `notification` (future) | Notify workspace owner of new request |
| `audit` (future) | Record submission |

---

### `MaintenanceStatusChanged`

**Trigger:** Workspace owner updates the status of a maintenance request.

**Publisher:** `maintenance` module

**Payload:**
```
MaintenanceStatusChanged {
  RequestID    UUID
  WorkspaceID  UUID
  RoomID       UUID
  OldStatus    string
  NewStatus    string
  ChangedAt    Timestamp
}
```

**Consumers:**
| Consumer | Action |
|---|---|
| `notification` (future) | Notify tenant of status change |

---

## Event Bus Contract

### Dispatch Model
- Events are dispatched **synchronously in-process** for MVP (simple observer pattern).
- Events are published **after** the primary database transaction commits — never inside a transaction.
- Use `shared/events.Bus` to publish. Never call event handler functions directly.

### Failure Handling & Retry Policy

Since events are published post-commit, a handler failure leaves state partially updated. The following policy applies:

**Retry strategy (in-process):**
- On handler error: retry up to **3 times** with exponential backoff: 100ms → 300ms → 900ms.
- After 3 failures: log at `ERROR` level with structured fields: `event_type`, `event_payload`, `error`, `attempt_count`.
- Emit a structured log entry tagged `"event_handler_failure"` for monitoring alerting.
- Do **not** propagate the error to the caller — the primary operation has already succeeded.

**Idempotency requirement:**
- All event handlers MUST be idempotent: running the same handler with the same event multiple times must produce the same result.
- Example: `RoomService.HandleContractActivated()` should check current room status before updating. If room is already `OCCUPIED`, it's a no-op — not an error.

**Passive safety net:**
- The `ContractExpiryJob` and `InvoiceOverdueJob` schedulers act as a consistency reconciler.
- Any inconsistency left by a failed handler (e.g., room still AVAILABLE after contract activation) will be visible in operational dashboards and correctable via a manual admin action (post-MVP).

### Future Migration Path
- Future phases may migrate to an async message broker (e.g., Redis Streams or NATS) without changing publisher interfaces.
- The `Bus` interface abstraction in `shared/events` is designed to be backed by either in-process or external brokers transparently.
