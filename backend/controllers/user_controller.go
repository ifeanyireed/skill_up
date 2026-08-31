package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"checkin-backend/config"
	"checkin-backend/models"
	"checkin-backend/utils"
)

// GET /api/users
func GetUsers(c *gin.Context) {
	var users []models.User
	if err := config.DB.Order("id desc").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

// POST /api/users
func CreateUser(c *gin.Context) {
	var u models.User
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if u.Status == "" {
		u.Status = "Active"
	}
	if u.PasswordHash == "" {
		u.PasswordHash = "skillup2026"
	}
	if u.Avatar == "" {
		u.Avatar = "/avatars/character1.jpg"
	}

	var existing models.User
	if err := config.DB.Where("LOWER(email) = LOWER(?)", u.Email).First(&existing).Error; err == nil {
		existing.FullName = u.FullName
		existing.Status = u.Status
		if u.Avatar != "" {
			existing.Avatar = u.Avatar
		}
		if u.Role != "" {
			existing.Role = u.Role
		}
		config.DB.Save(&existing)
		c.JSON(http.StatusOK, existing)
		return
	}

	if err := config.DB.Create(&u).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, u)
}

// PUT /api/users/:id/toggle
func ToggleUserStatus(c *gin.Context) {
	id := c.Param("id")
	var u models.User
	if err := config.DB.First(&u, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Staff account not found"})
		return
	}

	if u.Status == "Active" {
		u.Status = "Disabled"
	} else {
		u.Status = "Active"
	}

	config.DB.Save(&u)
	c.JSON(http.StatusOK, u)
}

// POST /api/auth/login
type LoginPayload struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var payload LoginPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cleanEmail := strings.TrimSpace(strings.ToLower(payload.Email))

	var user models.User
	if err := config.DB.Where("LOWER(email) = ? AND status = ?", cleanEmail, "Active").First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials or account disabled"})
		return
	}

	if user.PasswordHash != payload.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Authentication successful",
		"token":   token,
		"user":    user,
	})
}
