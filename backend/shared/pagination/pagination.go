package pagination

import (
	"math"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Params contains common pagination requests
type Params struct {
	Page     int
	PageSize int
}

// Validate validates and defaults pagination
func (p *Params) Validate() {
	if p.Page < 1 {
		p.Page = 1
	}
	if p.PageSize < 1 {
		p.PageSize = 20
	}
	if p.PageSize > 100 {
		p.PageSize = 100
	}
}

// Offset returns Postgres OFFSET value
func (p *Params) Offset() int {
	return (p.Page - 1) * p.PageSize
}

// Limit returns Postgres LIMIT value
func (p *Params) Limit() int {
	return p.PageSize
}

// ParseParams extracts pagination parameters from the Gin context
func ParseParams(c *gin.Context) (Params, error) {
	p := Params{
		Page:     1,
		PageSize: 20,
	}

	if pageStr := c.Query("page"); pageStr != "" {
		if val, err := strconv.Atoi(pageStr); err == nil {
			p.Page = val
		}
	}

	if pageSizeStr := c.Query("page_size"); pageSizeStr != "" {
		if val, err := strconv.Atoi(pageSizeStr); err == nil {
			p.PageSize = val
		}
	}

	p.Validate()
	return p, nil
}

// Result is the paginated response metadata block
type Result struct {
	Total      int `json:"total"`
	Page       int `json:"page"`
	PageSize   int `json:"page_size"`
	TotalPages int `json:"total_pages"`
}

// NewResult creates the Result object
func NewResult(total, page, pageSize int) Result {
	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))
	return Result{
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}
}

// PaginatedResponse combines the payload and pagination metadata
type PaginatedResponse struct {
	Success    bool        `json:"success"`
	Data       interface{} `json:"data"`
	Pagination Result      `json:"pagination"`
}

// OK sends a paginated API response
func OK(c *gin.Context, data interface{}, total, page, pageSize int) {
	c.JSON(200, PaginatedResponse{
		Success:    true,
		Data:       data,
		Pagination: NewResult(total, page, pageSize),
	})
}
