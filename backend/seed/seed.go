package seed

import (
	"fmt"

	"gorm.io/gorm"

	"checkin-backend/models"
)

// WipeTestData removes all mock children, attendance logs, and unapproved legacy accounts.
func WipeTestData(db *gorm.DB) {
	fmt.Println("==========================================================================")
	fmt.Println("   WIPING DATABASE TEST DATA & UPDATING ADMIN AVATARS FROM LIBRARY")
	fmt.Println("==========================================================================")

	// 1. Delete all Children records
	if err := db.Exec("DELETE FROM children").Error; err != nil {
		fmt.Printf("[Wipe Warning] Error deleting children: %v\n", err)
	} else {
		fmt.Println("[Wipe] Successfully cleared all children records!")
	}

	// 2. Delete all Attendance Logs
	if err := db.Exec("DELETE FROM attendance_logs").Error; err != nil {
		fmt.Printf("[Wipe Warning] Error deleting attendance_logs: %v\n", err)
	} else {
		fmt.Println("[Wipe] Successfully cleared all attendance log records!")
	}

	// 3. Delete any old / unapproved staff/instructor/admin accounts
	if err := db.Exec("DELETE FROM users WHERE LOWER(email) NOT IN (?, ?, ?)",
		"okokon.christiana@kingshouselearning.com",
		"ifeanyireed@gmail.com",
		"grace.solomon@kingshouselearning.com",
	).Error; err != nil {
		fmt.Printf("[Wipe Warning] Error purging unapproved users: %v\n", err)
	} else {
		fmt.Println("[Wipe] Successfully purged all other instructor/admin accounts!")
	}

	// 4. Update any existing children center records to Raji Rasaki Centre if blank
	db.Exec("UPDATE children SET center = 'Raji Rasaki Centre' WHERE center = '' OR center IS NULL OR center = 'CBT Centre'")

	// 5. Ensure Default System Settings exist
	var settingCount int64
	db.Model(&models.Setting{}).Count(&settingCount)
	if settingCount == 0 {
		fmt.Println("[Wipe] Initializing clean System Settings...")
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

	// 6. Ensure the 3 approved Administrator Users exist with Character Library Avatars
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

	fmt.Println("==========================================================================")
	fmt.Println("   RAJI RASAKI CENTRE DEFAULT & CHARACTER AVATARS APPLIED!")
	fmt.Println("==========================================================================")
}

func SeedInitialData(db *gorm.DB) {
	WipeTestData(db)
}
