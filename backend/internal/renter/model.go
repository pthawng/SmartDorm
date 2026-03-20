package renter

import (
	"time"

	"github.com/google/uuid"
)

type Renter struct {
	ID                    uuid.UUID  `db:"id"`
	WorkspaceID           uuid.UUID  `db:"workspace_id"`
	UserID                *uuid.UUID `db:"user_id"` // Nullable: renter might not have logged in / linked yet
	FullName              string     `db:"full_name"`
	Phone                 string     `db:"phone"`
	Email                 *string    `db:"email"`
	IDNumber              *string    `db:"id_number"`
	DateOfBirth           *time.Time `db:"date_of_birth"`
	EmergencyContactName  *string    `db:"emergency_contact_name"`
	EmergencyContactPhone *string    `db:"emergency_contact_phone"`
	Budget                int64     `db:"budget"`
	PreferredLocation     *string   `db:"preferred_location"`
	Verified              bool      `db:"verified"`
	Rating                float64   `db:"rating"`
	CreatedAt             time.Time  `db:"created_at"`
	UpdatedAt             time.Time  `db:"updated_at"`
	DeletedAt             *time.Time `db:"deleted_at"`
}
