package routes

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"checkin-backend/controllers"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS Configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000", "*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health Check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "Skill Up Academy Check-In Backend"})
	})

	// API Routes Group
	api := r.Group("/api")
	{
		// Auth
		api.POST("/auth/login", controllers.Login)

		// Children
		api.GET("/children", controllers.GetChildren)
		api.GET("/children/:id", controllers.GetChildByID)
		api.POST("/children", controllers.CreateChild)
		api.POST("/children/:id/checkin", controllers.CheckInChild)
		api.POST("/children/checkout", controllers.CheckOutChild)

		// Attendance
		api.GET("/attendance", controllers.GetAttendanceLogs)
		api.GET("/attendance/export", controllers.ExportAttendanceCSV)

		// Staff / Users
		api.GET("/users", controllers.GetUsers)
		api.POST("/users", controllers.CreateUser)
		api.PUT("/users/:id/toggle", controllers.ToggleUserStatus)

		// Settings
		api.GET("/settings", controllers.GetSettings)
		api.PUT("/settings", controllers.UpdateSettings)
	}

	return r
}
