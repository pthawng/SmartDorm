package auth

import "smartdorm/shared/jwt"

// Permission represents a fine-grained access right
type Permission string

const (
	// Property permissions
	PropertyCreate Permission = "property:create"
	PropertyRead   Permission = "property:read"
	PropertyUpdate Permission = "property:update"
	PropertyDelete Permission = "property:delete"

	// Room permissions
	RoomCreate Permission = "room:create"
	RoomRead   Permission = "room:read"
	RoomUpdate Permission = "room:update"
	RoomDelete Permission = "room:delete"

	// Contract permissions
	ContractView   Permission = "contract:view"
	ContractApply  Permission = "contract:apply"
	ContractSign   Permission = "contract:sign"
	ContractManage Permission = "contract:manage"

	// Invoice/Payment permissions
	InvoiceView Permission = "invoice:view"
	InvoicePay  Permission = "invoice:pay"
	InvoiceEdit Permission = "invoice:edit"
)

// RolePermissions maps a Role to its allowed permissions
var RolePermissions = map[string][]Permission{
	jwt.RoleLandlord: {
		PropertyCreate, PropertyRead, PropertyUpdate, PropertyDelete,
		RoomCreate, RoomRead, RoomUpdate, RoomDelete,
		ContractView, ContractManage, ContractSign,
		InvoiceView, InvoiceEdit,
	},
	jwt.RoleTenant: {
		PropertyRead,
		RoomRead,
		ContractView, ContractApply, ContractSign,
		InvoiceView, InvoicePay,
	},
	jwt.RoleAdmin: {
		// Super admins have all permissions (or special handling)
	},
}

// HasPermission check if a role has a specific permission
func HasPermission(role string, perm Permission) bool {
	perms, ok := RolePermissions[role]
	if !ok {
		// Secure Fallback: Deny if role is undefined
		return false
	}
	for _, p := range perms {
		if p == perm {
			return true
		}
	}
	return false
}
