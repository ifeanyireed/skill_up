package controllers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"checkin-backend/config"
	"checkin-backend/models"
)

var parentJwtSecret = []byte("skillup-parent-secret-key-2026")

type ParentClaims struct {
	ParentID uint   `json:"parent_id"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func generateParentToken(parent models.Parent) (string, error) {
	expirationTime := time.Now().Add(7 * 24 * time.Hour) // 1 week
	claims := &ParentClaims{
		ParentID: parent.ID,
		Role:     "Parent",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(parentJwtSecret)
}

type ParentRegisterPayload struct {
	FullName string `json:"full_name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Phone    string `json:"phone" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// POST /api/parents/register
func RegisterParent(c *gin.Context) {
	var payload ParentRegisterPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cleanEmail := strings.TrimSpace(strings.ToLower(payload.Email))

	// Check if exists
	var count int64
	config.DB.Model(&models.Parent{}).Where("LOWER(email) = ?", cleanEmail).Count(&count)
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Parent account already exists with this email"})
		return
	}

	parent := models.Parent{
		FullName:     payload.FullName,
		Email:        cleanEmail,
		Phone:        payload.Phone,
		PasswordHash: payload.Password, // simple storage for now
	}

	if err := config.DB.Create(&parent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register parent account"})
		return
	}

	// Auto-link children where parent_email or parent_phone matches
	config.DB.Model(&models.Child{}).
		Where("LOWER(parent_email) = ? OR parent_phone = ?", cleanEmail, payload.Phone).
		Update("parent_id", parent.ID)

	token, _ := generateParentToken(parent)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Parent registered and children automatically linked!",
		"token":   token,
		"parent":  parent,
	})
}

type ParentLoginPayload struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// POST /api/parents/login
func LoginParent(c *gin.Context) {
	var payload ParentLoginPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cleanEmail := strings.TrimSpace(strings.ToLower(payload.Email))

	var parent models.Parent
	if err := config.DB.Where("LOWER(email) = ? OR phone = ?", cleanEmail, cleanEmail).First(&parent).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email/phone or account does not exist"})
		return
	}

	if parent.PasswordHash != payload.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	// Double check for any unlinked children (just in case they were registered after the parent)
	config.DB.Model(&models.Child{}).
		Where("parent_id IS NULL AND (LOWER(parent_email) = ? OR parent_phone = ?)", cleanEmail, parent.Phone).
		Update("parent_id", parent.ID)

	token, _ := generateParentToken(parent)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
		"parent":  parent,
	})
}

// ParentAuthMiddleware
func ParentAuthOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims := &ParentClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return parentJwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired parent token"})
			c.Abort()
			return
		}

		c.Set("parentID", claims.ParentID)
		c.Next()
	}
}

// GET /api/parents/children
func GetParentChildren(c *gin.Context) {
	parentID, exists := c.Get("parentID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var children []models.Child
	if err := config.DB.Where("parent_id = ?", parentID).Find(&children).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch linked children"})
		return
	}

	c.JSON(http.StatusOK, children)
}
