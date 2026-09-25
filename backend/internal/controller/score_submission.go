package controller

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/Panshul-Jindal/glitch_website/backend/internal/helpers"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

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

type storedRun struct {
	owner            string
	expired          bool
	previousScore    sql.NullInt64
	wasNewBest       sql.NullBool
	bestAtSubmission sql.NullInt64
}

func SubmitScore(c *gin.Context) {
	if os.Getenv("GAME_ENABLED") != "true" {
		respondError(c, http.StatusServiceUnavailable, "The game is temporarily unavailable.")
		return
	}

	tx, bestScore, err := beginPlayerTransaction(c)
	if err != nil {
		respondTransactionError(c, err)
		return
	}
	defer tx.Rollback()

	uid := c.GetString("uid")
	limited, err := submissionLimitReached(c.Request.Context(), tx, uid)
	if err != nil {
		respondInternalError(c, err)
		return
	}
	if limited {
		c.Header("Retry-After", "60")
		respondError(c, http.StatusTooManyRequests, "Too many submissions. Retry shortly.")
		return
	}

	payload, err := readScorePayload(c)
	if err != nil {
		rejectSubmission(c, tx, uid, ScorePayload{}, http.StatusBadRequest, err.Error())
		return
	}

	run, err := findRunForUpdate(c.Request.Context(), tx, payload.RunID)
	if errors.Is(err, sql.ErrNoRows) {
		rejectSubmission(c, tx, uid, payload, http.StatusNotFound, "Run not found.")
		return
	}
	if err != nil {
		respondInternalError(c, err)
		return
	}
	if run.owner != uid {
		rejectSubmission(c, tx, uid, payload, http.StatusForbidden, "Run belongs to another player.")
		return
	}
	if run.previousScore.Valid {
		respondToRepeatedSubmission(c, tx, uid, payload, run)
		return
	}
	if run.expired {
		rejectSubmission(c, tx, uid, payload, http.StatusGone, "Run expired. Start a new run.")
		return
	}

	result, err := acceptSubmission(c.Request.Context(), tx, uid, payload, bestScore)
	if err != nil {
		respondInternalError(c, err)
		return
	}
	if err := recordSubmission(c.Request.Context(), tx, uid, payload, "accepted"); err != nil {
		respondInternalError(c, err)
		return
	}
	if err := tx.Commit(); err != nil {
		respondInternalError(c, err)
		return
	}
	c.JSON(http.StatusOK, result)
}

func submissionLimitReached(ctx context.Context, tx *sql.Tx, uid string) (bool, error) {
	var attempts int
	err := tx.QueryRowContext(ctx, `
		SELECT count(*)
		FROM "SubmissionAttempt"
		WHERE uid = $1 AND attempted_at > clock_timestamp() - interval '1 minute'`, uid,
	).Scan(&attempts)
	return attempts >= positiveEnv("SUBMISSIONS_PER_MINUTE", 60), err
}

func readScorePayload(c *gin.Context) (ScorePayload, error) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 8192)
	var request struct {
		Data string `json:"data"`
	}
	if err := c.ShouldBindJSON(&request); err != nil || request.Data == "" {
		return ScorePayload{}, errors.New("Invalid encrypted submission.")
	}
	plaintext, err := helpers.DecryptRSA(request.Data, os.Getenv("PRIVATE_KEY"))
	if err != nil {
		return ScorePayload{}, errors.New("Invalid encrypted submission.")
	}
	payload, err := decodeScore(plaintext)
	if err != nil {
		return ScorePayload{}, errors.New("Invalid score payload.")
	}
	return payload, nil
}

func decodeScore(value string) (ScorePayload, error) {
	var payload ScorePayload
	decoder := json.NewDecoder(bytes.NewBufferString(value))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&payload); err != nil {
		return payload, err
	}
	if err := decoder.Decode(new(interface{})); err != io.EOF {
		return payload, fmt.Errorf("trailing data")
	}
	if _, err := uuid.Parse(payload.RunID); err != nil {
		return payload, err
	}
	if payload.Score == nil || *payload.Score < 0 {
		return payload, fmt.Errorf("score must be a nonnegative 32-bit integer")
	}
	return payload, nil
}

