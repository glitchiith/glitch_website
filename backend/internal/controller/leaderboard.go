package controller

import (
	"net/http"
	"sort"
	"time"

	"github.com/Panshul-Jindal/glitch_website/backend/config"
	"github.com/Panshul-Jindal/glitch_website/backend/internal/schema"
	"github.com/gin-gonic/gin"
)

type RankedPlayer struct {
	Rank       int       `json:"rank"`
	Name       string    `json:"name"`
	HostelID   int       `json:"hostel_id"`
	HostelName string    `json:"hostel_name"`
	Score      int64     `json:"score"`
	AchievedAt time.Time `json:"achieved_at"`
}

func GetPlayerLeaderboard(c *gin.Context) {
	rows, err := config.DB.QueryContext(c.Request.Context(), `
		SELECT name, hostel_id, best_score, best_at
		FROM "CompetitionPlayer"
		WHERE best_score IS NOT NULL AND hostel_id IS NOT NULL
		ORDER BY best_score DESC, best_at ASC, uid ASC
		LIMIT 20`)
	if err != nil {
		respondInternalError(c, err)
		return
	}
	defer rows.Close()

	players := []RankedPlayer{}
	for rows.Next() {
		var player RankedPlayer
		if err := rows.Scan(&player.Name, &player.HostelID, &player.Score, &player.AchievedAt); err != nil {
			respondInternalError(c, err)
			return
		}
		player.Rank = len(players) + 1
		player.HostelName = schema.HOSTELS[player.HostelID]
		players = append(players, player)
	}
	if err := rows.Err(); err != nil {
		respondInternalError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"players": players})
}

func GetHostelLeaderboard(c *gin.Context) {
	rows, err := config.DB.QueryContext(c.Request.Context(), `
		WITH ranked AS (
			SELECT hostel_id, best_score,
				row_number() OVER (
					PARTITION BY hostel_id
					ORDER BY best_score DESC, best_at, uid
				) AS position
			FROM "CompetitionPlayer"
			WHERE hostel_id IS NOT NULL AND best_score IS NOT NULL
		)
		SELECT hostel_id, sum(best_score), count(*)
		FROM ranked
		WHERE position <= 50
		GROUP BY hostel_id`)
	if err != nil {
		respondInternalError(c, err)
		return
	}
	defer rows.Close()

	scores := map[int]schema.HostelScore{}
	for id, name := range schema.HOSTELS {
		scores[id] = schema.HostelScore{HostelID: id, HostelName: name}
	}
	for rows.Next() {
		var id, count int
		var total float64
		if err := rows.Scan(&id, &total, &count); err != nil {
			respondInternalError(c, err)
			return
		}
		hostel, ok := scores[id]
		if !ok {
			continue
		}
		hostel.TotalScore = total
		hostel.ParticipantCount = count
		scores[id] = hostel
	}
	if err := rows.Err(); err != nil {
		respondInternalError(c, err)
		return
	}

	result := make([]schema.HostelScore, 0, len(scores))
	for _, hostel := range scores {
		result = append(result, hostel)
	}
	sort.Slice(result, func(i, j int) bool {
		if result[i].TotalScore == result[j].TotalScore {
			return result[i].HostelID < result[j].HostelID
		}
		return result[i].TotalScore > result[j].TotalScore
	})
	for i := range result {
		result[i].Rank = i + 1
		if i > 0 && result[i].TotalScore == result[i-1].TotalScore {
			result[i].Rank = result[i-1].Rank
		}
		if result[0].TotalScore > 0 {
			result[i].ScorePercentage = 100 * result[i].TotalScore / result[0].TotalScore
		}
	}
	c.JSON(http.StatusOK, gin.H{"leaderboard": result, "top_k": 50})
}
