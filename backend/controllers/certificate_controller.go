package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"checkin-backend/config"
	"checkin-backend/models"
)

// GET /api/admin/certificates
func GetCertificateConfigs(c *gin.Context) {
	var configs []models.CertificateConfig
	if err := config.DB.Find(&configs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, configs)
}

// POST /api/admin/certificates
func SaveCertificateConfig(c *gin.Context) {
	var input models.CertificateConfig
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.CertificateConfig
	if err := config.DB.Where("category_name = ?", input.CategoryName).First(&existing).Error; err == nil {
		// Update existing
		existing.CategoryType = input.CategoryType
		existing.TemplateURL = input.TemplateURL
		config.DB.Save(&existing)
		c.JSON(http.StatusOK, existing)
		return
	}

	// Create new
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, input)
}

// DELETE /api/admin/certificates/:id
func DeleteCertificateConfig(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.CertificateConfig{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

// GET /api/certificates/match?group=...&track=...
func MatchCertificate(c *gin.Context) {
	group := c.Query("group")
	track := c.Query("track")

	var configMatch models.CertificateConfig
	
	// Prioritize exact track match
	if track != "" && track != "N/A - Junior Camp" {
		if err := config.DB.Where("category_type = ? AND category_name = ?", "Track", track).First(&configMatch).Error; err == nil {
			c.JSON(http.StatusOK, gin.H{"template_url": configMatch.TemplateURL})
			return
		}
	}

	// Fallback to group match
	if group != "" {
		if err := config.DB.Where("category_type = ? AND category_name = ?", "Group", group).First(&configMatch).Error; err == nil {
			c.JSON(http.StatusOK, gin.H{"template_url": configMatch.TemplateURL})
			return
		}
	}

	// Default fallback if no match found
	c.JSON(http.StatusOK, gin.H{"template_url": "/certificate-template.png"})
}
