package controller

import (
	"database/sql"
	"errors"
	"net/http"

	"github.com/Panshul-Jindal/glitch_website/backend/config"
	"github.com/gin-gonic/gin"
)

var errHostelRequired = errors.New("hostel required")

// Locking the player serializes rate checks and score updates for that player.
func beginPlayerTransaction(c *gin.Context) (*sql.Tx, sql.NullInt64, error) {
	tx, err := config.DB.BeginTx(c.Request.Context(), nil)
	if err != nil {
		return nil, sql.NullInt64{}, err
	}

	var hostelID, bestScore sql.NullInt64
	err = tx.QueryRowContext(c.Request.Context(), `
		SELECT hostel_id, best_score
		FROM "CompetitionPlayer"
		WHERE uid = $1
		FOR UPDATE`, c.GetString("uid"),
	).Scan(&hostelID, &bestScore)
	if err != nil {
		_ = tx.Rollback()
		return nil, bestScore, err
	}
	if !hostelID.Valid {
		_ = tx.Rollback()
		return nil, bestScore, errHostelRequired
	}
	return tx, bestScore, nil
}

func respondTransactionError(c *gin.Context, err error) {
	if errors.Is(err, sql.ErrNoRows) || errors.Is(err, errHostelRequired) {
		respondError(c, http.StatusConflict, "Register and confirm your hostel first.")
		return
	}
	respondInternalError(c, err)
}
