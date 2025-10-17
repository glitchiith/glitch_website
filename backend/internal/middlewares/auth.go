package middlewares

import (
    "context"
    "net/http"
    "strings"

    "github.com/Panshul-Jindal/glitch_website/backend/config"
    "github.com/gin-gonic/gin"
)

func FirebaseAuth() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")

        if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Firebase token"})
            c.Abort()
            return
        }

        idToken := strings.TrimPrefix(authHeader, "Bearer ")

        client, err := config.FirebaseApp.Auth(context.Background())
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get auth client"})
            c.Abort()
            return
        }

        token, err := client.VerifyIDToken(context.Background(), idToken)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        c.Set("uid", token.UID)
        c.Next()
    }
}