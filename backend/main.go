package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"checkin-backend/config"
	"checkin-backend/routes"
	"checkin-backend/seed"
)

func main() {
	// Load .env file at application entrypoint
	_ = godotenv.Load()

	fmt.Println("==========================================================================")
	fmt.Println("   SKILL UP ACADEMY CHECK-IN PORTAL — GORM MYSQL BACKEND INITIALIZER")
	fmt.Println("==========================================================================")

	// 1. Initialize Database & Run GORM AutoMigrate Schemas
	db := config.InitDB()

	// 2. Seed Initial Database Records if empty
	seed.SeedInitialData(db)

	// 3. Setup Routes & Start HTTP Server
	r := routes.SetupRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("\n[Server] Listening on http://0.0.0.0:%s ...\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("[Server Error] Failed to start HTTP server: %v", err)
	}
}
