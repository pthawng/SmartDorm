<div align="center">

# 🏠 SmartDorm

### Multi-Tenant SaaS Rental Management System

*A production-ready full-stack platform enabling landlords to manage properties, renters, contracts, invoices, and maintenance requests — all within isolated, workspace-based environments.*

[![Go Version](https://img.shields.io/badge/Go-1.25.6-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Gin](https://img.shields.io/badge/Gin-v1.10.1-008ECF?style=for-the-badge&logo=go&logoColor=white)](https://gin-gonic.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
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

### Backend
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

### Frontend
| Layer | Technology | Status |
|---|---|---|
| **Framework** | React 18 + Vite 6 | Core |
| **Language** | TypeScript | Type Safety |
| **Styling** | TailwindCSS + Vanilla CSS | Modern UI |
| **Icons** | Lucide-React | Premium Icons |
| **Navigation** | React Router v7 | SPA Routing |
| **API Client** | Axios | Integrated |

---

## ✨ Key Features

### 🔐 Authentication & Identity
- **Multi-context model**: One account can be a Landlord and a Tenant in different workspaces.
- **Pixel-Perfect Auth UI**: Custom-designed Login and Signup pages with social login support.

### 🌐 Public Portal
- **Heroic Landing Page**: High-conversion design with property search and community highlights.
- **Explore Housing**: Search and filter properties by price, city, room type, and amenities.
- **Property Details**: Rich view with image galleries, detailed specs, and a premium booking widget.

### 👥 Student Community
- **Community Feed**: Interactive feed with categories (Announcements, Study Groups, Marketplace).
- **Post Interaction**: Like, comment, share, and bookmark functionality.
- **Trending Sidebar**: Stay updated with community rules and upcoming events.

### 👔 Dashboards
- **Landlord Portal**: Portfolio overview, revenue charts, occupancy trends, and property management.
- **Tenant Portal**: Personal stay overview, unit details, rent payments, and maintenance tracking.

### 🏗️ Management (Backend)
- **Workspaces**: Isolated data layers via `workspace_id` scoping.
- **Contracts**: Automated expiry detection and state machine lifecycle.
- **Invoices**: Background overdue detection and precise integer-based monetary values.

---

## 🏛 Architecture

### Backend: Modular Monolith
Strict internal domain boundaries enforced at the code layer. Each module contains its own `handler`, `service`, `repository`, and `model`.

### Frontend: Feature + Domain Architecture
Inspired by Feature-Sliced Design to ensure scalability and maintainability.
- `src/features/`: Complex modules organized by business domain (auth, community, explore, dashboard).
- `src/pages/`: Thin route containers.
- `src/domain/`: Pure data types and business entities.
- `src/shared/`: Reusable UI components, API clients, and utilities.

---

## 🚀 Getting Started

### Backend Setup
1. `cd backend`
2. `docker compose up -d` (PostgreSQL + Redis)
3. `cp .env.example .env` (Configure DB/JWT)
4. `migrate -path infrastructure/migrations -database "$DATABASE_URL" up`
5. `go run cmd/api/main.go`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Visit `http://localhost:5173`

---

## 📡 API Endpoints (v1)
Full documentation available for Auth, Workspaces, Properties, Rooms, Renters, Contracts, Invoices, and Maintenance. Check the `backend/README.md` for specific endpoint tables.

---

## 📬 Contact

<div align="center">

**Lê Phước Thắng**
*Full Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-lephuocthang-181717?style=for-the-badge&logo=github)](https://github.com/pthawng)
[![Email](https://img.shields.io/badge/Email-Contact%20Me-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:lephuocthang207@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/le-phuoc-thang-99b4a8255/)

*Built with ❤️ using Go · React · Vite · PostgreSQL · Redis · Docker*

</div>
