package main

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dsn := "u859677653_check_in:*Reedb4b4@tcp(srv1427.hstgr.io:3306)/u859677653_check_in_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		fmt.Printf("DB open error: %v\n", err)
		return
	}
	defer db.Close()

	fmt.Println("==========================================================================")
	fmt.Println("   FULL DATABASE AUDIT: RECENT RECORDS ADDED TODAY (2026-07-28)")
	fmt.Println("==========================================================================")

	// 1. Check all Users (Active & Soft-deleted)
	rowsUsers, err := db.Query("SELECT id, full_name, email, role, created_at, deleted_at FROM users ORDER BY id DESC LIMIT 15")
	if err == nil {
		fmt.Println("\n--- 1. RECENT USERS / INSTRUCTORS IN DB ---")
		for rowsUsers.Next() {
			var id int
			var name, email, role sql.NullString
			var createdAt sql.NullString
			var deletedAt sql.NullString
			rowsUsers.Scan(&id, &name, &email, &role, &createdAt, &deletedAt)
			delStatus := "ACTIVE"
			if deletedAt.Valid && deletedAt.String != "" {
				delStatus = "SOFT-DELETED: " + deletedAt.String
			}
			fmt.Printf("User #%d: %s (%s) | Role: %s | Created: %s | Status: %s\n",
				id, name.String, email.String, role.String, createdAt.String, delStatus)
		}
		rowsUsers.Close()
	}

	// 2. Check Recent Children Registered
	rowsChildren, err := db.Query("SELECT id, student_id, full_name, parent_name, parent_phone, created_at, deleted_at FROM children ORDER BY id DESC LIMIT 15")
	if err == nil {
		fmt.Println("\n--- 2. RECENT CHILDREN REGISTERED IN DB ---")
		for rowsChildren.Next() {
			var id int
			var studentID, name, parentName, parentPhone, createdAt, deletedAt sql.NullString
			rowsChildren.Scan(&id, &studentID, &name, &parentName, &parentPhone, &createdAt, &deletedAt)
			delStatus := "ACTIVE"
			if deletedAt.Valid && deletedAt.String != "" {
				delStatus = "SOFT-DELETED: " + deletedAt.String
			}
			fmt.Printf("Child #%d (%s): %s | Parent: %s (%s) | Created: %s | %s\n",
				id, studentID.String, name.String, parentName.String, parentPhone.String, createdAt.String, delStatus)
		}
		rowsChildren.Close()
	}

	// 3. Check Recent Attendance Logs
	rowsLogs, err := db.Query("SELECT id, child_id, child_name, event, check_in_time, check_out_time, created_at FROM attendance_logs ORDER BY id DESC LIMIT 15")
	if err == nil {
		fmt.Println("\n--- 3. RECENT ATTENDANCE LOGS TODAY ---")
		for rowsLogs.Next() {
			var id, childID int
			var childName, event, inTime, outTime, createdAt sql.NullString
			rowsLogs.Scan(&id, &childID, &childName, &event, &inTime, &outTime, &createdAt)
			fmt.Printf("Log #%d: Child #%d (%s) | Event: %s | In: %s | Out: %s | Created: %s\n",
				id, childID, childName.String, event.String, inTime.String, outTime.String, createdAt.String)
		}
		rowsLogs.Close()
	}

	fmt.Println("==========================================================================")
}
