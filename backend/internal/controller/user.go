package controller

import (
	"bytes"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/Panshul-Jindal/glitch_website/backend/config"
	"github.com/Panshul-Jindal/glitch_website/backend/internal/helpers"
	"github.com/Panshul-Jindal/glitch_website/backend/internal/schema"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Profile struct {
	UID       string `json:"uid"`
	Name      string `json:"name"`
	HostelID  *int   `json:"hostel_id"`
	BestScore *int   `json:"best_score"`
}
type ScorePayload struct {
	RunID string `json:"runId"`
	Score *int32 `json:"score"`
}
type SubmissionResult struct {
	Status    string `json:"status"`
	RunID     string `json:"runId"`
	Score     int32  `json:"score"`
	BestScore int32  `json:"bestScore"`
	NewBest   bool   `json:"newBest"`
}

func failure(c *gin.Context, status int, message string) {
	c.AbortWithStatusJSON(status, gin.H{"error": message})
}
func internal(c *gin.Context, err error) {
	_ = c.Error(err)
	failure(c, 500, "Service unavailable. Please retry.")
}
func positiveEnv(key string, fallback int) int {
	n, err := strconv.Atoi(os.Getenv(key))
	if err != nil || n < 1 {
		return fallback
	}
	return n
}
func GetUID(c *gin.Context) { c.JSON(200, gin.H{"uid": c.GetString("uid")}) }

// The name and email come from verified Firebase claims, never request JSON.
func RegisterUser(c *gin.Context) {
	claims := c.MustGet("claims").(map[string]interface{})
	email, _ := claims["email"].(string)
	verified, _ := claims["email_verified"].(bool)
	if !verified || !strings.HasSuffix(strings.ToLower(email), "@iith.ac.in") {
		failure(c, 403, "Sign in with a verified IIT Hyderabad account.")
		return
	}
	name, _ := claims["name"].(string)
	if name == "" {
		name = strings.Split(email, "@")[0]
	}
	if len(name) > 255 {
		name = "Player"
	}
	_, err := config.DB.ExecContext(c.Request.Context(), `INSERT INTO "CompetitionPlayer"(uid,name) VALUES($1,$2)
 ON CONFLICT(uid) DO UPDATE SET name=EXCLUDED.name`, c.GetString("uid"), name)
	if err != nil {
		internal(c, err)
		return
	}
	GetProfile(c)
}
func GetProfile(c *gin.Context) {
	var p Profile
	err := config.DB.QueryRowContext(c.Request.Context(), `SELECT uid,name,hostel_id,best_score FROM "CompetitionPlayer" WHERE uid=$1`, c.GetString("uid")).Scan(&p.UID, &p.Name, &p.HostelID, &p.BestScore)
	if errors.Is(err, sql.ErrNoRows) {
		failure(c, 404, "Complete registration first.")
		return
	}
	if err != nil {
		internal(c, err)
		return
	}
	c.JSON(200, p)
}
func SelectHostel(c *gin.Context) {
	var req struct {
		HostelID int `json:"hostel_id"`
	}
	if c.ShouldBindJSON(&req) != nil {
		failure(c, 400, "Choose a hostel.")
		return
	}
	if _, ok := schema.HOSTELS[req.HostelID]; !ok {
		failure(c, 400, "Unknown hostel.")
		return
	}
	result, err := config.DB.ExecContext(c.Request.Context(), `UPDATE "CompetitionPlayer" SET hostel_id=$2 WHERE uid=$1 AND (hostel_id IS NULL OR hostel_id=$2)`, c.GetString("uid"), req.HostelID)
	if err != nil {
		internal(c, err)
		return
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		failure(c, 409, "Hostel selection is locked or registration is missing.")
		return
	}
	GetProfile(c)
}
func GetHostels(c *gin.Context) { c.JSON(200, gin.H{"hostels": schema.HOSTELS}) }

// Every write locks the player row first. This serializes per-player rate checks,
// run finalization, and best updates across backend processes.
func playerTransaction(c *gin.Context) (*sql.Tx, sql.NullInt64, error) {
	tx, err := config.DB.BeginTx(c.Request.Context(), nil)
	if err != nil {
		return nil, sql.NullInt64{}, err
	}
	var hostel, best sql.NullInt64
	err = tx.QueryRowContext(c.Request.Context(), `SELECT hostel_id,best_score FROM "CompetitionPlayer" WHERE uid=$1 FOR UPDATE`, c.GetString("uid")).Scan(&hostel, &best)
	if err != nil {
		tx.Rollback()
		return nil, best, err
	}
	if !hostel.Valid {
		tx.Rollback()
		return nil, best, fmt.Errorf("hostel_required")
	}
	return tx, best, nil
}
func transactionError(c *gin.Context, err error) {
	if errors.Is(err, sql.ErrNoRows) || err.Error() == "hostel_required" {
		failure(c, 409, "Register and confirm your hostel first.")
		return
	}
	internal(c, err)
}
func StartRun(c *gin.Context) {
	// Parse key before issuing any run; missing keys are configuration failures.
	key, err := helpers.ParsePrivateKey(os.Getenv("PRIVATE_KEY"))
	if err != nil {
		failure(c, 503, "Score encryption is not configured.")
		return
	}
	tx, _, err := playerTransaction(c)
	if err != nil {
		transactionError(c, err)
		return
	}
	defer tx.Rollback()
	var count int
	err = tx.QueryRowContext(c.Request.Context(), `SELECT count(*) FROM "GameRun" WHERE uid=$1 AND started_at>clock_timestamp()-interval '1 minute'`, c.GetString("uid")).Scan(&count)
	if err != nil {
		internal(c, err)
		return
	}
	if count >= positiveEnv("RUN_STARTS_PER_MINUTE", 30) {
		c.Header("Retry-After", "60")
		failure(c, 429, "Too many run starts. Try again shortly.")
		return
	}
	id := uuid.NewString()
	var expires time.Time
	err = tx.QueryRowContext(c.Request.Context(), `INSERT INTO "GameRun"(id,uid,expires_at) VALUES($1,$2,clock_timestamp()+make_interval(secs => $3)) RETURNING expires_at`, id, c.GetString("uid"), positiveEnv("RUN_TTL_SECONDS", 86400)).Scan(&expires)
	if err != nil {
		internal(c, err)
		return
	}
	if err = tx.Commit(); err != nil {
		internal(c, err)
		return
	}
	c.JSON(201, gin.H{"runId": id, "expiresAt": expires, "modulus": base64.StdEncoding.EncodeToString(key.N.Bytes()), "exponent": base64.StdEncoding.EncodeToString(big.NewInt(int64(key.E)).Bytes())})
}
func decodeScore(value string) (ScorePayload, error) {
	var p ScorePayload
	decoder := json.NewDecoder(bytes.NewBufferString(value))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&p); err != nil {
		return p, err
	}
	if err := decoder.Decode(new(interface{})); err != io.EOF {
		return p, fmt.Errorf("trailing data")
	}
	if _, err := uuid.Parse(p.RunID); err != nil {
		return p, err
	}
	if p.Score == nil || *p.Score < 0 {
		return p, fmt.Errorf("score must be a nonnegative 32-bit integer")
	}
	return p, nil
}
func SubmitScore(c *gin.Context) {
	tx, best, err := playerTransaction(c)
	if err != nil {
		transactionError(c, err)
		return
	}
	defer tx.Rollback()
	uid := c.GetString("uid")
	var attempts int
	err = tx.QueryRowContext(c.Request.Context(), `SELECT count(*) FROM "SubmissionAttempt" WHERE uid=$1 AND attempted_at>clock_timestamp()-interval '1 minute'`, uid).Scan(&attempts)
	if err != nil {
		internal(c, err)
		return
	}
	if attempts >= positiveEnv("SUBMISSIONS_PER_MINUTE", 60) {
		c.Header("Retry-After", "60")
		failure(c, 429, "Too many submissions. Retry shortly.")
		return
	}
	var payload ScorePayload
	// Do not log plaintext, tokens, or ciphertext. Retain only bounded parsed metadata.
	record := func(outcome string) error {
		var run interface{}
		if len(payload.RunID) <= 36 {
			run = payload.RunID
		}
		_, e := tx.ExecContext(c.Request.Context(), `INSERT INTO "SubmissionAttempt"(uid,run_id,score,outcome) VALUES($1,$2,$3,$4)`, uid, run, payload.Score, outcome)
		return e
	}
	reject := func(status int, reason string) {
		if e := record(reason); e != nil {
			internal(c, e)
			return
		}
		if e := tx.Commit(); e != nil {
			internal(c, e)
			return
		}
		failure(c, status, reason)
	}
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 8192)
	var req struct {
		Data string `json:"data"`
	}
	if c.ShouldBindJSON(&req) != nil || req.Data == "" {
		reject(400, "Invalid encrypted submission.")
		return
	}
	plaintext, err := helpers.DecryptRSA(req.Data, os.Getenv("PRIVATE_KEY"))
	if err != nil {
		reject(400, "Invalid encrypted submission.")
		return
	}
	payload, err = decodeScore(plaintext)
	if err != nil {
		payload = ScorePayload{}
		reject(400, "Invalid score payload.")
		return
	}
	var owner string
	var expired bool
	var previous sql.NullInt64
	var originalBest sql.NullInt64
	var originalNew sql.NullBool
	err = tx.QueryRowContext(c.Request.Context(), `SELECT uid,expires_at<clock_timestamp(),score,new_best,best_at_submission FROM "GameRun" WHERE id=$1 FOR UPDATE`, payload.RunID).Scan(&owner, &expired, &previous, &originalNew, &originalBest)
	if errors.Is(err, sql.ErrNoRows) {
		reject(404, "Run not found.")
		return
	}
	if err != nil {
		internal(c, err)
		return
	}
	if owner != uid {
		reject(403, "Run belongs to another player.")
		return
	}
	if previous.Valid {
		if previous.Int64 != int64(*payload.Score) {
			reject(409, "This run already has a different submitted score.")
			return
		}
		if err = record("duplicate"); err != nil {
			internal(c, err)
			return
		}
		if err = tx.Commit(); err != nil {
			internal(c, err)
			return
		}
		c.JSON(200, SubmissionResult{"accepted", payload.RunID, *payload.Score, int32(originalBest.Int64), originalNew.Bool})
		return
	}
	if expired {
		reject(410, "Run expired. Start a new run.")
		return
	}
	newBest := !best.Valid || int64(*payload.Score) > best.Int64
	var acceptedAt time.Time
	err = tx.QueryRowContext(c.Request.Context(), `SELECT clock_timestamp()`).Scan(&acceptedAt)
	if err != nil {
		internal(c, err)
		return
	}
	if newBest {
		_, err = tx.ExecContext(c.Request.Context(), `UPDATE "CompetitionPlayer" SET best_score=$2,best_at=$3 WHERE uid=$1`, uid, *payload.Score, acceptedAt)
		if err != nil {
			internal(c, err)
			return
		}
		best = sql.NullInt64{Int64: int64(*payload.Score), Valid: true}
	}
	_, err = tx.ExecContext(c.Request.Context(), `UPDATE "GameRun" SET score=$2,submitted_at=$3,new_best=$4,best_at_submission=$5 WHERE id=$1`, payload.RunID, *payload.Score, acceptedAt, newBest, best.Int64)
	if err != nil {
		internal(c, err)
		return
	}
	if err = record("accepted"); err != nil {
		internal(c, err)
		return
	}
	if err = tx.Commit(); err != nil {
		internal(c, err)
		return
	}
	c.JSON(200, SubmissionResult{"accepted", payload.RunID, *payload.Score, int32(best.Int64), newBest})
}
