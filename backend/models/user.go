package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	FullName      string         `gorm:"type:varchar(150);not null" json:"full_name"`
	Email         string         `gorm:"type:varchar(150);uniqueIndex;not null" json:"email"`
	Phone         string         `gorm:"type:varchar(50)" json:"phone"`
	Role          string         `gorm:"type:varchar(50);default:'Instructor'" json:"role"` // Administrator, Instructor
	AssignedGroup string         `gorm:"type:varchar(150)" json:"assigned_group"`
	Status        string         `gorm:"type:varchar(20);default:'Active'" json:"status"`   // Active, Disabled
	Avatar        string         `gorm:"type:varchar(255)" json:"avatar"`
	PasswordHash  string         `gorm:"type:varchar(255);not null" json:"-"`
	LastLogin     string         `gorm:"type:varchar(50)" json:"last_login"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}
