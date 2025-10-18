package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"https://www.glitchiith.co.in", "https://glitchiith.co.in", "http://localhost", "http://127.0.0.1"}
	config.AllowMethods = []string{"OPTIONS", "GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"*"}
	config.AllowCredentials = true
	r.Use(cors.New(config))
	// CORS middleware

	// Setup routes
	SetupRoutes(r)

	return r
}
