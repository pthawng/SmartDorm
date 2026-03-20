package auth

import "github.com/google/uuid"

// --- Requests ---

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email,max=255"`
	Password string `json:"password" binding:"required,min=8"`
	FullName string `json:"full_name" binding:"required,max=255"`
	Phone    string `json:"phone" binding:"omitempty,max=20"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type TokenRequest struct {
	ContextType string     `json:"context_type" binding:"required,oneof=workspace renter admin"`
	WorkspaceID *uuid.UUID `json:"workspace_id" binding:"omitempty"`
	RenterID    *uuid.UUID `json:"renter_id" binding:"omitempty"`
	AdminRole   *string    `json:"admin_role" binding:"omitempty"`
}

// --- Responses ---

type UserResponse struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	FullName     string    `json:"full_name"`
	Phone        *string   `json:"phone,omitempty"`
	RefreshToken string    `json:"-"` // Internal use for setting cookie
}

type LoginResponse struct {
	User         UserResponse     `json:"user"`
	Contexts     []ContextPayload `json:"contexts"`
	RefreshToken string           `json:"-"` // Internal use for setting cookie
}

type ContextPayload struct {
	Type           string     `json:"type"` // "workspace", "renter", "admin"
	WorkspaceID    *uuid.UUID `json:"workspace_id,omitempty"`
	WorkspaceName  *string    `json:"workspace_name,omitempty"`
	MembershipRole *string    `json:"membership_role,omitempty"`
	RenterID       *uuid.UUID `json:"renter_id,omitempty"`
	AdminRole      *string    `json:"admin_role,omitempty"`
}

type TokenResponse struct {
	User         UserResponse          `json:"user"`
	AccessToken  string                `json:"accessToken"`
	RefreshToken string                `json:"-"` // Internal use for setting cookie
	ExpiresAt    string                `json:"expiresAt"`
	Context      *TokenResponseContext `json:"context,omitempty"`
}

type TokenResponseContext struct {
	Type           string     `json:"type"`
	WorkspaceID    *uuid.UUID `json:"workspace_id,omitempty"`
	MembershipRole *string    `json:"membership_role,omitempty"`
	RenterID       *uuid.UUID `json:"renter_id,omitempty"`
	AdminRole      *string    `json:"admin_role,omitempty"`
}
