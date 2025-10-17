package schema

type HostelScore struct {
    Rank             int     `json:"rank"`
    HostelID         int     `json:"hostel_id"`
    HostelName       string  `json:"hostel_name"`
    TotalScore       float64 `json:"total_score"`
    ParticipantCount int     `json:"participant_count"`
    ScorePercentage  float64 `json:"score_percentage"`
}