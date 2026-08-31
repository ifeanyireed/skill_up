package models

import (
	"time"

	"gorm.io/gorm"
)

type Form struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Description string         `gorm:"type:text" json:"description"`
	Slug        string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"slug"`
	IsActive    bool           `gorm:"default:true" json:"is_active"`
	Fields      []FormField    `gorm:"foreignKey:FormID;constraint:OnDelete:CASCADE;" json:"fields"`
	CreatedBy   string         `gorm:"type:varchar(150)" json:"created_by"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type FormField struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	FormID     uint   `gorm:"not null;index" json:"form_id"`
	Label      string `gorm:"type:varchar(255);not null" json:"label"`
	Type       string `gorm:"type:varchar(50);not null" json:"type"`
	Options    string `gorm:"type:json" json:"options,omitempty"`
	IsRequired bool   `gorm:"default:false" json:"is_required"`
	OrderIndex int    `gorm:"not null" json:"order_index"`
}
