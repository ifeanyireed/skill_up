package config

import (
	"fmt"
	"log"
	"os"
	"time"

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

	// Purge duplicate attendance records if any exist
	_ = db.Exec(`
		DELETE FROM attendance_logs WHERE id NOT IN (
			SELECT max_id FROM (
				SELECT MAX(id) as max_id FROM attendance_logs GROUP BY student_id, date
			) as tmp
		)
	`)

	// Safely drop old unique index if present so standard composite index can be created
	_ = db.Exec("ALTER TABLE attendance_logs DROP INDEX idx_student_date")

	err = db.AutoMigrate(
		&models.Child{},
		&models.AttendanceLog{},
		&models.User{},
		&models.Setting{},
	)
	if err != nil {
		fmt.Printf("[DB Warning] AutoMigrate notice: %v\n", err)
	} else {
		fmt.Println("[DB] Schema AutoMigration complete!")
	}

	DB = db

	// Implement aggressive connection pooling to prevent hitting max_connections_per_hour
	sqlDB, err := db.DB()
	if err == nil {
		sqlDB.SetMaxOpenConns(10)
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetConnMaxLifetime(4 * time.Hour)
	}

	return db
}
