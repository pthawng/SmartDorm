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
	UserID     *uuid.UUID `json:"user_id,omitempty"`
	ActiveRole string     `json:"active_role"` // LANDLORD, TENANT, ADMIN

	// Context specific claims
	WorkspaceID    *uuid.UUID `json:"workspace_id,omitempty"` // For LANDLORD
	MembershipRole *string    `json:"membership_role,omitempty"` // 'owner', 'manager', 'staff'
	SecurityStamp  *uuid.UUID `json:"security_stamp,omitempty"` // Version of the user identity
	AdminRole      *string    `json:"admin_role,omitempty"`      // 'super_admin', etc

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
func (i *Issuer) GenerateLandlordToken(userID, workspaceID uuid.UUID, membershipRole string, securityStamp uuid.UUID) (string, error) {
	claims := Claims{
		UserID:         &userID,
		ActiveRole:     RoleLandlord,
		WorkspaceID:    &workspaceID,
		MembershipRole: &membershipRole,
		SecurityStamp:  &securityStamp,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	return i.signToken(claims)
}

// GenerateRefreshToken creates a long-lived token for session maintenance
func (i *Issuer) GenerateRefreshToken(userID uuid.UUID) (string, error) {
	claims := Claims{
		UserID:     &userID,
		ActiveRole: "REFRESH",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)), // 7 days
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	return i.signToken(claims)
}

// GenerateTenantToken creates a token for a user in tenant context
func (i *Issuer) GenerateTenantToken(userID, securityStamp uuid.UUID) (string, error) {
	claims := Claims{
		UserID:        &userID,
		ActiveRole:    RoleTenant,
		SecurityStamp: &securityStamp,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
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
