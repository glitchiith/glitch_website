package db

import (
    "github.com/Panshul-Jindal/glitch_website/backend/internal/schema"
	    "github.com/Panshul-Jindal/glitch_website/backend/internal/config"
)

func GetUserByUID(uid string) (*schema.User, error) {
    var user schema.User
    
    err := config.DB.QueryRow(
        `SELECT id, uid, name, hostel_id, "bestScore1", "bestScore2", "bestScore3", "bestScore4", "bestScore5"
         FROM "User" WHERE uid = $1`,
        uid,
    ).Scan(
        &user.ID,
        &user.UID,
        &user.Name,
        &user.HostelID,
        &user.BestScore1,
        &user.BestScore2,
        &user.BestScore3,
        &user.BestScore4,
        &user.BestScore5,
    )

    if err != nil {
        return nil, err
    }

    return &user, nil
}