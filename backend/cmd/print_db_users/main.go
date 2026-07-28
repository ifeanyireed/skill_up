package main

import (
	"fmt"
	"os"

	"checkin-backend/config"
	"checkin-backend/models"
)

func main() {
	db := config.InitDB()

	var users []models.User
	db.Where("deleted_at IS NULL").Order("id asc").Find(&users)

	out := "DATABASE LOOKUP RESULT:\n"
	out += fmt.Sprintf("TOTAL_USERS=%d\n", len(users))
	for i, u := range users {
		out += fmt.Sprintf("USER[%d]: ID=%d | Name=%s | Email=%s | Role=%s | Group=%s | Status=%s\n",
			i+1, u.ID, u.FullName, u.Email, u.Role, u.AssignedGroup, u.Status)
	}

	os.Stdout.WriteString("\n=== START DB REPORT ===\n" + out + "=== END DB REPORT ===\n")
}
