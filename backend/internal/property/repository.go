package property

import (
	"context"
	"encoding/json"
	"strings"

	"smartdorm/infrastructure/db"
	apperr "smartdorm/shared/errors"
	"smartdorm/shared/pagination"

	"github.com/google/uuid"
)

type Repository interface {
	Create(ctx context.Context, workspaceID uuid.UUID, p *Property) error
	GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Property, error)
	GetByIdempotencyKey(ctx context.Context, workspaceID uuid.UUID, key string) (*Property, error)
	List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params) ([]*Property, int64, error)
	Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Property, error)
	Delete(ctx context.Context, workspaceID, id uuid.UUID) error

	// Images
	GetImages(ctx context.Context, propertyID uuid.UUID) ([]*PropertyImage, error)
	AddImage(ctx context.Context, img *PropertyImage) error
	DeleteImage(ctx context.Context, propertyID, imageID uuid.UUID) error
	SetPrimaryImage(ctx context.Context, propertyID, imageID uuid.UUID) error

	// Validation helpers
	CountRooms(ctx context.Context, propertyID uuid.UUID) (int, error)
}

type repository struct {
	db *db.Database
}

func NewRepository(db *db.Database) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, workspaceID uuid.UUID, p *Property) error {
	const q = `
		INSERT INTO properties (workspace_id, name, address, city, district, ward, latitude, longitude, slug, type, status, idempotency_key, amenities, description)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		RETURNING id, created_at, updated_at, deleted_at, 0 AS room_count`

	amenitiesJSON, err := json.Marshal(p.Amenities)
	if err != nil {
		return err
	}

	if p.Status == "" {
		p.Status = PropertyStatusDraft
	}

	return r.db.GetContext(ctx, p, q, workspaceID, p.Name, p.Address, p.City, p.District, p.Ward, p.Latitude, p.Longitude, p.Slug, p.Type, p.Status, p.IdempotencyKey, amenitiesJSON, p.Description)
}

func (r *repository) GetByIdempotencyKey(ctx context.Context, workspaceID uuid.UUID, key string) (*Property, error) {
	const q = `
		SELECT p.id, p.workspace_id, p.name, p.address, p.city, p.district, p.ward, p.latitude, p.longitude, p.slug, p.type, p.status, p.idempotency_key, p.amenities, p.description, p.created_at, p.updated_at, p.deleted_at,
		       COALESCE((SELECT COUNT(*) FROM rooms r WHERE r.property_id = p.id AND r.deleted_at IS NULL), 0) AS room_count
		FROM properties p
		WHERE p.workspace_id = $1 AND p.idempotency_key = $2 AND p.deleted_at IS NULL`

	var row struct {
		Property
		AmenitiesRaw []byte `db:"amenities"`
	}

	if err := r.db.GetContext(ctx, &row, q, workspaceID, key); err != nil {
		return nil, err
	}

	if row.AmenitiesRaw != nil {
		if err := json.Unmarshal(row.AmenitiesRaw, &row.Property.Amenities); err != nil {
			return nil, err
		}
	}

	return &row.Property, nil
}

func (r *repository) GetByID(ctx context.Context, workspaceID, id uuid.UUID) (*Property, error) {
	const q = `
		SELECT p.id, p.workspace_id, p.name, p.address, p.city, p.district, p.ward, p.latitude, p.longitude, p.slug, p.type, p.status, p.idempotency_key, p.amenities, p.description, p.created_at, p.updated_at, p.deleted_at,
		       COALESCE((SELECT COUNT(*) FROM rooms r WHERE r.property_id = p.id AND r.deleted_at IS NULL), 0) AS room_count
		FROM properties p
		WHERE p.id = $1 AND p.workspace_id = $2 AND p.deleted_at IS NULL`

	// Using a temporary struct to handle []byte for Amenities
	var row struct {
		Property
		AmenitiesRaw []byte `db:"amenities"`
	}

	if err := r.db.GetContext(ctx, &row, q, id, workspaceID); err != nil {
		return nil, err
	}

	if row.AmenitiesRaw != nil {
		if err := json.Unmarshal(row.AmenitiesRaw, &row.Property.Amenities); err != nil {
			return nil, err
		}
	}

	return &row.Property, nil
}

func (r *repository) List(ctx context.Context, workspaceID uuid.UUID, params pagination.Params) ([]*Property, int64, error) {
	// 1. Get total count
	const qCount = `SELECT COUNT(*) FROM properties WHERE workspace_id = $1 AND deleted_at IS NULL`
	var total int64
	if err := r.db.GetContext(ctx, &total, qCount, workspaceID); err != nil {
		return nil, 0, err
	}

	if total == 0 {
		return make([]*Property, 0), 0, nil
	}

	// 2. Fetch paginated rows
	const qRows = `
		SELECT p.id, p.workspace_id, p.name, p.address, p.city, p.district, p.ward, p.latitude, p.longitude, p.slug, p.type, p.status, p.idempotency_key, p.amenities, p.description, p.created_at, p.updated_at, p.deleted_at,
		       COALESCE((SELECT COUNT(*) FROM rooms r WHERE r.property_id = p.id AND r.deleted_at IS NULL), 0) AS room_count
		FROM properties p
		WHERE p.workspace_id = $1 AND p.deleted_at IS NULL
		ORDER BY p.created_at DESC
		LIMIT $2 OFFSET $3`

	var rows []struct {
		Property
		AmenitiesRaw []byte `db:"amenities"`
	}

	err := r.db.SelectContext(ctx, &rows, qRows, workspaceID, params.Limit(), params.Offset())
	if err != nil {
		return nil, 0, err
	}

	properties := make([]*Property, len(rows))
	for i, row := range rows {
		p := row.Property
		if row.AmenitiesRaw != nil {
			if err := json.Unmarshal(row.AmenitiesRaw, &p.Amenities); err != nil {
				return nil, 0, err
			}
		}
		properties[i] = &p
	}

	return properties, total, nil
}

