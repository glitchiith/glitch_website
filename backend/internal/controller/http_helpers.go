package controller

import (
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

func respondError(c *gin.Context, status int, message string) {
	c.AbortWithStatusJSON(status, gin.H{"error": message})
}

func respondInternalError(c *gin.Context, err error) {
	_ = c.Error(err)
	respondError(c, http.StatusInternalServerError, "Service unavailable. Please retry.")
}

func positiveEnv(key string, fallback int) int {
	value, err := strconv.Atoi(os.Getenv(key))
	if err != nil || value < 1 {
		return fallback
	}
	return value
}
