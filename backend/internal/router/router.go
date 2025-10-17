package router

import (
    "github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"OPTIONS", "GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"*"}
	config.AllowHeaders = []string{"Content-Type"}
	config.AllowHeaders = []string{"X-Requested-With", "Content-Type", "Accept"}
	config.AllowCredentials = false
	r.Use(cors.New(config))
    // CORS middleware
    

  
    // Setup routes
    SetupRoutes(r)

    return r
}
  
