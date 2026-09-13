package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"os"
	"strings"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"https://www.glitchiith.co.in", "https://glitchiith.co.in", "http://localhost:3001", "http://127.0.0.1:3000"}
	config.AllowOrigins = append(config.AllowOrigins, "http://localhost:3000", "http://127.0.0.1:3001")
	if origins := os.Getenv("ALLOWED_ORIGINS"); origins != "" {
		config.AllowOrigins = strings.Split(origins, ",")
		for i := range config.AllowOrigins {
			config.AllowOrigins[i] = strings.TrimSpace(config.AllowOrigins[i])
		}
	}
	// config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"OPTIONS", "GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"ORIGIN", "CONTENT-TYPE", "AUTHORIZATION"}
	config.AllowCredentials = true
	r.Use(cors.New(config))
	// CORS middleware

	// Setup routes
	SetupRoutes(r)

	return r
}
