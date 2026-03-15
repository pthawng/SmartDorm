<div align="center">

# 🏠 SmartDorm

### Multi-Tenant SaaS Rental Management System

*A production-ready backend platform enabling landlords to manage properties, renters, contracts, invoices, and maintenance requests — all within isolated, workspace-based environments.*

[![Go Version](https://img.shields.io/badge/Go-1.25.6-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Gin](https://img.shields.io/badge/Gin-v1.10.1-008ECF?style=for-the-badge&logo=go&logoColor=white)](https://gin-gonic.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Contact](#-contact)

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Language** | Go | 1.25.6 |
| **HTTP Framework** | Gin | v1.10.1 |
| **Database** | PostgreSQL | 15 (Alpine) |
| **Cache / Session** | Redis | 7 (Alpine) |
| **DB Driver** | pgx/v5 + sqlx | v5.8.0 / v1.4.0 |
| **Migrations** | golang-migrate | v4.19.1 |
| **Authentication** | golang-jwt/jwt | v5.3.1 |
| **Scheduler** | robfig/cron | v3 |
| **Frontend** | Next.js + TailwindCSS + TanStack Query | — |
| **Containerization** | Docker Compose | — |
| **Deployment** | VPS | — |

---

## ✨ Key Features

### 🔐 Authentication & Identity
- Multi-context identity model — a single user can be a **landlord** in one workspace and a **renter** in another simultaneously
- Context-based JWT minting with scoped roles (`OWNER`, `MEMBER`, `TENANT`, `ADMIN`)
- Secure password hashing with `bcrypt` (cost ≥ 12)
- Rate limiting: `10 req/min` on login · `5 req/min` on registration · `300 req/min` on general API

### 🏢 Workspace Management
- Create and manage isolated workspaces (multi-tenancy enforced at the data layer)
- Full membership lifecycle: invite, role assignment, and removal
- Workspace-level data isolation via `workspace_id` scoping at every repository query

### 🏗️ Property & Room Management
- Full CRUD for properties and their nested rooms
- Real-time room availability tracking (`vacant` / `occupied`)
- Soft-delete support for safe data archiving

### 📝 Contract Lifecycle
- Structured state machine: `DRAFT → ACTIVE → EXPIRED / TERMINATED`
- Business rule enforcement: no overlapping active contracts per room
- Automated expiry detection via background scheduler

### 🧾 Invoice & Billing
- Invoice generation per billing period with configurable line items
- Monetary values stored as `int64` (smallest currency unit — eliminates float precision issues)
- Invoice state machine: `PENDING → PAID / OVERDUE / CANCELLED`
- Background job for automatic overdue detection

### 🔧 Maintenance Requests
- Renters submit requests through the dedicated Tenant Portal (`/me`)
- Landlords update and track resolution status end-to-end

### ⚙️ Background Scheduler
- `ContractExpiryJob` — runs **hourly**, auto-expires contracts past `end_date`
- `InvoiceOverdueJob` — runs **hourly**, marks unpaid invoices past `due_date` as `OVERDUE`
- Retry policy: exponential backoff `100ms → 300ms → 900ms` (max 3 attempts)

---

## 🏛 Architecture

SmartDorm follows a **Modular Monolith** pattern — a single deployable Go binary with strict internal domain boundaries enforced at the code level.

> **Why Modular Monolith?** It delivers the simplicity of a monolithic deployment while maintaining micro-service-like separation of concerns. This is ideal for the current MVP stage with a clear migration path toward microservices when scale demands it.

### 📁 Project Structure

```
SmartDorm/
├── docker-compose.yml                  # PostgreSQL + Redis service definitions
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go                 # Entry point & dependency injection wiring
│   ├── config/
│   │   └── config.go                   # Env-based configuration loader
│   ├── internal/                       # Core business domain modules
│   │   ├── auth/                       # Registration, login, JWT context minting
│   │   ├── workspace/                  # Workspace creation & membership management
│   │   ├── property/                   # Property CRUD
│   │   ├── room/                       # Room CRUD & availability tracking
│   │   ├── renter/                     # Renter profile management
│   │   ├── contract/                   # Rental contract lifecycle
│   │   ├── invoice/                    # Invoice generation & billing
│   │   ├── maintenance/                # Maintenance request tracking
│   │   └── scheduler/                  # Background cron jobs
│   ├── shared/                         # Cross-cutting infrastructure concerns
│   │   ├── errors/                     # Unified error types & codes
│   │   ├── events/                     # In-process domain event bus
│   │   ├── jwt/                        # JWT utilities
│   │   ├── logger/                     # Structured JSON logging (slog)
│   │   ├── middleware/                 # Auth, logging & rate-limit middlewares
│   │   ├── pagination/                 # Offset-based pagination helpers
│   │   └── response/                   # Unified HTTP response envelope
│   └── infrastructure/
│       ├── db/                         # PostgreSQL connection & stdlib adapter
│       ├── cache/                      # Redis connection
│       └── migrations/                 # SQL migration files (up/down)
└── .antigravity/                       # Project specification & AI agent context
```

### 🔄 Module Internal Layout

Every domain module follows an identical, consistent structure:

```
internal/<module>/
├── handler.go      # HTTP layer    — parse request → call service → write response
├── service.go      # Domain layer  — business logic & rule enforcement
├── repository.go   # Data layer    — parameterized SQL via pgx/v5 + sqlx
├── model.go        # Domain structs, enums, and entity types
├── dto.go          # Request / Response data transfer objects
├── events.go       # Domain event definitions & payloads
└── routes.go       # Route registration with middleware chains
```

### 🔑 Key Design Decisions

| Decision | Rationale |
|---|---|
| `int64` for all monetary values | Avoids float precision bugs; stores values in smallest currency unit (VND) |
| Raw SQL via `pgx/v5 + sqlx` — no ORM | Full query control, no N+1 surprises, predictable and auditable performance |
| Domain Events for cross-module calls | Decouples modules without creating circular service dependencies |
| Workspace-scoped multi-tenancy | All queries filtered by `workspace_id`; row-level tenant data isolation |
| Soft deletes via `deleted_at` | Preserves data history; enables safe audit trails without permanent loss |
| UUID v4 for all primary keys | Prevents ID enumeration attacks; globally unique across distributed systems |

---

## 🚀 Getting Started

### Prerequisites

Make sure the following tools are installed on your machine:

- [Go 1.22+](https://go.dev/dl/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [golang-migrate CLI](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/lephuocthang/SmartDorm.git
cd SmartDorm
```

### Step 2 — Start Infrastructure Services

Spin up PostgreSQL and Redis with a single command:

```bash
docker compose up -d
```

| Service | Container | Host Port |
|---|---|---|
| PostgreSQL 15 | `go_psql` | `5433` |
| Redis 7 | `go_redis` | `6380` |

Verify both services are healthy:

```bash
docker compose ps
```

### Step 3 — Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Open `.env` and set your values:

```env
# Application
ENV=development
PORT=8080

# Database — matches docker-compose.yml defaults
DATABASE_URL=postgres://postgres:password123@localhost:5433/smartdorm?sslmode=disable

# Cache
REDIS_URL=redis://localhost:6380/0

# Security — use a strong random string in production!
JWT_SECRET=your-strong-secret-key-here
```

> [!WARNING]
> **Never commit your `.env` file.** It is already in `.gitignore`. Always replace `JWT_SECRET` with a cryptographically random value before deploying to production.

### Step 4 — Run Database Migrations

```bash
# From the /backend directory
migrate -path infrastructure/migrations \
        -database "${DATABASE_URL}" \
        up
```

### Step 5 — Install Dependencies & Start the Server

```bash
# From the /backend directory
go mod download
go run cmd/api/main.go
```

The API server starts at **`http://localhost:8080`**

```
{"level":"INFO","msg":"SmartDorm API starting","port":8080,"env":"development"}
```

---

## 📡 API Endpoints

All routes are versioned under `/api/v1/`. Every response follows a **unified envelope**:

```json
{
  "success": true,
  "data": { },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

> [!NOTE]
> **Authentication**: Protected routes (`✅`) require the HTTP header `Authorization: Bearer <token>`.
> Obtain a scoped token by calling `POST /api/v1/auth/token` after logging in.

---

### 🔐 Auth

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/v1/auth/register` | ❌ | Register a new user account |
| `POST` | `/api/v1/auth/login` | ❌ | Login & receive available workspace contexts |
| `POST` | `/api/v1/auth/token` | ❌ | Mint a scoped JWT for a specific context |
| `GET` | `/api/v1/auth/me` | ✅ | Get current authenticated user profile |

### 🏢 Workspaces

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/v1/workspaces` | ✅ | Create a new workspace |
| `GET` | `/api/v1/workspaces` | ✅ | List all workspaces the user belongs to |

### 🏗️ Properties

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/v1/properties` | ✅ | List all properties *(paginated)* |
| `POST` | `/api/v1/properties` | ✅ | Create a new property |
| `GET` | `/api/v1/properties/:id` | ✅ | Get a single property |
| `PUT` | `/api/v1/properties/:id` | ✅ | Update a property |
| `DELETE` | `/api/v1/properties/:id` | ✅ | Soft-delete a property |

### 🚪 Rooms

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/v1/properties/:property_id/rooms` | ✅ | List rooms within a property |
| `POST` | `/api/v1/properties/:property_id/rooms` | ✅ | Add a room to a property |
| `GET` | `/api/v1/rooms/:id` | ✅ | Get a single room |
| `PUT` | `/api/v1/rooms/:id` | ✅ | Update room details |
| `DELETE` | `/api/v1/rooms/:id` | ✅ | Soft-delete a room |

### 👥 Renters

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/v1/renters` | ✅ | List all renters *(paginated)* |
| `POST` | `/api/v1/renters` | ✅ | Create a renter profile |
| `GET` | `/api/v1/renters/:id` | ✅ | Get a single renter |
| `PUT` | `/api/v1/renters/:id` | ✅ | Update renter details |
| `DELETE` | `/api/v1/renters/:id` | ✅ | Soft-delete a renter |

### 📝 Contracts

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/v1/contracts` | ✅ | List contracts *(paginated, filterable)* |
| `POST` | `/api/v1/contracts` | ✅ | Create a contract *(DRAFT state)* |
| `GET` | `/api/v1/contracts/:id` | ✅ | Get a single contract |
| `PUT` | `/api/v1/contracts/:id` | ✅ | Update a contract *(DRAFT only)* |
| `POST` | `/api/v1/contracts/:id/activate` | ✅ | Activate a draft contract |
| `POST` | `/api/v1/contracts/:id/terminate` | ✅ | Terminate an active contract |

### 🧾 Invoices

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/v1/invoices` | ✅ | List invoices *(paginated, filterable)* |
| `POST` | `/api/v1/invoices` | ✅ | Generate an invoice for a billing period |
| `GET` | `/api/v1/invoices/:id` | ✅ | Get a single invoice |
| `POST` | `/api/v1/invoices/:id/mark-paid` | ✅ | Mark an invoice as paid |
| `POST` | `/api/v1/invoices/:id/cancel` | ✅ | Cancel an invoice |

### 🔧 Maintenance

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/v1/maintenance` | ✅ | List all maintenance requests |
| `POST` | `/api/v1/maintenance` | ✅ | Submit a new maintenance request |
| `GET` | `/api/v1/maintenance/:id` | ✅ | Get a single request |
| `PUT` | `/api/v1/maintenance/:id/status` | ✅ | Update request status |

### 👤 Tenant Portal *(TENANT role required)*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/me/profile` | Get own renter profile |
| `GET` | `/api/v1/me/contracts` | List own active & expired contracts |
| `GET` | `/api/v1/me/contracts/:id` | Get a single own contract |
| `GET` | `/api/v1/me/invoices` | List own invoices |
| `GET` | `/api/v1/me/invoices/:id` | Get a single own invoice |
| `POST` | `/api/v1/me/maintenance` | Submit a maintenance request |
| `GET` | `/api/v1/me/maintenance` | List own maintenance requests |
| `GET` | `/api/v1/me/maintenance/:id` | Get a single own maintenance request |

---

## 📬 Contact

<div align="center">

**Lê Phước Thắng**
*Backend Developer*

[![GitHub](https://img.shields.io/badge/GitHub-lephuocthang-181717?style=for-the-badge&logo=github)](https://github.com/pthawng)
[![Email](https://img.shields.io/badge/Email-Contact%20Me-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:lephuocthang207@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/le-phuoc-thang-99b4a8255/)

</div>

---

<div align="center">

*Built with ❤️ using Go · PostgreSQL · Redis · Docker*

</div>
