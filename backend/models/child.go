package models

import (
	"time"

	"gorm.io/gorm"
)

type Child struct {
	ID                 uint           `gorm:"primaryKey" json:"id"`
	StudentID          string         `gorm:"type:varchar(50);uniqueIndex;not null" json:"student_id"`
	FullName           string         `gorm:"type:varchar(150);not null" json:"full_name"`
	Photo              string         `gorm:"type:varchar(255)" json:"photo"`
	Age                int            `json:"age"`
	Gender             string         `gorm:"type:varchar(20)" json:"gender"`
	DOB                string         `gorm:"type:varchar(20)" json:"dob"`
	Center             string         `gorm:"type:varchar(100)" json:"center"` // Raji Rasaki Centre, Festac Centre
	Group              string         `gorm:"type:varchar(100);not null" json:"group"`
	ParentName         string         `gorm:"type:varchar(150);not null" json:"parent_name"`
	ParentPhone        string         `gorm:"type:varchar(50);not null" json:"parent_phone"`
	ParentEmail        string         `gorm:"type:varchar(150)" json:"parent_email"`
	ParentRelationship string         `gorm:"type:varchar(50)" json:"parent_relationship"`
	EmergencyName      string         `gorm:"type:varchar(150)" json:"emergency_name"`
	EmergencyPhone     string         `gorm:"type:varchar(50)" json:"emergency_phone"`
	SchoolName         string         `gorm:"type:varchar(150)" json:"school_name"`
	CurrentGrade       string         `gorm:"type:varchar(100)" json:"current_grade"`
	AltPhone           string         `gorm:"type:varchar(50)" json:"alt_phone"`
	HomeAddress        string         `gorm:"type:varchar(255)" json:"home_address"`
	SeniorTrack        string         `gorm:"type:varchar(150)" json:"senior_track"`
	OwnsDevice         string         `gorm:"type:varchar(10)" json:"owns_device"`
	DeviceType         string         `gorm:"type:varchar(50)" json:"device_type"`
	AmountPaid         float64        `gorm:"type:decimal(10,2)" json:"amount_paid"`
	PaymentStatus      string         `gorm:"type:varchar(50)" json:"payment_status"`
	PaymentDate        string         `gorm:"type:varchar(50)" json:"payment_date"`
	ReferralSource     string         `gorm:"type:varchar(100)" json:"referral_source"`
	MedicalNotes       string         `gorm:"type:text" json:"medical_notes"`
	AdditionalNotes    string         `gorm:"type:text" json:"additional_notes"`
	ConsentGiven       bool           `gorm:"default:true" json:"consent_given"`
	Status             string         `gorm:"type:varchar(50);default:'Not Checked In'" json:"status"`
	ActiveCode         string         `gorm:"type:varchar(10)" json:"active_code"`
	CheckInTime        string         `gorm:"type:varchar(50)" json:"check_in_time"`
	CheckOutTime       string         `gorm:"type:varchar(50)" json:"check_out_time"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
	DeletedAt          gorm.DeletedAt `gorm:"index" json:"-"`
}
