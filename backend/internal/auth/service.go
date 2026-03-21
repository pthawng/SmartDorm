package auth

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"smartdorm/shared/audit"
	apperr "smartdorm/shared/errors"
	"smartdorm/shared/jwt"
)

// Service defines the business logic interfaces
type Service interface {
	Register(ctx context.Context, req RegisterRequest) (*UserResponse, error)
	Login(ctx context.Context, req LoginRequest) (*LoginResponse, error)
	SwitchContext(ctx context.Context, req TokenRequest, userID uuid.UUID) (*TokenResponse, error)
	GetUser(ctx context.Context, userID uuid.UUID, role string) (*UserResponse, error)
	Refresh(ctx context.Context, refreshToken string) (*TokenResponse, error)
	Logout(ctx context.Context, refreshToken string) error
}

type service struct {
	repo      Repository
	jwtIssuer *jwt.Issuer
}

func NewService(repo Repository, jwtIssuer *jwt.Issuer) Service {
	return &service{
		repo:      repo,
		jwtIssuer: jwtIssuer,
	}
}

func (s *service) Register(ctx context.Context, req RegisterRequest) (*UserResponse, error) {
	// Check if user exists
	existing, err := s.repo.GetUserByEmail(ctx, req.Email)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, apperr.NewInternal(err, "database error querying user")
	}
	if existing != nil {
		return nil, apperr.NewConflict("Email already registered")
	}

	// Hash password (cost 12 per security.md)
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to hash password")
	}

	// Create User
	user, err := s.repo.CreateUser(ctx, req.Email, string(hash), req.FullName, req.Phone)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to create user")
	}

	// Phase 1: Issue Refresh Token on Register
	rt, err := s.jwtIssuer.GenerateRefreshToken(user.ID)
	var refreshToken string
	if err == nil {
		rtID := uuid.New()
		exp := time.Now().Add(7 * 24 * time.Hour)
		// Default to TENANT context on register
		err = s.repo.StoreRefreshToken(ctx, rtID, user.ID, rt, exp, jwt.RoleTenant, nil, nil, user.SecurityStamp)
		if err == nil {
			refreshToken = rt
		}
	}

	return &UserResponse{
		ID:           user.ID,
		Email:        user.Email,
		FullName:     user.FullName,
		Phone:        user.Phone,
		Role:         string(jwt.RoleTenant),
		RefreshToken: refreshToken,
	}, nil
}

func (s *service) Login(ctx context.Context, req LoginRequest) (*LoginResponse, error) {
	// Find user
	user, err := s.repo.GetUserByEmail(ctx, req.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewUnauthorized("Invalid email or password")
		}
		return nil, apperr.NewInternal(err, "database error querying user")
	}

	if !user.IsActive {
		return nil, apperr.NewForbidden("Account is disabled")
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, apperr.NewUnauthorized("Invalid email or password")
	}

	// Fetch all contexts
	dbContexts, err := s.repo.GetUserContexts(ctx, user.ID)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to build user contexts")
	}

	// Map generic contexts payload
	contexts := make([]ContextPayload, 0)

	// Senior Logic: Always include fallback TENANT context
	contexts = append(contexts, ContextPayload{
		Type: "renter", // RoleTenant context
	})

	for _, w := range dbContexts.Workspaces {
		wsID := w.WorkspaceID
		wsName := w.WorkspaceName
		wsRole := w.Role
		contexts = append(contexts, ContextPayload{
			Type:           "workspace",
			WorkspaceID:    &wsID,
			WorkspaceName:  &wsName,
			MembershipRole: &wsRole,
		})
	}

	for _, r := range dbContexts.Renters {
		rID := r.RenterID
		wsName := r.WorkspaceName
		contexts = append(contexts, ContextPayload{
			Type:          "renter",
			RenterID:      &rID,
			WorkspaceName: &wsName,
		})
	}

	for _, a := range dbContexts.Admins {
		aRole := a.Role
		contexts = append(contexts, ContextPayload{
			Type:      "admin",
			AdminRole: &aRole,
		})
	}

	// Map response
	resp := &LoginResponse{
		User: UserResponse{
			ID:       user.ID,
			Email:    user.Email,
			FullName: user.FullName,
			Phone:    user.Phone,
			Role:     string(jwt.RoleTenant),
		},
		Contexts: contexts,
	}

	// Phase 1: Issue Refresh Token on Login
	rt, err := s.jwtIssuer.GenerateRefreshToken(user.ID)
	if err == nil {
		rtID := uuid.New()
		// 7 days expiration for RT
		exp := time.Now().Add(7 * 24 * time.Hour)
		// Default to TENANT context on login
		err = s.repo.StoreRefreshToken(ctx, rtID, user.ID, rt, exp, jwt.RoleTenant, nil, nil, user.SecurityStamp)
		if err == nil {
			resp.RefreshToken = rt
		}
	}

	return resp, nil
}

