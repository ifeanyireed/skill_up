package models

import (
	"time"

	"gorm.io/gorm"
)

type Parent struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	FullName     string         `gorm:"type:varchar(150);not null" json:"full_name"`
	Email        string         `gorm:"type:varchar(150);uniqueIndex;not null" json:"email"`
	Phone        string         `gorm:"type:varchar(50)" json:"phone"`
	PasswordHash string         `gorm:"type:varchar(255);not null" json:"-"`
	Children     []Child        `gorm:"foreignKey:ParentID" json:"children"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
