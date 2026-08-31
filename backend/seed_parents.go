package main

import (
	"fmt"
	"log"
	"strings"

	"checkin-backend/config"
	"checkin-backend/models"
)

func main() {
	config.InitDB()

	var children []models.Child
	if err := config.DB.Find(&children).Error; err != nil {
		log.Fatalf("Failed to fetch children: %v", err)
	}

	parentsCreated := 0
	childrenLinked := 0

	for _, child := range children {
		if child.ParentEmail == "" {
			continue // Can't seed a parent account without an email for login
		}

		cleanEmail := strings.TrimSpace(strings.ToLower(child.ParentEmail))

		// Check if parent already exists
		var parent models.Parent
		if err := config.DB.Where("LOWER(email) = ?", cleanEmail).First(&parent).Error; err != nil {
			// Parent doesn't exist, create it
			parent = models.Parent{
				FullName:     child.ParentName,
				Email:        cleanEmail,
				Phone:        child.ParentPhone,
				PasswordHash: "skillup2026", // Default password for seeded accounts
			}
			if createErr := config.DB.Create(&parent).Error; createErr != nil {
				fmt.Printf("Error creating parent for %s: %v\n", cleanEmail, createErr)
				continue
			}
			parentsCreated++
		}

		// Link child to this parent if not already linked
		if child.ParentID == nil || *child.ParentID != parent.ID {
			if updateErr := config.DB.Model(&child).Update("parent_id", parent.ID).Error; updateErr != nil {
				fmt.Printf("Error linking child %s to parent %s: %v\n", child.FullName, cleanEmail, updateErr)
			} else {
				childrenLinked++
			}
		}
	}

	fmt.Printf("Seeding Complete!\n")
	fmt.Printf("Parents Created: %d\n", parentsCreated)
	fmt.Printf("Children Linked: %d\n", childrenLinked)
	fmt.Printf("Default Parent Password: skillup2026\n")
}
