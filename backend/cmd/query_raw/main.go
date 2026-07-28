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

	rows, err := db.Query("SELECT id, full_name, email, role, assigned_group, status FROM users WHERE deleted_at IS NULL")
	if err != nil {
		log.Fatalf("Query error: %v", err)
	}
	defer rows.Close()

	fmt.Println("=== EXACT MYSQL USERS TABLE CONTENTS ===")
	count := 0
	for rows.Next() {
		var id int
		var fullName, email, role, group, status sql.NullString
		if err := rows.Scan(&id, &fullName, &email, &role, &group, &status); err != nil {
			log.Fatalf("Scan error: %v", err)
		}
		count++
		fmt.Printf("#%d | ID: %d | Name: %s | Email: %s | Role: %s | Group: %s | Status: %s\n",
			count, id, fullName.String, email.String, role.String, group.String, status.String)
	}
	fmt.Printf("TOTAL INSTRUCTORS FOUND IN DB: %d\n", count)
	fmt.Println("=========================================")
}
