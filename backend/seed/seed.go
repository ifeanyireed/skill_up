package seed

import (
	"fmt"

	"gorm.io/gorm"

	"checkin-backend/models"
)

// EnsureSystemSetup ensures default system settings and the 3 Lead Administrator accounts exist on startup WITHOUT wiping instructors or children.
func EnsureSystemSetup(db *gorm.DB) {
	// 1. Ensure Default System Settings exist
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
			GroupsJSON:      `["Little Dragons (Ages 4-10)","Junior Champions (Ages 11-19)"]`,
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
		{
			FullName:      "Bridget Blover",
			Email:         "bridgetblover@gmail.com",
			Phone:         "+234 800 111 0004",
			Role:          "Instructor",
			AssignedGroup: "Junior Champions (Ages 11-19)",
			Status:        "Active",
			Avatar:        "/avatars/character4.jpg",
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

	// 4. Ensure initial Assignments exist
	var assignmentCount int64
	db.Model(&models.Assignment{}).Count(&assignmentCount)
	if assignmentCount == 0 {
		fmt.Println("[Setup] Initializing sample Assignments...")
		assignments := []models.Assignment{
			{
				Title:       "Python Basics: Build a Calculator",
				Description: "Create a simple Python command-line calculator that performs addition, subtraction, multiplication, and division. Submit your .py file or GitHub link.",
				Subject:     "Python Programming",
				DueDate:     "2026-08-20",
				TotalPoints: 100,
				Status:      "Active",
				Group:       "Junior Champions (Ages 11-19)",
				Instructor:  "Bridget Blover",
			},
			{
				Title:       "Scratch Game: Space Dodge Challenge",
				Description: "Design an interactive game on Scratch where your sprite dodges falling asteroids. Use variables for scores and lives.",
				Subject:     "Scratch & Logic",
				DueDate:     "2026-08-22",
				TotalPoints: 100,
				Status:      "Active",
				Group:       "Little Dragons (Ages 4-10)",
				Instructor:  "Grace Solomon",
			},
			{
				Title:       "Web Development: Personal Portfolio HTML/CSS",
				Description: "Build a responsive single-page portfolio featuring your bio, skills, and favorite projects using semantic HTML5 and custom CSS styles.",
				Subject:     "Web Development",
				DueDate:     "2026-08-25",
				TotalPoints: 100,
				Status:      "Active",
				Group:       "Junior Champions (Ages 11-19)",
				Instructor:  "Ifeanyi Reed",
			},
		}
		for _, a := range assignments {
			db.Create(&a)
		}
	}

	// 5. Ensure initial Notices exist
	var noticeCount int64
	db.Model(&models.Notice{}).Count(&noticeCount)
	if noticeCount == 0 {
		fmt.Println("[Setup] Initializing sample Notice Board...")
		notices := []models.Notice{
			{
				Title:       "🚀 Summer Tech Showcase & Hackathon 2026",
				Content:     "We are thrilled to announce our upcoming Tech Showcase! All learners are invited to present their final projects in Python, Scratch, and Web Dev to parents and guest judges. Prizes and certificates will be awarded.",
				Category:    "Event",
				Urgency:     "High",
				Author:      "Christiana Okokon",
				IsPinned:    true,
				TargetGroup: "All",
			},
			{
				Title:       "📢 CBT Centre Laptop Setup & Guidelines",
				Content:     "Learners attending the CBT Centre lab sessions must ensure their assigned laptops are fully charged before morning classes. Chargers should be labeled with student IDs.",
				Category:    "Academic",
				Urgency:     "Normal",
				Author:      "Grace Solomon",
				IsPinned:    false,
				TargetGroup: "All",
			},
			{
				Title:       "🏆 PuzzlePro Championship Leaderboard Update",
				Content:     "Congratulations to all students who completed Level 5 in PuzzlePro this week! Check out the updated leaderboard in your learner dashboard.",
				Category:    "General",
				Urgency:     "Normal",
				Author:      "Bridget Blover",
				IsPinned:    false,
				TargetGroup: "All",
			},
		}
		for _, n := range notices {
			db.Create(&n)
		}
	}

	// 6. Ensure initial Events exist
	var eventCount int64
	db.Model(&models.Event{}).Count(&eventCount)
	if eventCount == 0 {
		fmt.Println("[Setup] Initializing sample Events Calendar...")
		events := []models.Event{
			{
				Title:       "Robotics & AI Hands-On Workshop",
				Description: "Live demo and workshop on building sensor-based robots and beginner AI models.",
				EventType:   "Workshop",
				Location:    "CBT Centre Lab A",
				EventDate:   "2026-08-18",
				StartTime:   "10:00 AM",
				EndTime:     "12:30 PM",
				Organizer:   "Ifeanyi Reed",
				TargetGroup: "All",
			},
			{
				Title:       "Web Design & UI/UX Live Masterclass",
				Description: "Interactive session covering color theory, grid layouts, and modern CSS techniques.",
				EventType:   "Webinar",
				Location:    "Raji Rasaki Centre / Online Stream",
				EventDate:   "2026-08-21",
				StartTime:   "02:00 PM",
				EndTime:     "04:00 PM",
				Organizer:   "Christiana Okokon",
				TargetGroup: "Junior Champions (Ages 11-19)",
			},
			{
				Title:       "Python Project Submission Deadline",
				Description: "Final deadline to submit your Python Calculator project on the Learners portal.",
				EventType:   "Deadline",
				Location:    "Online Submission",
				EventDate:   "2026-08-20",
				StartTime:   "11:59 PM",
				EndTime:     "11:59 PM",
				Organizer:   "Bridget Blover",
				TargetGroup: "All",
			},
			{
				Title:       "Summer Tech Camp Graduation & Awards Ceremony",
				Description: "Celebration ceremony for all graduating students with project presentations and award distributions.",
				EventType:   "Competition",
				Location:    "Main Auditorium & Virtual Live",
				EventDate:   "2026-08-28",
				StartTime:   "11:00 AM",
				EndTime:     "03:00 PM",
				Organizer:   "Skill Up Academy Team",
				TargetGroup: "All",
			},
		}
		for _, e := range events {
			db.Create(&e)
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
