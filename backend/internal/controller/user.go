package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/LambdaIITH/go-backend/internal/db"
)

func GetUserId(c *gin.Context) {
	// get email stored in cookie via context
	// read AuthMiddleware.go line 14
	email, _ := c.Get("email")
	UserId := db.GetUserId(c.Request.Context(), email.(string))

	c.JSON(http.StatusOK, gin.H{"message": UserId})
}