func (s *service) SwitchContext(ctx context.Context, req TokenRequest, userID uuid.UUID) (*TokenResponse, error) {
	// Senior Logic: Explicit Rule - workspace_id == null -> TENANT
	if req.ContextType == "renter" || (req.ContextType == "workspace" && req.WorkspaceID == nil) {
		u, err := s.repo.GetUserByID(ctx, userID)
		if err != nil {
			return nil, apperr.NewInternal(err, "failed to verify user identity")
		}
		token, err := s.jwtIssuer.GenerateTenantToken(userID, u.SecurityStamp)

		// Audit Log: Switch Role
		audit.LogMutation(ctx, userID, audit.ActionSwitch, "AUTH", "TENANT", nil)

		return s.buildTokenResponse(ctx, userID, token, "TENANT", nil, nil, u.SecurityStamp)
	}

	switch req.ContextType {
	case "workspace":
		// MUST CHECK: Strict Membership Validation (Issue 2.1)
		m, err := s.repo.GetMembership(ctx, userID, *req.WorkspaceID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return nil, apperr.NewForbidden("Access denied", "Not a member of this workspace")
			}
			return nil, apperr.NewInternal(err, "failed to verify workspace membership")
		}

		u, err := s.repo.GetUserByID(ctx, userID)
		if err != nil {
			return nil, apperr.NewInternal(err, "failed to verify user identity")
		}

		token, err := s.jwtIssuer.GenerateLandlordToken(userID, *req.WorkspaceID, m.Role, u.SecurityStamp)
		if err != nil {
			return nil, apperr.NewInternal(err, "failed to mint landlord token")
		}

		// Audit Log: Switch Role
		audit.LogMutation(ctx, userID, audit.ActionSwitch, "AUTH", "LANDLORD", req.WorkspaceID)

		return s.buildTokenResponse(ctx, userID, token, "LANDLORD", req.WorkspaceID, &m.Role, u.SecurityStamp)

	case "admin":
		return nil, apperr.NewForbidden("Restricted access", "Admin portal restricted")

	default:
		return nil, apperr.NewValidation(map[string]string{"context_type": "Invalid context type"})
	}
}

// Helper to avoid DRY in MintToken and potentially Refresh
func (s *service) buildTokenResponse(ctx context.Context, userID uuid.UUID, token string, role string, wsID *uuid.UUID, membershipRole *string, securityStamp uuid.UUID) (*TokenResponse, error) {
	user, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to fetch user for response")
	}

	expiresAt := time.Now().Add(1 * time.Hour).Format(time.RFC3339)

	resp := &TokenResponse{
		User: UserResponse{
			ID:       user.ID,
			Email:    user.Email,
			FullName: user.FullName,
			Phone:    user.Phone,
			Role:     role,
		},
		AccessToken: token,
		ExpiresAt:   expiresAt,
		Context: &TokenResponseContext{
			Type:           role,
			WorkspaceID:    wsID,
			MembershipRole: membershipRole,
		},
	}

	// Rotation: Renew Refresh Token with the NEW active context snapshot
	rt, err := s.jwtIssuer.GenerateRefreshToken(userID)
	if err == nil {
		rtID := uuid.New()
		exp := time.Now().Add(7 * 24 * time.Hour)
		err = s.repo.StoreRefreshToken(ctx, rtID, userID, rt, exp, role, wsID, nil, securityStamp)
		if err == nil {
			resp.RefreshToken = rt
		}
	}

	return resp, nil
}

func (s *service) GetUser(ctx context.Context, userID uuid.UUID, role string) (*UserResponse, error) {
	user, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewNotFound("User", userID.String())
		}
		return nil, apperr.NewInternal(err, "database error querying user by id")
	}
	return &UserResponse{
		ID:       user.ID,
		Email:    user.Email,
		FullName: user.FullName,
		Phone:    user.Phone,
		Role:     role,
	}, nil
}

