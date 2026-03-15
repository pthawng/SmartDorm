package auth

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
	"github.com/google/uuid"

	"smartdorm/shared/jwt"
	apperr "smartdorm/shared/errors"
)

// Service defines the business logic interfaces
type Service interface {
	Register(ctx context.Context, req RegisterRequest) (*UserResponse, error)
	Login(ctx context.Context, req LoginRequest) (*LoginResponse, error)
	MintToken(ctx context.Context, req TokenRequest, userID uuid.UUID) (*TokenResponse, error)
	GetUser(ctx context.Context, userID uuid.UUID) (*UserResponse, error)
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

	return &UserResponse{
		ID:       user.ID,
		Email:    user.Email,
		FullName: user.FullName,
		Phone:    user.Phone,
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
	// Default to empty slice instead of nil for JSON consistency
	contexts := make([]ContextPayload, 0)

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
	return &LoginResponse{
		User: UserResponse{
			ID:       user.ID,
			Email:    user.Email,
			FullName: user.FullName,
			Phone:    user.Phone,
		},
		Contexts: contexts,
	}, nil
}

func (s *service) MintToken(ctx context.Context, req TokenRequest, userID uuid.UUID) (*TokenResponse, error) {
	var token string
	contextResp := TokenResponseContext{
		Type: req.ContextType,
	}

	switch req.ContextType {
	case "workspace":
		if req.WorkspaceID == nil {
			return nil, apperr.NewValidation(map[string]string{"workspace_id": "Required when type is workspace"})
		}
		// Verify membership
		m, err := s.repo.GetMembership(ctx, userID, *req.WorkspaceID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return nil, apperr.NewForbidden("Not a member of this workspace")
			}
			return nil, apperr.NewInternal(err, "failed to verify workspace membership")
		}
		token, err = s.jwtIssuer.GenerateLandlordToken(userID, *req.WorkspaceID, m.Role)
		if err != nil {
			return nil, apperr.NewInternal(err, "failed to mint token")
		}
		contextResp.WorkspaceID = req.WorkspaceID
		contextResp.MembershipRole = &m.Role

	case "renter":
		if req.RenterID == nil {
			return nil, apperr.NewValidation(map[string]string{"renter_id": "Required when type is renter"})
		}
		// Verify renter
		valid, err := s.repo.GetRenter(ctx, userID, *req.RenterID)
		if err != nil {
			return nil, apperr.NewInternal(err, "failed to verify renter profile")
		}
		if !valid {
			return nil, apperr.NewForbidden("Invalid renter profile")
		}
		token, err = s.jwtIssuer.GenerateTenantToken(userID, *req.RenterID)
		if err != nil {
			return nil, apperr.NewInternal(err, "failed to mint token")
		}
		contextResp.RenterID = req.RenterID

	case "admin":
		// MVP: Admin generation logic placeholder
		return nil, apperr.NewForbidden("Admin portal access restricted")

	default:
		return nil, apperr.NewValidation(map[string]string{"context_type": "Invalid type"})
	}

	// Assume 1 hour expiry based on ISSUER configuration
	expiresAt := time.Now().Add(1 * time.Hour).Format(time.RFC3339)

	return &TokenResponse{
		AccessToken: token,
		ExpiresAt:   expiresAt,
		Context:     contextResp,
	}, nil
}

func (s *service) GetUser(ctx context.Context, userID uuid.UUID) (*UserResponse, error) {
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
	}, nil
}
