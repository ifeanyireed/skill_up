package seed

import (
	"fmt"
	"time"

	"gorm.io/gorm"

	"checkin-backend/models"
)

func SeedInitialData(db *gorm.DB) {
	// 1. Seed Users / Instructors
	var userCount int64
	db.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		fmt.Println("[Seed] Populating initial Staff & Instructors...")
		staff := []models.User{
			{
				FullName:      "Coach Sarah Jenkins",
				Email:         "sarah.jenkins@skillup.org",
				Phone:         "+1 (555) 100-2001",
				Role:          "Administrator",
				AssignedGroup: "Head Instructor / All Groups",
				Status:        "Active",
				Avatar:        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
				PasswordHash:  "skillup2026",
				LastLogin:     "Today at 07:45 AM",
			},
			{
				FullName:      "Coach Michael Davies",
				Email:         "michael.davies@skillup.org",
				Phone:         "+1 (555) 100-2002",
				Role:          "Instructor",
				AssignedGroup: "Junior Champions (Ages 7-9)",
				Status:        "Active",
				Avatar:        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
				PasswordHash:  "skillup2026",
				LastLogin:     "Today at 08:15 AM",
			},
			{
				FullName:      "Sensei David Zhang",
				Email:         "david.zhang@skillup.org",
				Phone:         "+1 (555) 100-2003",
				Role:          "Instructor",
				AssignedGroup: "Little Dragons (Ages 4-6)",
				Status:        "Active",
				Avatar:        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
				PasswordHash:  "skillup2026",
				LastLogin:     "Yesterday at 05:20 PM",
			},
		}
		db.Create(&staff)
	}

	// 2. Seed Children
	var childCount int64
	db.Model(&models.Child{}).Count(&childCount)
	if childCount == 0 {
		fmt.Println("[Seed] Populating initial Children Directory...")
		children := []models.Child{
			{
				StudentID:          "KNT-8041",
				FullName:           "Leo Vance",
				Photo:              "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=250",
				Age:                6,
				Gender:             "Boy",
				DOB:                "2020-04-14",
				Group:              "Little Dragons (Ages 4-6)",
				ParentName:         "Sarah Vance",
				ParentPhone:        "+1 (555) 234-8901",
				ParentEmail:        "sarah.vance@example.com",
				ParentRelationship: "Mother",
				EmergencyName:      "Mark Vance",
				EmergencyPhone:     "+1 (555) 234-8902",
				MedicalNotes:       "Allergic to peanuts (EpiPen in bag)",
				Status:             "Checked In",
				ActiveCode:         "482910",
				CheckInTime:        "08:45 AM",
			},
			{
				StudentID:          "KNT-8042",
				FullName:           "Maya Patel",
				Photo:              "https://images.unsplash.com/photo-1595454038955-4dfe8de81be8?auto=format&fit=crop&q=80&w=250",
				Age:                8,
				Gender:             "Girl",
				DOB:                "2018-09-22",
				Group:              "Junior Champions (Ages 7-9)",
				ParentName:         "Rajesh Patel",
				ParentPhone:        "+1 (555) 345-6789",
				ParentEmail:        "rajesh.patel@example.com",
				ParentRelationship: "Father",
				EmergencyName:      "Priya Patel",
				EmergencyPhone:     "+1 (555) 345-6790",
				MedicalNotes:       "Mild asthma - inhaler required after cardio",
				Status:             "Waiting Pickup",
				ActiveCode:         "719304",
				CheckInTime:        "09:00 AM",
			},
			{
				StudentID:          "KNT-8043",
				FullName:           "Noah Kovacs",
				Photo:              "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250",
				Age:                11,
				Gender:             "Boy",
				DOB:                "2015-01-30",
				Group:              "Elite Athletes (Ages 10-14)",
				ParentName:         "Elena Kovacs",
				ParentPhone:        "+1 (555) 456-7890",
				ParentEmail:        "elena.k@example.com",
				ParentRelationship: "Mother",
				EmergencyName:      "David Kovacs",
				EmergencyPhone:     "+1 (555) 456-7891",
				Status:             "Checked Out",
				ActiveCode:         "194823",
				CheckInTime:        "08:30 AM",
				CheckOutTime:       "12:15 PM",
			},
			{
				StudentID:          "KNT-8044",
				FullName:           "Chloe Bennett",
				Photo:              "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=250",
				Age:                5,
				Gender:             "Girl",
				DOB:                "2021-02-18",
				Group:              "Little Dragons (Ages 4-6)",
				ParentName:         "Marcus Bennett",
				ParentPhone:        "+1 (555) 567-8901",
				ParentEmail:        "m.bennett@example.com",
				ParentRelationship: "Father",
				EmergencyName:      "Laura Bennett",
				EmergencyPhone:     "+1 (555) 567-8902",
				Status:             "Not Checked In",
			},
			{
				StudentID:          "KNT-8045",
				FullName:           "Ethan O'Connor",
				Photo:              "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250",
				Age:                9,
				Gender:             "Boy",
				DOB:                "2017-06-05",
				Group:              "Junior Champions (Ages 7-9)",
				ParentName:         "Fiona O'Connor",
				ParentPhone:        "+1 (555) 678-9012",
				ParentEmail:        "fiona.oc@example.com",
				ParentRelationship: "Mother",
				EmergencyName:      "Liam O'Connor",
				EmergencyPhone:     "+1 (555) 678-9013",
				Status:             "Checked In",
				ActiveCode:         "930182",
				CheckInTime:        "09:15 AM",
			},
		}
		db.Create(&children)
	}

	// 3. Seed Attendance History
	var historyCount int64
	db.Model(&models.AttendanceLog{}).Count(&historyCount)
	if historyCount == 0 {
		fmt.Println("[Seed] Populating initial Attendance History logs...")
		today := time.Now().Format("2006-01-02")
		history := []models.AttendanceLog{
			{
				Date:           today,
				StudentID:      "KNT-8043",
				ChildName:      "Noah Kovacs",
				Photo:          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250",
				Group:          "Elite Athletes (Ages 10-14)",
				CheckInTime:    "08:30 AM",
				DropOffAdult:   "Elena Kovacs (Mother)",
				CheckOutTime:   "12:15 PM",
				PickupAdult:    "David Kovacs (Father)",
				PickupPin:      "194823",
				InstructorName: "Coach Sarah Jenkins",
				Status:         "Checked Out",
			},
			{
				Date:           today,
				StudentID:      "KNT-8045",
				ChildName:      "Ethan O'Connor",
				Photo:          "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250",
				Group:          "Junior Champions (Ages 7-9)",
				CheckInTime:    "09:15 AM",
				DropOffAdult:   "Fiona O'Connor (Mother)",
				PickupPin:      "930182",
				InstructorName: "Coach Michael Davies",
				Status:         "Checked In",
			},
			{
				Date:           today,
				StudentID:      "KNT-8042",
				ChildName:      "Maya Patel",
				Photo:          "https://images.unsplash.com/photo-1595454038955-4dfe8de81be8?auto=format&fit=crop&q=80&w=250",
				Group:          "Junior Champions (Ages 7-9)",
				CheckInTime:    "09:00 AM",
				DropOffAdult:   "Rajesh Patel (Father)",
				PickupPin:      "719304",
				InstructorName: "Coach Michael Davies",
				Status:         "Waiting Pickup",
			},
		}
		db.Create(&history)
	}

	// 4. Seed Settings
	var settingCount int64
	db.Model(&models.Setting{}).Count(&settingCount)
	if settingCount == 0 {
		fmt.Println("[Seed] Populating initial System Settings...")
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
			GroupsJSON:      `["Little Dragons (Ages 4-6)","Junior Champions (Ages 7-9)","Elite Athletes (Ages 10-14)"]`,
		}
		db.Create(&setting)
	}

	fmt.Println("[Seed] Initial database seeding completed successfully!")
}
