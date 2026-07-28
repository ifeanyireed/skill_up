package models

import (
	"time"

	"gorm.io/gorm"
)

type AttendanceLog struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Date           string         `gorm:"type:varchar(20);index:idx_student_date;not null" json:"date"`
	StudentID      string         `gorm:"type:varchar(50);index:idx_student_date;not null" json:"student_id"`
	ChildName      string         `gorm:"type:varchar(150);not null" json:"child_name"`
	Photo          string         `gorm:"type:varchar(255)" json:"photo"`
	Center             string         `gorm:"type:varchar(100)" json:"center"` // Raji Rasaki Centre, Festac Centre
	Group              string         `gorm:"type:varchar(100)" json:"group"`
	CheckInTime        string         `gorm:"type:varchar(50)" json:"check_in_time"`
	DropOffAdult       string         `gorm:"type:varchar(150)" json:"drop_off_adult"`
	CheckOutTime       string         `gorm:"type:varchar(50)" json:"check_out_time"`
	PickupAdult        string         `gorm:"type:varchar(150)" json:"pickup_adult"`
	PickupPin          string         `gorm:"type:varchar(10)" json:"pickup_pin"`
	InstructorName     string         `gorm:"type:varchar(150)" json:"instructor_name"`
	CheckOutInstructor string         `gorm:"type:varchar(150)" json:"check_out_instructor"`
	Status             string         `gorm:"type:varchar(50)" json:"status"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
