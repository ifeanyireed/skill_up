package models

import (
	"time"

	"gorm.io/gorm"
)

type Setting struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	BusinessName    string         `gorm:"type:varchar(150);default:'Skill Up Academy'" json:"business_name"`
	Tagline         string         `gorm:"type:varchar(255)" json:"tagline"`
	BusinessEmail   string         `gorm:"type:varchar(150)" json:"business_email"`
	BusinessPhone   string         `gorm:"type:varchar(50)" json:"business_phone"`
	BusinessAddress string         `gorm:"type:varchar(255)" json:"business_address"`
	CodeLength      int            `gorm:"default:6" json:"code_length"`
	AutoExpireHour  string         `gorm:"type:varchar(20);default:'20:00'" json:"auto_expire_hour"`
	SmsEnabled      bool           `gorm:"default:true" json:"sms_enabled"`
	RequirePhone    bool           `gorm:"default:true" json:"require_phone"`
	GroupsJSON      string         `gorm:"type:text" json:"groups_json"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}
