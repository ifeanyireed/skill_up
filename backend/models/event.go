package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Description string         `gorm:"type:text" json:"description"`
	EventType   string         `gorm:"type:varchar(100);default:'Workshop'" json:"event_type"` // Workshop, Webinar, Deadline, Competition, Exam
	Location    string         `gorm:"type:varchar(255)" json:"location"`
	EventDate   string         `gorm:"type:varchar(50);not null" json:"event_date"` // YYYY-MM-DD
	StartTime   string         `gorm:"type:varchar(50)" json:"start_time"`
	EndTime     string         `gorm:"type:varchar(50)" json:"end_time"`
	Organizer   string         `gorm:"type:varchar(150)" json:"organizer"`
	TargetGroup string         `gorm:"type:varchar(150);default:'All'" json:"target_group"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
