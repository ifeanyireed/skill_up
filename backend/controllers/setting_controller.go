package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"checkin-backend/config"
	"checkin-backend/models"
	"checkin-backend/seed"
)

// GET /api/settings
func GetSettings(c *gin.Context) {
	var setting models.Setting
	if err := config.DB.First(&setting).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"business_name":    "Skill Up Academy",
			"tagline":          "Child Training Check-In & Verification Portal",
			"business_email":   "safety@skillup.org",
			"business_phone":   "+1 (800) 555-SKILL",
			"code_length":      6,
			"auto_expire_hour": "20:00",
			"sms_enabled":      true,
			"require_phone":    true,
		})
		return
	}
	c.JSON(http.StatusOK, setting)
}

// PUT /api/settings
func UpdateSettings(c *gin.Context) {
	var setting models.Setting
	if err := config.DB.First(&setting).Error; err != nil {
		setting = models.Setting{}
	}

	if err := c.ShouldBindJSON(&setting); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&setting)
	c.JSON(http.StatusOK, setting)
}

// POST /api/admin/wipe-test-data
func WipeDatabase(c *gin.Context) {
	seed.WipeTestData(config.DB)
	c.JSON(http.StatusOK, gin.H{"message": "Database wiped clean for live production user testing!"})
}
