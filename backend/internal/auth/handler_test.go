package auth

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"smartdorm/shared/jwt"
	apperr "smartdorm/shared/errors"
)


// MockAuthService is a mock implementation of the Service interface
type MockAuthService struct {
	mock.Mock
}

func (m *MockAuthService) Register(ctx context.Context, req RegisterRequest) (*UserResponse, error) {
	args := m.Called(ctx, req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*UserResponse), args.Error(1)
}

func (m *MockAuthService) Login(ctx context.Context, req LoginRequest) (*LoginResponse, error) {
	args := m.Called(ctx, req)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*LoginResponse), args.Error(1)
}

func (m *MockAuthService) SwitchContext(ctx context.Context, req TokenRequest, userID uuid.UUID) (*TokenResponse, error) {
	args := m.Called(ctx, req, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*TokenResponse), args.Error(1)
}

func (m *MockAuthService) GetUser(ctx context.Context, userID uuid.UUID, role string) (*UserResponse, error) {
	args := m.Called(ctx, userID, role)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*UserResponse), args.Error(1)
}

func (m *MockAuthService) Refresh(ctx context.Context, refreshToken string) (*TokenResponse, error) {
	args := m.Called(ctx, refreshToken)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*TokenResponse), args.Error(1)
}

func (m *MockAuthService) Logout(ctx context.Context, refreshToken string) error {
	args := m.Called(ctx, refreshToken)
	return args.Error(0)
}

// Test Setup Helpers

func setupTestRouter(service Service) (*gin.Engine, *jwt.Issuer) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	api := r.Group("/api/v1")
	
	jwtIssuer := jwt.NewIssuer("test-secret")
	handler := NewHandler(service)
	RegisterRoutes(api, handler, jwtIssuer)
	
	return r, jwtIssuer
}

