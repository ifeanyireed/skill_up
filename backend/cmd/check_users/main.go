package main

import (
	"fmt"

	"checkin-backend/config"
	"checkin-backend/models"
)

func main() {
	fmt.Println("==========================================================================")
	fmt.Println("   CHECKING & SEEDING INSTRUCTORS IN MYSQL DB")
	fmt.Println("==========================================================================")

	db := config.InitDB()

	// Ensure Bridget Blover exists in database
	targetEmail := "bridgetblover@gmail.com"
	var bridget models.User
	err := db.Where("LOWER(email) = LOWER(?)", targetEmail).First(&bridget).Error
	if err != nil {
		fmt.Printf("[DB] Adding missing instructor: Bridget Blover (%s)\n", targetEmail)
		newInstructor := models.User{
			FullName:      "Bridget Blover",
			Email:         targetEmail,
			Phone:         "+234 800 000 7788",
			Role:          "Instructor",
			AssignedGroup: "Junior Champions (Ages 11-19)",
			Status:        "Active",
			Avatar:        "/avatars/character4.jpg",
			PasswordHash:  "skillup2026",
			LastLogin:     "Just now",
		}
		if err := db.Create(&newInstructor).Error; err != nil {
			fmt.Printf("[Error] Failed to create instructor: %v\n", err)
		} else {
			fmt.Println("[Success] Added Bridget Blover to MySQL users table!")
		}
	} else {
		fmt.Printf("[DB] Instructor already exists: %s (%s) - Role: %s\n", bridget.FullName, bridget.Email, bridget.Role)
	}

	// Fetch all users
	var allUsers []models.User
	db.Order("id asc").Find(&allUsers)

	fmt.Println("\n--------------------------------------------------------------------------")
	fmt.Printf("   TOTAL INSTRUCTORS & ADMINS IN DATABASE: %d\n", len(allUsers))
	fmt.Println("--------------------------------------------------------------------------")
	for idx, u := range allUsers {
		fmt.Printf(" %d. ID: %d | %s | %s | Role: %s | Group: %s | Status: %s\n",
			idx+1, u.ID, u.FullName, u.Email, u.Role, u.AssignedGroup, u.Status)
	}
	fmt.Println("==========================================================================")
}
