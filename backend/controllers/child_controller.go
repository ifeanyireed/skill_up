package controllers

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"checkin-backend/config"
	"checkin-backend/models"
)

// GET /api/children
func GetChildren(c *gin.Context) {
	var children []models.Child
	query := config.DB

	status := c.Query("status")
	if status != "" && status != "all" {
		query = query.Where("status = ?", status)
	}

	center := c.Query("center")
	if center != "" && center != "all" {
		query = query.Where("center = ?", center)
	}

	search := c.Query("search")
	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("full_name LIKE ? OR student_id LIKE ? OR parent_name LIKE ? OR active_code LIKE ? OR center LIKE ?",
			searchTerm, searchTerm, searchTerm, searchTerm, searchTerm)
	}

	if err := query.Order("id desc").Find(&children).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, children)
}

// GET /api/children/:id
func GetChildByID(c *gin.Context) {
	id := c.Param("id")
	var child models.Child

	if err := config.DB.First(&child, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Child student not found"})
		return
	}

	c.JSON(http.StatusOK, child)
}

// POST /api/children
func CreateChild(c *gin.Context) {
	var child models.Child
	if err := c.ShouldBindJSON(&child); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if child.StudentID == "" {
		child.StudentID = fmt.Sprintf("KNT-%d", rand.Intn(9000)+1000)
	}
	if child.Center == "" {
		child.Center = "Raji Rasaki Centre"
	}
	child.Status = "Not Checked In"

	if err := config.DB.Create(&child).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, child)
}

// PUT /api/children/:id/status
type StatusUpdateInput struct {
	Status string `json:"status" binding:"required"`
}

func UpdateChildStatus(c *gin.Context) {
	id := c.Param("id")
	var child models.Child
	if err := config.DB.First(&child, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Child student record not found"})
		return
	}

	var input StatusUpdateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	child.Status = input.Status
	config.DB.Save(&child)

	// Sync status to Attendance Log for today
	config.DB.Model(&models.AttendanceLog{}).
		Where("student_id = ? AND date = ?", child.StudentID, time.Now().Format("2006-01-02")).
		Update("status", input.Status)

	c.JSON(http.StatusOK, child)
}

// POST /api/children/:id/checkin
type CheckInInput struct {
	AdultName   string `json:"adult_name" binding:"required"`
	AdultPhone  string `json:"adult_phone" binding:"required"`
	Center      string `json:"center"`
	Rel         string `json:"relationship"`
	Notes       string `json:"notes"`
	CheckInTime string `json:"check_in_time"`
}

func CheckInChild(c *gin.Context) {
	id := c.Param("id")
	var child models.Child
	if err := config.DB.First(&child, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Child not found"})
		return
	}

	var input CheckInInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Center != "" {
		child.Center = input.Center
	}
	if child.Center == "" {
		child.Center = "Raji Rasaki Centre"
	}

	// Generate random 6-digit PIN
	pin := strconv.Itoa(rand.Intn(900000) + 100000)
	nowTime := input.CheckInTime
	if nowTime == "" {
		nowTime = time.Now().Format("03:04 PM")
	}

	child.Status = "Checked In"
	child.ActiveCode = pin
	child.CheckInTime = nowTime

	if err := config.DB.Save(&child).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Record to Attendance Log
	logEntry := models.AttendanceLog{
		Date:           time.Now().Format("2006-01-02"),
		StudentID:      child.StudentID,
		ChildName:      child.FullName,
		Photo:          child.Photo,
		Center:         child.Center,
		Group:          child.Group,
		CheckInTime:    nowTime,
		DropOffAdult:   input.AdultName + " (" + input.Rel + ")",
		PickupPin:      pin,
		InstructorName: "Christiana Okokon",
		Status:         "Checked In",
	}
	config.DB.Create(&logEntry)

	c.JSON(http.StatusOK, gin.H{
		"message":       "Check-in successful",
		"child":         child,
		"pickup_pin":    pin,
		"check_in_time": nowTime,
	})
}

// POST /api/children/checkout
type CheckOutInput struct {
	StudentID  string `json:"student_id"`
	Pin        string `json:"pin" binding:"required"`
	Collector  string `json:"collector_name" binding:"required"`
	Phone      string `json:"collector_phone" binding:"required"`
	Rel        string `json:"relationship"`
	PickupTime string `json:"pickup_time"`
}

func CheckOutChild(c *gin.Context) {
	var input CheckOutInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var child models.Child
	query := config.DB.Where("active_code = ?", input.Pin)
	if input.StudentID != "" {
		query = query.Where("student_id = ?", input.StudentID)
	}

	if err := query.First(&child).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "VERIFICATION FAILED: Invalid 6-digit pickup PIN. Release blocked!",
		})
		return
	}

	nowTime := input.PickupTime
	if nowTime == "" {
		nowTime = time.Now().Format("03:04 PM")
	}

	child.Status = "Checked Out"
	child.CheckOutTime = nowTime

	if err := config.DB.Save(&child).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update Attendance Log
	config.DB.Model(&models.AttendanceLog{}).
		Where("student_id = ? AND date = ?", child.StudentID, time.Now().Format("2006-01-02")).
		Updates(map[string]interface{}{
			"check_out_time": nowTime,
			"pickup_adult":   input.Collector + " (" + input.Rel + ")",
			"status":         "Checked Out",
		})

	c.JSON(http.StatusOK, gin.H{
		"message":      "Pickup PIN verified! Child safely released.",
		"child":        child,
		"release_time": nowTime,
	})
}
