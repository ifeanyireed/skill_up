package main

import (
	"fmt"

	"checkin-backend/config"
	"checkin-backend/models"
)

func main() {
	db := config.InitDB()

	// Update existing admins to Program Supervisor
	res := db.Model(&models.User{}).Where("role IN ?", []string{"Lead Admin", "Administrator", "Admin"}).Update("role", "Program Supervisor")
	fmt.Printf("Updated %d users to Program Supervisor\n", res.RowsAffected)

	// Create a new Super Admin
	superAdmin := models.User{
		FullName:      "Super Admin",
		Email:         "superadmin@skillup.org",
		Phone:         "+234 800 111 0000",
		Role:          "Super Admin",
		AssignedGroup: "All Groups",
		Status:        "Active",
		Avatar:        "/avatars/character1.jpg",
		PasswordHash:  "skillup2026",
		LastLogin:     "Never",
	}

	var existing models.User
	if err := db.Where("email = ?", superAdmin.Email).First(&existing).Error; err != nil {
		if err := db.Create(&superAdmin).Error; err != nil {
			fmt.Println("Error creating Super Admin:", err)
		} else {
			fmt.Println("Created Super Admin user successfully!")
		}
	} else {
		fmt.Println("Super Admin user already exists.")
	}
}