func (r *repository) Update(ctx context.Context, workspaceID, id uuid.UUID, updates map[string]interface{}) (*Property, error) {
	if len(updates) == 0 {
		return r.GetByID(ctx, workspaceID, id)
	}

	// Marshal amenities if present
	if amenities, ok := updates["amenities"]; ok {
		amenitiesJSON, err := json.Marshal(amenities)
		if err != nil {
			return nil, err
		}
		updates["amenities"] = amenitiesJSON
	}

	query := "UPDATE properties SET "
	var args []interface{}
	var setClauses []string
	
	i := 1
	allowed := map[string]bool{
		"name": true, "address": true, "city": true, "district": true, "ward": true,
		"latitude": true, "longitude": true, "slug": true,
		"type": true, "status": true, "amenities": true, "description": true,
	}

	for k, v := range updates {
		if allowed[k] {
			setClauses = append(setClauses, k+" = $"+string(rune('0'+i))) 
			args = append(args, v)
			i++
		}
	}

	setClauses = append(setClauses, "updated_at = NOW()")

	query += strings.Join(setClauses, ", ") + " WHERE id = $" + string(rune('0'+i)) + " AND workspace_id = $" + string(rune('0'+i+1)) + " AND deleted_at IS NULL RETURNING id, workspace_id, name, address, city, district, ward, latitude, longitude, slug, type, status, idempotency_key, amenities, description, created_at, updated_at, deleted_at, 0 AS room_count"
	args = append(args, id, workspaceID)

	var row struct {
		Property
		AmenitiesRaw []byte `db:"amenities"`
	}

	if err := r.db.GetContext(ctx, &row, query, args...); err != nil {
		return nil, err
	}

	if row.AmenitiesRaw != nil {
		if err := json.Unmarshal(row.AmenitiesRaw, &row.Property.Amenities); err != nil {
			return nil, err
		}
	}

	return &row.Property, nil
}

func (r *repository) Delete(ctx context.Context, workspaceID, id uuid.UUID) error {
	const q = `
		UPDATE properties 
		SET deleted_at = NOW() 
		WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL`

	res, err := r.db.Pool.Exec(ctx, q, id, workspaceID)
	if err != nil {
		return err
	}
	
	if res.RowsAffected() == 0 {
		return apperr.NewNotFound("Property", id.String())
	}

	return nil
}

// --- Image Management ---

func (r *repository) GetImages(ctx context.Context, propertyID uuid.UUID) ([]*PropertyImage, error) {
	const q = `
		SELECT id, property_id, url, is_primary, display_order, created_at
		FROM property_images
		WHERE property_id = $1
		ORDER BY display_order ASC, created_at ASC`

	var images []*PropertyImage
	err := r.db.SelectContext(ctx, &images, q, propertyID)
	return images, err
}

func (r *repository) AddImage(ctx context.Context, img *PropertyImage) error {
	const q = `
		INSERT INTO property_images (property_id, url, is_primary, display_order)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at`

	return r.db.GetContext(ctx, img, q, img.PropertyID, img.URL, img.IsPrimary, img.DisplayOrder)
}

func (r *repository) DeleteImage(ctx context.Context, propertyID, imageID uuid.UUID) error {
	const q = `DELETE FROM property_images WHERE id = $1 AND property_id = $2`
	_, err := r.db.Pool.Exec(ctx, q, imageID, propertyID)
	return err
}

func (r *repository) SetPrimaryImage(ctx context.Context, propertyID, imageID uuid.UUID) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 1. Reset all images for this property to false
	const qReset = `UPDATE property_images SET is_primary = false WHERE property_id = $1`
	if _, err := tx.ExecContext(ctx, qReset, propertyID); err != nil {
		return err
	}

	// 2. Set the target image to is_primary = true
	const qSet = `UPDATE property_images SET is_primary = true WHERE id = $1 AND property_id = $2`
	res, err := tx.ExecContext(ctx, qSet, imageID, propertyID)
	if err != nil {
		return err
	}
	if rows, _ := res.RowsAffected(); rows == 0 {
		return apperr.NewNotFound("PropertyImage", imageID.String())
	}

	return tx.Commit()
}

func (r *repository) CountRooms(ctx context.Context, propertyID uuid.UUID) (int, error) {
	const q = `SELECT COUNT(*) FROM rooms WHERE property_id = $1 AND deleted_at IS NULL`
	var count int
	err := r.db.GetContext(ctx, &count, q, propertyID)
	return count, err
}
