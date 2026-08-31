package main

import (
	"fmt"
	"checkin-backend/config"
	"checkin-backend/models"
)

func main() {
	config.InitDB()
	fmt.Println("Attempting manual migration...")
	err := config.DB.AutoMigrate(&models.Parent{})
	if err != nil {
		fmt.Printf("MIGRATION ERROR: %v\n", err)
	} else {
		fmt.Println("MIGRATION SUCCESS")
	}
}
