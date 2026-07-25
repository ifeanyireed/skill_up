package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"checkin-backend/models"
)

var DB *gorm.DB

func InitDB() *gorm.DB {
	// Attempt to load .env file if available
	if err := godotenv.Load(); err != nil {
		fmt.Println("[Config] No .env file found or error loading it, reading system environment variables.")
	}

	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "srv1427.hstgr.io"
	}
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "3306"
	}
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "u859677653_check_in"
	}
	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		password = "*Reedb4b4"
	}
	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "u859677653_check_in_db"
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, password, host, port, dbname)

	fmt.Printf("[DB] Connecting to MySQL at %s:%s / DB: %s ...\n", host, port, dbname)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("[DB Error] Failed to connect to MySQL database: %v", err)
	}

	fmt.Println("[DB] Successfully connected to MySQL database!")

	// Auto Migrate schemas
	fmt.Println("[DB] AutoMigrating schema tables...")
	err = db.AutoMigrate(
		&models.Child{},
		&models.AttendanceLog{},
		&models.User{},
		&models.Setting{},
	)
	if err != nil {
		log.Fatalf("[DB Error] Failed to migrate database schemas: %v", err)
	}

	fmt.Println("[DB] Schema AutoMigration complete!")
	DB = db
	return db
}
