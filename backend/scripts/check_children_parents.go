package main

import (
	"fmt"
	"log"

	"checkin-backend/config"
	"checkin-backend/models"
)

func main() {
	// Initialize database connection
	config.InitDB()

	var children []models.Child
	if err := config.DB.Find(&children).Error; err != nil {
		log.Fatalf("Failed to fetch children: %v", err)
	}

	fmt.Printf("Found %d children in the database:\n", len(children))
	fmt.Println("---------------------------------------------------------")
	for _, child := range children {
		parentEmail := child.ParentEmail
		if parentEmail == "" {
			parentEmail = "[No Email Provided]"
		}
		
		parentPhone := child.ParentPhone
		if parentPhone == "" {
			parentPhone = "[No Phone Provided]"
		}

		fmt.Printf("Student: %s (ID: %s)\n", child.FullName, child.StudentID)
		fmt.Printf("Parent Name: %s\n", child.ParentName)
		fmt.Printf("Parent Email: %s\n", parentEmail)
		fmt.Printf("Parent Phone: %s\n", parentPhone)
		
		if child.ParentID != nil {
			fmt.Printf("Linked to Parent Account ID: %d\n", *child.ParentID)
		} else {
			fmt.Printf("Linked to Parent Account ID: [Not Linked Yet]\n")
		}
		fmt.Println("---------------------------------------------------------")
	}
}
