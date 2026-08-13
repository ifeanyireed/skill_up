package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"checkin-backend/config"
	"checkin-backend/models"
)

// ── Assignments API ─────────────────────────────────────────────────────────

func GetAssignments(c *gin.Context) {
	var assignments []models.Assignment
	query := config.DB.Order("id desc")

	if group := c.Query("group"); group != "" && group != "all" {
		query = query.Where("`group` = ? OR `group` = 'All'", group)
	}

	if err := query.Find(&assignments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, assignments)
}

func CreateAssignment(c *gin.Context) {
	var a models.Assignment
	if err := c.ShouldBindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if a.Status == "" {
		a.Status = "Active"
	}
	if a.TotalPoints == 0 {
		a.TotalPoints = 100
	}
	if err := config.DB.Create(&a).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, a)
}

func DeleteAssignment(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Assignment{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Assignment deleted successfully"})
}

func SubmitAssignment(c *gin.Context) {
	var sub models.AssignmentSubmission
	if err := c.ShouldBindJSON(&sub); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sub.SubmittedAt = time.Now()
	if sub.Status == "" {
		sub.Status = "Submitted"
	}

	if err := config.DB.Create(&sub).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Increment submissions count on assignment
	config.DB.Model(&models.Assignment{}).Where("id = ?", sub.AssignmentID).UpdateColumn("submissions", config.DB.Raw("submissions + 1"))

	c.JSON(http.StatusCreated, sub)
}

// ── Notice Board API ────────────────────────────────────────────────────────

func GetNotices(c *gin.Context) {
	var notices []models.Notice
	if err := config.DB.Order("is_pinned desc, id desc").Find(&notices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, notices)
}

func CreateNotice(c *gin.Context) {
	var n models.Notice
	if err := c.ShouldBindJSON(&n); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if n.Category == "" {
		n.Category = "General"
	}
	if n.Urgency == "" {
		n.Urgency = "Normal"
	}
	if err := config.DB.Create(&n).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, n)
}

func DeleteNotice(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Notice{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Notice deleted successfully"})
}

// ── Events Calendar API ──────────────────────────────────────────────────────

func GetEvents(c *gin.Context) {
	var events []models.Event
	if err := config.DB.Order("event_date asc, start_time asc").Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}

func CreateEvent(c *gin.Context) {
	var e models.Event
	if err := c.ShouldBindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if e.EventType == "" {
		e.EventType = "Workshop"
	}
	if err := config.DB.Create(&e).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, e)
}

func DeleteEvent(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Event{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Event deleted successfully"})
}
