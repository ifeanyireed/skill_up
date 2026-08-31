package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"checkin-backend/config"
	"checkin-backend/models"
)

// GET /api/documents
func GetDocuments(c *gin.Context) {
	audience := c.Query("audience") // "Parents" or "Staff"
	
	var docs []models.Document
	query := config.DB.Model(&models.Document{})
	
	if audience != "" {
		query = query.Where("target_audience = ?", audience)
	}

	if err := query.Order("id desc").Find(&docs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, docs)
}

// POST /api/admin/documents
func CreateDocument(c *gin.Context) {
	var input models.Document
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	input.TargetAudience = strings.TrimSpace(input.TargetAudience)
	if input.TargetAudience == "" {
		input.TargetAudience = "Parents"
	}

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, input)
}

// DELETE /api/admin/documents/:id
func DeleteDocument(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Document{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Document deleted successfully"})
}
