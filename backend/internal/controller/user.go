package controller

import (
    "context"
    "encoding/json"
    "fmt"
    "net/http"
    "strconv"
    "strings"

    "github.com/Panshul-Jindal/glitch_website/backend/config"
    "github.com/Panshul-Jindal/glitch_website/backend/internal/db"
    "github.com/Panshul-Jindal/glitch_website/backend/internal/helpers"
    "github.com/Panshul-Jindal/glitch_website/backend/internal/schema"
    "github.com/gin-gonic/gin"
	"os"
)

var GamesInverse = map[string]int{
    "PG": 1,
    "GM": 2,
    "TDS": 3,
    "MC": 4,
    "RYM": 5,
}

func GetUID(c *gin.Context) {
    uid, exists := c.Get("uid")
    
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "UID not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"uid": uid})
}

func RegisterUser(c *gin.Context) {
    uid, _ := c.Get("uid")
    uidStr := uid.(string)

    var req schema.RegisterUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Missing email"})
        return
    }

    // Check if user already exists
    exists, err := db.UserExists(uidStr)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        return
    }

    if exists {
        c.JSON(http.StatusOK, gin.H{"message": "User already exists"})
        return
    }

    // Find hostel_id via StudentHostels table
    normalizedEmail := helpers.NormalizeEmail(req.Email)
    hostelID, err := db.GetStudentHostelByEmail(normalizedEmail)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch hostel"})
        return
    }

    // Prepare name
    var namePtr *string
    if req.Name != "" {
        namePtr = &req.Name
    }

    // Create user
    if err := db.CreateUser(uidStr, namePtr, hostelID); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

func SubmitScore(c *gin.Context) {
    uid, _ := c.Get("uid")
    uidStr := uid.(string)

    var req schema.SubmitScoreRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Missing data"})
        return
    }

    // Decrypt data
    privateKey := os.Getenv("PRIVATE_KEY")
    decryptedStr, err := helpers.DecryptRSA(req.Data, privateKey)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decrypt data"})
        return
    }

    fmt.Println("Decrypted string:", decryptedStr)

    // Parse GAMEID_UID_SCORE
    parts := strings.Split(decryptedStr, "_")
    if len(parts) < 3 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid decrypted data format"})
        return
    }

    gameIDStr := parts[0]
    scoreStr := parts[len(parts)-1]
    jsonPart := strings.Join(parts[1:len(parts)-1], "_")

    var uidPayload schema.UIDPayload
    if err := json.Unmarshal([]byte(jsonPart), &uidPayload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse UID JSON"})
        return
    }

    if uidPayload.UID != uidStr {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "UID mismatch"})
        return
    }

    gameID, ok := GamesInverse[gameIDStr]
    if !ok {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid game ID"})
        return
    }

    score, err := strconv.Atoi(scoreStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid score"})
        return
    }

    // Check if user exists, if not create
    userExists, err := db.UserExists(uidStr)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        return
    }

    if !userExists {
        // Get user from Firebase
        client, err := config.FirebaseApp.Auth(context.Background())
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get auth client"})
            return
        }

        firebaseUser, err := client.GetUser(context.Background(), uidStr)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user from Firebase"})
            return
        }

        email := firebaseUser.Email
        normalizedEmail := helpers.NormalizeEmail(email)

        hostelID, err := db.GetStudentHostelByEmail(normalizedEmail)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch hostel"})
            return
        }

        var namePtr *string
        if firebaseUser.DisplayName != "" {
            namePtr = &firebaseUser.DisplayName
        }

        if err := db.CreateUser(uidStr, namePtr, hostelID); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
            return
        }
    }

    // Get current score
    currentScore, err := db.GetUserBestScore(uidStr, gameID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch current score"})
        return
    }

    // Update score if better
    if score > currentScore {
        if err := db.UpdateUserScore(uidStr, gameID, score); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update score"})
            return
        }
    }

    c.JSON(http.StatusOK, gin.H{"message": "Score submitted successfully"})
}