func performRequest(r http.Handler, method, path string, body interface{}, cookie *http.Cookie) *httptest.ResponseRecorder {
	var reqBody []byte
	if body != nil {
		reqBody, _ = json.Marshal(body)
	}
	
	req := httptest.NewRequest(method, path, bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	
	if cookie != nil {
		req.AddCookie(cookie)
	}
	
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func getCookie(w *httptest.ResponseRecorder, name string) *http.Cookie {
	res := http.Response{Header: w.Header()}
	for _, cookie := range res.Cookies() {
		if cookie.Name == name {
			return cookie
		}
	}
	return nil
}

// --- Test Cases ---

func TestRegister(t *testing.T) {
	mockService := new(MockAuthService)
	router, _ := setupTestRouter(mockService)

	t.Run("successful registration", func(t *testing.T) {
		req := RegisterRequest{
			Email:    "test@example.com",
			Password: "password123",
			FullName: "Test User",
		}

		resp := &UserResponse{
			ID:           uuid.New(),
			Email:        req.Email,
			FullName:     req.FullName,
			Role:         "TENANT",
			RefreshToken: "mock-refresh-token",
		}

		mockService.On("Register", mock.Anything, req).Return(resp, nil).Once()

		w := performRequest(router, "POST", "/api/v1/auth/register", req, nil)

		assert.Equal(t, http.StatusCreated, w.Code)
		
		var body map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &body)
		assert.True(t, body["success"].(bool))
		
		cookie := getCookie(w, "refreshToken")
		assert.NotNil(t, cookie)
		assert.Equal(t, "mock-refresh-token", cookie.Value)
		assert.True(t, cookie.HttpOnly)
	})

	t.Run("invalid request body", func(t *testing.T) {
		req := map[string]string{"email": "invalid"} // Missing required fields
		w := performRequest(router, "POST", "/api/v1/auth/register", req, nil)
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("service conflict error", func(t *testing.T) {
		req := RegisterRequest{
			Email:    "existing@example.com",
			Password: "password123",
			FullName: "Existing User",
		}

		mockService.On("Register", mock.Anything, req).Return(nil, apperr.NewConflict("Email already registered")).Once()

		w := performRequest(router, "POST", "/api/v1/auth/register", req, nil)

		assert.Equal(t, http.StatusConflict, w.Code)
		
		var body map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &body)
		assert.False(t, body["success"].(bool))
	})
}


func TestLogin(t *testing.T) {
	mockService := new(MockAuthService)
	router, _ := setupTestRouter(mockService)

	t.Run("successful login", func(t *testing.T) {
		req := LoginRequest{
			Email:    "test@example.com",
			Password: "password123",
		}

		resp := &LoginResponse{
			User: UserResponse{
				ID:       uuid.New(),
				Email:    req.Email,
				FullName: "Test User",
				Role:     "TENANT",
			},
			RefreshToken: "mock-refresh-token",
		}

		mockService.On("Login", mock.Anything, req).Return(resp, nil).Once()

		w := performRequest(router, "POST", "/api/v1/auth/login", req, nil)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var body map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &body)
		assert.True(t, body["success"].(bool))

		cookie := getCookie(w, "refreshToken")
		assert.NotNil(t, cookie)
		assert.Equal(t, "mock-refresh-token", cookie.Value)
	})
}

func TestRefresh(t *testing.T) {
	mockService := new(MockAuthService)
	router, _ := setupTestRouter(mockService)

	t.Run("successful refresh", func(t *testing.T) {
		oldCookie := &http.Cookie{Name: "refreshToken", Value: "old-token"}
		
		resp := &TokenResponse{
			AccessToken:  "new-access-token",
			RefreshToken: "new-refresh-token",
		}

		mockService.On("Refresh", mock.Anything, "old-token").Return(resp, nil).Once()

		w := performRequest(router, "POST", "/api/v1/auth/refresh", nil, oldCookie)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var body map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &body)
		assert.True(t, body["success"].(bool))

		newCookie := getCookie(w, "refreshToken")
		assert.NotNil(t, newCookie)
		assert.Equal(t, "new-refresh-token", newCookie.Value)
	})

	t.Run("missing refresh cookie", func(t *testing.T) {
		w := performRequest(router, "POST", "/api/v1/auth/refresh", nil, nil)
		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestLogout(t *testing.T) {
	mockService := new(MockAuthService)
	router, _ := setupTestRouter(mockService)

	t.Run("successful logout", func(t *testing.T) {
		cookie := &http.Cookie{Name: "refreshToken", Value: "valid-token"}
		
		mockService.On("Logout", mock.Anything, "valid-token").Return(nil).Once()

		w := performRequest(router, "POST", "/api/v1/auth/logout", nil, cookie)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var body map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &body)
		assert.True(t, body["success"].(bool))

		clearedCookie := getCookie(w, "refreshToken")
		assert.NotNil(t, clearedCookie)
		assert.Equal(t, "", clearedCookie.Value)
		assert.Equal(t, -1, clearedCookie.MaxAge)
	})
}

func TestGetMe(t *testing.T) {
	mockService := new(MockAuthService)
	router, jwtIssuer := setupTestRouter(mockService)

	t.Run("successful get me", func(t *testing.T) {
		userID := uuid.New()
		securityStamp := uuid.New()
		token, _ := jwtIssuer.GenerateTenantToken(userID, securityStamp)
		
		resp := &UserResponse{
			ID:       userID,
			Email:    "test@example.com",
			FullName: "Test User",
			Role:     "TENANT",
		}

		mockService.On("GetUser", mock.Anything, userID, "TENANT").Return(resp, nil).Once()

		req := httptest.NewRequest("GET", "/api/v1/auth/me", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var body map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &body)
		assert.True(t, body["success"].(bool))
		
		data := body["data"].(map[string]interface{})
		assert.Equal(t, userID.String(), data["id"])
	})

	t.Run("unauthorized request", func(t *testing.T) {
		w := performRequest(router, "GET", "/api/v1/auth/me", nil, nil)
		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

