package policy


// CanManageProperty checks if a user has management rights over a property
// Logic: User's active workspace must match the property's workspace.
func CanManageProperty(activeWorkspaceID, propertyWorkspaceID string) bool {
	return activeWorkspaceID == propertyWorkspaceID
}

// CanViewContract checks if a user is allowed to see a contract
func CanViewContract(userID, activeWorkspaceID, activeRole, contractRenterID, contractWorkspaceID string) bool {
	if activeRole == "LANDLORD" {
		return contractWorkspaceID == activeWorkspaceID
	}
	return contractRenterID == userID
}

// CanSignContract checks if a tenant can sign a specific contract
func CanSignContract(userID, contractRenterID, status string) bool {
	return userID == contractRenterID && status == "PENDING_SIGNATURE"
}
