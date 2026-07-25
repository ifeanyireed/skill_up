package controllers

import (
	"bytes"
	"encoding/csv"
	"net/http"

	"github.com/gin-gonic/gin"

	"checkin-backend/config"
	"checkin-backend/models"
)

// GET /api/attendance
func GetAttendanceLogs(c *gin.Context) {
	CheckAndAutoTransitionWaitingPickup(config.DB)

	var logs []models.AttendanceLog
	query := config.DB

	date := c.Query("date")
	if date != "" {
		query = query.Where("date = ?", date)
	}

	search := c.Query("search")
	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("child_name LIKE ? OR student_id LIKE ? OR pickup_pin LIKE ?",
			searchTerm, searchTerm, searchTerm)
	}

	if err := query.Order("id desc").Find(&logs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, logs)
}

// GET /api/attendance/export
func ExportAttendanceCSV(c *gin.Context) {
	var logs []models.AttendanceLog
	date := c.Query("date")

	query := config.DB
	if date != "" {
		query = query.Where("date = ?", date)
	}
	query.Order("id desc").Find(&logs)

	b := &bytes.Buffer{}
	w := csv.NewWriter(b)

	// Write CSV Header
	w.Write([]string{
		"Date", "Student ID", "Child Name", "Group", "Status",
		"Check-In Time", "Drop-Off Adult", "Check-Out Time", "Pickup Adult", "PIN Code", "Instructor",
	})

	for _, l := range logs {
		w.Write([]string{
			l.Date, l.StudentID, l.ChildName, l.Group, l.Status,
			l.CheckInTime, l.DropOffAdult, l.CheckOutTime, l.PickupAdult, l.PickupPin, l.InstructorName,
		})
	}
	w.Flush()

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename=skillup_attendance_report.csv")
	c.Data(http.StatusOK, "text/csv", b.Bytes())
}
