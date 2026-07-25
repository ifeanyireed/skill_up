package seed

import (
	"fmt"

	"gorm.io/gorm"

	"checkin-backend/models"
)

// WipeTestData removes all mock children and attendance logs to prepare for live user testing.
func WipeTestData(db *gorm.DB) {
	fmt.Println("==========================================================================")
	fmt.Println("   WIPING DATABASE TEST DATA FOR REAL USER TESTING PROD LAUNCH")
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

	// 3. Ensure Default System Settings exist
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

	// 4. Ensure Default Administrator User exists for initial staff login
	var userCount int64
	db.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		fmt.Println("[Wipe] Initializing Lead Administrator account...")
		admin := models.User{
			FullName:      "Coach Sarah Jenkins",
			Email:         "sarah.jenkins@skillup.org",
			Phone:         "+1 (555) 100-2001",
			Role:          "Administrator",
			AssignedGroup: "Head Instructor / All Groups",
			Status:        "Active",
			Avatar:        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
			PasswordHash:  "skillup2026",
			LastLogin:     "Just now",
		}
		db.Create(&admin)
	}

	fmt.Println("==========================================================================")
	fmt.Println("   DATABASE WIPED CLEAN — READY FOR LIVE PRODUCTION USER TESTING!")
	fmt.Println("==========================================================================")
}

func SeedInitialData(db *gorm.DB) {
	// Wipe test data to ensure clean database for live testing
	WipeTestData(db)
}
