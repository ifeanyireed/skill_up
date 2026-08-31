package models

import (
	"time"

	"gorm.io/gorm"
)

type CertificateConfig struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	CategoryType string         `gorm:"type:varchar(50);not null" json:"category_type"` // "Group" or "Track"
	CategoryName string         `gorm:"type:varchar(150);not null;uniqueIndex" json:"category_name"`
	TemplateURL  string         `gorm:"type:varchar(255);not null" json:"template_url"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