func findRunForUpdate(ctx context.Context, tx *sql.Tx, runID string) (storedRun, error) {
	var run storedRun
	err := tx.QueryRowContext(ctx, `
		SELECT uid, expires_at < clock_timestamp(), score, new_best, best_at_submission
		FROM "GameRun"
		WHERE id = $1
		FOR UPDATE`, runID,
	).Scan(&run.owner, &run.expired, &run.previousScore, &run.wasNewBest, &run.bestAtSubmission)
	return run, err
}

func respondToRepeatedSubmission(c *gin.Context, tx *sql.Tx, uid string, payload ScorePayload, run storedRun) {
	if run.previousScore.Int64 != int64(*payload.Score) {
		rejectSubmission(c, tx, uid, payload, http.StatusConflict, "This run already has a different submitted score.")
		return
	}
	if err := recordSubmission(c.Request.Context(), tx, uid, payload, "duplicate"); err != nil {
		respondInternalError(c, err)
		return
	}
	if err := tx.Commit(); err != nil {
		respondInternalError(c, err)
		return
	}
	c.JSON(http.StatusOK, SubmissionResult{
		Status:    "accepted",
		RunID:     payload.RunID,
		Score:     *payload.Score,
		BestScore: int32(run.bestAtSubmission.Int64),
		NewBest:   run.wasNewBest.Bool,
	})
}

func acceptSubmission(ctx context.Context, tx *sql.Tx, uid string, payload ScorePayload, bestScore sql.NullInt64) (SubmissionResult, error) {
	var acceptedAt time.Time
	if err := tx.QueryRowContext(ctx, `SELECT clock_timestamp()`).Scan(&acceptedAt); err != nil {
		return SubmissionResult{}, err
	}

	newBest := !bestScore.Valid || int64(*payload.Score) > bestScore.Int64
	if newBest {
		_, err := tx.ExecContext(ctx, `
			UPDATE "CompetitionPlayer"
			SET best_score = $2, best_at = $3
			WHERE uid = $1`, uid, *payload.Score, acceptedAt)
		if err != nil {
			return SubmissionResult{}, err
		}
		bestScore = sql.NullInt64{Int64: int64(*payload.Score), Valid: true}
	}

	_, err := tx.ExecContext(ctx, `
		UPDATE "GameRun"
		SET score = $2, submitted_at = $3, new_best = $4, best_at_submission = $5
		WHERE id = $1`, payload.RunID, *payload.Score, acceptedAt, newBest, bestScore.Int64)
	if err != nil {
		return SubmissionResult{}, err
	}
	return SubmissionResult{
		Status:    "accepted",
		RunID:     payload.RunID,
		Score:     *payload.Score,
		BestScore: int32(bestScore.Int64),
		NewBest:   newBest,
	}, nil
}

func recordSubmission(ctx context.Context, tx *sql.Tx, uid string, payload ScorePayload, outcome string) error {
	var runID, score interface{}
	if payload.RunID != "" {
		runID = payload.RunID
	}
	if payload.Score != nil {
		score = *payload.Score
	}
	_, err := tx.ExecContext(ctx, `
		INSERT INTO "SubmissionAttempt"(uid, run_id, score, outcome)
		VALUES($1, $2, $3, $4)`, uid, runID, score, outcome)
	return err
}

func rejectSubmission(c *gin.Context, tx *sql.Tx, uid string, payload ScorePayload, status int, reason string) {
	// Rejections are committed so they count toward rate limits and remain auditable.
	if err := recordSubmission(c.Request.Context(), tx, uid, payload, reason); err != nil {
		respondInternalError(c, err)
		return
	}
	if err := tx.Commit(); err != nil {
		respondInternalError(c, err)
		return
	}
	respondError(c, status, reason)
}
