package seed

import (
	"fmt"

	"gorm.io/gorm"

	"checkin-backend/models"
)

// EnsureSystemSetup ensures default system settings and the 3 Lead Administrator accounts exist on startup WITHOUT wiping registered children.
func EnsureSystemSetup(db *gorm.DB) {
	// 1. Delete any old / unapproved staff/instructor/admin accounts
	if err := db.Exec("DELETE FROM users WHERE LOWER(email) NOT IN (?, ?, ?)",
		"okokon.christiana@kingshouselearning.com",
		"ifeanyireed@gmail.com",
		"grace.solomon@kingshouselearning.com",
	).Error; err != nil {
		fmt.Printf("[Setup Warning] Error purging unapproved users: %v\n", err)
	}

	// 2. Ensure Default System Settings exist
	var settingCount int64
	db.Model(&models.Setting{}).Count(&settingCount)
	if settingCount == 0 {
		fmt.Println("[Setup] Initializing clean System Settings...")
		setting := models.Setting{
			BusinessName:    "Skill Up Academy",
			Tagline:         "Child Training Check-In & Verification Portal",
			BusinessEmail:   "safety@skillup.org",
			BusinessPhone:   "+1 (800) 555-SKILL",
			BusinessAddress: "742 Innovation Way, Suite 400, Technology District",
			CodeLength:      6,
			AutoExpireHour:  "20:00",
			SmsEnabled:      true,
			RequirePhone:    true,
			GroupsJSON:      `["Little Dragons (Ages 4-10)","Junior Champions (Ages 11-19)","Elite Athletes (Ages 20+)"]`,
		}
		db.Create(&setting)
	}

	// 3. Ensure the 3 approved Administrator Users exist with Character Library Avatars
	admins := []models.User{
		{
			FullName:      "Christiana Okokon",
			Email:         "Okokon.Christiana@kingshouselearning.com",
			Phone:         "+234 800 111 0001",
			Role:          "Administrator",
			AssignedGroup: "Head Administrator / All Groups",
			Status:        "Active",
			Avatar:        "/avatars/character1.jpg",
			PasswordHash:  "skillup2026",
			LastLogin:     "Just now",
		},
		{
			FullName:      "Ifeanyi Reed",
			Email:         "ifeanyireed@gmail.com",
			Phone:         "+234 800 111 0002",
			Role:          "Administrator",
			AssignedGroup: "Head Administrator / All Groups",
			Status:        "Active",
			Avatar:        "/avatars/character2.jpg",
			PasswordHash:  "skillup2026",
			LastLogin:     "Just now",
		},
		{
			FullName:      "Grace Solomon",
			Email:         "grace.solomon@kingshouselearning.com",
			Phone:         "+234 800 111 0003",
			Role:          "Administrator",
			AssignedGroup: "Head Administrator / All Groups",
			Status:        "Active",
			Avatar:        "/avatars/character3.jpg",
			PasswordHash:  "skillup2026",
			LastLogin:     "Just now",
		},
	}

	for _, admin := range admins {
		var existing models.User
		if err := db.Where("LOWER(email) = LOWER(?)", admin.Email).First(&existing).Error; err != nil {
			db.Create(&admin)
		} else {
			existing.Avatar = admin.Avatar
			existing.FullName = admin.FullName
			db.Save(&existing)
		}
	}
}

// WipeTestData explicitly wipes children and attendance logs ONLY when requested by admin API endpoint.
func WipeTestData(db *gorm.DB) {
	fmt.Println("==========================================================================")
	fmt.Println("   WIPING DATABASE TEST DATA VIA ADMIN REQUEST")
	fmt.Println("==========================================================================")

	db.Exec("DELETE FROM children")
	db.Exec("DELETE FROM attendance_logs")
	EnsureSystemSetup(db)

	fmt.Println("==========================================================================")
	fmt.Println("   DATABASE WIPED CLEAN!")
	fmt.Println("==========================================================================")
}

func SeedInitialData(db *gorm.DB) {
	// Preserve all registered students! Only ensure admin users and settings exist.
	EnsureSystemSetup(db)
}
