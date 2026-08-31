package main

import (
	"fmt"
	"checkin-backend/config"
	"checkin-backend/models"
)

func main() {
	config.InitDB()
	var parents []models.Parent
	config.DB.Where("email NOT LIKE ?", "%@skillup-parent.com").Limit(3).Find(&parents)
	
	fmt.Println("=== TEST PARENT ACCOUNTS ===")
	for _, p := range parents {
		fmt.Printf("Name: %s\nEmail: %s\nPhone: %s\nPassword: skillup2026\n\n", p.FullName, p.Email, p.Phone)
	}
}
