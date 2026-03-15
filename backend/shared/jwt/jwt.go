package jwt

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// Role constants
const (
	RoleLandlord = "LANDLORD"
	RoleTenant   = "TENANT"
	RoleAdmin    = "ADMIN"
)

// Claims represents the standardized JWT payload
type Claims struct {
	UserID        *uuid.UUID `json:"user_id,omitempty"`
	Role          string     `json:"role"`
	
	// Role specific claims
	WorkspaceID   *uuid.UUID `json:"workspace_id,omitempty"` // For LANDLORD
	RenterID      *uuid.UUID `json:"renter_id,omitempty"`    // For TENANT
	MembershipRole *string    `json:"membership_role,omitempty"` // 'owner', 'property_manager'

	AdminRole     *string    `json:"admin_role,omitempty"` // 'super_admin', etc

	jwt.RegisteredClaims
}

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("expired token")
)

// Issuer handles generating and validating JWTs
type Issuer struct {
	secret []byte
}

func NewIssuer(secret string) *Issuer {
	return &Issuer{secret: []byte(secret)}
}

// GenerateLandlordToken creates a token for a workspace owner/manager
func (i *Issuer) GenerateLandlordToken(userID, workspaceID uuid.UUID, membershipRole string) (string, error) {
	claims := Claims{
		UserID:         &userID,
		Role:           RoleLandlord,
		WorkspaceID:    &workspaceID,
		MembershipRole: &membershipRole,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)), // 1 hour for MVP
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	return i.signToken(claims)
}

// GenerateTenantToken creates a token for a renter profile
func (i *Issuer) GenerateTenantToken(userID, renterID uuid.UUID) (string, error) {
	claims := Claims{
		UserID:   &userID,
		Role:     RoleTenant,
		RenterID: &renterID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)), // 1 hour for MVP
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	return i.signToken(claims)
}

func (i *Issuer) signToken(claims Claims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(i.secret)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}
	return signedToken, nil
}

// ValidateToken parses and validates a raw JWT string
func (i *Issuer) ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return i.secret, nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, ErrInvalidToken
}
