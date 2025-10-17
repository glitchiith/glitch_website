package router

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/LambdaIITH/go-backend/internal/controller"
	"github.com/LambdaIITH/go-backend/internal/middlewares"
)

func home(c *gin.Context) {
	HTMLString := "<h1>Hello from <a href='https://iith.dev' target='_blank'>Lambda IITH</a></h1>"
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write([]byte(HTMLString))
}

func SetupRoutes(router *gin.Engine) {
	router.GET("/", home)

	router.GET("/userId", middlewares.AuthMiddleware(), controller.GetUserId)
}
