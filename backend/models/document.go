package models

import (
	"time"

	"gorm.io/gorm"
)

type Document struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Title          string         `gorm:"type:varchar(255);not null" json:"title"`
	Description    string         `gorm:"type:text" json:"description"`
	FileURL        string         `gorm:"type:varchar(500);not null" json:"file_url"`
	TargetAudience string         `gorm:"type:varchar(50);default:'Parents'" json:"target_audience"` // "Parents" or "Staff"
	UploadedBy     string         `gorm:"type:varchar(150)" json:"uploaded_by"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
