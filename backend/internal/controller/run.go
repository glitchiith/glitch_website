package controller

import (
	"encoding/base64"
	"math/big"
	"net/http"
	"os"
	"time"

	"github.com/Panshul-Jindal/glitch_website/backend/internal/helpers"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func StartRun(c *gin.Context) {
	if os.Getenv("GAME_ENABLED") != "true" {
		respondError(c, http.StatusServiceUnavailable, "The game is temporarily unavailable.")
		return
	}

	// A run is issued only when score encryption is configured correctly.
	key, err := helpers.ParsePrivateKey(os.Getenv("PRIVATE_KEY"))
	if err != nil {
		respondError(c, http.StatusServiceUnavailable, "Score encryption is not configured.")
		return
	}

	tx, _, err := beginPlayerTransaction(c)
	if err != nil {
		respondTransactionError(c, err)
		return
	}
	defer tx.Rollback()

	var recentRuns int
	err = tx.QueryRowContext(c.Request.Context(), `
		SELECT count(*)
		FROM "GameRun"
		WHERE uid = $1 AND started_at > clock_timestamp() - interval '1 minute'`,
		c.GetString("uid"),
	).Scan(&recentRuns)
	if err != nil {
		respondInternalError(c, err)
		return
	}
	if recentRuns >= positiveEnv("RUN_STARTS_PER_MINUTE", 30) {
		c.Header("Retry-After", "60")
		respondError(c, http.StatusTooManyRequests, "Too many run starts. Try again shortly.")
		return
	}

	runID := uuid.NewString()
	var expiresAt time.Time
	err = tx.QueryRowContext(c.Request.Context(), `
		INSERT INTO "GameRun"(id, uid, expires_at)
		VALUES($1, $2, clock_timestamp() + make_interval(secs => $3))
		RETURNING expires_at`,
		runID, c.GetString("uid"), positiveEnv("RUN_TTL_SECONDS", 86400),
	).Scan(&expiresAt)
	if err != nil {
		respondInternalError(c, err)
		return
	}
	if err := tx.Commit(); err != nil {
		respondInternalError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"runId":     runID,
		"expiresAt": expiresAt,
		"modulus":   base64.StdEncoding.EncodeToString(key.N.Bytes()),
		"exponent":  base64.StdEncoding.EncodeToString(big.NewInt(int64(key.E)).Bytes()),
	})
}
