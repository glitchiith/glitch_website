package controller

import (
    "net/http"
    "sort"

    "github.com/Panshul-Jindal/glitch_website/backend/internal/db"
    "github.com/Panshul-Jindal/glitch_website/backend/internal/schema"
    "github.com/gin-gonic/gin"
)

func GetHostelLeaderboard(c *gin.Context) {
    const topK = 50 // Change this value anytime

    // Fetch all user scores
    userScores, err := db.GetAllUserScores()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "message": "Failed to fetch user scores",
            "error":   err.Error(),
        })
        return
    }

    // Initialize hostel scores map
    hostelScores := make(map[int]*schema.HostelScore)
    hostelUserScores := make(map[int][]float64)

    for id, name := range schema.HOSTELS {
        hostelScores[id] = &schema.HostelScore{
            Rank:             0,
            HostelID:         id,
            HostelName:       name,
            TotalScore:       0,
            ParticipantCount: 0,
            ScorePercentage:  0,
        }
        hostelUserScores[id] = []float64{}
    }

    // Weight factors
    denom := (1.0 / 3000) + (1.0 / 150) + (1.0 / 200000) + (1.0 / 500) + (1.0 / 250)
    w1 := (1.0 / 3000) / denom
    w2 := (1.0 / 500) / denom
    w3 := (1.0 / 250) / denom
    w4 := (1.0 / 150) / denom
    w5 := (1.0 / 200000) / denom

    // Collect each user's weighted score per hostel
    for _, user := range userScores {
        if user.HostelID == nil {
            continue
        }
        h := *user.HostelID
        if _, ok := hostelScores[h]; !ok {
            continue
        }

        weightedTotal := float64(user.BestScore1)*w1 +
            float64(user.BestScore2)*w2 +
            float64(user.BestScore3)*w3 +
            float64(user.BestScore4)*w4 +
            float64(user.BestScore5)*w5

        hostelUserScores[h] = append(hostelUserScores[h], weightedTotal)
    }

    // Compute total per hostel using topK scores
    for h, scores := range hostelUserScores {
        sort.Slice(scores, func(i, j int) bool { return scores[i] > scores[j] })

        if len(scores) > topK {
            scores = scores[:topK]
        }

        total := 0.0
        for _, s := range scores {
            total += s
        }

        hostelScores[h].TotalScore = total
        hostelScores[h].ParticipantCount = len(scores)
    }

    // Convert map to slice and sort
    leaderboard := make([]schema.HostelScore, 0, len(hostelScores))
    for _, score := range hostelScores {
        leaderboard = append(leaderboard, *score)
    }
    sort.Slice(leaderboard, func(i, j int) bool {
        return leaderboard[i].TotalScore > leaderboard[j].TotalScore
    })

    topScore := 1.0
    if len(leaderboard) > 0 && leaderboard[0].TotalScore > 0 {
        topScore = leaderboard[0].TotalScore
    }

    for i := range leaderboard {
        leaderboard[i].Rank = i + 1
        leaderboard[i].ScorePercentage = (leaderboard[i].TotalScore / topScore) * 100
    }

    c.JSON(http.StatusOK, gin.H{
        "success":     true,
        "leaderboard": leaderboard,
        "top_k":       topK,
    })
}
