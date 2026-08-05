//go:build ignore

package main
import (
	"fmt"
	"checkin-backend/config"
)
func main() {
	db := config.InitDB()
	sqlDB, _ := db.DB()
	if err := sqlDB.Ping(); err != nil {
		fmt.Println("DB is DOWN:", err)
	} else {
		fmt.Println("DB is UP and responsive!")
	}
}
