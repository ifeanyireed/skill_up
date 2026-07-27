package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"checkin-backend/config"
	"checkin-backend/models"
)

var characterAvatars = []string{
	"/avatars/character1.jpg", "/avatars/character2.jpg", "/avatars/character3.jpg",
	"/avatars/character4.jpg", "/avatars/character5.jpg", "/avatars/character6.jpg",
	"/avatars/character7.jpg", "/avatars/character8.jpg", "/avatars/character9.jpg",
	"/avatars/character10.jpg", "/avatars/character11.jpg", "/avatars/character12.jpg",
	"/avatars/character13.jpg", "/avatars/character14.jpg", "/avatars/character15.jpg",
	"/avatars/character16.jpg", "/avatars/character17.jpg", "/avatars/character18.jpg",
	"/avatars/character19.jpg", "/avatars/character20.jpg",
}

func toTitleCase(s string) string {
	s = strings.TrimSpace(s)
	if s == "" {
		return ""
	}
	words := strings.Fields(strings.ToLower(s))
	for i, w := range words {
		if len(w) > 0 {
			subwords := strings.Split(w, "-")
			for j, sw := range subwords {
				if len(sw) > 0 {
					subwords[j] = strings.ToUpper(string(sw[0])) + sw[1:]
				}
			}
			words[i] = strings.Join(subwords, "-")
		}
	}
	return strings.Join(words, " ")
}

func calculateAge(dobStr string) int {
	if dobStr == "" {
		return 10
	}
	t, err := time.Parse("2006-01-02", dobStr)
	if err != nil {
		return 10
	}
	now := time.Now()
	age := now.Year() - t.Year()
	if now.YearDay() < t.YearDay() {
		age--
	}
	if age <= 0 || age > 25 {
		return 10
	}
	return age
}

func parseAmount(amountStr string) float64 {
	re := regexp.MustCompile(`[^\d.]`)
	clean := re.ReplaceAllString(amountStr, "")
	if clean == "" {
		return 50000
	}
	val, err := strconv.ParseFloat(clean, 64)
	if err != nil || val <= 0 {
		return 50000
	}
	return val
}

