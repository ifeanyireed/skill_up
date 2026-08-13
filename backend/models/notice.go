package models

import (
	"time"

	"gorm.io/gorm"
)

type Notice struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Content     string         `gorm:"type:text;not null" json:"content"`
	Category    string         `gorm:"type:varchar(100);default:'General'" json:"category"` // General, Academic, Urgent, Event, Exam
	Urgency     string         `gorm:"type:varchar(50);default:'Normal'" json:"urgency"`   // Low, Normal, High, Urgent
	Author      string         `gorm:"type:varchar(150)" json:"author"`
	IsPinned    bool           `gorm:"default:false" json:"is_pinned"`
	TargetGroup string         `gorm:"type:varchar(150);default:'All'" json:"target_group"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
