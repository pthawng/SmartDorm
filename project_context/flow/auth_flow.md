# Authentication Flow Specification (AT + RT)

This document outlines the production-grade authentication and authorization flow used in SmartDorm, utilizing short-lived **Access Tokens (AT)** and long-lived **Refresh Tokens (RT)** with rotation.

## 1. Architectural Overview

| Component | Storage | Purpose | Security |
| :--- | :--- | :--- | :--- |
| **Access Token (AT)** | Memory (JS State) | Scoped API authorization | Short-lived (15m), protected from XSS. |
| **Refresh Token (RT)** | HttpOnly Cookie | Session maintenance | Secure, HttpOnly, SameSite=Lax, Path-restricted. |
| **User State** | Zustand Store | UI reactivity | Hydrated via `hydrateAuth()` method. |

---

## 2. Authentication Flows

### 2.1 Initial Login & Context Selection
Requires credential verification followed by a scoped context choice.

```mermaid
sequenceDiagram
    participant Client as Frontend (React)
    participant Server as Backend (Go)
    participant DB as Database (Postgres)

    Note over Client, DB: (1) Initial Login
    Client->>Server: POST /auth/login (email, password)
    Server->>DB: Verify credentials
    Server->>DB: Create Refresh Token Record
    Server-->>Client: Set-Cookie: refreshToken (HttpOnly)<br/>Return { user, contexts }
    
    Note over Client, DB: (2) Context Selection
    Client->>Server: POST /auth/token (context_type, id)
    Server->>Server: Generate Scoped AT (15m)
    Server->>DB: Rotate RT (Delete old, Create new)
    Server-->>Client: Set-Cookie: refreshToken (updated)<br/>Return { accessToken, expiresAt, context }
    Client->>Client: Store AT in Memory (Zustand)
```

### 2.2 Automatic Login after Registration
Registration immediately issues a session cookie, followed by a silent refresh to get the Access Token.

```mermaid
sequenceDiagram
    participant Client as Frontend (useRegister)
    participant Store as Auth Store (hydrateAuth)
    participant Server as Backend (Go)

    Client->>Server: POST /auth/register (user info)
    Server->>Server: Create User
    Server->>Server: Set-Cookie: refreshToken (HttpOnly)
    Server-->>Client: 201 Created { user }
    
    Note right of Client: Trigger hydrateAuth()
    
    Client->>Store: hydrateAuth()
    Store->>Server: POST /auth/refresh (Sends Cookie)
    Server-->>Store: 200 OK { accessToken, user }
    Store->>Store: setAuth(user, token)
    Client->>Client: Redirect to /dashboard
```

### 2.3 Token Refresh Flow (Queued)
Handles AT expiration seamlessly via an Axios interceptor with a wait-queue.

```mermaid
sequenceDiagram
    participant Client as Interceptor
    participant Server as Backend (/auth/refresh)
    participant DB as Postgres

    Client->>Server: API Request (401 Expired)
    Note right of Client: Interceptor locks (isRefreshing=true)
    
    par Queueing
        Note right of Client: Other requests wait in queue
    end

    Client->>Server: POST /auth/refresh
    Server->>DB: Rotate Token (OLD -> NEW)
    Server-->>Client: 200 OK { accessToken }
    
    Note right of Client: Release queue & retry original requests
```

### 2.4 Silent Refresh (App Reload)
Ensures the session persists across page reloads without storing the AT in `localStorage`.

```mermaid
flowchart TD
    Start([App Mount / Reload]) --> CheckAT{Has Access Token?}
    CheckAT -- Yes --> Verify[Call /auth/me to verify]
    CheckAT -- No --> Refresh[Call /auth/refresh]
    Refresh -- 200 Success --> UpdateState[Update Zustand: setAuth]
    Refresh -- 401 Fail --> Logout[Stay Unauthenticated / Show Login]
```

### 2.5 Secure Logout
Revokes the session on both the client (cookie clear) and server (DB record deletion).

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant Server as Backend (/auth/logout)
    
    Client->>Server: POST /auth/logout (Sends Cookie)
    Server->>Server: Delete RT from Database
    Server-->>Client: Set-Cookie: refreshToken (Max-Age: 0)
    Client->>Client: Clear Zustand state & Memory AT
```

---

## 3. Security Implementation Details

### 3.1 Token Rotation & Reuse Detection
Whenever a `refreshToken` is used, the backend invalidates it and issues a new one.
- **Breach Detection**: If an old (used) RT is presented, the server revokes **all** active sessions for that user to mitigate potential leaks.

### 3.2 HttpOnly Cookie Configuration
The `refreshToken` is never accessible via JavaScript, mitigating **XSS** risks.

### 3.3 Memory Isolation
The `accessToken` is stored in the `authStore` (Zustand) and **explicitly excluded** from the persistence layer (`localStorage`).

---

## 4. Error Handling & Fallbacks

- **401 Unauthorized**: Handled by interceptor. Triggers refresh.
- **403 Forbidden**: Token valid, but insufficient permissions/context.
- **Refresh Failed**: Full logout triggered, redirect to `/login`.