func (s *service) Refresh(ctx context.Context, refreshToken string) (*TokenResponse, error) {
	// 1. Verify token in DB
	rt, err := s.repo.GetRefreshToken(ctx, refreshToken)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, apperr.NewUnauthorized("Invalid refresh token")
		}
		return nil, apperr.NewInternal(err, "failed to query refresh token")
	}

	// 2. Check expiration
	if time.Now().After(rt.ExpiresAt) {
		s.repo.DeleteRefreshToken(ctx, rt.ID)
		return nil, apperr.NewUnauthorized("Refresh token expired")
	}

	// NEW: Security Stamp Validation (Issue: Global Revocation)
	user, err := s.repo.GetUserByID(ctx, rt.UserID)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to verify user during refresh")
	}
	if user.SecurityStamp != rt.SecurityStamp {
		s.repo.DeleteUserRefreshTokens(ctx, rt.UserID) // Nuke all sessions for safety
		return nil, apperr.NewUnauthorized("Security context changed. Please login again.")
	}

	// Senior Logic: Re-validate membership if in LANDLORD context (Issue 2.3)
	if rt.ActiveRole == jwt.RoleLandlord && rt.WorkspaceID != nil {
		_, err := s.repo.GetMembership(ctx, rt.UserID, *rt.WorkspaceID)
		if err != nil {
			// If membership is gone, demote to TENANT instead of failing?
			// For strict production safety: Fail and force re-login/re-switch.
			return nil, apperr.NewForbidden("Stale context", "Workspace membership no longer valid")
		}
	}

	// 3. Generate NEW Access Token (Restoring context from Snapshot)
	var newAT string
	switch rt.ActiveRole {
	case jwt.RoleLandlord:
		if rt.WorkspaceID != nil {
			// In context snapshot, we should ideally store and restore membership role too.
			// For now, re-fetch it to ensure it's still current (Issue 2.3)
			m, err := s.repo.GetMembership(ctx, rt.UserID, *rt.WorkspaceID)
			if err != nil {
				return nil, apperr.NewForbidden("Stale context", "Workspace membership no longer valid")
			}
			newAT, err = s.jwtIssuer.GenerateLandlordToken(rt.UserID, *rt.WorkspaceID, m.Role, user.SecurityStamp)
		} else {
			// Fallback to tenant if landlord context is broken
			newAT, err = s.jwtIssuer.GenerateTenantToken(rt.UserID, user.SecurityStamp)
		}
	case jwt.RoleTenant:
		newAT, err = s.jwtIssuer.GenerateTenantToken(rt.UserID, user.SecurityStamp)
	default:
		newAT, err = s.jwtIssuer.GenerateTenantToken(rt.UserID, user.SecurityStamp)
	}

	if err != nil {
		return nil, apperr.NewInternal(err, "failed to generate access token")
	}

	// 4. Rotation: Generate NEW Refresh Token
	newRT, err := s.jwtIssuer.GenerateRefreshToken(rt.UserID)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to generate refresh token")
	}

	// 5. Update DB: Delete OLD, Store NEW (Carry over context)
	s.repo.DeleteRefreshToken(ctx, rt.ID)

	newRTID := uuid.New()
	newExp := time.Now().Add(7 * 24 * time.Hour)
	err = s.repo.StoreRefreshToken(ctx, newRTID, rt.UserID, newRT, newExp, rt.ActiveRole, rt.WorkspaceID, rt.DeviceID, user.SecurityStamp)
	if err != nil {
		return nil, apperr.NewInternal(err, "failed to store new refresh token")
	}

	// User info is already fetched above

	expiresAt := time.Now().Add(1 * time.Hour).Format(time.RFC3339)

	return &TokenResponse{
		User: UserResponse{
			ID:       user.ID,
			Email:    user.Email,
			FullName: user.FullName,
			Phone:    user.Phone,
			Role:     rt.ActiveRole,
		},
		AccessToken:  newAT,
		RefreshToken: newRT,
		ExpiresAt:    expiresAt,
		Context: &TokenResponseContext{
			Type:        rt.ActiveRole,
			WorkspaceID: rt.WorkspaceID,
		},
	}, nil
}

func (s *service) Logout(ctx context.Context, refreshToken string) error {
	rt, err := s.repo.GetRefreshToken(ctx, refreshToken)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil // Already logged out or invalid
		}
		return apperr.NewInternal(err, "failed to query refresh token during logout")
	}

	return s.repo.DeleteRefreshToken(ctx, rt.ID)
}
