package schema

type User struct {
    ID         int64   `json:"id"`
    UID        string  `json:"uid"`
    Name       *string `json:"name"`
    HostelID   *int    `json:"hostel_id"`
    BestScore1 int     `json:"bestScore1"`
    BestScore2 int     `json:"bestScore2"`
    BestScore3 int     `json:"bestScore3"`
    BestScore4 int     `json:"bestScore4"`
    BestScore5 int     `json:"bestScore5"`
}

type UserScore struct {
    UID        string  `json:"uid"`
    Name       *string `json:"name"`
    HostelID   *int    `json:"hostel_id"`
    BestScore1 int     `json:"bestScore1"`
    BestScore2 int     `json:"bestScore2"`
    BestScore3 int     `json:"bestScore3"`
    BestScore4 int     `json:"bestScore4"`
    BestScore5 int     `json:"bestScore5"`
    TotalScore int     `json:"totalScore"`
}

type StudentHostel struct {
    ID       int64  `json:"id"`
    Email    string `json:"email"`
    HostelID int    `json:"hostel_id"`
}

type RegisterUserRequest struct {
    Email string `json:"email" binding:"required"`
    Name  string `json:"name"`
}

type SubmitScoreRequest struct {
    Data string `json:"data" binding:"required"`
}

type UIDPayload struct {
    UID string `json:"uid"`
}