func main() {
	rand.Seed(time.Now().UnixNano())

	fmt.Println("==========================================================================")
	fmt.Println("   SEEDING DATABASE FROM CSV: SKILLUP ACADEMY SUMMER TECH CAMP 2026")
	fmt.Println("   (Applying Title Case formatting to all Student and Parent Names)")
	fmt.Println("==========================================================================")

	db := config.InitDB()

	csvPath := "/Users/user/Downloads/check_in/SKILLUP ACADEMY SUMMER  TECH CAMP 2026.csv"
	if _, err := os.Stat(csvPath); os.IsNotExist(err) {
		abs, _ := filepath.Abs(csvPath)
		log.Fatalf("CSV File not found at path: %s (abs: %s)", csvPath, abs)
	}

	file, err := os.Open(csvPath)
	if err != nil {
		log.Fatalf("Failed to open CSV file: %v", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		log.Fatalf("Failed to read CSV file: %v", err)
	}

	if len(records) <= 1 {
		log.Fatalf("CSV file is empty or only contains header.")
	}

	header := records[0]
	fmt.Printf("[CSV] Total rows found in file: %d (Header: %d columns)\n", len(records)-1, len(header))

	createdCount := 0
	updatedCount := 0

	for idx, row := range records[1:] {
		if len(row) < 10 || strings.TrimSpace(row[1]) == "" {
			continue
		}

		studentName := toTitleCase(row[1])
		dob := strings.TrimSpace(row[2])
		gender := strings.TrimSpace(row[3])
		schoolName := toTitleCase(row[4])
		currentGrade := strings.TrimSpace(row[5])
		centerRaw := strings.TrimSpace(row[6])
		parentName := toTitleCase(row[7])
		parentPhone := strings.TrimSpace(row[8])
		altPhone := strings.TrimSpace(row[9])
		homeAddress := strings.TrimSpace(row[10])

		ageCategory := strings.TrimSpace(row[11])
		seniorTrack := strings.TrimSpace(row[12])
		ownsDevice := strings.TrimSpace(row[13])
		deviceType := strings.TrimSpace(row[14])
		amountRaw := strings.TrimSpace(row[15])
		_ = strings.TrimSpace(row[16]) // paymentStatusRaw
		paymentDate := strings.TrimSpace(row[17])
		hasMedical := strings.TrimSpace(row[18])
		referral := strings.TrimSpace(row[19])
		extraNotes := strings.TrimSpace(row[20])

		// Normalize Center
		center := "Raji Rasaki Centre"
		if strings.Contains(strings.ToLower(centerRaw), "festac") {
			center = "Festac Centre"
		} else if strings.Contains(strings.ToLower(centerRaw), "raji") {
			center = "Raji Rasaki Centre"
		}

		// Normalize Group
		group := "Junior Camp (5–10 years)"
		if strings.Contains(strings.ToLower(ageCategory), "senior") || strings.Contains(strings.ToLower(seniorTrack), "cyber") || strings.Contains(strings.ToLower(seniorTrack), "graphics") {
			group = "Senior Camp (11+ years)"
		}

		// Normalize Senior Track
		if group == "Senior Camp (11+ years)" && seniorTrack == "" {
			seniorTrack = "Graphics Design (Corel Draw) + Robotics"
		} else if !strings.Contains(group, "Senior") {
			seniorTrack = "N/A - Junior Camp"
		}

		// Normalize Gender
		if strings.EqualFold(gender, "m") || strings.EqualFold(gender, "boy") || strings.EqualFold(gender, "male") {
			gender = "Male"
		} else if strings.EqualFold(gender, "f") || strings.EqualFold(gender, "girl") || strings.EqualFold(gender, "female") {
			gender = "Female"
		}

		// Age calculation
		age := calculateAge(dob)

		// Amount & Payment Status (User Directive: "set them to paid")
		amountPaid := parseAmount(amountRaw)
		paymentStatus := "Full Payment" // Set to Paid as requested
		if paymentDate == "" {
			paymentDate = time.Now().Format("2006-01-02")
		}

		// Pick random avatar
		avatar := characterAvatars[rand.Intn(len(characterAvatars))]

		// Medical Notes
		medicalNotes := "None"
		if strings.EqualFold(hasMedical, "yes") && extraNotes != "" {
			medicalNotes = extraNotes
		} else if extraNotes != "" && extraNotes != "No" && extraNotes != "NONE" && extraNotes != "Nil" {
			medicalNotes = extraNotes
		}

		// Check if record exists by name or parent phone
		var existing models.Child
		err := db.Where("LOWER(full_name) = LOWER(?) OR parent_phone = ?", studentName, parentPhone).First(&existing).Error
		if err == nil {
			// Update existing record with Title Case name
			existing.FullName = studentName
			existing.ParentName = parentName
			existing.Center = center
			existing.Group = group
			existing.SeniorTrack = seniorTrack
			existing.SchoolName = schoolName
			existing.CurrentGrade = currentGrade
			existing.AltPhone = altPhone
			existing.HomeAddress = homeAddress
			existing.OwnsDevice = ownsDevice
			existing.DeviceType = deviceType
			existing.AmountPaid = amountPaid
			existing.PaymentStatus = paymentStatus
			existing.PaymentDate = paymentDate
			existing.ReferralSource = referral
			existing.AdditionalNotes = extraNotes
			existing.MedicalNotes = medicalNotes
			existing.ConsentGiven = true

			db.Save(&existing)
			updatedCount++
			fmt.Printf(" [%d/73] Updated Title Case: %s (%s) -> Paid\n", idx+1, studentName, existing.StudentID)
		} else {
			// Create new record with Title Case name
			studentID := fmt.Sprintf("KNT-%d", rand.Intn(9000)+1000)
			child := models.Child{
				StudentID:          studentID,
				FullName:           studentName,
				Photo:              avatar,
				Age:                age,
				Gender:             gender,
				DOB:                dob,
				Center:             center,
				Group:              group,
				SeniorTrack:        seniorTrack,
				ParentName:         parentName,
				ParentPhone:        parentPhone,
				ParentEmail:        "",
				ParentRelationship: "Parent",
				SchoolName:         schoolName,
				CurrentGrade:       currentGrade,
				AltPhone:           altPhone,
				HomeAddress:        homeAddress,
				OwnsDevice:         ownsDevice,
				DeviceType:         deviceType,
				AmountPaid:         amountPaid,
				PaymentStatus:      paymentStatus,
				PaymentDate:        paymentDate,
				ReferralSource:     referral,
				AdditionalNotes:    extraNotes,
				MedicalNotes:       medicalNotes,
				ConsentGiven:       true,
				Status:             "Not Checked In",
			}
			db.Create(&child)
			createdCount++
			fmt.Printf(" [%d/73] Created Title Case: %s (%s) -> Paid\n", idx+1, studentName, studentID)
		}
	}

	// Also format any pre-existing database records to Title Case
	var allChildren []models.Child
	db.Find(&allChildren)
	formattedCount := 0
	for _, c := range allChildren {
		titleFullName := toTitleCase(c.FullName)
		titleParentName := toTitleCase(c.ParentName)
		titleSchool := toTitleCase(c.SchoolName)

		if titleFullName != c.FullName || titleParentName != c.ParentName || titleSchool != c.SchoolName || c.PaymentStatus != "Full Payment" {
			c.FullName = titleFullName
			c.ParentName = titleParentName
			c.SchoolName = titleSchool
			c.PaymentStatus = "Full Payment"
			db.Save(&c)
			formattedCount++
		}
	}

	fmt.Println("==========================================================================")
	fmt.Printf("   SEEDING COMPLETE! Processed CSV: %d created, %d updated. Global Format: %d records formatted to Title Case & Paid.\n", createdCount, updatedCount, formattedCount)
	fmt.Println("==========================================================================")
}
