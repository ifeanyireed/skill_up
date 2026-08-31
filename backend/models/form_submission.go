package models

import (
	"time"
)

type FormSubmission struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	FormID    uint      `gorm:"not null;index" json:"form_id"`
	Data      string    `gorm:"type:json;not null" json:"data"`
	CreatedAt time.Time `json:"created_at"`
}
