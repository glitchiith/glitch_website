package controller

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"strings"

	"github.com/Panshul-Jindal/glitch_website/backend/config"
	"github.com/Panshul-Jindal/glitch_website/backend/internal/schema"
	"github.com/gin-gonic/gin"
)

type Profile struct {
	UID       string `json:"uid"`
	Name      string `json:"name"`
	HostelID  *int   `json:"hostel_id"`
	BestScore *int   `json:"best_score"`
}

func GetUID(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"uid": c.GetString("uid")})
}

// Name and email come from verified Firebase claims, never request JSON.
func RegisterUser(c *gin.Context) {
	claims, _ := c.Get("claims")
	claimMap, _ := claims.(map[string]interface{})
	email, _ := claimMap["email"].(string)
	verified, _ := claimMap["email_verified"].(bool)
	if !verified || !strings.HasSuffix(strings.ToLower(email), "@iith.ac.in") {
		respondError(c, http.StatusForbidden, "Sign in with a verified IIT Hyderabad account.")
		return
	}

	name, _ := claimMap["name"].(string)
	if name == "" {
		name = strings.Split(email, "@")[0]
	}
	if len(name) > 255 {
		name = "Player"
	}

	_, err := config.DB.ExecContext(c.Request.Context(), `
		INSERT INTO "CompetitionPlayer"(uid, name) VALUES($1, $2)
		ON CONFLICT(uid) DO UPDATE SET name = EXCLUDED.name`,
		c.GetString("uid"), name,
	)
	if err != nil {
		respondInternalError(c, err)
		return
	}
	respondWithProfile(c)
}

func GetProfile(c *gin.Context) {
	respondWithProfile(c)
}

func respondWithProfile(c *gin.Context) {
	profile, err := findProfile(c.Request.Context(), c.GetString("uid"))
	if errors.Is(err, sql.ErrNoRows) {
		respondError(c, http.StatusNotFound, "Complete registration first.")
		return
	}
	if err != nil {
		respondInternalError(c, err)
		return
	}
	c.JSON(http.StatusOK, profile)
}

func findProfile(ctx context.Context, uid string) (Profile, error) {
	var profile Profile
	err := config.DB.QueryRowContext(ctx, `
		SELECT uid, name, hostel_id, best_score
		FROM "CompetitionPlayer"
		WHERE uid = $1`, uid,
	).Scan(&profile.UID, &profile.Name, &profile.HostelID, &profile.BestScore)
	return profile, err
}

func SelectHostel(c *gin.Context) {
	var request struct {
		HostelID int `json:"hostel_id"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		respondError(c, http.StatusBadRequest, "Choose a hostel.")
		return
	}
	if _, exists := schema.HOSTELS[request.HostelID]; !exists {
		respondError(c, http.StatusBadRequest, "Unknown hostel.")
		return
	}

	result, err := config.DB.ExecContext(c.Request.Context(), `
		UPDATE "CompetitionPlayer"
		SET hostel_id = $2
		WHERE uid = $1 AND (hostel_id IS NULL OR hostel_id = $2)`,
		c.GetString("uid"), request.HostelID,
	)
	if err != nil {
		respondInternalError(c, err)
		return
	}
	rows, err := result.RowsAffected()
	if err != nil {
		respondInternalError(c, err)
		return
	}
	if rows == 0 {
		respondError(c, http.StatusConflict, "Hostel selection is locked or registration is missing.")
		return
	}
	respondWithProfile(c)
}

func GetHostels(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"hostels": schema.HOSTELS})
}
