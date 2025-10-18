package middlewares

import (
	"context"
	"net/http"
	"strings"

	"github.com/Panshul-Jindal/glitch_website/backend/config"
	"github.com/gin-gonic/gin"
)

// FirebaseAuth verifies Firebase ID token from Authorization header or cookie
func FirebaseAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Step 1: Try Authorization header first
		authHeader := c.GetHeader("Authorization")
		var idToken string

		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			idToken = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			// Step 2: Try cookies if header missing
			cookie, err := c.Cookie("authToken")
			if err == nil && cookie != "" {
				idToken = cookie
			}
		}

		// Step 3: Handle guest users
		if idToken == "" {
			guestMode, _ := c.Cookie("guestMode")
			if guestMode == "true" {
				c.Next()
				return
			}
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Firebase token"})
			c.Abort()
			return
		}

		// Step 4: Verify Firebase token
		client, err := config.FirebaseApp.Auth(context.Background())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get Firebase Auth client"})
			c.Abort()
			return
		}

		token, err := client.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Step 5: Attach UID to context for downstream handlers
		c.Set("uid", token.UID)
		c.Next()
	}
}
