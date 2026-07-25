package main

import (
	"fmt"
	"log"

	"checkin-backend/config"
	"checkin-backend/routes"
	"checkin-backend/seed"
)

func main() {
	fmt.Println("==========================================================================")
	fmt.Println("   SKILL UP ACADEMY CHECK-IN PORTAL — GORM MYSQL BACKEND INITIALIZER")
	fmt.Println("==========================================================================")

	// 1. Initialize Database & Run GORM AutoMigrate Schemas
	db := config.InitDB()

	// 2. Seed Initial Database Records if empty
	seed.SeedInitialData(db)

	// 3. Setup Routes & Start HTTP Server
	r := routes.SetupRouter()

	fmt.Println("\n[Server] Listening on http://localhost:8080 ...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("[Server Error] Failed to start HTTP server: %v", err)
	}
}
