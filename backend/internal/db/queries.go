package db

import (
    "database/sql"

    "github.com/Panshul-Jindal/glitch_website/backend/internal/config"
    "github.com/Panshul-Jindal/glitch_website/backend/internal/schema"
)

func GetAllUserScores() ([]schema.UserScore, error) {
    query := `
        SELECT uid, name, hostel_id, 
               "bestScore1", "bestScore2", "bestScore3", 
               "bestScore4", "bestScore5"
        FROM "User"
    `

    rows, err := config.DB.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var users []schema.UserScore

    for rows.Next() {
        var u schema.UserScore
        err := rows.Scan(
            &u.UID,
            &u.Name,
            &u.HostelID,
            &u.BestScore1,
            &u.BestScore2,
            &u.BestScore3,
            &u.BestScore4,
            &u.BestScore5,
        )
        if err != nil {
            return nil, err
        }

        u.TotalScore = u.BestScore1 + u.BestScore2 + u.BestScore3 + u.BestScore4 + u.BestScore5
        users = append(users, u)
    }

    return users, nil
}

func GetStudentHostelByEmail(email string) (*int, error) {
    var hostelID sql.NullInt32
    err := config.DB.QueryRow(
        `SELECT hostel_id FROM "StudentHostels" WHERE email = $1`,
        email,
    ).Scan(&hostelID)

    if err == sql.ErrNoRows {
        return nil, nil
    }
    if err != nil {
        return nil, err
    }

    if hostelID.Valid {
        val := int(hostelID.Int32)
        return &val, nil
    }

    return nil, nil
}

func UserExists(uid string) (bool, error) {
    var exists bool
    err := config.DB.QueryRow(
        `SELECT EXISTS(SELECT 1 FROM "User" WHERE uid = $1)`,
        uid,
    ).Scan(&exists)
    return exists, err
}

func CreateUser(uid string, name *string, hostelID *int) error {
    _, err := config.DB.Exec(
        `INSERT INTO "User" (uid, name, hostel_id, "bestScore1", "bestScore2", "bestScore3", "bestScore4", "bestScore5")
         VALUES ($1, $2, $3, 0, 0, 0, 0, 0)`,
        uid, name, hostelID,
    )
    return err
}

func GetUserBestScore(uid string, gameID int) (int, error) {
    var score int
    scoreColumn := GetScoreColumn(gameID)
    
    query := `SELECT "` + scoreColumn + `" FROM "User" WHERE uid = $1`
    err := config.DB.QueryRow(query, uid).Scan(&score)
    
    return score, err
}

func UpdateUserScore(uid string, gameID int, score int) error {
    scoreColumn := GetScoreColumn(gameID)
    
    query := `UPDATE "User" SET "` + scoreColumn + `" = $1 WHERE uid = $2`
    _, err := config.DB.Exec(query, score, uid)
    
    return err
}

func GetScoreColumn(gameID int) string {
    return "bestScore" + string(rune(gameID + '0'))
}