# Tech Stack Specification

**Project**: SmartDorm Frontend
**Context**: Modern, Scalable React Architecture

---

## 🛠 Core Framework & Language
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
  - *Why*: Lightning-fast HMR (Hot Module Replacement) and optimized build times compared to Webpack.
- **Language**: [TypeScript](https://www.typescriptlang.org/)
  - *Why*: Strict typing to synchronize Interfaces with the Backend Domain Layer (IA) and prevent runtime errors.

## 🎨 Styling & UI
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
  - *Why*: Utility-first approach for rapid UI development and seamless compatibility with MCP Stitch.

## 📦 State Management
- **Server State**: [TanStack Query](https://tanstack.com/query/latest) (v5+)
  - *Capabilities*: Data fetching, automatic caching, revalidation, and loading/error state handling for Go API integration.
- **Client State**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
  - *Why*: Lightweight and boilerplate-free state management. Perfectly suited for feature-encapsulated logic.

## 📝 Form & Validation
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
  - *Why*: Performance-focused form management with minimal re-renders.
- **Validation**: [Zod](https://zod.dev/)
  - *Why*: Schema-first validation that integrates directly with TypeScript and React Hook Form.

## 🌐 Networking
- **Client**: [Axios](https://axios-http.com/) or Fetch API
  - *Interceptors*: Global handling for JWT insertion (Workspace Context) and 401/403 errors.

## 🚥 Routing
- **Library**: [React Router](https://reactrouter.com/) (v6+) or TanStack Router
  - *Implementation*: Breadcrumbs, protected routes (RBAC), and lazy-loading for performance.
