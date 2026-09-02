package controllers

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"checkin-backend/config"
	"checkin-backend/models"
)

// Helper to generate a slug
func generateSlug(title string) string {
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	return slug
}

// GET /api/admin/forms
func GetForms(c *gin.Context) {
	var forms []models.Form
	if err := config.DB.Preload("Fields").Order("id desc").Find(&forms).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, forms)
}

// GET /api/admin/forms/:id
func GetFormByID(c *gin.Context) {
	id := c.Param("id")
	var form models.Form
	if err := config.DB.Preload("Fields").First(&form, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Form not found"})
		return
	}
	c.JSON(http.StatusOK, form)
}

// POST /api/admin/forms
func CreateForm(c *gin.Context) {
	var form models.Form
	if err := c.ShouldBindJSON(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	form.Slug = generateSlug(form.Title)

	// Sanitize options for MySQL JSON column
	for i := range form.Fields {
		if form.Fields[i].Options == "" {
			form.Fields[i].Options = "[]"
		}
	}

	var count int64
	config.DB.Model(&models.Form{}).Where("slug = ?", form.Slug).Count(&count)
	if count > 0 {
		form.Slug = fmt.Sprintf("%s-%d", form.Slug, time.Now().Unix())
	}

	if err := config.DB.Create(&form).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, form)
}

// PUT /api/admin/forms/:id
func UpdateForm(c *gin.Context) {
	id := c.Param("id")
	var form models.Form
	if err := config.DB.First(&form, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Form not found"})
		return
	}

	var updateData models.Form
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	form.Title = updateData.Title
	form.Description = updateData.Description
	form.IsActive = updateData.IsActive

	err := config.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(&form).Error; err != nil {
			return err
		}

		if err := tx.Where("form_id = ?", form.ID).Delete(&models.FormField{}).Error; err != nil {
			return err
		}

		for _, field := range updateData.Fields {
			field.ID = 0
			field.FormID = form.ID
			if field.Options == "" {
				field.Options = "[]"
			}
			if err := tx.Create(&field).Error; err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	config.DB.Preload("Fields").First(&form, id)
	c.JSON(http.StatusOK, form)
}

// DELETE /api/admin/forms/:id
func DeleteForm(c *gin.Context) {
	id := c.Param("id")
	
	if err := config.DB.Delete(&models.Form{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Form deleted successfully"})
}

// GET /api/admin/forms/:id/submissions
func GetFormSubmissions(c *gin.Context) {
	id := c.Param("id")
	var submissions []models.FormSubmission
	if err := config.DB.Where("form_id = ?", id).Order("id desc").Find(&submissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, submissions)
}

// GET /api/forms/:slug
func GetFormBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var form models.Form
	if err := config.DB.Preload("Fields").Where("slug = ? AND is_active = ?", slug, true).First(&form).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Form not found or inactive"})
		return
	}
	c.JSON(http.StatusOK, form)
}

// POST /api/forms/:slug/submit
func SubmitForm(c *gin.Context) {
	slug := c.Param("slug")
	var form models.Form
	if err := config.DB.Where("slug = ? AND is_active = ?", slug, true).First(&form).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Form not found or inactive"})
		return
	}

	rawData, err := c.GetRawData()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	submission := models.FormSubmission{
		FormID: form.ID,
		Data:   string(rawData),
	}

	if err := config.DB.Create(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Form submitted successfully!"})
}
