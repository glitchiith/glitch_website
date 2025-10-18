package controller

import (
    "net/http"

    "github.com/Panshul-Jindal/glitch_website/backend/internal/db"
    "github.com/gin-gonic/gin"
)

func GetScores(c *gin.Context) {
    users, err := db.GetAllUserScores()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "message": "Failed to fetch user scores",
            "error":   err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "scores":  users,
    })
}

func Greet(c *gin.Context){
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Hello World ~~~~~~!!!!!!!!!:",
	})
}
