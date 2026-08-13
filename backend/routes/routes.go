package routes

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"checkin-backend/controllers"
)

func registerAPIRoutes(api *gin.RouterGroup) {
	// Auth
	api.POST("/auth/login", controllers.Login)

	// Children
	api.GET("/children", controllers.GetChildren)
	api.GET("/children/:id", controllers.GetChildByID)
	api.POST("/children", controllers.CreateChild)
	api.PUT("/children/:id", controllers.UpdateChild)
	api.POST("/children/:id/update", controllers.UpdateChild)
	api.POST("/children/update/:id", controllers.UpdateChild)
	api.PUT("/children/:id/status", controllers.UpdateChildStatus)
	api.POST("/children/:id/checkin", controllers.CheckInChild)
	api.POST("/children/checkout", controllers.CheckOutChild)
	api.DELETE("/children/:id", controllers.DeleteChild)
	api.POST("/children/:id/delete", controllers.DeleteChild)
	api.POST("/children/delete/:id", controllers.DeleteChild)
	api.DELETE("/children/delete/:id", controllers.DeleteChild)

	// Attendance
	api.GET("/attendance", controllers.GetAttendanceLogs)
	api.GET("/attendance/export", controllers.ExportAttendanceCSV)

	// Staff / Users
	api.GET("/users", controllers.GetUsers)
	api.POST("/users", controllers.CreateUser)
	api.PUT("/users/:id/toggle", controllers.ToggleUserStatus)

	// Settings & Admin Wipe
	api.GET("/settings", controllers.GetSettings)
	api.PUT("/settings", controllers.UpdateSettings)
	api.POST("/admin/wipe-test-data", controllers.WipeDatabase)

	// Learners Portal (Assignments, Notice Board, Events Calendar)
	api.GET("/assignments", controllers.GetAssignments)
	api.POST("/assignments", controllers.CreateAssignment)
	api.DELETE("/assignments/:id", controllers.DeleteAssignment)
	api.POST("/assignments/:id/submit", controllers.SubmitAssignment)

	api.GET("/notices", controllers.GetNotices)
	api.POST("/notices", controllers.CreateNotice)
	api.DELETE("/notices/:id", controllers.DeleteNotice)

	api.GET("/events", controllers.GetEvents)
	api.POST("/events", controllers.CreateEvent)
	api.DELETE("/events/:id", controllers.DeleteEvent)
}

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

	// API Routes Groups (Supports both /api and /api/v1)
	registerAPIRoutes(r.Group("/api"))
	registerAPIRoutes(r.Group("/api/v1"))

	return r
}
