package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"OPTIONS", "GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"*"}
	config.AllowCredentials = false
	r.Use(cors.New(config))
	// CORS middleware

	// Setup routes
	SetupRoutes(r)

	return r
}
