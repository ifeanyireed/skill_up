package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dsn := "u859677653_check_in:*Reedb4b4@tcp(srv1427.hstgr.io:3306)/u859677653_check_in_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Open error: %v", err)
	}
	defer db.Close()

	fmt.Println("==========================================================================")
	fmt.Println("   DEDUPING ATTENDANCE LOGS IN MYSQL DATABASE")
	fmt.Println("==========================================================================")

	// Delete duplicate attendance logs, keeping the log with the highest ID (most complete record) for each student_id + date
	dedupeQuery := `
		DELETE a1 FROM attendance_logs a1
		INNER JOIN attendance_logs a2 
		ON a1.student_id = a2.student_id 
		AND a1.date = a2.date 
		AND a1.id < a2.id
	`
	res, err := db.Exec(dedupeQuery)
	if err != nil {
		fmt.Printf("[Error] Failed to dedupe logs: %v\n", err)
	} else {
		rowsAffected, _ := res.RowsAffected()
		fmt.Printf("[Success] Purged %d duplicate attendance log records!\n", rowsAffected)
	}

	// Add unique constraint to prevent future duplicate logs for the same student on the same day
	constraintQuery := `
		ALTER TABLE attendance_logs 
		ADD UNIQUE KEY idx_student_date (student_id, date)
	`
	_, err = db.Exec(constraintQuery)
	if err != nil {
		fmt.Printf("[Info] Unique constraint check: %v\n", err)
	} else {
		fmt.Println("[Success] Added UNIQUE KEY constraint on (student_id, date) to prevent future duplicate records!")
	}

	// Query total remaining logs for yesterday
	var count int
	db.QueryRow("SELECT COUNT(*) FROM attendance_logs WHERE date = '2026-07-27'").Scan(&count)
	fmt.Printf("\nTOTAL UNIQUE ATTENDANCE LOGS FOR YESTERDAY (2026-07-27): %d\n", count)
	fmt.Println("==========================================================================")
}
