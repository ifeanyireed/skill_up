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
		query = query.Where("child_name LIKE ? OR student_id LIKE ? OR pickup_pin LIKE ? OR drop_off_adult LIKE ? OR pickup_adult LIKE ?",
			searchTerm, searchTerm, searchTerm, searchTerm, searchTerm)
	}

	status := c.Query("status")
	if status != "" && status != "all" {
		query = query.Where("status = ?", status)
	}

	group := c.Query("group")
	if group != "" && group != "all" {
		query = query.Where("`group` = ?", group)
	}

	center := c.Query("center")
	if center != "" && center != "all" {
		query = query.Where("center = ?", center)
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
		"Check-In Time", "Drop-Off Adult", "Check-In Triggered By",
		"Check-Out Time", "Pickup Adult", "Check-Out Triggered By", "PIN Code",
	})

	for _, l := range logs {
		checkOutStaff := l.CheckOutInstructor
		if checkOutStaff == "" && l.CheckOutTime != "" {
			checkOutStaff = l.InstructorName
		}
		w.Write([]string{
			l.Date, l.StudentID, l.ChildName, l.Group, l.Status,
			l.CheckInTime, l.DropOffAdult, l.InstructorName,
			l.CheckOutTime, l.PickupAdult, checkOutStaff, l.PickupPin,
		})
	}
	w.Flush()

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename=skillup_attendance_report.csv")
	c.Data(http.StatusOK, "text/csv", b.Bytes())
}
