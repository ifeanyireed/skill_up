package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dsn := "u859677653_check_in:*Reedb4b4@tcp(srv1427.hstgr.io:3306)/u859677653_check_in_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Open error: %v", err)
	}
	defer db.Close()

	loc, _ := time.LoadLocation("Africa/Lagos")
	todayDate := time.Now().In(loc).Format("2006-01-02")
	yesterdayDate := time.Now().In(loc).AddDate(0, 0, -1).Format("2006-01-02")

	fmt.Println("==========================================================================")
	fmt.Printf("   FIXING ATTENDANCE LOGS FOR YESTERDAY (%s) & PAST DAYS\n", yesterdayDate)
	fmt.Println("==========================================================================")

	// 1. Inspect logs for yesterday
	rows, err := db.Query("SELECT id, date, student_id, child_name, check_in_time, check_out_time, status FROM attendance_logs WHERE date < ?", todayDate)
	if err != nil {
		log.Fatalf("Query error: %v", err)
	}

	countUpdated := 0
	for rows.Next() {
		var id int
		var date, studentID, childName, checkInTime, checkOutTime, status sql.NullString
		rows.Scan(&id, &date, &studentID, &childName, &checkInTime, &checkOutTime, &status)

		if status.String == "Waiting Pickup" || status.String == "Checked In" {
			outTime := checkOutTime.String
			if outTime == "" || outTime == "—" {
				outTime = "05:00 PM"
			}
			_, updateErr := db.Exec(
				"UPDATE attendance_logs SET status = 'Checked Out', check_out_time = ?, pickup_adult = COALESCE(NULLIF(pickup_adult, ''), 'Parent / Authorized Pickup') WHERE id = ?",
				outTime, id,
			)
			if updateErr == nil {
				countUpdated++
				fmt.Printf("Updated Log #%d | Date: %s | Student: %s (%s) -> Marked Checked Out (%s)\n",
					id, date.String, childName.String, studentID.String, outTime)
			}
		}
	}
	rows.Close()

	// 2. Reset live children status to 'Not Checked In' for a new day if they were checked out yesterday
	db.Exec("UPDATE children SET status = 'Not Checked In', active_code = '', check_in_time = '', check_out_time = '' WHERE status != 'Not Checked In'")

	fmt.Printf("\nSUCCESS: Updated %d attendance log records for yesterday (%s) to 'Checked Out'!\n", countUpdated, yesterdayDate)
	fmt.Println("Reset active children directory statuses for today's new check-in session.")
	fmt.Println("==========================================================================")
}
