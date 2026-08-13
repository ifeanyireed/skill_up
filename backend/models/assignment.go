package models

import (
	"time"

	"gorm.io/gorm"
)

type Assignment struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Description string         `gorm:"type:text" json:"description"`
	Subject     string         `gorm:"type:varchar(100)" json:"subject"` // e.g. Python, Web Dev, Robotics, AI, Math
	DueDate     string         `gorm:"type:varchar(50)" json:"due_date"`
	TotalPoints int            `gorm:"default:100" json:"total_points"`
	Status      string         `gorm:"type:varchar(50);default:'Active'" json:"status"` // Active, Closed, Archived
	Group       string         `gorm:"type:varchar(150)" json:"group"`                  // All, Junior, Senior
	Instructor  string         `gorm:"type:varchar(150)" json:"instructor"`
	Submissions int            `gorm:"default:0" json:"submissions"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type AssignmentSubmission struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	AssignmentID   uint           `gorm:"not null" json:"assignment_id"`
	StudentID      string         `gorm:"type:varchar(100);not null" json:"student_id"`
	StudentName    string         `gorm:"type:varchar(150)" json:"student_name"`
	SubmissionText string         `gorm:"type:text" json:"submission_text"`
	FileURL        string         `gorm:"type:varchar(255)" json:"file_url"`
	Status         string         `gorm:"type:varchar(50);default:'Submitted'" json:"status"` // Submitted, Graded, Late
	Grade          int            `gorm:"default:0" json:"grade"`
	Feedback       string         `gorm:"type:text" json:"feedback"`
	SubmittedAt    time.Time      `json:"submitted_at"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
