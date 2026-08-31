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
		email := strings.TrimSpace(strings.ToLower(child.ParentEmail))
		phone := strings.TrimSpace(child.ParentPhone)
		name := strings.TrimSpace(child.ParentName)

		if name == "" {
			name = "Parent of " + child.FullName
		}

		var parent models.Parent
		var err error

		if email != "" {
			// Check if parent exists by email
			err = config.DB.Where("LOWER(email) = ?", email).First(&parent).Error
		} else if phone != "" {
			// Check if parent exists by phone
			err = config.DB.Where("phone = ?", phone).First(&parent).Error
		} else {
			// No email and no phone, cannot create a login account securely
			continue
		}

		if err != nil {
			// Parent doesn't exist, create it
			newEmail := email
			if newEmail == "" {
				newEmail = phone + "@skillup-parent.com" // pseudo email
			}

			parent = models.Parent{
				FullName:     name,
				Email:        newEmail,
				Phone:        phone,
				PasswordHash: "skillup2026",
			}
			if createErr := config.DB.Create(&parent).Error; createErr != nil {
				fmt.Printf("Error creating parent for %s / %s: %v\n", email, phone, createErr)
				continue
			}
			parentsCreated++
		}

		// Link child to this parent if not already linked
		if child.ParentID == nil || *child.ParentID != parent.ID {
			if updateErr := config.DB.Model(&child).Update("parent_id", parent.ID).Error; updateErr != nil {
				fmt.Printf("Error linking child %s to parent %d: %v\n", child.FullName, parent.ID, updateErr)
			} else {
				childrenLinked++
			}
		}
	}

	fmt.Printf("Seeding V2 Complete!\n")
	fmt.Printf("New Parents Created: %d\n", parentsCreated)
	fmt.Printf("New Children Linked: %d\n", childrenLinked)
	fmt.Printf("Parents without an email can log in using their phone number.\n")
}
