package controller

import (
    "net/http"
    "sort"

    "github.com/Panshul-Jindal/glitch_website/backend/internal/db"
    "github.com/Panshul-Jindal/glitch_website/backend/internal/schema"
    "github.com/gin-gonic/gin"
)

func GetHostelLeaderboard(c *gin.Context) {
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

    // Initialize all hostels with zeroes
    for id, name := range schema.HOSTELS {
        hostelScores[id] = &schema.HostelScore{
            Rank:             0,
            HostelID:         id,
            HostelName:       name,
            TotalScore:       0,
            ParticipantCount: 0,
            ScorePercentage:  0,
        }
    }

    // Weight factors (equal weight for now)
    w1, w2, w3, w4, w5 := 0.2, 0.2, 0.2, 0.2, 0.2

    // Accumulate scores per hostel
    for _, user := range userScores {
        if user.HostelID == nil {
            continue
        }

        h := *user.HostelID
        if hostelScores[h] == nil {
            continue // skip invalid hostel IDs
        }

        weightedTotal := float64(user.BestScore1)*w1 +
            float64(user.BestScore2)*w2 +
            float64(user.BestScore3)*w3 +
            float64(user.BestScore4)*w4 +
            float64(user.BestScore5)*w5

        hostelScores[h].TotalScore += weightedTotal
        hostelScores[h].ParticipantCount++
    }

    // Convert map to slice
    leaderboard := make([]schema.HostelScore, 0, len(hostelScores))
    for _, score := range hostelScores {
        leaderboard = append(leaderboard, *score)
    }

    // Sort by total score (descending)
    sort.Slice(leaderboard, func(i, j int) bool {
        return leaderboard[i].TotalScore > leaderboard[j].TotalScore
    })

    // Add ranks and score percentage
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
    })
}
