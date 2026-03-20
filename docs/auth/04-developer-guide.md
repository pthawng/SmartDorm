# Developer Guide: Using Authorization

## 🛠️ Protecting Routes
Most development tasks involve protecting new API endpoints. Use the standard middleware chain:

### 1. Require Authenticated Role
Ensures the user has the correct active role.
```go
v1.POST("/properties", 
    middleware.RequireRole(jwt.RoleLandlord),
    middleware.RequireWorkspaceContext(), // Landlords MUST select a workspace
    handler.CreateProperty)
```

### 2. Require Specific Permission
Fine-grained control for specific actions.
```go
v1.PUT("/properties/:id", 
    middleware.RequirePermission(auth.PropertyUpdate),
    handler.UpdateProperty)
```

## 🧠 Using Policies (Business Logic)
Permissions only check "Can the role do this?". **Policies** check "Can THIS user do this to THIS specific object?".

```go
// internal/property/handler.go
if !policy.CanManageProperty(activeWorkspaceID, property.WorkspaceID) {
    response.Error(c, errors.NewForbidden("Ownership required", "Property belongs to another workspace"))
    return
}
```

## 📝 Enriching Error Responses
When denying access, always provide a **Reason** to help the frontend developer (and the recruiter) debug:

```go
errors.NewForbidden("Insufficient permissions", "Missing permission: property:create")
```

### 🛡️ Forcing a Global Logout
If you implement a feature that requires invalidating all sessions (like password reset), use the repository's `UpdateSecurityStamp(userID)` method. This will instantly break all existing refresh tokens for that user.

## ➕ Adding a New Permission
1.  Add the constant in `shared/auth/permissions.go`.
2.  Add it to the relevant roles in the `RolePermissions` map.
3.  Use it in your routes via `middleware.RequirePermission`.
