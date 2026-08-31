package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"checkin-backend/utils"
)

// SuperAdminOnly middleware ensures that the user is a Super Admin
func SuperAdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		if strings.ToLower(claims.Role) != "super admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized: Only Super Admin can perform this action"})
			c.Abort()
			return
		}

		// Proceed
		c.Set("userID", claims.UserID)
		c.Set("userRole", claims.Role)
		c.Next()
	}
}
