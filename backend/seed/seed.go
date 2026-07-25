package seed

import (
	"fmt"

	"gorm.io/gorm"

	"checkin-backend/models"
)

// WipeTestData removes all mock children, attendance logs, and unapproved legacy accounts.
func WipeTestData(db *gorm.DB) {
	fmt.Println("==========================================================================")
	fmt.Println("   WIPING DATABASE TEST DATA & PURGING UNAPPROVED INSTRUCTOR ACCOUNTS")
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

	// 4. Ensure Default System Settings exist
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

	// 5. Ensure the 3 approved Administrator Users exist (Okokon Christiana, Ifeanyi Reed, Grace Solomon)
	admins := []models.User{
		{
			FullName:      "Christiana Okokon",
			Email:         "Okokon.Christiana@kingshouselearning.com",
			Phone:         "+234 800 111 0001",
			Role:          "Administrator",
			AssignedGroup: "Head Administrator / All Groups",
			Status:        "Active",
			Avatar:        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
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
			Avatar:        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
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
			Avatar:        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
			PasswordHash:  "skillup2026",
			LastLogin:     "Just now",
		},
	}

	for _, admin := range admins {
		var cnt int64
		db.Model(&models.User{}).Where("LOWER(email) = LOWER(?)", admin.Email).Count(&cnt)
		if cnt == 0 {
			db.Create(&admin)
		}
	}

	fmt.Println("==========================================================================")
	fmt.Println("   DATABASE PURGED & 3 ADMIN ACCOUNTS VERIFIED READY FOR PROD!")
	fmt.Println("==========================================================================")
}

func SeedInitialData(db *gorm.DB) {
	WipeTestData(db)
}
